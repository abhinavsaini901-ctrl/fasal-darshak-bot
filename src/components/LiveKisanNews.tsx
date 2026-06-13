import { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  CloudRain,
  Landmark,
  Newspaper,
  Sprout,
  Volume2,
  Share2,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLiveAgriNews, type LiveNewsItem } from "@/lib/news.functions";

type Category =
  | "सभी"
  | "मंडी भाव"
  | "मौसम"
  | "सरकारी योजनाएं"
  | "फसल सलाह"
  | "कृषि तकनीक";

const CATEGORIES: { key: Category; icon: typeof TrendingUp }[] = [
  { key: "सभी", icon: Newspaper },
  { key: "मंडी भाव", icon: TrendingUp },
  { key: "मौसम", icon: CloudRain },
  { key: "सरकारी योजनाएं", icon: Landmark },
  { key: "फसल सलाह", icon: Sprout },
  { key: "कृषि तकनीक", icon: Cpu },
];

const ICONS = {
  trending: TrendingUp,
  cloud: CloudRain,
  landmark: Landmark,
  sprout: Sprout,
  cpu: Cpu,
} as const;

function formatTimeAgo(minutes: number): string {
  if (minutes < 1) return "अभी";
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h} घंटे पहले`;
  const d = Math.floor(h / 24);
  return `${d} दिन पहले`;
}

export function LiveKisanNews() {
  const [active, setActive] = useState<Category>("सभी");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const fetchNews = useServerFn(getLiveAgriNews);
  const { data, isLoading, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["live-agri-news"],
    queryFn: () => fetchNews(),
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // auto refresh hourly
    refetchOnWindowFocus: false,
  });

  // Re-render time strings every minute so "X मिनट पहले" stays fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const allItems = data?.items ?? [];
  const filtered = useMemo(() => {
    if (active === "सभी") return allItems;
    return allItems.filter((n) => n.category === active);
  }, [active, allItems]);

  const handleSpeak = (item: LiveNewsItem) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (speakingId === item.id) {
        setSpeakingId(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(`${item.title}. ${item.summary}`);
      u.lang = "hi-IN";
      u.rate = 0.95;
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(u);
      setSpeakingId(item.id);
    } catch {
      setSpeakingId(null);
    }
  };

  const handleShare = async (item: LiveNewsItem) => {
    const text = `${item.title}\n\n${item.summary}\n\n${item.link}\n— ${item.source} (किसान मित्र)`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: item.title, text, url: item.link });
      } else if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              LIVE
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            📰 आज की कृषि खबरें
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            खेती, मौसम, मंडी भाव और सरकारी योजनाओं की ताज़ा जानकारी — हर घंटे अपडेट
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-60 sm:self-auto"
          aria-label="ख़बरें ताज़ा करें"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          अपडेट:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString("hi-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </button>
      </div>

      {/* Category filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((c) => {
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              <c.icon className="h-3.5 w-3.5" />
              {c.key}
            </button>
          );
        })}
      </div>

      {/* Loading / Empty state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border border-border bg-card">
              <div className="h-32 w-full animate-pulse bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          फ़िलहाल इस श्रेणी की कोई ताज़ा खबर उपलब्ध नहीं है। कुछ देर बाद फिर आज़माएँ।
        </Card>
      )}

      {/* News grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = ICONS[item.iconKey] ?? Newspaper;
            return (
              <Card
                key={item.id}
                className="group flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-strong"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.title}
                  className="block"
                >
                  <div className={`relative h-32 w-full bg-gradient-to-br ${item.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-90">
                      <Icon className="h-12 w-12 text-white drop-shadow-md" />
                    </div>
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {item.breaking && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ring-2 ring-red-300/60 animate-pulse">
                          <Radio className="h-3 w-3" /> Breaking
                        </span>
                      )}
                      <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </a>

                {/* Body */}
                <div className="flex flex-1 flex-col p-4">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 hover:text-primary">
                      {item.title}
                    </h3>
                  </a>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-medium truncate max-w-[60%]" title={item.source}>
                      {item.source}
                    </span>
                    <span>{formatTimeAgo(item.minutesAgo)}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="h-8 w-full rounded-lg bg-gradient-primary text-xs font-semibold"
                      >
                        पूरा पढ़ें
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        speakingId === item.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                      aria-label="खबर सुनें"
                      title="🔊 खबर सुनें"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                      aria-label="शेयर करें"
                      title="शेयर करें"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-6 flex justify-center">
        <Link to="/blog">
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-primary/40 px-6 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            और लेख पढ़ें
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
