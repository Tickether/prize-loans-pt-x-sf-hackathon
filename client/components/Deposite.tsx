"use client";
import * as React from "react";
import { useContractWrite } from "wagmi";
import { Button } from "@/components/ui/button";
import { pweethyABI } from "@/utils/pweethy";
import { useMyContext } from "@/app/AppContext";
import { useToast } from "./ui/use-toast";
import { parseEther } from "viem";
export function Deposit({ collatoral }: { collatoral: number }) {
  const { toast } = useToast();
  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      address: "0x4EC74b34dd8190f02E7d13e00393716981b2BADE",
      abi: pweethyABI,
      functionName: "collateralizedPrizeLoan",
    });
  const handleClick = React.useCallback(() => {
    try {
      console.log(BigInt(collatoral * 1000000000000000000));
      write({
        args: [BigInt(collatoral * 1000000000000000000)],
      });
    } catch (e) {
      console.log(e);
    }
  }, [collatoral]);

  if (isLoading) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
        Loading Please wait......
      </div>
    );
  }

  // if (isError) {
  //   console.error(error); // Log the error for debugging purposes
  //   console.log(data);
  //   // toast({
  //   //   title: "There is some error. Please refresh the page and try again.",
  //   //   variant: "destructive",
  //   // });

  //   // Handle the error gracefully, you might want to render an error message or take other actions
  //   return (
  //     <div className="flex justify-center m-3 border-solid border-2 p-3 bg-red-500 border-white rounded-2xl">
  //       Error occurred while processing the deposit.
  //     </div>
  //   );
  // }

  if (isSuccess) {
    console.log(data);
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 bg-green-400 border-white rounded-2xl">
        Deposit of {collatoral}/eth Completed
      </div>
    );
  }

  return (
    <Button
      className="m-3 w-full"
      variant="outline"
      onClick={() => handleClick()}
    >
      Deposit {collatoral}/PWeth ➡️ get {collatoral * 0.9}/eth
    </Button>
  );
}
