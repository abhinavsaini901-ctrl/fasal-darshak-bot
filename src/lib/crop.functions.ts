import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const ScanInput = z.object({
  imageDataUrl: z.string().min(20).max(8_000_000),
  language: z.string().min(2).max(10),
  languageName: z.string().min(2).max(60),
});

const ChatInput = z.object({
  language: z.string().min(2).max(10),
  languageName: z.string().min(2).max(60),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .max(30),
  imageDataUrl: z.string().max(8_000_000).optional(),
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
    const systemPrompt = `You are an expert agricultural scientist and plant pathologist helping Indian farmers. You analyze crop images and identify the crop, its health, diseases, pests, and recommend practical, low-cost treatments. ALWAYS respond in ${data.languageName}. Be warm, simple, and practical — speak like talking to a farmer who may not have technical background. Use the local crop and medicine names where possible.`;

    const tool = {
      type: "function" as const,
      function: {
        name: "report_crop",
        description: "Return a structured crop analysis report",
        parameters: {
          type: "object",
          properties: {
            cropName: { type: "string", description: "Name of the crop, e.g. Wheat / गेहूं" },
            isPlant: { type: "boolean", description: "True if image clearly shows a plant/crop" },
            isHealthy: { type: "boolean" },
            healthScore: { type: "number", description: "0-100, plant health score" },
            disease: { type: "string", description: "Disease/pest name, or empty if healthy" },
            symptoms: { type: "string", description: "Visible symptoms in 1-2 sentences" },
            treatment: { type: "string", description: "Practical step-by-step treatment, 3-6 lines" },
            prevention: { type: "string", description: "Prevention tips, 2-4 lines" },
            summary: { type: "string", description: "1-line friendly summary for farmer" },
          },
          required: ["cropName", "isPlant", "isHealthy", "healthScore", "disease", "symptoms", "treatment", "prevention", "summary"],
          additionalProperties: false,
        },
      },
    };

    const result = await callGateway({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this crop photo. Identify the crop, check if it is healthy or diseased, and give practical treatment in ${data.languageName}.`,
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
        cropName: "",
        isPlant: false,
        isHealthy: false,
        healthScore: 0,
        disease: "",
        symptoms: "",
        treatment: "",
        prevention: "",
        summary: result.choices?.[0]?.message?.content ?? "",
      };
    }
    try {
      const parsed = JSON.parse(call.function.arguments);
      return parsed as {
        cropName: string;
        isPlant: boolean;
        isHealthy: boolean;
        healthScore: number;
        disease: string;
        symptoms: string;
        treatment: string;
        prevention: string;
        summary: string;
      };
    } catch (e) {
      console.error("Parse failed", e);
      throw new Error("AI_ERROR");
    }
  });

export const chatCrop = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const systemPrompt = `You are Kisan Mitra — a friendly AI farming assistant for Indian farmers. ALWAYS reply in ${data.languageName}. Keep answers short, practical, and easy to understand. Use simple words. Give step-by-step actionable advice. If asked about diseases, suggest both organic and chemical solutions with local product names where possible.`;

    const messages: unknown[] = [{ role: "system", content: systemPrompt }];

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
      model: "google/gemini-2.5-flash",
      messages,
    });

    const reply = result.choices?.[0]?.message?.content ?? "";
    return { reply };
  });
