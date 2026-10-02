import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import type { Author } from "@/data/authors";

export function AuthorBox({ author, reviewedAt }: { author: Author; reviewedAt?: string }) {
  return (
    <Card className="mt-8 border border-border bg-gradient-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">लेख प्रकाशक</p>
      <div className="mt-3 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary">
          {author.initials}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-foreground">{author.name}</p>
          <p className="text-xs font-medium text-primary">{author.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{author.bio}</p>
      {author.email && (
        <a
          href={`mailto:${author.email}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Mail className="h-3.5 w-3.5" /> संपादकीय टीम से संपर्क करें
        </a>
      )}
    </Card>
  );
}
