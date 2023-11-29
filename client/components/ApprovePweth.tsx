"use client";
import React, { useState } from "react";
import { useContractWrite, useContractRead, useAccount, erc20ABI } from "wagmi";
import { Button } from "@/components/ui/button";
import { useMyContext } from "@/app/AppContext";
import { toast } from "./ui/use-toast";

const Approve = React.memo(({ amount }: { amount: number }) => {
  const { address } = useAccount();
  const [verifyFlag, setVerifyFlag] = useState(false);
  const { setFlagApprove, setFlagDeposit } = useMyContext();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4",
    abi: erc20ABI,
    functionName: "approve",
  });
  const PwethAllowances = useContractRead({
    address: "0xEF9aFd8b3701198cCac6bf55458C38F61C4b55c4",
    abi: erc20ABI,
    functionName: "allowance",
    args: [
      `0x${address?.slice(2)}`,
      "0x4EC74b34dd8190f02E7d13e00393716981b2BADE",
    ],
  });

  function Verifying() {
    setVerifyFlag(true);
    console.log(PwethAllowances.data);
    const Checkvalue = PwethAllowances?.data ?? BigInt(0);
    console.log(Checkvalue);
    if (
      Checkvalue > BigInt(parseInt((amount * 1000001000000000000).toString()))
    ) {
      toast({
        title: `You already have more Allowance  than Approval amount`,
        variant: "success",
      });

      return;
    } else {
      setVerifyFlag(false);
      write({
        args: [
          `0x${"4EC74b34dd8190f02E7d13e00393716981b2BADE"}`,
          BigInt(amount * 1000001000000000000),
        ],
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-white rounded-2xl">
        {" "}
        Loading Please wait......
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex justify-center m-3 border-solid border-2 p-3 border-green-400 rounded-2xl">
        Approved
      </div>
    );
  }

  return (
    <div>
      {!verifyFlag ? (
        <Button
          className="m-3 w-full"
          variant="destructive"
          onClick={() => Verifying()}
        >
          ` Approve ${amount}/pweth `
        </Button>
      ) : (
        <div className="flex justify-center m-3 border-solid border-2 p-3 border-green-400 rounded-2xl">
          Approved
        </div>
      )}
    </div>
  );
});

export default Approve;
