"use client";
import { Paslon } from "@prisma/client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Add from "./action/Add";
import Update from "./action/update";
import Delete from "./action/Delete";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const PaslonPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/master/all-paslon/api/data_paslon`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        setLoading(false);
      });
  };

  const columns: TableColumn<Paslon>[] = [
    {
      name: "Nomor Urut",
      width: "150px",
      selector: (row) => String(row.noUrut),
      sortable: true,
    },
    {
      name: "Nama Calon",
      selector: (row) => String(row.calon),
      sortable: true,
    },
    {
      name: "Nama Wakil",
      selector: (row) => String(row.wakil),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "120px",
      cell: (row) => (
        <div className="d-flex">
          <Update reload={reload} paslon={row} />
          <Delete reload={reload} paslon={row} />
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
                <h4 className="card-title">Data Paslon</h4>
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
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Add reload={reload} />
      </div>
    </div>
  );
};

export default PaslonPage;
