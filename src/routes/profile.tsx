import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Loader2, Camera, Plus } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityUser } from "@/hooks/use-community-user";
import { PostCard } from "@/components/community/PostCard";
import { PostComposer } from "@/components/community/PostComposer";
import {
  compressImage,
  initials,
  isAllowedImage,
  resolveAvatar,
  signImageUrls,
  COMMUNITY_BUCKET,
  type CommunityPost,
  type CommunityProfile,
} from "@/lib/community";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "मेरी प्रोफ़ाइल | किसान लेंस कम्युनिटी" },
      {
        name: "description",
        content: "किसान लेंस कम्युनिटी में अपनी प्रोफ़ाइल, अपनी पोस्ट और कमेंट देखें और मैनेज करें।",
      },
      { property: "og:title", content: "मेरी प्रोफ़ाइल | किसान लेंस" },
      { property: "og:description", content: "अपनी कम्युनिटी पोस्ट और प्रोफ़ाइल मैनेज करें।" },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

async function fetchMine(userId: string) {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const posts = (data ?? []) as CommunityPost[];
  const { count: commentCount } = await supabase
    .from("community_comments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  const { data: likes } = await supabase
    .from("community_post_likes")
    .select("post_id")
    .eq("user_id", userId);
  const imageUrls = await signImageUrls(posts.flatMap((p) => p.images));
  return {
    posts,
    commentCount: commentCount ?? 0,
    myLikes: new Set((likes ?? []).map((l) => l.post_id)),
    imageUrls,
  };
}

function ProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { userId, profile, setProfile, ready } = useCommunityUser();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<CommunityPost | null>(null);

  useEffect(() => {
    setName(profile?.display_name ?? "");
    setLocation(profile?.location ?? "");
  }, [profile]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-community-posts", userId],
    queryFn: () => fetchMine(userId as string),
    enabled: !!userId,
  });

  async function saveProfile() {
    if (!userId) return;
    setSaving(true);
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ display_name: name.trim() || "किसान", location: location.trim() || null })
      .eq("id", userId)
      .select("id, display_name, avatar_url, location")
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setProfile(updated as CommunityProfile);
    qc.invalidateQueries({ queryKey: ["community-posts"] });
    toast.success("प्रोफ़ाइल सेव हो गई");
  }

  async function uploadAvatar(file: File) {
    if (!userId) return;
    if (!isAllowedImage(file)) return toast.error("सिर्फ JPG, PNG या WEBP फोटो चुनें");
    const blob = await compressImage(file, 400, 0.85);
    const path = `${userId}/avatar-${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from(COMMUNITY_BUCKET)
      .upload(path, blob, { contentType: "image/jpeg" });
    if (error) return toast.error(error.message);
    const { data: updated, error: upErr } = await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", userId)
      .select("id, display_name, avatar_url, location")
      .single();
    if (upErr) return toast.error(upErr.message);
    setProfile(await resolveAvatar(updated as CommunityProfile));
    toast.success("प्रोफ़ाइल फोटो अपडेट हो गई");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!ready) {
    return (
      <PageShell>
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!userId) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-extrabold text-foreground">मेरी प्रोफ़ाइल 👤</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            कम्युनिटी में पोस्ट, कमेंट और अपनी प्रोफ़ाइल देखने के लिए लॉगिन करें।
          </p>
          <Link to="/auth">
            <Button className="mt-5 rounded-full bg-gradient-primary px-8 py-6 text-base font-bold">
              लॉगिन / नया अकाउंट
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <label className="relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full bg-primary/15">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="प्रोफ़ाइल फोटो" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                  {initials(profile?.display_name ?? "किसान")}
                </span>
              )}
              <span className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground">
                <Camera className="h-3 w-3" />
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadAvatar(f);
                  e.target.value = "";
                }}
              />
            </label>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-foreground">
                {profile?.display_name ?? "किसान"}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.posts.length ?? 0} पोस्ट • {data?.commentCount ?? 0} कमेंट
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="mr-1.5 h-4 w-4" /> लॉगआउट
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>नाम</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>गाँव / जिला</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <Button className="mt-3 w-full rounded-full" disabled={saving} onClick={saveProfile}>
            प्रोफ़ाइल सेव करें
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">मेरी पोस्ट</h2>
          <Button
            size="sm"
            className="rounded-full bg-gradient-primary"
            onClick={() => {
              setEditing(null);
              setComposerOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> पोस्ट करें
          </Button>
        </div>

        <div className="mt-3 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (data?.posts.length ?? 0) === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
              आपने अभी कोई पोस्ट नहीं की है 🌱
            </p>
          ) : (
            data!.posts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, profiles: profile }}
                imageUrls={data!.imageUrls}
                currentUserId={userId}
                liked={data!.myLikes.has(post.id)}
                onToggleLike={async (p) => {
                  const liked = data!.myLikes.has(p.id);
                  if (liked)
                    await supabase
                      .from("community_post_likes")
                      .delete()
                      .eq("post_id", p.id)
                      .eq("user_id", userId);
                  else
                    await supabase
                      .from("community_post_likes")
                      .insert({ post_id: p.id, user_id: userId });
                  qc.invalidateQueries({ queryKey: ["my-community-posts"] });
                }}
                onEdit={(p) => {
                  setEditing(p);
                  setComposerOpen(true);
                }}
                onDelete={async (p) => {
                  if (!confirm("यह पोस्ट डिलीट करनी है?")) return;
                  const { error } = await supabase.from("community_posts").delete().eq("id", p.id);
                  if (error) return toast.error(error.message);
                  toast.success("पोस्ट डिलीट हो गई");
                  qc.invalidateQueries({ queryKey: ["my-community-posts"] });
                }}
                onReport={() => toast.info("अपनी पोस्ट रिपोर्ट करने की ज़रूरत नहीं")}
                onOpenImage={(url) => window.open(url, "_blank")}
              />
            ))
          )}
        </div>
      </div>

      <PostComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        userId={userId}
        editing={editing}
      />
    </PageShell>
  );
}
