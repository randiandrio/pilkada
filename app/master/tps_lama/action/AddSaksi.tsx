"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";

function AddSaksi({
  reload,
  usr,
  tpsId,
}: {
  reload: Function;
  usr: any;
  tpsId: Number;
}) {
  const [listUser, setListUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(usr);

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
    fetch(`/master/tps/api/cari_user/${cari}`)
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
    formData.append("tpsId", String(tpsId));
    formData.append("saksiId", String(selectedUser.value));
    const x = await axios.patch("/master/tps/api/post_saksi", formData);
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
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-outline-success btn-xs light"
      >
        {usr.value == 0 ? "Tambah " : "Ganti "}
        Saksi
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
            <Modal.Title>Tambah / Ganti Saksi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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

export default AddSaksi;
