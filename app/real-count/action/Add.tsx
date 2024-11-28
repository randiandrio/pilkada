"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";
import { Paslon } from "@prisma/client";
import { uploadGambar } from "@/app/helper";
import Image from "next/image";

function Add({
  reload,
  listKota,
  paslon,
}: {
  reload: Function;
  listKota: any[];
  paslon: Paslon[];
}) {
  let s = [];
  for (let i = 0; i < paslon.length; i++) {
    s.push(0);
  }

  const [suaraSah, setsuaraSah] = useState(0);
  const [suaraBatal, setsuaraBatal] = useState(0);
  const [suaraSisa, setsuaraSisa] = useState(0);
  const [mulai, setmulai] = useState("08:00");
  const [selesai, setselesai] = useState("12:00");
  const [catatan, setcatatan] = useState("");
  const [suara, setSuara] = useState(s);
  const [newFoto, setNewFoto] = useState(false);
  const [image, setImage] = useState<File>();
  const [fotoUrlSelect, setFotoUrlSelect] = useState("/template/noimage.jpg");

  const previewGambar = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setFotoUrlSelect(URL.createObjectURL(i));
      setNewFoto(true);
    }
  };

  const [selectedKota, setSelectedKota] = useState({
    value: "",
    label: "Pilih Kota / Kabupaten",
  });
  const handleSelectKota = async (data: any) => {
    setSelectedKota(data);
    loadKecamatan(data.value);
  };

  const [lisKecamatan, setListKecamatan] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState({
    value: "",
    label: "Pilih Kecamatan",
  });
  const handleSelectKecamatan = async (data: any) => {
    setSelectedKecamatan(data);
    loadKelurahan(data.value);
  };

  const [lisKelurahan, setListKelurahan] = useState<any[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState({
    value: "",
    label: "Pilih Desa/Kelurahan",
  });
  const handleSelectKelurahan = async (data: any) => {
    setSelectedKelurahan(data);
    loadTPS(data.value);
  };

  const [listTPS, setListTPS] = useState<any[]>([]);
  const [selectedTPS, setSelectedTPS] = useState({
    value: "",
    label: "Pilih TPS",
  });
  const handleSelectTPS = async (data: any) => {
    setSelectedTPS(data);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang mengirim data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    let urlGambar = "/template/noimage.jpg";
    if (newFoto) {
      urlGambar = await uploadGambar(image as File, "c1", "");
    }

    const formData = new FormData();
    formData.append("tpsId", String(selectedTPS.value));
    formData.append("suaraSah", String(suaraSah));
    formData.append("suaraBatal", String(suaraBatal));
    formData.append("suaraSisa", String(suaraSisa));
    formData.append("mulai", mulai);
    formData.append("selesai", selesai);
    formData.append("catatan", catatan);
    formData.append("suaras", JSON.stringify(suara));
    formData.append("foto", urlGambar);
    const x = await axios.patch("/real-count/api/post_c1", formData);
    const pesan = (await x.data) as resData;
    if (!pesan.error) {
      clearForm();
      handleClose();
      reload();
    }
    setPost(false);
    Swal.fire({
      title: pesan.error ? "Error" : "Success!",
      text: String(pesan.message),
      icon: pesan.error ? "error" : "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  function clearForm() {}

  const loadKecamatan = async (kotaId: String) => {
    fetch(`/real-count/api/load_kecamatan/${kotaId}`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKecamatan(a);
      });
  };

  const loadKelurahan = async (kecId: String) => {
    fetch(`/real-count/api/load_kelurahan/${kecId}`)
      .then((res) => res.json())
      .then((x) => {
        console.log(x);
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKelurahan(a);
      });
  };

  const loadTPS = async (kelId: String) => {
    fetch(`/real-count/api/load_tps/${kelId}`)
      .then((res) => res.json())
      .then((x) => {
        console.log(x);
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListTPS(a);
      });
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah Data Real Count
      </button>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Data Real Count</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Pilih Kota / Kabupaten
              </label>
              <div className="col-sm-8">
                <Select
                  placeholder="Pilih Kota / Kabupaten"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={listKota}
                  value={selectedKota}
                  noOptionsMessage={(e) => {
                    return "Kabupaten / Kota tidak ditemukan";
                  }}
                  onChange={(e) => handleSelectKota(e!)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Pilih Kecamatan</label>
              <div className="col-sm-8">
                <Select
                  placeholder="Pilih Kecamatan"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={lisKecamatan}
                  value={selectedKecamatan}
                  noOptionsMessage={(e) => {
                    return "Kecamatan tidak ditemukan";
                  }}
                  onChange={(e) => handleSelectKecamatan(e!)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Pilih Desa/Kelurahan
              </label>
              <div className="col-sm-8">
                <Select
                  placeholder="Pilih Desa/Kelurahan"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={lisKelurahan}
                  value={selectedKelurahan}
                  noOptionsMessage={(e) => {
                    return "Desa/Kelurahan tidak ditemukan";
                  }}
                  onChange={(e) => handleSelectKelurahan(e!)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Pilih TPS</label>
              <div className="col-sm-8">
                <Select
                  placeholder="Pilih TPS"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={listTPS}
                  value={selectedTPS}
                  noOptionsMessage={(e) => {
                    return "TPS tidak ditemukan";
                  }}
                  onChange={(e) => handleSelectTPS(e!)}
                />
              </div>
            </div>

            <div className="my-3 row">
              {paslon.map((x: Paslon, index: number) => (
                <div key={x.id} className="col-md-12">
                  <label className="col-sm-12 col-form-label">
                    Jumlah Suara : {x.calon} / {x.wakil}
                  </label>
                  <div className="col-sm-12">
                    <input
                      required
                      type="number"
                      className="form-control"
                      value={suara[index]} // Pastikan nilai defaultnya tidak undefined
                      onChange={(e) => {
                        let s = suara;
                        s[index] = Number(e.target.value);
                        setSuara(s);

                        let total = 0;

                        for (let i = 0; i < s.length; i++) {
                          total += s[i];
                        }

                        setsuaraSah(total);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-6">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Suara Sah</label>
                  <div className="col-sm-8">
                    <input
                      required
                      type="number"
                      className="form-control"
                      value={suaraSah}
                      onChange={(e) => setsuaraSah(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Suara Batal</label>
                  <div className="col-sm-8">
                    <input
                      required
                      type="number"
                      className="form-control"
                      value={suaraBatal}
                      onChange={(e) => setsuaraBatal(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Suara Sisa</label>
                  <div className="col-sm-8">
                    <input
                      required
                      type="number"
                      className="form-control"
                      value={suaraSisa}
                      onChange={(e) => setsuaraSisa(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Jam Mulai</label>
                  <div className="col-sm-8">
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={mulai}
                      onChange={(e) => setmulai(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Jam Selesai</label>
                  <div className="col-sm-8">
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={selesai}
                      onChange={(e) => setselesai(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Catatan</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={catatan}
                      onChange={(e) => setcatatan(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <Image
                src={fotoUrlSelect}
                layout="responsive"
                width={100}
                height={30}
                alt=""
              />
            </div>

            <div className="mt-3 row">
              <label className="col-sm-4 col-form-label">Foto Form C1</label>
              <div className="col-sm-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={previewGambar}
                />
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
              Simpan
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Add;
