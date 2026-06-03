import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/data/articles";

export const Route = createFileRoute("/market-prices")({
  component: MarketPricesPage,
  head: () => ({
    meta: [
      { title: "मंडी भाव — MSP और बाज़ार दरें | किसान मित्र" },
      { name: "description", content: "गेहूं, धान, सरसों, प्याज, टमाटर के मंडी भाव, MSP, eNAM और राज्यवार APMC रेट कैसे चेक करें।" },
      { property: "og:title", content: "मंडी भाव और MSP | किसान मित्र" },
      { property: "og:description", content: "बाज़ार रेट चेक करने की पूरी जानकारी।" },
      { property: "og:url", content: "https://kisanlens.com/market-prices" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/market-prices" }],
  }),
});

const PRICE_LINKS = [
  { name: "eNAM (राष्ट्रीय कृषि बाज़ार)", url: "https://enam.gov.in", desc: "ऑनलाइन ट्रेडिंग और लाइव मंडी भाव" },
  { name: "Agmarknet", url: "https://agmarknet.gov.in", desc: "देश की सभी प्रमुख मंडियों के दैनिक भाव" },
  { name: "MSP — कृषि मंत्रालय", url: "https://farmer.gov.in", desc: "सरकार द्वारा घोषित न्यूनतम समर्थन मूल्य" },
  { name: "UPAg डैशबोर्ड", url: "https://upag.gov.in", desc: "केंद्रीय कृषि डेटा प्लेटफॉर्म" },
];

function MarketPricesPage() {
  const related = ARTICLES.filter((a) => a.category === "मंडी भाव" || a.category === "कृषि योजनाएं");

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: "मंडी भाव" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">मंडी भाव और MSP</h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
          फसल का सही दाम पाने के लिए ज़रूरी है कि आप मंडी भाव, MSP और बाज़ार की चाल समझें। यहां
          सरकारी पोर्टल्स, MSP जानकारी और लेख।
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PRICE_LINKS.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
              <Card className="border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold text-foreground">{l.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            </a>
          ))}
        </div>

        <div className="prose-content mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl font-bold">MSP क्या है?</h2>
          <p>
            न्यूनतम समर्थन मूल्य (MSP) वह दर है जिस पर सरकार किसानों से सीधे फसल खरीदती है। यह
            किसानों को बाज़ार की अनिश्चितता से बचाता है। हर साल कृषि लागत और मूल्य आयोग (CACP) की
            सिफारिश पर 22+ फसलों के MSP घोषित होते हैं।
          </p>
          <h2 className="text-2xl font-bold">सही समय पर बेचें</h2>
          <p>
            कटाई के तुरंत बाद मंडी में फसलों की भरमार होती है, इसलिए दाम कम मिलते हैं। यदि भंडारण
            की सुविधा है तो वेयरहाउस रसीद के माध्यम से 70% तक राशि अग्रिम लेकर बाद में बेच सकते हैं।
            FPO (किसान उत्पादक संगठन) से जुड़कर बेहतर दाम मिल सकते हैं।
          </p>
          <h2 className="text-2xl font-bold">eNAM से व्यापार</h2>
          <p>
            eNAM पोर्टल पर रजिस्टर करके आप देश भर के खरीदारों से सीधे जुड़ सकते हैं — बिना बिचौलियों
            के। 1000+ मंडियां इस प्लेटफॉर्म से जुड़ी हैं।
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-bold">संबंधित लेख</h2>
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

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/scanner">
            <Button className="rounded-xl bg-gradient-primary">
              <TrendingUp className="mr-1.5 h-4 w-4" /> AI से कृषि सलाह
            </Button>
          </Link>
          <Link to="/blog">
            <Button variant="outline" className="rounded-xl">सभी लेख</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
