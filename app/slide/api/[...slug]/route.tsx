import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { AdminLogin } from "next-auth";
import moment from "moment";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  if (params.slug[0] === "get") {
    const result = await Get();
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

  if (params.slug[0] == "delete") {
    const result = await Delete(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function Get() {
  const result = await prisma.slide.findMany();
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "add") {
    await prisma.slide.create({
      data: {
        appId: Number(admin.appId),
        title: String(data.get("title")),
        gambar: String(data.get("gambar")),
        deskripsi: String(data.get("deskripsi")),
        isShow: Number(data.get("isShow")),
      },
    });
  } else {
    if (String(data.get("new")) == "1") {
      await prisma.slide.update({
        where: { id: Number(data.get("id")) },
        data: {
          title: String(data.get("title")),
          gambar: String(data.get("gambar")),
          deskripsi: String(data.get("deskripsi")),
          isShow: Number(data.get("isShow")),
        },
      });
    } else {
      await prisma.slide.update({
        where: { id: Number(data.get("id")) },
        data: {
          title: String(data.get("title")),
          deskripsi: String(data.get("deskripsi")),
          isShow: Number(data.get("isShow")),
        },
      });
    }
  }
  return { err: false, msg: "Post Slide Sukses" };
}

async function Delete(data: any) {
  const result = await prisma.slide.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
