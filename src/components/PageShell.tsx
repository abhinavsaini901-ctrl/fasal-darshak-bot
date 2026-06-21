import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { AdSlot } from "./AdSlot";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      {/* AD SLOT #1 — Below header (leaderboard). Paste AdSense code inside AdSlot.tsx */}
      <AdSlot variant="leaderboard" className="pt-3" id="ad-top" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
