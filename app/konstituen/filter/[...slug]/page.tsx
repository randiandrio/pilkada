"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useSession } from "next-auth/react";
import { AdminLogin } from "next-auth";
import Delete from "../../action/Delete";
import Update from "../../action/Update";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

export default function KonstituenPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const session = useSession();
  const akun = session.data as unknown as AdminLogin;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/konstituen/api/get/${params.slug[0]}`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
        console.log(x);
      });
  };

  const columns: TableColumn<any>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Nama",
      cell: (row) => (
        <>
          <p className="pt-3" style={{ lineHeight: 1 }}>
            <strong>{row.nama}</strong>
            <br />
            {row.jabatan}
          </p>
        </>
      ),
    },
    {
      name: "NIK",
      selector: (row) => String(row.nik),
      sortable: true,
    },
    {
      name: "Kota / Kabupaten",
      selector: (row) => String(row.kab.nama),
      sortable: true,
    },
    {
      name: "Kecamatan",
      selector: (row) => String(row.kec.nama),
      sortable: true,
    },
    {
      name: "Kelurahan / Desa",
      selector: (row) => String(row.kel.nama),
      sortable: true,
    },
    {
      name: "Refferal",
      selector: (row) =>
        row.refferal != undefined ? String(row.refferal.nama) : "-",
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      cell: (row) => (
        <>
          <div className="d-flex">
            <Update reload={reload} user={row} />
            <Delete reload={reload} userId={row.id} />
          </div>
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
    (item: any) =>
      item.nama && item.nama.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <h4 className="card-title">Data {params.slug[0]}</h4>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari ... "
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
                onChangePage={(page) => {
                  setPage(page);
                }}
                onChangeRowsPerPage={(page) => {
                  setPage(1);
                  setPerpage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
