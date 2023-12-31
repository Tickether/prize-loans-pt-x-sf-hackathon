import React, { use, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import { pweethyABI } from "@/utils/pweethy";
import Superfluid from "@/components/Superfluid";
import { useMyContext } from "../AppContext";
import { ethers } from "ethers";
import {
  Table,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";

const DepositData = ({
  address,
  amount,
}: {
  address: string;
  amount: number;
}) => {
  const { flagDeposit } = useMyContext();
  const [dataDo, setDataDo] = React.useState<readonly bigint[]>();
  const { data, isError, isLoading, isSuccess } = useContractRead({
    address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
    abi: pweethyABI,
    functionName: "getBorrowerLoans",
    args: [`0x${address.slice(2)}`],
  });

  useEffect(() => {
    if (data) {
      setDataDo(data);
    }
  }, [flagDeposit]);
  if (isLoading) {
    return <div> Processing transaction Hash......</div>;
  }
  if (isSuccess && data) {
    console.log(data);
    const num: bigint = data[data?.length - 1];

    return <TokenData num={num} amount={amount} />;
  }
};

export default DepositData;

const TokenData = React.memo(
  ({ num, amount }: { num: bigint; amount: number }) => {
    const { flagDeposit } = useMyContext();
    const { data, isError, isLoading, isSuccess } = useContractRead({
      address: "0xE6dD6265Eb872cEF38F969A9bF6a3f41626b0f46",
      abi: pweethyABI,
      functionName: "borrowers",
      args: [num],
    });
    useEffect(() => {
      console.log("fowesj");
    }, [data, flagDeposit]);
    if (isLoading) {
      return <div>Your Data is loading. Please Wait .....</div>;
    }

    if (isError) {
      return <div>We got some error ........</div>;
    }

    if (isSuccess && data) {
      console.log(data);
      const disbursTime = new Date(Number(data[5]) * 1000);
      const ExpireTime = new Date(Number(data[6]) * 1000);
      return (
        <div>
          <div className="flex justify-center text-3xl font-bold">
            Loan Details
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
              <TableCell colSpan={3}>Collateral Amount</TableCell>
              <TableCell className="text-right">
                {`${ethers.utils.formatEther(data[1].toString())} pWETH`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan Amount</TableCell>
              <TableCell className="text-right">
                {`${ethers.utils.formatEther(data[2].toString())} WETH`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan Payable Address</TableCell>
              <TableCell className="text-right">
                {`${data[4].slice(0, 4)}....${data[4].slice(
                  data[0].length - 4,
                  data[0].length
                )}`}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Loan Start Date </TableCell>
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
            <TableCaption>
              Please Start Stream for interest payment
            </TableCaption>
          </Table>
          <div className="mt-4 flex justify-center">
            <Superfluid amount={amount} reciver={data[4]} />
          </div>
        </div>
      );
    }
  }
);

TokenData.displayName = "TokenData";
