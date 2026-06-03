import { Link } from "@tanstack/react-router";
import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Article } from "@/data/articles";

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

export function ArticleCard({ article }: { article: Article }) {
  const grad = GRADIENTS[hashIdx(article.slug) % GRADIENTS.length];
  return (
    <Link to="/blog/$slug" params={{ slug: article.slug }} className="group block">
      <Card className="h-full overflow-hidden border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-strong">
        <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${grad}`}>
          <span className="px-4 text-center text-xs font-semibold uppercase tracking-wide text-foreground/70">
            {article.category}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {article.category}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readMinutes} मिनट</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold text-foreground group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
          <p className="mt-3 text-xs font-semibold text-primary group-hover:underline">और पढ़ें →</p>
        </div>
      </Card>
    </Link>
  );
}
