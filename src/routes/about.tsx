import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  ShieldCheck,
  Users,
  BookOpen,
  Sparkles,
  Target,
  Microscope,
  Heart,
  CheckCircle2,
  Award,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AUTHORS } from "@/data/authors";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "KisanLens के बारे में — AI फसल रोग पहचान और कृषि सलाह मंच" },
      {
        name: "description",
        content:
          "KisanLens (किसान मित्र) एक AI-संचालित मंच है जो किसानों को पत्ती की फोटो से फसल रोग-कीट की तुरंत पहचान और सरल हिंदी में विशेषज्ञ कृषि सलाह देता है — मुफ्त, मोबाइल पर।",
      },
      { property: "og:title", content: "KisanLens के बारे में — फसल रोग पहचान और सलाह" },
      { property: "og:description", content: "AI से फसल रोग पहचान और विशेषज्ञ कृषि सलाह — हिंदी में, हर किसान के लिए।" },
      { property: "og:url", content: "https://kisanlens.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/about" }],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "किसान मित्र",
          alternateName: "KisanLens",
          url: "https://kisanlens.com",
          logo: "https://kisanlens.com/favicon.ico",
          description:
            "भारतीय किसानों के लिए AI-संचालित बहुभाषी कृषि ज्ञान मंच — फसल रोग पहचान, मंडी भाव, सरकारी योजनाएँ और विशेषज्ञ हिंदी लेख।",
          foundingDate: "2024",
          areaServed: "IN",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "support@kisanlens.com",
            availableLanguage: ["Hindi", "English"],
          },
        }),
      },
    ],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs items={[{ label: "हमारे बारे में" }]} />

        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Heart className="h-3 w-3" /> किसानों के लिए, किसानों के साथ
        </span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          KisanLens के बारे में — फसल रोग पहचान और कृषि सलाह, अब हर किसान की जेब में
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
          <strong>KisanLens (किसान मित्र)</strong> एक AI-संचालित मंच है जिसे भारत के छोटे और
          सीमांत किसानों के लिए बनाया गया है। हमारा काम बहुत सीधा है — किसान अपने खेत से
          पत्ती, फल या तने की एक फोटो खींचकर हमें भेजे, और हम कुछ ही सेकंड में बताएँ कि
          फसल में कौन-सा <strong>रोग या कीट</strong> लगा है, वह कितना गंभीर है, और उसका
          <strong> सुरक्षित, वैज्ञानिक इलाज</strong> हिंदी में क्या है। साथ ही बुवाई, सिंचाई,
          खाद, मंडी भाव और सरकारी योजनाओं पर विशेषज्ञ सलाह भी — एक ही जगह, बिल्कुल मुफ्त।
        </p>

        {/* Mission */}
        <Card className="mt-8 border border-border bg-gradient-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">हमारा मिशन</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            भारत में हर साल फसल रोग और कीटों से लगभग 20–30% तक उपज का नुकसान होता है — और
            इसका सबसे बड़ा कारण है <strong>समय पर सही पहचान न हो पाना</strong>। KisanLens का
            मिशन इसी अंतर को AI से पाटना है। हम चाहते हैं कि हर किसान के पास एक ऐसा
            "पॉकेट कृषि डॉक्टर" हो जो उसकी अपनी भाषा में बात करे, तस्वीर देखकर बीमारी
            पहचाने, सुरक्षित इलाज बताए, ज़रूरत से ज़्यादा दवा-खाद के खर्च से बचाए और
            आधुनिक खेती, मंडी और सरकारी योजनाओं की भरोसेमंद जानकारी दे — <em>वो भी हमेशा
            मुफ्त</em>।
          </p>
        </Card>


        {/* Why we exist */}
        <h2 className="mt-12 text-2xl font-bold">हम क्यों मायने रखते हैं</h2>
        <p className="mt-3 text-base text-foreground/90">
          अधिकांश कृषि ज्ञान आज भी अंग्रेज़ी PDF, शोध पत्रों या तकनीकी पुस्तिकाओं में बंद है।
          छोटे किसानों के पास न इन्हें पढ़ने का समय है, न संदर्भ। दूसरी ओर, WhatsApp फॉरवर्ड
          पर भ्रामक "नुस्खे" तेज़ी से फैलते हैं — जिनसे फसल और पैसे दोनों का नुकसान होता है।
          किसान मित्र इन दोनों के बीच का सेतु है: <strong>वैज्ञानिक रूप से प्रमाणित जानकारी
          को सरल हिंदी में, फसल-विशिष्ट संदर्भ में और मोबाइल पर देखने योग्य ढाँचे में</strong>{" "}
          प्रस्तुत करना।
        </p>

        {/* Services */}
        <h2 className="mt-12 text-2xl font-bold">हम क्या प्रदान करते हैं</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Card className="border border-border bg-card p-5">
            <Leaf className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">AI फसल डॉक्टर</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              पत्तियों की फोटो से तुरंत संभावित रोग व कीट पहचान और हिंदी में चरण-दर-चरण
              इलाज की सलाह।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <BookOpen className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">विशेषज्ञ हिंदी लेख</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              गेहूं, धान, सरसों, आलू, टमाटर, प्याज, सिंचाई, उर्वरक, पशुपालन और योजनाओं पर
              50+ विस्तृत लेख — हर एक 1500+ शब्दों की गहराई के साथ।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">मंडी, मौसम और योजनाएँ</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              MSP, मंडी रुझान, स्थानीय मौसम और PM-Kisan/PMFBY जैसी योजनाओं का सरल मार्गदर्शन।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">विश्वसनीय स्रोत</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              हर लेख ICAR, राज्य कृषि विश्वविद्यालयों और KVK दिशानिर्देशों के आधार पर तैयार और
              समीक्षित।
            </p>
          </Card>
        </div>

        {/* Editorial Team */}
        <h2 className="mt-12 text-2xl font-bold">हमारी संपादकीय टीम</h2>
        <p className="mt-3 text-base text-foreground/90">
          किसान मित्र की सामग्री वास्तविक कृषि विशेषज्ञों — कृषि वैज्ञानिकों, पादप रोग
          विशेषज्ञों और अनुभवी प्रगतिशील किसानों — द्वारा लिखी और समीक्षित की जाती है। नीचे
          हमारी मुख्य टीम है:
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {AUTHORS.map((a) => (
            <Card key={a.id} className="border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {a.initials}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{a.name}</p>
                  <p className="text-xs font-medium text-primary">{a.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.credentials}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{a.bio}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <Award className="mr-1 inline h-3 w-3" /> {a.experienceYears}+ वर्ष अनुभव ·{" "}
                {a.location}
              </p>
            </Card>
          ))}
        </div>

        {/* Editorial Process */}
        <h2 className="mt-12 flex items-center gap-2 text-2xl font-bold">
          <Microscope className="h-6 w-6 text-primary" /> हमारी संपादकीय प्रक्रिया
        </h2>
        <p className="mt-3 text-base text-foreground/90">
          हम E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) सिद्धांतों
          का पालन करते हैं। हर लेख निम्न चरणों से होकर प्रकाशित होता है:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-base text-foreground/90">
          <li><strong>विषय चयन:</strong> किसानों की वास्तविक खोजों और मौसमी ज़रूरतों के आधार पर।</li>
          <li><strong>स्रोत समीक्षा:</strong> ICAR, राज्य कृषि विश्वविद्यालयों, KVK और सरकारी दिशानिर्देशों से तथ्य संग्रह।</li>
          <li><strong>लेखन:</strong> क्षेत्र-विशेषज्ञ लेखक द्वारा सरल हिंदी में लेख की संरचना।</li>
          <li><strong>विशेषज्ञ समीक्षा:</strong> मुख्य संपादक (Ph.D. कृषि) द्वारा वैज्ञानिक सटीकता की पुष्टि।</li>
          <li><strong>स्थानीय संदर्भ जाँच:</strong> प्रगतिशील किसान सलाहकार द्वारा व्यावहारिक अनुभव से जाँच।</li>
          <li><strong>SEO एवं पठनीयता:</strong> शीर्षक, मेटा, संरचित डेटा, और मोबाइल-फ्रेंडली स्वरूपण।</li>
          <li><strong>नियमित अपडेट:</strong> कम से कम वर्ष में एक बार समीक्षा और जब भी सरकारी नीति/योजना बदले।</li>
        </ol>

        {/* Values */}
        <h2 className="mt-12 text-2xl font-bold">हमारे मूल्य</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { t: "किसान पहले", d: "हर निर्णय यह सोचकर लिया जाता है कि क्या यह किसान के लिए वास्तव में उपयोगी है।" },
            { t: "वैज्ञानिक सटीकता", d: "WhatsApp फॉरवर्ड या भ्रामक नुस्खे नहीं — केवल प्रमाणित जानकारी।" },
            { t: "पारदर्शिता", d: "हर लेख पर लेखक, स्रोत और अंतिम समीक्षा तिथि स्पष्ट।" },
            { t: "मुफ्त एवं समावेशी", d: "सभी मुख्य सेवाएँ किसानों के लिए हमेशा मुफ्त।" },
            { t: "गोपनीयता", d: "किसान का डेटा बेचा नहीं जाता, मार्केटिंग के लिए साझा नहीं किया जाता।" },
            { t: "बहुभाषीयता", d: "हिंदी, अंग्रेज़ी, मराठी, पंजाबी, बंगाली, तमिल, तेलुगु, गुजराती।" },
          ].map((v) => (
            <div key={v.t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">{v.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue */}
        <h2 className="mt-12 text-2xl font-bold">हम कैसे चलते हैं</h2>
        <p className="mt-3 text-base text-foreground/90">
          किसान मित्र किसानों से कोई शुल्क नहीं लेता। हमारी संचालन लागत — सर्वर, AI मॉडल,
          संपादकीय टीम — मुख्यतः वेबसाइट पर प्रदर्शित प्रासंगिक डिस्प्ले विज्ञापनों (Google
          AdSense) और चयनित गैर-घुसपैठ वाले प्रायोजनों से पूरी होती है। हमारी संपादकीय सामग्री
          पर विज्ञापनदाताओं का कोई प्रभाव नहीं है। विस्तृत प्रकटीकरण के लिए हमारी{" "}
          <Link className="text-primary hover:underline" to="/disclaimer">अस्वीकरण</Link> पढ़ें।
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/scanner">
            <Button className="rounded-xl bg-gradient-primary">
              <Sparkles className="mr-1.5 h-4 w-4" /> AI फसल स्कैन आज़माएँ
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-xl">संपर्क करें</Button>
          </Link>
          <Link to="/blog">
            <Button variant="outline" className="rounded-xl">सभी लेख देखें</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
