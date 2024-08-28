"use client";

import Link from "next/link";
import Image from "next/image";
import { AdminLogin } from "next-auth";

const menuBupati = (
  <li>
    <a className="has-arrow " href="javascript:void(0);" aria-expanded="false">
      <div className="menu-icon">
        <Image
          src="/template/content.png"
          width={25}
          height={25}
          alt="database"
        />
      </div>
      <span className="nav-text">Koordinator</span>
    </a>

    <ul>
      <li className="mini-dashboard">Koordinator</li>

      <li>
        <Link href="/koordinator/kabupaten">Kota / Kabupaten</Link>
      </li>
      <li>
        <Link href="/koordinator/kecamatan">Kecamatan</Link>
      </li>
      <li>
        <Link href="/koordinator/kelurahan">Kelurahan / Desa</Link>
      </li>
    </ul>
  </li>
);

const menuGubernur = (
  <li>
    <a className="has-arrow " href="javascript:void(0);" aria-expanded="false">
      <div className="menu-icon">
        <Image
          src="/template/content.png"
          width={25}
          height={25}
          alt="database"
        />
      </div>
      <span className="nav-text">Koordinator</span>
    </a>

    <ul>
      <li className="mini-dashboard">Koordinator</li>

      <li>
        <Link href="/koordinator/tingkat/Provinsi">Provinsi</Link>
      </li>

      <li>
        <Link href="/koordinator/tingkat/Kabupaten">Kota / Kabupaten</Link>
      </li>
      <li>
        <Link href="/koordinator/tingkat/Kecamatan">Kecamatan</Link>
      </li>
      <li>
        <Link href="/koordinator/tingkat/Kelurahan">Kelurahan / Desa</Link>
      </li>
    </ul>
  </li>
);

export default function Menu({ akses }: { akses: String }) {
  if (akses == "Gubernur") {
    return menuGubernur;
  } else {
    return menuBupati;
  }
}
