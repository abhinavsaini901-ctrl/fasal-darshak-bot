import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  MessageCircle,
  Sprout,
  Mic,
  Leaf,
  TreePine,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { LiveKisanNews } from "@/components/LiveKisanNews";
import { Button } from "@/components/ui/button";
import pmPhoneBg from "@/assets/pm-phone-bg.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "किसान मित्र — AI फसल डॉक्टर, मंडी भाव और कृषि योजनाएं" },
      {
        name: "description",
        content:
          "भारतीय किसानों के लिए AI-संचालित कृषि पोर्टल। फसल स्कैन, रोग पहचान, मंडी भाव, सरकारी योजनाएं और कृषि लेख — सब हिंदी में।",
      },
      { property: "og:title", content: "किसान मित्र — AI कृषि पोर्टल" },
      { property: "og:description", content: "फसल स्कैन, मंडी भाव, योजनाएं — एक ही जगह।" },
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
    ],
  }),
});

function HomePage() {
  return (
    <PageShell>
      {/* AI खेती गुरु — Premium Hero Section */}
      <section
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat py-10 md:py-14"
        style={{ backgroundImage: `url(${pmPhoneBg})` }}
      >
        {/* Dark overlay for readable text */}
        <div className="pointer-events-none absolute inset-0 bg-emerald-950/70" />
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
              🌾 AI खेती गुरु
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white drop-shadow md:text-5xl">
              AI <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">खेती गुरु</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-emerald-50/90 md:text-lg">
              कैमरा खोलें, फसल, पेड़, पौधा या फल दिखाएं और AI से तुरंत जानकारी प्राप्त करें
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
            <Link to="/scanner" search={{ mode: "live" }}>
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 px-8 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 md:text-lg"
              >
                <Camera className="mr-2 h-6 w-6" /> 📷 लाइव कैमरा शुरू करें
              </Button>
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

      {/* ताज़ा कृषि खबरें — हर घंटे अपडेट */}
      <LiveKisanNews />
    </PageShell>
  );
}
