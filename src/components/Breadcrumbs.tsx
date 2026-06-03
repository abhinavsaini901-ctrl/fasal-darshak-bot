import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/" className="flex items-center gap-1 hover:text-primary">
        <Home className="h-3 w-3" /> होम
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {c.to ? (
            <Link to={c.to} className="hover:text-primary">{c.label}</Link>
          ) : (
            <span className="text-foreground/80">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
