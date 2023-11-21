import React from "react";

import Image from "next/image";
import { SplineViewer } from "./Spline";

export function Header() {
  return (
    <>
      <div className="flex  justify-center w-full h-full items-center min-h-screen">
        <div className="flex  z-1 flex-col mt-96 mb-96  w-full h-full">
          <div className="flex flex-col items-start font-mono   text-9xl font-bold  w-full h-full">
            <p>Welcome to </p>
            <p> Pweethy</p>
          </div>

          <div className=" font-mono items-end  mt-44    text-5xl italic font-bold flex flex-col w-full h-full">
            <div>
              <p>Obtain easy loans </p>
              <p>Against </p>
              <p>PoolTogether pWETH 🪙</p>
            </div>
          </div>
          <div className=" font-mono items-start  mt-44    text-5xl italic font-bold flex flex-col w-full h-full">
            <div>
              <p>Stream interests</p>
              <br />
              <p>Powered by Superfluid🌊</p>
            </div>
          </div>
        </div>
        <div className="fixed   top-0 w-full h-full text-white">
          <SplineViewer
            url="https://prod.spline.design/GH2PsLB0cwKKeEDL/scene.splinecode"
            eventsTarget="global"
          />
        </div>
      </div>
    </>
  );
}
