"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Link from "next/link";
import { NextRequest } from "next/server";
import Delete from "../../action/Delete";
import AddSaksi from "../../action/AddSaksi";
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

const TpsPage = ({ params }: { params: { slug: string[] } }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  const [wilayah, setWilayah] = useState<any>();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = async () => {
    fetch(`/master/tps/api/tps_desa/${params.slug[0]}`)
      .then((res) => res.json())
      .then((x) => {
        setWilayah(x.wilayah);
        setDatas(x.tps);
        setLoading(false);
      });
  };

  const columnKelurahan: TableColumn<any>[] = [
    {
      name: "Nomor TPS",
      width: "150px",
      selector: (row) => String(row.tpsNo),
      sortable: true,
    },
    {
      name: "Saksi",
      selector: (row) => (row.saksi != undefined ? row.saksi.nama : "-"),
      sortable: true,
    },

    {
      name: "Aksi",
      width: "240px",
      cell: (row) => (
        <div className="d-flex">
          <AddSaksi
            reload={reload}
            tpsId={row.id}
            isAdd={row.saksi == undefined}
            sUser={{
              value: row.saksi != undefined ? row.saksi.id : 0,
              label: row.saksi != undefined ? row.saksi.nama : "Pilih Saksi",
            }}
          />
          <Delete tps={row} reload={reload} />
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
                <h4 className="card-title">Data Saksi</h4>
                <table>
                  <tr>
                    <td width={100}>Kota/Kab</td>
                    <td width={20}>:</td>
                    <td>{wilayah.kabupaten}</td>
                  </tr>
                  <tr>
                    <td>Kecamatan</td>
                    <td>:</td>
                    <td>{wilayah.kecamatan}</td>
                  </tr>
                  <tr>
                    <td>Kel/Desa</td>
                    <td>:</td>
                    <td>{wilayah.kelurahan}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div className="table-responsive pb-2">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columnKelurahan}
                data={datas}
                customStyles={customStyles}
              />
            </div>
          </div>
          <AddTps reload={reload} wilayahId={wilayah.id} />
        </div>
      </div>
    </div>
  );
};

export default TpsPage;
