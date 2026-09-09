// Crop group + Hindi name mapping for mandi bhav (client-safe, no server imports)

export type CropGroup = "cereals" | "pulses" | "oilseeds" | "vegetables" | "fruits" | "cash" | "other";

export const CROP_GROUP_LABELS: Record<CropGroup, string> = {
  cereals: "अनाज",
  pulses: "दालें",
  oilseeds: "तिलहन",
  vegetables: "सब्जियां",
  fruits: "फल",
  cash: "नकदी फसल",
  other: "अन्य",
};

/** English commodity name (as returned by Agmarknet data) -> Hindi name */
export const CROP_HINDI: Record<string, string> = {
  Wheat: "गेहूं",
  Paddy: "धान",
  "Paddy(Dhan)(Common)": "धान (सामान्य)",
  "Paddy(Dhan)(Basmati)": "धान (बासमती)",
  Rice: "चावल",
  Maize: "मक्का",
  "Bajra(Pearl Millet/Cumbu)": "बाजरा",
  Bajra: "बाजरा",
  "Jowar(Sorghum)": "ज्वार",
  Jowar: "ज्वार",
  Barley: "जौ",
  Ragi: "रागी",
  "Mustard": "सरसों",
  "Mustard Oil": "सरसों तेल",
  "Bengal Gram(Gram)(Whole)": "चना",
  "Bengal Gram Dal (Chana Dal)": "चना दाल",
  "Green Gram (Moong)(Whole)": "मूंग",
  "Green Gram Dal (Moong Dal)": "मूंग दाल",
  "Black Gram (Urd Beans)(Whole)": "उड़द",
  "Black Gram Dal (Urd Dal)": "उड़द दाल",
  "Lentil (Masur)(Whole)": "मसूर",
  "Arhar (Tur/Red Gram)(Whole)": "अरहर / तूर",
  "Arhar Dal(Tur Dal)": "अरहर दाल",
  Soyabean: "सोयाबीन",
  Soybean: "सोयाबीन",
  Cotton: "कपास",
  "Kapas": "कपास",
  Sugarcane: "गन्ना",
  Groundnut: "मूंगफली",
  Sesamum: "तिल",
  "Sesamum(Sesame,Gingelly,Til)": "तिल",
  Castor: "अरंडी",
  "Sunflower": "सूरजमुखी",
  Potato: "आलू",
  Onion: "प्याज",
  Tomato: "टमाटर",
  Garlic: "लहसुन",
  "Peas Wet": "मटर",
  "Green Peas": "हरी मटर",
  "Peas(Dry)": "सूखी मटर",
  Cauliflower: "फूलगोभी",
  Cabbage: "पत्तागोभी",
  Brinjal: "बैंगन",
  "Bhindi(Ladies Finger)": "भिंडी",
  "Green Chilli": "हरी मिर्च",
  Ginger: "अदरक",
  "Ginger(Green)": "अदरक",
  Carrot: "गाजर",
  Cucumbar: "खीरा",
  "Bitter gourd": "करेला",
  "Bottle gourd": "लौकी",
  Pumpkin: "कद्दू",
  Spinach: "पालक",
  Coriander: "धनिया",
  Radish: "मूली",
  Apple: "सेब",
  Banana: "केला",
  Mango: "आम",
  Orange: "संतरा",
  Papaya: "पपीता",
  Grapes: "अंगूर",
  Guava: "अमरूद",
  Pomegranate: "अनार",
  Lemon: "नींबू",
  Watermelon: "तरबूज",
  Pineapple: "अनानास",
  Turmeric: "हल्दी",
  Jaggery: "गुड़",
  Coconut: "नारियल",
};

const GROUP_KEYWORDS: Array<[CropGroup, string[]]> = [
  ["cereals", ["wheat", "paddy", "rice", "maize", "bajra", "jowar", "barley", "ragi", "millet", "corn"]],
  [
    "pulses",
    ["gram", "moong", "urd", "masur", "lentil", "arhar", "tur", "dal", "peas(dry", "rajma", "kulthi", "cowpea", "moth"],
  ],
  [
    "oilseeds",
    ["mustard", "soyabean", "soybean", "groundnut", "sesam", "castor", "sunflower", "linseed", "niger", "safflower", "copra"],
  ],
  [
    "vegetables",
    [
      "potato", "onion", "tomato", "garlic", "cauliflower", "cabbage", "brinjal", "bhindi", "chilli", "ginger",
      "carrot", "cucum", "gourd", "pumpkin", "spinach", "coriander", "radish", "beans", "peas wet", "green peas",
      "capsicum", "beet", "colacasia", "drumstick", "methi", "tinda", "arum", "knool", "leafy", "amaranthus", "mint",
    ],
  ],
  [
    "fruits",
    ["apple", "banana", "mango", "orange", "papaya", "grapes", "guava", "pomegranate", "lemon", "water melon",
      "watermelon", "pineapple", "kinnow", "sapota", "chikoos", "musk melon", "pear", "plum", "litchi", "jack fruit",
      "seetafal", "amla", "karbuja", "mousambi", "sweet lime"],
  ],
  ["cash", ["cotton", "kapas", "sugarcane", "jute", "tobacco", "rubber", "coffee", "tea", "arecanut", "coconut"]],
];

export function cropGroup(commodity: string): CropGroup {
  const c = commodity.toLowerCase();
  for (const [group, words] of GROUP_KEYWORDS) {
    if (words.some((w) => c.includes(w))) return group;
  }
  return "other";
}

export function cropHindi(commodity: string): string {
  if (CROP_HINDI[commodity]) return CROP_HINDI[commodity]!;
  const key = Object.keys(CROP_HINDI).find(
    (k) => k.toLowerCase() === commodity.toLowerCase(),
  );
  if (key) return CROP_HINDI[key]!;
  const base = commodity.replace(/\(.*?\)/g, "").trim();
  const key2 = Object.keys(CROP_HINDI).find((k) => k.toLowerCase() === base.toLowerCase());
  return key2 ? CROP_HINDI[key2]! : commodity;
}

export const PRIORITY_CROPS = [
  "गेहूं", "धान", "चावल", "मक्का", "बाजरा", "ज्वार", "सरसों", "चना", "मूंग", "उड़द",
  "मसूर", "अरहर / तूर", "सोयाबीन", "कपास", "गन्ना", "आलू", "प्याज", "टमाटर", "लहसुन", "मटर",
];
