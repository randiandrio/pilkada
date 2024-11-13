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

  if (params.slug[0] === "data") {
    const result = await Data(adminLogin);
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

async function Data(admin: User) {
  const pengumuman = await prisma.pengumuman.findMany({
    where: { appId: Number(admin.appId) },
  });
  return pengumuman;
}

async function Post(data: any, admin: User) {
  if (String(data.get("mode")) == "add") {
    await prisma.pengumuman.create({
      data: {
        appId: Number(admin.appId),
        judul: String(data.get("judul")),
        deskripsi: String(data.get("deskripsi")),
      },
    });
    return { error: false, message: "Data pengumuman berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.pengumuman.update({
      where: { id: Number(data.get("id")) },
      data: {
        judul: String(data.get("judul")),
        deskripsi: String(data.get("deskripsi")),
      },
    });
    return { error: false, message: "Data pengumuman berhasil diperbarui" };
  } else {
    await prisma.pengumuman.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data pengumuman berhasil dihapus" };
  }
}
