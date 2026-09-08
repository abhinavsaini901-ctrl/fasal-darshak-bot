import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, X, Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityUser } from "@/hooks/use-community-user";
import { PostCard } from "@/components/community/PostCard";
import { PostComposer } from "@/components/community/PostComposer";
import { ReportDialog } from "@/components/community/ReportDialog";
import {
  FILTERS,
  signImageUrls,
  type CommunityPost,
  type CommunityProfile,
} from "@/lib/community";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "किसान लेंस कम्युनिटी — किसानों का सवाल-जवाब मंच" },
      {
        name: "description",
        content:
          "किसान लेंस कम्युनिटी में किसान फसल की फोटो के साथ सवाल पूछें, बीमारी-कीट की पहचान पर सलाह पाएं और अपना खेती अनुभव साझा करें।",
      },
      { property: "og:title", content: "किसान लेंस कम्युनिटी 🌾" },
      {
        property: "og:description",
        content: "फसल की फोटो के साथ सवाल पूछें और दूसरे किसानों से सलाह पाएं।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

async function fetchFeed(currentUserId: string | null) {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  const posts = (data ?? []) as CommunityPost[];

  const userIds = Array.from(new Set(posts.map((p) => p.user_id)));
  const profiles: Record<string, CommunityProfile> = {};
  if (userIds.length) {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, location")
      .in("id", userIds);
    (p ?? []).forEach((row) => {
      profiles[row.id] = row as CommunityProfile;
    });
  }

  const myLikes = new Set<string>();
  if (currentUserId && posts.length) {
    const { data: likes } = await supabase
      .from("community_post_likes")
      .select("post_id")
      .eq("user_id", currentUserId)
      .in("post_id", posts.map((p) => p.id));
    (likes ?? []).forEach((l) => myLikes.add(l.post_id));
  }

  const imageUrls = await signImageUrls(posts.flatMap((p) => p.images));

  return {
    posts: posts.map((p) => ({ ...p, profiles: profiles[p.user_id] ?? null })),
    myLikes,
    imageUrls,
  };
}

function CommunityPage() {
  const qc = useQueryClient();
  const { userId } = useCommunityUser();
  const [filter, setFilter] = useState<string>("सभी");
  const [q, setQ] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<CommunityPost | null>(null);
  const [reportTarget, setReportTarget] = useState<{ postId?: string; commentId?: string } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["community-posts", userId],
    queryFn: () => fetchFeed(userId),
  });

  const posts = useMemo(() => {
    const list = data?.posts ?? [];
    const needle = q.trim().toLowerCase();
    return list.filter((p) => {
      const matchFilter =
        filter === "सभी" || p.crop === filter || p.category === filter;
      const matchQuery =
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        p.body.toLowerCase().includes(needle) ||
        p.crop.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle);
      return matchFilter && matchQuery;
    });
  }, [data, filter, q]);

  function requireLogin() {
    toast.error("इसके लिए पहले लॉगिन करें");
  }

  async function toggleLike(post: CommunityPost) {
    if (!userId) return requireLogin();
    const liked = data?.myLikes.has(post.id) ?? false;
    const { error } = liked
      ? await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", userId)
      : await supabase
          .from("community_post_likes")
          .insert({ post_id: post.id, user_id: userId });
    if (error) toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  }

  async function deletePost(post: CommunityPost) {
    if (!confirm("यह पोस्ट डिलीट करनी है?")) return;
    const { error } = await supabase.from("community_posts").delete().eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("पोस्ट डिलीट हो गई");
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  }

  function openComposer(post: CommunityPost | null) {
    if (!userId) return requireLogin();
    setEditing(post);
    setComposerOpen(true);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Kisan Lens Community 🌾
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            किसान अपने सवाल, फसल की फोटो और खेती का अनुभव दूसरे किसानों के साथ साझा करें।
          </p>
        </header>

        <div className="sticky top-16 z-30 -mx-4 mt-5 bg-background/95 px-4 py-3 backdrop-blur">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="किसान सवाल या फसल खोजें..."
              className="rounded-full pl-9 text-[15px]"
            />
          </div>
          <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/75"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => openComposer(null)}
          className="mt-3 w-full rounded-full bg-gradient-primary py-6 text-base font-bold"
        >
          <Plus className="mr-1.5 h-5 w-5" /> पोस्ट करें
        </Button>

        {!userId && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            पोस्ट या कमेंट करने के लिए{" "}
            <Link to="/auth" className="font-semibold text-primary underline">
              लॉगिन करें
            </Link>
          </p>
        )}

        <div className="mt-5 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center">
              <p className="text-lg font-bold text-foreground">
                Community में अभी कोई पोस्ट नहीं है 🌱
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                सबसे पहली पोस्ट आप करें और दूसरे किसानों की मदद करें।
              </p>
              <Button onClick={() => openComposer(null)} className="mt-4 rounded-full bg-gradient-primary">
                <Plus className="mr-1.5 h-4 w-4" /> पोस्ट करें
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                imageUrls={data?.imageUrls ?? {}}
                currentUserId={userId}
                liked={data?.myLikes.has(post.id) ?? false}
                onToggleLike={toggleLike}
                onEdit={openComposer}
                onDelete={deletePost}
                onReport={(t) => (userId ? setReportTarget(t) : requireLogin())}
                onOpenImage={setLightbox}
              />
            ))
          )}
        </div>
      </div>

      {userId && (
        <PostComposer
          open={composerOpen}
          onOpenChange={setComposerOpen}
          userId={userId}
          editing={editing}
        />
      )}

      <ReportDialog target={reportTarget} onClose={() => setReportTarget(null)} userId={userId} />

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white"
            aria-label="बंद करें"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={lightbox} alt="फसल की फोटो" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </PageShell>
  );
}
