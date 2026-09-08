import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BottomNav } from "./BottomNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
