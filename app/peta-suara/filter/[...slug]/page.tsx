"use client";
import { useEffect } from "react";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Delete from "../../action/Delete";
import Select from "react-select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tglIndo } from "@/app/helper";
import Lihat from "../../action/Lihat";
import Update from "../../action/Update";
import * as XLSX from "xlsx";

const customStyles = {
  headCells: {
    style: {
      background: "#53d0b3",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
};

const conditionalRowStyles = [
  {
    when: (row: { terverifikasi: Number }) => row.terverifikasi == 0,
    style: {
      backgroundColor: "#f5f4da",
    },
  },
];

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

  const [listVerifikasi, setListVerifikasi] = useState<any[]>([
    {
      value: "all",
      label: "Semua",
    },
    {
      value: "0",
      label: "Belum Diverifikasi",
    },
    {
      value: "1",
      label: "Terverifikasi",
    },
  ]);

  const [selectedTim, setSelectedTim] = useState({
    value: "all",
    label: "Semua Tim",
  });

  const [selectedVerifikasi, setSelectedVerifikasi] = useState({
    value: "all",
    label: "Semua",
  });

  const handleSelectTim = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedVerifikasi.value}/${data.value}/${selectedKota.value}/${selectedKecamatan.value}/${selectedKelurahan.value}`
    );
  };

  const handleSelectVerifikasi = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${data.value}/${selectedTim.value}/${selectedKota.value}/${selectedKecamatan.value}/${selectedKelurahan.value}`
    );
  };

  const [listKota, setListKota] = useState<any[]>([]);

  const [selectedKota, setSelectedKota] = useState({
    value: "all-kabupaten",
    label: "Semua Kabupaten",
  });

  const handleSelectKota = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedVerifikasi.value}/${selectedTim.value}/${data.value}/${selectedKecamatan.value}/${selectedKelurahan.value}`
    );
  };

  const [lisKecamatan, setListKecamatan] = useState<any[]>([]);

  const [selectedKecamatan, setSelectedKecamatan] = useState({
    value: "all-kecamatan",
    label: "Semua Kecamatan",
  });

  const handleSelectKecamatan = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedVerifikasi.value}/${selectedTim.value}/${selectedKota.value}/${data.value}/${selectedKelurahan.value}`
    );
  };

  const [lisKelurahan, setListKelurahan] = useState<any[]>([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState({
    value: "all-kelurahan",
    label: "Semua Kelurahan",
  });

  const handleSelectKelurahan = async (data: any) => {
    return router.push(
      `/peta-suara/filter/${selectedVerifikasi.value}/${selectedTim.value}/${selectedKota.value}/${selectedKecamatan.value}/${data.value}`
    );
  };

  useEffect(() => {
    reload();
    loadKota();

    if (String(params.slug[0]) == "all") {
      setSelectedVerifikasi({
        value: "all",
        label: "Semua",
      });
    }
    if (String(params.slug[0]) == "0") {
      setSelectedVerifikasi({
        value: "0",
        label: "Belum Diverifikasi",
      });
    }
    if (String(params.slug[0]) == "1") {
      setSelectedVerifikasi({
        value: "1",
        label: "Terverifikasi",
      });
    }

    if (params.slug[1] == "all") {
      setSelectedTim({
        value: "all",
        label: "Semua Tim",
      });
    }
    if (params.slug[1] == "Timses") {
      setSelectedTim({
        value: "Timses",
        label: "Timses",
      });
    }
    if (params.slug[1] == "Simpatisan") {
      setSelectedTim({
        value: "Simpatisan",
        label: "Simpatisan",
      });
    }

    if (params.slug[2] == "all-kabupaten") {
      setDisKec(true);
      setDisKel(true);
    }
    if (params.slug[3] == "all-kecamatan") {
      setDisKel(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = async () => {
    fetch(
      `/peta-suara/api/get/${params.slug[0]}/${params.slug[1]}/${params.slug[2]}/${params.slug[3]}/${params.slug[4]}`
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
        if (params.slug[2] != "all-kabupaten") {
          setSelectedKota(
            a.find((q: any) => String(q.value) === params.slug[2])
          );
          loadKecamatan();
        }
      });
  };

  const loadKecamatan = async () => {
    fetch(`/peta-suara/api/load_kecamatan/${params.slug[2]}`)
      .then((res) => res.json())
      .then((x) => {
        var a = x.map(function (item: any) {
          return {
            value: item.value,
            label: item.nama,
          };
        });
        setListKecamatan(a);
        if (params.slug[3] != "all-kecamatan") {
          setSelectedKecamatan(
            a.find((q: any) => String(q.value) === params.slug[3])
          );
          loadKelurahan();
        }
      });
  };

  const loadKelurahan = async () => {
    fetch(`/peta-suara/api/load_kelurahan/${params.slug[3]}`)
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
        if (params.slug[4] != "all-kelurahan") {
          setSelectedKelurahan(
            a.find((q: any) => String(q.value) === params.slug[4])
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
      width: "80px",
      selector: (row) => String(row.id),
      sortable: true,
    },
    {
      name: "Tgl Bergabung",
      width: "150px",
      cell: (row) => (
        <>
          <p className="pt-3" style={{ lineHeight: 1 }}>
            {tglIndo(row.createdAt)}
            <br />
            {row.terverifikasi > 0 ? "Terverifikasi" : "Belum Diverifikasi"}
          </p>
        </>
      ),
    },
    {
      name: "Nama",
      width: "180px",
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
      name: "NIK / No. HP",
      width: "230px",
      cell: (row) => (
        <table>
          <tr>
            <td width={30}>NIK</td>
            <td width={10}>:</td>
            <td>{String(row.nik)}</td>
          </tr>
          <tr>
            <td>HP</td>
            <td>:</td>
            <td>{String(row.hp)}</td>
          </tr>
        </table>
      ),
    },
    {
      name: "Alamat KTP",

      cell: (row) => (
        <table>
          <tr>
            <td width={30}>Kab</td>
            <td width={10}>:</td>
            <td>{String(row.kab.nama)}</td>
          </tr>
          <tr>
            <td>Kec</td>
            <td>:</td>
            <td>{String(row.kec.nama)}</td>
          </tr>
          <tr>
            <td>Kel</td>
            <td>:</td>
            <td>{String(row.kel.nama)}</td>
          </tr>
        </table>
      ),
    },
    {
      name: "Refferal",
      width: "180px",
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
            <Lihat reload={reload} user={row} />
            <Update reload={reload} user={row} />
            <Delete reload={reload} userId={row.id} />
          </div>
        </>
      ),
    },
  ];

  const exportExcel = async (title?: string, worksheetname?: string) => {
    try {
      if (data && Array.isArray(data)) {
        const dataToExport = data.map((x: any, index: number) => ({
          No: index + 1,
          Nama: x.nama,
          NIK: x.nik,
          Jabatan: x.jabatan,
          "No. HP": x.hp,
          "No. WA": x.wa,
          "Tempat/Tgl Lahir": `${x.tempatLahir}, ${x.tanggalLahir}`,
          "Kota / Kabupaten": x.kab.nama,
          Kecamagan: x.kec.nama,
          "Kelurahan / Desa": x.kel.nama,
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, worksheetname);
        XLSX.writeFile(workbook, `${title}.xlsx`);
        console.log(`Exported data to ${title}.xlsx`);
        setLoading(false);
      } else {
        setLoading(false);
        console.log("#==================Export Error");
      }
    } catch (error: any) {
      setLoading(false);
      console.log("#==================Export Error", error.message);
    }
  };

  const filteredItems = data.filter(
    (item: any) =>
      (item.nama && item.nama.toLowerCase().includes(filter.toLowerCase())) ||
      (item.nik && item.nik.toLowerCase().includes(filter.toLowerCase())) ||
      (item.hp && item.hp.toLowerCase().includes(filter.toLowerCase()))
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="col-xl-12 col-lg-12">
        <div className="card">
          <div className="card-header flex-wrap" id="default-tab">
            <div className="col-sm-10">
              <div className="row">
                <div className="col-sm-2">
                  <Select
                    placeholder="Semua"
                    className="basic-single mt-1"
                    classNamePrefix="select"
                    options={listVerifikasi}
                    value={selectedVerifikasi}
                    onChange={(e) => handleSelectVerifikasi(e!)}
                  />
                </div>
                <div className="col-sm-2">
                  <Select
                    placeholder="Semua Tim"
                    className="basic-single mt-1"
                    classNamePrefix="select"
                    options={listTim}
                    value={selectedTim}
                    onChange={(e) => handleSelectTim(e!)}
                  />
                </div>
                <div className="col-sm-2">
                  <Select
                    isDisabled={disKab}
                    placeholder="Semua Kabupaten"
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
                <div className="col-sm-2">
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
                <div className="col-sm-2">
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

            <div className="col-sm-2 mb-0">
              <input
                onChange={(e) => setFilter(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Cari NIK/Nama/HP "
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
              conditionalRowStyles={conditionalRowStyles}
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
        <button
          onClick={() => exportExcel(`Data Simpatisan`, "refferal")}
          type="button"
          className="btn btn-info mb-5"
        >
          Export To Excel
        </button>
      </div>
    </div>
  );
}
