import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, RotateCw, Loader2, X, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

type Props = {
  onCapture: (dataUrl: string) => void;
  onClose?: () => void;
  isAnalyzing?: boolean;
  /** Live mode — auto-capture frames on an interval */
  liveMode?: boolean;
  onToggleLive?: (next: boolean) => void;
  /** Interval between auto-captures in ms (default 5000) */
  liveIntervalMs?: number;
  /** Optional overlay rendered on top of the camera in live mode (live result card) */
  liveOverlay?: React.ReactNode;
};

export function CameraCapture({
  onCapture,
  onClose,
  isAnalyzing,
  liveMode = false,
  onToggleLive,
  liveIntervalMs = 5000,
  liveOverlay,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;
    async function start() {
      try {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          setError(t("noCamera"));
          return;
        }
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error(err);
        setError(t("noCamera"));
      }
    }
    start();
    return () => {
      active = false;
      setStream((s) => {
        s?.getTracks().forEach((t) => t.stop());
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing]);

  const grabFrame = (): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    const w = video.videoWidth;
    const h = video.videoHeight;
    const maxSide = 1024;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const capture = () => {
    const dataUrl = grabFrame();
    if (dataUrl) onCapture(dataUrl);
  };

  // Live mode auto-capture loop — only fires a new frame when idle
  useEffect(() => {
    if (!liveMode || !stream || error) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (!isAnalyzing) {
        const dataUrl = grabFrame();
        if (dataUrl) onCapture(dataUrl);
      }
    };
    // First scan after a short delay, then on interval
    const first = setTimeout(tick, 1200);
    const id = setInterval(tick, liveIntervalMs);
    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(id);
    };
  }, [liveMode, stream, error, isAnalyzing, liveIntervalMs, onCapture]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSide = 1024;
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          onCapture(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  // In live mode, suppress the fullscreen analyzing overlay so video stays visible.
  const showFullscreenAnalyzing = isAnalyzing && !liveMode;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
        {onClose && (
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {onToggleLive && (
            <Button
              size="sm"
              variant="secondary"
              className={`rounded-full backdrop-blur ${liveMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-black/40 text-white hover:bg-black/60"}`}
              onClick={() => onToggleLive(!liveMode)}
              aria-label="Toggle live mode"
            >
              {liveMode ? <Zap className="mr-1 h-4 w-4" /> : <ZapOff className="mr-1 h-4 w-4" />}
              {liveMode ? "Live ON" : "Live"}
            </Button>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
            onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
            aria-label="Flip camera"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white">
            <p className="mb-4 text-lg">{error}</p>
            <Button onClick={() => fileRef.current?.click()} className="rounded-full">
              <ImageIcon className="mr-2 h-4 w-4" />
              {t("uploadPhoto")}
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-72 w-72 max-w-[80vw] max-h-[60vh] rounded-3xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-primary-glow shadow-glow animate-scan-line" />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {liveMode ? "🔴 Live AI" : t("scanCrop")}
                </span>
              </div>
            </div>

            {/* Live mode: small analyzing badge instead of blocking overlay */}
            {liveMode && isAnalyzing && (
              <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                विश्लेषण हो रहा है…
              </div>
            )}

            {/* Live result overlay supplied by parent */}
            {liveMode && liveOverlay && (
              <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 p-3">
                {liveOverlay}
              </div>
            )}
          </>
        )}

        {showFullscreenAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <Loader2 className="mb-3 h-12 w-12 animate-spin text-primary-glow" />
            <p className="text-lg font-semibold">{t("analyzing")}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-around bg-black/90 p-6 pb-8">
        <Button
          size="icon"
          variant="ghost"
          className="h-14 w-14 rounded-full text-white hover:bg-white/10"
          onClick={() => fileRef.current?.click()}
          aria-label={t("uploadPhoto")}
        >
          <ImageIcon className="h-7 w-7" />
        </Button>

        <button
          onClick={capture}
          disabled={!stream || isAnalyzing || liveMode}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-strong transition-smooth hover:scale-105 active:scale-95 disabled:opacity-40 animate-pulse-ring"
          aria-label={t("capture")}
        >
          <div className="h-16 w-16 rounded-full bg-primary" />
        </button>

        <div className="h-14 w-14" />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}
