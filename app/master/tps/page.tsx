"use client";
import { useEffect } from "react";
import { useState } from "react";
import GenerateTPS from "./action/Add";

const TpsPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [listKota, setListKota] = useState([]);
  const [listKec, setListKec] = useState([]);

  useEffect(() => {
    loadKota();
    setLoading(false);
  }, []);

  const reload = async () => {};

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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <GenerateTPS listKota={listKota} defKec={listKec} reload={reload} />
    </div>
  );
};

export default TpsPage;
