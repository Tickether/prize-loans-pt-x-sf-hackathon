"use client";

import { useBalance, useAccount } from "wagmi";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { ToastAction } from "./ui/toast";
function Balance({ token }: { token: string }) {
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: `0x${token.slice(2)}`,
  });
  console.log(`${isError} y error h `);
  if (data?.formatted == "0") {
    toast({
      title: "You don't have pWETH",
      description: "Stake your WETH and get pWETH from PoolTogether",
      action: (
        <ToastAction altText="Go stake some WETH on PoolTogether"></ToastAction>
      ),
    });
  }
  if (!address) return <div> Connect wallet</div>;
  if (isLoading) return <div> Fetching balance…</div>;

  return <div>{data?.formatted} PWeth</div>;
}

export default Balance;
