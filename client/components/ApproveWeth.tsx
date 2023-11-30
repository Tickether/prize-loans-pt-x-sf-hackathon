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
      "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
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
        args: [`0x${"E6dD6265Eb872cEF38F969A9bF6a3f41626b0f46"}`, amount],
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center w-full border-solid border-2 p-2 border-white rounded-2xl">
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
        Approve WETH
      </Button>
    </div>
  );
});

export default Approve;

Approve.displayName = "ApproveWeth";

Approve.displayName = "ApproveWeth";
