import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { User } from "next-auth";
import { error } from "console";
import { IDWilayah } from "@/app/helper";
import { number } from "echarts";

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

  if (params.slug[0] === "data_desa") {
    const result = await DataDesa(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "tps_desa") {
    const result = await TpsDesa(adminLogin, params.slug[1]);
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

  if (params.slug[0] == "PostSaksi") {
    const result = await PostSaksi(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "AddTps") {
    const result = await AddTps(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "delete") {
    const result = await Delete(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }
};

async function DataDesa(admin: User) {
  let data;
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
        tpsKel: true,
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
        tpsKel: true,
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

  return data;
}

async function TpsDesa(admin: User, wilayahId: String) {
  const tps = await prisma.tps.findMany({
    where: {
      appId: Number(admin.appId),
      kelId: Number(wilayahId),
    },
    include: {
      saksi: true,
    },
    orderBy: {
      tpsNo: "asc",
    },
  });

  const wilayah = await prisma.wilayah.findFirst({
    where: {
      id: Number(wilayahId),
    },
  });

  return {
    tps: tps,
    wilayah: wilayah,
  };
}

async function Post(data: any, admin: User) {
  if (String(data.get("method")) == "Generate") {
    const jumlah = Number(data.get("jumlah"));
    const wilayahId = await IDWilayah(Number(data.get("kelId")));

    let d = [];
    for (let i = 0; i < jumlah; i++) {
      d.push({
        appId: Number(admin.appId),
        kotaId: Number(wilayahId.kabId),
        kecId: Number(wilayahId.kecId),
        kelId: Number(wilayahId.kelId),
        tpsNo: i + 1,
      });
    }

    await prisma.tps.createMany({
      data: d,
    });

    return { error: false, message: "TPS telah di Generate" };
  }

  return { error: false, message: "ok" };
}

async function PostSaksi(data: any, admin: User) {
  await prisma.tps.update({
    where: {
      id: Number(data.get("tpsId")),
      appId: Number(admin.appId),
    },
    data: {
      saksiId: Number(data.get("userId")),
    },
  });
  return { error: false, message: "Saksi telah ditambahkan" };
}

async function AddTps(data: any, admin: User) {
  const wilayahId = await IDWilayah(Number(data.get("wilayahId")));

  await prisma.tps.create({
    data: {
      appId: Number(admin.appId),
      kotaId: Number(wilayahId.kabId),
      kecId: Number(wilayahId.kecId),
      kelId: Number(wilayahId.kelId),
      tpsNo: Number(data.get("tpsNo")),
    },
  });
  return { error: false, message: "TPS ditambahkan" };
}

async function Delete(data: any, admin: User) {
  await prisma.tps.delete({
    where: { id: Number(data.get("id")), appId: Number(admin.appId) },
  });
  return { error: false, message: "Data TPS telah dihapus" };
}
