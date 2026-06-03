import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: "अस्वीकरण | किसान मित्र" },
      { name: "description", content: "किसान मित्र वेबसाइट पर प्रदान की गई जानकारी का अस्वीकरण।" },
      { property: "og:title", content: "अस्वीकरण | किसान मित्र" },
      { property: "og:description", content: "महत्वपूर्ण अस्वीकरण।" },
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
        <h1 className="text-3xl font-bold md:text-4xl">अस्वीकरण (Disclaimer)</h1>
        <p className="mt-2 text-sm text-muted-foreground">अंतिम अपडेट: 1 जून 2026</p>

        <Card className="mt-6 border border-warning/40 bg-warning/10 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm text-foreground/90">
              किसान मित्र पर प्रदान की गई जानकारी केवल सामान्य शैक्षणिक उद्देश्यों के लिए है। यह योग्य
              कृषि विशेषज्ञ या पशु चिकित्सक की पेशेवर सलाह का विकल्प नहीं है।
            </p>
          </div>
        </Card>

        <div className="prose-content mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-xl font-bold">1. सामान्य अस्वीकरण</h2>
          <p>
            किसान मित्र पर प्रकाशित सभी लेख, AI सुझाव, और जानकारी सद्भावना से प्रदान की जाती है। हम
            जानकारी की सटीकता और पूर्णता सुनिश्चित करने का हर संभव प्रयास करते हैं, लेकिन कोई स्पष्ट
            या निहित गारंटी नहीं देते।
          </p>

          <h2 className="text-xl font-bold">2. कृषि सलाह</h2>
          <p>
            हमारी सलाह सामान्य भारतीय कृषि पद्धतियों पर आधारित है। आपके क्षेत्र की मिट्टी, जलवायु,
            पानी की उपलब्धता और स्थानीय परिस्थितियों के अनुसार सलाह भिन्न हो सकती है। बड़े निर्णय
            लेने से पहले स्थानीय कृषि विज्ञान केंद्र (KVK), कृषि अधिकारी, या प्रमाणित कृषि सलाहकार
            से परामर्श करें।
          </p>

          <h2 className="text-xl font-bold">3. AI फसल पहचान</h2>
          <p>
            हमारा AI फसल डॉक्टर एक तकनीकी टूल है जो छवियों के आधार पर बीमारी और कीट पहचानने का
            प्रयास करता है। इसकी सटीकता छवि की गुणवत्ता, प्रकाश, कोण और कई अन्य कारकों पर निर्भर
            करती है। 100% सटीकता की कोई गारंटी नहीं है।
          </p>
          <p>
            गलत पहचान संभव है। कोई भी कीटनाशक या उपचार लागू करने से पहले स्थानीय विशेषज्ञ से पुष्टि
            करें।
          </p>

          <h2 className="text-xl font-bold">4. कीटनाशक और रसायन</h2>
          <p>
            जब भी हम कीटनाशकों, फफूंदनाशकों, या उर्वरकों का उल्लेख करते हैं, तो हमेशा निर्माता के
            लेबल निर्देशों, अनुशंसित मात्रा, और सुरक्षा सावधानियों का पालन करें। बच्चों और जानवरों
            की पहुंच से दूर रखें।
          </p>

          <h2 className="text-xl font-bold">5. सरकारी योजनाएं</h2>
          <p>
            सरकारी योजनाओं के बारे में जानकारी प्रकाशन के समय सटीक है। पात्रता, आवेदन प्रक्रिया, और
            लाभ राशि बदल सकते हैं। सबसे ताज़ा और सटीक जानकारी के लिए आधिकारिक सरकारी वेबसाइटें या
            संबंधित विभाग देखें।
          </p>

          <h2 className="text-xl font-bold">6. मंडी भाव</h2>
          <p>
            मंडी भाव और MSP की जानकारी संदर्भ के लिए है। वास्तविक भाव दैनिक रूप से बदलते हैं और
            स्थान-विशिष्ट होते हैं। फसल बेचने से पहले स्थानीय मंडी या eNAM पोर्टल पर ताज़ा भाव चेक
            करें।
          </p>

          <h2 className="text-xl font-bold">7. वित्तीय निर्णय</h2>
          <p>
            खेती से संबंधित कोई भी वित्तीय निर्णय — फसल चयन, उपकरण खरीद, ऋण — लेने से पहले अपने
            वित्तीय सलाहकार से परामर्श करें।
          </p>

          <h2 className="text-xl font-bold">8. तृतीय-पक्ष सामग्री</h2>
          <p>
            हमारी वेबसाइट पर तृतीय-पक्ष विज्ञापन, लिंक, या एम्बेडेड सामग्री हो सकती है। हम उन साइटों
            की सटीकता, सामग्री या प्रथाओं के लिए जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">9. दायित्व</h2>
          <p>
            किसान मित्र, इसके मालिक, संपादक, लेखक, या योगदानकर्ता वेबसाइट की जानकारी पर भरोसा
            करके लिए गए किसी भी कार्य या निर्णय से होने वाले किसी भी नुकसान — चाहे वह फसल का
            नुकसान, वित्तीय नुकसान, या कोई अन्य क्षति हो — के लिए जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold">10. परिवर्तन</h2>
          <p>हम इस अस्वीकरण को बिना सूचना के अपडेट कर सकते हैं।</p>
        </div>
      </article>
    </PageShell>
  );
}
