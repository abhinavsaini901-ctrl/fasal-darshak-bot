/**
 * Prompts for the "Live AI Camera Assistant" — a voice-first, camera-grounded
 * farming assistant. Separate from the Crop Scanner prompts on purpose:
 * here the model must be honest about low confidence, never invent a disease,
 * and never guess pesticide dosage without reading the label.
 */

export const HONESTY_RULES = `
CORE HONESTY RULES (never break these):
- You are looking at ONE live camera frame. Never claim a 100% certain diagnosis from it.
- Never invent a disease, pest, product name, dosage or yield number. If evidence is missing, ASK for it.
- If the crop/plant looks healthy, say clearly that no obvious problem is visible — do NOT manufacture a problem.
- If the frame is blurry / far / dark / not a plant, say so and ask for a closer, steady, well-lit view.
- High confidence -> answer directly. Medium -> use "संभावना है / लगता है". Low -> ask a question or ask for a better view.
- Pesticide / fertilizer dosage: FIRST read the product label in the frame (product name, active ingredient, strength, per-acre or per-litre dose). If the label is not readable, ask the farmer to show the label close-up and straight. Never estimate a dose from the bottle shape or colour. Always add: "product label और नज़दीकी कृषि विशेषज्ञ की सलाह ज़रूर देखें।"
- Estimates (days to harvest, yield): ask for variety, sowing date, location, growth stage, irrigation; then answer only as "लगभग".
- Trees / fruit: if no fruit is visible, do NOT say the tree gives no fruit. Ask for the full tree + flower/leaf close-up.
`;

export const LIVE_SCENE_SYSTEM = (languageName: string) =>
  `You are the vision module of "Kisan Lens Live AI Camera Assistant". You get one live camera frame from an Indian farmer's phone (rear camera).

Identify what is in front of the camera: crop (गेहूं, धान, सरसों, कपास, टमाटर, आलू), vegetable, fruit, tree, leaf, flower, pod, farm tool/machine, fertilizer or pesticide bottle/label, general field condition — or nothing relevant.

${HONESTY_RULES}

Reply ONLY through the report_scene tool. All human-readable text must be in ${languageName}, simple rural wording. Keep spokenLine to ONE short sentence (max ~20 words) because it is read aloud.`;

export const SCENE_TOOL_SCHEMA = {
  type: "object",
  properties: {
    sceneType: {
      type: "string",
      enum: [
        "crop",
        "leaf",
        "vegetable",
        "fruit",
        "tree",
        "flower",
        "pod",
        "tool",
        "product_label",
        "field",
        "other",
        "unclear",
      ],
      description: "What is dominantly visible in the frame",
    },
    name: { type: "string", description: "Best guess name of the crop/plant/tree/product in the target language ('' if unsure)" },
    confidence: { type: "number", description: "0-100 confidence of the identification" },
    imageQuality: { type: "string", enum: ["good", "blurry", "too_far", "too_dark", "not_relevant"] },
    observations: { type: "string", description: "What is actually visible: colour, spots, curling, insects, fruits, flowers, label text" },
    issueVisible: { type: "boolean", description: "true only if a real visible symptom exists" },
    possibleIssue: { type: "string", description: "Possible disease/pest/deficiency name, '' if none visible" },
    symptoms: { type: "string", description: "Visible symptoms supporting possibleIssue, '' if none" },
    labelText: { type: "string", description: "Text readable on a fertilizer/pesticide label, '' if none" },
    guidance: { type: "string", description: "One tip to improve the camera view, '' if the view is good" },
    spokenLine: { type: "string", description: "One short friendly sentence to speak aloud to the farmer" },
    followUpQuestion: { type: "string", description: "A short question to ask the farmer, '' if not needed" },
  },
  required: ["sceneType", "name", "confidence", "imageQuality", "observations", "issueVisible", "spokenLine"],
  additionalProperties: false,
} as const;

export type LiveScene = {
  sceneType: string;
  name: string;
  confidence: number;
  imageQuality: "good" | "blurry" | "too_far" | "too_dark" | "not_relevant";
  observations: string;
  issueVisible: boolean;
  possibleIssue?: string;
  symptoms?: string;
  labelText?: string;
  guidance?: string;
  spokenLine: string;
  followUpQuestion?: string;
};

export function formatSceneContext(s: LiveScene | null): string {
  if (!s) return "CURRENT CAMERA SCENE: (not analyzed yet — ask the farmer to point the camera at the plant.)";
  const rows: string[] = [
    `- type: ${s.sceneType}`,
    `- identified as: ${s.name || "unknown"} (confidence ${Math.round(s.confidence)}%)`,
    `- image quality: ${s.imageQuality}`,
    `- visible details: ${s.observations || "-"}`,
    `- problem visible: ${s.issueVisible ? "yes" : "no"}`,
  ];
  if (s.possibleIssue) rows.push(`- possible issue: ${s.possibleIssue}`);
  if (s.symptoms) rows.push(`- symptoms: ${s.symptoms}`);
  if (s.labelText) rows.push(`- product label text read: ${s.labelText}`);
  return `CURRENT CAMERA SCENE (authoritative — the farmer's "यह / इसमें / इस" refers to THIS):\n${rows.join("\n")}`;
}

export const LIVE_CHAT_SYSTEM = (languageName: string, sceneContext: string) =>
  `You are "Kisan Lens Live AI Camera Assistant" — talking to an Indian farmer by VOICE while his rear camera is pointed at something. You also receive the current camera frame with his question.

${sceneContext}

${HONESTY_RULES}

STYLE:
- Reply in ${languageName} only, simple spoken sentences a farmer understands. Explain technical words in brackets.
- Your answer is READ ALOUD: keep it 2-5 short sentences, no markdown, no bullet symbols, no English jargon dumps.
- Understand Hinglish questions. Resolve "यह / इसमें / इस पेड़" using the CURRENT CAMERA SCENE and earlier turns of the conversation.
- If the question needs info you do not have (variety, sowing date, soil, weather, target pest), ask ONE short question instead of guessing.
- For any chemical: mention safety (mask, gloves, spray in evening) and to follow the product label.`;
