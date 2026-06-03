import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "गोपनीयता नीति | किसान मित्र" },
      { name: "description", content: "किसान मित्र की गोपनीयता नीति — हम आपका डेटा कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।" },
      { property: "og:title", content: "गोपनीयता नीति | किसान मित्र" },
      { property: "og:description", content: "हमारी डेटा प्रथाएं।" },
      { property: "og:url", content: "https://fasal-darshak-bot.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://fasal-darshak-bot.lovable.app/privacy" }],
  }),
});

function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs items={[{ label: "गोपनीयता नीति" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">गोपनीयता नीति</h1>
        <p className="mt-2 text-sm text-muted-foreground">अंतिम अपडेट: 1 जून 2026</p>

        <div className="prose-content mt-8 space-y-6 text-base leading-relaxed text-foreground/90">
          <p>
            किसान मित्र ("हम", "हमारा") में आपकी गोपनीयता का सम्मान करते हैं। यह नीति बताती है कि
            हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
          </p>

          <h2 className="text-xl font-bold">1. हम कौन-सी जानकारी एकत्र करते हैं</h2>
          <p>हम तीन प्रकार की जानकारी एकत्र कर सकते हैं:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li><strong>आपके द्वारा दी गई जानकारी:</strong> नाम, ईमेल जब आप संपर्क फॉर्म या न्यूज़लेटर के लिए सब्सक्राइब करते हैं।</li>
            <li><strong>फसल चित्र:</strong> AI फसल डॉक्टर में आपके द्वारा अपलोड की गई फोटो। ये केवल विश्लेषण के लिए प्रोसेस होती हैं और स्थायी रूप से संग्रहीत नहीं की जातीं।</li>
            <li><strong>तकनीकी डेटा:</strong> ब्राउज़र प्रकार, डिवाइस, IP पता, पेज विज़िट — मानक वेब एनालिटिक्स के माध्यम से।</li>
          </ul>

          <h2 className="text-xl font-bold">2. जानकारी का उपयोग</h2>
          <p>आपकी जानकारी का उपयोग हम इन उद्देश्यों के लिए करते हैं:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>AI फसल विश्लेषण सेवा प्रदान करना</li>
            <li>आपके सवालों का जवाब देना</li>
            <li>न्यूज़लेटर और कृषि अपडेट भेजना (यदि आपने सब्सक्राइब किया है)</li>
            <li>वेबसाइट की कार्यप्रणाली सुधारना</li>
            <li>कानूनी आवश्यकताओं का पालन</li>
          </ul>

          <h2 className="text-xl font-bold">3. कुकीज़ और एनालिटिक्स</h2>
          <p>
            हम वेबसाइट का अनुभव बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। हम Google Analytics
            जैसी मानक एनालिटिक्स सेवाओं का उपयोग कर सकते हैं जो अनाम तकनीकी जानकारी एकत्र करती हैं।
          </p>

          <h2 className="text-xl font-bold">4. विज्ञापन (Google AdSense)</h2>
          <p>
            हमारी वेबसाइट विज्ञापन दिखाने के लिए Google AdSense जैसी तृतीय-पक्ष विज्ञापन सेवाओं का
            उपयोग कर सकती है। ये सेवाएं विज्ञापन प्रासंगिक बनाने के लिए कुकीज़ का उपयोग कर सकती हैं।
            आप Google के विज्ञापन सेटिंग्स के माध्यम से व्यक्तिगत विज्ञापन से ऑप्ट-आउट कर सकते हैं।
          </p>

          <h2 className="text-xl font-bold">5. जानकारी का साझाकरण</h2>
          <p>
            हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को नहीं बेचते। हम केवल इन परिस्थितियों में
            जानकारी साझा करते हैं:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>आपकी स्पष्ट सहमति से</li>
            <li>कानूनी आवश्यकताओं के अनुपालन में</li>
            <li>विश्वसनीय सेवा प्रदाताओं के साथ (होस्टिंग, ईमेल) जो हमारी गोपनीयता मानकों का पालन करते हैं</li>
          </ul>

          <h2 className="text-xl font-bold">6. डेटा सुरक्षा</h2>
          <p>
            हम आपकी जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपायों का उपयोग करते हैं।
            HTTPS एन्क्रिप्शन, सुरक्षित होस्टिंग, और सीमित पहुंच नीतियां।
          </p>

          <h2 className="text-xl font-bold">7. बच्चों की गोपनीयता</h2>
          <p>हमारी सेवाएं 13 वर्ष से कम आयु के बच्चों के लिए नहीं हैं।</p>

          <h2 className="text-xl font-bold">8. आपके अधिकार</h2>
          <p>आप कभी भी हमसे संपर्क करके इन अधिकारों का उपयोग कर सकते हैं:</p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>अपनी जानकारी की एक प्रति का अनुरोध</li>
            <li>गलत जानकारी का सुधार</li>
            <li>अपनी जानकारी को हटाने का अनुरोध</li>
            <li>न्यूज़लेटर से अनसब्सक्राइब</li>
          </ul>

          <h2 className="text-xl font-bold">9. नीति में परिवर्तन</h2>
          <p>
            हम इस नीति को समय-समय पर अपडेट कर सकते हैं। महत्वपूर्ण परिवर्तनों के बारे में हम वेबसाइट
            पर सूचित करेंगे।
          </p>

          <h2 className="text-xl font-bold">10. संपर्क</h2>
          <p>
            गोपनीयता से संबंधित किसी भी प्रश्न के लिए हमें{" "}
            <a href="mailto:support@kisanmitra.in" className="text-primary hover:underline">
              support@kisanmitra.in
            </a>{" "}
            पर लिखें।
          </p>
        </div>
      </article>
    </PageShell>
  );
}
