import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/beej-store")({
  component: BeejStorePage,
  head: () => ({
    meta: [
      { title: "बीज स्टोर — प्रमुख फसलों के उन्नत बीज | किसान मित्र" },
      {
        name: "description",
        content:
          "गेहूं, धान, मक्का, सरसों और सोयाबीन की प्रमुख उन्नत बीज किस्मों की जानकारी, विशेषताएँ और उपज क्षमता — हिंदी में।",
      },
      { property: "og:title", content: "बीज स्टोर — उन्नत बीज किस्में" },
      {
        property: "og:description",
        content: "भारत की 5 मुख्य फसलों के लिए प्रमाणित उन्नत बीजों की पूरी जानकारी।",
      },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/beej-store" }],
  }),
});

const SEEDS = [
  {
    crop: "गेहूं (Wheat)",
    varieties: [
      "HD-2967 — समय पर बुवाई, सिंचित क्षेत्र, उपज 50-55 क्विंटल/हेक्टेयर",
      "HD-3086 (पूसा गौतमी) — रतुआ रोग प्रतिरोधी, उच्च प्रोटीन",
      "DBW-187 (करण वंदना) — गर्मी सहनशील, जल्दी पकने वाली किस्म",
    ],
    tip: "बीज दर: 100-125 किग्रा/हेक्टेयर। बुवाई से पहले फफूंदनाशक से बीज उपचार करें।",
  },
  {
    crop: "धान (Paddy)",
    varieties: [
      "पूसा बासमती-1121 — सुगंधित, निर्यात गुणवत्ता, लंबे दाने",
      "स्वर्णा (MTU-7029) — मध्यम अवधि, उच्च उपज क्षमता",
      "PR-126 — कम अवधि (125 दिन), पानी की बचत",
    ],
    tip: "नर्सरी में 20-25 दिन पुराने पौधे रोपाई के लिए सर्वोत्तम।",
  },
  {
    crop: "मक्का (Maize)",
    varieties: [
      "DHM-117 — संकर किस्म, उपज 70-80 क्विंटल/हेक्टेयर",
      "विवेक QPM-9 — प्रोटीन समृद्ध, पोषण मूल्य अधिक",
      "गंगा-5 — खरीफ व रबी दोनों में उपयुक्त",
    ],
    tip: "बीज दर: 20-25 किग्रा/हेक्टेयर। कतार से कतार 60 सेमी की दूरी रखें।",
  },
  {
    crop: "सरसों (Mustard)",
    varieties: [
      "पूसा बोल्ड — बड़े दाने, तेल मात्रा 38-40%",
      "RH-749 — रोग प्रतिरोधी, उपज 22-25 क्विंटल/हेक्टेयर",
      "गिरीराज — सूखा सहनशील, बारानी क्षेत्र के लिए उत्तम",
    ],
    tip: "बुवाई का सही समय: 15 अक्टूबर से 5 नवंबर। बीज दर: 4-5 किग्रा/हेक्टेयर।",
  },
  {
    crop: "सोयाबीन (Soybean)",
    varieties: [
      "JS-9560 — जल्दी पकने वाली (85-90 दिन), उच्च उपज",
      "NRC-86 — पीला मोज़ेक वायरस प्रतिरोधी",
      "JS-2034 — मध्य प्रदेश व महाराष्ट्र के लिए उपयुक्त",
    ],
    tip: "बीज दर: 75-80 किग्रा/हेक्टेयर। राइजोबियम कल्चर से बीज उपचार जरूरी।",
  },
];

function BeejStorePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> होम पर वापस जाएं
          </Button>
        </Link>

        <div className="mb-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">बीज स्टोर — उन्नत बीज जानकारी</h1>
          <p className="mt-2 text-base text-muted-foreground">
            अच्छी पैदावार की शुरुआत अच्छे बीज से होती है। यहाँ भारत की 5 मुख्य फसलों की प्रमाणित उन्नत
            बीज किस्मों की जानकारी दी गई है।
          </p>
        </div>

        <div className="space-y-5">
          {SEEDS.map((s) => (
            <Card key={s.crop} className="border border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground">{s.crop}</h2>
              <ul className="mt-3 space-y-2">
                {s.varieties.map((v) => (
                  <li key={v} className="flex gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                <strong>सुझाव:</strong> {s.tip}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border border-border bg-amber-50 p-5 text-sm text-amber-900">
          <strong>नोट:</strong> बीज खरीदते समय हमेशा प्रमाणित डीलर या नज़दीकी कृषि विज्ञान केंद्र (KVK)
          से ही खरीदें। बीज पर लगा प्रमाणन टैग (Certified Tag) अवश्य जांचें।
        </Card>
      </section>
    </PageShell>
  );
}
