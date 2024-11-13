import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { User } from "next-auth";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const adminLogin = token as unknown as User;

  if (params.slug[0] === "data_paslon") {
    const result = await DataPaslon(adminLogin);
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

  const adminLogin = token as unknown as User;

  const data = await request.formData();

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

async function DataPaslon(admin: User) {
  const paslon = await prisma.paslon.findMany({
    where: { appId: Number(admin.appId) },
  });
  return paslon;
}

async function Post(data: any, admin: User) {
  if (String(data.get("mode")) == "add") {
    await prisma.paslon.create({
      data: {
        appId: Number(admin.appId),
        noUrut: Number(data.get("noUrut")),
        calon: String(data.get("calon")),
        wakil: String(data.get("wakil")),
      },
    });
    return { error: false, message: "Data paslon berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.paslon.update({
      where: { id: Number(data.get("id")) },
      data: {
        noUrut: Number(data.get("noUrut")),
        calon: String(data.get("calon")),
        wakil: String(data.get("wakil")),
      },
    });
    return { error: false, message: "Data paslon berhasil diperbarui" };
  } else {
    await prisma.paslon.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data paslon berhasil dihapus" };
  }
}
