import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BookOpen, Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { ARTICLES, type Article } from "@/data/articles";
import { BLOG_CATEGORIES } from "@/data/categories";
import { listPublishedArticles } from "@/lib/articles.functions";




const searchSchema = z.object({
  cat: z.string().optional(),
});

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "किसान ज्ञान केंद्र — हिंदी कृषि लेख, फसल गाइड और योजनाएं | किसान मित्र" },
      {
        name: "description",
        content:
          "किसान ज्ञान केंद्र — गेहूं, धान, सरसों, आलू, टमाटर, प्याज, जैविक खेती, सिंचाई, उर्वरक, रोग-कीट नियंत्रण और सरकारी योजनाओं पर विशेषज्ञ हिंदी लेख।",
      },
      { property: "og:title", content: "किसान ज्ञान केंद्र | किसान मित्र" },
      { property: "og:description", content: "हिंदी में किसानों के लिए विशेषज्ञ कृषि लेख और मार्गदर्शन।" },
      { property: "og:url", content: "https://kisanlens.com/blog" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/blog" }],
  }),
});

function BlogPage() {
  const { cat } = useSearch({ from: "/blog/" });
  const [query, setQuery] = useState("");
  const listFn = useServerFn(listPublishedArticles);
  const dbQuery = useQuery({ queryKey: ["publishedArticles"], queryFn: () => listFn() });

  const allArticles: Article[] = useMemo(() => {
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
    return [...dbItems, ...staticItems];
  }, [dbQuery.data]);

  const filtered = useMemo(() => {
    let list = allArticles;
    if (cat) list = list.filter((a) => a.category === cat);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const hay =
          a.title.toLowerCase() +
          " " +
          a.excerpt.toLowerCase() +
          " " +
          (a.tags ?? []).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [cat, query, allArticles]);


  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs items={[{ label: "किसान ज्ञान केंद्र" }]} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpen className="h-3 w-3" /> ज्ञान केंद्र
        </span>
        <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">किसान ज्ञान केंद्र</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          हिंदी में किसानों के लिए विशेषज्ञों द्वारा लिखे गए लेख — फसल गाइड, रोग-कीट नियंत्रण, सिंचाई,
          उर्वरक, मंडी भाव और सरकारी योजनाओं की संपूर्ण जानकारी।
        </p>

        {/* Search */}
        <div className="relative mt-5 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="लेख खोजें — जैसे 'गेहूं की बीमारी', 'ड्रिप सिंचाई', 'PM Kisan'"
            className="pl-9"
            aria-label="लेख खोजें"
          />
        </div>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/blog"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              !cat ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"
            }`}
          >
            सभी ({allArticles.length})
          </Link>
          {BLOG_CATEGORIES.map((c) => {
            const count = allArticles.filter((a) => a.category === c.name).length;

            if (count === 0) return null;
            return (
              <Link
                key={c.slug}
                to="/blog"
                search={{ cat: c.name }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  cat === c.name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {c.name} ({count})
              </Link>
            );
          })}
        </div>

        

        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                इस श्रेणी में अभी कोई लेख नहीं है। जल्द ही नई सामग्री जोड़ी जाएगी।
              </p>
              <Link to="/blog" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                सभी लेख देखें →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
