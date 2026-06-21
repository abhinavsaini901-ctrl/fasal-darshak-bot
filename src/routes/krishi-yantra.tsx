import { createFileRoute, Link } from "@tanstack/react-router";
import { Tractor, Wrench, Cog, Zap, Droplets, Wheat, Sprout, Scissors } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/krishi-yantra")({
  component: KrishiYantraPage,
  head: () => ({
    meta: [
      { title: "कृषि यंत्र — मुख्य कृषि उपकरण, उपयोग और फायदे | किसान मित्र" },
      {
        name: "description",
        content:
          "भारत में इस्तेमाल होने वाले मुख्य कृषि यंत्रों (ट्रैक्टर, रोटावेटर, कल्टीवेटर, पावर टिलर, थ्रेशर, पंप, सीड ड्रिल, स्प्रेयर) की विस्तृत जानकारी, उनके काम और किसानों के लिए फायदे।",
      },
      { property: "og:title", content: "कृषि यंत्र — मुख्य उपकरण और फायदे | किसान मित्र" },
      {
        property: "og:description",
        content: "भारत के 8 मुख्य कृषि यंत्र, उनके उपयोग और किसानों के लिए लाभ।",
      },
      { property: "og:url", content: "https://kisanlens.com/krishi-yantra" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/krishi-yantra" }],
  }),
});

const YANTRAS = [
  {
    name: "ट्रैक्टर",
    icon: Tractor,
    color: "text-emerald-700 bg-emerald-50",
    use: "जुताई, ढुलाई, बुवाई, सिंचाई और अन्य कृषि उपकरण चलाने के लिए मुख्य शक्ति स्रोत।",
    benefits: [
      "बैलों की तुलना में 10–15 गुना तेज़ काम।",
      "एक ही मशीन से हल, रोटावेटर, थ्रेशर आदि चलाए जा सकते हैं।",
      "श्रम लागत और समय दोनों की बचत।",
    ],
  },
  {
    name: "रोटावेटर",
    icon: Cog,
    color: "text-amber-700 bg-amber-50",
    use: "मिट्टी को बारीक करके बुवाई के लिए तैयार करना। पुरानी फसल के अवशेषों को मिट्टी में मिलाने में भी उपयोगी।",
    benefits: [
      "एक ही बार में जुताई और भुरभुरीकरण।",
      "डीजल और समय की 30–40% तक बचत।",
      "मिट्टी की उर्वरा शक्ति बढ़ती है।",
    ],
  },
  {
    name: "कल्टीवेटर",
    icon: Wrench,
    color: "text-indigo-700 bg-indigo-50",
    use: "खेत की द्वितीयक जुताई, खरपतवार निकालना और मिट्टी को हवा देना।",
    benefits: [
      "खरपतवार नियंत्रण में सहायक।",
      "मिट्टी की नमी बनी रहती है।",
      "बीज बुवाई से पहले अच्छी तैयारी।",
    ],
  },
  {
    name: "पावर टिलर",
    icon: Zap,
    color: "text-rose-700 bg-rose-50",
    use: "छोटे और मध्यम खेतों, बागवानी, सब्जी की क्यारियों और पहाड़ी क्षेत्रों में जुताई।",
    benefits: [
      "छोटे किसानों के लिए किफायती विकल्प।",
      "कम जगह में आसानी से चलता है।",
      "पंप, स्प्रेयर और थ्रेशर भी चला सकता है।",
    ],
  },
  {
    name: "थ्रेशर",
    icon: Wheat,
    color: "text-yellow-700 bg-yellow-50",
    use: "गेहूँ, धान, मक्का, ज्वार, बाजरा आदि फसलों से अनाज को भूसे से अलग करना।",
    benefits: [
      "हाथ से मड़ाई की तुलना में बहुत तेज़।",
      "अनाज का नुकसान कम होता है।",
      "साफ और बाज़ार के लिए तैयार उपज मिलती है।",
    ],
  },
  {
    name: "सिंचाई पंप",
    icon: Droplets,
    color: "text-sky-700 bg-sky-50",
    use: "कुएँ, तालाब, नहर या बोरवेल से खेत तक पानी पहुँचाने के लिए — डीजल, बिजली या सोलर पंप।",
    benefits: [
      "सूखे क्षेत्रों में भी समय पर सिंचाई।",
      "सोलर पंप से बिजली का खर्च शून्य।",
      "उपज में 25–40% तक वृद्धि।",
    ],
  },
  {
    name: "सीड ड्रिल (बुवाई मशीन)",
    icon: Sprout,
    color: "text-lime-700 bg-lime-50",
    use: "एक समान दूरी और गहराई पर बीज और खाद की एक साथ बुवाई।",
    benefits: [
      "बीज की 20–25% तक बचत।",
      "अंकुरण एक समान होता है।",
      "उत्पादन में बढ़ोतरी।",
    ],
  },
  {
    name: "स्प्रेयर",
    icon: Scissors,
    color: "text-fuchsia-700 bg-fuchsia-50",
    use: "कीटनाशक, फफूंदनाशक, खरपतवारनाशी और तरल खाद का छिड़काव — हैंड, बैटरी या पावर स्प्रेयर।",
    benefits: [
      "कम दवा में अधिक क्षेत्र कवर।",
      "एक समान छिड़काव से बेहतर रोग नियंत्रण।",
      "किसान का समय और मेहनत बचती है।",
    ],
  },
];

function KrishiYantraPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Breadcrumbs items={[{ label: "होम", href: "/" }, { label: "कृषि यंत्र" }]} />

        <header className="mt-4">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">कृषि यंत्र</h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            आधुनिक खेती में कृषि यंत्रों का बहुत बड़ा योगदान है। सही यंत्र चुनने से समय, श्रम और लागत
            तीनों की बचत होती है तथा उपज भी बढ़ती है। नीचे भारत में सबसे ज़्यादा उपयोग होने वाले
            मुख्य कृषि यंत्रों की जानकारी दी गई है।
          </p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {YANTRAS.map((y) => (
            <Card
              key={y.name}
              className="rounded-2xl border border-border bg-gradient-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-strong"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${y.color}`}
                >
                  <y.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{y.name}</h2>
              </div>
              <p className="mt-3 text-sm text-foreground/80">
                <span className="font-semibold">उपयोग: </span>
                {y.use}
              </p>
              <div className="mt-3">
                <p className="text-sm font-semibold text-foreground">किसानों के लिए फायदे:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {y.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground">सही कृषि यंत्र कैसे चुनें?</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
            <li>अपने खेत के आकार और फसल के अनुसार यंत्र चुनें।</li>
            <li>छोटे किसान किराए पर यंत्र लेकर भी लाभ ले सकते हैं (Custom Hiring Centre)।</li>
            <li>सरकारी सब्सिडी (SMAM योजना) का लाभ अवश्य उठाएँ — 40% से 80% तक छूट मिलती है।</li>
            <li>यंत्र की नियमित सर्विसिंग करें ताकि वह लंबे समय तक चले।</li>
          </ul>
          <div className="mt-5">
            <Link
              to="/government-schemes"
              className="inline-flex items-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
            >
              सरकारी योजनाएँ देखें
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
