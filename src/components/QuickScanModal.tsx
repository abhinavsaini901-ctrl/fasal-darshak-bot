import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { CameraCapture } from "@/components/CameraCapture";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useSpeak } from "@/hooks/use-voice";
import { scanCrop } from "@/lib/crop.functions";
import { withRateLimitRetry } from "@/lib/retry";

type ScanRes = Awaited<ReturnType<typeof scanCrop>>;

/**
 * फसल स्कैनर — पेज बदले बिना, इसी जगह खुलने वाला कैमरा + रिपोर्ट।
 */
export function QuickScanModal({ onClose }: { onClose: () => void }) {
  const { lang, t, speechCode } = useLanguage();
  const { speak } = useSpeak(speechCode);
  const scanFn = useServerFn(scanCrop);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanRes | null>(null);

  const handleCapture = useCallback(
    async (dataUrl: string) => {
      setAnalyzing(true);
      try {
        const res = await withRateLimitRetry(
          () => scanFn({ data: { imageDataUrl: dataUrl, language: lang } }),
          { onRetry: () => toast.info(t("rateLimited")) },
        );
        setResult(res);
        if (res.summary) speak(res.summary);
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "RATE_LIMITED") toast.error(t("rateLimited"));
        else if (msg === "PAYMENT_REQUIRED") toast.error(t("paymentRequired"));
        else toast.error(t("error"));
      } finally {
        setAnalyzing(false);
      }
    },
    [scanFn, lang, t, speak],
  );

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {!result ? (
        <CameraCapture onCapture={handleCapture} onClose={onClose} isAnalyzing={analyzing} />
      ) : (
        <div className="h-full overflow-y-auto bg-background p-4">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">🌾 स्कैन रिपोर्ट</h2>
              <button onClick={onClose} aria-label="बंद करें" className="rounded-lg p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-sm">
              {result.cropName && (
                <Row label="फसल" value={result.cropName} />
              )}
              {result.disease && <Row label="समस्या / रोग" value={result.disease} />}
              {typeof result.healthScore === "number" && (
                <Row label="हेल्थ स्कोर" value={`${result.healthScore}/100`} />
              )}
              {result.summary && (
                <p className="rounded-xl bg-secondary/60 p-3 leading-relaxed text-foreground">{result.summary}</p>
              )}
              {result.organicTreatment && <Row label="जैविक उपचार" value={result.organicTreatment} />}
              {result.chemicalTreatment && <Row label="रासायनिक उपचार" value={result.chemicalTreatment} />}
              {result.prevention && <Row label="बचाव" value={result.prevention} />}
            </div>

            <div className="mt-5 flex gap-2">
              <Button className="flex-1 rounded-full bg-gradient-primary" onClick={() => setResult(null)}>
                फिर से स्कैन करें
              </Button>
              <Button variant="outline" className="rounded-full" onClick={onClose}>
                बंद करें
              </Button>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              सूचना: AI की सलाह मार्गदर्शन के लिए है। दवा से पहले label और कृषि विशेषज्ञ की सलाह लें।
            </p>
          </div>
        </div>
      )}

      {analyzing && !result && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white">
            <Loader2 className="h-4 w-4 animate-spin" /> जांच हो रही है…
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-xs font-bold text-primary">{label}</p>
      <p className="mt-1 leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
