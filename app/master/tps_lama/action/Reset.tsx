"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

function Reset({ reload }: { reload: Function }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isPost, setPost] = useState(false);
  if (isPost) {
    Swal.fire({
      title: "Mohon tunggu",
      html: "Sedang reset data",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton());
      },
    });
  }

  const handleDelete = async () => {
    handleClose();
    setPost(true);
    await fetch(`/master/tps/api/reset`);
    reload();
    Swal.fire({
      title: "Success!",
      text: "Data telah dihapus",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    setPost(false);
  };

  return (
    <>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-danger light"
      >
        Reset TPS
      </button>

      <Modal
        dialogClassName="modal-md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h6 className="font-bold text-lg">
            Anda jakin akan reset data TPS ?, semua data TPS akan hilang setelah
            di reset !
          </h6>
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
            Ya, Reset
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Reset;
