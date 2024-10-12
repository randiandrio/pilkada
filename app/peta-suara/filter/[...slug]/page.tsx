"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Delete from "../../action/Delete";
import Update from "../../action/Update";
import Select from "react-select";
import { useRouter } from "next/navigation";
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

export default function KonstituenPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);

  const [disKab, setDisKab] = useState(false);
  const [disKec, setDisKec] = useState(false);
  const [disKel, setDisKel] = useState(false);

  const [listTim, setListTim] = useState<any[]>([
    {
      value: "all",
      label: "Semua Tim",
    },
    {
      value: "Timses",
      label: "Tim Sukses",
    },
    {
      value: "Simpatisan",
      label: "Simpatisan",
    },
  ]);
  const [selectedTim, setSelectedTim] = useState({
    value: "all",
    label: "Semua Tim",
  });

  const handleSelectTim = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${data.value}/${selectedKota.value}/${selectedKecamatan.value}/${selectedKelurahan.value}`
    );
  };

  const [listKota, setListKota] = useState<any[]>([]);

  const [selectedKota, setSelectedKota] = useState({
    value: "all-kabupaten",
    label: "Semua Kabupaten / Kota",
  });
  const handleSelectKota = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedTim.value}/${data.value}/${selectedKecamatan.value}/${selectedKelurahan.value}`
    );
  };

  const [lisKecamatan, setListKecamatan] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState({
    value: "all-kecamatan",
    label: "Semua Kecamatan",
  });

  const handleSelectKecamatan = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedTim.value}/${selectedKota.value}/${data.value}/${selectedKelurahan.value}`
    );
  };

  const [lisKelurahan, setListKelurahan] = useState<any[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState({
    value: "all-kelurahan",
    label: "Semua Kelurahan",
  });

  const handleSelectKelurahan = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedTim.value}/${selectedKota.value}/${selectedKecamatan.value}/${data.value}`
    );
  };

  useEffect(() => {
    reload();
    loadKota();
    if (params.slug[0] == "all") {
      setSelectedTim({
        value: "all",
        label: "Semua Tim",
      });
    }
    if (params.slug[0] == "Timses") {
      setSelectedTim({
        value: "Timses",
        label: "Timses",
      });
    }
    if (params.slug[0] == "Simpatisan") {
      setSelectedTim({
        value: "Simpatisan",
        label: "Simpatisan",
      });
    }
    if (params.slug[1] == "all-kabupaten") {
      setDisKec(true);
      setDisKel(true);
    }
    if (params.slug[2] == "all-kecamatan") {
      setDisKel(true);
    }
  }, []);

  const reload = async () => {
    fetch(
      `/peta-suara/api/get/${params.slug[0]}/${params.slug[1]}/${params.slug[2]}/${params.slug[3]}`
    )
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setData(x);
      });
  };

  const loadKota = async () => {
    fetch(`/peta-suara/api/load_kota`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKota(a);
        if (params.slug[1] != "all-kabupaten") {
          setSelectedKota(
            a.find((q: any) => String(q.value) === params.slug[1])
          );
          loadKecamatan();
        }
      });
  };

  const loadKecamatan = async () => {
    fetch(`/peta-suara/api/load_kecamatan/${params.slug[1]}`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKecamatan(a);
        if (params.slug[2] != "all-kecamatan") {
          setSelectedKecamatan(
            a.find((q: any) => String(q.value) === params.slug[2])
          );
          loadKelurahan();
        }
      });
  };

  const loadKelurahan = async () => {
    fetch(`/peta-suara/api/load_kelurahan/${params.slug[2]}`)
      .then((res) => res.json())
      .then((x) => {
        console.log(x);
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKelurahan(a);
        if (params.slug[3] != "all-kelurahan") {
          setSelectedKelurahan(
            a.find((q: any) => String(q.value) === params.slug[3])
          );
        }
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
      name: "ID",
      width: "100px",
      selector: (row) => String(row.id),
      sortable: true,
    },
    {
      name: "Nama",
      cell: (row) => (
        <>
          <p className="pt-3" style={{ lineHeight: 1 }}>
            <strong>
              <Link href={`/peta-suara/refferal/${row.id}`}>{row.nama}</Link>
            </strong>
            <br />
            {row.jabatan}
          </p>
        </>
      ),
    },
    {
      name: "NIK",
      selector: (row) => String(row.nik),
      sortable: true,
    },
    {
      name: "Kota / Kabupaten",
      selector: (row) => String(row.kab.nama),
      sortable: true,
    },
    {
      name: "Kecamatan",
      selector: (row) => String(row.kec.nama),
      sortable: true,
    },
    {
      name: "Kelurahan / Desa",
      selector: (row) => String(row.kel.nama),
      sortable: true,
    },
    {
      name: "Refferal",
      cell: (row) =>
        row.refferal != null ? (
          <Link href={`/peta-suara/refferal/${row.refferal.id}`}>
            {row.refferal.nama}
          </Link>
        ) : (
          "-"
        ),
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      width: "200px",
      cell: (row) => (
        <>
          <div className="d-flex">
            <Update reload={reload} user={row} />
            <Delete reload={reload} userId={row.id} />
          </div>
        </>
      ),
    },
  ];

  const filteredItems = data.filter(
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
              <div className="col-sm-8">
                <div className="row">
                  <div className="col-sm-3">
                    <Select
                      placeholder="Semua Tim"
                      className="basic-single mt-1"
                      classNamePrefix="select"
                      options={listTim}
                      value={selectedTim}
                      onChange={(e) => handleSelectTim(e!)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <Select
                      isDisabled={disKab}
                      placeholder="Semua Kabupaten / Kota"
                      className="basic-single mt-1"
                      classNamePrefix="select"
                      isSearchable={true}
                      options={listKota}
                      value={selectedKota}
                      noOptionsMessage={(e) => {
                        return "Kabupaten / Kota tidak ditemukan";
                      }}
                      onChange={(e) => handleSelectKota(e!)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <Select
                      isDisabled={disKec}
                      placeholder="Semua Kecamatan"
                      className="basic-single mt-1"
                      classNamePrefix="select"
                      isSearchable={true}
                      options={lisKecamatan}
                      value={selectedKecamatan}
                      noOptionsMessage={(e) => {
                        return "Kecamatan tidak ditemukan";
                      }}
                      onChange={(e) => handleSelectKecamatan(e!)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <Select
                      isDisabled={disKel}
                      placeholder="Semua Kelurahan"
                      className="basic-single mt-1"
                      classNamePrefix="select"
                      isSearchable={true}
                      options={lisKelurahan}
                      value={selectedKelurahan}
                      noOptionsMessage={(e) => {
                        return "Kelurahan tidak ditemukan";
                      }}
                      onChange={(e) => handleSelectKelurahan(e!)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-3 mb-0">
                <input
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Cari ... "
                />
              </div>
            </div>

            <div className="table-responsive pb-1">
              <DataTable
                responsive
                highlightOnHover={true}
                persistTableHead={true}
                columns={columns}
                data={filteredItems}
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
            <div className="card-body">
              <h3>Total Data : {data.length} Orang</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
