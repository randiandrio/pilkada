"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Editor } from "@tinymce/tinymce-react";
import { tinymceKey } from "@/app/helper";

function Add({ reload }: { reload: Function }) {
  const [tanggal, setTanggal] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [sumber, setSumber] = useState("");

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
    formData.append("mode", "add");
    formData.append("tanggal", String(tanggal));
    formData.append("judul", String(judul));
    formData.append("deskripsi", String(deskripsi));
    formData.append("sumber", String(sumber));

    const x = await axios.patch("/konten/berita/api/post", formData);
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
    setSumber("");
  }

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light"
      >
        Tambah Berita
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
            <Modal.Title>Tambah Berita</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Tanggal Berita</label>
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
              <label className="col-sm-4 col-form-label">Judul</label>
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
              <label className="col-sm-4 col-form-label">
                URL Sumber berita
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
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