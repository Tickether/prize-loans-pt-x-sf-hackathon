"use client";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEthersProvider } from "@/utils/WagmiEthersProvider";
import { useEthersSigner } from "@/utils/WagmiEthersSigner";

const BorrowDemoHistory = [
  {
    CollateralAmount: "10",
    LoanAmount: "9",
    TimeTillLow: "4sec ago",
    IntrestAmount: "3.4",
    LoanCreationDate: "10 day ago",
    LoanEndingDate: "355 days left ",
    AmountPaid: "3",
    AmountOwedAfter: "7",
    Active: true,
  },
  {
    CollateralAmount: "10",
    LoanAmount: "9",
    TimeTillLow: "4sec ago",
    IntrestAmount: "3.4",
    LoanCreationDate: "10 day ago",
    LoanEndingDate: "355 days left ",
    AmountPaid: "3",
    AmountOwedAfter: "7",
    Active: false,
  },
];

function Repay() {
  const provider = useEthersProvider();
  const signer = useEthersSigner();
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

  return (
    <div className="flex justify-center flex-col gap-10 max-w-[75%]  h-[100vh]">
      {BorrowDemoHistory.map((item, index) => {
        return (
          <div
            key={index}
            className={`flex items-center ${
              item.Active ? "bg-blue-400 text-black" : "bg-red-500"
            } h-fit w-full  ml-[20%] mr-[20%] rounded-md border p-4`}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex w-full flex-col gap-7">
                    <div className="w-full flex h-fit ">
                      <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                        Lending time : {item.LoanCreationDate}
                      </div>
                      <div className="flex justify-end ml-[30px] text-xl font-bold ">
                        Borrower : 0x..........
                      </div>
                    </div>
                    <div className="w-full flex h-fit ">
                      <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                        Collatoral {item.CollateralAmount}/Pweth
                      </div>
                      <div className="flex justify-end ml-[30px] text-xl font-bold ">
                        Loan {item.LoanAmount}/weth
                      </div>
                    </div>
                    <div className="w-full flex h-fit ">
                      <div className="flex justify-start ml-[30px] w-[50%] text-xl font-bold ">
                        intrest-paid {item.IntrestAmount}/ethx
                      </div>
                      <div className="flex justify-end ml-[30px] text-xl font-bold ">
                        deposit {item.AmountOwedAfter}/weth
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {item.Active ? (
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
                          await DeleteExistingFlow(
                            "0x861715cD400524D279Df4240a99f3C0E22b1c562"
                          );
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
        );
      })}
    </div>
  );
}

export default Repay;
