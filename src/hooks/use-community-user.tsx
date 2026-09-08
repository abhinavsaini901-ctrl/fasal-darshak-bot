import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ensureProfile, resolveAvatar, type CommunityProfile } from "@/lib/community";

/** Tracks the signed-in user and makes sure they have a community profile. */
export function useCommunityUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load(id: string | null, email?: string | null) {
      if (!active) return;
      setUserId(id);
      if (!id) {
        setProfile(null);
        setReady(true);
        return;
      }
      try {
        const p = await resolveAvatar(await ensureProfile(id, email));
        if (active) setProfile(p);
      } catch {
        /* profile can be created later */
      }
      if (active) setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user?.id ?? null, data.user?.email));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      load(session?.user?.id ?? null, session?.user?.email);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { userId, profile, setProfile, ready };
}
