"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Link from "next/link";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

export default function TpsKec({ params }: { params: { kotaId: string } }) {
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [namaKota, setNamaKota] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/tps/api/load_data_kec/${params.kotaId}`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x.data);
        setNamaKota(x.namaKota);
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
      name: "Kecamatan",
      selector: (row) => String(row.namaKec),
      sortable: true,
    },
    {
      name: "Jumlah TPS",
      selector: (row) => String(row.jumlahTps),
      sortable: true,
    },
    {
      name: "",
      width: "120px",
      cell: (row) => (
        <div>
          <Link href={`/master/tps/saksi/${row.kecId}`}>
            <button
              type="button"
              className="btn btn-outline-success btn-xs light"
            >
              Lihat
            </button>
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-6 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Data TPS {namaKota}</h4>
              </div>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={datas}
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
