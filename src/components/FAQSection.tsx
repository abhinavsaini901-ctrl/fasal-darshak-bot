import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FAQItem = { q: string; a: string };

export function FAQSection({ items, title = "अक्सर पूछे जाने वाले प्रश्न" }: { items: FAQItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-5 text-2xl font-bold text-foreground">{title}</h2>
      <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card">
        {items.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`} className="px-4">
            <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
