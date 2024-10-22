"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Update from "../../action/Update";
import Link from "next/link";
import Lihat from "../../action/Lihat";
import Delete from "../../action/Delete";
import * as XLSX from "xlsx";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const conditionalRowStyles = [
  {
    when: (row: { terverifikasi: Number }) => row.terverifikasi == 0,
    style: {
      backgroundColor: "#f5f4da",
    },
  },
];

export default function KonstituenPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [namaUser, setUserNama] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/peta-suara/api/refferal/${params.slug[0]}`)
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x.data);
        setUserNama(x.user);
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
            <strong>
              <Link href={`/peta-suara/refferal/${row.id}`}>{row.nama}</Link>
            </strong>
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
      name: "Tempat/ Tanggal Lahir",
      selector: (row) => `${row.tempatLahir}, ${row.tanggalLahir}`,
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
      name: "No. HP",
      selector: (row) => String(row.hp),
      sortable: true,
    },
    {
      name: "No. WA",
      selector: (row) => String(row.wa),
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      cell: (row) => (
        <>
          <div className="d-flex">
            <Lihat reload={reload} user={row} />
            <Update reload={reload} user={row} />
            <Delete reload={reload} userId={row.id} />
          </div>
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
    (item: any) =>
      (item.nama && item.nama.toLowerCase().includes(filter.toLowerCase())) ||
      (item.nik && item.nik.toLowerCase().includes(filter.toLowerCase())) ||
      (item.hp && item.hp.toLowerCase().includes(filter.toLowerCase()))
  );

  const exportExcel = async (title?: string, worksheetname?: string) => {
    try {
      if (data && Array.isArray(data)) {
        const dataToExport = data.map((x: any, index: number) => ({
          No: index + 1,
          Nama: x.nama,
          NIK: x.nik,
          Jabatan: x.jabatan,
          "No. HP": x.hp,
          "No. WA": x.wa,
          "Tempat/Tgl Lahir": `${x.tempatLahir}, ${x.tanggalLahir}`,
          "Kota / Kabupaten": x.kab.nama,
          Kecamagan: x.kec.nama,
          "Kelurahan / Desa": x.kel.nama,
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
        XLSX.writeFile(workbook, `${title}.xlsx`);
        console.log(`Exported data to ${title}.xlsx`);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("#==================Export Error");
      }
    } catch (error: any) {
      setLoading(false);
      console.log("#==================Export Error", error.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Data Refferal</h4>
                <p>{namaUser}</p>
              </div>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari NIK/Nama/HP "
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
                conditionalRowStyles={conditionalRowStyles}
                onChangePage={(page) => {
                  setPage(page);
                }}
                onChangeRowsPerPage={(page) => {
                  setPage(1);
                  setPerpage(page);
                }}
              />
            </div>
            <div className="card-body">
              <h3>Total Data : {data.length} Orang</h3>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => exportExcel(`Data Refferal ${namaUser}`, "refferal")}
        type="button"
        className="btn btn-info"
      >
        Export To Excel
      </button>
    </div>
  );
}
