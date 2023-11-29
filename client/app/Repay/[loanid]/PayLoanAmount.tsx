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
        Payment completed Please refresh and check your hitory your transaction
        hash {data?.hash}
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
export const runtime = 'edge';
