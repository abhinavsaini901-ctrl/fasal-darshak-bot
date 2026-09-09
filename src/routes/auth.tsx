import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" && search.redirect.startsWith("/") && !search.redirect.startsWith("//")
      ? search.redirect
      : undefined,
  }),
  head: () => ({
    meta: [{ title: "लॉगिन | किसान मित्र" }, { name: "robots", content: "noindex" }],
  }),
});

function AuthPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const dest = redirectTo ?? "/community";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/community" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.assign("/community");
    } catch (err: any) {
      setError(err?.message || "कुछ गलत हुआ");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/community",
      });
      if (result.error) setError(result.error.message || "Google लॉगिन विफल");
    } catch (err: any) {
      setError(err?.message || "कुछ गलत हुआ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
        <h1 className="text-2xl font-bold">{mode === "login" ? "लॉगिन" : "साइन अप"}</h1>
        <Card className="p-6">
          <Button type="button" variant="outline" onClick={onGoogle} disabled={loading} className="mb-4 w-full gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google से जारी रखें
          </Button>
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> या ईमेल से <span className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">ईमेल</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">पासवर्ड</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "रुकें..." : mode === "login" ? "लॉगिन करें" : "अकाउंट बनाएं"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            {mode === "login" ? "नया अकाउंट बनाएं" : "पहले से अकाउंट है? लॉगिन करें"}
          </button>
        </Card>
      </div>
    </PageShell>
  );
}
