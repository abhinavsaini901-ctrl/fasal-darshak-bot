import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { SOIL_PHOTO_SYSTEM, SOIL_REPORT_SYSTEM, SOIL_TOOL_SCHEMA } from "@/lib/soil-prompts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-pro";

// ---- Per-IP rate limiting (defense in depth, same policy as crop scan) ----
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 60;
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
  if (arr.length >= RATE_MAX_PER_WINDOW) throw new Error("RATE_LIMITED");
  arr.push(now);
  RATE_BUCKETS.set(ip, arr);
  if (RATE_BUCKETS.size > 5000) {
    for (const [k, v] of RATE_BUCKETS) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) RATE_BUCKETS.delete(k);
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

// Only inline base64 data URLs — prevents SSRF through the AI gateway.
const ImageDataUrl = z
  .string()
  .min(20)
  .max(8_000_000)
  .refine((v) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(v), {
    message: "must be a base64 data:image/* URL",
  });

const PdfDataUrl = z
  .string()
  .min(20)
  .max(12_000_000)
  .refine((v) => /^data:application\/pdf;base64,/.test(v), {
    message: "must be a base64 data:application/pdf URL",
  });

const SoilInput = z
  .object({
    mode: z.enum(["photo", "report"]),
    language: LanguageCode,
    imageDataUrl: ImageDataUrl.optional(),
    pdfDataUrl: PdfDataUrl.optional(),
    fileName: z.string().max(120).optional(),
    cropWanted: z.string().max(60).optional(),
    location: z.string().max(80).optional(),
  })
  .refine((d) => Boolean(d.imageDataUrl || d.pdfDataUrl), {
    message: "imageDataUrl or pdfDataUrl is required",
  });

export type SoilResult = {
  isSoil?: boolean;
  isReport?: boolean;
  summary: string;
  soilHealthLabel?: string;
  visibleColor?: string;
  textureGuess?: string;
  moisture?: string;
  soilTypeGuess?: string;
  testResults?: { name: string; value: string; unit?: string; status?: string; meaning: string }[];
  possibleIssues: string[];
  cropSuggestions: string[];
  improvementTips: string[];
  labTests: string[];
  photoTip?: string;
};

type GatewayResponse = {
  choices?: { message?: { content?: string; tool_calls?: { function: { name: string; arguments: string } }[] } }[];
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
    console.error("Soil AI gateway error:", res.status, await res.text());
    throw new Error("AI_ERROR");
  }
  return (await res.json()) as GatewayResponse;
}

export const analyzeSoil = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SoilInput.parse(d))
  .handler(async ({ data }): Promise<SoilResult> => {
    enforceRateLimit();
    const languageName = LANG_NAMES[data.language];
    const system = data.mode === "photo" ? SOIL_PHOTO_SYSTEM(languageName) : SOIL_REPORT_SYSTEM(languageName);

    const ctx: string[] = [];
    if (data.cropWanted) ctx.push(`Crop the farmer wants to grow: ${data.cropWanted}`);
    if (data.location) ctx.push(`Location: ${data.location}`);

    const instruction =
      data.mode === "photo"
        ? `Look at this soil photo and give ONLY visual observations in ${languageName}. Do not output any pH/EC/NPK numbers. Call report_soil.`
        : `Read this soil test report and explain in ${languageName} only the values printed in it. Call report_soil.`;

    const content: unknown[] = [
      { type: "text", text: `${instruction}${ctx.length ? `\n\nContext:\n- ${ctx.join("\n- ")}` : ""}` },
    ];
    if (data.pdfDataUrl) {
      content.push({
        type: "file",
        file: { filename: data.fileName || "soil-report.pdf", file_data: data.pdfDataUrl },
      });
    } else if (data.imageDataUrl) {
      content.push({ type: "image_url", image_url: { url: data.imageDataUrl } });
    }

    const result = await callGateway({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "report_soil",
            description: "Return a farmer-friendly soil observation / soil report explanation",
            parameters: SOIL_TOOL_SCHEMA,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "report_soil" } },
    });

    const call = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return {
        summary: result.choices?.[0]?.message?.content ?? "",
        possibleIssues: [],
        cropSuggestions: [],
        improvementTips: [],
        labTests: [],
      };
    }

    try {
      const parsed = JSON.parse(call.function.arguments) as SoilResult;
      // photo mode can never carry lab values — strip defensively
      if (data.mode === "photo") parsed.testResults = [];
      return {
        ...parsed,
        possibleIssues: parsed.possibleIssues ?? [],
        cropSuggestions: parsed.cropSuggestions ?? [],
        improvementTips: parsed.improvementTips ?? [],
        labTests: parsed.labTests ?? [],
      };
    } catch (e) {
      console.error("Soil parse failed", e);
      throw new Error("AI_ERROR");
    }
  });
