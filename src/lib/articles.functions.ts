import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output } from "ai";

const SectionSchema = z.object({
  heading: z.string(),
  paragraphs: z.array(z.string()).min(1),
  bullets: z.array(z.string()).optional(),
});

const ArticleAISchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string(),
  metaDescription: z.string().max(180),
  excerpt: z.string(),
  tableOfContents: z.array(z.string()).min(3),
  sections: z.array(SectionSchema).min(4),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
  tags: z.array(z.string()).min(3),
});

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Admin access required");
}

/**
 * Generates a 1000+ word Hindi SEO article via Lovable AI Gateway (Gemini)
 * and saves it as a draft.
 */
export const generateArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      topic: z.string().min(2).max(200),
      category: z.string().min(1),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const system = `आप एक अनुभवी कृषि लेखक हैं जो भारतीय किसानों के लिए हिंदी में SEO-अनुकूल लेख लिखते हैं।
नियम:
- कम से कम 1000 शब्दों का लेख लिखें।
- कम से कम 6 sections (H2 headings) हों, हर section में 2-4 paragraphs।
- कुछ sections में bullet points भी शामिल करें।
- भाषा शुद्ध हिंदी में हो, सरल और किसानों के लिए व्यावहारिक।
- meta description 150-160 अक्षरों की हो।
- slug केवल अंग्रेज़ी lowercase अक्षर, अंक और hyphen हो (कोई हिंदी नहीं)।
- title हिंदी में आकर्षक हो।
- कम से कम 4 FAQ शामिल करें (हिंदी प्रश्न-उत्तर)।
- 5-8 relevant tags हिंदी में दें।`;

    const prompt = `विषय: "${data.topic}"
श्रेणी: "${data.category}"

ऊपर दिए विषय पर एक संपूर्ण SEO-अनुकूल हिंदी लेख तैयार करें।`;

    let aiOutput: z.infer<typeof ArticleAISchema>;
    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        system,
        prompt,
        experimental_output: Output.object({ schema: ArticleAISchema }),
      });
      aiOutput = experimental_output;
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (msg.includes("429")) throw new Error("AI दर सीमा पार हो गई — कृपया कुछ देर बाद पुनः प्रयास करें।");
      if (msg.includes("402")) throw new Error("AI क्रेडिट समाप्त हो गए — कृपया workspace में credits जोड़ें।");
      throw new Error(`AI generation failed: ${msg}`);
    }

    const wordCount = aiOutput.sections.reduce(
      (sum, s) => sum + s.paragraphs.join(" ").split(/\s+/).length + (s.bullets?.join(" ").split(/\s+/).length ?? 0),
      0,
    );
    const readMinutes = Math.max(5, Math.round(wordCount / 200));

    // Ensure unique slug
    let slug = aiOutput.slug;
    const { data: existing } = await supabase.from("articles").select("id").eq("slug", slug).maybeSingle();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin
      .from("articles")
      .insert({
        slug,
        title: aiOutput.title,
        category: aiOutput.category,
        meta_description: aiOutput.metaDescription,
        excerpt: aiOutput.excerpt,
        table_of_contents: aiOutput.tableOfContents,
        sections: aiOutput.sections,
        faqs: aiOutput.faqs,
        tags: aiOutput.tags,
        read_minutes: readMinutes,
        status: "draft",
        created_by: userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id, slug: inserted.slug, wordCount };
  });

export const listAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("id, slug, title, category, status, created_at, published_at, read_minutes")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const updateArticleStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["draft", "published"]),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: any = { status: data.status };
    if (data.status === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabaseAdmin.from("articles").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** First signed-in user can claim admin if no admin exists yet. */
export const claimAdminIfFirst = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { granted: false, reason: "An admin already exists" };
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insErr) throw new Error(insErr.message);
    return { granted: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

/** Public: list published articles (for blog list). */
export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("slug, title, category, excerpt, meta_description, tags, read_minutes, author, published_at, updated_at, table_of_contents, sections, faqs")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPublishedArticle = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
