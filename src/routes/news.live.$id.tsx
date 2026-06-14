import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Cpu,
  CloudRain,
  Landmark,
  Newspaper,
  Radio,
  Share2,
  Sprout,
  Tag,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { getLiveNewsArticle } from "@/lib/news.functions";

const ICONS = {
  trending: TrendingUp,
  cloud: CloudRain,
  landmark: Landmark,
  sprout: Sprout,
  cpu: Cpu,
} as const;

function formatTimeAgo(minutes: number) {
  if (minutes < 1) return "अभी";
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `${h} घंटे पहले`;
  return `${Math.floor(h / 24)} दिन पहले`;
}

export const Route = createFileRoute("/news/live/$id")({
  loader: async ({ params }) => {
    const res = await getLiveNewsArticle({ data: { id: params.id } });
    if (!res.item) throw notFound();
    return res;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.item) return {};
    const a = loaderData.item;
    return {
      meta: [
        { title: `${a.title} | किसान मित्र` },
        { name: "description", content: a.summary.slice(0, 155) },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.summary.slice(0, 155) },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: NotFound,
  component: LiveNewsArticle,
});

function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">खबर नहीं मिली</h1>
        <p className="mt-3 text-sm text-muted-foreground">यह खबर अब उपलब्ध नहीं है।</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> होम पर लौटें
        </Link>
      </div>
    </PageShell>
  );
}

function LiveNewsArticle() {
  const { item, paragraphs } = Route.useLoaderData();
  const router = useRouter();
  if (!item) return <NotFound />;
  const Icon = ICONS[item.iconKey as keyof typeof ICONS] ?? Newspaper;

  const handleShare = async () => {
    const text = `${item.title}\n\n${item.summary}\n— ${item.source} (किसान मित्र)`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: item.title, text });
      } else if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-6">
        <button
          onClick={() => router.history.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> वापस जाएं
        </button>

        <Breadcrumbs
          items={[
            { label: "होम", to: "/" },
            { label: "कृषि खबरें", to: "/" },
            { label: item.title },
          ]}
        />

        <div className={`relative mt-4 h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} sm:h-72`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-24 w-24 text-white/90 drop-shadow-lg" />
          </div>
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {item.breaking && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white ring-2 ring-red-300/60">
                <Radio className="h-3 w-3" /> Breaking
              </span>
            )}
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {item.category}
            </span>
          </div>
        </div>

        <header className="mt-5">
          <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">{item.title}</h1>
          <p className="mt-3 text-base text-muted-foreground">{item.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> {item.category}
            </span>
            <span className="font-medium">स्रोत: {item.source}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {formatTimeAgo(item.minutesAgo)}
            </span>
            <button
              onClick={handleShare}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-semibold text-foreground hover:border-primary/40 hover:text-primary"
            >
              <Share2 className="h-3.5 w-3.5" /> शेयर करें
            </button>
          </div>
        </header>

        <div className="prose-content mt-6 space-y-4">
          {paragraphs.map((p: string, i: number) => (
            <p key={i} className="text-base leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-xl">
              मूल स्रोत देखें <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
          <Link to="/">
            <Button variant="ghost" className="rounded-xl">
              <ArrowLeft className="mr-1 h-4 w-4" /> सभी खबरें
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          नोट: यह सारांश लेख मूल स्रोत के आधार पर हमारी टीम द्वारा सरल हिंदी में तैयार किया गया है। आधिकारिक विवरण के लिए मूल स्रोत अवश्य देखें।
        </p>
      </article>
    </PageShell>
  );
}
