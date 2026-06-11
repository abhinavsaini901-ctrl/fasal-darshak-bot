import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, Sprout, Beaker, Landmark, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: "अस्वीकरण (Disclaimer) | किसान मित्र" },
      {
        name: "description",
        content:
          "किसान मित्र पर दी गई कृषि, AI रोग पहचान, मंडी भाव और सरकारी योजना संबंधी जानकारी का विस्तृत अस्वीकरण। पेशेवर सलाह का विकल्प नहीं।",
      },
      { property: "og:title", content: "अस्वीकरण | किसान मित्र" },
      { property: "og:description", content: "किसान मित्र की वेबसाइट सामग्री का अस्वीकरण।" },
      { property: "og:url", content: "https://kisanlens.com/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/disclaimer" }],
  }),
});

function DisclaimerPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs items={[{ label: "अस्वीकरण" }]} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
          <ShieldAlert className="h-3 w-3" /> महत्वपूर्ण कानूनी सूचना
        </span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">अस्वीकरण (Disclaimer)</h1>
        <p className="mt-2 text-sm text-muted-foreground">अंतिम अपडेट: 10 जून 2026</p>

        <Card className="mt-6 border border-warning/40 bg-warning/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm text-foreground/90">
              किसान मित्र (kisanlens.com) पर प्रदान की गई सभी जानकारी, AI सुझाव, फसल सलाह, मौसम
              पूर्वानुमान, मंडी भाव और सरकारी योजना विवरण <strong>केवल सामान्य शैक्षणिक
              उद्देश्यों</strong> के लिए हैं। यह किसी योग्य कृषि वैज्ञानिक, कृषि विज्ञान केंद्र
              (KVK) सलाहकार, पशु चिकित्सक या वित्तीय सलाहकार की पेशेवर सलाह का विकल्प <strong>नहीं</strong> है।
            </p>
          </div>
        </Card>

        <div className="prose-content mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-xl font-bold">1. सामान्य अस्वीकरण</h2>
          <p>
            हम सद्भावना से सटीक, अद्यतन और उपयोगी जानकारी प्रदान करने का प्रयास करते हैं। हमारी
            संपादकीय टीम कृषि स्नातकों, अनुभवी किसानों और वैज्ञानिक संदर्भों पर आधारित सामग्री
            तैयार करती है। फिर भी, कृषि अत्यंत स्थान-विशिष्ट विज्ञान है — मिट्टी, जलवायु,
            जलस्तर, बीज क़िस्म और स्थानीय रोग दबाव के अनुसार परिणाम भिन्न हो सकते हैं। हम सटीकता
            या पूर्णता की कोई स्पष्ट या निहित गारंटी नहीं देते।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Sprout className="h-5 w-5 text-primary" /> 2. कृषि एवं फसल सलाह
          </h2>
          <p>
            हमारी सामग्री ICAR, राज्य कृषि विश्वविद्यालयों और KVKs के सार्वजनिक रूप से उपलब्ध
            दिशानिर्देशों पर आधारित है। किसी भी फसल योजना, बुवाई समय, बीज चयन, पोषण कार्यक्रम
            या रोग प्रबंधन रणनीति को लागू करने से पहले अपने निकटतम कृषि विज्ञान केंद्र, ब्लॉक
            कृषि अधिकारी या प्रमाणित सलाहकार से पुष्टि अवश्य करें।
          </p>

          <h2 className="text-xl font-bold">3. AI फसल डॉक्टर एवं छवि विश्लेषण</h2>
          <p>
            हमारा AI फसल डॉक्टर एक तकनीकी सहायक टूल है जो छवि-आधारित मशीन लर्निंग मॉडलों के
            माध्यम से फसल रोग या कीट की संभावित पहचान करता है। इसकी सटीकता निम्न कारकों पर
            निर्भर है: छवि की स्पष्टता, प्रकाश, कोण, फसल अवस्था, पत्ती कवरेज और मॉडल का
            प्रशिक्षण-डेटा कवरेज।
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>कोई भी AI मॉडल 100% सटीक नहीं है — गलत पहचान संभव है।</li>
            <li>संदिग्ध मामलों में हमेशा स्थानीय विशेषज्ञ से पुष्टि करें।</li>
            <li>अंतिम निर्णय और परिणाम की पूरी जिम्मेदारी उपयोगकर्ता की है।</li>
          </ul>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Beaker className="h-5 w-5 text-primary" /> 4. कीटनाशक, उर्वरक एवं रासायनिक उपयोग
          </h2>
          <p>
            जब भी हम कीटनाशक, फफूंदनाशक, खरपतवारनाशक या उर्वरक नाम/मात्रा का उल्लेख करते हैं:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>हमेशा निर्माता के लेबल और भारतीय Insecticides Act के अनुसार उपयोग करें।</li>
            <li>अनुशंसित मात्रा से अधिक उपयोग मिट्टी, फसल और स्वास्थ्य के लिए हानिकारक है।</li>
            <li>स्प्रे के समय PPE (मास्क, दस्ताने) पहनें।</li>
            <li>बच्चों, पालतू और पशुओं की पहुँच से दूर रखें।</li>
            <li>केवल पंजीकृत व लाइसेंस-प्राप्त दुकानों से खरीदें।</li>
          </ul>
          <p>
            कीटनाशक उपयोग के दुष्प्रभावों के लिए किसान मित्र किसी भी प्रकार से जिम्मेदार नहीं है।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Landmark className="h-5 w-5 text-primary" /> 5. सरकारी योजनाएँ एवं सब्सिडी
          </h2>
          <p>
            सरकारी योजनाओं — जैसे PM-Kisan, PMFBY, PMKSY, KCC आदि — से जुड़ी जानकारी प्रकाशन
            तिथि पर हमारे ज्ञान के अनुसार सही है। पात्रता मानदंड, अनुदान दर, आवेदन प्रक्रिया,
            अंतिम तिथि और लाभ की राशि सरकार द्वारा कभी भी बदली जा सकती है। आवेदन से पहले
            संबंधित आधिकारिक पोर्टल (जैसे{" "}
            <a className="text-primary hover:underline" href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer nofollow">pmkisan.gov.in</a>,{" "}
            <a className="text-primary hover:underline" href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer nofollow">pmfby.gov.in</a>) या ब्लॉक/CSC केंद्र से ताज़ा जानकारी की पुष्टि करें।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary" /> 6. मंडी भाव एवं वित्तीय जानकारी
          </h2>
          <p>
            मंडी भाव और MSP की जानकारी संदर्भ के लिए है। वास्तविक भाव दैनिक रूप से बदलते हैं और
            स्थान-विशिष्ट हैं। फसल बेचने का अंतिम निर्णय लेने से पहले{" "}
            <a className="text-primary hover:underline" href="https://enam.gov.in" target="_blank" rel="noopener noreferrer nofollow">eNAM पोर्टल</a>,
            राज्य कृषि विपणन बोर्ड या स्थानीय मंडी पर ताज़ा भाव अवश्य देखें। हम मंडी भाव डेटा की
            सटीकता की कोई गारंटी नहीं देते।
          </p>
          <p>
            खेती से जुड़े वित्तीय निर्णय — फसल बीमा, ऋण, उपकरण खरीद — लेने से पहले अपने वित्तीय
            सलाहकार या बैंक से परामर्श करें।
          </p>

          <h2 className="text-xl font-bold">7. पशुपालन और पशु चिकित्सा</h2>
          <p>
            पशु स्वास्थ्य, टीकाकरण, चारा या रोग प्रबंधन पर हमारी सामग्री केवल सामान्य संदर्भ है।
            कोई भी पशु बीमार होने पर तुरंत योग्य पशु चिकित्सक से संपर्क करें।
          </p>

          <h2 className="text-xl font-bold">8. AI-सहायता प्राप्त सामग्री प्रकटीकरण</h2>
          <p>
            पारदर्शिता के लिए: हमारे कुछ लेखों के प्रारंभिक मसौदे AI-सहायता से तैयार किए जाते
            हैं, फिर हमारी संपादकीय टीम कृषि विशेषज्ञों के साथ मिलकर तथ्य-जाँच, संशोधन और स्थानीय
            संदर्भों के साथ अद्यतन करती है। प्रत्येक लेख पर ज़िम्मेदार लेखक/समीक्षक का नाम
            प्रकाशित किया जाता है।
          </p>

          <h2 className="text-xl font-bold">9. तृतीय-पक्ष लिंक एवं विज्ञापन</h2>
          <p>
            हमारी वेबसाइट पर तृतीय-पक्ष विज्ञापन (Google AdSense आदि), संदर्भ लिंक और एम्बेडेड
            सामग्री हो सकती है। हम उन वेबसाइटों या विज्ञापनदाताओं की सामग्री, सटीकता या प्रथाओं
            के लिए जिम्मेदार नहीं हैं। उन साइटों पर जाने से पहले उनकी अपनी गोपनीयता और शर्तें
            पढ़ें।
          </p>

          <h2 className="text-xl font-bold">10. कोई वित्तीय या व्यावसायिक संबंध नहीं</h2>
          <p>
            जब तक स्पष्ट रूप से प्रकट न किया जाए, हम जिन उत्पादों, ब्रांडों या कंपनियों का उल्लेख
            करते हैं, उनसे हमारा कोई वित्तीय संबंध नहीं है। यदि किसी लेख में Affiliate संबंध हो,
            तो वह स्पष्ट रूप से बताया जाएगा।
          </p>

          <h2 className="text-xl font-bold">11. दायित्व की सीमा</h2>
          <p>
            किसान मित्र, इसके मालिक, संपादक, लेखक, योगदानकर्ता और सेवा प्रदाता — वेबसाइट की
            जानकारी पर भरोसा करके लिए गए किसी भी कार्य, निर्णय या परिणाम — चाहे वह फसल हानि,
            पशु हानि, वित्तीय नुकसान, या कोई अन्य प्रत्यक्ष/अप्रत्यक्ष क्षति हो — के लिए
            जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">12. परिवर्तन</h2>
          <p>
            हम इस अस्वीकरण को समय-समय पर अपडेट कर सकते हैं। नवीनतम संस्करण हमेशा इस पृष्ठ पर
            उपलब्ध होगा। संबंधित कानूनी दस्तावेज़ों के लिए हमारी{" "}
            <Link to="/privacy" className="text-primary hover:underline">गोपनीयता नीति</Link> और{" "}
            <Link to="/terms" className="text-primary hover:underline">नियम एवं शर्तें</Link> भी देखें।
          </p>

          <h2 className="text-xl font-bold">13. संपर्क</h2>
          <p>
            किसी भी प्रश्न के लिए: <a className="text-primary hover:underline" href="mailto:support@kisanlens.com">support@kisanlens.com</a>
          </p>
        </div>
      </article>
    </PageShell>
  );
}
