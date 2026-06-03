import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ARTICLES } from "@/data/articles";

type Props = {
  title: string;
  intro: string;
  body: string[];
  matchCategories: string[];
  breadcrumb: string;
  ctaLabel?: string;
};

export function CategoryLanding({ title, intro, body, matchCategories, breadcrumb, ctaLabel = "AI से सलाह लें" }: Props) {
  const articles = ARTICLES.filter((a) => matchCategories.includes(a.category));

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: breadcrumb }]} />
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">{intro}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/scanner">
            <Button className="rounded-xl bg-gradient-primary">{ctaLabel}</Button>
          </Link>
          <Link to="/blog">
            <Button variant="outline" className="rounded-xl">सभी कृषि लेख</Button>
          </Link>
        </div>

        <div className="prose-content mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold">{title} पर लेख</h2>
        {articles.length === 0 ? (
          <Card className="mt-5 border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            इस विषय पर विस्तृत लेख जल्द ही जोड़े जाएंगे। अभी हमारे{" "}
            <Link to="/blog" className="font-semibold text-primary hover:underline">सभी लेख</Link> देखें।
          </Card>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
