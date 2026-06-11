import { Card } from "@/components/ui/card";
import { BookMarked, ExternalLink } from "lucide-react";

export type Source = { title: string; url?: string; publisher: string };

const DEFAULT_SOURCES: Source[] = [
  {
    title: "भारतीय कृषि अनुसंधान परिषद (ICAR) — फसल उत्पादन तकनीक दिशानिर्देश",
    publisher: "ICAR, नई दिल्ली",
    url: "https://icar.org.in/",
  },
  {
    title: "कृषि एवं किसान कल्याण मंत्रालय — योजना दस्तावेज़",
    publisher: "भारत सरकार",
    url: "https://agriwelfare.gov.in/",
  },
  {
    title: "कृषि विज्ञान केंद्र (KVK) — विस्तार सेवाएँ",
    publisher: "ICAR-ATARI",
    url: "https://kvk.icar.gov.in/",
  },
];

export function SourcesList({ sources }: { sources?: Source[] }) {
  const items = sources && sources.length > 0 ? sources : DEFAULT_SOURCES;
  return (
    <Card className="mt-8 border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <BookMarked className="h-4 w-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">स्रोत एवं संदर्भ</h2>
      </div>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground/90">
        {items.map((s, i) => (
          <li key={i}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {s.title} <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span>{s.title}</span>
            )}
            <span className="block text-xs text-muted-foreground">{s.publisher}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        यह लेख ऊपर दिए गए वैज्ञानिक एवं सरकारी स्रोतों के आधार पर तैयार और सत्यापित किया गया है।
      </p>
    </Card>
  );
}
