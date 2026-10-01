import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Camera, Mail, ShieldCheck, Users } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Kisan Lens के बारे में | हिंदी कृषि जानकारी और डिजिटल उपकरण" },
      { name: "description", content: "Kisan Lens भारतीय किसानों के लिए हिंदी कृषि लेख, फसल संबंधी डिजिटल उपकरण और किसान समुदाय उपलब्ध कराता है। जानें कि इस वेबसाइट पर क्या मिलता है और जानकारी की सीमाएँ क्या हैं।" },
      { property: "og:title", content: "Kisan Lens के बारे में" },
      { property: "og:description", content: "किसानों के लिए हिंदी कृषि जानकारी, डिजिटल उपकरण और समुदाय।" },
      { property: "og:url", content: "https://kisanlens.com/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/about" }],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs items={[{ label: "हमारे बारे में" }]} />
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Kisan Lens के बारे में</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Kisan Lens खेती से जुड़ी जानकारी और डिजिटल सुविधाओं को सरल हिंदी में प्रस्तुत करने वाली वेबसाइट है। यहाँ किसान फसल के बारे में लेख पढ़ सकते हैं, AI-आधारित फसल और कैमरा उपकरण आज़मा सकते हैं, और समुदाय में अपने अनुभव साझा कर सकते हैं।
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          AI से मिली पहचान या सलाह संभावित जानकारी है, विशेषज्ञ निदान नहीं। खेती की परिस्थितियाँ जगह और मौसम के अनुसार बदलती हैं; दवा, खाद या सरकारी योजना पर निर्णय से पहले उत्पाद के लेबल और संबंधित आधिकारिक स्रोत या स्थानीय कृषि विशेषज्ञ से पुष्टि करें।
        </p>
        <h2 className="mt-9 text-xl font-bold">वेबसाइट पर क्या मिलेगा</h2>
        <ul className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">
          <li className="flex gap-3"><BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>कृषि लेख:</strong> फसल देखभाल, रोग-कीट, सिंचाई और खेती से जुड़े विषयों पर हिंदी सामग्री।</span></li>
          <li className="flex gap-3"><Camera className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>AI उपकरण:</strong> फोटो और कैमरा-आधारित सुविधाएँ जो संभावित संकेत दे सकती हैं; परिणाम की पुष्टि आवश्यक है।</span></li>
          <li className="flex gap-3"><Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>किसान समुदाय:</strong> सदस्य सवाल, फोटो और खेती के अनुभव साझा कर सकते हैं।</span></li>
          <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>पारदर्शिता:</strong> सामग्री सामान्य जानकारी के लिए है; जहाँ लागू हो, लेखों में स्रोत और तारीख देखें।</span></li>
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          वेबसाइट की जानकारी में गलती दिखे या कोई सुझाव हो, तो कृपया हमें लिखें। हमारी सामग्री और AI सेवाओं के उपयोग से पहले <Link to="/disclaimer" className="text-primary underline">अस्वीकरण</Link> भी पढ़ें।
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/blog"><Button>कृषि लेख पढ़ें</Button></Link>
          <Link to="/contact"><Button variant="outline"><Mail className="mr-2 h-4 w-4" />संपर्क करें</Button></Link>
        </div>
      </article>
    </PageShell>
  );
}