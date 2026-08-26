import { Download, Smartphone, ShieldCheck, Wifi } from "lucide-react";

import { Button } from "@/components/ui/button";
import apkAsset from "@/assets/kisan-lens-apk.asset.json";

const APK_SIZE_MB = (apkAsset.size / (1024 * 1024)).toFixed(1);

export function AppDownloadSection() {
  return (
    <section id="app-download" className="bg-muted/30 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="border-b border-border bg-gradient-to-r from-emerald-900 to-emerald-700 px-5 py-6 text-center md:px-8">
            <h2 className="text-xl font-extrabold text-white md:text-3xl">
              📱 Kisan Lens Android App डाउनलोड करें
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-emerald-50/90 md:text-base">
              अपने मोबाइल में Kisan Lens App install करें और फसल स्कैन, Smart Eye और AI सलाह सीधे फोन से पाएं।
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 p-5 md:flex-row md:items-center md:gap-8 md:p-8">
            <div className="flex w-full max-w-[220px] shrink-0 flex-col items-center rounded-2xl border border-border bg-background p-6">
              <Smartphone className="h-16 w-16 text-primary" />
              <p className="mt-3 text-center text-base font-bold text-foreground">Kisan Lens APK</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Android • {APK_SIZE_MB} MB
              </p>
            </div>

            <div className="flex-1 text-center md:text-left">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <ShieldCheck className="h-4 w-4 text-primary" /> बिल्कुल फ्री — कोई subscription नहीं
                </li>
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Wifi className="h-4 w-4 text-primary" /> हिंदी में AI फसल डॉक्टर और मंडी जानकारी
                </li>
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Download className="h-4 w-4 text-primary" /> सीधे APK install करें, Play Store की ज़रूरत नहीं
                </li>
              </ul>

              <Button
                size="lg"
                asChild
                className="mt-5 h-12 w-full rounded-xl bg-gradient-primary px-6 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] sm:w-auto"
              >
                <a href={apkAsset.url} download="Kisan-Lens.apk">
                  <Download className="mr-2 h-5 w-5" /> APK डाउनलोड करें
                </a>
              </Button>

              <p className="mt-4 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
                Install करने के लिए फोन की Settings में “Unknown sources / अज्ञात स्रोत से install” की अनुमति देनी पड़ सकती है। यह App सिर्फ Kisan Lens की आधिकारिक file है।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
