import { useEffect, useRef } from "react";

type AdSlotProps = {
  slot?: string;
  format?: string;
  layout?: string;
  responsive?: boolean;
  className?: string;
  /** Show a labelled placeholder box when no slot id is configured. */
  showPlaceholder?: boolean;
  minHeight?: number;
};

const AD_CLIENT = "ca-pub-2415253815061726";

/**
 * AdSense-ready ad slot.
 *
 * - When a real `slot` id is provided, it renders the standard <ins class="adsbygoogle">
 *   element and pushes to `adsbygoogle`. Google will fill it once the unit is approved.
 * - When no slot id is configured, it renders a neutral "Advertisement" placeholder
 *   (no fake ad creative) so layouts stay stable during AdSense review.
 */
export function AdSlot({
  slot,
  format = "auto",
  layout,
  responsive = true,
  className = "",
  showPlaceholder = true,
  minHeight = 100,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Silently ignore — script may not be loaded yet (e.g. blocked).
    }
  }, [slot]);

  if (!slot) {
    if (!showPlaceholder) return null;
    return (
      <div
        role="complementary"
        aria-label="विज्ञापन स्थान"
        className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground ${className}`}
        style={{ minHeight }}
      >
        Advertisement
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ minHeight }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
