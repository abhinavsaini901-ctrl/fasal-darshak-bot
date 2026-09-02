import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Youtube, Play, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFarmingLeaderVideos } from "@/lib/youtube.functions";

const CHANNEL_URL = "https://youtube.com/@farmingleaderofficial";

export function YoutubePromoSection() {
  const fetchChannel = useServerFn(getFarmingLeaderVideos);
  const { data, isLoading } = useQuery({
    queryKey: ["farming-leader-youtube"],
    queryFn: () => fetchChannel(),
    staleTime: 3 * 60 * 60 * 1000,
  });

  const videos = data?.videos ?? [];

  return (
    <section className="border-b border-border bg-gradient-to-b from-red-50 to-background py-6 dark:from-red-950/30">
      <div className="mx-auto max-w-6xl px-4">
        {/* Banner */}
        <div className="rounded-3xl border border-red-200/70 bg-card p-4 shadow-soft dark:border-red-900/40 sm:p-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              {data?.avatar ? (
                <img
                  src={data.avatar}
                  alt="Farming Leader Official YouTube channel logo"
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-full border-2 border-red-500 object-cover sm:h-[72px] sm:w-[72px]"
                />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-red-500 bg-red-500/10 sm:h-[72px] sm:w-[72px]">
                  <Youtube className="h-7 w-7 text-red-600" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-red-600">
                  YouTube Channel
                </p>
                <h2 className="truncate text-lg font-extrabold text-foreground sm:text-2xl">
                  Farming Leader Official
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  🌾 Farming Leader Official – किसानों के लिए उपयोगी जानकारी
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-auto">
              <Button
                asChild
                className="h-12 w-full rounded-xl bg-red-600 px-6 text-base font-bold text-white hover:bg-red-700 sm:w-auto"
              >
                <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" /> Subscribe on YouTube 🔴
                </a>
              </Button>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-center text-sm font-semibold text-red-700 dark:text-red-300">
            YouTube पर हमारे साथ जुड़ें और खेती की नई जानकारी पाएं ▶️
          </p>
        </div>

        {/* Top 5 Videos */}
        <div className="mt-5">
          <h3 className="mb-3 text-base font-bold text-foreground sm:text-lg">
            ▶️ Top 5 Videos
          </h3>

          {isLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          )}

          {!isLoading && videos.length === 0 && (
            <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              वीडियो अभी लोड नहीं हो पाए। कृपया चैनल सीधे YouTube पर देखें —{" "}
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-600 underline"
              >
                Farming Leader Official
              </a>
            </p>
          )}

          {videos.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {videos.map((v) => (
                <li key={v.id}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        width={480}
                        height={360}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600">
                          <Play className="h-5 w-5 text-white" />
                        </span>
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
                        {v.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ExternalLink className="h-3 w-3" /> YouTube पर देखें
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
