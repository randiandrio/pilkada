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
