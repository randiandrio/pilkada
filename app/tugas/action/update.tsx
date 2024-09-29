"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";

function Update({ reload, data }: { reload: Function; data: any }) {
  const [listUser, setListUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState({
    value: data.user.id,
    label: data.user.nama,
  });

  const [judul, setJudul] = useState(data.judul);
  const [deskripsi, setDeskripsi] = useState(data.deskripsi);
  const [jumlah, setJumlah] = useState(data.jumlah);
  const [deadline, setDeadline] = useState(data.deadline);

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

  const loadUser = async (cari: String) => {
    fetch(`/tugas/api/cari_user/${cari}`)
      .then((res) => res.json())
      .then((x) => {
        console.log(x);
        var a = x.map(function (item: any) {
          return {
            value: item.id,
            label: item.nama,
          };
        });
        setListUser(a);
      });
  };

  const handleSelectUser = async (data: any) => {
    setSelectedUser(data);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setPost(true);

    const formData = new FormData();
    formData.append("mode", "update");
    formData.append("id", String(data.id));
    formData.append("userId", String(selectedUser.value));
    formData.append("judul", String(judul));
    formData.append("deskripsi", String(deskripsi));
    formData.append("jumlah", String(jumlah));
    formData.append("deadline", String(deadline));
    const x = await axios.patch("/tugas/api/post", formData);
    const pesan = (await x.data) as resData;
    if (!pesan.error) {
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

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-info shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-edit"></i>
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        enforceFocus={false}
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Tugas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Pilih Anggota</label>
              <div className="col-sm-8">
                <Select
                  required
                  placeholder="Pilih member"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={listUser}
                  value={selectedUser}
                  noOptionsMessage={(e) => {
                    return e.inputValue.length > 2 && listUser.length == 0
                      ? "User tidak ditemukan"
                      : "Ketik min 3 huruf";
                  }}
                  onInputChange={(e) => {
                    if (e.length > 2) {
                      loadUser(String(e));
                    } else {
                      setListUser([]);
                    }
                  }}
                  onChange={(e) => handleSelectUser(e!)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Judul Tugas</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Deskripsi Tugas</label>
              <div className="col-sm-8">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Jumlah Tugas</label>
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
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Deadline Tugas</label>
              <div className="col-sm-8">
                <input
                  required
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
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
              Perbarui
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
