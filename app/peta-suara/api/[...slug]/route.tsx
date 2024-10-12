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
    const result = await Get(adminLogin.appId, params.slug);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "refferal") {
    const result = await Refferal(adminLogin.appId, params.slug);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kota") {
    const result = await LoadKota(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kecamatan") {
    const result = await loadKecamatan(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kelurahan") {
    const result = await loadKelurahan(adminLogin, params.slug[1]);
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

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "delete") {
    const result = await Delete(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Get(appId: Number, slug: String[]) {
  const result = await prisma.user.findMany({
    where: {
      appId: Number(appId),
      jabatan: String(slug[1]) == "all" ? undefined : String(slug[1]),
      kabId: String(slug[2]) == "all-kabupaten" ? undefined : Number(slug[2]),
      kecId: String(slug[3]) == "all-kecamatan" ? undefined : Number(slug[3]),
      kelId: String(slug[4]) == "all-kelurahan" ? undefined : Number(slug[4]),
    },
    include: {
      kab: true,
      kec: true,
      kel: true,
      refferal: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return result;
}

async function Refferal(appId: Number, slug: String[]) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(slug[1]),
    },
    select: {
      nama: true,
    },
  });
  const result = await prisma.user.findMany({
    where: {
      refId: Number(slug[1]),
    },
    include: {
      kab: true,
      kec: true,
      kel: true,
      refferal: true,
    },
  });
  return {
    data: result,
    user: user?.nama,
  };
}

async function LoadKota(admin: AdminLogin) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(admin.provId) },
  });
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${kode?.provinsi} ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kabupaten",
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

async function loadKecamatan(admin: AdminLogin, kabId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kabId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 8
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kecamatan",
    nama: "Semua Kecamatan",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadKelurahan(admin: AdminLogin, kecId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kecId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 13
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    AND kecamatan = ${kode?.kecamatan} 
    ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kelurahan",
    nama: "Semua Kelurahan / Desa",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "update") {
    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        jabatan: String(data.get("jabatan")),
        refId: data.get("refId") == "" ? null : Number(data.get("refId")),
      },
    });
  }
  return { error: false, message: "Update jabatan sukses" };
}

async function Delete(data: any) {
  const result = await prisma.user.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
