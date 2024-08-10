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

  if (params.slug[0] === "load_kota_tps") {
    const result = await GetKota(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_kec_tps") {
    const result = await GetKec(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_data_kota") {
    const result = await GetDataKota(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "reset") {
    const result = await Reset(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_data_kec") {
    const result = await GetDataKec(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "load_data_saksi") {
    const result = await GetDataSaksi(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }
  if (params.slug[0] === "cari_user") {
    const result = await CariUser(adminLogin, params.slug[1]);
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

  if (params.slug[0] == "generate_tps") {
    const result = await GenerateTps(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "post_saksi") {
    const result = await PostSaksi(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

async function GetKota(admin: AdminLogin) {
  const setting = await prisma.setting.findUnique({
    where: { appId: Number(admin.appId) },
    include: {
      prov: true,
      kota: true,
    },
  });

  let kotas: any[] = [];
  let kecs: any[] = [];

  if (setting?.kotaId == null) {
    kotas =
      await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${setting?.prov?.provinsi} ORDER BY nama ASC`;
  } else {
    kotas =
      await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE id = ${setting.kotaId}`;
    kecs =
      await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 8 AND kabupaten LIKE ${setting?.kota?.kabupaten} ORDER BY nama ASC`;
  }
  return {
    kota: kotas,
    kec: kecs,
  };
}

async function GetKec(admin: AdminLogin, kotaId: String) {
  const kota = await prisma.wilayah.findUnique({
    where: { id: Number(kotaId) },
  });

  const setting = await prisma.setting.findUnique({
    where: { appId: Number(admin.appId) },
    include: {
      prov: true,
    },
  });

  const kecs =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 8 AND kabupaten LIKE ${kota?.nama} AND provinsi LIKE ${setting?.prov?.nama} ORDER BY nama ASC`;

  return kecs;
}

async function GenerateTps(data: any, admin: AdminLogin) {
  const dt = JSON.parse(String(data.get("data")));

  await prisma.tps.deleteMany({
    where: {
      appId: Number(admin.appId),
      kotaId: dt[0].kotaId,
    },
  });

  let x: any[] = [];
  for (let i = 0; i < dt.length; i++) {
    for (let j = 0; j < dt[i].jumlah; j++) {
      x.push({
        appId: admin.appId,
        kotaId: dt[i].kotaId,
        kecId: dt[i].kecId,
        tpsNo: j + 1,
      });
    }
  }

  await prisma.tps.createMany({
    data: x,
  });

  return { error: false, message: "TPS berhasil di Generate" };
}

async function GetDataKota(admin: AdminLogin) {
  const kotas = await prisma.tps.groupBy({
    by: "kotaId",
    where: {
      appId: Number(admin.appId),
    },
    _count: {
      id: true,
    },
  });

  let arr = [];

  for (let i = 0; i < kotas.length; i++) {
    const nama = await prisma.wilayah.findUnique({
      where: { id: kotas[i].kotaId },
      select: { nama: true },
    });
    arr.push({
      kotaId: kotas[i].kotaId,
      namaKota: nama?.nama,
      jumlahTps: kotas[i]._count.id,
    });
  }

  arr.sort((a, b) =>
    String(a.namaKota).toLowerCase() > String(b.namaKota).toLowerCase() ? 1 : -1
  );

  return arr;
}

async function GetDataKec(admin: AdminLogin, kotaId: String) {
  const kota = await prisma.wilayah.findUnique({
    where: { id: Number(kotaId) },
  });

  const kecs = await prisma.tps.groupBy({
    by: "kecId",
    where: {
      appId: Number(admin.appId),
      kotaId: Number(kotaId),
    },
    _count: {
      id: true,
    },
  });

  let arr = [];

  for (let i = 0; i < kecs.length; i++) {
    const nama = await prisma.wilayah.findUnique({
      where: { id: kecs[i].kecId },
      select: { nama: true },
    });
    arr.push({
      kecId: kecs[i].kecId,
      namaKec: nama?.nama,
      jumlahTps: kecs[i]._count.id,
    });
  }

  arr.sort((a, b) =>
    String(a.namaKec).toLowerCase() > String(b.namaKec).toLowerCase() ? 1 : -1
  );

  return { data: arr, namaKota: kota?.nama };
}

async function GetDataSaksi(admin: AdminLogin, kecId: String) {
  const kec = await prisma.wilayah.findUnique({
    where: { id: Number(kecId) },
    select: {
      nama: true,
    },
  });

  const tps = await prisma.tps.findMany({
    where: { appId: Number(admin.appId), kecId: Number(kecId) },
    include: {
      saksi: true,
    },
    orderBy: {
      tpsNo: "asc",
    },
  });

  return { data: tps, namaKec: kec?.nama };
}

async function CariUser(admin: AdminLogin, cari: String) {
  const users = await prisma.user.findMany({
    where: {
      appId: Number(admin.appId),
      nama: {
        contains: String(cari),
        mode: "insensitive",
      },
    },
  });

  return users;
}

async function Reset(admin: AdminLogin) {
  await prisma.tps.deleteMany({
    where: { appId: Number(admin.appId) },
  });
  return true;
}

async function PostSaksi(data: any, admin: AdminLogin) {
  const dt = JSON.parse(String(data.get("data")));

  await prisma.tps.update({
    where: { id: Number(data.get("tpsId")) },
    data: {
      saksiId: Number(data.get("saksiId")),
    },
  });

  return { error: false, message: "Saksi berhasil di tambahkan" };
}
