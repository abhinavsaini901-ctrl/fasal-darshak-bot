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
  publishedAt: string; // ISO
  minutesAgo: number;
  gradient: string;
  iconKey: "trending" | "cloud" | "landmark" | "sprout" | "cpu";
  breaking?: boolean;
};

const QUERIES: Record<LiveNewsCategory, { q: string; gradient: string; iconKey: LiveNewsItem["iconKey"] }> = {
  "मंडी भाव": {
    q: "मंडी भाव किसान OR mandi price farmer India",
    gradient: "from-lime-500 via-emerald-500 to-green-600",
    iconKey: "trending",
  },
  "मौसम": {
    q: "मौसम किसान बारिश OR weather farmer rain India agriculture",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    iconKey: "cloud",
  },
  "सरकारी योजनाएं": {
    q: "किसान योजना PM Kisan OR farmer scheme government India",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    iconKey: "landmark",
  },
  "फसल सलाह": {
    q: "फसल सलाह रोग कीट OR crop advisory disease pest India",
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    iconKey: "sprout",
  },
  "कृषि तकनीक": {
    q: "कृषि तकनीक ICAR OR agri technology drone India",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    iconKey: "cpu",
  },
};

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

async function hashId(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function fetchCategory(cat: LiveNewsCategory, limit: number): Promise<LiveNewsItem[]> {
  const { q, gradient, iconKey } = QUERIES[cat];
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=hi&gl=IN&ceid=IN:hi`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (KisanMitra News Bot)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();

  const items: LiveNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) && items.length < limit) {
    const block = m[1];
    const title = stripTags(pick("title", block) || "");
    const link = (pick("link", block) || "").trim();
    const pub = pick("pubDate", block) || "";
    const descRaw = pick("description", block) || "";
    const source = stripTags(pick("source", block) || "Google News");

    if (!title || !link) continue;

    // Google News description often has HTML with links — strip and trim
    let summary = stripTags(descRaw);
    // Remove trailing "  <source>" duplication
    summary = summary.replace(/\s*-\s*[^-]{1,80}$/, "").trim();
    if (summary.length > 220) summary = summary.slice(0, 217) + "...";
    if (!summary) summary = title;

    const publishedAt = pub ? new Date(pub).toISOString() : new Date().toISOString();
    const minutesAgo = Math.max(
      1,
      Math.round((Date.now() - new Date(publishedAt).getTime()) / 60000)
    );

    const id = await hashId(link);
    items.push({
      id,
      title,
      summary,
      link,
      source,
      category: cat,
      publishedAt,
      minutesAgo,
      gradient,
      iconKey,
      breaking: minutesAgo <= 60,
    });
  }
  return items;
}

// In-memory cache (per Worker isolate) — refresh every hour
type Cache = { at: number; data: LiveNewsItem[] };
let CACHE: Cache | null = null;
const TTL_MS = 60 * 60 * 1000;

export const getLiveAgriNews = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (CACHE && now - CACHE.at < TTL_MS && CACHE.data.length > 0) {
    return { items: CACHE.data, cachedAt: new Date(CACHE.at).toISOString(), fresh: false };
  }

  try {
    const cats: LiveNewsCategory[] = [
      "सरकारी योजनाएं",
      "मौसम",
      "मंडी भाव",
      "फसल सलाह",
      "कृषि तकनीक",
    ];
    const results = await Promise.all(cats.map((c) => fetchCategory(c, 4)));
    const flat = results.flat();
    // Deduplicate by title prefix
    const seen = new Set<string>();
    const unique = flat.filter((it) => {
      const k = it.title.slice(0, 60).toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    // Sort newest first
    unique.sort((a, b) => a.minutesAgo - b.minutesAgo);

    if (unique.length === 0) {
      // Don't overwrite a previous good cache with empty
      if (CACHE) return { items: CACHE.data, cachedAt: new Date(CACHE.at).toISOString(), fresh: false };
      return { items: [], cachedAt: new Date().toISOString(), fresh: true };
    }

    CACHE = { at: now, data: unique };
    return { items: unique, cachedAt: new Date(now).toISOString(), fresh: true };
  } catch (e) {
    console.error("getLiveAgriNews failed:", e);
    if (CACHE) return { items: CACHE.data, cachedAt: new Date(CACHE.at).toISOString(), fresh: false };
    return { items: [], cachedAt: new Date().toISOString(), fresh: true };
  }
});
