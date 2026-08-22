// Curated reference-image library for scan results.
// Rule: never show a random/unrelated image. An image is returned ONLY when the
// AI's disease / issue text matches a known symptom family by keyword.

import disLeafSpot from "@/assets/dis-leaf-spot.jpg";
import disRust from "@/assets/dis-rust.jpg";
import disPowdery from "@/assets/dis-powdery-mildew.jpg";
import disDowny from "@/assets/dis-downy-mildew.jpg";
import disWilt from "@/assets/dis-wilt.jpg";
import disVirus from "@/assets/dis-virus.jpg";
import disPest from "@/assets/dis-pest.jpg";
import disNutrient from "@/assets/dis-nutrient.jpg";

import medFungicide from "@/assets/med-fungicide.jpg";
import medInsecticide from "@/assets/med-insecticide.jpg";
import medOrganic from "@/assets/med-organic.jpg";
import medNutrient from "@/assets/med-nutrient.jpg";

export type RefImage = {
  src: string;
  /** Short caption of what the reference image family shows. */
  caption: { hi: string; en: string };
};

type Entry = RefImage & { keywords: string[] };

const DISEASE_LIBRARY: Entry[] = [
  {
    src: disRust,
    caption: { hi: "रस्ट (गेरुआ) रोग — नारंगी-भूरे चूर्णी धब्बे", en: "Rust disease — orange-brown powdery pustules" },
    keywords: ["rust", "गेरुआ", "रतुआ", "जंग", "puccinia"],
  },
  {
    src: disPowdery,
    caption: { hi: "पाउडरी मिल्ड्यू — पत्ती पर सफेद पाउडर", en: "Powdery mildew — white powder on leaf" },
    keywords: ["powdery", "भभूतिया", "सफेद चूर्ण", "चूर्णिल", "oidium", "erysiphe"],
  },
  {
    src: disDowny,
    caption: { hi: "डाउनी मिल्ड्यू — पीले कोणीय धब्बे, नीचे रोएँदार वृद्धि", en: "Downy mildew — angular yellow patches with fuzzy underside" },
    keywords: ["downy", "मृदुरोमिल", "आर्द्र गलन", "peronospora", "plasmopara", "sclerospora"],
  },
  {
    src: disVirus,
    caption: { hi: "वायरस/मोज़ेक — चितकबरे पीले-हरे धब्बे, मुड़ी पत्ती", en: "Virus / mosaic — mottled leaf, curling" },
    keywords: ["virus", "वायरस", "मोज़ेक", "मोजेक", "mosaic", "yvmv", "curl", "मरोड़", "चितकबरा", "पर्ण कुंचन"],
  },
  {
    src: disWilt,
    caption: { hi: "उकठा / जड़ गलन — पौधा मुरझाना", en: "Wilt / root rot — plant wilting" },
    keywords: ["wilt", "उकठा", "मुरझा", "जड़ गलन", "root rot", "fusarium", "collar rot", "तना गलन", "red rot", "लाल सड़न"],
  },
  {
    src: disPest,
    caption: { hi: "कीट का हमला — कीड़े व कटी-छिदी पत्तियाँ", en: "Pest attack — insects and chewed leaves" },
    keywords: [
      "pest", "insect", "कीट", "कीड़", "aphid", "माहू", "चेपा", "whitefly", "सफेद मक्खी", "thrips", "थ्रिप्स",
      "borer", "छेदक", "इल्ली", "caterpillar", "larva", "mite", "मकड़ी", "जैसिड", "hopper", "फुदका", "armyworm", "सुंडी",
    ],
  },
  {
    src: disNutrient,
    caption: { hi: "पोषक तत्व की कमी — पत्तियों का पीला पड़ना", en: "Nutrient deficiency — yellowing leaves" },
    keywords: [
      "deficien", "कमी", "nitrogen", "नाइट्रोजन", "potash", "पोटाश", "zinc", "जिंक", "iron", "लोहा", "आयरन",
      "magnesium", "मैग्नीशियम", "sulphur", "गंधक", "chlorosis", "क्लोरोसिस", "पीलापन",
    ],
  },
  {
    src: disLeafSpot,
    caption: { hi: "पत्ती धब्बा / झुलसा रोग — भूरे धब्बे व पीला घेरा", en: "Leaf spot / blight — brown spots with yellow halo" },
    keywords: [
      "blight", "झुलसा", "leaf spot", "पत्ती धब्बा", "धब्बा", "spot", "anthracnose", "एंथ्रेक्नोज", "sheath",
      "blast", "ब्लास्ट", "canker", "अंगमारी", "bacterial", "जीवाणु", "fungal", "फंगस", "फफूंद", "अल्टरनेरिया", "cercospora",
    ],
  },
];

const MEDICINE_LIBRARY: Entry[] = [
  {
    src: medOrganic,
    caption: { hi: "जैविक उपाय — नीम तेल / बायो-पेस्टिसाइड (प्रतीकात्मक)", en: "Organic option — neem oil / bio-pesticide (representative)" },
    keywords: ["neem", "नीम", "जैविक", "organic", "गोमूत्र", "trichoderma", "ट्राइकोडर्मा", "beauveria", "bio", "छाछ", "जीवामृत"],
  },
  {
    src: medInsecticide,
    caption: { hi: "कीटनाशक (प्रतीकात्मक उत्पाद चित्र)", en: "Insecticide (representative product image)" },
    keywords: [
      "insecticide", "कीटनाशक", "imidacloprid", "इमिडाक्लोप्रिड", "spinosad", "स्पिनोसैड", "chlorantraniliprole",
      "क्लोरएन्ट्रानिलिप्रोल", "emamectin", "इमामेक्टिन", "thiamethoxam", "थायोमेथोक्सम", "acetamiprid", "lambda",
      "quinalphos", "acephate", "fipronil", "फिप्रोनिल", "मिटीसाइड", "acaricide",
    ],
  },
  {
    src: medNutrient,
    caption: { hi: "पोषक तत्व / खाद (प्रतीकात्मक उत्पाद चित्र)", en: "Nutrient / fertilizer (representative product image)" },
    keywords: [
      "fertilizer", "खाद", "उर्वरक", "urea", "यूरिया", "dap", "npk", "micronutrient", "सूक्ष्म पोषक", "zinc sulphate",
      "जिंक सल्फेट", "ferrous", "फेरस", "mop", "पोटाश", "एप्सम", "epsom", "boron", "बोरॉन", "spray of nutrient",
    ],
  },
  {
    src: medFungicide,
    caption: { hi: "फफूंदनाशक (प्रतीकात्मक उत्पाद चित्र)", en: "Fungicide (representative product image)" },
    keywords: [
      "fungicide", "फफूंदनाशक", "फंगीसाइड", "mancozeb", "मैंकोजेब", "copper oxychloride", "कॉपर", "carbendazim",
      "कार्बेन्डाजिम", "propiconazole", "प्रोपिकोनाज़ोल", "tebuconazole", "टेबुकोनाज़ोल", "azoxystrobin",
      "hexaconazole", "हेक्साकोनाज़ोल", "sulphur dust", "बोर्डो", "bordeaux", "metalaxyl", "streptocycline",
      "captan", "chlorothalonil", "thiophanate", "sulfur",
    ],
  },
];

function pick(library: Entry[], haystacks: (string | undefined)[]): RefImage | null {
  const text = haystacks.filter(Boolean).join(" \n ").toLowerCase();
  if (text.trim().length < 3) return null;
  for (const entry of library) {
    if (entry.keywords.some((k) => text.includes(k.toLowerCase()))) {
      return { src: entry.src, caption: entry.caption };
    }
  }
  return null;
}

/** Reference image for the identified disease/issue, or null when nothing matches. */
export function findDiseaseImage(input: {
  disease?: string;
  primaryIssue?: string;
  issueType?: string;
  symptoms?: string;
}): RefImage | null {
  const direct = pick(DISEASE_LIBRARY, [input.disease, input.primaryIssue]);
  if (direct) return direct;
  // Fall back to symptom text only (still keyword-gated, never random).
  const bySymptom = pick(DISEASE_LIBRARY, [input.symptoms]);
  if (bySymptom) return bySymptom;
  // Last resort: the AI's own issue classification.
  if (input.issueType === "pest") return pick(DISEASE_LIBRARY, ["pest"]);
  if (input.issueType === "nutrient") return pick(DISEASE_LIBRARY, ["deficien"]);
  return null;
}

/** Reference image for the recommended treatment, or null when nothing matches. */
export function findMedicineImage(input: {
  chemicalTreatment?: string;
  organicTreatment?: string;
  dosage?: string;
  treatment?: string;
  issueType?: string;
}): RefImage | null {
  const direct = pick(MEDICINE_LIBRARY, [
    input.chemicalTreatment,
    input.organicTreatment,
    input.dosage,
    input.treatment,
  ]);
  if (direct) return direct;
  if (input.issueType === "nutrient") return pick(MEDICINE_LIBRARY, ["fertilizer"]);
  if (input.issueType === "pest") return pick(MEDICINE_LIBRARY, ["insecticide"]);
  if (input.issueType === "disease") return pick(MEDICINE_LIBRARY, ["fungicide"]);
  return null;
}
