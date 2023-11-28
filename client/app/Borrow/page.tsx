"use client";
import * as React from "react";
import TransactionData from "./DepositData";
import { useAccount, useBalance } from "wagmi";
import { useMyContext } from "../AppContext";
import Approve from "@/components/Approve";
import { Deposit } from "@/components/Deposite";

import {
  Card,
  CardContent,
  CardDescription,
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
  const [collatoral, setCollatrol] = React.useState<number>(0);

  const [intrest, setintrest] = React.useState("");

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: `0x${"EF9aFd8b3701198cCac6bf55458C38F61C4b55c4"}`,
  });

  const enterMore = React.useCallback(() => {
    toast({
      variant: "destructive",
      title: "Not Enough",
      description: "Please Enter more than Zero",
    });
  }, []);

  const Zerobalance = React.useCallback(() => {
    toast({
      variant: "destructive",
      title: "Not Enough Balance",
      description: "Please first get some token by staking in PoolTogether",
    });
  }, [data]);

  React.useEffect(() => {
    if (data?.formatted == "0") {
      Zerobalance();
    }
  }, [data, Zerobalance]);

  function HandleLoan(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value == "0" || e.target.value == "") {
      enterMore();
      setflag(false);

      setCollatrol(0);
      return;
    }
    const col = (parseFloat(e.target.value) * 1.11111).toString();
    setCollatrol(parseFloat(e.target.value) * 1.11111);

    setintrest(
      (parseFloat(e.target.value) * 0.034).toString() // 3.4%   90%  => 0.034 X 0.9 => 0.036
    );
    setflag(true);
  }
  function HandleCollatoral(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value == "0" || e.target.value == "") {
      enterMore();
      setflag(false);
      setCollatrol(0);

      // setLoan("");
      return;
    }

    setCollatrol(parseFloat(e.target.value));
    // setLoan((parseFloat(e.target.value) * 0.9).toString());
    setintrest(
      (parseFloat(e.target.value) * 0.036).toString() // 3.4%   90%  => 0.034 X 0.9 => 0.036
    );

    setflag(true);
  }

  return (
    <div className="flex justify-center pt-[5%] h-[100%]  space-y-2">
      {/* <div className="w-fit flex flex-row min-h-[400px]  h-fit border-solid border-2 border-purple-500 max-h-[70%]"> */}
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
              <div className="max-w-[700px] w-fit">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Accordions
                      quetion="What is Collatoral balance ?"
                      ans="Collatoral balance is the Pweth token that you have in your connected wallet."
                    />
                    <div className="flex flex-row border-solid border-2 m-3 p-3 rounded-2xl border-sky-500 justify-between">
                      <Label htmlFor="name">Collatoral balance</Label>
                      {data?.formatted?.slice(0, 10)} PWeth
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
                          type="number"
                          onChange={(e) => {
                            HandleCollatoral(e);
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
                          type="number"
                          onChange={(e) => {
                            HandleLoan(e);
                          }}
                          placeholder="enter Loan amount"
                          value={collatoral * 0.9}
                        />
                      </div>
                    </div>

                    {flag ? (
                      <div>
                        <Approve amount={collatoral} />
                        <Deposit collatoral={collatoral} />
                      </div>
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
              </div>
            ) : (
              <div>Please first connect your Wallet</div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* <div>
          <TransactionData txhash="0xb9f49daca1a610298ef8f64a99e4ecedef2144bc4dc990e1dd90881fc190c535" />
        </div> */}
      {/* </div> */}
    </div>
  );
}
