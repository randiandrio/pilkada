"use client";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { resData } from "next-auth";
import { Editor } from "@tinymce/tinymce-react";
import { apiImg, tinymceKey, uploadGambar } from "@/app/helper";
import { Berita } from "@prisma/client";
import Image from "next/image";

function Update({ reload, berita }: { reload: Function; berita: Berita }) {
  const [tanggal, setTanggal] = useState(berita.tanggal);
  const [judul, setJudul] = useState(berita.judul);
  const [deskripsi, setDeskripsi] = useState(berita.deskripsi);
  const [sumber, setSumber] = useState(berita.sumber);
  const [fotoUrlSelect, setFotoUrlSelect] = useState(
    `${apiImg}/${berita.gambar}`
  );
  const [image, setImage] = useState<File>();

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

    let urlGambar;
    const newGambar = fotoUrlSelect != `${apiImg}/${berita.gambar}`;
    if (newGambar) {
      urlGambar = await uploadGambar(
        image as File,
        "pemilu/slide",
        String(berita.gambar)
      );
    }

    const formData = new FormData();
    formData.append("mode", "update");
    formData.append("id", String(berita.id));
    formData.append("tanggal", String(tanggal));
    formData.append("judul", String(judul));
    formData.append("deskripsi", String(deskripsi));
    formData.append("sumber", String(sumber));
    formData.append("newGambar", newGambar ? "1" : "0");
    if (newGambar) formData.append("gambar", String(urlGambar));

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
    setJudul("");
    setDeskripsi("");
  }

  return (
    <div>
      <span
        onClick={handleShow}
        className="btn btn-info shadow btn-xs sharp mx-1"
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
            <Modal.Title>Update Berita</Modal.Title>
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
              <label className="col-sm-4 col-form-label">Foto Slide</label>
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
                  value={String(sumber)}
                  onChange={(e) => setSumber(e.target.value)}
                />
              </div>
            </div>
            <Editor
              onEditorChange={(newValue, editor) => {
                setDeskripsi(editor.getContent());
              }}
              apiKey={tinymceKey}
              initialValue={String(berita.deskripsi)}
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
              Update
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Update;
