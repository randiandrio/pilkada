import { decrypt } from "@/app/helper";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  // const x = await axios.get("https://file.kuantar.co.id/api/wilayah");

  // let w = [];

  // for (let i = 0; i < x.data.length; i++) {
  //   w.push({
  //     kode: String(x.data[i].kode),
  //     nama: String(x.data[i].nama),
  //     provinsi: String(x.data[i].provinsi),
  //     kabupaten: String(x.data[i].kabupaten),
  //     kecamatan: String(x.data[i].kecamatan),
  //     kelurahan: String(x.data[i].kelurahan),
  //   });
  // }

  // await prisma.wilayah.createMany({
  //   data: w,
  // });

  //   const wilayah = await prisma.$queryRaw`SELECT * FROM wilayah WHERE kode IN (
  //     SELECT kode
  //     FROM wilayah
  //     GROUP BY kode
  //     HAVING COUNT(*) > 1)`;

  return NextResponse.json(true, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const mapData = JSON.parse(decrypt(body.data));

  if (mapData.jenis_req === "cek_nik") {
    const result = await CekNik(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false, { status: 200 });
};

async function CekNik(data: any) {
  const users = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      nik: String(data.nik),
    },
  });

  if (users.length > 0) {
    return {
      error: true,
      message: "NIK terlah terdaftar",
    };
  }

  return {
    error: false,
    message: "Email belum terdaftar",
  };
}
