import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Eye, Mic, Sparkles, ShieldCheck, Leaf } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveAiAssistant } from "@/components/LiveAiAssistant";

export const Route = createFileRoute("/ai-camera")({
  component: AiCameraPage,
  head: () => ({
    meta: [
      { title: "Kisan Lens Smart Eye 👁️ — बोलकर पूछें, Kisan Lens देखकर बताए" },
      {
        name: "description",
        content:
          "Kisan Lens का Kisan Lens Smart Eye 👁️ — कैमरा खोलिए और हिंदी में बोलकर पूछिए: यह कौन सी फसल है, बीमारी है क्या, पानी कब दें, दवा की कितनी मात्रा डालें।",
      },
      { property: "og:title", content: "Kisan Lens Smart Eye 👁️ — Kisan Lens" },
      {
        property: "og:description",
        content: "कैमरा + आवाज़ से खेती के सवालों के तुरंत हिंदी जवाब।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/ai-camera" }],
  }),
});

const EXAMPLES = [
  "यह कौन सी फसल है?",
  "इसमें कोई बीमारी दिखाई दे रही है?",
  "इसमें सिंचाई करनी चाहिए?",
  "इस पेड़ पर फल क्यों नहीं लग रहे?",
  "इस पत्ते का रंग पीला क्यों है?",
  "इस दवा की कितनी मात्रा डालनी है?",
];

function AiCameraPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <Sparkles className="h-4 w-4" /> नया फीचर
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
          Kisan Lens Smart Eye 👁️
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          कैमरा खोलिए और बस बोलिए। AI सामने दिख रही फसल, पत्ती, पेड़, फल, सब्ज़ी, कृषि यंत्र या दवा की
          बोतल को देखकर हिंदी आवाज़ में जवाब देगा — टाइप करने की ज़रूरत नहीं।
        </p>

        <Button size="lg" className="mt-5 w-full rounded-full bg-gradient-primary" onClick={() => setOpen(true)}>
          <Camera className="mr-2 h-5 w-5" /> AI Camera Assistant खोलें
        </Button>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-0 p-4 shadow-soft">
            <Eye className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-bold">लगातार देखता है</p>
            <p className="text-xs text-muted-foreground">
              दृश्य बदलने पर ही AI विश्लेषण करता है — data और battery की बचत।
            </p>
          </Card>
          <Card className="border-0 p-4 shadow-soft">
            <Mic className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-bold">आवाज़ से बातचीत</p>
            <p className="text-xs text-muted-foreground">
              हिंदी/Hinglish में सवाल पूछें, पिछली बातचीत याद रहती है।
            </p>
          </Card>
          <Card className="border-0 p-4 shadow-soft">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-bold">ईमानदार सलाह</p>
            <p className="text-xs text-muted-foreground">
              अंदाज़े से बीमारी या दवा की मात्रा नहीं बताता — label देखकर बताता है।
            </p>
          </Card>
        </div>

        <h2 className="mt-8 text-lg font-bold text-foreground">कैमरे के सामने ये सवाल पूछ सकते हैं</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {EXAMPLES.map((q) => (
            <li key={q} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm text-foreground">
              🎙️ {q}
            </li>
          ))}
        </ul>

        <Card className="mt-8 border-0 bg-secondary/50 p-4 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Leaf className="h-4 w-4 text-primary" /> पूरी रिपोर्ट चाहिए?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            कैमरे में “विस्तृत जांच” दबाइए, या फसल स्कैनर से फोटो की गहरी जांच कराइए।
          </p>
          <Button variant="outline" className="mt-3" onClick={() => navigate({ to: "/scanner" })}>
            फसल स्कैनर खोलें
          </Button>
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
