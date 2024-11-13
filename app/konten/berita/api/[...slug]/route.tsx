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
  const berita = await prisma.berita.findMany({
    where: { appId: Number(admin.appId) },
    orderBy: {
      id: "desc",
    },
  });
  return berita;
}

async function Post(data: any, admin: User) {
  if (String(data.get("mode")) == "add") {
    console.log(data);
    await prisma.berita.create({
      data: {
        appId: Number(admin.appId),
        tanggal: String(data.get("tanggal")),
        judul: String(data.get("judul")),
        deskripsi: String(data.get("deskripsi")),
        sumber: String(data.get("sumber")),
        gambar: String(data.get("gambar")),
      },
    });
    return { error: false, message: "Data berita berhasil ditambahkan" };
  } else if (String(data.get("mode")) == "update") {
    if (String(data.get("newGambar")) == "1") {
      await prisma.berita.update({
        where: { id: Number(data.get("id")) },
        data: {
          tanggal: String(data.get("tanggal")),
          judul: String(data.get("judul")),
          deskripsi: String(data.get("deskripsi")),
          sumber: String(data.get("sumber")),
          gambar: String(data.get("gambar")),
        },
      });
    } else {
      await prisma.berita.update({
        where: { id: Number(data.get("id")) },
        data: {
          tanggal: String(data.get("tanggal")),
          judul: String(data.get("judul")),
          deskripsi: String(data.get("deskripsi")),
          sumber: String(data.get("sumber")),
        },
      });
    }
    return { error: false, message: "Data berita berhasil diperbarui" };
  } else {
    await prisma.berita.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data berita berhasil dihapus" };
  }
}
