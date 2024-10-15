"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { tampilLoading } from "@/app/helper";

function Update({ reload, user }: { reload: Function; user: any }) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async () => {
    loadProv();
    setShow(true);
  };

  const x = String(user.tanggalLahir).split("/");
  const tgl = `${x[2]}-${x[1]}-${x[0]}`;
  const [isPost, setPost] = useState(false);
  const [nama, setNama] = useState(String(user.nama));
  const [hp, setHp] = useState(String(user.hp));
  const [wa, setWa] = useState(String(user.wa));
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState(String(user.nik));
  const [tempatLahir, setTempatLahir] = useState(String(user.tempatLahir));
  const [tanggalLahir, setTanggalLahir] = useState(String(tgl));
  const [jenisKelamin, setJenisKelamin] = useState(String(user.jenisKelamin));
  const [provId, setProvId] = useState(String(user.provId));
  const [kabId, setKabId] = useState(String(user.kabId));
  const [kecId, setKecId] = useState(String(user.kecId));
  const [kelId, setKelId] = useState(String(user.kelId));
  const [refId, setRefId] = useState(String(user.refId ?? ""));
  const [jabatan, setJabatan] = useState(String(user.jabatan));
  const [terverifikasi, setTerverifikasi] = useState(
    String(user.terverifikasi)
  );

  const [listProv, setListProv] = useState([]);
  const [listKab, setListKab] = useState([]);
  const [listKec, setListKec] = useState([]);
  const [listKel, setListKel] = useState([]);

  const [disKec, setDisKec] = useState(false);
  const [disKel, setDisKel] = useState(false);

  const loadProv = async () => {
    fetch(`/peta-suara/api/user_prov`)
      .then((res) => res.json())
      .then((x) => {
        setListProv(x);
        loadKab(provId);
        loadKec(kabId);
        loadKel(kecId);
      });
  };

  const loadKab = async (x: String) => {
    fetch(`/peta-suara/api/user_kab/${x}`)
      .then((res) => res.json())
      .then((x) => {
        setListKab(x);
      });
  };

  const loadKec = async (x: String) => {
    fetch(`/peta-suara/api/user_kec/${x}`)
      .then((res) => res.json())
      .then((x) => {
        setListKec(x);
      });
  };

  const loadKel = async (x: String) => {
    fetch(`/peta-suara/api/user_kel/${x}`)
      .then((res) => res.json())
      .then((x) => {
        setListKel(x);
      });
  };

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "update");
    formData.append("id", String(user.id));
    formData.append("nama", String(nama));
    formData.append("hp", String(hp));
    formData.append("wa", String(wa));
    formData.append("password", String(password));
    formData.append("nik", String(nik));
    formData.append("tempatLahir", String(tempatLahir));
    formData.append("tanggalLahir", String(tanggalLahir));
    formData.append("jenisKelamin", String(jenisKelamin));
    formData.append("provId", String(provId));
    formData.append("kabId", String(kabId));
    formData.append("kecId", String(kecId));
    formData.append("kelId", String(kelId));
    formData.append("refId", String(refId));
    formData.append("jabatan", String(jabatan));
    formData.append("terverifikasi", String(terverifikasi));
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
        className="btn btn-outline-secondary btn-xs light mx-1"
      >
        <i className="fa fa-edit"></i>
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
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Nama</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">HP</label>
              <div className="col-sm-8">
                <input
                  required
                  type="tel"
                  className="form-control"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">WhatsApp</label>
              <div className="col-sm-8">
                <input
                  required
                  type="tel"
                  className="form-control"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Password</label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small>*Kosongkan jika tidak diganti</small>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">NIK</label>
              <div className="col-sm-8">
                <input
                  required
                  type="number"
                  className="form-control"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tempat Lahir</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tanggal Lahir</label>
              <div className="col-sm-8">
                <input
                  required
                  type="date"
                  className="form-control"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jenis Kelamin</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value)}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Provinsi</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={provId}
                  onChange={(e) => {
                    setProvId(e.target.value);
                    loadKab(e.target.value);
                    setKabId("");
                    setKecId("");
                    setKelId("");
                    setDisKec(true);
                    setDisKel(true);
                  }}
                >
                  {listProv.map((x: any) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Kota / Kabupaten
              </label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={kabId}
                  onChange={(e) => {
                    setKabId(e.target.value);
                    loadKec(e.target.value);
                    setKecId("");
                    setKelId("");
                    setDisKec(false);
                    setDisKel(true);
                  }}
                >
                  <option value="">Pilih Kota / Kabupaten</option>
                  {listKab.map((x: any) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Kecamatan</label>
              <div className="col-sm-8">
                <select
                  required
                  disabled={disKec}
                  className="form-control"
                  value={kecId}
                  onChange={(e) => {
                    setKecId(e.target.value);
                    loadKel(e.target.value);
                    setKelId("");
                    setDisKel(false);
                  }}
                >
                  <option value="">Pilih Kecamatan</option>
                  {listKec.map((x: any) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Kelurahan / Desa
              </label>
              <div className="col-sm-8">
                <select
                  required
                  disabled={disKel}
                  className="form-control"
                  value={kelId}
                  onChange={(e) => setKelId(e.target.value)}
                >
                  <option value="">Pilih Kelurahan / Desa</option>
                  {listKel.map((x: any) => (
                    <option key={x.id} value={x.id}>
                      {x.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Refferal</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jabatan</label>
              <div className="col-sm-8">
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

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Terverifikasi</label>
              <div className="col-sm-8">
                <select
                  required
                  className="form-control"
                  value={terverifikasi}
                  onChange={(e) => setTerverifikasi(e.target.value)}
                >
                  <option value="1">Terverifikasi</option>
                  <option value="0">Belum Diverifikasi</option>
                </select>
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
