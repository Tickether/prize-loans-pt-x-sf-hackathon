"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { pweethyABI } from "@/utils/pweethy";
import { useContractWrite } from "wagmi";
import { toast } from "@/components/ui/use-toast";
import { isErrored } from "stream";
const WithdrawPweth = ({ loanId }: { loanId: bigint }) => {
  const { data, write, isLoading, isSuccess, isError } = useContractWrite({
    address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
    abi: pweethyABI,
    functionName: "defaultPrizeCollateral",
    args: [loanId],
  });
  if (isLoading) {
    return (
      <div className="border-solid border-2 flex justify-center p-3 border-white">
        Loading Please wait
      </div>
    );
  }
  if (isError) {
    toast({
      title: "You can't withdraw now Please Pay all your due",
      variant: "destructive",
    });
  }
  if (isSuccess) {
    return (
      <div>
        <Button
          className="w-full"
          variant="success"
          onClick={() => {
            const link = `https://goerli-optimism.etherscan.io/tx/${data?.hash}`;
            window.open(link, "_blank");
          }}
        >
          Check transaction
        </Button>
        <div className="text-red-600 flex justify-center">
          You can Delete your Stream Now ⚠️
        </div>
      </div>
    );
  }
  return (
    <Button
      variant="secondary"
      onClick={() => {
        write();
      }}
    >
      withdraw your Collatoral
    </Button>
  );
};
// export default WithdrawPweth;
export default WithdrawPweth;
