import { createServerFn } from "@tanstack/react-start";

type SubscriptionInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
};

function validate(d: SubscriptionInput): SubscriptionInput {
  if (!d || typeof d !== "object") throw new Error("Invalid subscription");
  if (typeof d.endpoint !== "string" || !/^https:\/\//i.test(d.endpoint) || d.endpoint.length > 1000) {
    throw new Error("Invalid endpoint");
  }
  if (typeof d.p256dh !== "string" || d.p256dh.length < 20 || d.p256dh.length > 200) {
    throw new Error("Invalid p256dh");
  }
  if (typeof d.auth !== "string" || d.auth.length < 4 || d.auth.length > 100) {
    throw new Error("Invalid auth");
  }
  return {
    endpoint: d.endpoint,
    p256dh: d.p256dh,
    auth: d.auth,
    userAgent: typeof d.userAgent === "string" ? d.userAgent.slice(0, 300) : undefined,
  };
}

export const subscribeToPush = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
      {
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        user_agent: data.userAgent ?? null,
      },
      { onConflict: "endpoint" },
    );
    if (error) {
      console.error("subscribeToPush failed", error);
      return { ok: false as const, error: "save_failed" };
    }
    return { ok: true as const };
  });

export const unsubscribeFromPush = createServerFn({ method: "POST" })
  .inputValidator((d: { endpoint: string }) => {
    if (!d?.endpoint || typeof d.endpoint !== "string") throw new Error("Invalid endpoint");
    return { endpoint: d.endpoint };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
    return { ok: true as const };
  });
