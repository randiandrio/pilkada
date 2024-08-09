import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { AdminLogin } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  if (params.slug[0] === "get") {
    const result = await Get(adminLogin.appId);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_prov") {
    const result = await GetProv();
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_kota") {
    const result = await GetKota(Number(params.slug[1]));
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as AdminLogin;

  const data = await request.formData();

  if (params.slug[0] == "post_bgutama") {
    const result = await PostBgUtama(data, adminLogin.appId);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "post_bglogin") {
    const result = await PostBgLogin(data, adminLogin.appId);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "post_jumlah") {
    const result = await PostJumlah(data, adminLogin.appId);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "post_wilayah") {
    const result = await PostWilayah(data, adminLogin.appId);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Get(appId: Number) {
  const result = await prisma.setting.findUnique({
    where: {
      appId: Number(appId),
    },
    include: {
      prov: true,
      kota: true,
    },
  });
  return result;
}

async function GetProv() {
  const result =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 2 ORDER BY nama ASC`;
  return result;
}

async function GetKota(provId: Number) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(provId) },
  });
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${kode?.provinsi} ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: 0,
    nama: "Semua Kabupaten / Kota",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }

  return x;
}

async function PostBgUtama(data: any, appId: Number) {
  await prisma.setting.update({
    where: { appId: Number(appId) },
    data: {
      bgUtama: String(data.get("gambar")),
    },
  });

  return { error: false, message: "Background utama telah diganti" };
}

async function PostBgLogin(data: any, appId: Number) {
  await prisma.setting.update({
    where: { appId: Number(appId) },
    data: {
      bgLogin: String(data.get("gambar")),
    },
  });

  return { error: false, message: "Background login telah diganti" };
}

async function PostJumlah(data: any, appId: Number) {
  await prisma.setting.update({
    where: { appId: Number(appId) },
    data: {
      jumlahSuara: Number(data.get("jumlah")),
    },
  });

  return { error: false, message: "Jumlah suara dapil telah diganti" };
}

async function PostWilayah(data: any, appId: Number) {
  await prisma.setting.update({
    where: { appId: Number(appId) },
    data: {
      provId: data.get("provId") != 0 ? Number(data.get("provId")) : null,
      kotaId: data.get("kotaId") != 0 ? Number(data.get("kotaId")) : null,
    },
  });

  return { error: false, message: "Wilayah dapil telah diganti" };
}
