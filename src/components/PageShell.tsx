import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { AdSlot } from "./AdSlot";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      {/* Ad Slot #1 — Leaderboard below header */}
      <AdSlot variant="leaderboard" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
