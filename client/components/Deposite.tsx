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
  const { setFlagDeposit, flagDeposit } = useMyContext();
  const { data, isLoading, isSuccess, write, isError, error } =
    useContractWrite({
      address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
      abi: pweethyABI,
      functionName: "collateralizedPrizeLoan",
    });

  const handleClick = React.useCallback(() => {
    try {
      console.log(
        BigInt(parseInt((collatoral * 1000000000000000000).toString()))
      );
      write({
        args: [BigInt(parseInt((collatoral * 1000000000000000000).toString()))],
      });
    } catch (e) {
      console.log(e);
    }
  }, [collatoral, write]);

  if (isLoading) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
        Loading. Please wait......
      </div>
    );
  }

  if (isSuccess) {
    setTimeout(() => {
      setFlagDeposit(true);
    }, 5000);
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 bg-green-400 border-white rounded-2xl">
        Deposit of {collatoral} pWETH complete
      </div>
    );
  }

  return (
    <Button
      className="m-3 w-full"
      variant="outline"
      onClick={() => handleClick()}
    >
      Deposit {collatoral} pWETH ➡️ Get {collatoral * 0.9} WETH
    </Button>
  );
}
