/**
 * AdSlot — Google AdSense placeholder component
 * ------------------------------------------------------------
 * Variants:
 *  - "leaderboard"  → below header (every page via PageShell)
 *  - "in-article"   → between content sections
 *  - "footer"       → footer area
 *
 * 👉 HOW TO ADD YOUR ADSENSE CODE:
 *  1. Replace the placeholder <div> inside each variant with your
 *     <ins class="adsbygoogle" ... /> block from AdSense.
 *  2. Ensure the global AdSense <script> tag is loaded in
 *     src/routes/__root.tsx <head>.
 *  3. Push the ad: <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
 *
 * Example:
 *   <ins className="adsbygoogle"
 *        style={{ display: "block" }}
 *        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *        data-ad-slot="YYYYYYYYYY"
 *        data-ad-format="auto"
 *        data-full-width-responsive="true" />
 */

type Variant = "leaderboard" | "in-article" | "footer";

const STYLES: Record<Variant, { wrap: string; box: string; label: string }> = {
  leaderboard: {
    wrap: "mx-auto max-w-6xl px-4 pt-3",
    box: "h-[90px] md:h-[100px]",
    label: "Advertisement",
  },
  "in-article": {
    wrap: "mx-auto max-w-3xl px-4 py-6",
    box: "h-[250px]",
    label: "Advertisement",
  },
  footer: {
    wrap: "mx-auto max-w-6xl px-4 pt-6",
    box: "h-[90px] md:h-[120px]",
    label: "Advertisement",
  },
};

export function AdSlot({ variant }: { variant: Variant }) {
  const s = STYLES[variant];
  return (
    <div className={s.wrap} aria-label="विज्ञापन क्षेत्र">
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground/70">
        {s.label}
      </p>
      {/* 👇 PASTE YOUR GOOGLE ADSENSE <ins> BLOCK BELOW (replace this div) */}
      <div
        className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground ${s.box}`}
      >
        Ad Slot ({variant})
      </div>
      {/* 👆 END ADSENSE BLOCK */}
    </div>
  );
}
