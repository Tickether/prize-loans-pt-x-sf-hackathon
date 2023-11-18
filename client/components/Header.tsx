import React from "react";

import Image from "next/image";
import { SplineViewer } from "./Spline";

export function Header() {
  return (
    <>
      <div className="flex justify-center w-full h-full items-center min-h-screen">
        <div className=" w-full h-full">
          {" "}
          <SplineViewer
            url="https://prod.spline.design/GH2PsLB0cwKKeEDL/scene.splinecode"
            eventsTarget="global"
          />
        </div>

        <div className="absolute  w-full h-full text-white">
          <div className="font-mono  w-full h-full  text-9xl font-bold flex justify-start items-center">
            <div className="flex-none">
              {" "}
              <p>WellCome To </p>
              <p> Pweethy</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
