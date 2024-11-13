"use client";
import Image from "next/image";
import Add from "./action/Add";
import Delete from "./action/Delete";
import { useEffect, useState } from "react";
import Update from "./action/update";
import { Slide } from "@prisma/client";
import { apiImg } from "../helper";

export default function DataSlide() {
  const [isLoading, setLoading] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch("/slide/api/get")
      .then((res) => res.json())
      .then((x) => {
        setLoading(false);
        setSlides(x);
        console.log(x);
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="row">
      {slides.map((x) => (
        <div key={x.id} className="col-xl-4 col-lg-12">
          <div className="card">
            <Image
              src={`${apiImg}/${x.gambar}`}
              alt=""
              height={220}
              width={400}
              className="slide w-100 rounded"
            />
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{x.title}</strong>
                  <br />
                  <small>
                    {x.isShow > 0 ? "Ditampilkan" : "Tidak ditampilkan"}
                  </small>
                </div>

                <div className="d-flex mt-2">
                  <Update reload={reload} slide={x} />
                  <Delete reload={reload} slide={x} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-sm-12">
        <Add reload={reload} />
      </div>
    </div>
  );
}
