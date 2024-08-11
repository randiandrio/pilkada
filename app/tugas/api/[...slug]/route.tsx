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

  if (params.slug[0] === "data") {
    const result = await Data(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "cari_user") {
    const result = await CariUser(adminLogin, String(params.slug[1]));
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

  if (params.slug[0] == "post") {
    const result = await Post(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

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

async function Data(admin: AdminLogin) {
  const tugas = await prisma.tugas.findMany({
    where: { appId: Number(admin.appId) },
    orderBy: { id: "desc" },
    include: { user: true },
  });
  return tugas;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("mode")) == "add") {
    await prisma.tugas.create({
      data: {
        appId: Number(admin.appId),
        userId: Number(data.get("userId")),
        judul: String(data.get("judul")),
        deskripsi: String(data.get("deskripsi")),
        jumlah: Number(data.get("jumlah")),
        deadline: String(data.get("deadline")),
      },
    });
    return { error: false, message: "Data tugas berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    await prisma.tugas.update({
      where: { id: Number(data.get("id")) },
      data: {
        userId: Number(data.get("userId")),
        judul: String(data.get("judul")),
        deskripsi: String(data.get("deskripsi")),
        jumlah: Number(data.get("jumlah")),
        deadline: String(data.get("deadline")),
      },
    });
    return { error: false, message: "Data tugas berhasil diperbarui" };
  } else {
    await prisma.tugas.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data tugas berhasil dihapus" };
  }
}
