"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import AddSaksi from "../../action/AddSaksi";
import DeleteSaksi from "../../action/DeleteSaksi";
import DeleteTps from "../../action/DeleteTps";
import AddTps from "../../action/AddTps";

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
      selector: (row) => row.saksi?.nama ?? "-",
      sortable: true,
    },
    {
      name: "",
      width: "300px",
      cell: (row) => (
        <div className="d-flex">
          <AddSaksi
            reload={reload}
            tpsId={row.id}
            usr={
              row.saksi
                ? { value: row.saksi.id, label: row.saksi.nama }
                : { value: 0, label: "Pilih Saksi" }
            }
          />
          &nbsp;&nbsp;
          {row.saksi && <DeleteSaksi tps={row} reload={reload} />}
          &nbsp;&nbsp;
          <DeleteTps tps={row} reload={reload} />
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="row">
        <div className="col-xl-8 col-lg-12">
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
              />
            </div>
          </div>
          <AddTps reload={reload} kecId={Number(params.kecId)} />
        </div>
      </div>
    </div>
  );
}
