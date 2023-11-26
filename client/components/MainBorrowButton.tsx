"use client";
import React from "react";
import Approve from "./Approve";
import Superfluid from "./Superfluid";
import { Deposit } from "./Deposite";
import { useMyContext } from "@/app/AppContext";
interface BorrowButtonProps {
  collatoral: string;
}

const BorrowButton: React.FC<BorrowButtonProps> = ({ collatoral }) => {
  const { flagApprove, flagDeposit } = useMyContext();
  return (
    <div>
      {flagApprove && <Approve amount={collatoral} />}

      {flagDeposit && <Deposit collatoral={collatoral} />}
    </div>
  );
};

export default BorrowButton;
