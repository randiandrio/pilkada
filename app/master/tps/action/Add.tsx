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
  const [jumlah, setJumlah] = useState<any[]>([]);
  const [selectedKota, setSelectedKota] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => {
    if (defKec.length > 0) {
      setJumlah([]);
      let arr: any = [];
      for (let i = 0; i < defKec.length; i++) {
        arr.push({
          kotaId: Number(listKota[0].value),
          kecId: Number(defKec[i].value),
          jumlah: 0,
        });
      }
      setJumlah(arr);
    }
    setShow(true);
  };

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const onChangeJumlah = async (index: Number, jml: Number) => {
    let arr = jumlah;
    arr[Number(index)].jumlah = jml;
    setJumlah(arr);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);
    const dataTPS = JSON.stringify(jumlah);
    const formData = new FormData();
    formData.append("data", dataTPS);
    const x = await axios.patch("/master/tps/api/generate_tps", formData);
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
        let arr: any = [];
        var a = x.map(function (item: any) {
          arr.push({
            kotaId: Number(data.value),
            kecId: Number(item.id),
            jumlah: 0,
          });
          return {
            value: item.id,
            label: item.nama,
          };
        });
        setJumlah(arr);
        setKecs(a);
        setIsLoading(false);
      });
  };

  return (
    <>
      <button
        onClick={handleShow}
        type="button"
        className="btn me-2 btn-primary light"
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
                        onChange={(e) =>
                          onChangeJumlah(Number(index), Number(e.target.value))
                        }
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
                        onChange={(e) =>
                          onChangeJumlah(Number(index), Number(e.target.value))
                        }
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
    </>
  );
}

export default GenerateTPS;
