import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Tps } from "@prisma/client";
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

  if (params.slug[0] === "data_desa") {
    const result = await DataDesa(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false);
};

async function DataDesa(admin: AdminLogin) {
  let data;
  if (admin.kotaId != 0) {
    const kota = await prisma.wilayah.findUnique({
      where: {
        id: Number(admin.kotaId),
      },
    });

    data = await prisma.wilayah.findMany({
      where: {
        kabupaten: kota?.nama,
        kecamatan: {
          not: "null",
        },
        kelurahan: {
          not: "null",
        },
      },
      include: {
        tpsKel: true,
      },
      orderBy: [
        {
          kabupaten: "asc",
        },
        {
          kecamatan: "asc",
        },
        {
          nama: "asc",
        },
      ],
    });
  } else {
    const prov = await prisma.wilayah.findUnique({
      where: {
        id: Number(admin.provId),
      },
    });

    data = await prisma.wilayah.findMany({
      where: {
        provinsi: String(prov?.nama),
        kabupaten: {
          not: "null",
        },
        kecamatan: {
          not: "null",
        },
        kelurahan: {
          not: "null",
        },
      },
      include: {
        tpsKel: true,
      },
      orderBy: [
        {
          kabupaten: "asc",
        },
        {
          kecamatan: "asc",
        },
        {
          nama: "asc",
        },
      ],
    });
  }

  return data;
}
