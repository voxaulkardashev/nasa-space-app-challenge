import type { WeatherDay } from './types';

interface RemsSol {
  terrestrial_date: string;
  sol: string;
  ls: string;
  season: string;
  min_temp: string;
  max_temp: string;
  pressure: string;
  atmo_opacity: string;
  local_uv_irradiance_index: string;
  sunrise: string;
  sunset: string;
  min_gts_temp: string;
  max_gts_temp: string;
}

const num = (v: string | number | undefined) => {
  const n = typeof v === 'number' ? v : Number(v);
  return v === undefined || v === '--' || v === '' || Number.isNaN(n) ? null : n;
};
const text = (v: string | undefined) => (v && v !== '--' ? v : undefined);

export interface RemsData {
  /** When scripts/fetch_rems.mjs copied the NASA feed (ISO time). */
  fetched: string;
  days: WeatherDay[];
}

/** Copy of the NASA feed saved by scripts/fetch_rems.mjs (values unchanged; see docs/SOURCES.md). */
const SNAPSHOT_URL = `${import.meta.env.BASE_URL}data/weather/msl_rems.json`;

let cache: Promise<RemsData> | null = null;

/** All sols from NASA's Curiosity (REMS) weather feed, oldest first. Downloaded once (~1.2 MB, compressed in transit). */
export function loadRems(): Promise<RemsData> {
  if (!cache) {
    cache = fetch(SNAPSHOT_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Mars weather data returned HTTP ${res.status}`);
        return res.json() as Promise<{ fetched: string; soles: RemsSol[] }>;
      })
      .then((json) => ({
        fetched: json.fetched,
        days: json.soles
          .map((s): WeatherDay => {
            const tMin = num(s.min_temp);
            const tMax = num(s.max_temp);
            const pressurePa = num(s.pressure);
            return {
              date: s.terrestrial_date,
              tMin,
              tMax,
              tMean: tMin !== null && tMax !== null ? (tMin + tMax) / 2 : null,
              pressureMbar: pressurePa === null ? null : pressurePa / 100, // Pa → mbar
              sol: s.sol,
              season: text(s.season),
              ls: text(s.ls),
              opacity: text(s.atmo_opacity),
              uv: text(s.local_uv_irradiance_index),
              sunrise: text(s.sunrise),
              sunset: text(s.sunset),
              groundMin: num(s.min_gts_temp),
              groundMax: num(s.max_gts_temp),
            };
          })
          .sort((a, b) => a.date.localeCompare(b.date)),
      }))
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}
