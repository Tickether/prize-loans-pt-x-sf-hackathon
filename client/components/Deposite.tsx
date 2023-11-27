"use client";
import * as React from "react";
import { useContractWrite } from "wagmi";
import { Button } from "@/components/ui/button";
import { pweethyABI } from "@/utils/pweethy";
import { useMyContext } from "@/app/AppContext";
import { useToast } from "./ui/use-toast";

export function Deposit({ collatoral }: { collatoral: string }) {
  const { toast } = useToast();

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x4EC74b34dd8190f02E7d13e00393716981b2BADE",
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

  if (error) {
    console.log(data);
    toast({
      title: "There is some error Please Refresh page and try again",
      variant: "destructive",
    });
  }

  if (isSuccess) {
    console.log(data);
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 bg-green-400 border-white rounded-2xl">
        Deposite of {collatoral}/eth Completed
      </div>
    );
  }
  function handleClick() {
    write({
      args: [BigInt(parseFloat(collatoral) * 1000000000000000000)],
    });
  }
  console.log(parseFloat(collatoral) * 1000000000000000000);
  return (
    <Button
      className="m-3 w-full"
      variant="outline"
      onClick={() => handleClick()}
    >
      Deposit {collatoral}/PWeth ➡️ get {parseFloat(collatoral) * 0.9}/eth
    </Button>
  );
}
