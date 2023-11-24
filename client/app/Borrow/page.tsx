"use client";
import * as React from "react";
import Superfluid from "@/components/Superfluid";
import { Button } from "@/components/ui/button";

import { useAccount, useBalance } from "wagmi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordions } from "@/components/Accordation";
import { useToast } from "@/components/ui/use-toast";
export default function CardWithForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [flag, setflag] = React.useState(false);
  const [flowrate, setFlowRate] = React.useState("");
  const [collatoral, setCollatrol] = React.useState("");
  const [loan, setLoan] = React.useState("");
  const [intrest, setintrest] = React.useState("");

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: `0x${"ad91c29732fd148616882d2b50f2d886204e570b"}`,
  });
  const enterMore = React.useCallback(() => {
    toast({
      variant: "destructive",
      title: "Not Enough",
      description: "Please Enter more than Zero",
    });
  }, [toast]);
  const Zerobalance = React.useCallback(() => {
    toast({
      variant: "destructive",
      title: "Not Enough Balance",
      description: "Please first get some token by staking in PoolTogether",
    });
  }, [toast]);
  React.useEffect(() => {
    if (data?.formatted == "0") {
      Zerobalance();
    }
  }, [data, Zerobalance]);

  return (
    <div className="flex justify-center pt-[5%] h-[100%]  space-y-2">
      <Card className="w-fit max-w-[70%] min-h-[400px]  h-fit mb-[6%] border-solid border-2 border-purple-500 max-h-[70%]">
        <CardHeader>
          <CardTitle>Borrow Against PWETH</CardTitle>
          <CardDescription>
            you can take as much as 90% of you pweth
          </CardDescription>
        </CardHeader>
        <CardContent className="flex  flex-row">
          <div>
            {address ? (
              <form className="max-w-[400px]">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Accordions
                      quetion="What is Collatoral balance ?"
                      ans="Collatoral balance is the Pweth token that you have in your connected wallet."
                    />
                    <div className="flex flex-row border-solid border-2 m-3 p-3 rounded-2xl border-sky-500 justify-between">
                      <Label htmlFor="name">Collatoral balance</Label>
                      {data?.formatted} PWeth
                    </div>
                    <Accordions
                      quetion="What is Collatoral Amount ?"
                      ans="Collatoral Amount is amount of token which you want to stake in our smartcontract for loan you can take loan as much as 90%"
                    />
                    <div className="border-solid border-2  rounded-2xl border-sky-500">
                      <div className="flex flex-row justify-between m-3 p-3 ">
                        <div className="flex items-center justify-center">
                          <Label htmlFor="name">Collatoral Amount</Label>
                        </div>
                        <Input
                          id="name"
                          onChange={(e) => {
                            if (e.target.value == "0" || e.target.value == "") {
                              enterMore();
                              setflag(false);
                              setCollatrol("");
                              setLoan("");
                              return;
                            }

                            console.log(e.target.value);
                            setCollatrol(e.target.value);
                            const num: any = e.target.value;
                            const intrestx = parseFloat(e.target.value) * 0.036; // 3.4%   90%  => 0.034 X 0.9 => 0.036
                            setLoan((num * 0.9).toString());
                            setintrest(intrestx.toString());
                            setFlowRate((intrestx / 12).toString());
                            setflag(true);
                          }}
                          placeholder="enter collatoral amount"
                          value={collatoral}
                        />
                      </div>
                      {}
                      <div className="border-b-4 border-sky-500"></div>
                      <div className="flex flex-row justify-between  m-3 p-3 ">
                        <div className="flex items-center justify-center">
                          <Label htmlFor="name">Loan Amount</Label>
                        </div>
                        <Input
                          id="name"
                          onChange={(e) => {
                            if (e.target.value == "0" || e.target.value == "") {
                              enterMore();
                              setflag(false);
                              setLoan("");
                              setCollatrol("");
                              return;
                            }

                            console.log(e.target.value);
                            const num = parseFloat(e.target.value);
                            setCollatrol((num * 1.11111).toString());

                            const intrestx = parseFloat(e.target.value) * 0.034; // 3.4%   90%  => 0.034 X 0.9 => 0.036
                            setLoan(e.target.value);
                            setintrest(intrestx.toString());
                            setFlowRate((intrestx / 12).toString());
                            setflag(true);
                          }}
                          placeholder="enter Loan amount"
                          value={loan}
                        />
                      </div>
                    </div>

                    {flag ? (
                      <Button className="m-3" variant="outline">
                        Deposit {collatoral}/PWeth ➡️ get {loan}/eth
                      </Button>
                    ) : (
                      <div className="text-red-500 m-3 flex justify-center">
                        ⚠️Please enter the collatoral amount
                      </div>
                    )}

                    <Accordions
                      quetion="What is Intrest/year ?"
                      ans="Our application charge 3.4% interest rate for the loan amount and you have to pay intrest in Stream by Superfluid"
                    />
                    <div className="flex justify-between border-solid border-2 m-3 p-3 rounded-2xl border-sky-500">
                      <Label>Interest/year </Label>
                      {flag ? (
                        <Label> {intrest.slice(0, 8)} / eth</Label>
                      ) : (
                        <Label>0 / eth</Label>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end"></div>
                </div>
              </form>
            ) : (
              <div>Please first connect your Wallet</div>
            )}
          </div>

          {/* <div className=" border-solid border-2 m-3 p-3 rounded-2xl border-sky-500">
            <img src="../c9b17b864d743c794bdc4e8227d4d427.svg" alt="" />
          </div> */}
        </CardContent>
        <CardFooter className="flex  justify-center">
          <div className=" flex  w-full justify-end pr-3  ">
            <Superfluid amount={flowrate} />
          </div>

          {/* we have to give per month amount */}
        </CardFooter>
      </Card>
    </div>
  );
}
