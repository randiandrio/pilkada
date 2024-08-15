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
    const result = await Data(adminLogin, params.slug[1]);
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

async function Data(admin: AdminLogin, tingkat: String) {
  let data;
  if (tingkat == "Provinsi") {
    data = await prisma.wilayah.findMany({
      where: {
        id: Number(admin.provId),
      },
      include: {
        koordinator: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  return data;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("mode")) != "delete") {
    const cek = await prisma.koordinator.findMany({
      where: {
        appId: Number(admin.appId),
        wilayahId: Number(data.get("wilayahId")),
      },
    });

    if (cek.length > 0) {
      await prisma.koordinator.updateMany({
        where: {
          appId: Number(admin.appId),
          wilayahId: Number(data.get("wilayahId")),
        },
        data: {
          userId: Number(data.get("userId")),
        },
      });
    } else {
      await prisma.koordinator.create({
        data: {
          appId: Number(admin.appId),
          wilayahId: Number(data.get("wilayahId")),
          userId: Number(data.get("userId")),
        },
      });
    }

    return { error: false, message: "Data tugas berhasil ditambahkan" };
  } else {
    await prisma.koordinator.delete({
      where: { id: Number(data.get("id")) },
    });
    return { error: false, message: "Data tugas berhasil dihapus" };
  }
}
