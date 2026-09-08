import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  MapPin,
  Trash2,
  Pencil,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { timeAgo, initials, type CommunityPost } from "@/lib/community";
import { CommentThread } from "./CommentThread";

type Props = {
  post: CommunityPost;
  imageUrls: Record<string, string>;
  currentUserId: string | null;
  liked: boolean;
  onToggleLike: (post: CommunityPost) => void;
  onEdit: (post: CommunityPost) => void;
  onDelete: (post: CommunityPost) => void;
  onReport: (target: { postId?: string; commentId?: string }) => void;
  onOpenImage: (url: string) => void;
};

export function PostCard({
  post,
  imageUrls,
  currentUserId,
  liked,
  onToggleLike,
  onEdit,
  onDelete,
  onReport,
  onOpenImage,
}: Props) {
  const [showComments, setShowComments] = useState(false);
  const isOwner = currentUserId === post.user_id;
  const name = post.profiles?.display_name || "किसान";
  const avatar = post.profiles?.avatar_url || null;
  const images = post.images.map((p) => imageUrls[p]).filter(Boolean) as string[];

  async function share() {
    const url = `${window.location.origin}/community?post=${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("लिंक कॉपी हो गया");
      }
    } catch {
      /* user cancelled */
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center gap-3 px-4 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-base font-bold text-primary">
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            initials(name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {timeAgo(post.created_at)}
            {post.location ? (
              <>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{post.location}</span>
              </>
            ) : null}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full p-2 text-muted-foreground hover:bg-secondary" aria-label="विकल्प">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner && (
              <DropdownMenuItem onClick={() => onEdit(post)}>
                <Pencil className="mr-2 h-4 w-4" /> पोस्ट एडिट करें
              </DropdownMenuItem>
            )}
            {isOwner && (
              <DropdownMenuItem onClick={() => onDelete(post)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> पोस्ट डिलीट करें
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onReport({ postId: post.id })}>
              <Flag className="mr-2 h-4 w-4" /> रिपोर्ट करें
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="px-4 pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            🌾 {post.crop}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground/70">
            {post.category}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug text-foreground">{post.title}</h3>
        {post.body && (
          <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
            {post.body}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div
          className={`mt-3 grid gap-1 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => onOpenImage(url)}
              className={`${images.length === 3 && i === 0 ? "col-span-2" : ""} block`}
            >
              <img
                src={url}
                alt={`${post.title} — फोटो ${i + 1}`}
                loading="lazy"
                className="h-full max-h-80 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 border-t border-border px-2 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleLike(post)}
          className={liked ? "text-red-600" : "text-muted-foreground"}
        >
          <Heart className={`mr-1.5 h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {post.like_count}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments((v) => !v)}
          className="text-muted-foreground"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" />
          {post.comment_count}
        </Button>
        <Button variant="ghost" size="sm" onClick={share} className="ml-auto text-muted-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {showComments && (
        <CommentThread
          postId={post.id}
          postOwnerId={post.user_id}
          currentUserId={currentUserId}
          onReport={onReport}
        />
      )}
    </article>
  );
}
