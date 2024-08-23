"use client";
import { useEffect } from "react";
import { useState } from "react";
import Add from "./action/Add";
import Delete from "./action/Delete";
import DataTable, { TableColumn } from "react-data-table-component";
import Update from "./action/update";
import Image from "next/image";
import { Cs } from "@prisma/client";
import { useSession } from "next-auth/react";
import { AdminLogin } from "next-auth";
import { apiImg } from "@/app/helper";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

export default function InfoPage() {
  const session = useSession();
  const akun = session.data as unknown as AdminLogin;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Cs[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/cs/api/get`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
      });
  };

  const columns: TableColumn<Cs>[] = [
    {
      name: "",
      width: "100px",
      cell: (row) => (
        <Image
          src={`${apiImg}/${row.gambar}`}
          width="60"
          height="60"
          className="rounded-circle my-2"
          alt=""
        />
      ),
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Operasional",
      selector: (row) => String(row.jamOperasional),
      sortable: true,
    },
    {
      name: "URL",
      selector: (row) => String(row.url),
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <>
          {akun.role == "Super Admin" && (
            <div className="d-flex">
              <Update reload={reload} cs={row} />
              <Delete reload={reload} cs={row} />
            </div>
          )}
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
    (item: Cs) =>
      item.nama && item.nama.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <h4 className="card-title">Data Customer Support</h4>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari CS"
                />
              </div>
            </div>

            <div className="table-responsive pb-1">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={filteredItems}
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
          <Add reload={reload} />
        </div>
      </div>
    </div>
  );
}
