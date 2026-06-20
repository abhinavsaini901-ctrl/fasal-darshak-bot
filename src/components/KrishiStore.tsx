import { Sprout, FlaskConical, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import seedsImg from "@/assets/store-seeds.jpg";
import medicineImg from "@/assets/store-medicine.jpg";
import tourImg from "@/assets/store-tour.jpg";

const ITEMS = [
  {
    title: "बीज स्टोर",
    desc: "प्रमाणित बीज खरीदें",
    price: "₹99 से शुरू",
    cta: "खरीदें",
    href: "https://agribegri.com/seeds",
    icon: Sprout,
    color: "text-emerald-700 bg-emerald-50",
    image: seedsImg,
    alt: "प्रमाणित कृषि बीजों की बोरी",
  },
  {
    title: "कृषि दवा स्टोर",
    desc: "कीटनाशक, फफूंदनाशक और जैविक दवाइयाँ",
    price: "₹149 से शुरू",
    cta: "खरीदें",
    href: "https://agribegri.com/crop-protection",
    icon: FlaskConical,
    color: "text-amber-700 bg-amber-50",
    image: medicineImg,
    alt: "कृषि दवाइयों की बोतलें",
  },
  {
    title: "कृषि यात्रा",
    desc: "कृषि प्रशिक्षण, फार्म विजिट और कृषि एक्सपो",
    price: "₹499 से शुरू",
    cta: "बुक करें",
    href: "https://www.krishijagran.com",
    icon: MapPin,
    color: "text-indigo-700 bg-indigo-50",
    image: tourImg,
    alt: "किसानों की फार्म विजिट",
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
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card p-0 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-strong"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                width={768}
                height={512}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div
                className={`absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-soft ring-1 ring-white/60 ${item.color}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              <div className="mt-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {item.price}
              </div>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-5 mt-auto pt-5"
              >
                <Button className="w-full rounded-xl bg-gradient-primary font-bold shadow-soft">
                  {item.cta}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
