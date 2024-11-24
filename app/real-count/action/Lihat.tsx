"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { apiImg } from "@/app/helper";
import axios from "axios";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { RealCount } from "@prisma/client";

function LihatC1({ realcount }: { realcount: RealCount }) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-outline-success btn-xs light"
      >
        Lihat Form C1
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Form C1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-sm-12">
            <a href={`${apiImg}/${realcount.foto}`} target="_blank">
              <Image
                src={`${apiImg}/${realcount.foto}`}
                alt=""
                height={600}
                width={600}
                className="slide mb-4 w-100 rounded"
              />
            </a>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LihatC1;
