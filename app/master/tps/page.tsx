"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Link from "next/link";
import Reset from "./action/Reset";
import GenerateTPS from "./action/GenerateTps";

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
  const [isLoading, setLoading] = useState(true);
  const [listKota, setListKota] = useState([]);
  const [listKec, setListKec] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    loadKota();
    reload();
  }, []);

  const loadKota = async () => {
    fetch(`/master/tps/api/load_kota_tps`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.kota.map(function (item: any) {
          return {
            value: item.id,
            label: item.nama,
          };
        });
        setListKota(a);

        if (x.kec.length > 0) {
          var b = x.kec.map(function (item: any) {
            return {
              value: item.id,
              label: item.nama,
            };
          });
          setListKec(b);
        }

        setLoading(false);
      });
  };

  const reload = async () => {
    fetch(`/master/tps/api/load_data_kota`)
      .then((res) => res.json())
      .then((x) => {
        setDatas(x);
        setLoading(false);
      });
  };

  const columns: TableColumn<any>[] = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "50px",
      grow: 0,
    },
    {
      name: "Kabupaten / Kota",
      selector: (row) => String(row.namaKota),
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
          <Link href={`/master/tps/kecamatan/${row.kotaId}`}>
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
        <div className="col-xl-8 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Data TPS</h4>
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
        <GenerateTPS listKota={listKota} defKec={listKec} reload={reload} />
        <Reset reload={reload} />
      </div>
    </div>
  );
};

export default TpsPage;
