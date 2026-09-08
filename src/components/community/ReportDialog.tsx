import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { REPORT_REASONS } from "@/lib/community";

type Target = { postId?: string; commentId?: string } | null;

export function ReportDialog({
  target,
  onClose,
  userId,
}: {
  target: Target;
  onClose: () => void;
  userId: string | null;
}) {
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!userId) {
      toast.error("रिपोर्ट करने के लिए लॉगिन करें");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("community_reports").insert({
      reporter_id: userId,
      post_id: target?.postId ?? null,
      comment_id: target?.commentId ?? null,
      reason,
      details: details.trim() || null,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("रिपोर्ट भेज दी गई — धन्यवाद");
      setDetails("");
      onClose();
    }
  }

  return (
    <Dialog open={!!target} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>रिपोर्ट करें</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-2">
            {REPORT_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium ${
                  reason === r ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="कुछ और बताना चाहें तो लिखें (वैकल्पिक)"
          />
          <Button className="w-full" disabled={busy} onClick={submit}>
            रिपोर्ट भेजें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
