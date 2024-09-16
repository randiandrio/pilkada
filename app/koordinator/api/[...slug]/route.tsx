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

  console.log(users);
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

  if (tingkat == "Kabupaten") {
    if (admin.kotaId != 0) {
      data = await prisma.wilayah.findMany({
        where: {
          id: Number(admin.kotaId),
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          nama: "asc",
        },
      });
    } else {
      const prov = await prisma.wilayah.findUnique({
        where: { id: Number(admin.provId) },
      });

      data = await prisma.wilayah.findMany({
        where: {
          provinsi: String(prov?.nama),
          kecamatan: "null",
          id: {
            not: Number(admin.provId),
          },
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          nama: "asc",
        },
      });
    }
  }

  if (tingkat == "Kecamatan") {
    if (admin.kotaId != 0) {
      const kota = await prisma.wilayah.findUnique({
        where: {
          id: Number(admin.kotaId),
        },
      });

      data = await prisma.wilayah.findMany({
        where: {
          kabupaten: kota?.nama,
          kelurahan: "null",
          kecamatan: {
            not: "null",
          },
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            kabupaten: "asc",
          },
          {
            nama: "asc",
          },
        ],
      });
    } else {
      const prov = await prisma.wilayah.findUnique({
        where: {
          id: Number(admin.provId),
        },
      });

      data = await prisma.wilayah.findMany({
        where: {
          provinsi: String(prov?.nama),
          kabupaten: {
            not: "null",
          },
          kecamatan: {
            not: "null",
          },
          kelurahan: "null",
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            kabupaten: "asc",
          },
          {
            nama: "asc",
          },
        ],
      });
    }
  }

  if (tingkat == "Kelurahan") {
    if (admin.kotaId != 0) {
      const kota = await prisma.wilayah.findUnique({
        where: {
          id: Number(admin.kotaId),
        },
      });

      data = await prisma.wilayah.findMany({
        where: {
          kabupaten: kota?.nama,
          kecamatan: {
            not: "null",
          },
          kelurahan: {
            not: "null",
          },
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            kabupaten: "asc",
          },
          {
            kecamatan: "asc",
          },
          {
            nama: "asc",
          },
        ],
      });
    } else {
      const prov = await prisma.wilayah.findUnique({
        where: {
          id: Number(admin.provId),
        },
      });

      data = await prisma.wilayah.findMany({
        where: {
          provinsi: String(prov?.nama),
          kabupaten: {
            not: "null",
          },
          kecamatan: {
            not: "null",
          },
          kelurahan: {
            not: "null",
          },
        },
        include: {
          koordinator: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            kabupaten: "asc",
          },
          {
            kecamatan: "asc",
          },
          {
            nama: "asc",
          },
        ],
      });
    }
  }

  return data;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("mode")) != "delete") {
    await prisma.koordinator.create({
      data: {
        appId: Number(admin.appId),
        wilayahId: Number(data.get("wilayahId")),
        userId: Number(data.get("userId")),
      },
    });

    return { error: false, message: "Data tugas berhasil ditambahkan" };
  } else {
    await prisma.koordinator.deleteMany({
      where: {
        wilayahId: Number(data.get("id")),
        appId: Number(admin.appId),
      },
    });
    return { error: false, message: "Data tugas berhasil dihapus" };
  }
}
