"use client";
import React from "react";
import { useContractWrite } from "wagmi";
import { pweethyABI } from "@/utils/pweethy";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
const PayLoanAmount = ({
  amount,
  loanid,
}: {
  amount: bigint;
  loanid: bigint;
}) => {
  const { data, write, isLoading, isSuccess } = useContractWrite({
    address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
    abi: pweethyABI,
    functionName: "payLoanAmount",
  });

  if (isLoading) {
    return <div className="w-fit">Loading. Please wait</div>;
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
            toast({
              title:
                "Your Payment is completed please refresh the page and collect colletral",
              variant: "success",
            });
          }}
        >
          Check transaction
        </Button>
      </div>
    );
  }
  return (
    <Button
      variant="default"
      className="w-full"
      onClick={() => {
        write({ args: [amount, loanid] });
      }}
    >
      Pay Back Loan
    </Button>
  );
};

export default PayLoanAmount;
