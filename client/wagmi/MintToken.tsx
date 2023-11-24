"use client";

import { BaseError } from "viem";
import { useContractWrite, useWaitForTransaction } from "wagmi";

import { wagmiContractConfig } from "./contracts";
import { stringify } from "@/utils/stringify";

export function WriteContract() {
  const { write, data, error, isLoading, isError } = useContractWrite({
    ...wagmiContractConfig,
    functionName: "mint",
  });
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });

  return (
    <div className="flex">
      <h3>Mint Token</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const tokenId = formData.get("tokenId") as string;
          write({
            args: [BigInt(tokenId)],
          });
        }}
      >
        <input name="tokenId" placeholder="token id" />
        <button disabled={isLoading} type="submit">
          Mint
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <div className="max-w-[100px]">
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </div>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </div>
  );
}
