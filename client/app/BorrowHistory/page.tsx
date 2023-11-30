"use client";
import PayLoanAmount from "../Repay/[loanid]/PayLoanAmount";
import { pweethyABI } from "@/utils/pweethy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import Link from "next/link";
import { useContractRead, useAccount } from "wagmi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEthersProvider } from "@/utils/WagmiEthersProvider";
import { useEthersSigner } from "@/utils/WagmiEthersSigner";
import { useEffect } from "react";

function Repay() {
  const { address } = useAccount();

  const { data, isError, isLoading, isSuccess } = useContractRead({
    address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
    abi: pweethyABI,
    functionName: "getBorrowerLoans",
    args: [`0x${address?.slice(2)}`],
  });

  useEffect(() => {
    console.log("fws");
  }, [address, isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        Please Wait your Borrower History Is loading
      </div>
    );
  }
  if (isSuccess && data) {
    console.log(data);
    const num: bigint = data[data?.length - 1];
    const Array: bigint[] = data.toReversed();
    return (
      <div className="pt-44 flex   items-center flex-col gap-10 ">
        {Array?.map((item, index) => {
          return (
            <div className=" flex justify-center w-full " key={index}>
              <TokenData num={item} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Repay;

const TokenData = ({ num }: { num: bigint }) => {
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const { data, isError, isLoading, isSuccess } = useContractRead({
    address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
    abi: pweethyABI,
    functionName: "borrowers",
    args: [num],
  });
  if (isLoading) {
    return <div>Your Data is loading. Please Wait .....</div>;
  }

  if (isError) {
    return <div>We got some error ........</div>;
  }

  if (isSuccess && data) {
    console.log(data);
    const currentTimestampInSeconds: number = Math.floor(Date.now() / 1000);
    console.log(currentTimestampInSeconds);

    const disbursTime = new Date(Number(data[5]) * 1000);
    const ExpireTime = new Date(Number(data[6]) * 1000);
    return (
      <div
        className={`flex  item-center  ${
          data[3] >= data[2] ? "bg-blue-400 text-black" : "bg-red-500"
        } h-fit max-w-[80%]  rounded-md border p-4`}
      >
        <div>
          <div className="flex w-full flex-col gap-7">
            <div className="w-full flex h-fit ">
              <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                Loan Payable Address :
                {`${data[4].slice(0, 4)}....${data[4].slice(
                  data[0].length - 4,
                  data[0].length
                )}`}
              </div>

              <div className="flex justify-end ml-[30px] text-xl font-bold ">
                Borrower :
                {`${data[0].slice(0, 4)}....${data[0].slice(
                  data[0].length - 4,
                  data[0].length
                )}`}
              </div>
            </div>
            <div className="w-full flex h-fit ">
              <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                Collateral Amount
                {`${ethers.utils.formatEther(data[1].toString())} pWETH`}
              </div>
              <div className="flex justify-end ml-[30px] text-xl font-bold ">
                Loan Amount
                {`${ethers.utils.formatEther(data[2].toString())} WETH`}
              </div>
            </div>
            <div className="w-full flex h-fit ">
              <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                Loan Start Date
                {`${disbursTime.toString().slice(4, 25)}`}
              </div>
              <div className="flex justify-end ml-[30px] text-xl font-bold ">
                Loan Expiry Date
                {`${ExpireTime.toString().slice(4, 25)}`}
              </div>
            </div>
          </div>

          {data[3] >= data[2] ? (
            <div className="flex justify-center gap-10  pt-10 ml-[30px] text-xl font-bold ">
              <Link
                className="border-solid border-2 border-white p-3 rounded-3xl"
                href={`/Repay/${num}`}
              >
                Click here to pay back your Loan
              </Link>
            </div>
          ) : (
            <div className="flex justify-center gap-10  pt-10 ml-[30px] text-xl font-bold ">
              <Link
                className="border-solid border-2 bg-black border-white p-3 rounded-3xl"
                href={`/Repay/${num}`}
              >
                Click here to Withdraw your Collateral
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
};
