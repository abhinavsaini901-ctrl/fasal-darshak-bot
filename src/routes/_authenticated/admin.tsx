import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Trash2, Eye, EyeOff, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  generateArticle,
  listAdminArticles,
  updateArticleStatus,
  deleteArticle,
  claimAdminIfFirst,
  checkIsAdmin,
} from "@/lib/articles.functions";
import { BLOG_CATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin Dashboard | किसान मित्र" }, { name: "robots", content: "noindex" }],
  }),
});

function AdminPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const checkAdminFn = useServerFn(checkIsAdmin);
  const claimFn = useServerFn(claimAdminIfFirst);
  const listFn = useServerFn(listAdminArticles);
  const generateFn = useServerFn(generateArticle);
  const updateStatusFn = useServerFn(updateArticleStatus);
  const deleteFn = useServerFn(deleteArticle);

  const adminQuery = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => checkAdminFn(),
  });

  const articlesQuery = useQuery({
    queryKey: ["adminArticles"],
    queryFn: () => listFn(),
    enabled: !!adminQuery.data?.isAdmin,
  });

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(BLOG_CATEGORIES[0].name);
  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: (vars: { topic: string; category: string }) => generateFn({ data: vars }),
    onSuccess: (res) => {
      setGenSuccess(`✓ "${topic}" पर लेख तैयार (${res.wordCount} शब्द) — draft में सेव हुआ।`);
      setGenError(null);
      setTopic("");
      qc.invalidateQueries({ queryKey: ["adminArticles"] });
    },
    onError: (e: any) => { setGenError(e?.message || "Generation failed"); setGenSuccess(null); },
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: "draft" | "published" }) => updateStatusFn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminArticles"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminArticles"] }),
  });

  const claimMutation = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });

  if (adminQuery.isLoading) {
    return <PageShell><div className="p-8 text-center text-muted-foreground">लोड हो रहा है...</div></PageShell>;
  }

  if (!adminQuery.data?.isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-12">
          <Card className="p-6 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-xl font-bold">Admin एक्सेस आवश्यक</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              यदि आप पहले उपयोगकर्ता हैं, तो Admin बनने का दावा करें।
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => claimMutation.mutate()}
              disabled={claimMutation.isPending}
            >
              {claimMutation.isPending ? "..." : "Admin बनें"}
            </Button>
            {claimMutation.data && !claimMutation.data.granted && (
              <p className="mt-3 text-sm text-destructive">{claimMutation.data.reason}</p>
            )}
            {claimMutation.error && (
              <p className="mt-3 text-sm text-destructive">{(claimMutation.error as Error).message}</p>
            )}
            <button
              className="mt-4 text-xs text-muted-foreground hover:underline"
              onClick={async () => { await supabase.auth.signOut(); window.location.assign("/auth"); }}
            >
              लॉगआउट
            </button>
          </Card>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">AI से ब्लॉग लेख तैयार करें और प्रकाशित करें।</p>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); window.location.assign("/"); }}>
            <LogOut className="mr-2 h-4 w-4" /> लॉगआउट
          </Button>
        </div>

        {/* Generator */}
        <Card className="mt-6 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">AI से लेख तैयार करें</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            विषय लिखें (जैसे "गेहूं की खेती") — Gemini AI 1000+ शब्दों का SEO-अनुकूल हिंदी लेख H2/H3 के साथ बनाएगा।
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_220px_auto]">
            <div>
              <Label htmlFor="topic">विषय</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="जैसे: गेहूं की उन्नत खेती"
              />
            </div>
            <div>
              <Label>श्रेणी</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => { setGenError(null); setGenSuccess(null); generateMutation.mutate({ topic, category }); }}
                disabled={generateMutation.isPending || topic.trim().length < 2}
                className="w-full"
              >
                {generateMutation.isPending ? "तैयार कर रहे हैं..." : "Generate with AI"}
              </Button>
            </div>
          </div>
          {generateMutation.isPending && (
            <p className="mt-3 text-xs text-muted-foreground">AI लेख तैयार कर रहा है — इसमें 20-40 सेकंड लग सकते हैं।</p>
          )}
          {genError && <p className="mt-3 text-sm text-destructive">{genError}</p>}
          {genSuccess && <p className="mt-3 text-sm text-success">{genSuccess}</p>}
        </Card>

        {/* Articles list */}
        <div className="mt-8">
          <h2 className="text-lg font-bold">सभी लेख</h2>
          {articlesQuery.isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">लोड हो रहा है...</p>
          ) : !articlesQuery.data?.length ? (
            <Card className="mt-3 p-6 text-center text-sm text-muted-foreground">
              अभी तक कोई लेख नहीं — ऊपर से नया तैयार करें।
            </Card>
          ) : (
            <div className="mt-3 space-y-2">
              {articlesQuery.data.map((a: any) => (
                <Card key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        a.status === "published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      }`}>{a.status}</span>
                      <span className="text-xs text-muted-foreground">{a.category}</span>
                    </div>
                    <p className="mt-1 truncate font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("hi-IN")} • {a.read_minutes} मिनट • /{a.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.status === "published" ? (
                      <>
                        <Link to="/blog/$slug" params={{ slug: a.slug }} target="_blank">
                          <Button size="sm" variant="outline"><ExternalLink className="mr-1 h-3 w-3" />देखें</Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: a.id, status: "draft" })}>
                          <EyeOff className="mr-1 h-3 w-3" />Unpublish
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => statusMutation.mutate({ id: a.id, status: "published" })}>
                        <Eye className="mr-1 h-3 w-3" />Publish
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("क्या वाकई हटाएं?")) deleteMutation.mutate(a.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
