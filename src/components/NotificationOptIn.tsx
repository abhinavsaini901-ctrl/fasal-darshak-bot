import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getExistingEndpoint,
  isPushAvailableHere,
  requestPermission,
  subscribeUser,
  unsubscribeUser,
} from "@/lib/push-client";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push.functions";

export function NotificationOptIn() {
  const [status, setStatus] = useState<"loading" | "available" | "subscribed" | "unsupported">("loading");
  const [reason, setReason] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const saveSub = useServerFn(subscribeToPush);
  const removeSub = useServerFn(unsubscribeFromPush);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const avail = isPushAvailableHere();
      if (!avail.ok) {
        if (!cancelled) {
          setStatus("unsupported");
          setReason(avail.reason);
        }
        return;
      }
      const endpoint = await getExistingEndpoint().catch(() => null);
      if (cancelled) return;
      setStatus(endpoint ? "subscribed" : "available");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async () => {
    setBusy(true);
    try {
      const perm = await requestPermission();
      if (perm !== "granted") {
        toast.error("नोटिफिकेशन permission नहीं मिला। ब्राउज़र सेटिंग में जाकर allow करें।");
        return;
      }
      const sub = await subscribeUser();
      const res = await saveSub({
        data: { ...sub, userAgent: navigator.userAgent },
      });
      if (!res.ok) throw new Error("save_failed");
      setStatus("subscribed");
      toast.success("बधाई हो! रोज़ सुबह 6 बजे ताज़ा कृषि खबरें मिलेंगी।");
    } catch (e) {
      console.error(e);
      toast.error("सब्सक्राइब नहीं हो पाया। थोड़ी देर बाद फिर कोशिश करें।");
    } finally {
      setBusy(false);
    }
  };

  const handleUnsubscribe = async () => {
    setBusy(true);
    try {
      const endpoint = await unsubscribeUser();
      if (endpoint) await removeSub({ data: { endpoint } });
      setStatus("available");
      toast.success("नोटिफिकेशन बंद कर दिए गए।");
    } catch (e) {
      console.error(e);
      toast.error("अनसब्सक्राइब नहीं हो पाया।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50 p-6 shadow-soft md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">रोज़ सुबह 6 बजे कृषि अपडेट</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              मंडी भाव, मौसम, सरकारी योजनाएं और देशभर की ताज़ा खबरें — सीधे आपके मोबाइल पर पुश नोटिफिकेशन में।
            </p>
            {status === "unsupported" && reason && (
              <p className="mt-2 text-xs font-medium text-amber-700">{reason}</p>
            )}
            {status !== "unsupported" && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                iPhone पर: पहले Safari में Share → "Add to Home Screen" करें, फिर होम स्क्रीन वाले आइकन से खोलकर allow करें।
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {status === "loading" && (
            <Button disabled className="h-11 rounded-xl">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          )}
          {status === "available" && (
            <Button onClick={handleSubscribe} disabled={busy} className="h-11 rounded-xl bg-gradient-primary px-5 font-bold">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
              {busy ? "जोड़ रहे हैं…" : "नोटिफिकेशन चालू करें"}
            </Button>
          )}
          {status === "subscribed" && (
            <Button onClick={handleUnsubscribe} disabled={busy} variant="outline" className="h-11 rounded-xl px-5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellOff className="h-4 w-4" />}
              {busy ? "हट रहा है…" : "नोटिफिकेशन बंद करें"}
            </Button>
          )}
          {status === "unsupported" && (
            <Button disabled variant="outline" className="h-11 rounded-xl px-5">
              उपलब्ध नहीं
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
