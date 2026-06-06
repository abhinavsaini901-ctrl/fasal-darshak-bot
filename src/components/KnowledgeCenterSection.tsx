import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Clock, Tag, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ARTICLES, type Article } from "@/data/articles";
import { listPublishedArticles } from "@/lib/articles.functions";

const GRADIENTS = [
  "from-emerald-100 to-emerald-50",
  "from-amber-100 to-amber-50",
  "from-lime-100 to-lime-50",
  "from-teal-100 to-teal-50",
  "from-yellow-100 to-yellow-50",
  "from-green-100 to-green-50",
];

function hashIdx(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function KnowledgeCenterSection() {
  const listFn = useServerFn(listPublishedArticles);
  const dbQuery = useQuery({
    queryKey: ["publishedArticles"],
    queryFn: () => listFn(),
    staleTime: 60_000,
  });

  const merged: Article[] = useMemo(() => {
    const dbItems: Article[] = (dbQuery.data ?? []).map((r: any) => ({
      slug: r.slug,
      title: r.title,
      category: r.category,
      metaDescription: r.meta_description ?? "",
      excerpt: r.excerpt ?? "",
      tableOfContents: r.table_of_contents ?? [],
      sections: r.sections ?? [],
      faqs: r.faqs ?? [],
      tags: r.tags ?? [],
      publishedAt: (r.published_at ?? r.updated_at ?? new Date().toISOString()).slice(0, 10),
      updatedAt: (r.updated_at ?? r.published_at ?? new Date().toISOString()).slice(0, 10),
      readMinutes: r.read_minutes ?? 5,
      author: r.author ?? "किसान मित्र संपादकीय टीम",
    }));
    const seen = new Set(dbItems.map((a) => a.slug));
    const staticItems = ARTICLES.filter((a) => !seen.has(a.slug));
    return [...dbItems, ...staticItems].sort((a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
    );
  }, [dbQuery.data]);

  if (merged.length === 0) return null;

  const featured = merged[0];
  const latest = merged.slice(1, 7);
  const featuredGrad = GRADIENTS[hashIdx(featured.slug) % GRADIENTS.length];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3 w-3" /> ज्ञान केंद्र
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">किसान ज्ञान केंद्र</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            खेती, रोग, सिंचाई, उर्वरक, मंडी और सरकारी योजनाओं पर विशेषज्ञ हिंदी लेख
          </p>
        </div>
        <Link to="/blog">
          <Button variant="outline" size="sm" className="font-semibold">
            सभी लेख देखें <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Featured */}
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="group block lg:col-span-2"
        >
          <Card className="h-full overflow-hidden border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-strong">
            <div
              className={`flex h-48 items-center justify-center bg-gradient-to-br ${featuredGrad} md:h-60`}
            >
              <div className="px-6 text-center">
                <Sparkles className="mx-auto h-7 w-7 text-primary" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-foreground/70">
                  ⭐ विशेष लेख · {featured.category}
                </p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {featured.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {featured.readMinutes} मिनट
                </span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-foreground group-hover:text-primary md:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{featured.excerpt}</p>
              <p className="mt-3 text-sm font-semibold text-primary group-hover:underline">
                और पढ़ें →
              </p>
            </div>
          </Card>
        </Link>

        {/* Latest list */}
        <div className="flex flex-col gap-3">
          {latest.slice(0, 4).map((a) => (
            <Link
              key={a.slug}
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="group block"
            >
              <Card className="border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-soft">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {a.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.readMinutes} मिनट
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">
                  {a.title}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Extra latest row */}
      {latest.length > 4 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {latest.slice(4, 6).map((a) => {
            const g = GRADIENTS[hashIdx(a.slug) % GRADIENTS.length];
            return (
              <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="group block">
                <Card className="flex h-full overflow-hidden border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <div
                    className={`flex w-28 shrink-0 items-center justify-center bg-gradient-to-br ${g}`}
                  >
                    <span className="px-2 text-center text-[10px] font-semibold text-foreground/70">
                      {a.category}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.readMinutes} मिनट
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">
                      {a.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
