import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("कृपया सही ईमेल दर्ज करें");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setEmail("");
      toast.success("धन्यवाद! आप जल्द ही हमसे जुड़ जाएंगे।");
    }, 600);
  };

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-card p-6 shadow-soft md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">साप्ताहिक कृषि न्यूज़लेटर</h2>
          <p className="text-sm text-muted-foreground">मंडी भाव, मौसम, योजनाएं — सीधे आपके इनबॉक्स में।</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          maxLength={120}
          placeholder="aap@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 flex-1 rounded-xl"
        />
        <Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-gradient-primary px-6">
          <Send className="mr-1.5 h-4 w-4" />
          {submitting ? "भेज रहे हैं…" : "सब्सक्राइब"}
        </Button>
      </form>
      <p className="mt-2 text-[11px] text-muted-foreground">
        हम कभी स्पैम नहीं भेजते। कभी भी अनसब्सक्राइब कर सकते हैं।
      </p>
    </section>
  );
}
