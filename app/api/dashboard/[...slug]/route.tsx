import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Wilayah } from "@prisma/client";
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
  let result: Wilayah[] = [];

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

  let x = [];
  let max = 0;
  for (let i = 0; i < result.length; i++) {
    const kode = await prisma.wilayah.findUnique({
      where: {
        id: Number(result[i].id),
      },
    });
    let j = 0;
    if (kode?.kode.length == 5) {
      const u = await prisma.user.aggregate({
        where: {
          kabId: Number(result[i].id),
        },
        _count: {
          id: true,
        },
      });
      j = Number(u._count.id);
    }
    if (kode?.kode.length == 8) {
      const u = await prisma.user.aggregate({
        where: {
          kecId: Number(result[i].id),
        },
        _count: {
          id: true,
        },
      });

      j = Number(u._count.id);
    }

    max = j > max ? j : max;
    x.push({
      nama: result[i].nama,
      jumlah: j,
    });
  }

  return {
    datas: x,
    max: max,
  };
}
