import React from "react";
import { useWaitForTransaction } from "wagmi";

const TransactionData = ({ txhash }: { txhash: string }) => {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: `0x${txhash.slice(2)}`,
  });
  if (isLoading) {
    return <div> Processing transaction Hash......</div>;
  }
  if (isError) {
    return <div> Transaction Error</div>;
  }
  return <div>TransactionData : {}</div>;
};

export default TransactionData;
