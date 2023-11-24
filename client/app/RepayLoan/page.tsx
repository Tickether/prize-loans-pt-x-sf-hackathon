"use client";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SuperfluidWidget, {
  EventListeners,
  PaymentOption,
} from "@superfluid-finance/widget";
import { useCallback, useMemo, useState } from "react";
import { WidgetProps, ProductDetails } from "@superfluid-finance/widget";

type RepayLoan = React.ComponentProps<typeof Card>;

function Repay({ className, ...props }: RepayLoan) {
  return (
    <div className="flex justify-center items-center h-[100vh]">Repay page</div>
  );
}

export default Repay;
