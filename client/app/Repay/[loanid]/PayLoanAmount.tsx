"use client";
import React from "react";
import { useContractWrite } from "wagmi";
import { pweethyABI } from "@/utils/pweethy";
import { Button } from "@/components/ui/button";
const PayLoanAmount = ({
  amount,
  loanid,
}: {
  amount: bigint;
  loanid: bigint;
}) => {
  const { data, write, isLoading, isSuccess } = useContractWrite({
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    abi: pweethyABI,
    functionName: "payLoanAmount",
  });

  if (isLoading) {
    return <div>Loading please wait</div>;
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
      Pay Loan
    </Button>
  );
};

export default PayLoanAmount;
