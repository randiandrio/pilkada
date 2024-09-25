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

  if (params.slug[0] === "get") {
    const result = await Get(adminLogin);
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

async function Get(admin: AdminLogin) {
  const result = await prisma.cs.findMany({
    where: {
      appId: Number(admin.appId),
    },
  });
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "add") {
    await prisma.cs.create({
      data: {
        appId: Number(admin.appId),
        nama: String(data.get("nama")),
        url: String(data.get("url")),
        jamOperasional: String(data.get("jamOperasional")),
        gambar: String(data.get("gambar")),
      },
    });
  } else {
    if (data.get("newImage") == "1") {
      await prisma.cs.update({
        where: { id: Number(data.get("id")) },
        data: {
          nama: String(data.get("nama")),
          url: String(data.get("url")),
          jamOperasional: String(data.get("jamOperasional")),
          gambar: String(data.get("gambar")),
        },
      });
    } else {
      await prisma.cs.update({
        where: { id: Number(data.get("id")) },
        data: {
          nama: String(data.get("nama")),
          url: String(data.get("url")),
          jamOperasional: String(data.get("jamOperasional")),
          gambar: String(data.get("gambar")),
        },
      });
    }
  }
  return { err: false, msg: "Post CS Sukses" };
}

async function Delete(data: any) {
  const result = await prisma.cs.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
