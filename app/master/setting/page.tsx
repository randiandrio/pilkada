"use client";
import { useEffect } from "react";
import { useState, SyntheticEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Setting, Wilayah } from "@prisma/client";
import { resData } from "next-auth";
import Image from "next/image";
import { apiImg, uploadGambar } from "../../helper";
import Select from "react-select";

const SettingPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [isPost, setPost] = useState(false);
  const [fotoUtamaSelect, setUtamaSelect] = useState("");
  const [nameUtamaImage, setUtamaImage] = useState("");
  const [imageUtama, setImageUtama] = useState<File>();
  const [fotoLoginSelect, setLoginSelect] = useState("");
  const [nameLoginImage, setLoginImage] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [imageLogin, setImageLogin] = useState<File>();
  const [listProv, setListProv] = useState<any[]>([]);
  const [listKota, setListKota] = useState<any[]>([]);
  const [fieldKota, setFieldKota] = useState(true);

  const [selectedProv, setSelectedProv] = useState({
    value: 0,
    label: "Pilih Provinsi",
  });

  const [selectedKota, setSelectedKota] = useState({
    value: 0,
    label: "Semua Kabupaten / Kota",
  });

  useEffect(() => {
    loadProv();
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/setting/api/get`)
      .then((res) => res.json())
      .then((x: any) => {
        setLoading(false);
        setUtamaSelect(`${apiImg}/${x.bgUtama}`);
        setUtamaImage(`${apiImg}/${x.bgUtama}`);
        setLoginSelect(`${apiImg}/${x.bgLogin}`);
        setLoginImage(`${apiImg}/${x.bgLogin}`);
        setJumlah(String(x.jumlahSuara));
        if (x.provId != null) {
          setSelectedProv({
            value: x.prov.id,
            label: x.prov.nama,
          });

          loadKota(x.provId);
          setFieldKota(false);
        }
        if (x.kotaId != null) {
          setSelectedKota({
            value: x.kota.id,
            label: x.kota.nama,
          });
        }
      });
  };

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

  const previewGambarUtama = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImageUtama(i);
      setUtamaSelect(URL.createObjectURL(i));
    }
  };

  const previewGambarLogin = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImageLogin(i);
      setLoginSelect(URL.createObjectURL(i));
    }
  };

  const handleSubmitUtama = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);
    let urlGambar;
    const newImage = fotoUtamaSelect != `${apiImg}/${nameUtamaImage}`;
    if (newImage) {
      urlGambar = await uploadGambar(
        imageUtama as File,
        "pemilu",
        String(nameUtamaImage)
      );
    }
    const formData = new FormData();
    if (newImage) formData.append("gambar", String(urlGambar));
    const x = await axios.patch("/master/setting/api/post_bgutama", formData);
    const pesan = (await x.data) as resData;
    reload();
    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSubmitLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);
    let urlGambar;
    const newImage = fotoLoginSelect != `${apiImg}/${nameLoginImage}`;
    if (newImage) {
      urlGambar = await uploadGambar(
        imageLogin as File,
        "pemilu",
        String(nameLoginImage)
      );
    }
    const formData = new FormData();
    if (newImage) formData.append("gambar", String(urlGambar));
    const x = await axios.patch("/master/setting/api/post_bglogin", formData);
    const pesan = (await x.data) as resData;
    reload();
    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSubmitJumlah = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("jumlah", String(jumlah));
    const x = await axios.patch("/master/setting/api/post_jumlah", formData);
    const pesan = (await x.data) as resData;
    reload();
    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleSubmitWilayahId = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("provId", String(selectedProv.value));
    formData.append("kotaId", String(selectedKota.value));
    const x = await axios.patch("/master/setting/api/post_wilayah", formData);
    const pesan = (await x.data) as resData;
    reload();
    setPost(false);
    Swal.fire({
      title: "Success",
      text: String(pesan.message),
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const loadProv = async () => {
    fetch(`/master/setting/api/load_prov`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.id,
            label: item.nama,
          };
        });
        setListProv(a);
      });
  };

  const loadKota = async (provId: Number) => {
    fetch(`/master/setting/api/load_kota/${provId}`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKota(a);
      });
  };

  const handleSelectProv = async (data: any) => {
    setSelectedProv(data);
    setFieldKota(false);
    loadKota(data.value);
  };

  const handleSelectKota = async (data: any) => {
    setSelectedKota(data);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-4 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0">
              <div className="card-header">
                <h4 className="card-title">Jumlah Suara Wilayah Pemilihan</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitJumlah}>
                  <div className="col-sm-12 mb-3">
                    <input
                      type="number"
                      className="form-control"
                      value={String(jumlah)}
                      onChange={(e) => setJumlah(e.target.value)}
                      required
                    />
                  </div>
                  <div
                    className="toolbar toolbar-bottom"
                    role="toolbar"
                    style={{ textAlign: "right" }}
                  >
                    <button type="submit" className="btn btn-primary light">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0">
              <div className="card-header">
                <h4 className="card-title">Wilayah Pemilihan</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitWilayahId}>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <Select
                        required
                        placeholder="Pilih Provinsi"
                        className="basic-single mt-1"
                        classNamePrefix="select"
                        isSearchable={true}
                        options={listProv}
                        value={selectedProv}
                        noOptionsMessage={(e) => {
                          return "Provinsi tidak ditemukan";
                        }}
                        onChange={(e) => handleSelectProv(e!)}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <Select
                        isDisabled={fieldKota}
                        placeholder="Semua Kabupaten / Kota"
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

                  <div
                    className="toolbar toolbar-bottom"
                    role="toolbar"
                    style={{ textAlign: "right" }}
                  >
                    <button type="submit" className="btn btn-primary light">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0">
              <div className="card-header">
                <h4 className="card-title">Background Utama</h4>
              </div>
              <Image
                src={fotoUtamaSelect}
                alt=""
                height={400}
                width={300}
                className="slide mb-2 w-100"
              />
              <div className="card-body">
                <form onSubmit={handleSubmitUtama}>
                  <input
                    required
                    type="file"
                    className="form-control mb-3"
                    onChange={previewGambarUtama}
                  />

                  <div
                    className="toolbar toolbar-bottom"
                    role="toolbar"
                    style={{ textAlign: "right" }}
                  >
                    <button type="submit" className="btn btn-primary light">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0">
              <div className="card-header">
                <h4 className="card-title">Background Halaman Login</h4>
              </div>
              <Image
                src={fotoLoginSelect}
                alt=""
                height={400}
                width={300}
                className="slide mb-2 w-100"
              />
              <div className="card-body">
                <form onSubmit={handleSubmitLogin}>
                  <input
                    required
                    type="file"
                    className="form-control mb-3"
                    onChange={previewGambarLogin}
                  />

                  <div
                    className="toolbar toolbar-bottom"
                    role="toolbar"
                    style={{ textAlign: "right" }}
                  >
                    <button type="submit" className="btn btn-primary light">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
