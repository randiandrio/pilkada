"use client";
import { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function Delete({
  wilayahId,
  reload,
}: {
  wilayahId: Number;
  reload: Function;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isPost, setPost] = useState(false);
  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang menghapus data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleDelete = async () => {
    handleClose();
    setPost(true);
    const formData = new FormData();
    formData.append("mode", "delete");
    formData.append("id", String(wilayahId));
    const x = await axios.patch("/koordinator/api/post", formData);
    reload();
    setPost(false);
    Swal.fire({
      title: "Success!",
      text: "Data telah dihapus",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-outline-danger btn-xs light mx-1"
      >
        <i className="fa fa-trash"></i>
      </span>

      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h6 className="font-bold text-lg">Anda akin menghapus data ini ?</h6>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-warning light"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-danger light"
            onClick={() => handleDelete()}
          >
            Ya, Hapus
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Delete;
