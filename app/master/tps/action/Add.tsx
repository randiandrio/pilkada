"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { tampilLoading } from "@/app/helper";
import Select from "react-select";

function GenerateTPS({
  reload,
  listKota,
  defKec,
}: {
  reload: Function;
  listKota: any[];
  defKec: any[];
}) {
  const [kecs, setKecs] = useState<any>([]);
  const [jumlah, setJumlah] = useState(0);
  const [selectedKota, setSelectedKota] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);

    const formData = new FormData();
    formData.append("method", "add");

    const x = await axios.patch("/master/cs/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
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

  const handleSelectKota = async (data: any) => {
    setSelectedKota(data);
    setIsLoading(true);
    setKecs([]);
    fetch(`/master/tps/api/load_kec_tps/${data.value}`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.id,
            label: item.nama,
          };
        });
        setKecs(a);
        console.log(a);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Generate TPS
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
            <Modal.Title>Generate TPS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-5 col-form-label mt-1">
                Kabupaten / Kota
              </label>
              <div className="col-sm-7">
                <Select
                  required
                  isDisabled={listKota.length == 1}
                  placeholder="Pilih Kabupaten / Kota"
                  className="basic-single mt-1"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={listKota}
                  value={listKota.length > 1 ? selectedKota : listKota[0]}
                  noOptionsMessage={(e) => {
                    return "Kabupaten / Kota tidak ditemukan";
                  }}
                  onChange={(e) => handleSelectKota(e!)}
                />
              </div>
            </div>

            {defKec.length > 0 &&
              defKec.map((a: any, index: Number) => (
                <>
                  <hr />
                  <div key={a.value} className="mb-3 row">
                    <label className="col-10 col-form-label mt-1">
                      {Number(index) + 1}.&nbsp;&nbsp;&nbsp; Jumlah TPS Kec.{" "}
                      {a.label}
                    </label>
                    <div className="col-2">
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => setJumlah(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </>
              ))}
            {isLoading && "Mohon tunggu sedang memuat data ..."}
            {defKec.length == 0 &&
              kecs.length > 0 &&
              kecs.map((a: any, index: Number) => (
                <>
                  <hr />
                  <div key={a.value} className="mb-3 row">
                    <label className="col-10 col-form-label mt-1">
                      {Number(index) + 1}. &nbsp;&nbsp;&nbsp; Jumlah TPS Kec.{" "}
                      {a.label}
                    </label>
                    <div className="col-2">
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => setJumlah(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </>
              ))}
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
              Generate
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default GenerateTPS;
