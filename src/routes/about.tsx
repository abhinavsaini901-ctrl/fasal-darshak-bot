import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Users, BookOpen, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "हमारे बारे में | किसान मित्र — AI कृषि पोर्टल" },
      { name: "description", content: "किसान मित्र भारतीय किसानों के लिए बना AI-आधारित कृषि पोर्टल है। हमारा मिशन, टीम और मूल्यों के बारे में जानें।" },
      { property: "og:title", content: "हमारे बारे में | किसान मित्र" },
      { property: "og:description", content: "किसानों के लिए AI-आधारित कृषि सहायक।" },
      { property: "og:url", content: "https://kisanlens.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/about" }],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs items={[{ label: "हमारे बारे में" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">हमारे बारे में</h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          किसान मित्र भारतीय किसानों के लिए बना AI-आधारित कृषि पोर्टल है। हमारा लक्ष्य है हर छोटे और
          सीमांत किसान तक आधुनिक खेती की जानकारी सरल हिंदी में पहुंचाना।
        </p>

        <Card className="mt-8 border border-border bg-gradient-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">हमारा मिशन</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            भारत में 50% से अधिक आबादी कृषि पर निर्भर है, लेकिन सही जानकारी समय पर सही किसान तक नहीं
            पहुंच पाती। हम तकनीक, खासकर AI और मोबाइल टेक्नोलॉजी का उपयोग करके इस अंतर को पाटना चाहते
            हैं — फसल रोग पहचान से लेकर मंडी भाव और सरकारी योजनाओं तक, सब कुछ हिंदी में, मुफ्त।
          </p>
        </Card>

        <h2 className="mt-12 text-2xl font-bold">हम क्या प्रदान करते हैं</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Card className="border border-border bg-card p-5">
            <Leaf className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">AI फसल डॉक्टर</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              फसल की फोटो से तुरंत बीमारी पहचान और सटीक इलाज की सलाह।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <BookOpen className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">विस्तृत कृषि लेख</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              गेहूं, धान, सब्जियों, सिंचाई, खाद और योजनाओं पर 30+ विस्तृत लेख।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">किसान समुदाय</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              अनुभवी किसानों की सफलता की कहानियां और सलाह।
            </p>
          </Card>
          <Card className="border border-border bg-card p-5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-base font-bold">विश्वसनीय जानकारी</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ICAR, KVK और कृषि विश्वविद्यालयों के स्रोतों पर आधारित।
            </p>
          </Card>
        </div>

        <h2 className="mt-12 text-2xl font-bold">हमारी टीम</h2>
        <p className="mt-3 text-base text-foreground/90">
          किसान मित्र की संपादकीय टीम में कृषि स्नातक, अनुभवी किसान सलाहकार, और सॉफ्टवेयर इंजीनियर
          शामिल हैं। हम भारतीय कृषि अनुसंधान परिषद (ICAR), कृषि विज्ञान केंद्र (KVK), और राज्य कृषि
          विश्वविद्यालयों के प्रकाशित दिशानिर्देशों का संदर्भ लेकर सामग्री तैयार करते हैं।
        </p>

        <h2 className="mt-12 text-2xl font-bold">संपादकीय नीति</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base text-foreground/90">
          <li>हर लेख प्रकाशन से पहले विशेषज्ञ द्वारा समीक्षित किया जाता है।</li>
          <li>हम केवल वैज्ञानिक रूप से सिद्ध जानकारी प्रदान करते हैं।</li>
          <li>कीटनाशकों और दवाओं की सिफारिश हमेशा अनुमोदित मात्रा के अनुसार होती है।</li>
          <li>लेख नियमित रूप से अपडेट किए जाते हैं।</li>
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/scanner">
            <Button className="rounded-xl bg-gradient-primary">AI फसल स्कैन आज़माएं</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-xl">संपर्क करें</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
