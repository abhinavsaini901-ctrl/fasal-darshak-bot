import { createServerFn } from "@tanstack/react-start";

export type WeatherResult = {
  tempC: number;
  code: number;
};

export const getWeather = createServerFn({ method: "GET" })
  .inputValidator((data: { lat: number; lon: number }) => {
    const lat = Number(data.lat);
    const lon = Number(data.lon);
    if (!isFinite(lat) || !isFinite(lon)) throw new Error("Invalid coords");
    return { lat, lon };
  })
  .handler(async ({ data }): Promise<WeatherResult> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,weather_code`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`weather ${r.status}`);
    const j: any = await r.json();
    return {
      tempC: Math.round(j?.current?.temperature_2m ?? 0),
      code: Number(j?.current?.weather_code ?? 0),
    };
  });

export const reverseGeo = createServerFn({ method: "GET" })
  .inputValidator((data: { lat: number; lon: number }) => {
    const lat = Number(data.lat);
    const lon = Number(data.lon);
    if (!isFinite(lat) || !isFinite(lon)) throw new Error("Invalid coords");
    return { lat, lon };
  })
  .handler(async ({ data }): Promise<{ district: string; state: string }> => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.lat}&lon=${data.lon}&accept-language=hi`,
        { headers: { "User-Agent": "KisanMitra/1.0" } },
      );
      const j: any = await r.json();
      const a = j?.address ?? {};
      return {
        district:
          a.county || a.state_district || a.city || a.town || a.village || "आपका क्षेत्र",
        state: a.state || "",
      };
    } catch {
      return { district: "आपका क्षेत्र", state: "" };
    }
  });
