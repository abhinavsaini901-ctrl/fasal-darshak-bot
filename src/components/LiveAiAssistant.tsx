import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Eye,
  Loader2,
  Mic,
  MicOff,
  ScanSearch,
  Volume2,
  VolumeX,
  X,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { useListen, useSpeak } from "@/hooks/use-voice";
import { useVoiceMode } from "@/hooks/use-voice-mode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefImageCard } from "@/components/RefImageCard";
import { findDiseaseImage, findMedicineImage } from "@/lib/visual-library";
import { withRateLimitRetry } from "@/lib/retry";
import { observeScene, askLive } from "@/lib/live-assistant.functions";
import { scanCrop } from "@/lib/crop.functions";

type Scene = Awaited<ReturnType<typeof observeScene>>;
type ScanResult = Awaited<ReturnType<typeof scanCrop>>;
type Turn = { role: "user" | "assistant"; content: string };
type Status = "starting" | "watching" | "looking" | "listening" | "thinking" | "speaking";

/** Live scene pass timing — deliberately conservative to save data/battery/API. */
const SAMPLE_MS = 2000; // how often we *peek* at the camera locally (no API call)
const MIN_OBSERVE_GAP_MS = 9000; // minimum gap between two AI scene calls
const SCENE_CHANGE_THRESHOLD = 10; // mean pixel delta on a 32x32 grayscale thumb
const MAX_AUTO_OBSERVES = 20; // hard cap per session

const STATUS_TEXT: Record<Status, string> = {
  starting: "कैमरा शुरू हो रहा है…",
  watching: "AI देख रहा है…",
  looking: "AI समझ रहा है…",
  listening: "सुन रहा हूं…",
  thinking: "समझ रहा हूं…",
  speaking: "जवाब दे रहा हूं…",
};

export function LiveAiAssistant({ onClose }: { onClose?: () => void }) {
  const { lang, speechCode } = useLanguage();
  const { ttsEnabled, sttEnabled } = useVoiceMode();
  const { speak, stop: stopSpeak, speaking } = useSpeak(speechCode);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("starting");
  const [scene, setScene] = useState<Scene | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [answering, setAnswering] = useState(false);
  const [muted, setMuted] = useState(!ttsEnabled);
  const [tip, setTip] = useState<string | null>(null);

  const [detail, setDetail] = useState<ScanResult | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const lastThumbRef = useRef<Uint8ClampedArray | null>(null);
  const lastObserveRef = useRef(0);
  const observingRef = useRef(false);
  const observeCountRef = useRef(0);
  const spokenRef = useRef<string>("");
  const sceneRef = useRef<Scene | null>(null);
  sceneRef.current = scene;
  const turnsRef = useRef<Turn[]>([]);
  turnsRef.current = turns;

  const say = useCallback(
    (text: string) => {
      spokenRef.current = text;
      if (muted || !text) return;
      setStatus("speaking");
      speak(text);
    },
    [muted, speak],
  );

  // ---------- camera ----------
  useEffect(() => {
    let active = true;
    async function start() {
      try {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          setCamError("Camera उपलब्ध नहीं है। कृपया camera permission check करें।");
          return;
        }
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        setCamError(null);
        setStatus("watching");
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error(e);
        setCamError("Camera उपलब्ध नहीं है। कृपया camera permission check करें।");
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
  }, [facing]);

  const grabFrame = useCallback((maxSide = 900): string | null => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxSide / Math.max(v.videoWidth, v.videoHeight));
    canvas.width = Math.round(v.videoWidth * scale);
    canvas.height = Math.round(v.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.75);
  }, []);

  /** 32x32 grayscale thumbnail — used for local change + blur detection (no API). */
  const thumbStats = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0, 32, 32);
    const data = ctx.getImageData(0, 0, 32, 32).data;
    const gray = new Uint8ClampedArray(32 * 32);
    for (let i = 0; i < gray.length; i++) {
      gray[i] = (data[i * 4]! * 0.299 + data[i * 4 + 1]! * 0.587 + data[i * 4 + 2]! * 0.114) | 0;
    }
    // crude sharpness: mean horizontal gradient
    let grad = 0;
    for (let y = 0; y < 32; y++) {
      for (let x = 1; x < 32; x++) {
        grad += Math.abs(gray[y * 32 + x]! - gray[y * 32 + x - 1]!);
      }
    }
    const sharpness = grad / (32 * 31);
    let diff = Number.POSITIVE_INFINITY;
    const prev = lastThumbRef.current;
    if (prev) {
      let sum = 0;
      for (let i = 0; i < gray.length; i++) sum += Math.abs(gray[i]! - prev[i]!);
      diff = sum / gray.length;
    }
    lastThumbRef.current = gray;
    return { diff, sharpness };
  }, []);

  const runObserve = useCallback(async () => {
    if (observingRef.current || answering) return;
    const frame = grabFrame();
    if (!frame) return;
    observingRef.current = true;
    lastObserveRef.current = Date.now();
    observeCountRef.current += 1;
    setStatus("looking");
    try {
      const res = await withRateLimitRetry(() =>
        observeScene({
          data: { imageDataUrl: frame, language: lang, previousName: sceneRef.current?.name || undefined },
        }),
      );
      setScene(res);
      setTip(res.guidance || null);
      if (res.spokenLine && res.spokenLine !== spokenRef.current) say(res.spokenLine);
    } catch (e) {
      const msg = (e as Error)?.message ?? "";
      if (msg === "PAYMENT_REQUIRED") toast.error("AI credits खत्म हैं। कृपया बाद में कोशिश करें।");
      else if (msg === "RATE_LIMITED") toast.info("अभी बहुत requests हैं — थोड़ी देर में दोबारा देखूंगा।");
      else if (typeof navigator !== "undefined" && !navigator.onLine)
        toast.error("Internet connection check करें और फिर कोशिश करें।");
    } finally {
      observingRef.current = false;
      setStatus((s) => (s === "looking" ? "watching" : s));
    }
  }, [answering, grabFrame, lang, say]);

  // ---------- smart sampling loop: only call AI when the scene really changes ----------
  useEffect(() => {
    if (!stream || camError) return;
    const id = setInterval(() => {
      if (answering || observingRef.current) return;
      if (observeCountRef.current >= MAX_AUTO_OBSERVES) return;
      const st = thumbStats();
      if (!st) return;
      if (st.sharpness < 4) {
        setTip("Camera थोड़ा स्थिर रखें।");
        return;
      }
      const since = Date.now() - lastObserveRef.current;
      const first = observeCountRef.current === 0;
      if (first || (st.diff > SCENE_CHANGE_THRESHOLD && since > MIN_OBSERVE_GAP_MS)) {
        void runObserve();
      }
    }, SAMPLE_MS);
    return () => clearInterval(id);
  }, [stream, camError, answering, thumbStats, runObserve]);

  useEffect(() => {
    if (!speaking) setStatus((s) => (s === "speaking" ? "watching" : s));
  }, [speaking]);

  // ---------- voice question ----------
  const handleQuestion = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (q.length < 2) {
        toast.error("मैं आपकी बात ठीक से समझ नहीं पाया, कृपया दोबारा बोलें।");
        return;
      }
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        toast.error("Internet connection check करें और फिर कोशिश करें।");
        return;
      }
      stopSpeak();
      setAnswering(true);
      setStatus("thinking");
      setTurns((t) => [...t, { role: "user", content: q }]);
      const frame = grabFrame();
      try {
        const res = await withRateLimitRetry(() =>
          askLive({
            data: {
              language: lang,
              question: q,
              imageDataUrl: frame ?? undefined,
              scene: sceneRef.current ?? undefined,
              history: turnsRef.current.slice(-10),
            },
          }),
        );
        setTurns((t) => [...t, { role: "assistant", content: res.reply }]);
        say(res.reply);
      } catch (e) {
        const msg = (e as Error)?.message ?? "";
        const friendly =
          msg === "PAYMENT_REQUIRED"
            ? "AI credits खत्म हैं। कृपया बाद में कोशिश करें।"
            : msg === "RATE_LIMITED"
              ? "अभी बहुत requests हैं, थोड़ी देर बाद कोशिश करें।"
              : "जवाब नहीं मिल पाया। Internet connection check करें और दोबारा बोलें।";
        toast.error(friendly);
        setTurns((t) => [...t, { role: "assistant", content: friendly }]);
      } finally {
        setAnswering(false);
        setStatus((s) => (s === "thinking" ? "watching" : s));
      }
    },
    [grabFrame, lang, say, stopSpeak],
  );

  const {
    start: startListen,
    stop: stopListen,
    listening,
    supported: sttSupported,
    interim,
  } = useListen(speechCode, (text) => void handleQuestion(text), {
    onError: (code) => {
      if (code === "not-allowed")
        toast.error("Microphone permission allow करें ताकि आप मुझसे बोलकर सवाल पूछ सकें।");
      else if (code === "no-speech") toast.error("मैं आपकी आवाज नहीं सुन पाया। कृपया दोबारा बोलें।");
      else if (code === "network") toast.error("Internet connection check करें और फिर कोशिश करें।");
      else toast.error("आवाज़ नहीं पकड़ पाए। कृपया दोबारा बोलें।");
    },
  });

  useEffect(() => {
    if (listening) setStatus("listening");
    else setStatus((s) => (s === "listening" ? "watching" : s));
  }, [listening]);

  const toggleMic = () => {
    if (!sttSupported) {
      toast.error("इस browser में voice support नहीं है। कृपया Chrome इस्तेमाल करें।");
      return;
    }
    if (!sttEnabled) {
      toast.info("Voice settings में माइक चालू कीजिए।");
      return;
    }
    if (listening) stopListen();
    else {
      stopSpeak();
      startListen();
    }
  };

  // ---------- detailed analysis ----------
  const runDetailed = async () => {
    const frame = grabFrame(1024);
    if (!frame) {
      toast.error("Camera frame नहीं मिला। कृपया दोबारा कोशिश करें।");
      return;
    }
    setDetailLoading(true);
    stopSpeak();
    try {
      const res = await withRateLimitRetry(() => scanCrop({ data: { imageDataUrl: frame, language: lang } }));
      setDetail(res);
      if (res.summary) say(res.summary);
    } catch (e) {
      const msg = (e as Error)?.message ?? "";
      toast.error(
        msg === "PAYMENT_REQUIRED"
          ? "AI credits खत्म हैं। कृपया बाद में कोशिश करें।"
          : msg === "RATE_LIMITED"
            ? "अभी बहुत requests हैं, थोड़ी देर बाद कोशिश करें।"
            : "विस्तृत जांच नहीं हो पाई। कृपया दोबारा कोशिश करें।",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const lastAnswer = [...turns].reverse().find((t) => t.role === "assistant")?.content;
  const confidence = Math.round(scene?.confidence ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* camera */}
      <div className="relative flex-1 overflow-hidden">
        {camError ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
            <Camera className="h-10 w-10 opacity-70" />
            <p className="text-sm opacity-90">{camError}</p>
            <Button variant="secondary" onClick={() => setFacing((f) => f)}>
              दोबारा कोशिश करें
            </Button>
          </div>
        ) : (
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        )}

        {/* top: AI status */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            {status === "watching" ? (
              <Eye className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-300" />
            )}
            👁 {STATUS_TEXT[status]}
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                setMuted((m) => {
                  if (!m) stopSpeak();
                  return !m;
                });
              }}
              aria-label={muted ? "आवाज़ चालू करें" : "आवाज़ बंद करें"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg active:scale-95"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
              aria-label="कैमरा बदलें"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg active:scale-95"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              aria-label="कैमरा बंद करें"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* center scan indicator */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-3xl border-2 border-white/40 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
            <div className="h-full w-full animate-pulse rounded-3xl border border-emerald-300/40" />
          </div>
        </div>

        {/* scene chip + tip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 space-y-2 px-3">
          {scene && (scene.name || scene.possibleIssue) && (
            <div className="mx-auto max-w-md rounded-2xl bg-black/65 px-3 py-2 text-xs text-white backdrop-blur">
              <p className="font-bold">
                🌱 {scene.name || "पहचान अस्पष्ट"}{" "}
                <span className="font-normal opacity-80">({confidence}% भरोसा)</span>
              </p>
              {scene.issueVisible && scene.possibleIssue && (
                <p className="mt-0.5 opacity-90">🦠 संभावित: {scene.possibleIssue}</p>
              )}
            </div>
          )}
          {tip && (
            <p className="mx-auto max-w-md rounded-2xl bg-amber-500/85 px-3 py-1.5 text-center text-[11px] font-semibold text-black">
              {tip}
            </p>
          )}
          {(listening || interim) && (
            <p className="mx-auto max-w-md rounded-2xl bg-black/75 px-3 py-2 text-center text-xs text-white backdrop-blur">
              <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 align-middle" />
              {interim ? `“${interim}”` : "सुन रहा हूं…"}
            </p>
          )}
        </div>
      </div>

      {/* bottom sheet: mic + transcript */}
      <div className="max-h-[46vh] shrink-0 overflow-y-auto rounded-t-3xl bg-background px-4 pb-6 pt-4">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMic}
              aria-label={listening ? "सुनना बंद करें" : "बोलने के लिए दबाएं"}
              aria-pressed={listening}
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-glow transition active:scale-95 ${
                listening
                  ? "animate-pulse bg-red-500 text-white ring-4 ring-red-300/50"
                  : "bg-gradient-primary text-primary-foreground"
              }`}
            >
              {listening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">
                {listening ? "सुन रहा हूं…" : answering ? "समझ रहा हूं…" : "बोलिए…"}
              </p>
              <p className="text-xs text-muted-foreground">
                जैसे: “यह कौन सी फसल है?”, “इसमें बीमारी है?”, “इस दवा की कितनी मात्रा डालूं?”
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={runDetailed} disabled={detailLoading || !stream}>
              {detailLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-1 h-4 w-4" />}
              विस्तृत जांच
            </Button>
            <Button variant="outline" onClick={onClose}>
              कैमरा बंद करें
            </Button>
          </div>

          {lastAnswer && (
            <Card className="mt-3 border-0 bg-secondary/60 p-3 shadow-soft">
              <p className="text-xs font-bold text-primary">🔊 AI का जवाब</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{lastAnswer}</p>
            </Card>
          )}

          {turns.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">💬 बातचीत</p>
              {turns.slice(-8).map((t, i) => (
                <p
                  key={i}
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    t.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.role === "user" ? "🎙️ " : "🤖 "}
                  {t.content}
                </p>
              ))}
            </div>
          )}

          {detail && <DetailedResult result={detail} lang={lang} onClose={() => setDetail(null)} />}
        </div>
      </div>
    </div>
  );
}

function DetailedResult({
  result,
  lang,
  onClose,
}: {
  result: ScanResult;
  lang: string;
  onClose: () => void;
}) {
  const healthy = result.isHealthy;
  const lowConfidence = !result.confidence || result.confidence < 70;
  const diseaseImage = healthy
    ? null
    : findDiseaseImage({
        disease: result.disease,
        primaryIssue: result.primaryIssue,
        issueType: result.issueType,
        symptoms: result.symptoms,
      });
  const medicineImage = findMedicineImage({
    chemicalTreatment: result.chemicalTreatment,
    organicTreatment: result.organicTreatment,
    dosage: result.dosage,
    treatment: result.treatment,
    issueType: result.issueType,
  });

  return (
    <Card className="mt-4 border-0 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-foreground">📋 विस्तृत जांच रिपोर्ट</p>
        <button onClick={onClose} aria-label="रिपोर्ट बंद करें" className="rounded-lg p-1 text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-sm text-foreground">🌱 फसल: {result.cropName || "अस्पष्ट"}</p>
      <p className="text-sm text-foreground">
        🦠 समस्या: {healthy ? "कोई स्पष्ट बीमारी नहीं" : result.disease || result.primaryIssue || "अस्पष्ट"}
      </p>
      <p className="text-xs text-muted-foreground">भरोसा: {Math.round(result.confidence || 0)}%</p>

      {!healthy && (
        <RefImageCard
          image={diseaseImage}
          lang={lang}
          alt={result.disease || "बीमारी का संदर्भ चित्र"}
          reference={lowConfidence}
          emptyNote="इस बीमारी का भरोसेमंद संदर्भ चित्र उपलब्ध नहीं है।"
        />
      )}

      {result.symptoms && <p className="mt-3 text-sm leading-relaxed text-foreground">📝 लक्षण: {result.symptoms}</p>}

      {(result.organicTreatment || result.chemicalTreatment || result.treatment) && (
        <>
          <p className="mt-3 text-sm font-bold text-foreground">💊 उपचार / दवा</p>
          {result.organicTreatment && <p className="mt-1 text-sm text-foreground">🌿 जैविक: {result.organicTreatment}</p>}
          {result.chemicalTreatment && <p className="mt-1 text-sm text-foreground">🧪 रासायनिक: {result.chemicalTreatment}</p>}
          {result.dosage && <p className="mt-1 text-sm text-foreground">मात्रा: {result.dosage}</p>}
          <RefImageCard
            image={medicineImage}
            lang={lang}
            alt="दवा का प्रतीकात्मक चित्र"
            reference
            emptyNote="दवा का संदर्भ चित्र उपलब्ध नहीं है — product label देखें।"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            ⚠️ मात्रा और मिश्रण के लिए product label ज़रूर पढ़ें और स्थानीय कृषि विशेषज्ञ की सलाह लें।
          </p>
        </>
      )}

      {result.prevention && <p className="mt-3 text-sm text-foreground">🛡️ बचाव: {result.prevention}</p>}
      {result.photoTip && <p className="mt-2 text-xs text-muted-foreground">📸 {result.photoTip}</p>}
    </Card>
  );
}
