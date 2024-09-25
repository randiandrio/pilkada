import { decrypt, modifiHP } from "@/app/helper";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const users = await prisma.user.findMany();

  for (let i = 0; i < users.length; i++) {
    const u: any = users[i].tanggalLahir?.split("/");
    const umur = 2024 - Number(u[2]);
    await prisma.user.update({
      where: { id: users[i].id },
      data: {
        umur: umur,
      },
    });
  }

  return NextResponse.json("Update umur selesai", { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const mapData = JSON.parse(decrypt(body.data));

  if (mapData.jenis_req === "cek_nik") {
    const result = await CekNik(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_wilayah") {
    const result = await LoadWilayah();
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_setting") {
    const result = await LoadSetting(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "registrasi") {
    const result = await Registrasi(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "login") {
    const result = await Login(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "reload_akun") {
    const result = await ReloadAkun(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "ganti_foto") {
    const result = await GantiFoto(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_slide") {
    const result = await LoadSlide(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_halaman") {
    const result = await LoadHalaman(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_berita") {
    const result = await LoadBerita(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_pengumuman") {
    const result = await LoadPengumuman(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_refferal") {
    const result = await LoadRefferal(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_cs") {
    const result = await LoadCs(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_agenda") {
    const result = await LoadAgenda(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "post_pengaduan") {
    const result = await PostPengaduan(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_pengaduan") {
    const result = await LoadPengaduan(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "post_aspirasi") {
    const result = await PostAspirasi(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_aspirasi") {
    const result = await LoadAspirasi(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_tugas") {
    const result = await LoadTugas(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "post_laporan_tugas") {
    const result = await PostLaporanTugas(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_laporan_tugas") {
    const result = await LoadLaporanTugas(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_koordinator") {
    const result = await LoadKoordinator(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_koordinator_wilayah") {
    const result = await LoadKoordinatorWilayah(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_saksi_tps") {
    const result = await LoadSaksiTPS(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_paslon") {
    const result = await LoadPaslon(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "post_suara") {
    const result = await PostSuara(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_suara") {
    const result = await LoadSuara(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "load_tugas_anggota") {
    const result = await LoadTugasAnggota(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  if (mapData.jenis_req === "tambah_tugas_anggota") {
    const result = await TambahTugasAnggota(mapData);
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(false, { status: 200 });
};

async function CekNik(data: any) {
  const users = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      nik: String(data.nik),
    },
  });

  if (users.length > 0) {
    return {
      error: true,
      message: "NIK terlah terdaftar",
    };
  }

  return {
    error: false,
    message: "Email belum terdaftar",
  };
}

async function LoadWilayah() {
  const wilayah = await prisma.wilayah.findMany();
  return wilayah;
}

async function Registrasi(data: any) {
  const prov = await prisma.wilayah.findFirst({
    where: {
      kode: String(data.provId),
    },
  });
  const kab = await prisma.wilayah.findFirst({
    where: {
      kode: String(data.kabId),
    },
  });
  const kec = await prisma.wilayah.findFirst({
    where: {
      kode: String(data.kecId),
    },
  });
  const kel = await prisma.wilayah.findFirst({
    where: {
      kode: String(data.kelId),
    },
  });

  const setting = await prisma.setting.findUnique({
    where: { id: Number(data.appId) },
    include: {
      prov: true,
      kota: true,
    },
  });

  let inDapil;
  if (setting?.kotaId != null) {
    inDapil = setting.kota?.nama == kab?.nama;
  } else {
    inDapil = setting?.prov?.nama == prov?.nama;
  }

  if (!inDapil)
    return {
      error: true,
      message: "Maaf anda berada diluar dapil kami",
    };

  const hashPassword = await bcrypt.hash(data.password, 10);

  const hp = modifiHP(data.hp);

  const cek = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      hp: hp,
    },
  });

  if (cek.length > 0)
    return {
      error: true,
      message: "Nomor HP telah digunakan",
    };

  const u: any = data.tanggalLahir.split("/");
  const umur = 2024 - Number(u[2]);

  const user = await prisma.user.create({
    data: {
      appId: Number(data.appId),
      dukungan: data.dukungan,
      nama: data.nama,
      hp: hp,
      wa: data.wa,
      password: hashPassword,
      nik: data.nik,
      tempatLahir: data.tempatLahir,
      tanggalLahir: data.tanggalLahir,
      jenisKelamin: data.jenisKelamin,
      umur: umur,
      provId: Number(prov?.id),
      kabId: Number(kab?.id),
      kecId: Number(kec?.id),
      kelId: Number(kel?.id),
      refId: Number(data.refId) == 0 ? undefined : Number(data.refId),
    },
  });

  return {
    error: false,
    message: "Registrasi berhasil",
    data: user,
  };
}

async function Login(data: any) {
  const hp = modifiHP(data.hp);

  const user = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      hp: hp,
    },
  });

  if (user.length == 0)
    return {
      error: true,
      message: "Nomor Handphone Anda belum terdaftar",
    };

  const isValid = await bcrypt.compare(
    String(data.password),
    String(user[0].password)
  );

  if (!isValid)
    return {
      error: true,
      message: "Password salah",
      data: user,
    };

  return {
    error: false,
    message: "Login berhasil",
    data: user[0],
  };
}

async function ReloadAkun(data: any) {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(data.userId),
    },
  });

  return user;
}

async function GantiFoto(data: any) {
  const user = await prisma.user.update({
    where: {
      id: Number(data.id),
    },
    data: {
      foto: String(data.foto),
    },
  });

  return {
    error: false,
    message: "Ganti foto sukses",
    data: user,
  };
}

async function LoadSlide(data: any) {
  const xAllId = await prisma.slide.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.slide.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadHalaman(data: any) {
  const xAllId = await prisma.halaman.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.halaman.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadBerita(data: any) {
  const xAllId = await prisma.berita.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.berita.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadPengumuman(data: any) {
  const xAllId = await prisma.pengumuman.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.pengumuman.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadRefferal(data: any) {
  const xAllId = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      refId: Number(data.userId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.user.findMany({
    where: {
      appId: Number(data.appId),
      refId: Number(data.userId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadCs(data: any) {
  const xAllId = await prisma.cs.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.cs.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadAgenda(data: any) {
  const xAllId = await prisma.agenda.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.agenda.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function PostPengaduan(data: any) {
  const user = await prisma.user.findUnique({
    where: { id: Number(data.userId) },
  });

  if (String(data.mode) == "add") {
    await prisma.pengaduan.create({
      data: {
        appId: Number(user?.appId),
        userId: Number(data.userId),
        judul: String(data.judul),
        alamat: String(data.alamat),
        deskripsi: String(data.deskripsi),
        gambar: String(data.gambar),
        koordinat: String(data.koordinat),
      },
    });
    return {
      error: false,
      message: "Pengaduan telah disimpan",
    };
  }

  if (String(data.mode) == "update") {
    if (String(data.newGambar) == "1") {
      await prisma.pengaduan.update({
        where: { id: Number(data.id) },
        data: {
          appId: Number(user?.appId),
          userId: Number(data.userId),
          judul: String(data.judul),
          alamat: String(data.alamat),
          deskripsi: String(data.deskripsi),
          gambar: String(data.gambar),
          koordinat: String(data.koordinat),
        },
      });
    } else {
      await prisma.pengaduan.update({
        where: { id: Number(data.id) },
        data: {
          appId: Number(user?.appId),
          userId: Number(data.userId),
          judul: String(data.judul),
          alamat: String(data.alamat),
          deskripsi: String(data.deskripsi),
          koordinat: String(data.koordinat),
        },
      });
    }

    return {
      error: false,
      message: "Pengaduan telah diperbarui",
    };
  }

  if (String(data.mode) == "delete") {
    await prisma.pengaduan.delete({
      where: { id: Number(data.id) },
    });
    return {
      error: false,
      message: "Pengaduan telah dihapus",
    };
  }

  return {
    error: true,
    message: "Gagal",
  };
}

async function LoadPengaduan(data: any) {
  const xAllId = await prisma.pengaduan.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newDatas = await prisma.pengaduan.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
    include: {
      user: true,
    },
  });

  const newData = newDatas.map(function (item) {
    return {
      id: item.id,
      appId: item.appId,
      userId: item.userId,
      namaUser: item.user.nama,
      judul: item.judul,
      alamat: item.alamat,
      deskripsi: item.deskripsi,
      gambar: item.gambar,
      koordinat: item.koordinat,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function PostAspirasi(data: any) {
  const user = await prisma.user.findUnique({
    where: { id: Number(data.userId) },
  });

  if (String(data.mode) == "add") {
    await prisma.aspirasi.create({
      data: {
        appId: Number(user?.appId),
        userId: Number(data.userId),
        judul: String(data.judul),
        deskripsi: String(data.deskripsi),
      },
    });
    return {
      error: false,
      message: "Aspirasi telah disampaikan",
    };
  }

  if (String(data.mode) == "update") {
    await prisma.aspirasi.update({
      where: { id: Number(data.id) },
      data: {
        appId: Number(user?.appId),
        userId: Number(data.userId),
        judul: String(data.judul),
        deskripsi: String(data.deskripsi),
      },
    });

    return {
      error: false,
      message: "Aspirasi telah diperbarui",
    };
  }

  if (String(data.mode) == "delete") {
    await prisma.aspirasi.delete({
      where: { id: Number(data.id) },
    });
    return {
      error: false,
      message: "Aspirasi telah dihapus",
    };
  }

  return {
    error: true,
    message: "Gagal",
  };
}

async function LoadAspirasi(data: any) {
  const xAllId = await prisma.aspirasi.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newDatas = await prisma.aspirasi.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
    include: {
      user: true,
    },
  });

  const newData = newDatas.map(function (item) {
    return {
      id: item.id,
      appId: item.appId,
      userId: item.userId,
      namaUser: item.user.nama,
      judul: item.judul,
      deskripsi: item.deskripsi,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadSetting(data: any) {
  const setting = await prisma.setting.findUnique({
    where: {
      id: Number(data.appId),
    },
  });
  return setting;
}

async function LoadTugas(data: any) {
  const xAllId = await prisma.tugas.findMany({
    where: {
      userId: Number(data.userId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.tugas.findMany({
    where: {
      userId: Number(data.userId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadLaporanTugas(data: any) {
  const xAllId = await prisma.laporanTugas.findMany({
    where: {
      tugas: {
        userId: Number(data.userId),
      },
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.laporanTugas.findMany({
    where: {
      tugas: {
        userId: Number(data.userId),
      },
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function PostLaporanTugas(data: any) {
  if (String(data.mode) == "add") {
    await prisma.laporanTugas.create({
      data: {
        tugasId: Number(data.tugasId),
        deskripsi: String(data.deskripsi),
        koordinat: String(data.koordinat),
        gambar: String(data.gambar),
      },
    });

    const lp = await prisma.laporanTugas.findMany({
      where: {
        tugasId: Number(data.tugasId),
      },
    });

    const tugas = await prisma.tugas.findUnique({
      where: { id: Number(data.tugasId) },
    });

    let prog = 0;
    if (lp.length > 0) {
      prog = (lp.length / tugas!.jumlah) * 100;
    }

    await prisma.tugas.update({
      where: { id: Number(data.tugasId) },
      data: {
        progress: Number(prog),
      },
    });

    return {
      error: false,
      message: "Laporan tugas telah disimpan",
    };
  }

  if (String(data.mode) == "update") {
    if (String(data.newGambar) == "1") {
      await prisma.laporanTugas.update({
        where: { id: Number(data.id) },
        data: {
          tugasId: Number(data.tugasId),
          deskripsi: String(data.deskripsi),
          koordinat: String(data.koordinat),
          gambar: String(data.gambar),
        },
      });
    } else {
      await prisma.laporanTugas.update({
        where: { id: Number(data.id) },
        data: {
          tugasId: Number(data.tugasId),
          deskripsi: String(data.deskripsi),
          koordinat: String(data.koordinat),
        },
      });
    }

    return {
      error: false,
      message: "Laporan tugas telah diperbarui",
    };
  }

  if (String(data.mode) == "delete") {
    await prisma.laporanTugas.delete({
      where: { id: Number(data.id) },
    });
    return {
      error: false,
      message: "Laporan tugas telah dihapus",
    };
  }

  return {
    error: true,
    message: "Gagal",
  };
}

async function LoadKoordinator(data: any) {
  const cek = await prisma.koordinator.findMany({
    where: {
      userId: Number(data.userId),
    },
    include: {
      wilayah: true,
    },
  });

  if (cek.length == 0) return { status: false };

  let kode = "xxxxxxxxxxxxxx";

  cek.map(function (item) {
    kode = item.wilayah.kode.length < kode.length ? item.wilayah.kode : kode;
  });

  const wilayah = await prisma.wilayah.findFirst({
    where: { kode: kode },
  });

  const usr = await prisma.koordinator.findMany({
    where: {
      wilayahId: wilayah?.id,
      appId: cek[0].appId,
    },
    include: {
      user: {
        select: {
          id: true,
          nama: true,
          hp: true,
          wa: true,
          foto: true,
        },
      },
    },
  });

  const users = usr.map(function (item) {
    return item.user;
  });

  let res = {
    id: wilayah!.id,
    appId: cek[0].appId,
    kodeWilayah: wilayah!.kode,
    namaWilayah: wilayah!.nama,
    users: users,
  };

  return { status: true, data: res };
}

async function LoadKoordinatorWilayah(data: any) {
  const wilayah = await prisma.wilayah.findUnique({
    where: { id: Number(data.wilayahId) },
  });

  let x;
  if (wilayah?.kode.length == 2) {
    x = await prisma.wilayah.findMany({
      where: {
        id: {
          not: Number(data.wilayahId),
        },
        provinsi: wilayah.nama,
        kecamatan: "null",
        kelurahan: "null",
      },
      orderBy: {
        nama: "asc",
      },
    });
  }
  if (wilayah?.kode.length == 5) {
    x = await prisma.wilayah.findMany({
      where: {
        id: {
          not: Number(data.wilayahId),
        },
        provinsi: wilayah.provinsi,
        kabupaten: wilayah.kabupaten,
        kelurahan: "null",
      },
      orderBy: {
        nama: "asc",
      },
    });
  }
  if (wilayah?.kode.length == 8) {
    x = await prisma.wilayah.findMany({
      where: {
        id: {
          not: Number(data.wilayahId),
        },
        provinsi: wilayah.provinsi,
        kabupaten: wilayah.kabupaten,
        kecamatan: wilayah.kecamatan,
      },
      orderBy: {
        nama: "asc",
      },
    });
  }

  let res: any[] = [];

  for (let i = 0; i < x!.length; i++) {
    const appId = Number(data.appId);
    const usr = await prisma.koordinator.findMany({
      where: {
        wilayahId: Number(x![i].id),
        appId: appId,
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            hp: true,
            wa: true,
            foto: true,
          },
        },
      },
    });

    const users = usr.map(function (item) {
      return item.user;
    });

    res.push({
      id: x![i].id,
      appId: appId,
      kodeWilayah: x![i].kode,
      namaWilayah: x![i].nama,
      users: users,
    });
  }

  return res;
}

async function LoadSaksiTPS(data: any) {
  const xAllId = await prisma.tps.findMany({
    where: {
      saksiId: Number(data.userId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newDatax = await prisma.tps.findMany({
    where: {
      saksiId: Number(data.userId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
    include: {
      kota: true,
      kec: true,
      saksi: true,
    },
  });

  const newData = newDatax.map(function (item) {
    return {
      id: item.id,
      kotaId: item.kotaId,
      namaKota: item.kota?.nama,
      kecId: item.kecId,
      namaKec: item.kec?.nama,
      tpsNo: item.tpsNo,
      tpsId: item.id,
      saksiId: item.saksiId,
      namaSaksi: item.saksi?.nama,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadPaslon(data: any) {
  const xAllId = await prisma.paslon.findMany({
    where: {
      appId: Number(data.appId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.paslon.findMany({
    where: {
      appId: Number(data.appId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function PostSuara(data: any) {
  const paslon = await prisma.paslon.findMany({
    where: {
      appId: Number(data.appId),
    },
    orderBy: {
      noUrut: "asc",
    },
  });

  if (paslon.length == 0) return false;

  for (let i = 0; i < paslon.length; i++) {
    await prisma.realCount.upsert({
      where: {
        tpsId_paslonId: {
          tpsId: Number(data.tpsId),
          paslonId: Number(paslon[i].id),
        },
      },
      create: {
        appId: Number(data.appId),
        tpsId: Number(data.tpsId),
        paslonId: Number(paslon[i].id),
        suara: Number(data.suara[i]),
      },
      update: {
        suara: Number(data.suara[i]),
      },
    });
  }

  if (String(data.foto) != "") {
    await prisma.realCount.updateMany({
      where: {
        tpsId: Number(data.tpsId),
      },
      data: {
        foto: String(data.foto),
      },
    });
  }

  return {
    error: false,
    message: "Data suara telah disimpan",
  };
}

async function LoadSuara(data: any) {
  const xAllId = await prisma.realCount.findMany({
    where: {
      appId: Number(data.appId),
      tpsId: Number(data.tpsId),
    },
  });

  var allId = xAllId.map(function (item) {
    return item.id;
  });

  const newData = await prisma.realCount.findMany({
    where: {
      appId: Number(data.appId),
      tpsId: Number(data.tpsId),
      updatedAt: {
        gt: new Date(data.last),
      },
    },
  });

  var newId = newData.map(function (item) {
    return item.id;
  });

  const result = {
    allId: allId.toString(),
    newId: newId.toString(),
    newData: newData,
  };

  return result;
}

async function LoadTugasAnggota(data: any) {
  const tugas = await prisma.tugas.findMany({
    where: { userId: Number(data.userId) },
    include: {
      laporanTugas: true,
    },
    orderBy: { id: "asc" },
  });

  const user = await prisma.user.findMany({
    where: { refId: Number(data.userId) },
    orderBy: { id: "asc" },
  });

  return {
    tugas: tugas,
    referal: user,
  };
}

async function TambahTugasAnggota(data: any) {
  console.log(data);

  await prisma.tugas.create({
    data: {
      appId: Number(data.appId),
      userId: Number(data.userId),
      judul: String(data.judul),
      deskripsi: String(data.deskripsi),
      jumlah: Number(data.jumlah),
      deadline: String(data.deadline).replaceAll("/", "-"),
      oleh: String(data.oleh),
    },
  });

  return true;
}
