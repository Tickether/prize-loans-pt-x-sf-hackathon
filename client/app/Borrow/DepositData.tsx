import React, { use } from "react";
import { useContractRead, useAccount } from "wagmi";
import { pweethyABI } from "@/utils/pweethy";

const DepositData = ({ address }: { address: string }) => {
  const { data, isError, isLoading, isSuccess } = useContractRead({
    abi: pweethyABI,
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    functionName: "getBorrowerLoans",
    args: [`0x${address.slice(2)}`],
  });
  if (isLoading) {
    return <div> Processing transaction Hash......</div>;
  }
  if (isSuccess && data) {
    const num: bigint = data[data?.length];
    return (
      <div>
        <TokenData num={num} />
      </div>
    );
  }
  if (isError) {
    return <div> Transaction Error</div>;
  }
  return <div>Your DepositData </div>;
};

export default DepositData;

function TokenData({ num }: { num: bigint }) {
  const { data, isError, isLoading, isSuccess } = useContractRead({
    abi: pweethyABI,
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    functionName: "borrowers",
    args: [num],
  });

  if (isLoading) {
    return <div>Your Data is loading Please Wait .....</div>;
  }

  if (isError) {
    return <div>We get some error ........</div>;
  }

  if (isSuccess && data) {
    return <div>{data[0]}</div>;
  }
}
