import { ExternalLink, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import seedWheat from "@/assets/seed-wheat.jpg";
import seedPaddy from "@/assets/seed-paddy.jpg";
import seedMaize from "@/assets/seed-maize.jpg";
import seedMustard from "@/assets/seed-mustard.jpg";
import seedSoybean from "@/assets/seed-soybean.jpg";

const PARTNER_URL = "https://www.sagarbiotech.com/";

const SEEDS = [
  { img: seedWheat, name: "गेहूं बीज", alt: "गेहूं के उन्नत बीज की बोरी" },
  { img: seedPaddy, name: "धान बीज", alt: "धान के बीज कटोरी में" },
  { img: seedMaize, name: "मक्का बीज", alt: "मक्का के पीले बीज" },
  { img: seedMustard, name: "सरसों बीज", alt: "सरसों के बीज और पीले फूल" },
  { img: seedSoybean, name: "सोयाबीन बीज", alt: "सोयाबीन के बीज" },
];

export function SeedsPromoBanner() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-emerald-50 to-background py-6 dark:from-emerald-950/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700">
              <Sprout className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
                🌱 उन्नत बीज — Sagar Biotech
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                प्रमाणित बीज किस्में देखें और सीधे पार्टनर वेबसाइट पर जाएं
              </p>
            </div>
          </div>
          <Button
            asChild
            className="h-11 rounded-xl bg-gradient-primary px-5 font-bold shadow-soft"
          >
            <a href={PARTNER_URL} target="_blank" rel="noopener noreferrer sponsored">
              बीज देखें <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SEEDS.map((s) => (
            <li key={s.name}>
              <a
                href={PARTNER_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={s.img}
                    alt={s.alt}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="p-2 text-center text-xs font-bold text-foreground sm:text-sm">
                  {s.name}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
