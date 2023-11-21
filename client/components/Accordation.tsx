import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Accordions({ quetion, ans }: { quetion: string; ans: string }) {
  return (
    <Accordion type="single" collapsible className="w-full pr-3 pl-3">
      <AccordionItem value="item-1">
        <AccordionTrigger>{quetion}</AccordionTrigger>
        <AccordionContent>{ans}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
