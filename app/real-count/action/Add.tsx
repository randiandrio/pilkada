"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";

function Add({ reload, listKota }: { reload: Function; listKota: any[] }) {
  const [selectedKota, setSelectedKota] = useState({
    value: "",
    label: "Pilih Kota / Kabupaten",
  });
  const handleSelectKota = async (data: any) => {
    setSelectedKota(data);
  };

  const [lisKecamatan, setListKecamatan] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState({
    value: "",
    label: "Pilih Kecamatan",
  });

  const [lisKelurahan, setListKelurahan] = useState<any[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState({
    value: "",
    label: "Pilih Desa/Kelurahan",
  });

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

    const formData = new FormData();
    formData.append("mode", "add");
    const x = await axios.patch("/master/all-paslon/api/post", formData);
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

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light mb-5"
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
