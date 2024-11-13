"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";

function AddSaksi({
  reload,
  tpsId,
  isAdd,
  sUser,
}: {
  reload: Function;
  tpsId: Number;
  isAdd: boolean;
  sUser: any;
}) {
  const [listUser, setListUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState(sUser);
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
    fetch(`/koordinator/api/cari_user/${cari}`)
      .then((res) => res.json())
      .then((x) => {
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
    formData.append("userId", String(selectedUser.value));
    formData.append("tpsId", String(tpsId));
    const x = await axios.patch("/master/tps/api/PostSaksi", formData);
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
        {isAdd ? "Tambahkan Saksi" : "Ganti Saksi"}
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
            <Modal.Title>
              {isAdd ? "Tambahkan Saksi" : "Ganti Saksi"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Select
              required
              placeholder="Pilih Saksi"
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
              {isAdd ? "Tambahkan" : "Ganti"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default AddSaksi;
