/**
 * AdSlot — Google AdSense placeholder component
 * ------------------------------------------------------------------
 * इस कंपोनेंट के अंदर बाद में अपना Google AdSense <ins> code paste करें।
 * AdSense script पहले से `src/routes/__root.tsx` में load हो रहा है
 * (client: ca-pub-2415253815061726).
 *
 * Example AdSense unit code (इसे नीचे "PASTE ADSENSE CODE HERE" वाले
 * comment की जगह paste करें):
 *
 *   <ins className="adsbygoogle"
 *        style={{ display: "block" }}
 *        data-ad-client="ca-pub-2415253815061726"
 *        data-ad-slot="XXXXXXXXXX"
 *        data-ad-format="auto"
 *        data-full-width-responsive="true" />
 *   <script dangerouslySetInnerHTML={{
 *     __html: "(adsbygoogle = window.adsbygoogle || []).push({});"
 *   }} />
 */
import { cn } from "@/lib/utils";

type Variant = "leaderboard" | "in-article" | "footer";

const SIZES: Record<Variant, string> = {
  leaderboard: "min-h-[90px] md:min-h-[100px]",
  "in-article": "min-h-[250px]",
  footer: "min-h-[90px]",
};

const LABELS: Record<Variant, string> = {
  leaderboard: "विज्ञापन",
  "in-article": "विज्ञापन",
  footer: "विज्ञापन",
};

export function AdSlot({
  variant = "in-article",
  className,
  id,
}: {
  variant?: Variant;
  className?: string;
  id?: string;
}) {
  return (
    <aside
      id={id}
      aria-label="Advertisement"
      className={cn("mx-auto w-full max-w-6xl px-4", className)}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/30 px-3 py-4 text-center",
          SIZES[variant],
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {LABELS[variant]} / Advertisement
        </p>
        {/* ===================== PASTE ADSENSE CODE HERE ===================== */}
        {/* अपना Google AdSense <ins> + push script यहाँ paste करें।             */}
        {/* Slot variant: {variant}                                              */}
        {/* =================================================================== */}
        <p className="mt-1 text-[10px] text-muted-foreground/70">
          Ad slot ({variant})
        </p>
      </div>
    </aside>
  );
}
