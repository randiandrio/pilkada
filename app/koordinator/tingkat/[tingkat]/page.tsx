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

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/koordinator/api/data/${params.tingkat}`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        console.log(x);
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
      selector: (row) =>
        String(row.koordinator.length > 0 ? row.koordinator[0].user.nama : "-"),
      sortable: true,
    },

    {
      name: "Aksi",
      width: "230px",
      cell: (row) => (
        <div className="d-flex">
          <Add
            usr={{
              value:
                row.koordinator.length > 0 ? row.koordinator[0].user.id : 0,
              label:
                row.koordinator.length > 0
                  ? row.koordinator[0].user.nama
                  : "Pilih Koordinator",
            }}
            reload={reload}
            wilayahId={row.id}
            namaWilayah={row.nama}
          />
          {row.koordinator.length > 0 && (
            <Delete reload={reload} koordinatorId={row.koordinator[0].id} />
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Koordinator {params.tingkat}</h4>
              </div>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={datas}
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

      <div>{/* <Add reload={reload} /> */}</div>
    </div>
  );
};

export default KoordinatorPage;
