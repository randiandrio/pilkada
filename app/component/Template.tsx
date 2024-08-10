import "material-icons/iconfont/material-icons.css";
import "bootstrap-select/dist/css/bootstrap-select.min.css";
import "../../public/template/css/style.css";

import { signOut } from "next-auth/react";
import Header from "./Header";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";

export default function Template({ children }: { children: React.ReactNode }) {
  const logout = async () => {
    Swal.fire({
      title: "Anda yakin ...",
      text: "Logut dari akun ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout sekarang!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  return (
    <div>
      <div id="preloader">
        <div className="dz-ripple">
          <div />
          <div />
        </div>
      </div>
      <div id="main-wrapper">
        <Header />
        <div className="deznav">
          <div className="deznav-scroll">
            <ul className="metismenu mm-show" id="menu">
              <li>
                <Link href="/" className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/home.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/database.png"
                      width={25}
                      height={25}
                      alt="database"
                    />
                  </div>
                  <span className="nav-text">Data Master</span>
                </a>

                <ul>
                  <li className="mini-dashboard">Data Master</li>

                  <li>
                    <Link href="/master/setting">Setting</Link>
                  </li>
                  <li>
                    <Link href="/master/halaman/jenis/profil">
                      Profil Calon
                    </Link>
                  </li>
                  <li>
                    <Link href="/master/halaman/jenis/visi-misi">
                      Visi & Misi
                    </Link>
                  </li>
                  <li>
                    <Link href="/master/halaman/jenis/syarat-ketentuan">
                      Syarat & Ketentuan
                    </Link>
                  </li>
                  <li>
                    <Link href="/master/tps">Data TPS</Link>
                  </li>
                  <li>
                    <Link href="/master/all-paslon">All Paslon</Link>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/content.png"
                      width={25}
                      height={25}
                      alt="database"
                    />
                  </div>
                  <span className="nav-text">Konten</span>
                </a>

                <ul>
                  <li className="mini-dashboard">Konten</li>

                  <li>
                    <Link href="/konten/pengumuman">Pengumuman</Link>
                  </li>

                  <li>
                    <Link href="/konten/berita">Berita</Link>
                  </li>
                  <li>
                    <Link href="/konten/notifikasi">Notifikasi</Link>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
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
                    <Link href="/koordinator/provinsi">Provinsi</Link>
                  </li>
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

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/team.png"
                      width={25}
                      height={25}
                      alt="database"
                    />
                  </div>
                  <span className="nav-text">Konstituen</span>
                </a>

                <ul>
                  <li className="mini-dashboard">Konstituen</li>

                  <li>
                    <Link href="/konstituen/simpatisan">Simpatisan</Link>
                  </li>
                  <li>
                    <Link href="/konstituen/saksi">Saksi</Link>
                  </li>
                  <li>
                    <Link href="/konstituen/timses">Timses</Link>
                  </li>
                  <li>
                    <Link href="/konstituen/paslon">Paslon</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link href={`/tugas`} className="" aria-expanded="false">
                  <div className="menu-icon">
                    <Image
                      src="/template/work.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Tugas</span>
                </Link>
              </li>

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/report.png"
                      width={25}
                      height={25}
                      alt="database"
                    />
                  </div>
                  <span className="nav-text">Laporan</span>
                </a>

                <ul>
                  <li className="mini-dashboard">Laporan</li>

                  <li>
                    <Link href="/laporan/konstituen">Konstituen</Link>
                  </li>
                  <li>
                    <Link href="/laporan/tugas">Tugas</Link>
                  </li>
                  <li>
                    <Link href="/laporan/keuangan">Keuangan</Link>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  className="has-arrow "
                  href="javascript:void(0);"
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/voting.png"
                      width={25}
                      height={25}
                      alt="database"
                    />
                  </div>
                  <span className="nav-text">Suara</span>
                </a>

                <ul>
                  <li className="mini-dashboard">Suara</li>

                  <li>
                    <Link href="/suara/proyeksi">Proyeksi</Link>
                  </li>
                  <li>
                    <Link href="/suara/real-count">Real Count</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  href={`/ganti-password`}
                  className=""
                  aria-expanded="false"
                >
                  <div className="menu-icon">
                    <Image
                      src="/template/key.png"
                      width={25}
                      height={25}
                      alt="xxx"
                    />
                  </div>
                  <span className="nav-text">Ganti Password</span>
                </Link>
              </li>
            </ul>

            <div onClick={logout} className="switch-btn">
              <a href="javascript:void(0);">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.36 6.63965C19.6184 7.89844 20.4753 9.50209 20.8223 11.2478C21.1693 12.9936 20.9909 14.803 20.3096 16.4474C19.6284 18.0918 18.4748 19.4972 16.9948 20.486C15.5148 21.4748 13.7749 22.0026 11.995 22.0026C10.2151 22.0026 8.47515 21.4748 6.99517 20.486C5.51519 19.4972 4.36164 18.0918 3.68036 16.4474C2.99909 14.803 2.82069 12.9936 3.16772 11.2478C3.51475 9.50209 4.37162 7.89844 5.63 6.63965"
                    stroke="#252525"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2V12"
                    stroke="#252525"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>

        <div className="outer-body">
          <div className="inner-body">
            <div className="content-body">
              <div className="container-fluid">{children}</div>
            </div>
          </div>
        </div>
      </div>
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/vendor/global/global.min.js`}
      />

      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/custom.js`}
      />
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/deznav-init.js`}
      />
      <script
        defer={true}
        src={`${process.env.NEXTAUTH_URL}/template/js/demo.js`}
      />
    </div>
  );
}
