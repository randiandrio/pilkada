import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  return NextResponse.json(false);
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) => {
  const data = await request.formData();

  if (params.slug[0] == "post_app") {
    const result = await PostApp(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function PostApp(data: any) {
  const hashPassword = await bcrypt.hash(data.get("password"), 10);

  await prisma.appData.create({
    data: {
      nama: String(data.get("namaApp")),
      setting: {
        create: {},
      },
      admin: {
        create: [
          {
            nama: String(data.get("namaAdmin")),
            email: String(data.get("email")),
            hp: String(data.get("hp")),
            wa: String(data.get("wa")),
            password: hashPassword,
          },
        ],
      },
      halaman: {
        create: [
          {
            nama: "profil",
          },
          {
            nama: "visi-misi",
          },
          {
            nama: "syarat-dan-ketentuan",
          },
        ],
      },
    },
  });
  const pesan = {
    error: false,
    message: "Data App behasil ditambahkan",
  };

  return pesan;
}
