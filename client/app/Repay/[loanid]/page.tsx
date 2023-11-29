"use client";
import React from "react";
import {
  Table,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEthersProvider } from "@/utils/WagmiEthersProvider";
import { useEthersSigner } from "@/utils/WagmiEthersSigner";
import { useContractRead } from "wagmi";
import Approve from "@/components/ApproveWeth";
import { useMyContext } from "@/app/AppContext";
import PayLoanAmount from "./PayLoanAmount";
import { Button } from "@nextui-org/react";
import { pweethyABI } from "@/utils/pweethy";
import { ethers } from "ethers";
import { Input } from "@/components/ui/input";
const page = ({ params }: { params: { loanid: bigint } }) => {
  const { flagLoanpay } = useMyContext();
  const [payamount, setPayamount] = React.useState<bigint>(BigInt(0));
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  console.log(params);
  const { data, isError, isLoading, isSuccess } = useContractRead({
    address: "0x4ec74b34dd8190f02e7d13e00393716981b2bade",
    abi: pweethyABI,
    functionName: "borrowers",
    args: [params.loanid],
  });
  React.useEffect(() => {
    console.log("fowesj");
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
    const disbursTime = new Date(Number(data[5]) * 1000);
    const ExpireTime = new Date(Number(data[6]) * 1000);
    return (
      <div className="h-[100vh] flex justify-center mt-[7%]">
        <div className=" min-w-[60%] flex justify-center items-center flex-col">
          <div className="flex justify-center  text-3xl font-bold">
            Loan Detail
          </div>
          <Table>
            <TableRow>
              <TableCell colSpan={3}>Borrower</TableCell>
              <TableCell className="text-right">
                {`${data[0].slice(0, 4)}....${data[0].slice(
                  data[0].length - 4,
                  data[0].length
                )}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>ColateralAmount</TableCell>
              <TableCell className="text-right">
                {`${ethers.utils.formatEther(data[1].toString())}/pweth`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan Amount</TableCell>
              <TableCell className="text-right">
                {`${ethers.utils.formatEther(data[2].toString())}/weth`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>LoanAmount Paid</TableCell>
              <TableCell className="text-right">
                {`${ethers.utils.formatEther(data[3].toString())}/weth`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>LoanPayableAddress</TableCell>
              <TableCell className="text-right">
                {`${data[4].slice(0, 4)}....${data[4].slice(
                  data[0].length - 4,
                  data[0].length
                )}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan disburs Time </TableCell>
              <TableCell className="text-right">
                {`${disbursTime.toString().slice(4, 25)}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan Expiry Date </TableCell>
              <TableCell className="text-right">
                {`${ExpireTime.toString().slice(4, 25)}`}
              </TableCell>
            </TableRow>
          </Table>
          <div className="mt-4 border-solid border-2 flex justify-around flex-col gap-4 w-[50%] p-3 rounded-lg border-blue-400">
            <div className="flex gap-2 ">
              <div className="w-[50%]">
                {" "}
                <Input
                  placeholder="Please amount you want to pay"
                  type="number"
                  className="w-full"
                  max={Number(ethers.utils.formatEther(data[2].toString()))}
                  onChange={(e) => {
                    if (isNaN(parseFloat(e.target.value))) {
                      return;
                    }
                    setPayamount(
                      BigInt(parseFloat(e.target.value) * 1000000000000000000)
                    );
                  }}
                />
              </div>
              <div className="w-[50%]">
                {!flagLoanpay ? (
                  <Approve amount={payamount} />
                ) : (
                  <PayLoanAmount amount={payamount} loanid={params.loanid} />
                )}
              </div>
            </div>

            {data[3] >= data[1] && (
              <Button
                variant="flat"
                onClick={() => {
                  DeleteExistingFlow(data[4]);
                }}
              >
                Delete Your Intrest stream
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      Please refresh the page if page is blank
    </div>
  );
};

export default page;
