import { useEffect, useMemo, useState } from "react";
import {
  Newspaper,
  Volume2,
  Share2,
  ArrowRight,
  RefreshCw,
  MapPin,
  TrendingUp,
  Radio,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NEWS_CATEGORIES,
  NEWS_POOL,
  formatNewsTimeAgo,
  type NewsCategory,
  type NewsItem,
} from "@/data/kisanNews";


export function LiveKisanNews() {
  const [active, setActive] = useState<NewsCategory>("सभी");
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Auto refresh every 30 minutes
  useEffect(() => {
    const id = setInterval(() => {
      setRefreshTick((t) => t + 30);
      setLastRefresh(new Date());
    }, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (active === "सभी") return NEWS_POOL;
    return NEWS_POOL.filter((n) => n.category === active);
  }, [active]);

  const handleSpeak = (item: NewsItem) => {
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

  const handleShare = async (item: NewsItem) => {
    const text = `${item.title}\n\n${item.summary}\n\n— ${item.source} (किसान मित्र)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
  };

  const handleManualRefresh = () => {
    setRefreshTick(0);
    setLastRefresh(new Date());
  };

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
            खेती, मौसम, मंडी भाव और सरकारी योजनाओं की ताज़ा जानकारी
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary sm:self-auto"
          aria-label="ख़बरें ताज़ा करें"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          अपडेट:{" "}
          {lastRefresh.toLocaleTimeString("hi-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </button>
      </div>

      {/* Category filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {NEWS_CATEGORIES.map((c) => {
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


      {/* News grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="group flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-strong"
          >
            <Link
              to="/news/$slug"
              params={{ slug: item.slug }}
              className="block"
              aria-label={item.title}
            >
              {/* Thumbnail */}
              <div
                className={`relative h-32 w-full bg-gradient-to-br ${item.gradient}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-90">
                  <item.icon className="h-12 w-12 text-white drop-shadow-md" />
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
                {item.state && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                    <MapPin className="h-3 w-3" /> {item.state}
                  </span>
                )}
              </div>
            </Link>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
              <Link to="/news/$slug" params={{ slug: item.slug }}>
                <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 hover:text-primary">
                  {item.title}
                </h3>
              </Link>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium">{item.source}</span>
                <span>{formatNewsTimeAgo(item.minutesAgo, refreshTick)}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Link
                  to="/news/$slug"
                  params={{ slug: item.slug }}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="h-8 w-full rounded-lg bg-gradient-primary text-xs font-semibold"
                  >
                    पूरा पढ़ें
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
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
        ))}
      </div>


      {/* Footer CTA */}
      <div className="mt-6 flex justify-center">
        <Link to="/blog">
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-primary/40 px-6 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            और खबरें देखें
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
