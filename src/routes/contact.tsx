import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "संपर्क करें | किसान मित्र" },
      { name: "description", content: "कोई सवाल, सुझाव या साझेदारी? किसान मित्र की टीम से सीधे संपर्क करें।" },
      { property: "og:title", content: "संपर्क करें | किसान मित्र" },
      { property: "og:description", content: "किसान मित्र से जुड़ें।" },
      { property: "og:url", content: "https://kisanlens.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/contact" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "नाम कम से कम 2 अक्षर का हो").max(100, "नाम बहुत लंबा है"),
  email: z.string().trim().email("सही ईमेल दर्ज करें").max(255),
  subject: z.string().trim().min(3, "विषय छोटा है").max(200),
  message: z.string().trim().min(10, "संदेश कम से कम 10 अक्षर का हो").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("धन्यवाद! आपका संदेश मिल गया। हम जल्द ही जवाब देंगे।");
    }, 700);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: "संपर्क" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">संपर्क करें</h1>
        <p className="mt-2 text-base text-muted-foreground">
          कोई सवाल, सुझाव या साझेदारी की बात — हमें लिखें। हम 24-48 घंटे में जवाब देंगे।
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <Card className="border border-border bg-card p-5">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold">ईमेल</p>
              <a href="mailto:support@kisanlens.com" className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                support@kisanlens.com
              </a>
            </Card>
            <Card className="border border-border bg-card p-5">
              <MessageCircle className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold">किसान सहायता</p>
              <p className="mt-1 text-sm text-muted-foreground">सोमवार – शनिवार, सुबह 9 बजे से शाम 6 बजे तक</p>
            </Card>
            <Card className="border border-border bg-card p-5">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold">कार्यालय</p>
              <p className="mt-1 text-sm text-muted-foreground">किसान मित्र संपादकीय कार्यालय, भारत</p>
            </Card>
          </div>

          <Card className="border border-border bg-card p-6 md:col-span-2">
            <h2 className="text-xl font-bold">संदेश भेजें</h2>
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground/80">आपका नाम *</label>
                  <Input
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="राम कुमार"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/80">ईमेल *</label>
                  <Input
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="aap@example.com"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80">विषय *</label>
                <Input
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="विषय लिखें"
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80">संदेश *</label>
                <Textarea
                  required
                  maxLength={2000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="अपना सवाल या सुझाव लिखें…"
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" disabled={submitting} className="rounded-xl bg-gradient-primary px-6">
                <Send className="mr-1.5 h-4 w-4" />
                {submitting ? "भेज रहे हैं…" : "संदेश भेजें"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
