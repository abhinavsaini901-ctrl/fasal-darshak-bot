import { useEffect, useState } from "react";
import { MapPin, Sun, CloudRain, Cloud, CloudSnow, Loader2, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getWeather, reverseGeo } from "@/lib/weather.functions";

type Weather = {
  tempC: number;
  code: number;
  label: string;
  Icon: typeof Sun;
};

type Loc = { district: string; state: string; lat: number; lon: number };

const DISTRICTS: Array<{ label: string; lat: number; lon: number; state: string }> = [
  { label: "लुधियाना", state: "पंजाब", lat: 30.901, lon: 75.857 },
  { label: "अमृतसर", state: "पंजाब", lat: 31.634, lon: 74.872 },
  { label: "करनाल", state: "हरियाणा", lat: 29.685, lon: 76.99 },
  { label: "हिसार", state: "हरियाणा", lat: 29.151, lon: 75.722 },
  { label: "लखनऊ", state: "उत्तर प्रदेश", lat: 26.846, lon: 80.946 },
  { label: "बाराबंकी", state: "उत्तर प्रदेश", lat: 26.927, lon: 81.183 },
  { label: "मेरठ", state: "उत्तर प्रदेश", lat: 28.984, lon: 77.706 },
  { label: "जयपुर", state: "राजस्थान", lat: 26.912, lon: 75.787 },
  { label: "जोधपुर", state: "राजस्थान", lat: 26.238, lon: 73.024 },
  { label: "भोपाल", state: "मध्य प्रदेश", lat: 23.259, lon: 77.413 },
  { label: "इंदौर", state: "मध्य प्रदेश", lat: 22.719, lon: 75.857 },
  { label: "पटना", state: "बिहार", lat: 25.594, lon: 85.137 },
  { label: "नागपुर", state: "महाराष्ट्र", lat: 21.146, lon: 79.088 },
  { label: "पुणे", state: "महाराष्ट्र", lat: 18.520, lon: 73.856 },
  { label: "अहमदाबाद", state: "गुजरात", lat: 23.022, lon: 72.571 },
  { label: "राजकोट", state: "गुजरात", lat: 22.303, lon: 70.802 },
  { label: "बेंगलुरु", state: "कर्नाटक", lat: 12.972, lon: 77.594 },
  { label: "हैदराबाद", state: "तेलंगाना", lat: 17.385, lon: 78.487 },
  { label: "कोलकाता", state: "पश्चिम बंगाल", lat: 22.573, lon: 88.364 },
  { label: "चेन्नई", state: "तमिलनाडु", lat: 13.083, lon: 80.270 },
];

function decodeWeather(code: number): { label: string; Icon: typeof Sun } {
  if (code === 0) return { label: "साफ धूप", Icon: Sun };
  if (code <= 3) return { label: "आंशिक बादल", Icon: Cloud };
  if (code <= 48) return { label: "कोहरा", Icon: Cloud };
  if (code <= 67) return { label: "बारिश", Icon: CloudRain };
  if (code <= 77) return { label: "बर्फबारी", Icon: CloudSnow };
  if (code <= 82) return { label: "तेज़ बौछार", Icon: CloudRain };
  if (code <= 99) return { label: "गरज के साथ बारिश", Icon: CloudRain };
  return { label: "मौसम", Icon: Cloud };
}

function adviceFor(code: number, temp: number): string {
  if (code >= 51 && code <= 99)
    return "बारिश का मौसम: छिड़काव टालें, खेत में जल निकासी की व्यवस्था जांचें।";
  if (temp >= 38) return "तेज़ गर्मी: सिंचाई सुबह या शाम करें, फसल को मल्चिंग से बचाएं।";
  if (temp <= 10) return "ठंड ज़्यादा: पाले से बचाव के लिए हल्की सिंचाई और धुआं करें।";
  if (code >= 1 && code <= 3)
    return "हल्के बादल: छिड़काव और निराई-गुड़ाई के लिए अच्छा समय है।";
  return "मौसम साफ: खाद-छिड़काव और बुवाई के लिए उपयुक्त दिन है।";
}

async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const w = await getWeather({ data: { lat, lon } });
  const { label, Icon } = decodeWeather(w.code);
  return { tempC: w.tempC, code: w.code, label, Icon };
}

async function reverseGeocode(lat: number, lon: number) {
  return await reverseGeo({ data: { lat, lon } });
}

export function WeatherLocationCard() {
  const [loc, setLoc] = useState<Loc | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [needsManual, setNeedsManual] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setNeedsManual(true);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const [geo, w] = await Promise.all([
            reverseGeocode(latitude, longitude),
            fetchWeather(latitude, longitude),
          ]);
          setLoc({ ...geo, lat: latitude, lon: longitude });
          setWeather(w);
        } catch {
          setNeedsManual(true);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setNeedsManual(true);
        setLoading(false);
      },
      { timeout: 8000 },
    );
  }, []);

  async function pickDistrict(label: string) {
    const d = DISTRICTS.find((x) => x.label === label);
    if (!d) return;
    setLoading(true);
    try {
      const w = await fetchWeather(d.lat, d.lon);
      setLoc({ district: d.label, state: d.state, lat: d.lat, lon: d.lon });
      setWeather(w);
      setNeedsManual(false);
    } finally {
      setLoading(false);
    }
  }

  const Icon = weather?.Icon ?? Cloud;
  const tip = weather ? adviceFor(weather.code, weather.tempC) : "मौसम लोड हो रहा है…";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 shadow-soft">
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:items-center">
          {/* LEFT: Location */}
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                आपका स्थान
              </p>
              {loading && !needsManual ? (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> स्थान का पता लगाया जा रहा है…
                </p>
              ) : needsManual ? (
                <div className="mt-1.5">
                  <label className="sr-only" htmlFor="district-select">ज़िला चुनें</label>
                  <select
                    id="district-select"
                    onChange={(e) => pickDistrict(e.target.value)}
                    defaultValue=""
                    className="w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="" disabled>-- अपना ज़िला चुनें --</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.label} value={d.label}>
                        {d.label}, {d.state}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    स्थान की अनुमति नहीं मिली — कृपया ज़िला चुनें।
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-0.5 text-lg font-bold leading-tight text-foreground">
                    {loc?.district}
                  </p>
                  {loc?.state && (
                    <p className="text-sm text-muted-foreground">{loc.state}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Weather */}
          <div className="flex items-center justify-start gap-4 sm:justify-end">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                अभी का मौसम
              </p>
              {weather ? (
                <>
                  <p className="text-3xl font-extrabold leading-tight text-foreground">
                    {weather.tempC}°C
                  </p>
                  <p className="text-sm font-medium text-primary">{weather.label}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">—</p>
              )}
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {loading ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <Icon className="h-9 w-9" />
              )}
            </div>
          </div>
        </div>

        {/* Advice strip */}
        <div className="flex items-start gap-2 border-t border-primary/15 bg-primary/5 px-5 py-3">
          <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm leading-snug text-foreground">
            <span className="font-semibold text-primary">कृषि सलाह: </span>
            {tip}
          </p>
        </div>
      </Card>
    </section>
  );
}
