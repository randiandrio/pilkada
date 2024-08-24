"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Editor } from "@tinymce/tinymce-react";
import { tampilLoading, tinymceKey, uploadGambar } from "@/app/helper";
import Image from "next/image";

function Add({ reload }: { reload: Function }) {
  const [tanggal, setTanggal] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamat, setAlamat] = useState("");

  const [fotoUrlSelect, setFotoUrlSelect] = useState("/template/noimage.jpg");
  const [image, setImage] = useState<File>();

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [isPost, setPost] = useState(false);

  if (isPost) {
    tampilLoading();
  }

  const previewGambar = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setFotoUrlSelect(URL.createObjectURL(i));
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setPost(true);

    const urlGambar = await uploadGambar(image as File, "pemilu/agenda", "");
    const formData = new FormData();
    formData.append("mode", "add");
    formData.append("tanggal", String(tanggal));
    formData.append("judul", String(judul));
    formData.append("deskripsi", String(deskripsi));
    formData.append("gambar", String(urlGambar));
    formData.append("alamat", String(alamat));

    const x = await axios.patch("/konten/agenda/api/post", formData);
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

  function clearForm() {
    setTanggal("");
    setJudul("");
    setDeskripsi("");
    setAlamat("");
    setFotoUrlSelect("/template/noimage.jpg");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah Agenda
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
            <Modal.Title>Tambah Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={fotoUrlSelect}
              alt=""
              height={300}
              width={300}
              className="slide mb-4 w-100 rounded"
            />

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Foto Agenda</label>
              <div className="col-sm-8">
                <input
                  required
                  type="file"
                  className="form-control"
                  onChange={previewGambar}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tanggal Agenda</label>
              <div className="col-sm-8">
                <input
                  required
                  type="date"
                  className="form-control"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Judul Agenda</label>
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
              <label className="col-sm-4 col-form-label">Alamat Agenda</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>
            <Editor
              onEditorChange={(newValue, editor) => {
                setDeskripsi(editor.getContent());
              }}
              apiKey={tinymceKey}
              init={{
                height: 600,
                menubar: "file edit view insert format tools table help",
                plugins:
                  "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
                toolbar:
                  "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
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

export default Add;
