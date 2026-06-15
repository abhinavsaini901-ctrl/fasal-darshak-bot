import { createFileRoute } from "@tanstack/react-router";
import { buildPushPayload, type PushSubscription, type VapidKeys } from "@block65/webcrypto-web-push";
import { VAPID_PUBLIC_KEY, VAPID_SUBJECT } from "@/lib/push-config";
import { getLiveAgriNews } from "@/lib/news.functions";

type Row = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

async function sendOne(row: Row, body: string, vapid: VapidKeys): Promise<number> {
  const sub: PushSubscription = {
    endpoint: row.endpoint,
    expirationTime: null,
    keys: { p256dh: row.p256dh, auth: row.auth },
  };
  const payload = await buildPushPayload({ data: body, options: { ttl: 60 * 60 * 6 } }, sub, vapid);
  const res = await fetch(row.endpoint, payload as unknown as RequestInit);
  return res.status;
}

export const Route = createFileRoute("/api/public/hooks/send-morning-push")({
  server: {
    handlers: {
      POST: async () => {
        const privateKey = process.env.VAPID_PRIVATE_KEY;
        if (!privateKey) {
          return new Response(JSON.stringify({ ok: false, error: "VAPID_PRIVATE_KEY missing" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        // Get top 3 freshest news
        const news = await getLiveAgriNews();
        const top = news.items.slice(0, 3);
        if (top.length === 0) {
          return Response.json({ ok: true, sent: 0, reason: "no news" });
        }
        const lead = top[0];
        const others = top.slice(1).map((n) => n.title).join(" • ");
        const body = JSON.stringify({
          title: `🌾 सुप्रभात! ${lead.title.slice(0, 80)}`,
          body: others ? `और ख़बरें: ${others}`.slice(0, 200) : lead.summary.slice(0, 200),
          url: `/news/live/${lead.id}`,
          tag: "morning-news",
        });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: subs, error } = await supabaseAdmin
          .from("push_subscriptions")
          .select("id, endpoint, p256dh, auth");
        if (error) {
          console.error("fetch subs failed", error);
          return Response.json({ ok: false, error: "db" }, { status: 500 });
        }

        const vapid: VapidKeys = {
          subject: VAPID_SUBJECT,
          publicKey: VAPID_PUBLIC_KEY,
          privateKey,
        };

        let sent = 0;
        let removed = 0;
        const deadIds: string[] = [];
        // Limit concurrency to 10
        const rows = (subs ?? []) as Row[];
        for (let i = 0; i < rows.length; i += 10) {
          const chunk = rows.slice(i, i + 10);
          const results = await Promise.allSettled(chunk.map((r) => sendOne(r, body, vapid)));
          results.forEach((r, idx) => {
            if (r.status === "fulfilled") {
              const status = r.value;
              if (status >= 200 && status < 300) sent++;
              else if (status === 404 || status === 410) deadIds.push(chunk[idx].id);
              else console.warn("push non-2xx", status, chunk[idx].endpoint.slice(0, 60));
            } else {
              console.warn("push rejected", r.reason);
            }
          });
        }

        if (deadIds.length > 0) {
          const { error: delErr } = await supabaseAdmin
            .from("push_subscriptions")
            .delete()
            .in("id", deadIds);
          if (!delErr) removed = deadIds.length;
        }

        // Mark last_sent_at for live subscriptions (best-effort)
        try {
          const liveIds = rows.map((r) => r.id).filter((id) => !deadIds.includes(id));
          if (liveIds.length > 0) {
            await supabaseAdmin
              .from("push_subscriptions")
              .update({ last_sent_at: new Date().toISOString() })
              .in("id", liveIds);
          }
        } catch (e) {
          console.warn("update last_sent_at failed", e);
        }

        return Response.json({ ok: true, total: rows.length, sent, removed });
      },
    },
  },
});
