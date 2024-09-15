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

  if (params.slug[0] === "simpatisan-wilayah") {
    const result = await SimpatisanWilayah(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

async function SimpatisanWilayah(admin: AdminLogin, wilayah: String) {
  let result;

  if (wilayah == "all") {
    let wilayahId = admin.provId;
    if (admin.kotaId != 0) {
      wilayahId = admin.kotaId;
    }
    const kode = await prisma.wilayah.findUnique({
      where: { id: Number(wilayahId) },
    });

    if (kode?.kode.length == 2) {
      result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 5
        AND provinsi = ${kode?.provinsi} 
        ORDER BY nama DESC`;
    } else {
      result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 8
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        ORDER BY nama DESC`;
    }
    return result;
  }

  const kode = await prisma.wilayah.findFirst({
    where: { nama: String(wilayah) },
  });

  if (kode?.kode.length == 5) {
    result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 8
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        ORDER BY nama DESC`;
  }

  if (kode?.kode.length == 8) {
    result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 13
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        AND kecamatan = ${kode?.kecamatan} 
        ORDER BY nama DESC`;
  }

  return result;
}
