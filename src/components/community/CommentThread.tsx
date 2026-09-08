import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Flag, Pencil, Trash2, Reply } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  initials,
  timeAgo,
  type CommunityComment,
  type CommunityProfile,
} from "@/lib/community";

async function fetchComments(postId: string) {
  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as CommunityComment[];
  const ids = Array.from(new Set(rows.map((r) => r.user_id)));
  let profiles: Record<string, CommunityProfile> = {};
  if (ids.length) {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, location")
      .in("id", ids);
    (p ?? []).forEach((row) => {
      profiles[row.id] = row as CommunityProfile;
    });
  }
  const { data: likes } = await supabase
    .from("community_comment_likes")
    .select("comment_id")
    .in("comment_id", rows.map((r) => r.id).length ? rows.map((r) => r.id) : ["00000000-0000-0000-0000-000000000000"]);
  const myLikes = new Set((likes ?? []).map((l) => l.comment_id));
  return {
    comments: rows.map((r) => ({ ...r, profiles: profiles[r.user_id] ?? null })),
    myLikes,
  };
}

type Props = {
  postId: string;
  postOwnerId: string;
  currentUserId: string | null;
  onReport: (target: { postId?: string; commentId?: string }) => void;
};

export function CommentThread({ postId, postOwnerId, currentUserId, onReport }: Props) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["community-comments", postId],
    queryFn: () => fetchComments(postId),
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["community-comments", postId] });
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  }

  const add = useMutation({
    mutationFn: async (body: string) => {
      if (!currentUserId) throw new Error("कमेंट करने के लिए लॉगिन करें");
      const { error } = await supabase.from("community_comments").insert({
        post_id: postId,
        user_id: currentUserId,
        parent_id: replyTo,
        body,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setText("");
      setReplyTo(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string }) => {
      const { error } = await supabase.from("community_comments").update({ body }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setEditing(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("community_comments").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleLike = useMutation({
    mutationFn: async ({ id, liked }: { id: string; liked: boolean }) => {
      if (!currentUserId) throw new Error("लाइक के लिए लॉगिन करें");
      if (liked) {
        const { error } = await supabase
          .from("community_comment_likes")
          .delete()
          .eq("comment_id", id)
          .eq("user_id", currentUserId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("community_comment_likes")
          .insert({ comment_id: id, user_id: currentUserId });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const comments = data?.comments ?? [];
  const roots = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  function renderComment(c: (typeof comments)[number], isReply = false) {
    const name = c.profiles?.display_name || "किसान";
    const canModify = currentUserId === c.user_id;
    const canDelete = canModify || currentUserId === postOwnerId;
    const liked = data?.myLikes.has(c.id) ?? false;
    return (
      <div key={c.id} className={`flex gap-2.5 ${isReply ? "ml-9" : ""}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-bold text-primary">
          {c.profiles?.avatar_url ? (
            <img src={c.profiles.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials(name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-secondary px-3 py-2">
            <p className="text-xs font-bold text-foreground">
              {name} <span className="font-normal text-muted-foreground">• {timeAgo(c.created_at)}</span>
            </p>
            {editing === c.id ? (
              <div className="mt-1.5 space-y-2">
                <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save.mutate({ id: c.id, body: editText.trim() })}>
                    सेव करें
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                    रद्द करें
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/85">{c.body}</p>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 pl-1 text-[11px] text-muted-foreground">
            <button
              className={`flex items-center gap-1 ${liked ? "text-red-600" : ""}`}
              onClick={() => toggleLike.mutate({ id: c.id, liked })}
            >
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} /> {c.like_count}
            </button>
            {!isReply && (
              <button className="flex items-center gap-1" onClick={() => setReplyTo(c.id)}>
                <Reply className="h-3.5 w-3.5" /> जवाब दें
              </button>
            )}
            {canModify && (
              <button
                className="flex items-center gap-1"
                onClick={() => {
                  setEditing(c.id);
                  setEditText(c.body);
                }}
              >
                <Pencil className="h-3.5 w-3.5" /> एडिट
              </button>
            )}
            {canDelete && (
              <button
                className="flex items-center gap-1 text-destructive"
                onClick={() => remove.mutate(c.id)}
              >
                <Trash2 className="h-3.5 w-3.5" /> डिलीट
              </button>
            )}
            <button className="flex items-center gap-1" onClick={() => onReport({ commentId: c.id })}>
              <Flag className="h-3.5 w-3.5" /> रिपोर्ट
            </button>
          </div>
          <div className="mt-2 space-y-2">{repliesOf(c.id).map((r) => renderComment(r, true))}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-border bg-muted/30 px-4 py-3">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">कमेंट लोड हो रहे हैं…</p>
      ) : roots.length === 0 ? (
        <p className="text-sm text-muted-foreground">अभी कोई कमेंट नहीं — पहला जवाब आप दें 🌱</p>
      ) : (
        roots.map((c) => renderComment(c))
      )}

      {currentUserId ? (
        <div className="space-y-2 pt-1">
          {replyTo && (
            <p className="text-[11px] text-primary">
              जवाब लिख रहे हैं…{" "}
              <button className="underline" onClick={() => setReplyTo(null)}>
                रद्द करें
              </button>
            </p>
          )}
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="अपना जवाब या सलाह लिखें…"
            className="bg-background text-[15px]"
          />
          <Button
            size="sm"
            disabled={!text.trim() || add.isPending}
            onClick={() => add.mutate(text.trim())}
          >
            कमेंट भेजें
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">कमेंट करने के लिए लॉगिन करें।</p>
      )}
    </div>
  );
}
