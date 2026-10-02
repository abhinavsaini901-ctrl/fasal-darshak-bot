import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "संपर्क करें | किसान मित्र" },
      { name: "description", content: "Kisan Lens को सवाल, सुझाव या वेबसाइट सामग्री में सुधार की सूचना ईमेल से भेजें।" },
      { property: "og:title", content: "संपर्क करें | किसान मित्र" },
      { property: "og:description", content: "किसान मित्र से जुड़ें।" },
      { property: "og:url", content: "https://kisanlens.com/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
    const { name, email, subject, message } = result.data;
    const body = `नाम: ${name}\nईमेल: ${email}\n\n${message}`;
    window.location.href = `mailto:info@kisanlens.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitting(false);
    toast.info("आपके ईमेल ऐप में संदेश तैयार है। भेजने के लिए वहाँ पुष्टि करें।");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumbs items={[{ label: "संपर्क" }]} />
        <h1 className="text-3xl font-bold md:text-4xl">संपर्क करें</h1>
        <p className="mt-2 text-base text-muted-foreground">
          सवाल, सुझाव या किसी जानकारी में सुधार बताने के लिए ईमेल करें।
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <div className="border-b border-border pb-4">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-bold">ईमेल</p>
              <a href="mailto:info@kisanlens.com" className="mt-1 block break-all text-sm text-muted-foreground hover:text-primary">info@kisanlens.com</a>
            </div>
          </div>

          <div className="border-t border-border pt-6 md:col-span-2 md:border-l md:border-t-0 md:pl-6 md:pt-0">
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
                {submitting ? "ईमेल ऐप खोल रहे हैं…" : "ईमेल में संदेश खोलें"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
