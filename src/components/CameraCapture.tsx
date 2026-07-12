import { useEffect, useRef, useState } from "react";
import { Video, ArrowUp, Mic, X, RotateCw, MoreHorizontal, Sparkles, Loader2 } from "lucide-react";
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
      {/* Optional sample background behind the feed (used as fallback) */}
      {placeholderImage && (
        <img
          src={placeholderImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Top right floating controls: flip circle + pill with menu/live */}
      <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
        <button
          onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
          aria-label="Flip camera"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg ring-1 ring-black/5 transition hover:bg-white/90 active:scale-95"
        >
          <RotateCw className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1.5 shadow-lg ring-1 ring-black/5">
          {onToggleLive && (
            <button
              onClick={() => onToggleLive(!liveMode)}
              aria-label="Toggle live mode"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${liveMode ? "bg-red-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
          <button
            aria-label="More options"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tiny Live / Scanning indicator at the top center */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <span className={`relative flex h-2 w-2 rounded-full ${liveMode ? "bg-red-500" : "bg-emerald-400"}`}>
          {liveMode && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />}
        </span>
        {liveMode ? "Live" : "Scanning"}
      </div>

      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white/80">
            <p className="mb-4 text-sm opacity-80">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {/* Live mode: small analyzing badge instead of blocking overlay */}
            {liveMode && isAnalyzing && (
              <div className="absolute left-1/2 top-14 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                विश्लेषण हो रहा है…
              </div>
            )}

            {/* Live result overlay supplied by parent */}
            {liveMode && liveOverlay && (
              <div className="pointer-events-auto absolute inset-x-0 bottom-28 z-20 px-3">
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

      {/* Bottom action bar — 5 buttons */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-6 pt-4">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between px-6">
          {/* 1. Live/video toggle — light blue circle */}
          <button
            onClick={() => onToggleLive?.(!liveMode)}
            aria-label="Live camera"
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition active:scale-95 ${liveMode ? "bg-red-500 text-white" : "bg-sky-300 text-sky-900 hover:bg-sky-200"}`}
          >
            <Video className="h-5 w-5" />
          </button>

          {/* 2. Upload — white circle with arrow up */}
          <button
            onClick={() => fileRef.current?.click()}
            aria-label={t("uploadPhoto")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-white/90 active:scale-95"
          >
            <ArrowUp className="h-5 w-5" />
          </button>

          {/* 3. Center — glowing pill AI trigger (also captures) */}
          <button
            onClick={capture}
            disabled={!stream || isAnalyzing}
            aria-label={t("capture")}
            className="relative flex h-14 min-w-[92px] items-center justify-center rounded-full px-5 shadow-[0_0_30px_rgba(125,180,255,0.65)] transition active:scale-95 disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, #dbeafe 0%, #93c5fd 45%, #ffffff 100%)",
            }}
          >
            <span className="absolute inset-0 rounded-full bg-white/40 blur-md" aria-hidden="true" />
            <Sparkles className="relative h-6 w-6 text-sky-700" />
          </button>

          {/* 4. Mic — white circle */}
          <button
            aria-label="Voice"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-white/90 active:scale-95"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* 5. Close — white circle */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-white/90 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
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
