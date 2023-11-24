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

type RepayLoan = React.ComponentProps<typeof Card>;

function Repay({ className, ...props }: RepayLoan) {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className=" flex items-center  h-fit w-full ml-[20%] mr-[20%] rounded-md border p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="w-full h-fit border-solid border-2 border-sky-500">
                <div className="flex justify-start ml-[30px] text-4xl font-bold font-display">
                  head
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
              <button
                onClick={() => {
                  alert("why are you gay");
                }}
              >
                click me{" "}
              </button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default Repay;
