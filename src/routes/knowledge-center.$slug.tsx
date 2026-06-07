import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, User, Calendar, Tag, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection } from "@/components/FAQSection";
import { ArticleCard } from "@/components/ArticleCard";
import { Card } from "@/components/ui/card";
import { getArticleBySlug, getRelatedArticles, type Article } from "@/data/articles";
import { getPublishedArticle } from "@/lib/articles.functions";

export const Route = createFileRoute("/knowledge-center/$slug")({
  loader: async ({ params }) => {
    const staticArticle = getArticleBySlug(params.slug);
    if (staticArticle) return { article: staticArticle };
    const row = await getPublishedArticle({ data: { slug: params.slug } });
    if (!row) throw notFound();
    const article: Article = {
      slug: row.slug,
      title: row.title,
      category: row.category,
      metaDescription: row.meta_description ?? "",
      excerpt: row.excerpt ?? "",
      tableOfContents: (row.table_of_contents as string[]) ?? [],
      sections: (row.sections as any) ?? [],
      faqs: (row.faqs as any) ?? [],
      tags: (row.tags as string[]) ?? [],
      publishedAt: (row.published_at ?? row.updated_at ?? new Date().toISOString()).slice(0, 10),
      updatedAt: (row.updated_at ?? row.published_at ?? new Date().toISOString()).slice(0, 10),
      readMinutes: row.read_minutes ?? 5,
      author: row.author ?? "किसान मित्र संपादकीय टीम",
    };
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} | किसान ज्ञान केंद्र` },
        { name: "description", content: a.metaDescription },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://kisanlens.com/knowledge-center/${params.slug}` },
        { property: "article:published_time", content: a.publishedAt },
        { property: "article:author", content: a.author },
        { property: "article:section", content: a.category },
      ],
      links: [{ rel: "canonical", href: `https://kisanlens.com/knowledge-center/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.metaDescription,
            inLanguage: "hi-IN",
            datePublished: a.publishedAt,
            dateModified: a.updatedAt,
            author: { "@type": "Organization", name: a.author },
            publisher: { "@type": "Organization", name: "किसान मित्र", url: "https://kisanlens.com" },
            mainEntityOfPage: `https://kisanlens.com/knowledge-center/${params.slug}`,
            articleSection: a.category,
            keywords: a.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">लेख नहीं मिला</h1>
        <p className="mt-3 text-sm text-muted-foreground">यह लेख उपलब्ध नहीं है या हटा दिया गया है।</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> सभी लेख देखें
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">कुछ गलत हो गया</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> सभी लेख देखें
        </Link>
      </div>
    </PageShell>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData() as { article: Article };
  const related = getRelatedArticles(a.slug, 3);
  const grad = "from-emerald-100 to-emerald-50";

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumbs items={[{ label: "ज्ञान केंद्र", to: "/blog" }, { label: a.title }]} />

        <header>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {a.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">{a.title}</h1>
          <p className="mt-4 text-base text-muted-foreground">{a.excerpt}</p>

          {/* Featured image (gradient card) */}
          <div className={`mt-5 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br ${grad} md:h-56`}>
            <span className="px-6 text-center text-xs font-bold uppercase tracking-wide text-foreground/70">
              {a.category}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-y border-border py-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {a.author}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> प्रकाशित {formatDate(a.publishedAt)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.readMinutes} मिनट</span>
          </div>
        </header>

        {a.tableOfContents.length > 0 && (
          <Card className="my-6 border border-border bg-secondary/30 p-5">
            <p className="text-sm font-bold text-foreground">विषय-सूची</p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {a.tableOfContents.map((t, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="text-primary hover:underline">
                    {i + 1}. {t}
                  </a>
                </li>
              ))}
            </ol>
          </Card>
        )}

        <div className="prose-content space-y-8">
          {a.sections.map((s, i) => (
            <section key={i} id={`section-${i}`} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">{s.heading}</h2>
              {s.paragraphs.map((p, pi) => (
                <p key={pi} className="mt-3 text-base leading-relaxed text-foreground/90">{p}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 text-base leading-relaxed text-foreground/90">
                  {s.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        {a.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {a.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground/80">{tag}</span>
            ))}
          </div>
        )}

        {a.faqs.length > 0 && (
          <div className="mt-12">
            <FAQSection items={a.faqs} />
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-bold">संबंधित लेख</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}

const HINDI_MONTHS = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${HINDI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
