import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const data = await request.formData();

  const result = await Post(data);
  return NextResponse.json(result, { status: 200 });
};

async function Post(data: any) {
  const admin = await prisma.admin.findUnique({
    where: {
      id: Number(data.get("id")),
    },
  });

  const isValid = await bcrypt.compare(
    String(data.get("passLama")),
    String(admin!.password)
  );

  if (!isValid) {
    return { error: true, msg: "Password lama salah, silahkan coba lagi" };
  }

  const hashPassword = await bcrypt.hash(String(data.get("passBaru")), 10);

  await prisma.admin.update({
    where: {
      id: Number(data.get("id")),
    },
    data: {
      password: hashPassword,
    },
  });

  return { err: false, msg: "Ganti password sukses" };
}
