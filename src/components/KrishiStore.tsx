import { Sprout, FlaskConical, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ITEMS = [
  {
    title: "बीज स्टोर",
    desc: "प्रमाणित बीज खरीदें",
    price: "₹99 से शुरू",
    cta: "खरीदें",
    href: "https://agribegri.com/seeds",
    icon: Sprout,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "कृषि दवा स्टोर",
    desc: "कीटनाशक, फफूंदनाशक और जैविक दवाइयाँ",
    price: "₹149 से शुरू",
    cta: "खरीदें",
    href: "https://agribegri.com/crop-protection",
    icon: FlaskConical,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "कृषि यात्रा",
    desc: "कृषि प्रशिक्षण, फार्म विजिट और कृषि एक्सपो",
    price: "₹499 से शुरू",
    cta: "बुक करें",
    href: "https://www.krishijagran.com",
    icon: MapPin,
    color: "text-indigo-600 bg-indigo-50",
  },
];

export function KrishiStore() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">कृषि स्टोर</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          भरोसेमंद कृषि उत्पाद और सेवाएं — सीधे विश्वसनीय पार्टनर से
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <Card
            key={item.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-strong"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>
              <item.icon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            <div className="mt-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              {item.price}
            </div>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-5"
            >
              <Button className="w-full rounded-xl bg-gradient-primary font-bold shadow-soft">
                {item.cta}
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}
