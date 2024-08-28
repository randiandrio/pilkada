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
    const result = await Get(adminLogin.appId, params.slug[1]);
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

async function Get(appId: Number, jabatan: String) {
  const result = await prisma.user.findMany({
    where: {
      appId: Number(appId),
      jabatan: String(jabatan) == "all" ? undefined : String(jabatan),
    },
    include: {
      kab: true,
      kec: true,
      kel: true,
      refferal: true,
    },
  });
  return result;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "update") {
    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        jabatan: String(data.get("jabatan")),
      },
    });
  }
  return { error: false, message: "Update jabatan sukses" };
}

async function Delete(data: any) {
  const result = await prisma.user.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
