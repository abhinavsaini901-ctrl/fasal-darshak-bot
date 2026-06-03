import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";

const NAV = [
  { to: "/", label: "होम" },
  { to: "/blog", label: "ब्लॉग" },
  { to: "/crop-diseases", label: "फसल रोग" },
  { to: "/pest-control", label: "कीट नियंत्रण" },
  { to: "/market-prices", label: "मंडी भाव" },
  { to: "/government-schemes", label: "सरकारी योजनाएं" },
  { to: "/about", label: "हमारे बारे में" },
  { to: "/contact", label: "संपर्क" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-foreground">किसान मित्र</p>
            <p className="text-[10px] text-muted-foreground">AI कृषि सहायक</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <Link to="/scanner" className="hidden sm:block">
            <Button size="sm" className="rounded-full bg-gradient-primary">
              फसल स्कैन
            </Button>
          </Link>
          <button
            className="rounded-lg p-2 lg:hidden"
            aria-label="मेन्यू"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-1.5">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/scanner"
              onClick={() => setOpen(false)}
              className="col-span-2 mt-1 rounded-lg bg-gradient-primary px-3 py-2.5 text-center text-sm font-bold text-primary-foreground"
            >
              📷 फसल स्कैन करें
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
