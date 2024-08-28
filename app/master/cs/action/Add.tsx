"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Image from "next/image";
import { tampilLoading, uploadGambar } from "@/app/helper";

function Add({ reload }: { reload: Function }) {
  const [nama, setNama] = useState("");
  const [jamOperasional, setJamOperasional] = useState("");
  const [url, setUrl] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [image, setImage] = useState<File>();
  const [fotoUrlSelect, setFotoUrlSelect] = useState("/template/noimage.jpg");
  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const previewGambar = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setFotoUrlSelect(URL.createObjectURL(i));
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const urlGambar = await uploadGambar(image as File, "cs", "");

    const formData = new FormData();
    formData.append("method", "add");
    formData.append("nama", nama);
    formData.append("url", url);
    formData.append("jamOperasional", jamOperasional);
    formData.append("gambar", String(urlGambar));
    const x = await axios.patch("/master/cs/api/post", formData);
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
    setNama("");
    setUrl("");
    setFotoUrlSelect("/template/noimage.jpg");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah CS
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
            <Modal.Title>Tambahkan Customer Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-12">
              <div className="author-profile">
                <div className="author-media">
                  <Image src={fotoUrlSelect} width={200} height={200} alt="" />

                  <div
                    className="upload-link"
                    title=""
                    data-toggle="tooltip"
                    data-placement="right"
                    data-original-title="update"
                  >
                    <input
                      required
                      type="file"
                      onChange={previewGambar}
                      className="update-flie"
                    />
                    <i className="fa fa-camera"></i>
                  </div>
                </div>
              </div>
            </div>

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
              <label className="col-sm-4 col-form-label">Jam Operasional</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={jamOperasional}
                  onChange={(e) => setJamOperasional(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Set URL</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
