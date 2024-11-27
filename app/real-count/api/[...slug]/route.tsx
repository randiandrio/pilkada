import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Wilayah } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { User } from "next-auth";

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

  if (params.slug[0] === "realcount") {
    const result = await RealCount(adminLogin, params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kota") {
    const result = await LoadKota(adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kecamatan") {
    const result = await loadKecamatan(params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_kelurahan") {
    const result = await loadKelurahan(params.slug[1]);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] === "load_tps") {
    const result = await loadTPS(params.slug[1]);
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

  if (params.slug[0] == "post_c1") {
    const result = await PostC1(data, adminLogin);
    return NextResponse.json(result, { status: 200 });
  }

  if (params.slug[0] == "delete") {
    const result = await Delete(data);
    return NextResponse.json(result, { status: 200 });
  }
};

async function RealCount(admin: User, wilayah: String) {
  let result: any[] = [];
  let namaWilayah = "";
  let firstName = "";
  let isProv = false;
  let isTPS = false;
  let dataMasuk = 0;
  let kode;
  let realCount;

  if (wilayah == "all") {
    const all = await prisma.tps.aggregate({
      where: { appId: Number(admin.appId) },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.detailRealCount.aggregate({
      where: {
        realCount: {
          appId: Number(admin.appId),
        },
      },
      _count: {
        id: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.id / all._count.id) * 100);

    let wilayahId = admin.provId;
    if (admin.kotaId != 0) {
      wilayahId = admin.kotaId;
    }
    kode = await prisma.wilayah.findUnique({
      where: { id: Number(wilayahId) },
    });

    namaWilayah = String(kode?.nama);

    if (kode?.kode.length == 2) {
      result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 5
        AND provinsi = ${kode?.provinsi} 
        ORDER BY nama DESC`;

      isProv = true;
      firstName = "Prov. ";
    } else {
      result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 8
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        ORDER BY nama DESC`;
    }

    realCount = await prisma.realCount.findMany({
      where: {
        appId: Number(admin.appId),
      },
      include: {
        tps: {
          include: {
            kel: true,
          },
        },
        detail: {
          include: {
            paslon: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  } else {
    kode = await prisma.wilayah.findFirst({
      where: { nama: String(wilayah) },
    });
    namaWilayah = String(kode?.nama);
    kode = await prisma.wilayah.findFirst({
      where: { id: kode?.id },
    });
  }

  if (kode?.kode.length == 5) {
    result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 8
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        ORDER BY nama DESC`;

    realCount = await prisma.realCount.findMany({
      where: {
        appId: Number(admin.appId),
        tps: {
          kotaId: kode.id,
        },
      },
      include: {
        tps: {
          include: {
            kel: true,
          },
        },
        detail: {
          include: {
            paslon: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const all = await prisma.tps.aggregate({
      where: {
        appId: Number(admin.appId),
        kotaId: kode.id,
      },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.realCount.aggregate({
      where: {
        appId: Number(admin.appId),
        tps: {
          kotaId: kode.id,
        },
      },
      _count: {
        tpsId: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.tpsId / all._count.id) * 100);
  }

  if (kode?.kode.length == 8) {
    namaWilayah = `Kec. ${namaWilayah}`;

    result = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 13
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        AND kecamatan = ${kode?.kecamatan} 
        ORDER BY nama DESC`;

    realCount = await prisma.realCount.findMany({
      where: {
        appId: Number(admin.appId),
        tps: {
          kecId: kode.id,
        },
      },
      include: {
        tps: {
          include: {
            kel: true,
          },
        },
        detail: {
          include: {
            paslon: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const all = await prisma.tps.aggregate({
      where: {
        appId: Number(admin.appId),
        kecId: kode.id,
      },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.realCount.aggregate({
      where: {
        appId: Number(admin.appId),
        tps: {
          kecId: kode.id,
        },
      },
      _count: {
        tpsId: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.tpsId / all._count.id) * 100);
  }

  if (kode?.kode.length == 13) {
    namaWilayah = `Kel/Desa. ${namaWilayah}`;
    isTPS = true;

    result = await prisma.tps.findMany({
      where: {
        kelId: kode.id,
      },
      orderBy: {
        tpsNo: "desc",
      },
    });

    realCount = await prisma.realCount.findMany({
      where: {
        appId: Number(admin.appId),
        tps: {
          kelId: kode.id,
        },
      },
      include: {
        tps: {
          include: {
            kel: true,
          },
        },
        detail: {
          include: {
            paslon: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const all = await prisma.tps.aggregate({
      where: {
        appId: Number(admin.appId),
        kelId: kode.id,
      },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.realCount.aggregate({
      where: {
        appId: Number(admin.appId),
        tps: {
          kelId: kode.id,
        },
      },
      _count: {
        tpsId: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.tpsId / all._count.id) * 100);
  }

  const pcs = await prisma.paslon.findMany({
    where: {
      appId: Number(admin.appId),
    },
    orderBy: { noUrut: "asc" },
  });

  let series = [];
  let pie = [];

  for (let ii = 0; ii < pcs.length; ii++) {
    if (wilayah == "all") {
      const j = await prisma.detailRealCount.aggregate({
        where: {
          paslonId: pcs[ii].id,
          realCount: {
            appId: Number(admin.appId),
          },
        },
        _sum: { suara: true },
      });

      pie.push({
        value: j._sum.suara ?? 0,
        name: `${pcs[ii].calon} & ${pcs[ii].wakil}`,
      });
    } else {
      if (kode?.kode.length == 5) {
        const j = await prisma.detailRealCount.aggregate({
          where: {
            paslonId: pcs[ii].id,
            realCount: {
              appId: Number(admin.appId),
              tps: {
                kotaId: Number(kode.id),
              },
            },
          },
          _sum: { suara: true },
        });

        pie.push({
          value: j._sum.suara ?? 0,
          name: `${pcs[ii].calon} & ${pcs[ii].wakil}`,
        });
      }
      if (kode?.kode.length == 8) {
        const j = await prisma.detailRealCount.aggregate({
          where: {
            paslonId: pcs[ii].id,
            realCount: {
              appId: Number(admin.appId),
              tps: {
                kecId: Number(kode.id),
              },
            },
          },
          _sum: { suara: true },
        });

        pie.push({
          value: j._sum.suara ?? 0,
          name: `${pcs[ii].calon} & ${pcs[ii].wakil}`,
        });
      }
      if (kode?.kode.length == 13) {
        const j = await prisma.detailRealCount.aggregate({
          where: {
            paslonId: pcs[ii].id,
            realCount: {
              appId: Number(admin.appId),
              tps: {
                kelId: Number(kode.id),
              },
            },
          },
          _sum: { suara: true },
        });

        pie.push({
          value: j._sum.suara ?? 0,
          name: `${pcs[ii].calon} & ${pcs[ii].wakil}`,
        });
      }
    }

    let s = [];
    for (let i = 0; i < result.length; i++) {
      if (isTPS) {
        const j = await prisma.detailRealCount.findFirst({
          where: {
            paslonId: pcs[ii].id,
            realCount: {
              appId: Number(admin.appId),
              tpsId: Number(result[i].id),
            },
          },
        });
        s.push(j?.suara ?? 0);
      } else {
        let j;
        if (isProv) {
          j = await prisma.detailRealCount.aggregate({
            where: {
              paslonId: pcs[ii].id,
              realCount: {
                appId: Number(admin.appId),
                tps: {
                  kotaId: Number(result[i].id),
                },
              },
            },
            _sum: {
              suara: true,
            },
          });
          s.push(j._sum.suara ?? 0);
        } else {
          if (kode?.kode.length == 5) {
            j = await prisma.detailRealCount.aggregate({
              where: {
                paslonId: pcs[ii].id,
                realCount: {
                  appId: Number(admin.appId),
                  tps: {
                    kecId: Number(result[i].id),
                  },
                },
              },
              _sum: {
                suara: true,
              },
            });
            s.push(j._sum.suara ?? 0);
          }
          if (kode?.kode.length == 8) {
            j = await prisma.detailRealCount.aggregate({
              where: {
                paslonId: pcs[ii].id,
                realCount: {
                  appId: Number(admin.appId),
                  tps: {
                    kelId: Number(result[i].id),
                  },
                },
              },
              _sum: {
                suara: true,
              },
            });
            s.push(j._sum.suara ?? 0);
          }
        }
      }
    }

    const x = {
      name: `${pcs[ii].calon} & ${pcs[ii].wakil}`,
      type: "bar",
      data: s,
    };

    series.push(x);
  }

  let click = true;

  const wil = result.map(function (item) {
    if (isTPS) {
      click = false;
      return `TPS ${item.tpsNo}`;
    } else {
      return item.nama;
    }
  });

  const paslon = await prisma.paslon.findMany({
    where: { appId: Number(admin.appId) },
    orderBy: {
      noUrut: "asc",
    },
  });

  let suara: any[] = [];
  for (let i = 0; i < paslon.length; i++) {
    const s = await prisma.detailRealCount.aggregate({
      where: {
        paslonId: paslon[i].id,
      },
      _sum: {
        suara: true,
      },
    });

    const x = {
      paslonId: paslon[i].id,
      noUrut: paslon[i].noUrut,
      suara: s._sum.suara,
    };

    suara.push(x);
  }

  return {
    wilayah: wil,
    series: series,
    click: click,
    namaWilayah: namaWilayah,
    firstName: firstName,
    pie: pie,
    dataMasuk: dataMasuk,
    realCount: realCount,
    paslon: paslon,
    suara: suara,
  };
}

async function LoadKota(admin: User) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(admin.provId) },
  });
  const result: any[] =
    await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" WHERE LENGTH(kode) = 5 AND provinsi = ${kode?.provinsi} ORDER BY nama ASC`;

  let x = [];
  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadKecamatan(kabId: String) {
  const kode = await prisma.wilayah.findUnique({
    where: { id: Number(kabId) },
  });
  const result: any[] = await prisma.$queryRaw`SELECT * FROM "public"."Wilayah" 
    WHERE LENGTH(kode) = 8
    AND provinsi = ${kode?.provinsi} 
    AND kabupaten = ${kode?.kabupaten} 
    ORDER BY nama ASC`;

  let x = [];

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadKelurahan(kecId: String) {
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

  for (let i = 0; i < result.length; i++) {
    x.push({
      value: result[i].id,
      nama: result[i].nama,
    });
  }
  return x;
}

async function loadTPS(kelId: String) {
  const tps = await prisma.tps.findMany({
    where: {
      kelId: Number(kelId),
    },
    orderBy: {
      tpsNo: "asc",
    },
  });

  let x = [];

  for (let i = 0; i < tps.length; i++) {
    x.push({
      value: tps[i].id,
      nama: String(tps[i].tpsNo).padStart(2, "0"),
    });
  }
  return x;
}

async function PostC1(data: any, admin: User) {
  const cek = await prisma.realCount.findMany({
    where: {
      appId: Number(admin.appId),
      tpsId: Number(data.get("tpsId")),
    },
  });

  console.log(cek);

  let id;
  if (cek.length > 0) {
    id = cek[0].id;
    prisma.realCount.update({
      where: { id: id },
      data: {
        appId: Number(admin.appId),
        tpsId: Number(data.get("tpsId")),
        suaraSah: Number(data.get("suaraSah")),
        suaraBatal: Number(data.get("suaraBatal")),
        suaraSisa: Number(data.get("suaraSisa")),
        mulai: String(data.get("mulai")),
        selesai: String(data.get("selesai")),
        catatan: String(data.get("catatan")),
        foto: String(data.get("foto")),
      },
    });
  } else {
    const rc = await prisma.realCount.create({
      data: {
        appId: Number(admin.appId),
        tpsId: Number(data.get("tpsId")),
        suaraSah: Number(data.get("suaraSah")),
        suaraBatal: Number(data.get("suaraBatal")),
        suaraSisa: Number(data.get("suaraSisa")),
        mulai: String(data.get("mulai")),
        selesai: String(data.get("selesai")),
        catatan: String(data.get("catatan")),
        foto: String(data.get("foto")),
      },
    });
    id = rc.id;
    console.log(rc);
  }

  const cd = await prisma.detailRealCount.findMany({
    where: {
      realCountId: id,
    },
  });

  if (cd.length > 0) {
    await prisma.detailRealCount.deleteMany();
  }

  const paslons = await prisma.paslon.findMany({
    where: { appId: Number(admin.appId) },
    orderBy: { noUrut: "asc" },
  });

  let details = [];
  const suaras = JSON.parse(data.get("suaras"));
  for (let i = 0; i < paslons.length; i++) {
    details.push({
      realCountId: id,
      paslonId: paslons[i].id,
      suara: suaras[i],
    });
  }

  await prisma.detailRealCount.createMany({
    data: details,
  });

  return {
    error: false,
    message: "Data form C1 berhasil di input",
  };
}

async function Delete(data: any) {
  const result = await prisma.realCount.delete({
    where: {
      id: Number(data.get("id")),
    },
  });
  return result;
}
