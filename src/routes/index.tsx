import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { LiveKisanNews } from "@/components/LiveKisanNews";
import { Button } from "@/components/ui/button";
import kisanPhoneBg from "@/assets/kisan-phone-bg.jpg";
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
  return (
    <PageShell>
      {/* Kisan Lens Smart Eye — Premium Hero Section */}
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
              👁️ Kisan Lens Smart Eye
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white drop-shadow md:text-5xl">
              Kisan Lens <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">Smart Eye</span> 👁️
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-emerald-50/90 md:text-lg">
              कैमरा खोलें, सामने की फसल या पेड़ दिखाएं और AI से तुरंत पूछें।
            </p>
          </div>


          {/* Animated AI Camera Logo — clickable */}
          <Link
            to="/scanner"
            search={{ mode: "live" }}
            aria-label="लाइव कैमरा शुरू करें"
            className="group relative mx-auto mt-8 flex h-48 w-48 items-center justify-center md:h-56 md:w-56"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <span className="absolute inset-4 animate-pulse rounded-full bg-emerald-300/20 blur-2xl" />
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/40 [animation:spin_12s_linear_infinite]" />
            <span className="absolute inset-3 rounded-full border border-lime-300/30" />

            {/* Camera body */}
            <div className="relative flex h-28 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-800 shadow-2xl shadow-emerald-500/40 transition-transform group-hover:scale-105 md:h-32 md:w-36">
              <div className="absolute -top-3 left-1/2 h-4 w-16 -translate-x-1/2 rounded-t-xl bg-emerald-700" />
              <div className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-lime-300 shadow-[0_0_8px_2px_rgba(190,242,100,0.8)]" />
              <div className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_6px_2px_rgba(248,113,113,0.7)]" />

              {/* Lens */}
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 via-white to-emerald-200 ring-4 ring-emerald-900/40 md:h-24 md:w-24">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-950" />
                {/* Scanning sweep line */}
                <span className="absolute inset-x-0 top-0 h-px bg-lime-300/80 shadow-[0_0_8px_2px_rgba(190,242,100,0.7)] [animation:lens-scan_2.2s_ease-in-out_infinite]" />
                {/* Plant icons inside the lens */}
                <Sprout className="absolute h-5 w-5 -translate-x-4 -translate-y-1 text-lime-300 drop-shadow md:h-6 md:w-6" />
                <TreePine className="absolute h-6 w-6 translate-x-3 -translate-y-2 text-emerald-200 drop-shadow md:h-7 md:w-7" />
                <Leaf className="absolute h-4 w-4 translate-y-4 text-emerald-300 drop-shadow md:h-5 md:w-5" />
                <span className="absolute left-3 top-3 h-3 w-3 rounded-full bg-white/70 blur-[1px]" />
              </div>
            </div>

            {/* AI scanner corner brackets */}
            <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-lime-300/80" />
            <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-lime-300/80" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-lime-300/80" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-lime-300/80" />
          </Link>

          {/* Main CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to="/ai-camera">
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 px-8 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 md:text-lg"
              >
                <Camera className="mr-2 h-6 w-6" /> 🎥 AI Camera Assistant
              </Button>
            </Link>
            <Link to="/scanner" search={{ mode: "live" }} className="text-xs font-semibold text-emerald-100/90 underline">
              📷 फसल स्कैनर (लाइव कैमरा)
            </Link>

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
    </PageShell>
  );
}
