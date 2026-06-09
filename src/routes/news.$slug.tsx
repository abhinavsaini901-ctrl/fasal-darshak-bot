import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Radio, Share2, Tag } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatNewsTimeAgo,
  getNewsBySlug,
  getRelatedNews,
  type NewsItem,
} from "@/data/kisanNews";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNewsBySlug(params.slug);
    if (!item) throw notFound();
    return { item, related: getRelatedNews(item.slug, 3) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const a = loaderData.item;
    return {
      meta: [
        { title: `${a.title} | किसान मित्र` },
        { name: "description", content: a.summary },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.summary },
        { property: "og:type", content: "article" },
        { property: "article:section", content: a.category },
      ],
      links: [{ rel: "canonical", href: `https://kisanlens.com/news/${params.slug}` }],
    };
  },
  notFoundComponent: NewsNotFound,
  errorComponent: NewsNotFound,
  component: NewsArticlePage,
});

function NewsNotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">खबर नहीं मिली</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          यह खबर उपलब्ध नहीं है या हटा दी गई है।
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> होम पर लौटें
        </Link>
      </div>
    </PageShell>
  );
}

function NewsArticlePage() {
  const { item, related } = Route.useLoaderData() as {
    item: NewsItem;
    related: NewsItem[];
  };
  const router = useRouter();
  const Icon = item.icon;

  const handleShare = async () => {
    const text = `${item.title}\n\n${item.summary}\n\n— ${item.source} (किसान मित्र)`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: item.title, text });
      } else if (typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
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

        {/* Featured visual */}
        <div
          className={`relative mt-4 h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} sm:h-72`}
        >
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
          {item.state && (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              <MapPin className="h-3 w-3" /> {item.state}
            </span>
          )}
        </div>

        <header className="mt-5">
          <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {item.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{item.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> {item.category}
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              स्रोत: {item.source}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatNewsTimeAgo(item.minutesAgo)}
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
          {item.content.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold">संबंधित खबरें</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const RIcon = r.icon;
                return (
                  <Link
                    key={r.slug}
                    to="/news/$slug"
                    params={{ slug: r.slug }}
                    className="block"
                  >
                    <Card className="h-full overflow-hidden border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-strong">
                      <div
                        className={`relative h-24 w-full bg-gradient-to-br ${r.gradient}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <RIcon className="h-8 w-8 text-white/90" />
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] font-semibold text-primary">
                          {r.category}
                        </p>
                        <h3 className="mt-1 text-sm font-bold leading-snug text-foreground line-clamp-2">
                          {r.title}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-1 h-4 w-4" /> सभी खबरें देखें
            </Button>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
