import { createServerFn } from "@tanstack/react-start";

// Official source: Government of India Open Data Platform (data.gov.in)
// Resource: "Current Daily Price of Various Commodities from Various Markets (Mandi)"
// published by Directorate of Marketing & Inspection (Agmarknet), Ministry of Agriculture.
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const BASE = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

export type MandiRecord = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrivalDate: string; // dd/mm/yyyy as published
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
};

export type MandiResponse = {
  ok: boolean;
  /** why data is unavailable, if ok === false */
  reason?: "no_key" | "source_error" | "no_data";
  records: MandiRecord[];
  /** latest arrival date present in the returned records (dd/mm/yyyy) */
  latestDate?: string;
  fetchedAt: string; // ISO
};

function apiKey(): string | null {
  const k = process.env["DATA_GOV_IN_API_KEY"];
  return k && k.trim().length > 0 ? k.trim() : null;
}

function num(v: unknown): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return isFinite(n) ? n : 0;
}

function mapRecords(rows: any[]): MandiRecord[] {
  return rows
    .map((r) => ({
      state: String(r.state ?? r.State ?? "").trim(),
      district: String(r.district ?? r.District ?? "").trim(),
      market: String(r.market ?? r.Market ?? "").trim(),
      commodity: String(r.commodity ?? r.Commodity ?? "").trim(),
      variety: String(r.variety ?? r.Variety ?? "").trim(),
      grade: String(r.grade ?? r.Grade ?? "").trim(),
      arrivalDate: String(r.arrival_date ?? r.Arrival_Date ?? "").trim(),
      minPrice: num(r.min_price ?? r.Min_Price),
      maxPrice: num(r.max_price ?? r.Max_Price),
      modalPrice: num(r.modal_price ?? r.Modal_Price),
    }))
    .filter((r) => r.commodity && r.market && r.modalPrice > 0);
}

async function query(params: Record<string, string>): Promise<MandiResponse> {
  const key = apiKey();
  const fetchedAt = new Date().toISOString();
  if (!key) return { ok: false, reason: "no_key", records: [], fetchedAt };

  const url = new URL(BASE);
  url.searchParams.set("api-key", key);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", params["limit"] ?? "500");
  for (const [k, v] of Object.entries(params)) {
    if (k === "limit" || !v) continue;
    url.searchParams.set(`filters[${k}]`, v);
  }

  try {
    const r = await fetch(url.toString(), { signal: AbortSignal.timeout(20000) });
    if (!r.ok) return { ok: false, reason: "source_error", records: [], fetchedAt };
    const j: any = await r.json();
    if (j?.error) return { ok: false, reason: "source_error", records: [], fetchedAt };
    const records = mapRecords(Array.isArray(j?.records) ? j.records : []);
    if (records.length === 0) return { ok: false, reason: "no_data", records: [], fetchedAt };

    // Newest publication date among returned rows
    const toTs = (d: string) => {
      const m = d.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
      return m ? Date.parse(`${m[3]}-${m[2]}-${m[1]}`) : 0;
    };
    const latest = records.reduce(
      (acc, r2) => (toTs(r2.arrivalDate) > toTs(acc) ? r2.arrivalDate : acc),
      records[0]!.arrivalDate,
    );
    return { ok: true, records, latestDate: latest, fetchedAt };
  } catch {
    return { ok: false, reason: "source_error", records: [], fetchedAt };
  }
}

/** Prices for a state (optionally district / market / commodity). */
export const getMandiPrices = createServerFn({ method: "GET" })
  .inputValidator((data: { state?: string; district?: string; market?: string; commodity?: string }) => ({
    state: (data.state ?? "").slice(0, 60),
    district: (data.district ?? "").slice(0, 60),
    market: (data.market ?? "").slice(0, 60),
    commodity: (data.commodity ?? "").slice(0, 60),
  }))
  .handler(async ({ data }): Promise<MandiResponse> => {
    const params: Record<string, string> = { limit: "1000" };
    if (data.state) params["state.keyword"] = data.state;
    if (data.district) params["district"] = data.district;
    if (data.market) params["market"] = data.market;
    if (data.commodity) params["commodity"] = data.commodity;
    return query(params);
  });

/** Distinct states available in today's published data. */
export const getMandiStates = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ok: boolean; reason?: string; states: string[] }> => {
    const res = await query({ limit: "5000" });
    if (!res.ok) return { ok: false, reason: res.reason, states: [] };
    const states = Array.from(new Set(res.records.map((r) => r.state))).sort();
    return { ok: true, states };
  },
);

/** Reverse geocode coordinates to an English state/district for mandi lookup.
 *  Coordinates are used only for this lookup and are never stored. */
export const locateMandiRegion = createServerFn({ method: "GET" })
  .inputValidator((data: { lat: number; lon: number }) => {
    const lat = Number(data.lat);
    const lon = Number(data.lon);
    if (!isFinite(lat) || !isFinite(lon)) throw new Error("Invalid coords");
    return { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 };
  })
  .handler(async ({ data }): Promise<{ state: string; district: string }> => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&zoom=8&accept-language=en&lat=${data.lat}&lon=${data.lon}`,
        { headers: { "User-Agent": "KisanLens/1.0 (mandi lookup)" }, signal: AbortSignal.timeout(12000) },
      );
      const j: any = await r.json();
      const a = j?.address ?? {};
      const district = String(a.state_district ?? a.county ?? a.city ?? a.town ?? "").replace(/\s*district\s*/i, "").trim();
      return { state: String(a.state ?? "").trim(), district };
    } catch {
      return { state: "", district: "" };
    }
  });
