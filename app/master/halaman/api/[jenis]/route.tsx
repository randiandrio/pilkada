import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { User } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { jenis: string } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as User;

  const result = await Get(adminLogin.appId, params.jenis);
  return NextResponse.json(result, { status: 200 });
};

export const PATCH = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as User;

  const data = await request.formData();

  const result = await Post(data, adminLogin.appId);
  return NextResponse.json(result, { status: 200 });
};

async function Get(appId: Number, jenis: String) {
  const result = await prisma.halaman.findFirst({
    where: {
      appId: Number(appId),
      nama: String(jenis),
    },
  });
  return result;
}

async function Post(data: any, appId: Number) {
  await prisma.halaman.updateMany({
    where: {
      appId: Number(appId),
      nama: data.get("halaman"),
    },
    data: {
      deskripsi: String(data.get("deskripsi")),
    },
  });

  return { error: false, message: "Perubahan telah disimpan" };
}
