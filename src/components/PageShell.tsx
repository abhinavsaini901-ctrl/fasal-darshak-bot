import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

function ReviewBanner() {
  return (
    <section className="bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2 text-center">
      <p className="text-xs font-bold text-emerald-950 sm:text-sm">
        Please my site ka jaldi review karo inko 🙏
      </p>
    </section>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <ReviewBanner />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
