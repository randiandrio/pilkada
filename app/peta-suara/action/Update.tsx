"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Image from "next/image";
import { apiImg, tampilLoading } from "@/app/helper";

function Update({ reload, user }: { reload: Function; user: any }) {
  const [jabatan, setJabatan] = useState(user.jabatan);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "update");
    formData.append("id", String(user.id));
    formData.append("jabatan", String(jabatan));
    const x = await axios.patch("/peta-suara/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
      handleClose();
      reload();
    }

    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
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
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Data Konstituen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-12">
              <Image
                src={`${apiImg}/${user.dukungan}`}
                alt=""
                height={300}
                width={300}
                className="slide mb-4 w-100 rounded"
              />
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
                    <td>Nama Refferal</td>
                  </tr>
                  <tr>
                    <td>Jabatan</td>
                    <td>:</td>
                    <td>{user.jabatan}</td>
                  </tr>
                </table>

                <div className="col-sm-12 mt-4">
                  <select
                    required
                    className="form-control"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                  >
                    <option value="Simpatisan">Simpatisan</option>
                    <option value="Timses">Timses</option>
                  </select>
                </div>
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
            <button type="submit" className="btn btn-primary light">
              Update
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
