"use client";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function Navbar() {
  return (
    <div className=" fixed top-4 w-full h-[63px] flex items-center justify-center z-50">
      <div className=" w-[60%] h-full bg-zinc-900 rounded-3xl flex items-center justify-between px-2">
        {/* logo------ */}
        <div className=" w-fit h-12 flex items-center gap-1">
          <div className=" h-full font-display text-blue-200 leading-none text-xl flex flex-col items-start justify-center">
            <p>Pweethy</p>
          </div>
        </div>
        {/* logo--------- */}
        {/* navlinks------ */}
        <div className=" flex items-center justify-center gap-6 text-base ginto-md text-blue-200 leading-none">
          <Link href={"/"}>Home</Link>
          <Link href={"/Borrow"}>Borrow</Link>

          <Link href={"/BorrowHistory"}>Borrow-History</Link>
        </div>

        <div className="mr-3">
          <ConnectButton />
        </div>

        {/* CTA--------- */}
      </div>
    </div>
  );
}
