"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { tampilLoading, uploadGambar } from "@/app/helper";
import { Wilayah } from "@prisma/client";

function Generate({ reload, wilayah }: { reload: Function; wilayah: Wilayah }) {
  const [jumlah, setJumlah] = useState("");

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
    formData.append("method", "Generate");
    formData.append("kelId", String(wilayah.id));
    formData.append("jumlah", String(jumlah));
    const x = await axios.patch("/master/tps/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
      clearForm();
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

  function clearForm() {
    setJumlah("");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-outline-success btn-xs light"
      >
        Generate TPS
      </button>

      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Generate TPS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Kota / Kabupaten
              </label>
              <div className="col-sm-8">
                <input
                  readOnly
                  type="text"
                  className="form-control"
                  value={String(wilayah.kabupaten)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Kecamatan</label>
              <div className="col-sm-8">
                <input
                  readOnly
                  type="text"
                  className="form-control"
                  value={String(wilayah.kecamatan)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">
                Desa / Kelurahan
              </label>
              <div className="col-sm-8">
                <input
                  readOnly
                  type="text"
                  className="form-control"
                  value={String(wilayah.kelurahan)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jumlah TPS</label>
              <div className="col-sm-8">
                <input
                  required
                  type="number"
                  className="form-control"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
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
              Generate
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Generate;
