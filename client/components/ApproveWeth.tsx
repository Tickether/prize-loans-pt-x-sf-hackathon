"use client";
import React, { useState } from "react";
import { useContractWrite, useContractRead, useAccount, erc20ABI } from "wagmi";
import { Button } from "@/components/ui/button";
import { useMyContext } from "@/app/AppContext";
import { toast } from "./ui/use-toast";

const Approve = React.memo(({ amount }: { amount: bigint }) => {
  const { address } = useAccount();
  const [verifyFlag, setVerifyFlag] = useState(false);
  const { setFlagLoanpay } = useMyContext();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64",
    abi: erc20ABI,
    functionName: "approve",
  });
  const PwethAllowances = useContractRead({
    address: "0xB8e70B16b8d99753ce55F0E4C2A7eCeeecE30B64",
    abi: erc20ABI,
    functionName: "allowance",
    args: [
      `0x${address?.slice(2)}`,
      "0x4EC74b34dd8190f02E7d13e00393716981b2BADE",
    ],
  });

  function Verifying() {
    console.log(PwethAllowances.data);
    const Checkvalue = PwethAllowances?.data ?? BigInt(0);
    console.log(Checkvalue);
    if (Checkvalue > amount) {
      toast({
        title: `You already have more Allowance  than Approval amount`,
        variant: "success",
      });
      setFlagLoanpay(true);
      return;
    } else {
      setVerifyFlag(false);
      write({
        args: [`0x${"4EC74b34dd8190f02E7d13e00393716981b2BADE"}`, amount],
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center  border-solid border-2 p-2 border-white rounded-2xl">
        Loading......
      </div>
    );
  }

  if (isSuccess) {
    setFlagLoanpay(true);
    return;
  }

  return (
    <div>
      <Button
        className=" w-full"
        variant="destructive"
        onClick={() => Verifying()}
      >
        Approve Weth
      </Button>
    </div>
  );
});

export default Approve;

Approve.displayName = "ApproveWeth";
