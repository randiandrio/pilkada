import { PrismaClient } from "@prisma/client";
import axios from "axios";
import crypto from "crypto";
import moment from "moment";
import Swal from "sweetalert2";

const prisma = new PrismaClient();
const mykey = "Bismillah kuantar berkah selalu.";
const myiv = "AminAminAminYaRabbalAlamin";

export const apiImg = "https://file.sispol.id/storage";
export const urlUploadGambar = "https://file.sispol.id/api/uploadGambar";
export const urlHapusGambar = "https://file.sispol.id/api/hapusFile";
export const firebaseProject = "pilkada";
export const tinymceKey = "eoc1aloon8j0y09817k1tup61t53mjfl6ckuy2res8pl2ix0";

const key = crypto
  .createHash("sha256")
  .update(mykey)
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha256")
  .update(myiv)
  .digest("hex")
  .substring(0, 16);

export function encryptData(data: String) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    encryptionIV
  );
  let encrypted = cipher.update(String(data), "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export async function tokenFirbase() {
  const token = await prisma.firebaseToken.findFirst();
  return token?.token;
}

export function decrypt(data: String) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    encryptionIV
  );
  let decrypted = decipher.update(String(data), "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

export function tglIndo(tanggal: String) {
  const listBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const tahun = tanggal.slice(0, 4);
  const xbulan = tanggal.slice(5, 7);
  const tgl = tanggal.substring(8, 10);
  const bulan = listBulan[Number(xbulan) - 1];

  return `${tgl} ${bulan} ${tahun}`;
}

export function tglJamIndo(tanggal: String) {
  const x = moment(String(tanggal)).format("DD/MM/YYYY HH:mm:ss");
  return x;
}

export function tglJamIndoMap(tanggal: String) {
  const x = moment(String(tanggal)).format("DD/MM/YYYY HH:mm:ss");
  const z = x.split(" ");
  return {
    tanggal: z[0],
    jam: z[1],
  };
}

export function titleHalaman(jenis: String) {
  if (jenis == "profil") return "Profil Pasangan Calon";
  if (jenis == "visi-misi") return "Visi dan Misi";
  if (jenis == "sambutan") return "Kata Sambutan";
  return "";
}

export function modifiHP(hp: String) {
  let hp1 = `+62${hp}`;
  let hp2 = hp1.replaceAll("+620", "+62");
  let hp3 = hp2.replaceAll("+62+62", "+62");
  let hp4 = hp3.replaceAll("+6262", "+62");
  let hp5 = hp4.replaceAll("+62", "+62");
  let hp6 = hp5.replaceAll("+62+62", "+62");
  let hp7 = hp6.replaceAll(" ", "");
  return hp7;
}

export function perbaikiNopel(noPel: String) {
  let x1 = noPel.replaceAll(" ", "");
  let x2 = x1.replaceAll("-", "");
  let x3 = x2.replaceAll("+62", "0");
  return x3;
}

export function rupiah(amount: Number) {
  const x = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return `Rp. ${x}`;
}

export function noRupiah(amount: Number) {
  const x = amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return x;
}

export function ucwords(str: String) {
  return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}

export function randomString(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function tampilLoading() {
  return Swal.fire({
    title: "Mohon tunggu",
    html: "Sedang mengirim data",
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export async function uploadGambar(
  image: File,
  jenis: String,
  oldGambar: String
) {
  const fileData = new FormData();
  fileData.append("jenis", String(jenis));
  if (oldGambar != "") {
    fileData.append("oldGambar", String(oldGambar));
  }
  fileData.append("gambar", image);
  const up = await axios.post(urlUploadGambar, fileData);

  return up.data.file;
}

export async function kirimNotifikasiPerorang(
  userId: Number,
  title: String,
  body: String,
  channel_id: String,
  catat: Boolean
) {
  if (catat) {
    await prisma.notifikasi.create({
      data: {
        userId: Number(userId),
        judul: String(title),
        deskripsi: String(body),
      },
    });
  }

  var myHeaders = new Headers();
  const token = await tokenFirbase();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const user = await prisma.user.findFirst({
    where: { id: Number(userId) },
  });

  let raw = JSON.stringify({
    message: {
      token: user?.token,
      notification: {
        title: title,
        body: body,
      },
      android: {
        priority: "HIGH",
        ttl: "60s",
        data: {
          sn: randomString(10),
          channelId: channel_id,
        },
        notification: {
          title: title,
          body: body,
          channelId: channel_id,
          notification_priority: "PRIORITY_MAX",
          visibility: "PUBLIC",
          sound: channel_id,
        },
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            sound: `${channel_id}.mp3`,
          },
        },
      },
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  let res;
  await fetch(
    `https://fcm.googleapis.com/v1/projects/${firebaseProject}/messages:send`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => (res = result))
    .catch((error) => console.log("error", error));
  return res;
}

export async function kirimOTP(pesan: String, hp: String) {
  const x = {
    hp: String(hp),
    pesan: String(pesan),
    jenis_req: "kirim_otp",
  };
  const data = encryptData(JSON.stringify(x));
  const prabayar = await axios.post("https://next.sispol.id/api/mobile/v1", {
    data: data,
  });

  return true;
}

export async function cekKontakx(
  hp: String,
  email: String,
  isAdd: Boolean,
  userId: Number
) {
  if (isAdd) {
    const h = await prisma.user.findMany({
      where: {
        hp: String(hp),
      },
    });

    if (h.length > 0) {
      return {
        err: true,
        msg: "Nomor HP telah digunakan",
      };
    }
  } else {
    const h = await prisma.user.findMany({
      where: {
        NOT: { id: Number(userId) },
        hp: String(hp),
      },
    });

    if (h.length > 0) {
      return {
        err: true,
        msg: "Nomor HP telah digunakan",
      };
    }
  }

  return {
    err: false,
    msg: "HP dan Email bisa digunakan",
  };
}

export async function IDWilayah(kelId: Number) {
  const kel = await prisma.wilayah.findUnique({
    where: { id: Number(kelId) },
  });

  const kode = kel?.kode.split(".");

  const prov = await prisma.wilayah.findFirst({
    where: {
      kode: String(`${kode![0]}`),
    },
  });

  const kab = await prisma.wilayah.findFirst({
    where: {
      kode: String(`${kode![0]}.${kode![1]}`),
    },
  });

  const kec = await prisma.wilayah.findFirst({
    where: {
      kode: String(`${kode![0]}.${kode![1]}.${kode![2]}`),
    },
  });

  return {
    provId: prov?.id,
    kabId: kab?.id,
    kecId: kec?.id,
    kelId: kelId,
  };
}
