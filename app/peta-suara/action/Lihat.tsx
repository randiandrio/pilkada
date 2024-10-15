"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { apiImg } from "@/app/helper";
import axios from "axios";
import Swal from "sweetalert2";
import { resData } from "next-auth";

function Lihat({ user, reload }: { user: any; reload: Function }) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);
  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang verfikasi data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleVerifikasi = async () => {
    Swal.fire({
      title: "Anda yakin ...",
      text: "Memverifikasi Data Ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Verifikasi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPost(true);
        const formData = new FormData();
        formData.append("method", "verifikasi");
        formData.append("id", String(user.id));
        const x = await axios.patch("/peta-suara/api/post", formData);
        const hasil = (await x.data) as resData;
        if (!hasil.error) {
          reload();
          handleClose();
          setPost(false);
          Swal.fire({
            title: "Success!",
            text: String(hasil.message),
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-outline-success btn-xs light"
      >
        Lihat Data
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Data Konstituen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-sm-12">
            <a href={`${apiImg}/${user.dukungan}`} target="_blank">
              <Image
                src={`${apiImg}/${user.dukungan}`}
                alt=""
                height={300}
                width={300}
                className="slide mb-4 w-100 rounded"
              />
            </a>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <table>
                <tr>
                  <td width={140}>Nama</td>
                  <td width={20}>:</td>
                  <td>{user.nama}</td>
                </tr>
                <tr>
                  <td>NIK</td>
                  <td>:</td>
                  <td>{user.nik}</td>
                </tr>
                <tr>
                  <td>TTL</td>
                  <td>:</td>
                  <td>
                    {user.tempatLahir}, {user.tanggalLahir}
                  </td>
                </tr>
                <tr>
                  <td>Jenis Kelamin</td>
                  <td>:</td>
                  <td>{user.jenisKelamin}</td>
                </tr>
                <tr>
                  <td>Kota / Kabupaten</td>
                  <td>:</td>
                  <td>{user.kab.nama}</td>
                </tr>
                <tr>
                  <td>Kecamatan</td>
                  <td>:</td>
                  <td>{user.kec.nama}</td>
                </tr>
                <tr>
                  <td>Kelurahan / Desa</td>
                  <td>:</td>
                  <td>{user.kel.nama}</td>
                </tr>
              </table>
            </div>

            <div className="col-sm-6">
              <table>
                <tr>
                  <td width={140}>No. Handphone</td>
                  <td width={20}>:</td>
                  <td>{user.hp}</td>
                </tr>
                <tr>
                  <td>No. Wa</td>
                  <td>:</td>
                  <td>{user.wa}</td>
                </tr>
                <tr>
                  <td>Refferal</td>
                  <td>:</td>
                  <td>{user.refferal ? user.refferal.nama : "-"}</td>
                </tr>
                <tr>
                  <td>Jabatan</td>
                  <td>:</td>
                  <td>{user.jabatan}</td>
                </tr>
                <tr>
                  <td>Status Data</td>
                  <td>:</td>
                  <td>
                    {user.terverifikasi > 0
                      ? "Terverifikasi"
                      : "Belum Diverifikasi"}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger light"
            onClick={handleClose}
          >
            Close
          </button>
          {user.terverifikasi == 0 && (
            <button
              type="button"
              className="btn btn-success light"
              onClick={handleVerifikasi}
            >
              Verifikasi Data
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Lihat;
