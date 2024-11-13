import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <div>
      <div className="nav-header">
        <a href="#" className="brand-logo">
          <Image
            className="logo-abbr"
            src={`/template/logo.webp`}
            width={55}
            height={55}
            alt="xxx"
          />
          <Image
            className="brand-title"
            src={`/template/text.png`}
            width={130}
            height={51}
            alt="xxx"
          />
        </a>
        <div className="nav-control">
          <div className="hamburger">
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="px-3 pt-1">
                  {status == "authenticated" ? (
                    <>
                      <h4 style={{ lineHeight: "0px" }}>
                        {session.user.appName}
                      </h4>
                      <small style={{ lineHeight: "15px" }}>
                        {session.user.nama} - {session.user.role}
                      </small>
                    </>
                  ) : (
                    <h4 style={{ lineHeight: "0px" }}>SISPOL</h4>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
