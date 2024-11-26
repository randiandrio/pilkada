/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { className, noRupiah, rupiah, tglJamIndo } from "../helper";
import { Paslon } from "@prisma/client";
import LihatC1 from "./action/Lihat";
import Image from "next/image";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

function RealCount() {
  const [isLoading, setLoading] = useState(true);
  const [click, setClick] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [load1Load, setLoad1Load] = useState(true);
  const [paslons, setPaslons] = useState([]);
  const [suaras, setSuaras] = useState<any[]>([]);

  const [option1, setOption1] = useState({});
  const [option2, setOption2] = useState({});
  const [option3, setOption3] = useState({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [columns, setColomns] = useState<TableColumn<any>[]>([]);

  useEffect(() => {
    setLoading(false);
    load1("all");
  }, []);

  const load1 = async (name: String) => {
    setLoad1Load(true);

    fetch(`/real-count/api/realcount/${name}`)
      .then((res) => res.json())
      .then((x) => {
        console.log(x);
        setSuaras(x.suara);
        setNamaWilayah(x.namaWilayah);
        setFirstName(x.firstName);

        // Konfigurasi chart
        const opt1 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
          },
          yAxis: {
            type: "category",
            data: x.wilayah,
          },
          series: x.series,
        };
        setClick(x.click);
        setLoad1Load(false);
        setOption1(opt1);

        const opt2 = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            top: "5%",
            left: "center",
          },
          series: [
            {
              name: "Pie Diagram",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              padAngle: 2,
              itemStyle: {
                borderRadius: 10,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: true,
              },
              data: x.pie,
            },
          ],
        };
        setOption2(opt2);

        const opt3 = {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%",
          },
          series: [
            {
              name: "Pressure",
              type: "gauge",
              detail: {
                formatter: "{value}",
              },
              data: [
                {
                  value: x.dataMasuk ?? 0,
                  name: "Data Masuk",
                },
              ],
            },
          ],
        };
        setOption3(opt3);

        setPaslons(x.paslon);
        // Kolom dinamis
        const dynamicCols = x.paslon.map((item: Paslon, index: number) => ({
          name: `${item.calon} / ${item.wakil}`,
          selector: (row: any) => String(row.detail[index].suara),
          cell: (row: any) => (
            <div
              style={{
                backgroundColor: "#D4EDDA",
                color: "#155724",
                width: "100%",
                height: "100%",
                textAlign: "center", // Horizontal centering
                display: "flex", // Activate flexbox
                justifyContent: "center", // Center horizontally
                alignItems: "center",
              }}
            >
              {String(row.detail[index].suara)}
            </div>
          ),
        }));

        // Gabungkan kolom statis dan dinamis
        setColomns([...columnsStatic, ...dynamicCols, ...columnsStatic2]);

        // Set data tabel
        setData(x.realCount);
      });
  };

  const onChartClick = (params: any): void => {
    if (click) {
      console.log(params);
      load1(params.name);
      // console.log(params.name);
    }
  };

  const onReset = (): void => {
    load1("all");
  };

  const columnsStatic: TableColumn<any>[] = [
    {
      name: "No.",
      width: "60px",
      center: true,
      cell: (row, index) => (page - 1) * perPage + (index + 1),
    },
    {
      name: "Tanggal Data",
      width: "200px",
      selector: (row) => tglJamIndo(row.updatedAt),
      sortable: true,
    },
    {
      name: "TPS",
      selector: (row) => `TPS ${String(row.tps.tpsNo).padStart(2, "0")}`,
      sortable: true,
    },
    {
      name: "Desa / Kelurahan",
      selector: (row) => String(row.tps.kel.nama),
      sortable: true,
    },
    {
      name: "Kecamatan",
      selector: (row) => String(row.tps.kel.kecamatan),
      sortable: true,
    },
  ];

  const columnsStatic2: TableColumn<any>[] = [
    {
      name: "Mulai",
      selector: (row) => row.mulai,
      sortable: true,
    },
    {
      name: "Selesai",
      selector: (row) => row.selesai,
      sortable: true,
    },
    {
      name: "Suara Sah",
      selector: (row) => row.suaraSah,
      sortable: true,
    },
    {
      name: "Suara Batal",
      selector: (row) => row.suaraBatal,
      sortable: true,
    },
    {
      name: "Sisa Suara",
      selector: (row) => row.suaraSisa,
      sortable: true,
    },
    {
      name: "Catatan",
      selector: (row) => row.catatan,
      sortable: true,
    },
    {
      name: "Form C1",
      width: "160px",
      cell: (row) => <LihatC1 realcount={row} />,
    },
  ];

  // Objek event handler
  const onEvents = {
    click: onChartClick,
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="row">
            {paslons.map((x: Paslon, index: number) => (
              <div
                key={x.id}
                className={`${className(paslons.length)}  col-lg-6 col-sm-6`}
              >
                <div className="card bg-success overflow-hidden">
                  <div className="card-body">
                    <div className="students d-flex align-items-center justify-content-between flex-wrap">
                      <div>
                        <h4>{x.calon}</h4>
                        <h5>{x.wakil}</h5>
                      </div>
                      <div>
                        <h1>{noRupiah(suaras[index].suara)}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-xl-8 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Real Count {firstName}
                {namaWilayah}
              </h4>
              <button
                type="button"
                onClick={onReset}
                className="btn btn-xs btn-outline-secondary light"
              >
                Reset
              </button>
            </div>
            <div className="card-body" style={{ height: "750px" }}>
              {load1Load ? (
                <p>Loading ... </p>
              ) : (
                <ReactEcharts
                  onEvents={onEvents}
                  style={{ height: "700px" }}
                  option={option1}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Pie Diagram</h4>
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                {load1Load ? (
                  <p>Loading ... </p>
                ) : (
                  <ReactEcharts style={{ height: "320px" }} option={option2} />
                )}
              </div>
            </div>
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Data Masuk (%)</h4>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                {load1Load ? (
                  <p>Loading ... </p>
                ) : (
                  <ReactEcharts style={{ height: "300px" }} option={option3} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header flex-wrap" id="default-tab">
              <div>
                <h4 className="card-title">Data Form C1</h4>
              </div>
            </div>

            <div className="table-responsive pb-1">
              {load1Load ? (
                <p className="px-2 py-2">Loading ... </p>
              ) : (
                <DataTable
                  responsive
                  highlightOnHover={true}
                  persistTableHead={true}
                  columns={columns}
                  data={data}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RealCount;
