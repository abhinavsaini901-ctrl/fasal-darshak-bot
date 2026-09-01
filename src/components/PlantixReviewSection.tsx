import { useState } from "react";
import { ClipboardCheck, ClipboardCopy, Mail, MessageSquareQuote } from "lucide-react";

import { Button } from "@/components/ui/button";

const HINDI_MESSAGE = `नमस्ते Plantix Team,

मैंने Kisan Lens नाम का एक AI-based किसान प्रोजेक्ट बनाया है। मैं आपसे विनम्र अनुरोध करता हूँ कि कृपया मेरी वेबसाइट और प्रोजेक्ट का जल्द से जल्द review करें। मैंने इसमें किसानों के लिए कई advanced AI features जोड़े हैं। कृपया मुझे जल्द अपना feedback दें और बताएं कि क्या आप मेरे project में interested हैं।

धन्यवाद।`;

const ENGLISH_MESSAGE = `Hello Plantix Team,

I have created an AI-based farmer project called Kisan Lens. I kindly request you to review my website and project as soon as possible. I have added several advanced AI features designed to help farmers. Please review my project at your earliest convenience and let me know your feedback and whether you are interested in the project.

Thank you.`;

export function PlantixReviewSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `${HINDI_MESSAGE}\n\n---\n\n${ENGLISH_MESSAGE}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback is silent; button state remains unchanged.
    }
  };

  return (
    <section className="border-b border-border bg-gradient-to-b from-background to-emerald-50/30 px-4 py-8 dark:from-background dark:to-emerald-950/10 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {/* Decorative top accent */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-600" />

          {/* Header */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  Request for Project Review
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Open message to the Plantix team
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              Kisan Lens
            </span>
          </div>

          {/* Hindi message */}
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              हिंदी में
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground sm:text-base">
              {HINDI_MESSAGE}
            </p>
          </div>

          {/* English message */}
          <div className="mt-4 rounded-2xl border border-border bg-background p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              In English
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground sm:text-base">
              {ENGLISH_MESSAGE}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-11 w-full rounded-xl border-border px-4 text-sm font-semibold sm:w-auto"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="mr-2 h-4 w-4 text-emerald-600" />
                  Message Copied
                </>
              ) : (
                <>
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Copy Message
                </>
              )}
            </Button>

            <a
              href="mailto:info@plantix.net?subject=Project%20Review%20Request%20-%20Kisan%20Lens&body=Dear%20Plantix%20Team%2C%0A%0AI%20have%20created%20an%20AI-based%20farmer%20project%20called%20Kisan%20Lens.%20I%20kindly%20request%20you%20to%20review%20my%20website%20and%20project%20as%20soon%20as%20possible.%0A%0AWebsite%3A%20https%3A%2F%2Fkisanlens.com%2F%0A%0AThank%20you."
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Plantix Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
