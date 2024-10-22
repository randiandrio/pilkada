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

const TpsPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/tps/api/data_desa`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        setLoading(false);
      });
  };

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
      name: "Jumlah TPS",
      selector: (row) => String(row.tpsKel.length),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "150px",
      cell: (row) => (
        <div>
          {row.tpsKel.length > 0 ? (
            <Link href={``}>
              <button
                type="button"
                className="btn btn-outline-success btn-xs light"
              >
                Lihat
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn-outline-success btn-xs light"
            >
              Generate TPS
            </button>
          )}
        </div>
      ),
    },
  ];

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
              <h4 className="card-title">Data TPS</h4>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columnKelurahan}
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

export default TpsPage;
