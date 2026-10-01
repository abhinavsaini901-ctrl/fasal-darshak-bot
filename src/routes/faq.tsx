import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQSection, type FAQItem } from "@/components/FAQSection";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "अक्सर पूछे जाने वाले प्रश्न | Kisan Lens" },
      { name: "description", content: "Kisan Lens के AI फसल उपकरण, कृषि लेख, किसान समुदाय, गोपनीयता और जानकारी की सीमाओं से जुड़े सामान्य प्रश्नों के उत्तर।" },
      { property: "og:title", content: "Kisan Lens — अक्सर पूछे जाने वाले प्रश्न" },
      { property: "og:description", content: "Kisan Lens सुविधाओं और जानकारी के उपयोग पर सामान्य प्रश्नों के उत्तर।" },
      { property: "og:url", content: "https://kisanlens.com/faq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/faq" }],
  }),
});

const items: FAQItem[] = [
  { q: "Kisan Lens क्या है?", a: "यह हिंदी कृषि जानकारी, लेख, किसान समुदाय और AI-आधारित डिजिटल उपकरणों वाली वेबसाइट है। उपलब्ध सुविधाएँ इंटरनेट और सेवा की उपलब्धता पर निर्भर करती हैं।" },
  { q: "क्या AI फसल रोग की पक्की पहचान करता है?", a: "नहीं। AI फोटो से संभावित संकेत देता है; प्रकाश, फोटो की स्पष्टता, फसल की अवस्था और अन्य कारण परिणाम बदल सकते हैं। गंभीर समस्या में स्थानीय कृषि विशेषज्ञ या कृषि विज्ञान केंद्र से पुष्टि करें।" },
  { q: "क्या AI की सलाह पर सीधे दवा का छिड़काव करूँ?", a: "सिर्फ AI के आधार पर दवा न चुनें। फसल और समस्या की पहचान की पुष्टि करें, उत्पाद का लेबल पढ़ें, सुरक्षा निर्देशों का पालन करें और जरूरत पड़ने पर कृषि विशेषज्ञ से सलाह लें।" },
  { q: "क्या वेबसाइट पर दी गई खेती की जानकारी हर क्षेत्र में लागू होती है?", a: "नहीं। मिट्टी, मौसम, किस्म और स्थानीय परिस्थितियों के कारण सलाह बदल सकती है। अपने क्षेत्र के कृषि विभाग, KVK या राज्य कृषि विश्वविद्यालय के नवीन निर्देशों को प्राथमिकता दें।" },
  { q: "मैं किसान समुदाय में पोस्ट कैसे करूँ?", a: "समुदाय में पोस्ट बनाने के लिए खाते में लॉगिन करें। पोस्ट में निजी जानकारी या दूसरे व्यक्ति की तस्वीर साझा करने से पहले उनकी अनुमति लें।" },
  { q: "मेरी फोटो और जानकारी का उपयोग कैसे होता है?", a: "कृपया उपयोग से पहले गोपनीयता नीति पढ़ें। AI सुविधाओं को चलाने के लिए भेजी गई सामग्री सेवा प्रदाताओं तक प्रोसेसिंग के लिए जा सकती है; संवेदनशील निजी जानकारी अपलोड न करें।" },
  { q: "वेबसाइट की सामग्री में गलती हो तो क्या करूँ?", a: "पेज का नाम और सुधार का सुझाव info@kisanlens.com पर भेजें। सामान्य जानकारी और AI सुविधाओं की सीमाओं के लिए अस्वीकरण भी देखें।" },
];

function FAQPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Breadcrumbs items={[{ label: "अक्सर पूछे जाने वाले प्रश्न" }]} />
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">अक्सर पूछे जाने वाले प्रश्न</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Kisan Lens की सुविधाओं और खेती संबंधी जानकारी के उपयोग के बारे में।</p>
        </div>
        <FAQSection title="आपके सवाल" items={items} />
        <p className="text-sm text-muted-foreground">और मदद चाहिए? <Link to="/contact" className="text-primary underline">हमसे संपर्क करें</Link> · <Link to="/privacy" className="text-primary underline">गोपनीयता नीति</Link> · <Link to="/disclaimer" className="text-primary underline">अस्वीकरण</Link></p>
      </div>
    </PageShell>
  );
}