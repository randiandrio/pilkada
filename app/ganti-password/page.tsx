"use client";
import { useState, SyntheticEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AdminLogin } from "next-auth";
import { useSession } from "next-auth/react";

const SettingPage = () => {
  const session = useSession();
  const akun = session.data as unknown as AdminLogin;

  const [isPost, setPost] = useState(false);
  const [passLama, setPassLama] = useState("");
  const [passBaru, setPassBaru] = useState("");
  const [passUlangi, setPassUlangi] = useState("");

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

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();
    setPost(true);
    if (String(passBaru) != String(passUlangi)) {
      setPost(false);
      Swal.fire({
        title: "Ups!",
        text: "Ulangi password baru anda salah, silahkan coba lagi",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const formData = new FormData();
    formData.append("id", String(akun.id));
    formData.append("passLama", String(passLama));
    formData.append("passBaru", String(passBaru));
    const response = await axios.patch("/ganti-password/api", formData);
    setPost(false);
    if (response.data.error) {
      Swal.fire({
        title: "Ups!",
        text: response.data.msg,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: response.data.msg,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-xl-6 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Ganti Password</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="mb-3 row">
                  <label className="col-sm-6 col-form-label">
                    Password Lama
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={String(passLama)}
                      onChange={(e) => setPassLama(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-sm-6 col-form-label">
                    Password Baru
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={String(passBaru)}
                      onChange={(e) => setPassBaru(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-sm-6 col-form-label">
                    Ulangi Password Baru
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={String(passUlangi)}
                      onChange={(e) => setPassUlangi(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div
                  className="toolbar toolbar-bottom"
                  role="toolbar"
                  style={{ textAlign: "right" }}
                >
                  <button type="submit" className="btn btn-primary light">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
