import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Landmark } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/data/articles";

export const Route = createFileRoute("/government-schemes")({
  component: GovSchemesPage,
  head: () => ({
    meta: [
      { title: "सरकारी कृषि योजनाएं 2026 — PM-KISAN, PMFBY, KCC | किसान मित्र" },
      { name: "description", content: "PM-KISAN, PMFBY फसल बीमा, किसान क्रेडिट कार्ड, PMKSY, PM कुसुम, मृदा स्वास्थ्य कार्ड — सरकारी योजनाओं की पूरी जानकारी।" },
      { property: "og:title", content: "कृषि सरकारी योजनाएं | किसान मित्र" },
      { property: "og:description", content: "किसानों के लिए सब्सिडी और लाभ।" },
      { property: "og:url", content: "https://kisanlens.com/government-schemes" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/government-schemes" }],
  }),
});

const SCHEMES = [
  { name: "PM-KISAN", benefit: "₹6,000/वर्ष सीधे बैंक खाते में", who: "सभी छोटे/सीमांत किसान", url: "https://pmkisan.gov.in" },
  { name: "PMFBY (फसल बीमा)", benefit: "प्राकृतिक आपदा से बीमा सुरक्षा", who: "खरीफ/रबी फसल बोने वाले", url: "https://pmfby.gov.in" },
  { name: "किसान क्रेडिट कार्ड (KCC)", benefit: "4% ब्याज पर खेती के लिए लोन", who: "खेती करने वाले किसान", url: "https://www.myscheme.gov.in" },
  { name: "मृदा स्वास्थ्य कार्ड", benefit: "मुफ्त मिट्टी जांच और रिपोर्ट", who: "सभी किसान", url: "https://soilhealth.dac.gov.in" },
  { name: "PMKSY (सिंचाई)", benefit: "ड्रिप/स्प्रिंकलर पर 80-90% सब्सिडी", who: "सीमांत/लघु किसान", url: "https://pmksy.gov.in" },
  { name: "PM कुसुम", benefit: "सोलर पंप पर 60% सब्सिडी", who: "खेती करने वाले किसान", url: "https://mnre.gov.in" },
  { name: "e-NAM", benefit: "ऑनलाइन फसल बिक्री प्लेटफॉर्म", who: "सभी किसान/FPO", url: "https://enam.gov.in" },
  { name: "PM-FME (खाद्य प्रसंस्करण)", benefit: "खाद्य प्रसंस्करण उद्योग पर 35% सब्सिडी", who: "FPO/SHG/किसान", url: "https://pmfme.mofpi.gov.in" },
];

function GovSchemesPage() {
  const related = ARTICLES.filter((a) => a.category === "कृषि योजनाएं");

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: "सरकारी योजनाएं" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">सरकारी कृषि योजनाएं 2026</h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
          भारत सरकार किसानों के लिए अनेक योजनाएं चलाती है — सीधा पैसा, सब्सिडी, बीमा, सस्ता ऋण, और
          आधुनिक तकनीक तक पहुंच। यहां प्रमुख योजनाओं की जानकारी।
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">योजना</th>
                <th className="px-4 py-3">लाभ</th>
                <th className="px-4 py-3 hidden md:table-cell">पात्रता</th>
                <th className="px-4 py-3">आवेदन</th>
              </tr>
            </thead>
            <tbody>
              {SCHEMES.map((s) => (
                <tr key={s.name} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.benefit}</td>
                  <td className="px-4 py-3 hidden text-muted-foreground md:table-cell">{s.who}</td>
                  <td className="px-4 py-3">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      लिंक <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-content mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl font-bold">आवेदन कैसे करें</h2>
          <p>
            अधिकांश योजनाओं के लिए आधार कार्ड, बैंक खाता, ज़मीन के कागज़ और मोबाइल नंबर ज़रूरी हैं।
            नज़दीकी CSC (कॉमन सर्विस सेंटर), कृषि कार्यालय, या ऑनलाइन पोर्टल से आवेदन कर सकते हैं।
          </p>
          <h2 className="text-2xl font-bold">कौन-सी योजना आपके लिए?</h2>
          <p>
            हर किसान को PM-KISAN, मृदा स्वास्थ्य कार्ड और KCC के लिए ज़रूर आवेदन करना चाहिए। सिंचाई
            के लिए PMKSY, बिजली के लिए PM कुसुम, और फसल सुरक्षा के लिए PMFBY बेहद उपयोगी हैं।
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-bold">योजना से जुड़े विस्तृत लेख</h2>
        {related.length === 0 ? (
          <Card className="mt-5 border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            जल्द ही विस्तृत लेख आ रहे हैं।
          </Card>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link to="/scanner">
            <Button className="rounded-xl bg-gradient-primary">
              <Landmark className="mr-1.5 h-4 w-4" /> AI से कृषि सलाह लें
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
