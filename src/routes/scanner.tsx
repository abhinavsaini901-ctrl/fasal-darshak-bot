import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Camera,
  MessageCircle,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";

import heroImg from "@/assets/hero-crop.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CameraCapture } from "@/components/CameraCapture";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { VoiceModeSelector } from "@/components/VoiceModeSelector";
import { useLanguage } from "@/hooks/use-language";
import { useSpeak } from "@/hooks/use-voice";
import { useVoiceMode } from "@/hooks/use-voice-mode";
import { LANG_NAME_FOR_AI, type LangCode } from "@/lib/i18n";
import { scanCrop, chatCrop } from "@/lib/crop.functions";

export const Route = createFileRoute("/scanner")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "AI फसल डॉक्टर — फसल की फोटो से रोग पहचानें | किसान मित्र" },
      { name: "description", content: "अपनी फसल की फोटो लें और AI से तुरंत जानें — कौन सी बीमारी है, क्या इलाज है, और कैसे बचाव करें। हिंदी में, मुफ्त।" },
      { property: "og:title", content: "AI फसल डॉक्टर | किसान मित्र" },
      { property: "og:description", content: "फसल की फोटो से रोग पहचान और AI सलाह।" },
      { property: "og:url", content: "https://kisanlens.com/scanner" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/scanner" }],
  }),
});

type ScanResult = Awaited<ReturnType<typeof scanCrop>>;
type ChatMsg = { role: "user" | "assistant"; content: string };
type View = "home" | "camera" | "result" | "chat";

const MAIN_TOPICS: string[] = [
  "💰 मुनाफा बढ़ाएं",
  "🌾 कौनसी फसल बोएं",
  "☀️ फसल का पूरा प्लान",
  "🪴 पौधा सूखना",
  "🐛 इल्ली का हमला",
  "🪰 सफेद मक्खी",
  "🪲 थ्रिप्स",
  "🐜 माइट",
  "💧 कितना पानी दें",
  "🌱 सही बीज चुनें",
  "💨 स्प्रे कब करें",
];

const TOPIC_CATEGORIES: { title: string; items: string[] }[] = [
  {
    title: "📊 बाजार और कमाई",
    items: ["⏰ कटाई का समय", "📈 फसल का भाव", "📦 भंडारण कैसे करें"],
  },
  {
    title: "🍂 फसल बीमारियां",
    items: [
      "🍂 पत्ते पीले होना",
      "🍃 पत्ते मुड़ना",
      "🍁 पत्तों पर धब्बे",
      "🥀 पत्ते सूखना",
      "🌾 तना सड़ना",
      "🌱 जड़ सड़ना",
    ],
  },
  {
    title: "🐛 कीट समस्याएं",
    items: [
      "🐛 इल्ली का हमला",
      "🪰 सफेद मक्खी",
      "🪲 थ्रिप्स",
      "🐜 माइट",
      "🦗 तना छेदक",
      "🐞 फल छेदक",
      "🪰 पत्ते खाने वाले कीट",
    ],
  },
  {
    title: "💧 पानी / सिंचाई",
    items: [
      "💧 कितना पानी दें",
      "⛈️ बारिश के बाद क्या करें",
      "☀️ फसल में पानी कम",
      "💦 फसल में पानी ज्यादा",
      "🪵 ड्रिप सिंचाई",
      "☁️ मौसम के हिसाब से सिंचाई",
    ],
  },
  {
    title: "🌱 बीज और फसल चयन",
    items: [
      "🌾 कौनसी फसल बोएं",
      "🌱 सही बीज चुनें",
      "💰 ज्यादा मुनाफे वाली फसल",
      "🌤️ मौसम के हिसाब से फसल",
      "🌾 नकदी फसल",
    ],
  },
  {
    title: "🥬 फसल जानकारी",
    items: [
      "🥬 सब्ज़ी फसलें",
      "🍎 फल फसलें",
      "🌾 अनाज फसलें",
      "🫘 दाल फसलें",
      "🪙 नकदी फसलें",
      "🌶️ मसाला फसलें",
      "🌿 चारा फसलें",
    ],
  },
  {
    title: "📉 पैदावार कम होना",
    items: [
      "📉 फसल की बढ़वार रुकना",
      "🌸 फूल गिरना",
      "🍅 फल कम लगना",
      "🌱 फसल छोटी रहना",
      "🪴 पौधा कमजोर होना",
    ],
  },
  {
    title: "🧪 खाद और पोषण",
    items: [
      "🌿 कौनसी खाद दें",
      "⚖️ खाद की सही मात्रा",
      "💨 स्प्रे कब करें",
      "🪱 वर्मी कम्पोस्ट कैसे बनाएं",
      "🪵 गोबर खाद",
      "🧪 माइक्रो न्यूट्रिएंट कमी",
      "🔬 जिंक की कमी",
      "📦 नाइट्रोजन की कमी",
    ],
  },
  {
    title: "🛖 मौसम और पॉलीहाउस / हाई-टेक खेती",
    items: [
      "⛈️ बारिश से नुकसान",
      "❄️ ठंड से फसल बचाएं",
      "🔥 गर्मी से कैसे बचाएं",
      "🧊 ओले पड़ना",
      "🛖 पॉलीहाउस कैसे लगाएं",
      "🏡 ग्रीनहाउस खेती",
      "🪵 ड्रिप सिंचाई",
      "📋 मल्चिंग तकनीक",
      "🫑 शिमला मिर्च पॉलीहाउस",
      "🥒 खीरा पॉलीहाउस",
      "🤖 हाई-टेक सब्जी खेती",
    ],
  },
  {
    title: "💰 ज्यादा मुनाफे वाली खेती",
    items: [
      "🪷 ड्रैगन फ्रूट",
      "🍄 मशरूम",
      "🍓 स्ट्रॉबेरी",
      "🥑 एवोकाडो",
      "🍎 अनार",
      "🪻 सफेद मूसली",
      "🪵 बांस",
      "🪵 चंदन",
      "🌸 केसर",
      "🌾 इसबगोल",
    ],
  },
  {
    title: "🌱 नर्सरी और पौधे",
    items: [
      "🌱 पौधा नर्सरी व्यवसाय",
      "✂️ ग्राफ्टिंग कैसे करें",
      "🪴 पौधे तैयार करना",
      "🏪 पौधा बिक्री व्यवसाय",
    ],
  },
];



function HomePage() {
  const { lang, t, speechCode } = useLanguage();
  const { ttsEnabled } = useVoiceMode();
  const [view, setView] = useState<View>("home");
  const [analyzing, setAnalyzing] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scanFn = useServerFn(scanCrop);
  const chatFn = useServerFn(chatCrop);
  const { speak: speakRaw, stop, speaking } = useSpeak(speechCode);
  const speak = useCallback(
    (text: string) => {
      if (ttsEnabled) speakRaw(text);
    },
    [ttsEnabled, speakRaw]
  );
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Stop voice on view change
  useEffect(() => {
    stop();
  }, [view, stop]);

  // Greet when chat opens fresh
  useEffect(() => {
    if (view === "chat" && messages.length === 0) {
      const greet =
        lang === "hi"
          ? "नमस्ते! मैं किसान मित्र हूं। खेती से जुड़ा कोई भी सवाल पूछें — फसल, बीमारी, खाद, मौसम, सब कुछ।"
          : lang === "en"
            ? "Hello! I am Kisan Mitra. Ask me anything about farming — crops, diseases, fertilizers, weather."
            : "नमस्ते! किसान मित्र में आपका स्वागत है।";
      setMessages([{ role: "assistant", content: greet }]);
    }
  }, [view, lang, messages.length]);

  // Scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleCapture = useCallback(
    async (dataUrl: string) => {
      setImageData(dataUrl);
      setAnalyzing(true);
      try {
        const res = await scanFn({
          data: {
            imageDataUrl: dataUrl,
            language: lang,
            languageName: LANG_NAME_FOR_AI[lang as LangCode],
          },
        });
        setResult(res);
        setView("result");
        // Auto-speak summary
        if (res.summary) speak(res.summary);
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "RATE_LIMITED") toast.error(t("rateLimited"));
        else if (msg === "PAYMENT_REQUIRED") toast.error(t("paymentRequired"));
        else toast.error(t("error"));
        setView("home");
      } finally {
        setAnalyzing(false);
      }
    },
    [scanFn, lang, t, speak]
  );

  const sendMessage = useCallback(
    async (text: string, attachImage = false) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      const newHistory: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
      setMessages(newHistory);
      setInput("");
      setSending(true);
      try {
        const res = await chatFn({
          data: {
            language: lang,
            languageName: LANG_NAME_FOR_AI[lang as LangCode],
            history: newHistory,
            imageDataUrl: attachImage && imageData ? imageData : undefined,
          },
        });
        const reply = res.reply || t("error");
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "RATE_LIMITED") toast.error(t("rateLimited"));
        else if (msg === "PAYMENT_REQUIRED") toast.error(t("paymentRequired"));
        else toast.error(t("error"));
      } finally {
        setSending(false);
      }
    },
    [chatFn, lang, messages, sending, t, imageData, speak]
  );

  const askPreset = useCallback(
    async (topic: string) => {
      stop();
      const userMsg: ChatMsg = { role: "user", content: topic };
      setMessages([userMsg]);
      setView("chat");
      setSending(true);
      try {
        const res = await chatFn({
          data: {
            language: lang,
            languageName: LANG_NAME_FOR_AI[lang as LangCode],
            history: [userMsg],
          },
        });
        const reply = res.reply || t("error");
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        speak(reply);
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "RATE_LIMITED") toast.error(t("rateLimited"));
        else if (msg === "PAYMENT_REQUIRED") toast.error(t("paymentRequired"));
        else toast.error(t("error"));
      } finally {
        setSending(false);
      }
    },
    [chatFn, lang, t, speak, stop]
  );

  // ---------- VIEWS ----------
  if (view === "camera") {
    return (
      <CameraCapture
        onCapture={handleCapture}
        onClose={() => setView("home")}
        isAnalyzing={analyzing}
      />
    );
  }

  if (view === "result" && result) {
    return (
      <ResultView
        result={result}
        image={imageData}
        speaking={speaking}
        onSpeak={() => speak(buildResultText(result, t))}
        onStop={stop}
        onBack={() => {
          stop();
          setResult(null);
          setView("home");
        }}
        onNewScan={() => {
          stop();
          setResult(null);
          setView("camera");
        }}
        onAskMore={() => {
          stop();
          setMessages([
            {
              role: "assistant",
              content:
                lang === "en"
                  ? `I scanned your ${result.cropName || "crop"}. Ask me anything about it.`
                  : `मैंने आपकी ${result.cropName || "फसल"} देख ली। इसके बारे में कुछ भी पूछें।`,
            },
          ]);
          setView("chat");
        }}
      />
    );
  }

  if (view === "chat") {
    return (
      <ChatView
        messages={messages}
        sending={sending}
        input={input}
        setInput={setInput}
        onSend={(text) => sendMessage(text, false)}
        speaking={speaking}
        onSpeak={(txt) => speak(txt)}
        onStop={stop}
        onBack={() => {
          stop();
          setView("home");
        }}
      />
    );
  }

  // -------- HOME --------
  return (
    <main className="min-h-screen bg-gradient-hero pb-10">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-foreground">{t("appName")}</h1>
            <p className="text-xs text-muted-foreground">{t("tagline")}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <VoiceModeSelector compact />
          <LanguageSelector compact />
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pt-6">
        <Card className="overflow-hidden border-0 bg-gradient-card shadow-strong">
          <div className="relative">
            <img
              src={heroImg}
              alt="Healthy crop field"
              width={1024}
              height={768}
              className="h-44 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <p className="text-sm opacity-90">{t("welcome")} 🌾</p>
              <p className="text-base font-semibold leading-snug">{t("welcomeDesc")}</p>
            </div>
          </div>
          <div className="p-4">
            <Button
              size="lg"
              className="h-14 w-full rounded-2xl bg-gradient-primary text-base font-bold shadow-soft transition-smooth hover:shadow-glow"
              onClick={() => setView("camera")}
            >
              <Camera className="mr-2 h-5 w-5" />
              {t("startScan")}
            </Button>
          </div>
        </Card>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-5">
        <button
          onClick={() => setView("camera")}
          className="flex flex-col items-start gap-2 rounded-2xl bg-card p-4 text-left shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-strong"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground">{t("scanCrop")}</p>
          <p className="text-[11px] text-muted-foreground">📸 → 🌿 → 💊</p>
        </button>

        <button
          onClick={() => setView("chat")}
          className="flex flex-col items-start gap-2 rounded-2xl bg-card p-4 text-left shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-strong"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <MessageCircle className="h-5 w-5 text-accent-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">{t("askAnything")}</p>
          <p className="text-[11px] text-muted-foreground">{t("askDesc")}</p>
        </button>
      </section>

      {/* Main topics box */}
      <section className="px-5 pt-6">
        <Card className="border-0 bg-card p-4 shadow-soft">
          <h2 className="mb-3 text-base font-bold text-foreground">किसान भाई से बात करें</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {MAIN_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => askPreset(topic)}
                className="flex min-h-[78px] flex-col items-center justify-center gap-1 rounded-2xl bg-background p-2 text-center shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-strong active:scale-95"
              >
                <span className="text-2xl leading-none">{topic.split(" ")[0]}</span>
                <span className="text-[11px] font-semibold leading-tight text-foreground">
                  {topic.split(" ").slice(1).join(" ")}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Each category in its own box */}
      <section className="space-y-4 px-5 pt-4">
        {TOPIC_CATEGORIES.map((cat) => (
          <Card key={cat.title} className="border border-border/60 bg-card p-4 shadow-soft">
            <h3 className="text-base font-bold text-foreground">{cat.title}</h3>
            <div className="my-3 h-px w-full bg-border" />
            <div className="flex flex-wrap gap-2.5">
              {cat.items.map((item) => (
                <button
                  key={item}
                  onClick={() => askPreset(item)}
                  className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-soft transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-strong active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </section>




      {/* Tips */}
      <section className="px-5 pt-5">
        <Card className="border-0 bg-card/80 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning/20">
              <Sparkles className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {lang === "en" ? "Pro tip" : "एक सलाह"}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === "en"
                  ? "Get close to the leaf. Good light = better diagnosis."
                  : "पत्ते के पास जाकर फोटो लें। अच्छी रोशनी से बेहतर जांच होती है।"}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

// ================= RESULT VIEW =================

function ResultView({
  result,
  image,
  speaking,
  onSpeak,
  onStop,
  onBack,
  onNewScan,
  onAskMore,
}: {
  result: ScanResult;
  image: string | null;
  speaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onBack: () => void;
  onNewScan: () => void;
  onAskMore: () => void;
}) {
  const { t, lang } = useLanguage();
  const healthy = result.isHealthy;
  const score = Math.max(0, Math.min(100, Math.round(result.healthScore || 0)));

  return (
    <main className="min-h-screen bg-gradient-hero pb-28">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/85 px-4 py-3 backdrop-blur">
        <Button size="icon" variant="ghost" onClick={onBack} aria-label={t("back")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-base font-bold">{t("scanCrop")}</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={speaking ? onStop : onSpeak}
          aria-label={speaking ? t("stop") : t("speak")}
        >
          {speaking ? <VolumeX className="h-5 w-5 text-primary" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </header>

      <div className="px-4 pt-2">
        {image && (
          <Card className="overflow-hidden border-0 shadow-soft">
            <img src={image} alt="Scanned crop" className="h-56 w-full object-cover" />
          </Card>
        )}

        {/* Status banner */}
        <Card
          className={`mt-4 border-0 p-4 shadow-soft ${
            healthy ? "bg-success/10" : "bg-destructive/10"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                healthy ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
              }`}
            >
              {healthy ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {result.cropName || t("cropName")}
              </p>
              <p className={`text-lg font-bold ${healthy ? "text-success" : "text-destructive"}`}>
                {healthy ? t("healthy") : result.disease || t("diseased")}
              </p>
              {/* Health bar */}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    healthy ? "bg-gradient-primary" : "bg-destructive"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("health")}: {score}%
              </p>
            </div>
          </div>
          {result.summary && (
            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.summary}</p>
          )}
        </Card>

        {/* Details */}
        {result.symptoms && (
          <DetailCard label={lang === "en" ? "Symptoms" : "लक्षण"} text={result.symptoms} accent="warning" />
        )}
        {result.treatment && (
          <DetailCard label={t("treatment")} text={result.treatment} accent="primary" />
        )}
        {result.prevention && (
          <DetailCard label={t("prevention")} text={result.prevention} accent="accent" />
        )}
      </div>

      {/* Bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-2">
          <Button variant="secondary" className="flex-1 rounded-2xl" onClick={onNewScan}>
            <Camera className="mr-1 h-4 w-4" />
            {t("newScan")}
          </Button>
          <Button className="flex-1 rounded-2xl bg-gradient-primary" onClick={onAskMore}>
            <MessageCircle className="mr-1 h-4 w-4" />
            {t("askFollowUp")}
          </Button>
        </div>
      </div>
    </main>
  );
}

function DetailCard({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: "primary" | "warning" | "accent";
}) {
  const accentClass =
    accent === "primary"
      ? "bg-primary/10 text-primary"
      : accent === "warning"
        ? "bg-warning/20 text-warning"
        : "bg-accent/20 text-accent-foreground";
  return (
    <Card className="mt-3 border-0 bg-card p-4 shadow-soft">
      <span
        className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${accentClass}`}
      >
        {label}
      </span>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{text}</p>
    </Card>
  );
}

// ================= CHAT VIEW =================

function ChatView({
  messages,
  sending,
  input,
  setInput,
  onSend,
  speaking,
  onSpeak,
  onStop,
  onBack,
}: {
  messages: ChatMsg[];
  sending: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: (text: string) => void;
  speaking: boolean;
  onSpeak: (text: string) => void;
  onStop: () => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  return (
    <main className="flex h-screen flex-col bg-gradient-hero">
      <header className="flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
        <Button size="icon" variant="ghost" onClick={onBack} aria-label={t("back")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{t("appName")}</p>
            <p className="text-[11px] text-muted-foreground">{t("tagline")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <VoiceModeSelector compact />
          <LanguageSelector compact />
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="mx-auto flex max-w-md flex-col gap-3 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                  m.role === "user"
                    ? "rounded-br-md bg-gradient-primary text-primary-foreground"
                    : "rounded-bl-md bg-card text-foreground"
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>
                {m.role === "assistant" && (
                  <button
                    onClick={() => (speaking ? onStop() : onSpeak(m.content))}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    {speaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    {speaking ? t("stop") : t("speak")}
                  </button>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-soft">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
        className="flex items-center gap-2 border-t border-border bg-background/95 p-3 backdrop-blur"
      >
        <VoiceInputButton onText={(txt) => onSend(txt)} />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("typeMessage")}
          className="h-11 flex-1 rounded-full border-border bg-card px-4"
          disabled={sending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || sending}
          className="h-11 w-11 rounded-full bg-gradient-primary"
          aria-label={t("send")}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </main>
  );
}

function buildResultText(r: ScanResult, t: (k: string) => string): string {
  const parts: string[] = [];
  if (r.cropName) parts.push(`${t("cropName")}: ${r.cropName}.`);
  parts.push(r.isHealthy ? t("healthy") : `${t("disease")}: ${r.disease || ""}.`);
  if (r.summary) parts.push(r.summary);
  if (r.treatment) parts.push(`${t("treatment")}: ${r.treatment}`);
  return parts.join(" ");
}
