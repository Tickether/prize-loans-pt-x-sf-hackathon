"use client";
import * as React from "react";
import { useContractWrite } from "wagmi";
import { Button } from "@/components/ui/button";
import { pweethyABI } from "@/utils/pweethy";
import { divider } from "@nextui-org/react";

export function Deposit({
  collatoral,
  loan,
}: {
  collatoral: string;
  loan: string;
}) {
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x7C5dfc974D51069de0646F2A9cd50434eDa9433c",
    abi: pweethyABI,
    functionName: "collateralizedPrizeLoan",
  });

  if (isLoading) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
        Loading Please wait......
      </div>
    );
  }

  if (isSuccess) {
    <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
      Loan completed check your wallet and also start paying stream
    </div>;
  }
  console.log(parseInt(collatoral) * 1000000000000000000);
  return (
    <Button
      className="m-3 w-full"
      variant="outline"
      onClick={() => {
        try {
          write({
            args: [BigInt(parseInt(collatoral) * 1000000000000000000)],
          });
        } catch (e) {
          console.log(e);
        }
      }}
    >
      Deposit {collatoral}/PWeth ➡️ get {loan}/eth
    </Button>
  );
}
