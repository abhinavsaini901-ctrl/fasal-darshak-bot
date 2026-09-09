import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  MapPin, Search, RefreshCw, AlertCircle, Loader2, ArrowUpDown, ShieldCheck, Store,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMandiPrices, getMandiStates, locateMandiRegion } from "@/lib/mandi.functions";
import type { MandiRecord } from "@/lib/mandi.functions";
import { CROP_GROUP_LABELS, cropGroup, cropHindi, PRIORITY_CROPS } from "@/lib/mandi-crops";
import type { CropGroup } from "@/lib/mandi-crops";

export const Route = createFileRoute("/mandi-bhav")({
  component: MandiBhavPage,
  head: () => ({
    meta: [
      { title: "मंडी भाव 📊 — आज का सभी फसलों का भाव | किसान लेंस" },
      {
        name: "description",
        content:
          "अपने आसपास की मंडियों का आज का भाव देखें — गेहूं, धान, सरसों, चना, कपास, आलू, प्याज, टमाटर सहित सभी फसलों के न्यूनतम, अधिकतम और मॉडल रेट (₹/क्विंटल), सरकारी बाज़ार डेटा से।",
      },
      { property: "og:title", content: "आज का मंडी भाव — सभी फसलें | किसान लेंस" },
      { property: "og:description", content: "लोकेशन के आधार पर नजदीकी मंडियों का आज का सरकारी मंडी भाव।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://kisanlens.com/mandi-bhav" },
    ],
    links: [{ rel: "canonical", href: "https://kisanlens.com/mandi-bhav" }],
  }),
});

const GROUPS: Array<{ id: "all" | CropGroup; label: string }> = [
  { id: "all", label: "सभी फसलें" },
  { id: "cereals", label: CROP_GROUP_LABELS.cereals },
  { id: "pulses", label: CROP_GROUP_LABELS.pulses },
  { id: "oilseeds", label: CROP_GROUP_LABELS.oilseeds },
  { id: "vegetables", label: CROP_GROUP_LABELS.vegetables },
  { id: "fruits", label: CROP_GROUP_LABELS.fruits },
  { id: "cash", label: CROP_GROUP_LABELS.cash },
];

type Sort = "priority" | "low" | "high";

function toTs(d: string) {
  const m = d.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  return m ? Date.parse(`${m[3]}-${m[2]}-${m[1]}`) : 0;
}

function isFresh(dateStr: string) {
  const ts = toTs(dateStr);
  if (!ts) return false;
  return Date.now() - ts < 36 * 60 * 60 * 1000; // aaj / kal tak ka data
}

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function MandiBhavPage() {
  const fetchStates = useServerFn(getMandiStates);
  const fetchPrices = useServerFn(getMandiPrices);
  const locate = useServerFn(locateMandiRegion);

  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [market, setMarket] = useState("");
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<"all" | CropGroup>("all");
  const [sort, setSort] = useState<Sort>("priority");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "denied" | "done">("idle");
  const [nearbyDistrict, setNearbyDistrict] = useState("");

  const statesQ = useQuery({
    queryKey: ["mandi-states"],
    queryFn: () => fetchStates(),
    staleTime: 30 * 60 * 1000,
  });

  const pricesQ = useQuery({
    queryKey: ["mandi-prices", stateName, district],
    queryFn: () => fetchPrices({ data: { state: stateName, district } }),
    enabled: stateName.length > 0,
    staleTime: 15 * 60 * 1000,
  });

  const records = pricesQ.data?.ok ? pricesQ.data.records : [];

  const districts = useMemo(
    () => Array.from(new Set(records.map((r) => r.district))).filter(Boolean).sort(),
    [records],
  );
  const markets = useMemo(
    () =>
      Array.from(
        new Set(records.filter((r) => !district || r.district === district).map((r) => r.market)),
      )
        .filter(Boolean)
        .sort(),
    [records, district],
  );

  const nearbyMarkets = useMemo(() => {
    if (!nearbyDistrict) return [];
    return Array.from(
      new Set(
        records
          .filter((r) => r.district.toLowerCase() === nearbyDistrict.toLowerCase())
          .map((r) => r.market),
      ),
    ).sort();
  }, [records, nearbyDistrict]);

  const rows = useMemo(() => {
    let list = records.filter((r) => isFresh(r.arrivalDate));
    if (district) list = list.filter((r) => r.district === district);
    if (market) list = list.filter((r) => r.market === market);
    if (group !== "all") list = list.filter((r) => cropGroup(r.commodity) === group);
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (r) =>
          r.commodity.toLowerCase().includes(needle) ||
          cropHindi(r.commodity).includes(q.trim()) ||
          r.market.toLowerCase().includes(needle),
      );
    }
    // ek crop+mandi ka sabse naya record
    const seen = new Map<string, MandiRecord>();
    for (const r of list) {
      const k = `${r.market}|${r.commodity}|${r.variety}`;
      const prev = seen.get(k);
      if (!prev || toTs(r.arrivalDate) > toTs(prev.arrivalDate)) seen.set(k, r);
    }
    let out = Array.from(seen.values());
    if (sort === "low") out.sort((a, b) => a.modalPrice - b.modalPrice);
    else if (sort === "high") out.sort((a, b) => b.modalPrice - a.modalPrice);
    else
      out.sort((a, b) => {
        const near = (r: MandiRecord) =>
          nearbyDistrict && r.district.toLowerCase() === nearbyDistrict.toLowerCase() ? 0 : 1;
        if (near(a) !== near(b)) return near(a) - near(b);
        const pi = (r: MandiRecord) => {
          const i = PRIORITY_CROPS.indexOf(cropHindi(r.commodity));
          return i === -1 ? 999 : i;
        };
        if (pi(a) !== pi(b)) return pi(a) - pi(b);
        return cropHindi(a.commodity).localeCompare(cropHindi(b.commodity), "hi");
      });
    return out.slice(0, 300);
  }, [records, district, market, group, q, sort, nearbyDistrict]);

  async function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const region = await locate({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          if (region.state) {
            setStateName(region.state);
            setNearbyDistrict(region.district);
            setDistrict("");
            setMarket("");
            setGeoStatus("done");
          } else {
            setGeoStatus("denied");
          }
        } catch {
          setGeoStatus("denied");
        }
      },
      () => setGeoStatus("denied"),
      { timeout: 12000, maximumAge: 300000 },
    );
  }

  const unavailable = pricesQ.data && !pricesQ.data.ok;
  const lastUpdated = pricesQ.data?.fetchedAt
    ? new Date(pricesQ.data.fetchedAt).toLocaleString("hi-IN", { dateStyle: "medium", timeStyle: "short" })
    : "";

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <Breadcrumbs items={[{ label: "मंडी भाव" }]} />
        <h1 className="text-2xl font-bold md:text-4xl">मंडी भाव 📊</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          अपने आसपास की मंडियों का आज का भाव — सभी फसलों के न्यूनतम, अधिकतम और मॉडल रेट (₹/क्विंटल)।
        </p>

        {/* Location */}
        <Card className="mt-5 border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <MapPin className="h-5 w-5 text-primary" /> 📍 आपके आसपास की मंडियां
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            आपकी लोकेशन सिर्फ नजदीकी मंडी खोजने के लिए इस्तेमाल होती है — कहीं सेव नहीं की जाती।
          </p>
          <Button
            onClick={useMyLocation}
            disabled={geoStatus === "loading"}
            className="mt-3 h-12 w-full rounded-xl bg-gradient-primary text-base font-bold"
          >
            {geoStatus === "loading" ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> लोकेशन खोजी जा रही है…</>
            ) : (
              <><MapPin className="mr-2 h-5 w-5" /> मेरी लोकेशन से मंडियां दिखाएं</>
            )}
          </Button>

          {geoStatus === "denied" && (
            <p className="mt-2 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
              लोकेशन नहीं मिली। नीचे से राज्य, जिला और मंडी खुद चुन लें।
            </p>
          )}
          {geoStatus === "done" && nearbyDistrict && (
            <p className="mt-2 rounded-lg bg-primary/10 p-2.5 text-xs font-medium text-primary">
              आपका क्षेत्र: {nearbyDistrict}, {stateName} — नजदीकी मंडियां पहले दिखाई जा रही हैं।
              {nearbyMarkets.length > 0 && ` (${nearbyMarkets.slice(0, 4).join(", ")})`}
            </p>
          )}
        </Card>

        {/* Mandi selection */}
        <Card className="mt-4 border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Store className="h-5 w-5 text-primary" /> अपनी मंडी चुनें 🔍
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-medium">
              राज्य
              <select
                value={stateName}
                onChange={(e) => {
                  setStateName(e.target.value);
                  setDistrict("");
                  setMarket("");
                }}
                className="mt-1 h-12 w-full rounded-xl border border-input bg-background px-3 text-base"
              >
                <option value="">— राज्य चुनें —</option>
                {(statesQ.data?.states ?? []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              जिला
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setMarket("");
                }}
                disabled={districts.length === 0}
                className="mt-1 h-12 w-full rounded-xl border border-input bg-background px-3 text-base disabled:opacity-50"
              >
                <option value="">सभी जिले</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              मंडी
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                disabled={markets.length === 0}
                className="mt-1 h-12 w-full rounded-xl border border-input bg-background px-3 text-base disabled:opacity-50"
              >
                <option value="">सभी मंडियां</option>
                {markets.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
          {statesQ.data && !statesQ.data.ok && (
            <p className="mt-2 text-xs text-muted-foreground">
              राज्यों की सूची अभी लोड नहीं हो पाई — सरकारी डेटा सेवा उपलब्ध नहीं है।
            </p>
          )}
        </Card>

        {/* Today's rates */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold md:text-2xl">🌾 आज के सभी फसलों के मंडी भाव</h2>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => { void pricesQ.refetch(); void statesQ.refetch(); }}
            disabled={pricesQ.isFetching}
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${pricesQ.isFetching ? "animate-spin" : ""}`} />
            🔄 मंडी भाव रिफ्रेश करें
          </Button>
        </div>

        {/* Search + filters */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="फसल या मंडी खोजें… (जैसे गेहूं, Wheat, Ambala)"
              className="h-12 rounded-xl pl-11 text-base"
            />
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGroup(g.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  group === g.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/80"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            {([
              { id: "priority", label: "नजदीकी मंडी पहले" },
              { id: "low", label: "भाव: कम से ज्यादा" },
              { id: "high", label: "भाव: ज्यादा से कम" },
            ] as Array<{ id: Sort; label: string }>).map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  sort === s.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-5">
          {!stateName ? (
            <Card className="border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              भाव देखने के लिए ऊपर से अपनी लोकेशन इस्तेमाल करें या राज्य चुनें।
            </Card>
          ) : pricesQ.isPending || pricesQ.isFetching ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-40 animate-pulse border border-border bg-secondary/40 p-4" />
              ))}
            </div>
          ) : unavailable || rows.length === 0 ? (
            <Card className="border border-border bg-card p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
              <p className="mt-3 text-base font-bold">आज का मंडी भाव उपलब्ध नहीं है।</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pricesQ.data?.reason === "no_key"
                  ? "सरकारी बाज़ार डेटा सेवा अभी इस ऐप से जुड़ी नहीं है। जुड़ते ही असली भाव यहीं दिखेंगे।"
                  : "इस मंडी/क्षेत्र के लिए आज का सत्यापित भाव सरकारी स्रोत पर प्रकाशित नहीं हुआ है। कृपया बाद में या दूसरी मंडी चुनकर देखें।"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                हम पुराने भाव को “आज का भाव” बताकर नहीं दिखाते।
              </p>
            </Card>
          ) : (
            <>
              <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {rows.length} भाव मिले • Source: Official Market Data (data.gov.in / Agmarknet)
                {lastUpdated ? ` • Last Updated: ${lastUpdated}` : ""}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rows.map((r, i) => (
                  <Card
                    key={`${r.market}-${r.commodity}-${r.variety}-${i}`}
                    className="border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold leading-tight">🌾 {cropHindi(r.commodity)}</p>
                        {r.variety && r.variety !== "Other" && (
                          <p className="text-xs text-muted-foreground">किस्म: {r.variety}</p>
                        )}
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {CROP_GROUP_LABELS[cropGroup(r.commodity)]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">🏪 {r.market}</p>
                    <p className="text-xs text-muted-foreground">📍 {r.district}, {r.state}</p>
                    <p className="text-xs text-muted-foreground">📅 {r.arrivalDate}</p>
                    <div className="mt-3 space-y-1 rounded-xl bg-secondary/60 p-3 text-sm">
                      <div className="flex justify-between"><span>💰 न्यूनतम</span><span className="font-bold">{inr(r.minPrice)}</span></div>
                      <div className="flex justify-between"><span>💰 अधिकतम</span><span className="font-bold">{inr(r.maxPrice)}</span></div>
                      <div className="flex justify-between text-base text-primary">
                        <span className="font-semibold">💰 मॉडल भाव</span>
                        <span className="font-extrabold">{inr(r.modalPrice)}</span>
                      </div>
                      <p className="pt-1 text-[11px] text-muted-foreground">⚖️ यूनिट: ₹ / क्विंटल</p>
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground">Source: Official Market Data</p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          भाव सरकारी कृषि विपणन डेटा (Agmarknet / data.gov.in) से लिए जाते हैं। सौदा करने से पहले
          अपनी मंडी में भाव की पुष्टि कर लें।
        </p>
      </div>
    </PageShell>
  );
}
