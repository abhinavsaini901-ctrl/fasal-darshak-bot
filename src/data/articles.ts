// Articles are AI-generated and saved into this file. The data is loaded from
// the generated JSON at build time.
import articlesData from "./articles.json";
import { AUTHORS, pickAuthorForCategory, type Author } from "./authors";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleFAQ = { q: string; a: string };

export type ArticleSource = { title: string; publisher: string; url?: string };

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
  authorId?: string;
  sources?: ArticleSource[];
};

type RawArticle = Omit<
  Article,
  "publishedAt" | "updatedAt" | "readMinutes" | "author" | "authorId"
> & {
  authorId?: string;
  sources?: ArticleSource[];
};

const RAW = articlesData as RawArticle[];

const BASE_DATE = "2026-06-10";

export const ARTICLES: Article[] = RAW.map((a, idx) => {
  const wordCount = a.sections.reduce(
    (sum, s) =>
      sum +
      s.paragraphs.join(" ").split(/\s+/).length +
      (s.bullets?.join(" ").split(/\s+/).length ?? 0),
    0,
  );
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() - idx * 4);
  const iso = d.toISOString().slice(0, 10);
  const author: Author = a.authorId
    ? AUTHORS.find((x) => x.id === a.authorId) ?? pickAuthorForCategory(a.category)
    : pickAuthorForCategory(a.category);
  return {
    ...a,
    publishedAt: iso,
    updatedAt: iso,
    readMinutes: Math.max(5, Math.round(wordCount / 200)),
    author: author.name,
    authorId: author.id,
    sources: a.sources,
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
