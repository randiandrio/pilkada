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

export default function TpsKec({ params }: { params: { kecId: string } }) {
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [namaKec, setNamaKec] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/tps/api/load_data_saksi/${params.kecId}`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x.data);
        setNamaKec(x.namaKec);
        setLoading(false);
      });
  };

  const columns: TableColumn<any>[] = [
    {
      name: "No. TPS",
      width: "120px",
      selector: (row) => String(row.tpsNo),
      sortable: true,
    },
    {
      name: "Nama Saksi",
      selector: (row) => row.saksi?.nama ?? "Belum ada saksi",
      sortable: true,
    },
    {
      name: "",
      width: "200px",
      cell: (row) => (
        <div>
          <Link href={`#`}>
            <button
              type="button"
              className="btn btn-outline-success btn-xs light"
            >
              Tambah / Ganti Saksi
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
                <h4 className="card-title">Data Saksi TPS {namaKec}</h4>
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
