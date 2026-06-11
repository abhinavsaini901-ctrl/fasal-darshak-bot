import { Card } from "@/components/ui/card";
import { Mail, MapPin, GraduationCap, Award } from "lucide-react";
import type { Author } from "@/data/authors";

export function AuthorBox({ author, reviewedAt }: { author: Author; reviewedAt?: string }) {
  return (
    <Card className="mt-8 border border-border bg-gradient-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        लेखक एवं समीक्षक
      </p>
      <div className="mt-3 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary">
          {author.initials}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-foreground">{author.name}</p>
          <p className="text-xs font-medium text-primary">{author.role}</p>
          <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-muted-foreground">
            <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{author.credentials}</span>
          </p>
          <p className="mt-1 inline-flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5" /> {author.experienceYears}+ वर्ष अनुभव
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {author.location}
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{author.bio}</p>
      {reviewedAt && (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          यह लेख कृषि विशेषज्ञ द्वारा समीक्षित है। अंतिम समीक्षा: <strong>{reviewedAt}</strong>
        </p>
      )}
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
