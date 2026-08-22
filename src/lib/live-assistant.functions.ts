import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  LIVE_SCENE_SYSTEM,
  SCENE_TOOL_SCHEMA,
  LIVE_CHAT_SYSTEM,
  formatSceneContext,
  type LiveScene,
} from "@/lib/live-assistant-prompts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
// Fast model for the continuous live scene pass (cheap + low latency)…
const LIVE_VISION_MODEL = "google/gemini-2.5-flash";
// …and the stronger model for the farmer's actual spoken question.
const LIVE_ANSWER_MODEL = "google/gemini-2.5-pro";

// ---- Per-IP rate limiting (own bucket, independent of the crop scanner) ----
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 150; // live mode is chattier than a single scan
const BUCKETS = new Map<string, number[]>();

function clientIp(): string {
  const h =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-real-ip") ||
    getRequestHeader("x-forwarded-for") ||
    "unknown";
  return h.split(",")[0]!.trim();
}

function enforceRateLimit(): void {
  const ip = clientIp();
  const now = Date.now();
  const arr = (BUCKETS.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX_PER_WINDOW) throw new Error("RATE_LIMITED");
  arr.push(now);
  BUCKETS.set(ip, arr);
  if (BUCKETS.size > 5000) {
    for (const [k, v] of BUCKETS) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) BUCKETS.delete(k);
    }
  }
}

const LANG_NAMES = {
  hi: "Hindi (हिन्दी)",
  en: "English",
  mr: "Marathi (मराठी)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  gu: "Gujarati (ગુજરાતી)",
} as const;
const LanguageCode = z.enum(["hi", "en", "mr", "pa", "bn", "ta", "te", "gu"]);

const ImageDataUrl = z
  .string()
  .min(20)
  .max(8_000_000)
  .refine((v) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(v), {
    message: "imageDataUrl must be a base64 data:image/* URL",
  });

const SceneShape = z.object({
  sceneType: z.string().max(30).optional(),
  name: z.string().max(120).optional(),
  confidence: z.number().min(0).max(100).optional(),
  imageQuality: z.string().max(20).optional(),
  observations: z.string().max(1500).optional(),
  issueVisible: z.boolean().optional(),
  possibleIssue: z.string().max(200).optional(),
  symptoms: z.string().max(1200).optional(),
  labelText: z.string().max(800).optional(),
  guidance: z.string().max(300).optional(),
  spokenLine: z.string().max(400).optional(),
  followUpQuestion: z.string().max(300).optional(),
});

type GatewayResponse = {
  choices?: {
    message?: { content?: string; tool_calls?: { function: { name: string; arguments: string } }[] };
  }[];
};

async function callGateway(body: unknown): Promise<GatewayResponse> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("RATE_LIMITED");
  if (res.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!res.ok) {
    console.error("Live assistant gateway error:", res.status, await res.text());
    throw new Error("AI_ERROR");
  }
  return (await res.json()) as GatewayResponse;
}

/** Continuous (throttled) scene pass — what is the camera looking at right now? */
export const observeScene = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        imageDataUrl: ImageDataUrl,
        language: LanguageCode,
        previousName: z.string().max(120).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    enforceRateLimit();
    const languageName = LANG_NAMES[data.language];

    const result = await callGateway({
      model: LIVE_VISION_MODEL,
      messages: [
        { role: "system", content: LIVE_SCENE_SYSTEM(languageName) },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this live camera frame and return report_scene JSON in ${languageName}.${
                data.previousName ? `\nEarlier in this session the camera was showing: ${data.previousName}.` : ""
              }`,
            },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "report_scene",
            description: "Report what the live camera frame shows",
            parameters: SCENE_TOOL_SCHEMA,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "report_scene" } },
    });

    const args = result.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const fallback: LiveScene = {
      sceneType: "unclear",
      name: "",
      confidence: 0,
      imageQuality: "not_relevant",
      observations: "",
      issueVisible: false,
      spokenLine: "मैं इसे अभी ठीक से पहचान नहीं पा रहा हूं। कृपया camera थोड़ा पास लाएं।",
      guidance: "कैमरा पौधे के पास और स्थिर रखें।",
    };
    if (!args) return fallback;
    try {
      const parsed = SceneShape.parse(JSON.parse(args));
      return {
        sceneType: parsed.sceneType ?? "unclear",
        name: parsed.name ?? "",
        confidence: parsed.confidence ?? 0,
        imageQuality: (parsed.imageQuality ?? "good") as LiveScene["imageQuality"],
        observations: parsed.observations ?? "",
        issueVisible: parsed.issueVisible ?? false,
        possibleIssue: parsed.possibleIssue ?? "",
        symptoms: parsed.symptoms ?? "",
        labelText: parsed.labelText ?? "",
        guidance: parsed.guidance ?? "",
        spokenLine: parsed.spokenLine ?? fallback.spokenLine,
        followUpQuestion: parsed.followUpQuestion ?? "",
      } satisfies LiveScene;
    } catch (e) {
      console.error("Scene parse failed", e);
      return fallback;
    }
  });

/** The farmer's spoken question, grounded in the current frame + scene + memory. */
export const askLive = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        language: LanguageCode,
        question: z.string().min(1).max(1000),
        imageDataUrl: ImageDataUrl.optional(),
        scene: SceneShape.optional(),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(3000),
            }),
          )
          .max(20)
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    enforceRateLimit();
    const languageName = LANG_NAMES[data.language];
    const sceneContext = formatSceneContext((data.scene as LiveScene | undefined) ?? null);

    const messages: unknown[] = [
      { role: "system", content: LIVE_CHAT_SYSTEM(languageName, sceneContext) },
      ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
    ];

    messages.push(
      data.imageDataUrl
        ? {
            role: "user",
            content: [
              { type: "text", text: data.question },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          }
        : { role: "user", content: data.question },
    );

    const result = await callGateway({ model: LIVE_ANSWER_MODEL, messages });
    const reply = result.choices?.[0]?.message?.content?.trim() ?? "";
    return {
      reply:
        reply ||
        "माफ़ कीजिए, मैं जवाब नहीं बना पाया। कृपया सवाल दोबारा पूछें या camera को पौधे के पास लाएं।",
    };
  });
