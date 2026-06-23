import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  MessageCircle,
  Scan,
  Sprout,
  Bug,
  Droplets,
  FlaskConical,
  TrendingUp,
  Landmark,
  Sparkles,
  ShieldCheck,
  Users,
  Smartphone,
  Languages,
  Sun,
  Mic,
  Volume2,
  Leaf,
  TreePine,
  Microscope,
  CloudSun,
} from "lucide-react";

import heroImg from "@/assets/hero-crop.jpg";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FAQSection } from "@/components/FAQSection";
import { Newsletter } from "@/components/Newsletter";
import { WeatherLocationCard } from "@/components/WeatherLocationCard";
import { KnowledgeCenterSection } from "@/components/KnowledgeCenterSection";
// import { LiveKisanNews } from "@/components/LiveKisanNews"; // Hidden until AdSense approval
import { KrishiStore } from "@/components/KrishiStore";
import { AdSlot } from "@/components/AdSlot";





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

const CATEGORIES = [
  { name: "फसल रोग", desc: "बीमारी पहचान और इलाज", icon: Sprout, href: "/crop-diseases", color: "text-emerald-600 bg-emerald-50" },
  { name: "कीट नियंत्रण", desc: "कीट प्रबंधन", icon: Bug, href: "/pest-control", color: "text-red-600 bg-red-50" },
  { name: "सिंचाई", desc: "ड्रिप, स्प्रिंकलर", icon: Droplets, href: "/blog?cat=ड्रिप सिंचाई", color: "text-sky-600 bg-sky-50" },
  { name: "उर्वरक", desc: "NPK और सूक्ष्म तत्व", icon: FlaskConical, href: "/blog?cat=उर्वरक प्रबंधन", color: "text-amber-600 bg-amber-50" },
  { name: "मंडी भाव", desc: "बाज़ार और MSP", icon: TrendingUp, href: "/market-prices", color: "text-lime-700 bg-lime-50" },
  { name: "सरकारी योजनाएं", desc: "सब्सिडी और लाभ", icon: Landmark, href: "/government-schemes", color: "text-indigo-600 bg-indigo-50" },
];

const STORIES = [
  {
    name: "रामलाल यादव, बाराबंकी, UP",
    crop: "गेहूं",
    text: "किसान मित्र ऐप से पत्तों पर लगी रतुआ बीमारी पहचानी। सही दवा डाली और 20% पैदावार ज्यादा मिली।",
  },
  {
    name: "सुनीता बेन, राजकोट, गुजरात",
    crop: "टमाटर",
    text: "ड्रिप सिंचाई लेख पढ़कर सब्सिडी ली। अब पानी आधा लगता है और टमाटर का साइज़ बड़ा।",
  },
  {
    name: "गुरप्रीत सिंह, लुधियाना, पंजाब",
    crop: "धान",
    text: "मंडी भाव सेक्शन से सही समय पर बेचा। 18,000 रुपये ज्यादा कमाए। बहुत अच्छी जानकारी।",
  },
];

const HOME_FAQ = [
  {
    q: "किसान मित्र क्या है?",
    a: "किसान मित्र एक मुफ्त AI-संचालित कृषि पोर्टल है जो भारतीय किसानों को फसल रोग पहचान, खेती की तकनीक, मंडी भाव, मौसम और सरकारी योजनाओं की जानकारी हिंदी में देता है।",
  },
  {
    q: "AI फसल डॉक्टर कैसे काम करता है?",
    a: "आप अपने मोबाइल से फसल या पत्ते की फोटो लें। हमारा AI तुरंत बीमारी या कीट पहचानता है और इलाज, बचाव और सलाह हिंदी में देता है। पूरी प्रक्रिया 10 सेकंड में।",
  },
  {
    q: "क्या यह सेवा मुफ्त है?",
    a: "हाँ। फसल स्कैन, चैट सलाह, लेख पढ़ना — सब सुविधाएं किसानों के लिए पूर्ण रूप से मुफ्त हैं।",
  },
  {
    q: "क्या यह सलाह कृषि विशेषज्ञ का विकल्प है?",
    a: "नहीं। हमारी सलाह शैक्षणिक मार्गदर्शन है। गंभीर समस्या के लिए कृपया कृषि विज्ञान केंद्र (KVK) या स्थानीय कृषि अधिकारी से भी सलाह लें।",
  },
  {
    q: "किन भाषाओं में उपलब्ध है?",
    a: "हिंदी, अंग्रेज़ी, मराठी, पंजाबी, बंगाली, तमिल, तेलुगु और गुजराती में। आप हेडर से भाषा बदल सकते हैं।",
  },
];

const TIPS = [
  { title: "मिट्टी की जांच", text: "हर 3 साल में मिट्टी टेस्ट कराएं। 'Soil Health Card' मुफ्त है।" },
  { title: "बीज उपचार", text: "बीज बोने से पहले फफूंदनाशक से उपचार करें — रोग 60% तक कम।" },
  { title: "ड्रिप सिंचाई", text: "PMKSY में 80-90% तक सब्सिडी। पानी की बचत, पैदावार में बढ़ोतरी।" },
  { title: "जैविक खाद", text: "वर्मीकम्पोस्ट और गोबर खाद से मिट्टी की उपजाऊ शक्ति बढ़ती है।" },
];

const FEATURES = [
  { title: "AI फसल स्कैन", desc: "पत्ते/फसल की फोटो लें, रोग और इलाज 10 सेकंड में पाएं।", icon: Scan, href: "/scanner" },
  { title: "स्मार्ट सहायक", desc: "किसी भी खेती से जुड़ा सवाल पूछें, AI हिंदी में जवाब देगा।", icon: MessageCircle, href: "/scanner" },
  { title: "मंडी भाव", desc: "रोज़ाना मंडी के ताज़ा भाव और MSP की जानकारी।", icon: TrendingUp, href: "/market-prices" },
  { title: "सरकारी योजनाएं", desc: "PM-KISAN, PMKSY और अन्य सब्सिडी योजनाओं का विवरण।", icon: Landmark, href: "/government-schemes" },
  { title: "मौसम अपडेट", desc: "अपने गाँव/जिले का मौसम और बारिश का पूर्वानुमान।", icon: Sun, href: "/" },
  { title: "कई भाषाएं", desc: "हिंदी, अंग्रेज़ी, मराठी, पंजाबी, गुजराती और ज़्यादा।", icon: Languages, href: "#" },
];


function HomePage() {
  return (

    <PageShell>
      {/* AI खेती गुरु — Premium Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 py-12 md:py-20">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur">
              🌾 AI खेती गुरु
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white drop-shadow md:text-6xl">
              AI <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">खेती गुरु</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50/90 md:text-lg">
              कैमरा खोलें, फसल, पेड़, पौधा या फल दिखाएं और AI से तुरंत जानकारी प्राप्त करें
            </p>
          </div>

          {/* Animated AI Camera Logo */}
          <div className="relative mx-auto mt-10 flex h-48 w-48 items-center justify-center md:h-56 md:w-56">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
            <span className="absolute inset-4 animate-pulse rounded-full bg-emerald-300/20 blur-2xl" />
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/40 [animation:spin_8s_linear_infinite]" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-2xl shadow-emerald-500/40 md:h-32 md:w-32">
              <Camera className="h-12 w-12 text-white md:h-14 md:w-14" />
            </div>
          </div>

          {/* Main CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <Link to="/scanner">
              <Button
                size="lg"
                className="h-14 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 px-8 text-base font-bold text-emerald-950 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 md:text-lg"
              >
                <Camera className="mr-2 h-6 w-6" /> 📷 लाइव कैमरा शुरू करें
              </Button>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/scanner">
                <Button variant="outline" className="h-10 rounded-xl border-emerald-300/40 bg-white/10 text-emerald-50 backdrop-blur hover:bg-white/20 hover:text-white">
                  <Mic className="mr-2 h-4 w-4" /> वॉयस से पूछें
                </Button>
              </Link>
              <Link to="/scanner">
                <Button variant="outline" className="h-10 rounded-xl border-emerald-300/40 bg-white/10 text-emerald-50 backdrop-blur hover:bg-white/20 hover:text-white">
                  <MessageCircle className="mr-2 h-4 w-4" /> AI चैट
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature grid (glassmorphism) */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {[
              { icon: Sprout, label: "फसल पहचान" },
              { icon: TreePine, label: "पेड़ पहचान" },
              { icon: Leaf, label: "पौधा/फल" },
              { icon: Microscope, label: "रोग पहचान" },
              { icon: Bug, label: "कीट पहचान" },
              { icon: FlaskConical, label: "पोषण कमी" },
              { icon: Scan, label: "खरपतवार" },
              { icon: Volume2, label: "हिंदी आवाज़" },
              { icon: CloudSun, label: "मौसम सलाह" },
              { icon: TrendingUp, label: "मंडी भाव" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur transition-colors hover:bg-white/20"
              >
                <f.icon className="h-5 w-5 text-lime-300" />
                <span className="text-xs font-semibold text-emerald-50">{f.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-emerald-100/70">
            Gemini Vision • Voice AI • Real-time Chat • हिंदी सपोर्ट
          </p>
        </div>
      </section>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> AI से चलने वाला कृषि सहायक
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              आपकी फसल का <span className="text-primary">AI डॉक्टर</span>
              <br />
              हर किसान की जेब में
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              फसल की फोटो लें, बीमारी पहचानें, इलाज पाएं। साथ ही पाएं मंडी भाव, सरकारी योजनाएं और
              हिंदी में 1000+ कृषि लेख।
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/scanner">
                <Button size="lg" className="h-12 rounded-xl bg-gradient-primary px-6 text-base font-bold shadow-soft">
                  <Camera className="mr-2 h-5 w-5" /> अभी फसल स्कैन करें
                </Button>
              </Link>
              <Link to="/scanner">
                <Button size="lg" variant="outline" className="h-12 rounded-xl px-6 text-base font-semibold">
                  <MessageCircle className="mr-2 h-5 w-5" /> सवाल पूछें
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 100% मुफ्त</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> 50,000+ किसान</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-primary" /> मोबाइल फ्रेंडली</span>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-strong">
              <img
                src={heroImg}
                alt="स्वस्थ फसल का खेत"
                width={1024}
                height={768}
                className="h-64 w-full object-cover md:h-80"
              />
              <div className="bg-gradient-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/15">
                    <ShieldCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">सटीक रोग पहचान</p>
                    <p className="text-xs text-muted-foreground">10 सेकंड में रिज़ल्ट, हिंदी में</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* WEATHER & LOCATION */}
      <WeatherLocationCard />




      {/* LIVE NEWS — hidden until AdSense approval to avoid third-party content concerns */}
      {/* <LiveKisanNews /> */}

      {/* KRISHI STORE */}
      <KrishiStore />

      {/* FEATURED SERVICES — छोटे आइकन के साथ अलग सेक्शन */}
      <section className="border-y border-border bg-secondary/30 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            मुख्य सुविधाएं
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                to={f.href}
                className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft"
              >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <f.icon className="h-3 w-3" />
              </div>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary">{f.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">मुख्य श्रेणियां</h2>
            <p className="mt-1 text-sm text-muted-foreground">हर विषय की पूरी जानकारी एक क्लिक पर</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={c.href}
              className="group rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-foreground">{c.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>


      {/* Ad Slot #2 — In-article placement */}
      <AdSlot variant="in-article" />

      {/* KNOWLEDGE CENTER */}
      <KnowledgeCenterSection />


      {/* TIPS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">खेती की उपयोगी टिप्स</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t) => (
            <Card key={t.title} className="border border-border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-secondary/40 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">किसानों की सफलता की कहानियां</h2>
          <p className="mt-1 text-sm text-muted-foreground">असली किसान, असली अनुभव</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STORIES.map((s) => (
              <Card key={s.name} className="border border-border bg-card p-5">
                <p className="text-sm italic leading-relaxed text-foreground">"{s.text}"</p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">फसल: {s.crop}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        
        <FAQSection items={HOME_FAQ} />
      </section>

      {/* Newsletter */}
      <section className="px-4 pb-12">
        <Newsletter />
      </section>
    </PageShell>
  );
}
