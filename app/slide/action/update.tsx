"use client";
import { useState, SyntheticEvent, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import { apiImg, tampilLoading, tinymceKey, uploadGambar } from "@/app/helper";
import { resData } from "next-auth";
import { Slide } from "@prisma/client";

function Update({ reload, slide }: { reload: Function; slide: Slide }) {
  const [title, setTitle] = useState(slide.title);
  const [deskripsi, setDeskripsi] = useState(slide.deskripsi);
  const [tampilkan, setTampilkan] = useState(slide.isShow > 0);
  const [fotoUrlSelect, setFotoUrlSelect] = useState(
    `${apiImg}/${slide.gambar}`
  );

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [image, setImage] = useState<File>();

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

    let urlGambar;
    const newImage = fotoUrlSelect != `${apiImg}/${slide.gambar}`;
    if (newImage) {
      urlGambar = await uploadGambar(
        image as File,
        "pemilu/slide",
        slide.gambar
      );
    }

    const formData = new FormData();
    formData.append("method", "update");
    formData.append("id", String(slide.id));
    formData.append("title", title);
    formData.append("deskripsi", String(deskripsi));
    formData.append("new", newImage ? "1" : "0");
    if (newImage) formData.append("gambar", String(urlGambar));
    formData.append("isShow", tampilkan ? "1" : "0");
    const x = await axios.patch("/slide/api/post", formData);
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
        enforceFocus={false}
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Data Slide</Modal.Title>
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
              initialValue={String(slide.deskripsi)}
              init={{
                height: 500,
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
