import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("कृपया सही ईमेल दर्ज करें");
      return;
    }
    setSubmitting(true);
    setSuccess(false);
    setTimeout(() => {
      setSubmitting(false);
      setEmail("");
      setSuccess(true);
      toast.success("सफलतापूर्वक सब्सक्राइब किया गया!");
      // auto-hide inline message after a few seconds
      setTimeout(() => setSuccess(false), 4000);
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
          onChange={(e) => {
            setEmail(e.target.value);
            if (success) setSuccess(false);
          }}
          className="h-11 flex-1 rounded-xl"
        />
        <Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-gradient-primary px-6">
          <Send className="mr-1.5 h-4 w-4" />
          {submitting ? "भेज रहे हैं…" : "सब्सक्राइब"}
        </Button>
      </form>

      {success && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-1"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          सफलतापूर्वक सब्सक्राइब किया गया!
        </div>
      )}

      <p className="mt-2 text-[11px] text-muted-foreground">
        हम कभी स्पैम नहीं भेजते। कभी भी अनसब्सक्राइब कर सकते हैं।
      </p>
    </section>
  );
}

