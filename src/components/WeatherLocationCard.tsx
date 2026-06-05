import { useEffect, useState } from "react";
import { MapPin, Sun, CloudRain, Cloud, CloudSnow, Loader2, Sprout, LocateFixed } from "lucide-react";
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
  { label: "जालंधर", state: "पंजाब", lat: 31.326, lon: 75.576 },
  { label: "पटियाला", state: "पंजाब", lat: 30.339, lon: 76.386 },
  { label: "करनाल", state: "हरियाणा", lat: 29.685, lon: 76.99 },
  { label: "हिसार", state: "हरियाणा", lat: 29.151, lon: 75.722 },
  { label: "रोहतक", state: "हरियाणा", lat: 28.895, lon: 76.606 },
  { label: "गुरुग्राम", state: "हरियाणा", lat: 28.457, lon: 77.026 },
  { label: "लखनऊ", state: "उत्तर प्रदेश", lat: 26.846, lon: 80.946 },
  { label: "बाराबंकी", state: "उत्तर प्रदेश", lat: 26.927, lon: 81.183 },
  { label: "मेरठ", state: "उत्तर प्रदेश", lat: 28.984, lon: 77.706 },
  { label: "वाराणसी", state: "उत्तर प्रदेश", lat: 25.317, lon: 82.973 },
  { label: "कानपुर", state: "उत्तर प्रदेश", lat: 26.449, lon: 80.331 },
  { label: "आगरा", state: "उत्तर प्रदेश", lat: 27.176, lon: 78.008 },
  { label: "जयपुर", state: "राजस्थान", lat: 26.912, lon: 75.787 },
  { label: "जोधपुर", state: "राजस्थान", lat: 26.238, lon: 73.024 },
  { label: "उदयपुर", state: "राजस्थान", lat: 24.585, lon: 73.712 },
  { label: "कोटा", state: "राजस्थान", lat: 25.213, lon: 75.864 },
  { label: "भोपाल", state: "मध्य प्रदेश", lat: 23.259, lon: 77.413 },
  { label: "इंदौर", state: "मध्य प्रदेश", lat: 22.719, lon: 75.857 },
  { label: "ग्वालियर", state: "मध्य प्रदेश", lat: 26.218, lon: 78.182 },
  { label: "जबलपुर", state: "मध्य प्रदेश", lat: 23.181, lon: 79.986 },
  { label: "पटना", state: "बिहार", lat: 25.594, lon: 85.137 },
  { label: "गया", state: "बिहार", lat: 24.796, lon: 85.003 },
  { label: "मुजफ्फरपुर", state: "बिहार", lat: 26.122, lon: 85.391 },
  { label: "नागपुर", state: "महाराष्ट्र", lat: 21.146, lon: 79.088 },
  { label: "पुणे", state: "महाराष्ट्र", lat: 18.520, lon: 73.856 },
  { label: "मुंबई", state: "महाराष्ट्र", lat: 19.076, lon: 72.877 },
  { label: "नासिक", state: "महाराष्ट्र", lat: 19.997, lon: 73.789 },
  { label: "अहमदाबाद", state: "गुजरात", lat: 23.022, lon: 72.571 },
  { label: "राजकोट", state: "गुजरात", lat: 22.303, lon: 70.802 },
  { label: "सूरत", state: "गुजरात", lat: 21.170, lon: 72.831 },
  { label: "बेंगलुरु", state: "कर्नाटक", lat: 12.972, lon: 77.594 },
  { label: "मैसूर", state: "कर्नाटक", lat: 12.295, lon: 76.639 },
  { label: "हैदराबाद", state: "तेलंगाना", lat: 17.385, lon: 78.487 },
  { label: "वारंगल", state: "तेलंगाना", lat: 17.967, lon: 79.594 },
  { label: "कोलकाता", state: "पश्चिम बंगाल", lat: 22.573, lon: 88.364 },
  { label: "सिलीगुड़ी", state: "पश्चिम बंगाल", lat: 26.727, lon: 88.395 },
  { label: "चेन्नई", state: "तमिलनाडु", lat: 13.083, lon: 80.270 },
  { label: "कोयंबटूर", state: "तमिलनाडु", lat: 11.016, lon: 76.955 },
  { label: "देहरादून", state: "उत्तराखंड", lat: 30.316, lon: 78.032 },
  { label: "रांची", state: "झारखंड", lat: 23.344, lon: 85.310 },
  { label: "रायपुर", state: "छत्तीसगढ़", lat: 21.251, lon: 81.629 },
  { label: "भुवनेश्वर", state: "ओडिशा", lat: 20.296, lon: 85.824 },
  { label: "गुवाहाटी", state: "असम", lat: 26.144, lon: 91.736 },
  { label: "श्रीनगर", state: "जम्मू-कश्मीर", lat: 34.084, lon: 74.797 },
  { label: "शिमला", state: "हिमाचल प्रदेश", lat: 31.105, lon: 77.173 },
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

export function WeatherLocationCard() {
  const [loc, setLoc] = useState<Loc | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [geoDenied, setGeoDenied] = useState(false);

  async function loadByCoords(lat: number, lon: number, fallback?: { district: string; state: string }) {
    setLoading(true);
    try {
      const [geo, w] = await Promise.all([
        reverseGeo({ data: { lat, lon } }).catch(() => fallback ?? { district: "आपका क्षेत्र", state: "" }),
        fetchWeather(lat, lon),
      ]);
      setLoc({
        district: fallback?.district || geo.district,
        state: fallback?.state || geo.state,
        lat,
        lon,
      });
      setWeather(w);
    } catch (e) {
      console.error("weather load failed", e);
    } finally {
      setLoading(false);
    }
  }

  function tryGeolocation() {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoDenied(true);
      setLoading(false);
      // default to first district
      const d = DISTRICTS[0];
      setSelected(d.label);
      loadByCoords(d.lat, d.lon, { district: d.label, state: d.state });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoDenied(true);
        const d = DISTRICTS[0];
        setSelected(d.label);
        loadByCoords(d.lat, d.lon, { district: d.label, state: d.state });
      },
      { timeout: 8000 },
    );
  }

  useEffect(() => {
    tryGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPickDistrict(label: string) {
    const d = DISTRICTS.find((x) => x.label === label);
    if (!d) return;
    setSelected(label);
    loadByCoords(d.lat, d.lon, { district: d.label, state: d.state });
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
              {loc && (
                <>
                  <p className="mt-0.5 text-lg font-bold leading-tight text-foreground">
                    {loc.district}
                  </p>
                  {loc.state && (
                    <p className="text-sm text-muted-foreground">{loc.state}</p>
                  )}
                </>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={selected}
                  onChange={(e) => onPickDistrict(e.target.value)}
                  disabled={loading}
                  className="w-full max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                  aria-label="ज़िला चुनें"
                >
                  <option value="" disabled>-- ज़िला बदलें --</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.label} value={d.label}>
                      {d.label}, {d.state}
                    </option>
                  ))}
                </select>
                {geoDenied && (
                  <button
                    type="button"
                    onClick={tryGeolocation}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15"
                  >
                    <LocateFixed className="h-3.5 w-3.5" /> मेरी लोकेशन
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Weather */}
          <div className="flex items-center justify-start gap-4 sm:justify-end">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                अभी का मौसम
              </p>
              {weather && !loading ? (
                <>
                  <p className="text-3xl font-extrabold leading-tight text-foreground">
                    {weather.tempC}°C
                  </p>
                  <p className="text-sm font-medium text-primary">{weather.label}</p>
                </>
              ) : (
                <p className="mt-1 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> लोड हो रहा है…
                </p>
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
