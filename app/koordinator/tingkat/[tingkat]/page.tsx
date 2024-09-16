"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "../../action/Add";
import Delete from "../../action/Delete";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const KoordinatorPage = ({ params }: { params: { tingkat: string } }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/koordinator/api/data/${params.tingkat}`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        setLoading(false);
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
      name: "Nama Wilayah",

      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Koordinator",
      cell: (row) =>
        row.koordinator.length > 1 ? (
          <table>
            {row.koordinator.map((a: any, index: number) => (
              <tr key={a.user.id}>
                <td width={"20px"}>{index + 1}.</td>
                <td> {a.user.nama} </td>
              </tr>
            ))}
          </table>
        ) : row.koordinator.length == 0 ? (
          "-"
        ) : (
          row.koordinator[0].user.nama
        ),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "250px",
      cell: (row) => (
        <div className="d-flex">
          <Add reload={reload} wilayahId={row.id} namaWilayah={row.nama} />
          {row.koordinator.length > 0 && (
            <Delete reload={reload} wilayahId={row.id} />
          )}
        </div>
      ),
    },
  ];

  const columnKecamatan: TableColumn<any>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Kecamatan",

      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Kota / Kabupaten",
      selector: (row) => String(row.kabupaten),
      sortable: true,
    },
    {
      name: "Koordinator",
      cell: (row) =>
        row.koordinator.length > 1 ? (
          <table>
            {row.koordinator.map((a: any, index: number) => (
              <tr key={a.user.id}>
                <td width={"20px"}>{index + 1}.</td>
                <td> {a.user.nama} </td>
              </tr>
            ))}
          </table>
        ) : row.koordinator.length == 0 ? (
          "-"
        ) : (
          row.koordinator[0].user.nama
        ),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "250px",
      cell: (row) => (
        <div className="d-flex">
          <Add reload={reload} wilayahId={row.id} namaWilayah={row.nama} />
          {row.koordinator.length > 0 && (
            <Delete reload={reload} wilayahId={row.id} />
          )}
        </div>
      ),
    },
  ];

  const columnKelurahan: TableColumn<any>[] = [
    {
      name: "No.",
      width: "100px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Kelurahan / Desa",
      selector: (row) => String(row.nama),
      sortable: true,
    },
    {
      name: "Kecamatan",
      selector: (row) => String(row.kecamatan),
      sortable: true,
    },
    {
      name: "Kota / Kabupaten",
      selector: (row) => String(row.kabupaten),
      sortable: true,
    },
    {
      name: "Koordinator",
      cell: (row) =>
        row.koordinator.length > 1 ? (
          <table>
            {row.koordinator.map((a: any, index: number) => (
              <tr key={a.user.id}>
                <td width={"20px"}>{index + 1}.</td>
                <td> {a.user.nama} </td>
              </tr>
            ))}
          </table>
        ) : row.koordinator.length == 0 ? (
          "-"
        ) : (
          row.koordinator[0].user.nama
        ),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "250px",
      cell: (row) => (
        <div className="d-flex">
          <Add reload={reload} wilayahId={row.id} namaWilayah={row.nama} />
          {row.koordinator.length > 0 && (
            <Delete reload={reload} wilayahId={row.id} />
          )}
        </div>
      ),
    },
  ];

  let tabel = columns;
  let judul = params.tingkat;
  if (params.tingkat == "Kabupaten") {
    judul = "Kota / Kabupaten";
  }
  if (params.tingkat == "Kecamatan") {
    tabel = columnKecamatan;
  }
  if (params.tingkat == "Kelurahan") {
    judul = "Kelurahan / Desa";
    tabel = columnKelurahan;
  }

  const filteredItems = datas.filter(
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
              <h4 className="card-title">Data Koordinator {judul}</h4>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => {
                    if (e.target.value.length > 2) {
                      setFilter(e.target.value);
                    }
                    if (e.target.value.length < 1) {
                      setFilter(e.target.value);
                    }
                  }}
                  type="text"
                  className="form-control"
                  placeholder={`Cari koordinator ${judul} min 3 huruf`}
                />
              </div>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={tabel}
                data={filteredItems}
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
};

export default KoordinatorPage;
