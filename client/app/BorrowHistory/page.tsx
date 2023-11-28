"use client";

import { pweethyABI } from "@/utils/pweethy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";

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
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    abi: pweethyABI,
    functionName: "getBorrowerLoans",
    args: [`0x${address?.slice(2)}`],
  });

  useEffect(() => {
    console.log("fws");
  }, [address]);

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

    return (
      <div>
        {data?.map((item, index) => {
          return (
            <div className="flex justify-center gap-10" key={index}>
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
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    abi: pweethyABI,
    functionName: "borrowers",
    args: [num],
  });
  useEffect(() => {
    console.log("fws");
  }, [data]);
  async function DeleteExistingFlow(recipient: string) {
    console.log(recipient);
    console.log(provider);
    console.log(signer);
    try {
      if (signer != undefined) {
        const chainId = "420";
        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider,
        });

        const superSigner = sf.createSigner({ signer: signer });

        console.log(signer);
        console.log(await superSigner.getAddress());
        const daix = await sf.loadSuperToken(
          "0xE01F8743677Da897F4e7De9073b57Bf034FC2433"
        );

        // console.log(daix);
        const ss = await signer.getAddress();
        const deleteFlowOperation = daix.deleteFlow({
          sender: await signer.getAddress(),
          receiver: recipient,
          // userData?: string
        });

        const result = await deleteFlowOperation.exec(superSigner);
        console.log(result);

        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (isLoading) {
    return <div>Your Data is loading Please Wait .....</div>;
  }

  if (isError) {
    return <div>We get some error ........</div>;
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
          currentTimestampInSeconds < data[6]
            ? "bg-blue-400 text-black"
            : "bg-red-500"
        } h-fit max-w-[80%]   rounded-md border p-4`}
      >
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex w-full flex-col gap-7">
                  <div className="w-full flex h-fit ">
                    <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                      LoanPayableAddress
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
                      Collatoral amount <br />
                      {`${ethers.utils.formatEther(data[1].toString())}/pweth`}
                    </div>
                    <div className="flex justify-end ml-[30px] text-xl font-bold ">
                      Loan Amount <br />
                      {`${ethers.utils.formatEther(data[2].toString())}/weth`}
                    </div>
                  </div>
                  <div className="w-full flex h-fit ">
                    <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                      Lending time : {`${disbursTime.toString().slice(4, 25)}`}
                    </div>
                    <div className="flex justify-end ml-[30px] text-xl font-bold ">
                      Loan Expiry Date {`${ExpireTime.toString().slice(4, 25)}`}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {currentTimestampInSeconds < data[6] ? (
                  <div className="flex justify-center gap-10 border-t-2 border-red-400 pt-10 ml-[30px] text-xl font-bold ">
                    <Button
                      variant="success"
                      onClick={() => {
                        alert("hello sir");
                      }}
                    >
                      Pay all at once
                    </Button>
                    <div className="flex flex-row gap-3 text-white h-fit">
                      <Input placeholder="enter partial amount" />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          alert("hello sir");
                        }}
                      >
                        Pay partial
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await DeleteExistingFlow(data[4]);
                      }}
                    >
                      Delete Intrest Stream
                    </Button>
                  </div>
                ) : (
                  <div className="text-4xl flex items-center font-bold border-t-2 flex-col  border-black pt-10 text-black">
                    <p>thanks for Taking loan from us 😊</p>
                    <p>this loan is closed</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
};
