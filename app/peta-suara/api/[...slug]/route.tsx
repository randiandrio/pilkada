import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { AdminLogin } from "next-auth";
import bcrypt from "bcryptjs";

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
    const result = await Get(adminLogin.appId, params.slug);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "refferal") {
    const result = await Refferal(adminLogin.appId, params.slug);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kota") {
    const result = await LoadKota(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kecamatan") {
    const result = await loadKecamatan(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kelurahan") {
    const result = await loadKelurahan(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "user_prov") {
    const result = await UserProv();
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "user_kab") {
    const result = await UserKab(params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "user_kec") {
    const result = await UserKec(params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "user_kel") {
    const result = await UserKel(params.slug[1]);
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

async function Get(appId: Number, slug: String[]) {
  const result = await prisma.user.findMany({
    where: {
      appId: Number(appId),
      terverifikasi: String(slug[1]) == "all" ? undefined : Number(slug[1]),
      jabatan: String(slug[2]) == "all" ? undefined : String(slug[2]),
      kabId: String(slug[3]) == "all-kabupaten" ? undefined : Number(slug[3]),
      kecId: String(slug[4]) == "all-kecamatan" ? undefined : Number(slug[4]),
      kelId: String(slug[5]) == "all-kelurahan" ? undefined : Number(slug[5]),
    },
    include: {
      kab: true,
      kec: true,
      kel: true,
      refferal: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return result;
}

async function Refferal(appId: Number, slug: String[]) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(slug[1]),
    },
    select: {
      nama: true,
    },
  });
  const result = await prisma.user.findMany({
    where: {
      refId: Number(slug[1]),
    },
    include: {
      kab: true,
      kec: true,
      kel: true,
      refferal: true,
    },
  });
  return {
    data: result,
    user: user?.nama,
  };
}

async function LoadKota(admin: AdminLogin) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(admin.provId) },
  });
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${kode?.provinsi} ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kabupaten",
    nama: "Semua Kabupaten",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadKecamatan(admin: AdminLogin, kabId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kabId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 8
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kecamatan",
    nama: "Semua Kecamatan",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadKelurahan(admin: AdminLogin, kecId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kecId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 13
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    AND kecamatan = ${kode?.kecamatan} 
    ORDER BY nama ASC`;

  let x = [];
  x.push({
    value: "all-kelurahan",
    nama: "Semua Kelurahan / Desa",
  });

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function Post(data: any, admin: AdminLogin) {
  if (String(data.get("method")) == "update") {
    const cek = await prisma.user.findMany({
      where: {
        id: Number(data.get("refId")),
      },
    });

    var x = String(data.get("tanggalLahir")).split("-");
    let tgl = `${x[2]}/${x[1]}/${x[0]}`;

    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        nama: String(data.get("nama")),
        hp: String(data.get("hp")),
        wa: String(data.get("wa")),
        nik: String(data.get("nik")),
        tempatLahir: String(data.get("tempatLahir")),
        tanggalLahir: tgl,
        jenisKelamin: String(data.get("jenisKelamin")),
        provId: Number(data.get("provId")),
        kabId: Number(data.get("kabId")),
        kecId: Number(data.get("kecId")),
        kelId: Number(data.get("kelId")),
        refId: cek.length > 0 ? Number(data.get("refId")) : null,
        jabatan: String(data.get("jabatan")),
        terverifikasi: Number(data.get("terverifikasi")),
      },
    });

    if (String(data.get("password")) != "") {
      const hashPassword = await bcrypt.hash(String(data.get("password")), 10);
      await prisma.user.update({
        where: { id: Number(data.get("id")) },
        data: {
          password: hashPassword,
        },
      });
    }
  }
  if (String(data.get("method")) == "verifikasi") {
    await prisma.user.update({
      where: { id: Number(data.get("id")) },
      data: {
        terverifikasi: 1,
      },
    });
  }
  return { error: false, message: "Data telah diverifikasi" };
}

async function Delete(data: any) {
  const result = await prisma.user.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}

async function UserProv() {
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 2 ORDER BY nama ASC`;
  var data = result.map(function (item) {
    return {
      id: item.id,
      nama: item.nama,
    };
  });

  return data;
}

async function UserKab(provId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(provId) },
  });
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${kode?.provinsi}  ORDER BY nama ASC`;
  var data = result.map(function (item) {
    return {
      id: item.id,
      nama: item.nama,
    };
  });

  return data;
}

async function UserKec(kabId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kabId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 8
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    ORDER BY nama ASC`;

  var data = result.map(function (item) {
    return {
      id: item.id,
      nama: item.nama,
    };
  });

  return data;
}

async function UserKel(kecId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kecId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 13
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    AND kecamatan = ${kode?.kecamatan} 
    ORDER BY nama ASC`;

  var data = result.map(function (item) {
    return {
      id: item.id,
      nama: item.nama,
    };
  });

  return data;
}
