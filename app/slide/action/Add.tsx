"use client";
import { useState, SyntheticEvent, useRef, useMemo, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Image from "next/image";
import { tampilLoading, tinymceKey, uploadGambar } from "@/app/helper";
import { resData } from "next-auth";
import { Editor } from "@tinymce/tinymce-react";

function Add({ reload }: { reload: Function }) {
  const [title, setTitle] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tampilkan, setTampilkan] = useState(true);
  const [fotoUrlSelect, setFotoUrlSelect] = useState("/template/noimage.jpg");
  const [image, setImage] = useState<File>();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function clearForm() {
    setTitle("");
    setDeskripsi("");
    setTampilkan(true);
    setFotoUrlSelect("/template/noimage.jpg");
  }

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

    const urlGambar = await uploadGambar(image as File, "pemilu/slide", "");
    const formData = new FormData();
    formData.append("method", "add");
    formData.append("title", title);
    formData.append("deskripsi", deskripsi);
    formData.append("new", "1");
    formData.append("gambar", String(urlGambar));
    formData.append("isShow", tampilkan ? "1" : "0");
    const x = await axios.patch("/slide/api/post", formData);
    const pesan = (await x.data) as resData;

    if (!pesan.error) {
      clearForm();
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

  return (
    <div>
      <button
        onClick={handleShow}
        type="button"
        className="btn btn-primary light mb-2"
      >
        Tambah Slide
      </button>

      <Modal
        dialogClassName="modal-lg"
        enforceFocus={false}
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Data Slide</Modal.Title>
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
              <label className="col-sm-3 col-form-label">Foto Slide</label>
              <div className="col-sm-9">
                <input
                  required
                  type="file"
                  className="form-control"
                  onChange={previewGambar}
                />
              </div>
            </div>
            <div className="row">
              <label className="col-sm-3 col-form-label">Judul Slide</label>
              <div className="col-sm-9">
                <input
                  required
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-3 mt-2 col-form-label">Tampilkan</label>
              <div className="col-sm-9">
                <input
                  checked={tampilkan}
                  type="checkbox"
                  className="form-check-input my-3"
                  id="c3"
                  onChange={(e) => setTampilkan(e.target.checked)}
                />
              </div>
            </div>

            <Editor
              onEditorChange={(newValue, editor) => {
                setDeskripsi(editor.getContent());
              }}
              apiKey={tinymceKey}
              init={{
                relative_urls: false,
                height: 500,
                link_title: true,
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
