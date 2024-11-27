"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import Select from "react-select";
import { Paslon } from "@prisma/client";
import { apiImg, uploadGambar } from "@/app/helper";
import Image from "next/image";

function Update({
  reload,
  realcountId,
  paslon,
  foto,
}: {
  reload: Function;
  realcountId: Number;
  paslon: Paslon[];
  foto: String;
}) {
  let s = [];
  for (let i = 0; i < paslon.length; i++) {
    s.push(0);
  }
  const [suaras, setSuaras] = useState(s);

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
    formData.append("realcountId", String(realcountId));
    formData.append("suaras", JSON.stringify(suaras));
    const x = await axios.patch("/real-count/api/perbaikan", formData);
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

  console.log(paslon);

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-danger shadow btn-xs sharp mx-1"
      >
        <i className="fa fa-edit"></i>
      </span>

      <Modal
        dialogClassName="modal-lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Perbaikan RealCount</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12">
              <Image
                src={`${apiImg}/${foto}`}
                layout="responsive"
                width={100}
                height={30}
                alt=""
              />
            </div>

            <div className="my-3 row">
              {paslon.map((x: Paslon, index: number) => (
                <div key={x.id} className="col-md-12">
                  <label className="col-sm-12 col-form-label">
                    Jumlah Suara : {x.calon} / {x.wakil}
                  </label>
                  <div className="col-sm-12">
                    <input
                      required
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        let s = suaras;
                        s[index] = Number(e.target.value);
                        setSuaras(s);

                        let total = 0;

                        for (let i = 0; i < s.length; i++) {
                          total += s[i];
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
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

export default Update;
