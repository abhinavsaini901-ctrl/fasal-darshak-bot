import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Eye, Mic, Volume2, MessageSquare, Search, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveAiAssistant } from "@/components/LiveAiAssistant";

export const Route = createFileRoute("/smart-eye")({
  component: SmartEyePage,
  head: () => ({
    meta: [
      { title: "Kisan Lens Smart Eye 👁️ — कैमरा दिखाएं, बोलकर पूछें" },
      {
        name: "description",
        content:
          "Kisan Lens Smart Eye 👁️ — कैमरा खोलें और सामने की फसल, पेड़, पत्ती, फल या दवा की बोतल के बारे में हिंदी में बोलकर पूछें। AI voice + text में जवाब देता है।",
      },
      { property: "og:title", content: "Kisan Lens Smart Eye 👁️" },
      {
        property: "og:description",
        content: "कैमरा दिखाएं और AI से खेती के बारे में बोलकर पूछें — हिंदी voice जवाब।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/smart-eye" }],
  }),
});

const FEATURES = [
  { icon: Camera, title: "📷 Live Camera", text: "पीछे वाला कैमरा खुलता है और AI लगातार सामने का दृश्य देखता है।" },
  { icon: Mic, title: "🎙️ बोलकर पूछें", text: "टाइप करने की ज़रूरत नहीं — हिंदी/Hinglish में सवाल बोलिए।" },
  { icon: Volume2, title: "🔊 AI Voice Answer", text: "जवाब आवाज़ में सुनाई देता है, पढ़ना ज़रूरी नहीं।" },
  { icon: MessageSquare, title: "💬 Text Answer", text: "हर जवाब screen पर text में भी दिखता है।" },
  { icon: Search, title: "🔍 Detailed Analysis", text: "गहरी जांच चाहिए तो एक tap में विस्तृत रिपोर्ट।" },
  { icon: ShieldCheck, title: "🛡️ ईमानदार सलाह", text: "बीमारी या dosage अनुमान से नहीं बताता — label देखकर बताता है।" },
];

const EXAMPLES = [
  "ये कौन सी फसल है?",
  "इसमें बीमारी है क्या?",
  "इस पत्ते में क्या समस्या है?",
  "इस पेड़ पर फल क्यों नहीं लग रहे?",
  "इसमें पानी देना चाहिए या नहीं?",
  "ये कौन सी दवाई है?",
  "इस दवाई की कितनी मात्रा डालनी है?",
  "इस फसल में सिंचाई कब करनी चाहिए?",
];

function SmartEyePage() {
  const [open, setOpen] = useState(false);

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 to-emerald-900 px-4 py-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
            <Eye className="h-3.5 w-3.5" /> नया फीचर
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            Kisan Lens Smart Eye 👁️
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
            कैमरा खोलें और सामने की फसल, पेड़ या पौधे के बारे में AI से बोलकर पूछें।
          </p>

          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="mt-6 h-14 w-full rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30 sm:w-auto sm:px-10"
          >
            <Camera className="mr-2 h-5 w-5" /> 👁️ Smart Eye शुरू करें
          </Button>
          <p className="mt-2 text-[11px] text-emerald-100/70">कैमरा और माइक की अनुमति दें — कुछ भी upload नहीं होता, सिर्फ जांच के लिए भेजा जाता है।</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-lg font-bold text-foreground">Smart Eye में क्या-क्या है</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-0 p-4 shadow-soft">
              <f.icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold text-foreground">{f.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
            </Card>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-bold text-foreground">कैमरे के सामने ऐसे सवाल पूछें</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {EXAMPLES.map((q) => (
            <li key={q} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm text-foreground">
              🎙️ {q}
            </li>
          ))}
        </ul>

        <Card className="mt-8 border-0 bg-secondary/50 p-4 shadow-soft">
          <p className="text-sm font-bold text-foreground">बातचीत जारी रहती है</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            आप “ये कौन सी फसल है?” पूछें और फिर “इसमें बीमारी है?” — Smart Eye समझ जाता है कि आप उसी दिखाई
            गई फसल के बारे में पूछ रहे हैं।
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => setOpen(true)} className="rounded-full bg-gradient-primary">
              👁️ Smart Eye खोलें
            </Button>
            <Link to="/scanner" search={{ mode: "live" }}>
              <Button variant="outline" className="rounded-full">📷 फसल स्कैनर</Button>
            </Link>
          </div>
        </Card>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          सूचना: AI की सलाह केवल मार्गदर्शन के लिए है। किसी भी दवा/खाद के उपयोग से पहले product label और
          स्थानीय कृषि विशेषज्ञ की सलाह अवश्य लें।
        </p>
      </section>

      {open && <LiveAiAssistant onClose={() => setOpen(false)} />}
    </PageShell>
  );
}
