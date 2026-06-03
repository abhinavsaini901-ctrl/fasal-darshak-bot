import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "नियम और शर्तें | किसान मित्र" },
      { name: "description", content: "किसान मित्र वेबसाइट के उपयोग की नियम और शर्तें।" },
      { property: "og:title", content: "नियम और शर्तें | किसान मित्र" },
      { property: "og:description", content: "उपयोग की शर्तें।" },
      { property: "og:url", content: "https://fasal-darshak-bot.lovable.app/terms" },
    ],
    links: [{ rel: "canonical", href: "https://fasal-darshak-bot.lovable.app/terms" }],
  }),
});

function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs items={[{ label: "नियम और शर्तें" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">नियम और शर्तें</h1>
        <p className="mt-2 text-sm text-muted-foreground">अंतिम अपडेट: 1 जून 2026</p>

        <div className="prose-content mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <p>
            किसान मित्र वेबसाइट और इसकी सेवाओं का उपयोग करके आप इन नियम और शर्तों से सहमत होते हैं।
            कृपया उपयोग से पहले ध्यान से पढ़ें।
          </p>

          <h2 className="text-xl font-bold">1. सेवा का उपयोग</h2>
          <p>
            किसान मित्र मुफ्त, शैक्षणिक और सूचनात्मक सेवा है। आप व्यक्तिगत, गैर-व्यावसायिक उपयोग के
            लिए इस वेबसाइट की सामग्री और AI टूल्स का उपयोग कर सकते हैं।
          </p>

          <h2 className="text-xl font-bold">2. प्रतिबंधित उपयोग</h2>
          <p>आप निम्नलिखित नहीं करेंगे:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>वेबसाइट की सामग्री को बिना अनुमति के पुनः प्रकाशित करना</li>
            <li>स्वचालित बॉट या स्क्रेपिंग टूल का उपयोग करना</li>
            <li>सेवा को बाधित करने वाली कोई भी गतिविधि</li>
            <li>अवैध या हानिकारक सामग्री अपलोड करना</li>
            <li>दूसरों के अधिकारों का उल्लंघन करना</li>
          </ul>

          <h2 className="text-xl font-bold">3. AI सलाह की सीमाएं</h2>
          <p>
            हमारी AI-आधारित फसल पहचान और सलाह केवल मार्गदर्शन के लिए है। यह योग्य कृषि विशेषज्ञ की
            सलाह का विकल्प नहीं है। गंभीर समस्याओं के लिए हमेशा स्थानीय कृषि विज्ञान केंद्र (KVK)
            या कृषि अधिकारी से परामर्श करें।
          </p>

          <h2 className="text-xl font-bold">4. बौद्धिक संपदा</h2>
          <p>
            वेबसाइट की सभी सामग्री — लेख, चित्र, लोगो, डिज़ाइन — किसान मित्र की संपत्ति है और कॉपीराइट
            कानून द्वारा संरक्षित है।
          </p>

          <h2 className="text-xl font-bold">5. उपयोगकर्ता द्वारा प्रदान की गई सामग्री</h2>
          <p>
            जब आप संपर्क फॉर्म या AI टूल के माध्यम से जानकारी प्रदान करते हैं, तो आप पुष्टि करते हैं
            कि वह सटीक है और आपके पास उसे साझा करने का अधिकार है।
          </p>

          <h2 className="text-xl font-bold">6. तृतीय-पक्ष लिंक</h2>
          <p>
            हमारी वेबसाइट पर तृतीय-पक्ष वेबसाइटों के लिंक हो सकते हैं। हम उन वेबसाइटों की सामग्री या
            गोपनीयता प्रथाओं के लिए जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">7. विज्ञापन</h2>
          <p>
            हमारी वेबसाइट पर Google AdSense या अन्य विज्ञापन सेवाओं द्वारा प्रदर्शित विज्ञापन हो
            सकते हैं। ये विज्ञापन तृतीय-पक्ष विज्ञापनदाताओं के हैं और हम उनकी सामग्री के लिए जिम्मेदार
            नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">8. सेवा परिवर्तन और समाप्ति</h2>
          <p>
            हम किसी भी समय बिना सूचना के सेवा को संशोधित या बंद करने का अधिकार रखते हैं।
          </p>

          <h2 className="text-xl font-bold">9. दायित्व की सीमा</h2>
          <p>
            किसान मित्र, इसके मालिक, टीम, या योगदानकर्ता वेबसाइट के उपयोग से होने वाले किसी भी
            प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">10. कानून और क्षेत्राधिकार</h2>
          <p>
            ये शर्तें भारतीय कानून के अधीन हैं। किसी भी विवाद का समाधान भारतीय अदालतों में होगा।
          </p>

          <h2 className="text-xl font-bold">11. शर्तों में परिवर्तन</h2>
          <p>
            हम इन शर्तों को कभी भी अपडेट कर सकते हैं। वेबसाइट का निरंतर उपयोग अद्यतन शर्तों की
            स्वीकृति माना जाएगा।
          </p>

          <h2 className="text-xl font-bold">12. संपर्क</h2>
          <p>
            प्रश्नों के लिए:{" "}
            <a href="mailto:support@kisanmitra.in" className="text-primary hover:underline">
              support@kisanmitra.in
            </a>
          </p>
        </div>
      </article>
    </PageShell>
  );
}
