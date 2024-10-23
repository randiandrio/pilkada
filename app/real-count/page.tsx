"use client";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

function RealCount() {
  const [isLoading, setLoading] = useState(true);
  const [click, setClick] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [namaWilayah, setNamaWilayah] = useState("");
  const [load1Load, setLoad1Load] = useState(true);
  const [option1, setOption1] = useState({});
  const [option2, setOption2] = useState({});
  const [option3, setOption3] = useState({});

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
        setNamaWilayah(x.namaWilayah);
        setFirstName(x.firstName);
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
      });
  };

  const onChartClick = (params: any): void => {
    if (click) {
      load1(params.name);
      // console.log(params.name);
    }
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
      </div>
    </>
  );
}

export default RealCount;
