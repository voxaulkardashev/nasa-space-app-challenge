import { addDays, compact, todayIso } from './dates';

/** The newest hour NASA POWER has for a point on Earth (POWER is the weather assistant's Earth source). */
export interface PowerLatestHour {
  /** UTC time of the reading, ISO string. */
  timeUtc: string;
  tempC: number | null;
  windMs: number | null;
  /** Degrees, the direction the wind blows FROM (0 = north). */
  windDirDeg: number | null;
  humidityPct: number | null;
  precipMmHr: number | null;
  /** Model sources named in POWER's reply (e.g. GEOSIT). */
  sources: string[];
  fetchedAt: string;
}

interface PowerHourlyResponse {
  header?: { sources?: string[] };
  properties?: { parameter?: Record<string, Record<string, number>> };
}

const PARAMS = ['T2M', 'WS2M', 'WD2M', 'RH2M', 'PRECTOTCORR'];

/**
 * Asks NASA POWER's hourly API for the last few days at a point and returns the newest hour
 * with a temperature. POWER is not a live station: its newest values are usually 1–2 days old.
 */
export async function fetchPowerLatestHour(lat: number, lon: number): Promise<PowerLatestHour> {
  const today = todayIso();
  const url =
    'https://power.larc.nasa.gov/api/temporal/hourly/point?' +
    new URLSearchParams({
      parameters: PARAMS.join(','),
      community: 'RE',
      latitude: lat.toFixed(4),
      longitude: lon.toFixed(4),
      start: compact(addDays(today, -5)),
      end: compact(today),
      format: 'JSON',
      'time-standard': 'UTC',
    }).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NASA POWER returned HTTP ${res.status}`);
  const json = (await res.json()) as PowerHourlyResponse;
  const p = json.properties?.parameter;
  if (!p?.T2M) throw new Error('NASA POWER returned no hourly data');
  const val = (key: string, hour: string) => {
    const v = p[key]?.[hour];
    return typeof v === 'number' && v > -998 ? v : null;
  };
  const hours = Object.keys(p.T2M)
    .filter((h) => val('T2M', h) !== null)
    .sort();
  const last = hours[hours.length - 1];
  if (!last) throw new Error('NASA POWER has no recent hourly values here yet');
  return {
    timeUtc: `${last.slice(0, 4)}-${last.slice(4, 6)}-${last.slice(6, 8)}T${last.slice(8, 10)}:00:00Z`,
    tempC: val('T2M', last),
    windMs: val('WS2M', last),
    windDirDeg: val('WD2M', last),
    humidityPct: val('RH2M', last),
    precipMmHr: val('PRECTOTCORR', last),
    sources: json.header?.sources ?? [],
    fetchedAt: new Date().toISOString(),
  };
}
