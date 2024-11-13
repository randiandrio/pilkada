"use client";
import { useState, SyntheticEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { resData } from "next-auth";

const NotifikasiPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [isPost, setPost] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

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

    const formData = new FormData();
    formData.append("judul", String(judul));
    const x = await axios.patch("#", formData);
    const pesan = (await x.data) as resData;
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
      <div className="row">
        <div className="col-xl-6 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0">
              <div className="card-header">
                <h4 className="card-title">Notifikasi</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="col-sm-12 mb-3">
                    <input
                      type="text"
                      placeholder="Judul Notifikasi"
                      className="form-control"
                      value={String(judul)}
                      onChange={(e) => setJudul(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-12 mb-3">
                    <input
                      type="text"
                      placeholder="Isi Notifikasi"
                      className="form-control"
                      value={String(deskripsi)}
                      onChange={(e) => setDeskripsi(e.target.value)}
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
      </div>
    </div>
  );
};

export default NotifikasiPage;
