import { useEffect, useMemo, useState } from "react";
import {
  Newspaper,
  Volume2,
  Share2,
  ArrowRight,
  RefreshCw,
  MapPin,
  TrendingUp,
  CloudRain,
  Landmark,
  Sprout,
  Cpu,
  Radio,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NewsCategory =
  | "सभी"
  | "मंडी भाव"
  | "मौसम"
  | "सरकारी योजनाएं"
  | "फसल सलाह"
  | "कृषि तकनीक";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: Exclude<NewsCategory, "सभी">;
  source: string;
  minutesAgo: number;
  breaking?: boolean;
  state?: string;
  gradient: string;
  icon: typeof TrendingUp;
};

const CATEGORIES: { key: NewsCategory; icon: typeof TrendingUp }[] = [
  { key: "सभी", icon: Newspaper },
  { key: "मंडी भाव", icon: TrendingUp },
  { key: "मौसम", icon: CloudRain },
  { key: "सरकारी योजनाएं", icon: Landmark },
  { key: "फसल सलाह", icon: Sprout },
  { key: "कृषि तकनीक", icon: Cpu },
];

const NEWS_POOL: NewsItem[] = [
  {
    id: "n1",
    title: "गेहूं MSP में ₹150 प्रति क्विंटल बढ़ोतरी की घोषणा",
    summary:
      "केंद्र सरकार ने रबी सीज़न के लिए गेहूं का न्यूनतम समर्थन मूल्य बढ़ाकर किसानों को बड़ी राहत दी है। नई दरें इसी सीज़न से लागू होंगी।",
    category: "सरकारी योजनाएं",
    source: "कृषि मंत्रालय",
    minutesAgo: 35,
    breaking: true,
    gradient: "from-red-500 via-orange-500 to-amber-500",
    icon: Landmark,
  },
  {
    id: "n2",
    title: "अगले 48 घंटों में पंजाब और हरियाणा में बारिश की संभावना",
    summary:
      "IMD ने उत्तर भारत के लिए येलो अलर्ट जारी किया है। किसानों को सिंचाई और फसल कटाई की योजना तदनुसार बनाने की सलाह।",
    category: "मौसम",
    source: "IMD",
    minutesAgo: 55,
    state: "पंजाब",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    icon: CloudRain,
  },
  {
    id: "n3",
    title: "PM-Kisan की अगली किस्त की नई तारीख जारी",
    summary:
      "19वीं किस्त के तहत पात्र किसानों के खातों में ₹2000 जल्द ही ट्रांसफर होंगे। e-KYC जरूर पूरा कर लें।",
    category: "सरकारी योजनाएं",
    source: "PM-Kisan पोर्टल",
    minutesAgo: 120,
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    icon: Landmark,
  },
  {
    id: "n4",
    title: "लुधियाना मंडी में धान के दाम में ₹120 की बढ़ोतरी",
    summary:
      "बासमती किस्मों की मांग बढ़ने से कीमतों में उछाल। व्यापारियों के अनुसार आने वाले हफ्तों में भाव और बढ़ सकते हैं।",
    category: "मंडी भाव",
    source: "एगमार्कनेट",
    minutesAgo: 180,
    state: "पंजाब",
    gradient: "from-lime-500 via-emerald-500 to-green-600",
    icon: TrendingUp,
  },
  {
    id: "n5",
    title: "ICAR ने जारी की गेहूं की नई रोग-प्रतिरोधी किस्म",
    summary:
      "HD-3410 किस्म पीला रतुआ के प्रति प्रतिरोधी है और 15% अधिक उपज देती है। उत्तर भारत के लिए विशेष रूप से अनुशंसित।",
    category: "कृषि तकनीक",
    source: "ICAR",
    minutesAgo: 240,
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    icon: Cpu,
  },
  {
    id: "n6",
    title: "टमाटर में अगेती झुलसा रोग से बचाव के उपाय",
    summary:
      "नमी बढ़ने के साथ ही रोग का प्रकोप संभव। कॉपर ऑक्सीक्लोराइड का छिड़काव और रोगग्रस्त पत्तियों को हटाना जरूरी।",
    category: "फसल सलाह",
    source: "KVK सलाह",
    minutesAgo: 300,
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    icon: Sprout,
  },
  {
    id: "n7",
    title: "ड्रोन से कीटनाशक छिड़काव पर 50% सब्सिडी",
    summary:
      "केंद्र सरकार की SMAM योजना के तहत कस्टम हायरिंग सेंटर्स को विशेष अनुदान। छोटे किसानों को भी मिलेगा लाभ।",
    category: "कृषि तकनीक",
    source: "कृषि विभाग",
    minutesAgo: 360,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    icon: Cpu,
  },
  {
    id: "n8",
    title: "प्याज के दाम में गिरावट, सरकार ने बफर स्टॉक बढ़ाया",
    summary:
      "NAFED किसानों से सीधी खरीद कर रहा है ताकि कीमतें स्थिर रहें। महाराष्ट्र और कर्नाटक के किसानों को राहत।",
    category: "मंडी भाव",
    source: "NAFED",
    minutesAgo: 420,
    state: "महाराष्ट्र",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    icon: TrendingUp,
  },
];

function formatTimeAgo(minutes: number, refreshTick: number): string {
  const m = minutes + refreshTick;
  if (m < 60) return `${m} मिनट पहले`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} घंटे पहले`;
  return `${Math.floor(h / 24)} दिन पहले`;
}

export function LiveKisanNews() {
  const [active, setActive] = useState<NewsCategory>("सभी");
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Auto refresh every 30 minutes
  useEffect(() => {
    const id = setInterval(() => {
      setRefreshTick((t) => t + 30);
      setLastRefresh(new Date());
    }, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (active === "सभी") return NEWS_POOL;
    return NEWS_POOL.filter((n) => n.category === active);
  }, [active]);

  const handleSpeak = (item: NewsItem) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (speakingId === item.id) {
        setSpeakingId(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(`${item.title}. ${item.summary}`);
      u.lang = "hi-IN";
      u.rate = 0.95;
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(u);
      setSpeakingId(item.id);
    } catch {
      setSpeakingId(null);
    }
  };

  const handleShare = async (item: NewsItem) => {
    const text = `${item.title}\n\n${item.summary}\n\n— ${item.source} (किसान मित्र)`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
  };

  const handleManualRefresh = () => {
    setRefreshTick(0);
    setLastRefresh(new Date());
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              LIVE
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
            📰 आज की कृषि खबरें
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            खेती, मौसम, मंडी भाव और सरकारी योजनाओं की ताज़ा जानकारी
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary sm:self-auto"
          aria-label="ख़बरें ताज़ा करें"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          अपडेट:{" "}
          {lastRefresh.toLocaleTimeString("hi-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </button>
      </div>

      {/* Category filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((c) => {
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              <c.icon className="h-3.5 w-3.5" />
              {c.key}
            </button>
          );
        })}
      </div>

      {/* News grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="group flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-strong"
          >
            {/* Thumbnail */}
            <div
              className={`relative h-32 w-full bg-gradient-to-br ${item.gradient}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-90">
                <item.icon className="h-12 w-12 text-white drop-shadow-md" />
              </div>
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {item.breaking && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ring-2 ring-red-300/60 animate-pulse">
                    <Radio className="h-3 w-3" /> Breaking
                  </span>
                )}
                <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {item.category}
                </span>
              </div>
              {item.state && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  <MapPin className="h-3 w-3" /> {item.state}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium">{item.source}</span>
                <span>{formatTimeAgo(item.minutesAgo, refreshTick)}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Link to="/blog" className="flex-1">
                  <Button
                    size="sm"
                    className="h-8 w-full rounded-lg bg-gradient-primary text-xs font-semibold"
                  >
                    पूरा पढ़ें
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
                <button
                  onClick={() => handleSpeak(item)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                    speakingId === item.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                  aria-label="खबर सुनें"
                  title="🔊 खबर सुनें"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  aria-label="शेयर करें"
                  title="शेयर करें"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-6 flex justify-center">
        <Link to="/blog">
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-xl border-primary/40 px-6 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            और खबरें देखें
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
