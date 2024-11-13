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

  return NextResponse.json(false);
};

async function RealCount(admin: User, wilayah: String) {
  let result: any[] = [];
  let namaWilayah = "";
  let firstName = "";
  let isProv = false;
  let isTPS = false;
  let wid = 0;
  let dataMasuk = 0;

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
    const kode = await prisma.wilayah.findUnique({
      where: { id: Number(wilayahId) },
    });

    wid = Number(wilayahId);

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
  }

  const kode = await prisma.wilayah.findFirst({
    where: { nama: String(wilayah) },
  });

  if (wilayah != "all") {
    wid = Number(kode?.id);
    namaWilayah = String(kode?.nama);
  }

  if (kode?.kode.length == 5) {
    result = await prisma.$queryRaw`SELECT * 
        FROM "public"."Wilayah" 
        WHERE LENGTH(kode) = 8
        AND provinsi = ${kode?.provinsi} 
        AND kabupaten = ${kode?.kabupaten} 
        ORDER BY nama DESC`;

    const all = await prisma.tps.aggregate({
      where: {
        appId: Number(admin.appId),
        kotaId: kode.id,
      },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.detailRealCount.aggregate({
      where: {
        realCount: {
          appId: Number(admin.appId),
          tps: {
            kotaId: kode.id,
          },
        },
      },
      _count: {
        id: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.id / all._count.id) * 100);
  }

  if (kode?.kode.length == 8) {
    isTPS = true;
    result = await prisma.tps.findMany({
      where: {
        appId: Number(admin.appId),
        kecId: Number(kode.id),
      },
      orderBy: { tpsNo: "desc" },
    });
    firstName = "Kec. ";

    const all = await prisma.tps.aggregate({
      where: {
        appId: Number(admin.appId),
        kecId: kode.id,
      },
      _count: {
        id: true,
      },
    });

    const masuk = await prisma.detailRealCount.aggregate({
      where: {
        realCount: {
          appId: Number(admin.appId),
          tps: {
            kecId: kode.id,
          },
        },
      },
      _count: {
        id: true,
      },
    });

    dataMasuk = Math.ceil((masuk._count.id / all._count.id) * 100);
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
                kotaId: Number(wid),
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
                kecId: Number(wid),
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
        } else {
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
        }

        s.push(j._sum.suara ?? 0);
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

  return {
    wilayah: wil,
    series: series,
    click: click,
    namaWilayah: namaWilayah,
    firstName: firstName,
    pie: pie,
    dataMasuk: dataMasuk,
  };
}
