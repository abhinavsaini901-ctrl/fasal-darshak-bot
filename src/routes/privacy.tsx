import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Cookie, BarChart3, Mail, Globe, Lock, Users2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "गोपनीयता नीति (Privacy Policy) | किसान मित्र" },
      {
        name: "description",
        content:
          "किसान मित्र की विस्तृत गोपनीयता नीति — हम कौन-सा डेटा एकत्र करते हैं, कैसे उपयोग करते हैं, AdSense व Google Analytics कुकीज़, आपके अधिकार और संपर्क विवरण।",
      },
      { property: "og:title", content: "गोपनीयता नीति | किसान मित्र" },
      { property: "og:description", content: "किसान मित्र की पूर्ण गोपनीयता नीति।" },
      { property: "og:url", content: "https://kisanlens.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs items={[{ label: "गोपनीयता नीति" }]} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3 w-3" /> कानूनी दस्तावेज़
        </span>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">गोपनीयता नीति (Privacy Policy)</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          अंतिम अपडेट: 10 जून 2026 · प्रभावी तिथि: 1 जनवरी 2026
        </p>

        <Card className="mt-6 border border-border bg-gradient-card p-5">
          <p className="text-sm leading-relaxed text-foreground/90">
            <strong>संक्षेप में:</strong> किसान मित्र (kisanlens.com) भारतीय किसानों के लिए मुफ्त
            कृषि सूचना और AI सेवाएँ प्रदान करता है। हम आपकी निजी जानकारी का सम्मान करते हैं, उसे
            किसी को बेचते नहीं, और केवल वही डेटा एकत्र करते हैं जो सेवा देने, वेबसाइट सुधारने और
            कानूनी आवश्यकताओं को पूरा करने के लिए आवश्यक है। यह नीति भारतीय Digital Personal Data
            Protection Act, 2023 (DPDP) और Google AdSense Program Policies के अनुरूप है।
          </p>
        </Card>

        <div className="prose-content mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users2 className="h-5 w-5 text-primary" /> 1. हम कौन हैं
          </h2>
          <p>
            किसान मित्र (आगे "हम", "हमारा", "वेबसाइट" या "सेवा") एक डिजिटल कृषि सूचना मंच है, जो
            kisanlens.com और इसके सब-डोमेन के माध्यम से संचालित होता है। हमारा संचालन भारत से होता
            है और यह नीति भारतीय कानूनों के अधीन है। डेटा से जुड़े किसी भी प्रश्न के लिए हमारा
            संपर्क ईमेल <a className="text-primary hover:underline" href="mailto:support@kisanlens.com">support@kisanlens.com</a> है।
          </p>

          <h2 className="text-xl font-bold">2. हम कौन-सी जानकारी एकत्र करते हैं</h2>
          <p>हम तीन व्यापक श्रेणियों में जानकारी एकत्र करते हैं:</p>
          <h3 className="text-base font-bold">(क) आपके द्वारा स्वेच्छा से दी गई जानकारी</h3>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>संपर्क फॉर्म: नाम, ईमेल, विषय और संदेश।</li>
            <li>न्यूज़लेटर सब्सक्रिप्शन: ईमेल पता।</li>
            <li>AI फसल डॉक्टर / कैमरा स्कैनर पर अपलोड की गई फसल/पत्तों की तस्वीरें।</li>
            <li>वैकल्पिक प्रोफ़ाइल जानकारी जैसे ज़िला/राज्य, फसल प्रकार — यदि आप साझा करना चाहें।</li>
          </ul>
          <h3 className="text-base font-bold">(ख) स्वचालित रूप से एकत्र तकनीकी जानकारी</h3>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>ब्राउज़र प्रकार, ऑपरेटिंग सिस्टम, डिवाइस मॉडल और स्क्रीन आकार।</li>
            <li>अनुमानित IP-आधारित लोकेशन (शहर/राज्य स्तर — सटीक GPS नहीं)।</li>
            <li>आपने कौन-से पृष्ठ देखे, कब देखे और किस लिंक से आए।</li>
            <li>परफ़ॉर्मेंस मेट्रिक्स — पृष्ठ लोड समय, त्रुटियाँ — सेवा सुधारने के लिए।</li>
          </ul>
          <h3 className="text-base font-bold">(ग) मौसम/स्थान सुविधा के लिए (वैकल्पिक)</h3>
          <p>
            यदि आप ज़िला आधारित मौसम सुविधा का उपयोग करते हैं, तो आप स्वयं अपना ज़िला चुनते हैं।
            हम ब्राउज़र से सटीक GPS तभी पूछते हैं जब आप अनुमति देते हैं, और यह जानकारी हमारे
            सर्वर पर स्थायी रूप से संग्रहीत नहीं की जाती।
          </p>

          <h2 className="text-xl font-bold">3. जानकारी का उपयोग कैसे होता है</h2>
          <p>आपके डेटा का उपयोग केवल निम्न उद्देश्यों के लिए होता है:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>AI फसल विश्लेषण और सलाह उत्पन्न करना।</li>
            <li>आपके संपर्क संदेशों का उत्तर देना।</li>
            <li>न्यूज़लेटर और कृषि अपडेट भेजना (यदि सब्सक्राइब किया है)।</li>
            <li>वेबसाइट की सुरक्षा, स्थिरता और प्रदर्शन में सुधार।</li>
            <li>अनाम कुल आँकड़े तैयार करना (जैसे "कुल विज़िट" — व्यक्तिगत पहचान नहीं)।</li>
            <li>कानूनी अनुपालन एवं धोखाधड़ी रोकथाम।</li>
          </ul>
          <p>
            हम आपका डेटा किसी भी मार्केटिंग कंपनी को नहीं बेचते। हम इसे विज्ञापन प्रोफ़ाइलिंग के
            लिए तृतीय पक्षों के साथ साझा नहीं करते (Google द्वारा अपनी विज्ञापन सेवा हेतु एकत्र
            कुकीज़ के अलावा — विवरण नीचे धारा 5)।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Cookie className="h-5 w-5 text-primary" /> 4. कुकीज़ और समान तकनीकें
          </h2>
          <p>
            हमारी वेबसाइट निम्न प्रकार की कुकीज़ का उपयोग करती है:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li><strong>आवश्यक कुकीज़:</strong> भाषा, ज़िला, लॉगिन सत्र संग्रह — साइट कार्य के लिए ज़रूरी।</li>
            <li><strong>विश्लेषणात्मक कुकीज़ (Google Analytics):</strong> ट्रैफ़िक पैटर्न को अनाम रूप से समझने के लिए।</li>
            <li><strong>विज्ञापन कुकीज़ (Google AdSense):</strong> प्रासंगिक विज्ञापन दिखाने के लिए।</li>
          </ul>
          <p>
            आप अपने ब्राउज़र की सेटिंग से कुकीज़ ब्लॉक या डिलीट कर सकते हैं। ध्यान दें: इससे कुछ
            सुविधाएँ (भाषा सहेजना, ज़िला चयन याद रखना) बाधित हो सकती हैं।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <BarChart3 className="h-5 w-5 text-primary" /> 5. विज्ञापन — Google AdSense
          </h2>
          <p>
            हम वेबसाइट संचालन की लागत पूरी करने के लिए Google AdSense सहित तृतीय-पक्ष विज्ञापन
            सेवाओं का उपयोग कर सकते हैं। Google और इसके सहयोगी कुकीज़ या वेब बीकन का उपयोग करके
            आपकी रुचि के अनुसार विज्ञापन दिखा सकते हैं। ये कुकीज़ Google को आपकी पिछली विज़िट के
            आधार पर विज्ञापन प्रासंगिक बनाने में मदद करती हैं।
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              Google द्वारा कुकीज़ के उपयोग की पूरी नीति यहाँ पढ़ें:{" "}
              <a className="text-primary hover:underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer nofollow">
                Google Ads & Cookies Policy
              </a>
              ।
            </li>
            <li>
              आप व्यक्तिगत विज्ञापन से ऑप्ट-आउट कर सकते हैं —{" "}
              <a className="text-primary hover:underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer nofollow">
                Google Ads Settings
              </a>{" "}
              पर जाएँ।
            </li>
            <li>
              तृतीय-पक्ष विक्रेताओं की ऑप्ट-आउट के लिए:{" "}
              <a className="text-primary hover:underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer nofollow">
                aboutads.info/choices
              </a>।
            </li>
          </ul>
          <p>
            हमारी वेबसाइट पर दिखाए जाने वाले विज्ञापनों की सामग्री हमारे संपादकीय नियंत्रण में
            नहीं है। हम विज्ञापनदाताओं द्वारा प्रचारित उत्पादों या सेवाओं का समर्थन नहीं करते।
          </p>

          <h2 className="text-xl font-bold">6. AI फसल छवियों का प्रबंधन</h2>
          <p>
            जब आप AI फसल डॉक्टर पर फोटो अपलोड करते हैं, तो वह छवि केवल विश्लेषण के समय हमारे AI
            पाइपलाइन में जाती है। हम छवियों को सेवा गुणवत्ता सुधारने के लिए अनाम तकनीकी रूप में
            (व्यक्तिगत पहचान हटाकर) कुछ समय के लिए संग्रहीत कर सकते हैं। हम ये छवियाँ किसी तीसरे
            पक्ष को विज्ञापन या मार्केटिंग हेतु साझा नहीं करते।
          </p>

          <h2 className="text-xl font-bold">7. जानकारी का साझाकरण</h2>
          <p>
            हम आपकी व्यक्तिगत जानकारी केवल तीन स्थितियों में साझा करते हैं:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>आपकी स्पष्ट सहमति से।</li>
            <li>
              हमारे विश्वसनीय सेवा प्रदाताओं (होस्टिंग, ईमेल डिलीवरी, एनालिटिक्स, AI मॉडल प्रदाता)
              के साथ — जो हमारी गोपनीयता मानकों से बँधे हैं।
            </li>
            <li>कानूनी आवश्यकता (कोर्ट आदेश, अधिकृत जाँच एजेंसी अनुरोध)।</li>
          </ul>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Lock className="h-5 w-5 text-primary" /> 8. डेटा सुरक्षा
          </h2>
          <p>
            हम उद्योग-मानक सुरक्षा प्रथाओं का पालन करते हैं: साइट-व्यापी HTTPS एन्क्रिप्शन,
            सीमित प्रशासनिक पहुँच, सुरक्षित बैकएंड (RLS नीतियाँ), नियमित सुरक्षा स्कैन और न्यूनतम
            डेटा संग्रह सिद्धांत। हालाँकि कोई भी इंटरनेट सेवा 100% जोखिम-मुक्त नहीं है।
          </p>

          <h2 className="text-xl font-bold">9. डेटा प्रतिधारण</h2>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>संपर्क संदेश: उत्तर देने के बाद 24 माह तक।</li>
            <li>न्यूज़लेटर ईमेल: अनसब्सक्राइब करने तक।</li>
            <li>तकनीकी लॉग: 90 दिन तक।</li>
            <li>AI छवियाँ: विश्लेषण के लिए केवल अल्पकालिक प्रोसेसिंग के बाद हटाई जाती हैं।</li>
          </ul>

          <h2 className="text-xl font-bold">10. आपके अधिकार (DPDP Act, 2023)</h2>
          <p>आप कभी भी हमसे संपर्क करके इन अधिकारों का उपयोग कर सकते हैं:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>अपना संग्रहित डेटा देखने का अधिकार।</li>
            <li>गलत जानकारी सुधारने का अधिकार।</li>
            <li>अपना डेटा मिटाने (Right to Erasure) का अधिकार।</li>
            <li>सहमति वापस लेने का अधिकार।</li>
            <li>शिकायत निवारण का अधिकार।</li>
          </ul>
          <p>
            अनुरोध भेजने के लिए <a className="text-primary hover:underline" href="mailto:privacy@kisanlens.com">privacy@kisanlens.com</a> पर
            लिखें। हम 30 दिनों के भीतर उत्तर देंगे।
          </p>

          <h2 className="text-xl font-bold">11. बच्चों की गोपनीयता</h2>
          <p>
            हमारी सेवाएँ 13 वर्ष से कम आयु के बच्चों के लिए नहीं हैं। यदि हमें पता चले कि किसी
            बच्चे ने सहमति के बिना डेटा साझा किया है, तो हम उसे तुरंत हटा देते हैं।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Globe className="h-5 w-5 text-primary" /> 12. अंतर्राष्ट्रीय डेटा अंतरण
          </h2>
          <p>
            हमारे कुछ सेवा प्रदाता (जैसे ईमेल, क्लाउड होस्टिंग) भारत के बाहर हो सकते हैं। ऐसे
            अंतरण उपयुक्त सुरक्षा उपायों के साथ ही किए जाते हैं।
          </p>

          <h2 className="text-xl font-bold">13. नीति में परिवर्तन</h2>
          <p>
            जब भी हम इस नीति में महत्वपूर्ण परिवर्तन करेंगे, हम वेबसाइट पर सूचना देंगे और
            "अंतिम अपडेट" तिथि बदलेंगे। पुराने संस्करण अनुरोध पर उपलब्ध हैं।
          </p>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Mail className="h-5 w-5 text-primary" /> 14. संपर्क करें
          </h2>
          <p>
            गोपनीयता या डेटा से जुड़े किसी भी प्रश्न के लिए:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>सामान्य: <a className="text-primary hover:underline" href="mailto:support@kisanlens.com">support@kisanlens.com</a></li>
            <li>गोपनीयता / डेटा अधिकार: <a className="text-primary hover:underline" href="mailto:privacy@kisanlens.com">privacy@kisanlens.com</a></li>
            <li>संपादकीय: <a className="text-primary hover:underline" href="mailto:editor@kisanlens.com">editor@kisanlens.com</a></li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
