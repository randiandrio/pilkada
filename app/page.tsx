"use client";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import Image from "next/image";
import "moment/locale/id";
import { noRupiah } from "./helper";

function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [load1Load, setLoad1Load] = useState(true);
  const [load2Load, setLoad2Load] = useState(true);
  const [load3Load, setLoad3Load] = useState(true);
  const [option1, setOption1] = useState({});
  const [option2, setOption2] = useState({});
  const [option3, setOption3] = useState({});
  const [relawan, setRelawan] = useState(0);
  const [timses, setTimses] = useState(0);
  const [tps, setTps] = useState(0);
  const [dpt, setDpt] = useState(0);

  useEffect(() => {
    setLoading(false);
    load1("all");
    load2();
    load3();
    load4();
  }, []);

  const load1 = async (id: String) => {
    setLoad1Load(true);
    fetch(`/api/dashboard/simpatisan-wilayah/${id}`)
      .then((res) => res.json())
      .then((result) => {
        let x = result.datas;
        let arr: any[] = [];
        for (let i = 0; i <= x.length; i++) {
          if (i == 0) {
            arr.push(["Nilai", "Jumlah", "Wilayah"]);
          } else {
            arr.push([x[i - 1].jumlah, x[i - 1].jumlah, x[i - 1].nama]);
          }
        }

        const opt1 = {
          dataset: {
            source: arr,
          },
          grid: { containLabel: true },
          xAxis: { name: "Relawan" },
          yAxis: { type: "category" },
          visualMap: {
            orient: "horizontal",
            left: "center",
            min: 0,
            max: Number(result.max),
            text: ["Tinggi", "Rendah"],
            dimension: 0,
            inRange: {
              color: ["#FD665F", "#FFCE34", "#65B581"],
            },
          },
          series: [
            {
              type: "bar",
              encode: {
                x: "Jumlah",
                y: "Wilayah",
              },
            },
          ],
        };

        setOption1(opt1);
        setLoad1Load(false);
      });
  };

  const load2 = async () => {
    setLoad2Load(true);
    fetch(`/api/dashboard/gender`)
      .then((res) => res.json())
      .then((x) => {
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
              name: "Gender Relawan",
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
              data: [
                { value: x.l, name: "Laki-laki" },
                { value: x.p, name: "Perempuan" },
              ],
            },
          ],
        };
        setOption2(opt2);
        setLoad2Load(false);
      });
  };

  const load3 = async () => {
    setLoad3Load(true);
    fetch(`/api/dashboard/umur`)
      .then((res) => res.json())
      .then((x) => {
        const opt3 = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            bottom: "0%",
            left: "center",
            padding: 0,
          },
          series: [
            {
              name: "Umur Relawan",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              padAngle: 1,
              triggerEvent: true,
              itemStyle: {
                borderRadius: 5,
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
              data: [
                { value: x.kurang21, name: "< 21 thn" },
                { value: x.u2125, name: "21 - 25 thn" },
                { value: x.u2630, name: "26 - 30 thn" },
                { value: x.u3135, name: "31 - 35 thn" },
                { value: x.u3640, name: "36 - 40 thn" },
                { value: x.u4145, name: "41 - 45 thn" },
                { value: x.u4650, name: "46 - 50 thn" },
                { value: x.lebih50, name: "> 50 thn" },
              ],
            },
          ],
        };
        setOption3(opt3);
        setLoad3Load(false);
      });
  };

  const load4 = async () => {
    fetch(`/api/dashboard/statistik`)
      .then((res) => res.json())
      .then((x) => {
        setRelawan(x.relawan);
        setTimses(x.timses);
        setTps(x.tps);
        setDpt(x.dpt);
      });
  };

  const onChartClick = (params: any): void => {
    load1(params.name);
  };

  const onReset = (): void => {
    load1("all");
  };

  // Objek event handler
  const onEvents = {
    click: onChartClick,
  };
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="row">
        <div className="col-xl-3  col-lg-6 col-sm-6">
          <div className="card bg-success overflow-hidden">
            <div className="card-body">
              <div className="students d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <h4>{noRupiah(relawan)}</h4>
                  <h5>Total Relawan</h5>
                </div>
                <div>
                  <Image
                    src="/template/user.png"
                    width={60}
                    height={60}
                    alt="xxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3  col-lg-6 col-sm-6">
          <div className="card bg-primary overflow-hidden">
            <div className="card-body">
              <div className="students d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <h4>{noRupiah(timses)}</h4>
                  <h5>Total Timses</h5>
                </div>
                <div>
                  <Image
                    src="/template/user.png"
                    width={60}
                    height={60}
                    alt="xxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3  col-lg-6 col-sm-6">
          <div className="card bg-warning overflow-hidden">
            <div className="card-body">
              <div className="students d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <h4>{noRupiah(tps)}</h4>
                  <h5>Total TPS</h5>
                </div>
                <div>
                  <Image
                    src="/template/mitra.png"
                    width={60}
                    height={60}
                    alt="xxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3  col-lg-6 col-sm-6">
          <div className="card bg-info overflow-hidden">
            <div className="card-body">
              <div className="students d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <h4>{noRupiah(dpt)}</h4>
                  <h5>Total DPT</h5>
                </div>
                <div>
                  <Image
                    src="/template/transaksi.png"
                    width={60}
                    height={60}
                    alt="xxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Grafik Relawan</h4>
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
                <h4 className="card-title">Gender Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <ReactEcharts style={{ height: "320px" }} option={option2} />
              </div>
            </div>
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Umur Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <ReactEcharts style={{ height: "300px" }} option={option3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
