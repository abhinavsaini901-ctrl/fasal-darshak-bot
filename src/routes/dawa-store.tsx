import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical, ArrowLeft, Leaf } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dawa-store")({
  component: DawaStorePage,
  head: () => ({
    meta: [
      { title: "कृषि दवा स्टोर — जैविक कीट नियंत्रक | किसान मित्र" },
      {
        name: "description",
        content:
          "नीम तेल, बीटी, ट्राइकोडर्मा, गोमूत्र अर्क जैसे जैविक कीट नियंत्रकों की उपयोग विधि व मात्रा — हिंदी में।",
      },
      { property: "og:title", content: "जैविक कीट नियंत्रक — कृषि दवा गाइड" },
      {
        property: "og:description",
        content: "रसायन मुक्त खेती के लिए प्रभावी जैविक कीट नियंत्रकों की पूरी जानकारी।",
      },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/dawa-store" }],
  }),
});

const ORGANIC = [
  {
    name: "नीम तेल (Neem Oil)",
    use: "रस चूसने वाले कीट (माहू, सफेद मक्खी, थ्रिप्स) पर अत्यंत प्रभावी।",
    dose: "3-5 मिली प्रति लीटर पानी, 10-15 दिन के अंतराल पर छिड़काव।",
    benefit: "मिट्टी व लाभदायक कीटों के लिए सुरक्षित। फसल पर अवशेष नहीं छोड़ता।",
  },
  {
    name: "बीटी (Bacillus thuringiensis)",
    use: "इल्ली (कैटरपिलर) वर्ग के कीट — फल छेदक, तना छेदक, हरी इल्ली के नियंत्रण के लिए।",
    dose: "1-2 ग्राम प्रति लीटर पानी, शाम के समय छिड़काव करें।",
    benefit: "केवल हानिकारक इल्लियों पर असर करता है, मित्र कीट सुरक्षित रहते हैं।",
  },
  {
    name: "ट्राइकोडर्मा विरिडी",
    use: "मिट्टी जनित फफूंद रोग (उकठा, जड़ सड़न, कॉलर रॉट) से बचाव।",
    dose: "4-5 ग्राम प्रति किग्रा बीज से उपचार, या 2 किग्रा/एकड़ गोबर खाद में मिलाकर।",
    benefit: "जैविक फफूंदनाशक — पौधे की प्रतिरोधक क्षमता बढ़ाता है।",
  },
  {
    name: "ब्यूवेरिया बेसियाना",
    use: "सफेद मक्खी, थ्रिप्स, माहू और दीमक के नियंत्रण में उपयोगी।",
    dose: "5 ग्राम प्रति लीटर पानी, सुबह या शाम छिड़काव।",
    benefit: "जैविक कीटनाशक फफूंद — कीट के शरीर पर पनपकर उसे नष्ट करती है।",
  },
  {
    name: "गोमूत्र अर्क",
    use: "बहु-उद्देशीय कीट विकर्षक व पौध वृद्धि वर्धक।",
    dose: "1 लीटर गोमूत्र + 10 लीटर पानी; पत्तियों पर छिड़काव।",
    benefit: "घर पर ही बनाया जा सकता है — पूर्णतः मुफ्त व रसायन मुक्त।",
  },
  {
    name: "नीम खली (Neem Cake)",
    use: "मिट्टी में मौजूद निमेटोड (सूत्रकृमि) व भूमिगत कीटों के नियंत्रण के लिए।",
    dose: "200-250 किग्रा प्रति एकड़ — बुवाई से पहले मिट्टी में मिलाएं।",
    benefit: "जैविक खाद के रूप में भी कार्य करती है — मिट्टी की उर्वरता बढ़ाती है।",
  },
];

function DawaStorePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> होम पर वापस जाएं
          </Button>
        </Link>

        <div className="mb-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            कृषि दवा स्टोर — जैविक कीट नियंत्रक
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            रसायन मुक्त खेती के लिए प्रभावी व सुरक्षित जैविक कीट नियंत्रकों की पूरी जानकारी। ये उपाय
            पर्यावरण, मिट्टी और किसान — तीनों के लिए सुरक्षित हैं।
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {ORGANIC.map((o) => (
            <Card key={o.name} className="border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-foreground">{o.name}</h2>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <p><strong className="text-foreground">उपयोग:</strong> <span className="text-muted-foreground">{o.use}</span></p>
                <p><strong className="text-foreground">मात्रा:</strong> <span className="text-muted-foreground">{o.dose}</span></p>
                <p><strong className="text-foreground">लाभ:</strong> <span className="text-muted-foreground">{o.benefit}</span></p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border border-border bg-emerald-50 p-5 text-sm text-emerald-900">
          <strong>सलाह:</strong> जैविक कीट नियंत्रकों का छिड़काव सुबह या शाम के समय करें। तेज धूप में
          छिड़काव से असर कम हो सकता है। गंभीर कीट प्रकोप की स्थिति में अपने नज़दीकी कृषि विज्ञान केंद्र
          (KVK) से सलाह अवश्य लें।
        </Card>
      </section>
    </PageShell>
  );
}
