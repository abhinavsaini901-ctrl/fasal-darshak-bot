import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/data/articles";
import { BLOG_CATEGORIES } from "@/data/categories";

const searchSchema = z.object({
  cat: z.string().optional(),
});

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "कृषि ब्लॉग — हिंदी में 30+ खेती के लेख | किसान मित्र" },
      {
        name: "description",
        content:
          "गेहूं, धान, सरसों, आलू, टमाटर, प्याज, जैविक खेती, सिंचाई, उर्वरक, सरकारी योजनाएं — हिंदी में विस्तृत लेख।",
      },
      { property: "og:title", content: "कृषि ब्लॉग | किसान मित्र" },
      { property: "og:description", content: "हिंदी में किसानों के लिए विस्तृत कृषि लेख।" },
      { property: "og:url", content: "https://fasal-darshak-bot.lovable.app/blog" },
    ],
    links: [{ rel: "canonical", href: "https://fasal-darshak-bot.lovable.app/blog" }],
  }),
});

function BlogPage() {
  const { cat } = useSearch({ from: "/blog" });

  const filtered = useMemo(() => {
    if (!cat) return ARTICLES;
    return ARTICLES.filter((a) => a.category === cat);
  }, [cat]);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs items={[{ label: "ब्लॉग" }]} />
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">कृषि ब्लॉग</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          हिंदी में किसानों के लिए विशेषज्ञों द्वारा लिखे गए लेख — फसल, बीमारी, सिंचाई, खाद, मंडी भाव और
          सरकारी योजनाओं की संपूर्ण जानकारी।
        </p>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/blog"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              !cat ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"
            }`}
          >
            सभी ({ARTICLES.length})
          </Link>
          {BLOG_CATEGORIES.map((c) => {
            const count = ARTICLES.filter((a) => a.category === c.name).length;
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
