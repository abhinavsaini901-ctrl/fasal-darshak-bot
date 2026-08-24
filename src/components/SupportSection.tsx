import { Heart, QrCode, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SUPPORT_CONFIG, buildUpiLink } from "@/config/support";

export function SupportSection() {
  const { upiId, payeeName, suggestedAmount, qrImage, qrIsPlaceholder } = SUPPORT_CONFIG;
  const upiLink = buildUpiLink({ upiId, payeeName, amount: suggestedAmount });

  return (
    <section id="support" className="bg-background px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-r from-emerald-900 to-emerald-700 px-5 py-6 text-center md:px-8">
            <h2 className="text-xl font-extrabold text-white md:text-3xl">
              ❤️ Kisan Lens को Support करें
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-emerald-50/90 md:text-base">
              आपकी छोटी सी मदद इस project को किसानों के लिए आगे बढ़ाने में मदद करती है।
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 p-5 md:flex-row md:items-start md:gap-8 md:p-8">
            {/* QR area */}
            <div className="flex w-full max-w-[280px] shrink-0 flex-col items-center rounded-2xl border border-border bg-background p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <QrCode className="h-4 w-4 text-primary" />
                <span>UPI QR कोड</span>
              </div>
              <img
                src={qrImage}
                alt="Kisan Lens को UPI से support करने का QR कोड"
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
                className="h-44 w-44 rounded-xl border border-border bg-white p-2 md:h-48 md:w-48"
              />
              <p className="mt-3 text-center text-sm font-bold text-foreground">
                UPI से ₹{suggestedAmount} की मदद करें
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                अपने UPI App से QR Scan करें
              </p>
              <p className="mt-0.5 text-center text-xs text-muted-foreground">
                Google Pay • PhonePe • Paytm • BHIM
              </p>
              {qrIsPlaceholder ? (
                <p className="mt-2 text-center text-[11px] text-amber-700 dark:text-amber-300">
                  (यह sample QR है — असली QR image जल्द अपडेट होगी)
                </p>
              ) : null}
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  UPI ID
                </p>
                <p className="mt-1 break-all text-base font-bold text-foreground md:text-lg">
                  {upiId}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  किसी भी UPI app में यह ID डालकर भी मदद भेज सकते हैं।
                </p>
              </div>

              <Button
                size="lg"
                asChild
                className="mt-5 h-12 w-full rounded-xl bg-gradient-primary px-6 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] sm:w-auto"
              >
                <a href={upiLink}>
                  <Heart className="mr-2 h-5 w-5" /> ❤️ ₹{suggestedAmount} से Support करें
                </a>
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground md:justify-start">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                ₹{suggestedAmount} केवल suggested amount है — support पूरी तरह स्वेच्छिक है।
              </p>

              <p className="mt-5 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4 text-sm leading-relaxed text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
                आपका ₹{suggestedAmount} का छोटा सा सहयोग Kisan Lens को बेहतर बनाने, AI features चलाने
                और किसानों तक उपयोगी जानकारी पहुँचाने में मदद कर सकता है। धन्यवाद ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
