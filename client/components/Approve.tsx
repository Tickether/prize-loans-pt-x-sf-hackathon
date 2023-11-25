"use client";
import React from "react";
import { useContractWrite, erc20ABI } from "wagmi";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { useMyContext } from "@/app/AppContext";
import { etherUnits } from "viem";
function Approve({ amount }: { amount: string }) {
  const { setFlagDeposit } = useMyContext();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4",
    abi: erc20ABI,
    functionName: "approve",
  });

  if (isLoading) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
        {" "}
        Loading Please wait......
      </div>
    );
  }
  if (isSuccess) {
    setFlagDeposit(true);
    return;
  }
  return (
    <div>
      <Button
        className="m-3 w-full"
        variant="destructive"
        onClick={() => {
          write({
            args: [
              `0x${"7C5dfc974D51069de0646F2A9cd50434eDa9433c"}`,
              BigInt(parseInt(amount) * 1000001000000000000),
            ],
          });
        }}
      >
        Approve {amount}/pweth
      </Button>
    </div>
  );
}

export default Approve;
