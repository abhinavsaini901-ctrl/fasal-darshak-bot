import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Camera,
  FileText,
  Loader2,
  Upload,
  FlaskConical,
  BarChart3,
  AlertTriangle,
  Sprout,
  Droplets,
  RotateCcw,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { analyzeSoil, type SoilResult } from "@/lib/soil.functions";
import { withRateLimitRetry } from "@/lib/retry";

export const Route = createFileRoute("/soil-lens")({
  component: SoilLensPage,
  head: () => ({
    meta: [
      { title: "Kisan Soil Lens 🌱🔍 — मिट्टी की जांच और Soil Report AI" },
      {
        name: "description",
        content:
          "मिट्टी की फोटो स्कैन करें या Soil Test Report अपलोड करें — Kisan Soil Lens आसान हिंदी में मिट्टी की जानकारी, संभावित समस्या, फसल सुझाव और सुधार के उपाय बताता है।",
      },
      { property: "og:title", content: "Kisan Soil Lens 🌱🔍 — अपनी मिट्टी को समझें" },
      {
        property: "og:description",
        content: "मिट्टी की फोटो या Soil Test Report से आसान हिंदी में जानकारी पाएं।",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://kisanlens.com/soil-lens" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/soil-lens" }],
  }),
});

const CROPS = ["गेहूँ", "धान", "सरसों", "कपास", "गन्ना", "मक्का", "सब्जियाँ", "दलहन"];

const DISCLAIMER =
  "Kisan Soil Lens की photo analysis केवल प्रारंभिक जानकारी है। pH, NPK और मिट्टी की वास्तविक स्थिति की पुष्टि के लिए Soil Testing Laboratory की जाँच आवश्यक है।";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("READ_FAILED"));
    fr.readAsDataURL(file);
  });
}

// Re-encode a photo through canvas so a high-resolution phone picture stays well
// under the server's data-URL limit (same approach as the camera components).
async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<string> {
  const raw = await readAsDataUrl(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("IMG_DECODE_FAILED"));
      el.src = raw;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return raw;
    ctx.drawImage(img, 0, 0, w, h);
    let out = canvas.toDataURL("image/jpeg", quality);
    if (out.length > 5_500_000) out = canvas.toDataURL("image/jpeg", 0.6);
    return out.length < raw.length ? out : raw;
  } catch {
    return raw;
  }
}


function SoilLensPage() {
  const { lang } = useLanguage();
  const run = useServerFn(analyzeSoil);

  const [mode, setMode] = useState<"photo" | "report">("photo");
  const [crop, setCrop] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SoilResult | null>(null);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined, nextMode: "photo" | "report") {
    if (!file) return;
    if (file.size > 9_000_000) {
      toast.error("फ़ाइल बहुत बड़ी है — 9MB से छोटी फ़ाइल चुनें।");
      return;
    }
    const isPdf = file.type === "application/pdf";
    if (nextMode === "photo" && isPdf) {
      toast.error("फोटो स्कैन के लिए इमेज चुनें।");
      return;
    }
    setMode(nextMode);
    setResult(null);
    setBusy(true);
    setFileLabel(file.name);
    try {
      const dataUrl = await readAsDataUrl(file);
      setPreview(isPdf ? null : dataUrl);
      const res = await withRateLimitRetry(
        () =>
          run({
            data: {
              mode: nextMode,
              language: lang,
              ...(isPdf ? { pdfDataUrl: dataUrl, fileName: file.name } : { imageDataUrl: dataUrl }),
              ...(crop ? { cropWanted: crop } : {}),
            },
          }),
        { onRetry: () => toast.info("थोड़ा इंतज़ार करें, फिर कोशिश हो रही है…") },
      );
      setResult(res);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "RATE_LIMITED") toast.error("बहुत ज़्यादा अनुरोध — कुछ देर बाद कोशिश करें।");
      else if (msg === "PAYMENT_REQUIRED") toast.error("AI सेवा अस्थायी रूप से उपलब्ध नहीं है।");
      else toast.error("जांच नहीं हो सकी — दोबारा कोशिश करें।");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setResult(null);
    setPreview(null);
    setFileLabel(null);
  }

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-stone-800 to-emerald-900 px-4 py-10 md:py-14">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-50 backdrop-blur">
            <FlaskConical className="h-3.5 w-3.5" /> नया फीचर
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white drop-shadow md:text-5xl">
            Kisan Soil Lens 🌱🔍
          </h1>
          <p className="mt-3 text-base text-amber-50/90 md:text-lg">
            “अपनी मिट्टी को समझें, बेहतर फसल उगाएँ”
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8">
        {/* Crop question */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-sm font-bold text-foreground">आप कौन-सी फसल उगाना चाहते हैं?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CROPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrop(crop === c ? "" : c)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  crop === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground/80 hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="या यहाँ फसल का नाम लिखें"
            className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {/* Two big options */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <p className="mt-3 text-base font-bold text-foreground">📷 मिट्टी की फोटो स्कैन करें</p>
            <p className="mt-1 text-xs text-muted-foreground">कैमरा खोलें या गैलरी से फोटो चुनें</p>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                className="h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-base font-bold text-white"
                onClick={() => cameraRef.current?.click()}
                disabled={busy}
              >
                <Camera className="mr-2 h-5 w-5" /> कैमरा खोलें
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => galleryRef.current?.click()}
                disabled={busy}
              >
                <Upload className="mr-2 h-4 w-4" /> गैलरी से चुनें
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <p className="mt-3 text-base font-bold text-foreground">📄 Soil Test Report अपलोड करें</p>
            <p className="mt-1 text-xs text-muted-foreground">फोटो या PDF — AI आसान हिंदी में समझाएगा</p>
            <Button
              className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-base font-bold text-white"
              onClick={() => reportRef.current?.click()}
              disabled={busy}
            >
              <Upload className="mr-2 h-5 w-5" /> रिपोर्ट अपलोड करें
            </Button>
          </div>
        </div>

        {/* hidden inputs */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0], "photo")}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0], "photo")}
        />
        <input
          ref={reportRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0], "report")}
        />

        {/* preview / status */}
        {(preview || fileLabel) && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            {preview ? (
              <img
                src={preview}
                alt="चुनी गई मिट्टी की फोटो"
                width={80}
                height={80}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-secondary">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{fileLabel}</p>
              <p className="text-xs text-muted-foreground">
                {busy ? "AI जांच रहा है…" : mode === "photo" ? "फोटो जांच" : "रिपोर्ट जांच"}
              </p>
            </div>
            {busy && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>
        )}

        {/* Result cards */}
        {result && (
          <div className="mt-6 space-y-4">
            <Card icon={<FlaskConical className="h-4 w-4" />} title="🧪 Soil Health">
              {result.soilHealthLabel && (
                <p className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {result.soilHealthLabel}
                </p>
              )}
              {result.summary && <p className="leading-relaxed text-foreground">{result.summary}</p>}
              {mode === "photo" && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {result.visibleColor && <Mini label="दिखाई देने वाला रंग" value={result.visibleColor} />}
                  {result.textureGuess && <Mini label="बनावट का अनुमान" value={result.textureGuess} />}
                  {result.moisture && <Mini label="नमी / सूखापन" value={result.moisture} />}
                  {result.soilTypeGuess && <Mini label="मिट्टी का प्रकार (अनुमान)" value={result.soilTypeGuess} />}
                </div>
              )}
              {result.photoTip && (
                <p className="mt-3 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                  💡 {result.photoTip}
                </p>
              )}
            </Card>

            {mode === "report" && (result.testResults?.length ?? 0) > 0 && (
              <Card icon={<BarChart3 className="h-4 w-4" />} title="📊 Test Results">
                <div className="space-y-2">
                  {result.testResults!.map((r) => (
                    <div key={r.name} className="rounded-xl border border-border p-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground">{r.name}</span>
                        <span className="text-sm font-semibold text-primary">
                          {r.value}
                          {r.unit ? ` ${r.unit}` : ""}
                        </span>
                        {r.status && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                            {r.status}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.meaning}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {result.possibleIssues.length > 0 && (
              <Card icon={<AlertTriangle className="h-4 w-4" />} title="⚠️ Possible Issues">
                <List items={result.possibleIssues} />
              </Card>
            )}

            {result.cropSuggestions.length > 0 && (
              <Card icon={<Sprout className="h-4 w-4" />} title="🌱 Crop Suggestions">
                <List items={result.cropSuggestions} />
              </Card>
            )}

            {result.improvementTips.length > 0 && (
              <Card icon={<Droplets className="h-4 w-4" />} title="💧 Soil Improvement Tips">
                <List items={result.improvementTips} />
              </Card>
            )}

            {result.labTests.length > 0 && (
              <Card icon={<FlaskConical className="h-4 w-4" />} title="🔬 लैब में यह जाँच करवाएँ">
                <List items={result.labTests} />
              </Card>
            )}

            <p className="rounded-2xl border border-amber-300/50 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
              {DISCLAIMER}
            </p>

            <Button variant="outline" className="w-full rounded-xl" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> दोबारा जांच करें
            </Button>
          </div>
        )}

        {!result && (
          <p className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            {DISCLAIMER}
          </p>
        )}
      </section>
    </PageShell>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="flex items-center gap-2 text-sm font-bold text-primary">
        {icon} {title}
      </p>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2 leading-relaxed text-foreground">
          <span className="text-primary">•</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
