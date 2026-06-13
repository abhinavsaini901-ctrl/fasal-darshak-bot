import { createServerFn } from "@tanstack/react-start";

export type LiveNewsCategory =
  | "मंडी भाव"
  | "मौसम"
  | "सरकारी योजनाएं"
  | "फसल सलाह"
  | "कृषि तकनीक";

export type LiveNewsItem = {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: LiveNewsCategory;
  publishedAt: string;
  minutesAgo: number;
  gradient: string;
  iconKey: "trending" | "cloud" | "landmark" | "sprout" | "cpu";
  breaking?: boolean;
};

type CatMeta = { gradient: string; iconKey: LiveNewsItem["iconKey"]; keywords: string[] };

const CAT_META: Record<LiveNewsCategory, CatMeta> = {
  "मंडी भाव": {
    gradient: "from-lime-500 via-emerald-500 to-green-600",
    iconKey: "trending",
    keywords: ["मंडी", "भाव", "कीमत", "दाम", "रेट", "mandi", "price"],
  },
  "मौसम": {
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    iconKey: "cloud",
    keywords: ["मौसम", "बारिश", "बरसात", "तापमान", "ठंड", "गर्मी", "weather", "rain", "monsoon"],
  },
  "सरकारी योजनाएं": {
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    iconKey: "landmark",
    keywords: ["योजना", "सरकार", "PM", "प्रधानमंत्री", "सब्सिडी", "scheme", "subsidy", "kisan nidhi"],
  },
  "फसल सलाह": {
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    iconKey: "sprout",
    keywords: ["फसल", "बीज", "खाद", "उर्वरक", "रोग", "कीट", "सिंचाई", "crop", "seed", "fertilizer"],
  },
  "कृषि तकनीक": {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    iconKey: "cpu",
    keywords: ["तकनीक", "ड्रोन", "AI", "मशीन", "ट्रैक्टर", "स्मार्ट", "technology", "drone"],
  },
};

// Multiple Hindi-language Indian agriculture RSS sources
const FEEDS: { url: string; source: string }[] = [
  { url: "https://news.google.com/rss/search?q=%E0%A4%95%E0%A4%BF%E0%A4%B8%E0%A4%BE%E0%A4%A8&hl=hi&gl=IN&ceid=IN:hi", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=%E0%A4%96%E0%A5%87%E0%A4%A4%E0%A5%80&hl=hi&gl=IN&ceid=IN:hi", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=%E0%A4%AE%E0%A4%82%E0%A4%A1%E0%A5%80+%E0%A4%AD%E0%A4%BE%E0%A4%B5&hl=hi&gl=IN&ceid=IN:hi", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=%E0%A4%AE%E0%A5%8C%E0%A4%B8%E0%A4%AE+%E0%A4%95%E0%A4%BF%E0%A4%B8%E0%A4%BE%E0%A4%A8&hl=hi&gl=IN&ceid=IN:hi", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=%E0%A4%AA%E0%A5%80%E0%A4%8F%E0%A4%AE+%E0%A4%95%E0%A4%BF%E0%A4%B8%E0%A4%BE%E0%A4%A8+%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE&hl=hi&gl=IN&ceid=IN:hi", source: "Google News" },
];

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string): string {
  return decodeEntities(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function pick(tag: string, xml: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]).trim() : null;
}

// Lightweight non-crypto hash (FNV-1a, hex) — avoids crypto.subtle quirks in Workers
function hashId(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function categorize(text: string): LiveNewsCategory {
  const lower = text.toLowerCase();
  let best: LiveNewsCategory = "फसल सलाह";
  let bestScore = 0;
  (Object.keys(CAT_META) as LiveNewsCategory[]).forEach((cat) => {
    let score = 0;
    for (const kw of CAT_META[cat].keywords) {
      if (lower.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  });
  return best;
}

async function fetchFeed(url: string, fallbackSource: string): Promise<LiveNewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) {
      console.warn("news feed not ok", url, res.status);
      return [];
    }
    const xml = await res.text();
    const items: LiveNewsItem[] = [];
    const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(xml))) {
      const block = m[1];
      const title = stripTags(pick("title", block) || "");
      const link = (pick("link", block) || "").trim();
      const pub = pick("pubDate", block) || "";
      const descRaw = pick("description", block) || "";
      const source = stripTags(pick("source", block) || fallbackSource);
      if (!title || !link) continue;

      let summary = stripTags(descRaw).replace(/\s*-\s*[^-]{1,80}$/, "").trim();
      if (summary.length > 220) summary = summary.slice(0, 217) + "...";
      if (!summary) summary = title;

      const publishedAt = pub ? new Date(pub).toISOString() : new Date().toISOString();
      const minutesAgo = Math.max(
        1,
        Math.round((Date.now() - new Date(publishedAt).getTime()) / 60000),
      );
      const category = categorize(`${title} ${summary}`);
      const meta = CAT_META[category];

      items.push({
        id: hashId(link),
        title,
        summary,
        link,
        source,
        category,
        publishedAt,
        minutesAgo,
        gradient: meta.gradient,
        iconKey: meta.iconKey,
        breaking: minutesAgo <= 60,
      });
      if (items.length >= 12) break;
    }
    return items;
  } catch (e) {
    console.error("fetchFeed failed", url, e);
    return [];
  }
}

function fallbackItems(): LiveNewsItem[] {
  const now = Date.now();
  const base: Array<Omit<LiveNewsItem, "id" | "minutesAgo" | "publishedAt" | "gradient" | "iconKey" | "breaking">> = [
    {
      title: "रबी फसलों के लिए मौसम अलर्ट: अगले 48 घंटे में बारिश की संभावना",
      summary:
        "भारतीय मौसम विज्ञान विभाग (IMD) के अनुसार उत्तर भारत के कई जिलों में हल्की से मध्यम बारिश हो सकती है। किसान कटाई हुई फसल को सुरक्षित स्थान पर रखें।",
      link: "https://mausam.imd.gov.in/",
      source: "IMD",
      category: "मौसम",
    },
    {
      title: "पीएम किसान सम्मान निधि की अगली किस्त जल्द — eKYC ज़रूरी",
      summary:
        "पीएम किसान योजना की आगामी किस्त पाने के लिए सभी लाभार्थियों को eKYC पूरा करना अनिवार्य है। नज़दीकी CSC सेंटर या pmkisan.gov.in से अपडेट करें।",
      link: "https://pmkisan.gov.in/",
      source: "PM-KISAN",
      category: "सरकारी योजनाएं",
    },
    {
      title: "गेहूं और सरसों के मंडी भाव में मामूली बढ़त — आज के ताज़ा रेट देखें",
      summary:
        "देशभर की प्रमुख मंडियों में गेहूं ₹2,250–₹2,450 प्रति क्विंटल और सरसों ₹5,400–₹5,900 के बीच कारोबार कर रही है। राज्यवार रेट के लिए AGMARKNET देखें।",
      link: "https://agmarknet.gov.in/",
      source: "AGMARKNET",
      category: "मंडी भाव",
    },
    {
      title: "गेहूं में पीला रतुआ (Yellow Rust) से बचाव के उपाय",
      summary:
        "ICAR की सलाह के अनुसार पीला रतुआ दिखते ही Propiconazole 25 EC @ 0.1% का छिड़काव करें और रोग प्रतिरोधी किस्मों HD-3086, DBW-187 का प्रयोग करें।",
      link: "https://icar.org.in/",
      source: "ICAR",
      category: "फसल सलाह",
    },
    {
      title: "कृषि ड्रोन सब्सिडी: 50% तक अनुदान, ऐसे करें आवेदन",
      summary:
        "सरकार किसान उत्पादक संगठनों (FPO) और SC/ST/महिला किसानों को कृषि ड्रोन पर 50% तक की सब्सिडी दे रही है। आवेदन agrimachinery.nic.in पर करें।",
      link: "https://agrimachinery.nic.in/",
      source: "कृषि मंत्रालय",
      category: "कृषि तकनीक",
    },
    {
      title: "खरीफ की तैयारी: मिट्टी जांच और बीज उपचार ज़रूर करें",
      summary:
        "बुवाई से पहले Soil Health Card के अनुसार खाद की मात्रा तय करें और बीजों का Carbendazim @ 2g/kg से उपचार करें ताकि अंकुरण बेहतर हो।",
      link: "https://soilhealth.dac.gov.in/",
      source: "Soil Health",
      category: "फसल सलाह",
    },
  ];
  return base.map((b, i) => {
    const meta = CAT_META[b.category];
    const minutesAgo = 10 + i * 20;
    return {
      ...b,
      id: hashId(b.link + i),
      minutesAgo,
      publishedAt: new Date(now - minutesAgo * 60000).toISOString(),
      gradient: meta.gradient,
      iconKey: meta.iconKey,
      breaking: minutesAgo <= 60,
    };
  });
}

type Cache = { at: number; data: LiveNewsItem[] };
let CACHE: Cache | null = null;
const TTL_MS = 60 * 60 * 1000;

export const getLiveAgriNews = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (CACHE && now - CACHE.at < TTL_MS && CACHE.data.length > 0) {
    return { items: CACHE.data, cachedAt: new Date(CACHE.at).toISOString(), fresh: false };
  }

  try {
    const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.url, f.source)));
    const flat: LiveNewsItem[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") flat.push(...r.value);
    }

    const seen = new Set<string>();
    const unique = flat.filter((it) => {
      const k = it.title.slice(0, 60).toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    unique.sort((a, b) => a.minutesAgo - b.minutesAgo);

    const final = unique.length >= 6 ? unique.slice(0, 30) : [...unique, ...fallbackItems()];
    CACHE = { at: now, data: final };
    return { items: final, cachedAt: new Date(now).toISOString(), fresh: true };
  } catch (e) {
    console.error("getLiveAgriNews failed:", e);
    const fb = fallbackItems();
    if (CACHE) return { items: CACHE.data, cachedAt: new Date(CACHE.at).toISOString(), fresh: false };
    return { items: fb, cachedAt: new Date().toISOString(), fresh: true };
  }
});
