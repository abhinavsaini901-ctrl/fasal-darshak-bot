import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Heart,
  Loader2,
  MessageCircle,
  Plus,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityUser } from "@/hooks/use-community-user";
import {
  resolveAvatars,
  signImageUrls,
  timeAgo,
  initials,
  type CommunityPost,
  type CommunityProfile,
} from "@/lib/community";
import { toast } from "sonner";

async function fetchPreview(currentUserId: string | null) {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);
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
    await resolveAvatars(profiles);
  }

  const myLikes = new Set<string>();
  if (currentUserId && posts.length) {
    const { data: likes } = await supabase
      .from("community_post_likes")
      .select("post_id")
      .eq("user_id", currentUserId)
      .in(
        "post_id",
        posts.map((p) => p.id),
      );
    (likes ?? []).forEach((l) => myLikes.add(l.post_id));
  }

  const imageUrls = await signImageUrls(posts.flatMap((p) => p.images));
  return {
    posts: posts.map((p) => ({
      ...p,
      profiles: profiles[p.user_id] ?? null,
    })),
    myLikes,
    imageUrls,
  };
}

type PreviewData = Awaited<ReturnType<typeof fetchPreview>>;

function PreviewCard({
  post,
  imageUrl,
  liked,
  onToggleLike,
  onShare,
}: {
  post: CommunityPost;
  imageUrl: string | undefined;
  liked: boolean;
  onToggleLike: () => void;
  onShare: () => void;
}) {
  const name = post.profiles?.display_name || "किसान";
  const avatar = post.profiles?.avatar_url || null;

  return (
    <Card className="flex flex-col overflow-hidden border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-strong">
      <header className="flex items-center gap-3 px-4 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-base font-bold text-primary">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            initials(name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          <p className="text-[11px] text-muted-foreground">
            {timeAgo(post.created_at)}
          </p>
        </div>
      </header>

      <Link to="/community" className="group flex flex-1 flex-col px-4 pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            🌾 {post.crop}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground/70">
            {post.category}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary">
          {post.title}
        </h3>
        {post.body && (
          <p className="mt-1.5 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
            {post.body}
          </p>
        )}
        {imageUrl && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={post.title}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </Link>

      <div className="mt-auto flex items-center gap-1 border-t border-border px-2 py-2">
        <button
          type="button"
          onClick={onToggleLike}
          aria-label="लाइक"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
            liked
              ? "text-red-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {post.like_count}
        </button>
        <span className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          {post.comment_count}
        </span>
        <button
          type="button"
          onClick={onShare}
          aria-label="शेयर"
          className="ml-auto inline-flex items-center rounded-lg p-2 text-muted-foreground transition hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

export function CommunityPreviewSection() {
  const qc = useQueryClient();
  const { userId } = useCommunityUser();
  const { data, isLoading } = useQuery<PreviewData>({
    queryKey: ["community-preview", userId],
    queryFn: () => fetchPreview(userId),
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.posts ?? [];

  async function toggleLike(postId: string) {
    if (!userId) {
      toast.error("पहले लॉगिन करें");
      return;
    }
    const liked = data?.myLikes.has(postId) ?? false;
    const { error } = liked
      ? await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId)
      : await supabase
          .from("community_post_likes")
          .insert({ post_id: postId, user_id: userId });
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["community-preview"] });
  }

  async function share(post: CommunityPost) {
    const url = `${window.location.origin}/community?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("लिंक कॉपी हो गया");
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <section className="bg-gradient-hero px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Users className="h-3.5 w-3.5" /> किसान समुदाय
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
              🌾 Kisan Lens Community
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              अपने सवाल, फसल की फोटो और खेती का अनुभव दूसरे किसानों के साथ
              साझा करें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
            >
              <Link to="/community">
                सभी पोस्ट
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-gradient-primary px-5 font-bold text-primary-foreground"
            >
              <Link to={userId ? "/community" : "/auth"}>
                <Plus className="mr-1 h-4 w-4" /> पोस्ट करें
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="h-56 animate-pulse border border-border bg-muted"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-8 text-center">
              <p className="text-lg font-bold text-foreground">
                Community में अभी कोई पोस्ट नहीं 🌱
              </p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                सबसे पहली पोस्ट आप करें — अपनी फसल की फोटो, सवाल या खेती का
                अनुभव साझा करें।
              </p>
              <Button
                asChild
                className="mt-4 rounded-full bg-gradient-primary px-5 font-bold text-primary-foreground"
              >
                <Link to={userId ? "/community" : "/auth"}>
                  <Plus className="mr-1 h-4 w-4" /> पोस्ट करें
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PreviewCard
                  key={post.id}
                  post={post}
                  imageUrl={
                    post.images[0]
                      ? (data?.imageUrls[post.images[0]] ?? undefined)
                      : undefined
                  }
                  liked={data?.myLikes.has(post.id) ?? false}
                  onToggleLike={() => toggleLike(post.id)}
                  onShare={() => share(post)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
