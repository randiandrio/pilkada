"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Image from "next/image";
import { tampilLoading, uploadGambar } from "@/app/helper";

function AddTps({
  reload,
  wilayahId,
}: {
  reload: Function;
  wilayahId: Number;
}) {
  const [tpsNo, setTpsNo] = useState("");
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
    formData.append("wilayahId", String(wilayahId));
    formData.append("tpsNo", String(tpsNo));
    const x = await axios.patch("/master/tps/api/AddTps", formData);
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
    setTpsNo("");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah TPS
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
            <Modal.Title>Tambah TPS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Nomor TPS</label>
              <div className="col-sm-8">
                <input
                  required
                  type="number"
                  className="form-control"
                  value={tpsNo}
                  onChange={(e) => setTpsNo(e.target.value)}
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
              Tambah
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default AddTps;
