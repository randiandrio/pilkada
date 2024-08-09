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

  return NextResponse.json(false);
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
