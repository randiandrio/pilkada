"use client";
import { tinymceKey, titleHalaman } from "@/app/helper";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { SyntheticEvent, useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function HalamanPage({ params }: { params: { jenis: string } }) {
  const [isLoading, setLoading] = useState(true);
  const [deskripsi, setDeskripsi] = useState("");
  const [initValue, setInitValue] = useState("");
  const [isPost, setPost] = useState(false);

  useEffect(() => {
    fetch(`/master/halaman/api/${params.jenis}`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setDeskripsi(x.deskripsi);
        setInitValue(x.deskripsi);
      });
  }, [params.jenis]);

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
    formData.append("halaman", String(params.jenis));
    formData.append("deskripsi", String(deskripsi));
    await axios.patch("/master/halaman/api/post", formData);
    setPost(false);
    Swal.fire({
      title: "Success!",
      text: `Halaman telah diperbarui`,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header flex-wrap" id="default-tab">
                <h4 className="card-title">{titleHalaman(params.jenis)}</h4>
              </div>
              <Editor
                onEditorChange={(newValue, editor) => {
                  setDeskripsi(editor.getContent());
                }}
                initialValue={initValue}
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
            </div>

            <button type="submit" className="btn btn-primary light">
              Perbarui
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
