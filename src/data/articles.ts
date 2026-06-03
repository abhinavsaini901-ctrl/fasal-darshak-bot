// Articles are AI-generated and saved into this file. The data is loaded from
// the generated JSON at build time.
import articlesData from "./articles.json";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleFAQ = { q: string; a: string };

export type Article = {
  slug: string;
  title: string;
  category: string;
  metaDescription: string;
  excerpt: string;
  tableOfContents: string[];
  sections: ArticleSection[];
  faqs: ArticleFAQ[];
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  author: string;
};

const RAW: Omit<Article, "publishedAt" | "updatedAt" | "readMinutes" | "author">[] =
  articlesData as never;

const BASE_DATE = "2026-05-15";

export const ARTICLES: Article[] = RAW.map((a, idx) => {
  const wordCount = a.sections.reduce(
    (sum, s) =>
      sum +
      s.paragraphs.join(" ").split(/\s+/).length +
      (s.bullets?.join(" ").split(/\s+/).length ?? 0),
    0,
  );
  // Stagger publish dates so they look realistic
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() - idx * 5);
  const iso = d.toISOString().slice(0, 10);
  return {
    ...a,
    publishedAt: iso,
    updatedAt: iso,
    readMinutes: Math.max(5, Math.round(wordCount / 200)),
    author: "किसान मित्र संपादकीय टीम",
  };
});

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(name: string): Article[] {
  return ARTICLES.filter((a) => a.category === name);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return ARTICLES.filter((a) => a.slug !== slug && a.category === current.category)
    .concat(ARTICLES.filter((a) => a.slug !== slug && a.category !== current.category))
    .slice(0, limit);
}
