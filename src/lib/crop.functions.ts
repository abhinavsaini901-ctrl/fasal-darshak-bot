import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  CROP_SCAN_SYSTEM,
  CROP_CHAT_SYSTEM,
  FEW_SHOT_SCAN_EXAMPLES,
  FEW_SHOT_CHAT_EXAMPLES,
  SCAN_TOOL_SCHEMA,
} from "@/lib/ai-prompts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// More powerful model for image analysis and complex reasoning.
const POWERFUL_MODEL = "google/gemini-2.5-pro";

// ---- Per-IP rate limiting (defense in depth) ----
// These endpoints are intentionally unauthenticated so any farmer can use the
// app without sign-up. To prevent bots from draining the paid AI quota, we
// enforce a sliding-window per-IP cap in worker memory. Worker instances are
// ephemeral so this is best-effort, not a hard guarantee.
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX_PER_WINDOW = 60; // 60 AI calls / IP / hour
const RATE_BUCKETS = new Map<string, number[]>();

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
  const arr = (RATE_BUCKETS.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX_PER_WINDOW) {
    throw new Error("RATE_LIMITED");
  }
  arr.push(now);
  RATE_BUCKETS.set(ip, arr);
  // Opportunistic cleanup to bound memory
  if (RATE_BUCKETS.size > 5000) {
    for (const [k, v] of RATE_BUCKETS) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) RATE_BUCKETS.delete(k);
    }
  }
}

// Server-side allowlist — derive the human-readable language name here so
// untrusted client input can never be interpolated into the AI system prompt.
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

// Only accept inline base64 data: image URLs to avoid SSRF via the AI gateway.
const ImageDataUrl = z
  .string()
  .min(20)
  .max(8_000_000)
  .refine((v) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(v), {
    message: "imageDataUrl must be a base64 data:image/* URL",
  });

const ScanInput = z.object({
  imageDataUrl: ImageDataUrl,
  language: LanguageCode,
  // languageName is accepted for backward compatibility but ignored on the server.
  languageName: z.string().max(60).optional(),
  // Optional farmer-provided context to sharpen the diagnosis.
  cropHint: z.string().max(60).optional(),
  leafStage: z.enum(["old", "new", "middle", "unknown"]).optional(),
  daysSinceSowing: z.number().int().min(0).max(400).optional(),
  location: z.string().max(80).optional(),
  weatherNote: z.string().max(120).optional(),
});


const ChatInput = z.object({
  language: LanguageCode,
  languageName: z.string().max(60).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .max(30),
  imageDataUrl: ImageDataUrl.optional(),
});

type GatewayResponse = {
  choices?: { message?: { content?: string; tool_calls?: { function: { name: string; arguments: string } }[] } }[];
};

async function callGateway(body: unknown): Promise<GatewayResponse> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) throw new Error("RATE_LIMITED");
  if (res.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!res.ok) {
    const txt = await res.text();
    console.error("AI gateway error:", res.status, txt);
    throw new Error("AI_ERROR");
  }
  return (await res.json()) as GatewayResponse;
}

export const scanCrop = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ScanInput.parse(d))
  .handler(async ({ data }) => {
    enforceRateLimit();
    const languageName = LANG_NAMES[data.language];
    const systemPrompt = CROP_SCAN_SYSTEM(languageName);

    const tool = {
      type: "function" as const,
      function: {
        name: "report_crop",
        description: "Return a structured crop analysis report with chain-of-thought reasoning",
        parameters: SCAN_TOOL_SCHEMA,
      },
    };

    const ctx: string[] = [];
    if (data.cropHint) ctx.push(`Crop (told by farmer): ${data.cropHint}`);
    if (data.leafStage && data.leafStage !== "unknown")
      ctx.push(
        `Leaf position in photo: ${
          data.leafStage === "old" ? "old / lower leaf" : data.leafStage === "new" ? "new / upper leaf" : "middle leaf"
        }`
      );
    if (typeof data.daysSinceSowing === "number")
      ctx.push(`Days since sowing: ${data.daysSinceSowing}`);
    if (data.location) ctx.push(`Location: ${data.location}`);
    if (data.weatherNote) ctx.push(`Weather now: ${data.weatherNote}`);

    const result = await callGateway({
      model: POWERFUL_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...FEW_SHOT_SCAN_EXAMPLES,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Now analyze this crop photo with the 3-stage analysis (structural inspection → differential diagnosis → farmer output) and return a complete report_crop JSON in ${languageName}.${
                ctx.length ? `\n\nFarmer context:\n- ${ctx.join("\n- ")}` : ""
              }`,
            },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      tools: [tool],
      tool_choice: { type: "function", function: { name: "report_crop" } },
    });

    const call = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return {
        reasoning: "",
        cropName: "",
        isPlant: false,
        isHealthy: false,
        healthScore: 0,
        disease: "",
        symptoms: "",
        treatment: "",
        organicTreatment: "",
        chemicalTreatment: "",
        dosage: "",
        safetyDays: 0,
        prevention: "",
        whenToCallExpert: "",
        confidence: 0,
        urgencyLevel: "low" as const,
        summary: result.choices?.[0]?.message?.content ?? "",
        issueType: "unclear" as const,
        primaryIssue: "",
        visualEvidence: "",
        secondaryIssue: "",
        differentialNote: "",
        photoTip: "",
      };
    }
    try {
      const parsed = JSON.parse(call.function.arguments);
      return parsed as {
        reasoning: string;
        cropName: string;
        isPlant: boolean;
        isHealthy: boolean;
        healthScore: number;
        disease: string;
        symptoms: string;
        treatment: string;
        organicTreatment: string;
        chemicalTreatment: string;
        dosage: string;
        safetyDays: number;
        prevention: string;
        whenToCallExpert: string;
        confidence: number;
        urgencyLevel: "low" | "medium" | "high";
        summary: string;
        issueType: "disease" | "pest" | "nutrient" | "healthy" | "unclear";
        primaryIssue: string;
        visualEvidence: string;
        secondaryIssue: string;
        differentialNote: string;
        photoTip: string;
      };
    } catch (e) {
      console.error("Parse failed", e);
      throw new Error("AI_ERROR");
    }
  });



export const chatCrop = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    enforceRateLimit();
    const languageName = LANG_NAMES[data.language];
    const systemPrompt = CROP_CHAT_SYSTEM(languageName);

    const messages: unknown[] = [
      { role: "system", content: systemPrompt },
      ...FEW_SHOT_CHAT_EXAMPLES,
    ];

    // Attach image to the last user message if provided
    const last = data.history[data.history.length - 1];
    const earlier = data.history.slice(0, -1);
    for (const m of earlier) messages.push({ role: m.role, content: m.content });

    if (last) {
      if (data.imageDataUrl && last.role === "user") {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: last.content },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        });
      } else {
        messages.push({ role: last.role, content: last.content });
      }
    }

    const result = await callGateway({
      model: POWERFUL_MODEL,
      messages,
    });

    const reply = result.choices?.[0]?.message?.content ?? "";
    return { reply };
  });
