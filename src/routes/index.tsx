import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera,
  MessageCircle,
  Sprout,
  Mic,
  Leaf,
  TreePine,
  BookOpen,
  ShoppingCart,
  QrCode,
  Sparkles,
  Video,
  ScanLine,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { LiveKisanNews } from "@/components/LiveKisanNews";
import { SupportSection } from "@/components/SupportSection";
import { AppDownloadSection } from "@/components/AppDownloadSection";
import { LiveAiAssistant } from "@/components/LiveAiAssistant";
import { QuickScanModal } from "@/components/QuickScanModal";
import { SeedsPromoBanner } from "@/components/SeedsPromoBanner";
import { Button } from "@/components/ui/button";
import kisanPhoneBgAsset from "@/assets/kisan-phone-bg.png.asset.json";
const kisanPhoneBg = kisanPhoneBgAsset.url;
import bookCover from "@/assets/kisan-lens-book-cover.jpg";
import bookQr from "@/assets/kisan-lens-book-qr.png";


const PLAY_BOOKS_URL =
  "https://play.google.com/store/books/details/Abhinav_Saini_Kisan_Lens_A_Farmer_s_Son_s_Dream?id=qCr_EQAAQBAJ";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "किसान मित्र — AI फसल डॉक्टर, मंडी भाव और कृषि योजनाएं" },
      {
        name: "description",
        content:
          "भारतीय किसानों के लिए AI-संचालित कृषि पोर्टल। फसल स्कैन, रोग पहचान, मंडी भाव, सरकारी योजनाएं, कृषि लेख और Kisan Lens ई-बुक — सब हिंदी में।",
      },
      { property: "og:title", content: "किसान मित्र — AI कृषि पोर्टल" },
      { property: "og:description", content: "फसल स्कैन, मंडी भाव, योजनाएं और Kisan Lens ई-बुक — एक ही जगह।" },
      { property: "og:url", content: "https://kisanlens.com/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "किसान मित्र",
          url: "https://kisanlens.com/",
          inLanguage: "hi-IN",
          description:
            "AI-संचालित भारतीय कृषि पोर्टल — फसल रोग पहचान, मंडी भाव, सरकारी योजनाएं और किसानों के लिए विस्तृत लेख।",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Book",
          name: "Kisan Lens: A Farmer's Son's Dream",
          author: { "@type": "Person", name: "Abhinav Saini" },
          url: "https://kisanlens.com/ebook",
          offers: {
            "@type": "Offer",
            url: PLAY_BOOKS_URL,
            availability: "https://schema.org/InStock",
          },
        }),
      },
    ],
  }),
});

function HomePage() {
  const [openAssistant, setOpenAssistant] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);

  return (
    <PageShell>

      {/* 🌱 Seeds partner banner — Sagar Biotech */}
      <SeedsPromoBanner />

      {/* 👁️ Kisan Lens Smart Eye — छोटा prominent banner (नया अलग feature) */}
      <section className="border-b border-emerald-900/10 bg-gradient-to-r from-emerald-900 to-emerald-700 px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">👁️ Kisan Lens Smart Eye</p>
            <p className="text-xs text-emerald-50/85">कैमरा दिखाएं और AI से खेती के बारे में पूछें</p>
          </div>
          <Link to="/smart-eye" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 font-bold text-emerald-950 sm:w-auto"
            >
              Smart Eye खोलें
            </Button>
          </Link>
        </div>
      </section>

      {/* 🌱 Kisan Soil Lens 🔍 — नया अलग feature */}
      <section className="border-b border-amber-900/10 bg-gradient-to-r from-amber-800 via-stone-700 to-amber-900 px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">🌱 Kisan Soil Lens 🔍</p>
            <p className="text-xs text-amber-50/85">अपनी मिट्टी को समझें, बेहतर फसल उगाएँ</p>
          </div>
          <Link to="/soil-lens" className="w-full sm:w-auto">
            <Button
              size="sm"
              className="w-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 font-bold text-amber-950 sm:w-auto"
            >
              🌱 Kisan Soil Lens 🔍
            </Button>
          </Link>
        </div>
      </section>

      {/* ❤️ Kisan Lens को Support करें */}
      <SupportSection />

      {/* 📱 Android App Download — तीसरा section */}
      <AppDownloadSection />




      {/* AI खेती गुरु — Premium Hero Section */}
      <section
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat py-10 md:py-14"
        style={{ backgroundImage: `url(${kisanPhoneBg})` }}
      >
        {/* Dark overlay for readable text */}
        <div className="pointer-events-none absolute inset-0 bg-emerald-950/70" />
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI कृषि सहायक
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white drop-shadow md:text-5xl">
              AI <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">खेती गुरु</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-emerald-50/90 md:text-lg">
              कैमरा खोलें, सामने की फसल या पेड़ दिखाएं और AI से तुरंत पूछें।
            </p>
          </div>



          {/* दो अलग icons — दोनों इसी पेज पर काम करते हैं, कहीं जाना नहीं पड़ता */}
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">
            {/* 🎥 AI Camera Assistant */}
            <button
              type="button"
              onClick={() => setOpenAssistant(true)}
              aria-label="AI Camera Assistant खोलें"
              className="group relative flex flex-col items-center gap-3 rounded-3xl border border-emerald-300/30 bg-white/10 p-4 backdrop-blur transition-transform hover:scale-[1.03]"
            >
              <span className="relative flex h-24 w-24 items-center justify-center md:h-28 md:w-28">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/25" />
                <span className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/40 [animation:spin_12s_linear_infinite]" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-xl shadow-emerald-500/40 md:h-20 md:w-20">
                  <Video className="h-8 w-8 text-white md:h-9 md:w-9" />
                  <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-lime-300" />
                </span>
              </span>
              <span className="text-sm font-bold text-white">🎥 AI Camera Assistant</span>
              <span className="text-[11px] leading-snug text-emerald-100/80">बोलकर पूछें, AI देखकर बताए</span>
            </button>

            {/* 📷 फसल स्कैनर */}
            <button
              type="button"
              onClick={() => setOpenScanner(true)}
              aria-label="फसल स्कैनर खोलें"
              className="group relative flex flex-col items-center gap-3 rounded-3xl border border-lime-300/30 bg-white/10 p-4 backdrop-blur transition-transform hover:scale-[1.03]"
            >
              <span className="relative flex h-24 w-24 items-center justify-center md:h-28 md:w-28">
                <span className="absolute inset-0 rounded-full border border-lime-300/30" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-green-700 shadow-xl shadow-lime-500/30 md:h-20 md:w-20">
                  <ScanLine className="h-8 w-8 text-emerald-950 md:h-9 md:w-9" />
                </span>
                <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 border-l-2 border-t-2 border-lime-300/80" />
                <span className="pointer-events-none absolute right-1 top-1 h-4 w-4 border-r-2 border-t-2 border-lime-300/80" />
                <span className="pointer-events-none absolute bottom-1 left-1 h-4 w-4 border-b-2 border-l-2 border-lime-300/80" />
                <span className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 border-b-2 border-r-2 border-lime-300/80" />
              </span>
              <span className="text-sm font-bold text-white">📷 फसल स्कैनर</span>
              <span className="text-[11px] leading-snug text-emerald-100/80">फोटो से रोग की जांच</span>
            </button>
          </div>

          {/* Main CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => setOpenAssistant(true)}
              className="h-14 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 px-8 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 md:text-lg"
            >
              <Camera className="mr-2 h-6 w-6" /> 🎥 AI Camera Assistant
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/scanner" search={{ mode: "chat" }}>
                <Button variant="outline" className="h-10 rounded-xl border-emerald-300/40 bg-white/10 text-emerald-50 backdrop-blur hover:bg-white/20 hover:text-white">
                  <Mic className="mr-2 h-4 w-4" /> वॉयस से पूछें
                </Button>
              </Link>
              <Link to="/scanner" search={{ mode: "chat" }}>
                <Button variant="outline" className="h-10 rounded-xl border-emerald-300/40 bg-white/10 text-emerald-50 backdrop-blur hover:bg-white/20 hover:text-white">
                  <MessageCircle className="mr-2 h-4 w-4" /> AI चैट
                </Button>
              </Link>
            </div>
          </div>


          {/* AI क्या-क्या समझता है */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {[
              "🌾 फसल पहचान",
              "🌳 पेड़ पहचान",
              "🍎 फल/सब्जी पहचान",
              "🍃 पत्तियों की समस्या",
              "🦠 संभावित बीमारी",
              "🐛 कीट/नुकसान के संकेत",
              "💧 सिंचाई से जुड़े सवाल",
              "🌱 खाद/पोषण जानकारी",
              "💊 दवा लेबल पढ़ने में मदद",
              "📅 फसल की growth/stage",
            ].map((f) => (
              <span
                key={f}
                className="rounded-xl border border-emerald-300/25 bg-white/10 px-2.5 py-2 text-center text-[11px] font-semibold text-emerald-50 backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Voice examples */}
          <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-emerald-300/25 bg-white/10 p-4 backdrop-blur">
            <p className="text-center text-xs font-bold text-lime-200">🎙️ बोलकर ऐसे पूछिए</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {[
                "ये कौन सी फसल है?",
                "इसमें बीमारी दिखाई दे रही है?",
                "इस पेड़ पर फल क्यों नहीं लग रहे?",
                "इस पत्ते का रंग पीला क्यों है?",
                "इस दवा का इस्तेमाल कैसे करना है?",
                "इसमें कितनी मात्रा डालनी है?",
              ].map((q) => (
                <span key={q} className="rounded-full bg-emerald-900/40 px-3 py-1 text-[11px] text-emerald-50">
                  “{q}”
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-emerald-100/70">
            Gemini Vision • Voice AI • Real-time Chat • हिंदी सपोर्ट
          </p>

        </div>
      </section>

      {/* Featured Ebook — Kisan Lens */}
      <section id="ebook" className="relative overflow-hidden bg-gradient-hero py-10 md:py-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:flex-row md:items-start md:gap-10 md:p-10">
            {/* Book Cover */}
            <div className="w-full max-w-[220px] shrink-0 md:max-w-[260px]">
              <div className="group relative mx-auto w-fit">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 opacity-60 blur-2xl transition-opacity group-hover:opacity-80" />
                <img
                  src={bookCover}
                  alt="Kisan Lens: A Farmer's Son's Dream book cover"
                  width={520}
                  height={520}
                  loading="lazy"
                  className="relative z-10 w-full rounded-2xl shadow-strong transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> नई ई-बुक
              </span>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-foreground md:text-4xl">
                Kisan Lens:
                <br />
                <span className="text-primary">A Farmer's Son's Dream</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                एक किसान के बेटे की असली कहानी — जिसने AI और मेहनत से भारतीय किसानों की ज़िंदगी बदलने का सपना देखा।
                यह किताब हर उस युवा के लिए प्रेरणा है जो कृषि और टेक्नोलॉजी से भारत बदलना चाहता है।
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 dark:bg-amber-950/20">
                <p className="text-center text-base font-semibold text-amber-800 dark:text-amber-200 md:text-left md:text-lg">
                  🚀 अगर आप भी ऐसी Smart कृषि वेबसाइट/ऐप बनाना चाहते हैं, तो इस बुक को ज़रूर खरीदें!
                </p>
                <p className="mt-1 text-center text-sm text-amber-700/80 dark:text-amber-300/80 md:text-left">
                  इसमें AI + कृषि + डिजिटल इंडिया की पूरी यात्रा सीखें।
                </p>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl bg-gradient-primary px-6 text-base font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] sm:w-auto"
                  asChild
                >
                  <a href={PLAY_BOOKS_URL} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-xl border-primary/30 px-6 text-base font-semibold text-primary hover:bg-primary/5 sm:w-auto"
                  asChild
                >
                  <Link to="/ebook">
                    <BookOpen className="mr-2 h-5 w-5" /> ई-बुक पेज देखें
                  </Link>
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex shrink-0 flex-col items-center rounded-2xl border border-border bg-background p-5 shadow-soft md:w-fit">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <QrCode className="h-4 w-4 text-primary" />
                <span>QR कोड से खोलें</span>
              </div>
              <img
                src={bookQr}
                alt="QR code to open Kisan Lens book on Google Play Books"
                width={200}
                height={200}
                loading="lazy"
                className="h-36 w-36 rounded-xl border border-border bg-white p-2 md:h-40 md:w-40"
              />
              <p className="mt-3 max-w-[180px] text-center text-xs text-muted-foreground">
                स्कैन करें और सीधे Google Play Books पर खरीदें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ताज़ा कृषि खबरें — हर घंटे अपडेट */}
      <LiveKisanNews />

      {/* इसी पेज पर खुलने वाले tools */}
      {openAssistant && <LiveAiAssistant onClose={() => setOpenAssistant(false)} />}
      {openScanner && <QuickScanModal onClose={() => setOpenScanner(false)} />}
    </PageShell>

  );
}
