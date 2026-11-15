import { POWER_LAG_DAYS, WINDOW_HALF_DAYS } from '../../data/weatherSources';
import { addDays, compact, todayIso } from './dates';
import type { WeatherDay } from './types';

const PARAMS = ['T2M', 'T2M_MAX', 'T2M_MIN', 'PS', 'WS2M', 'RH2M', 'PRECTOTCORR', 'ALLSKY_SFC_SW_DWN'];

/** Newest date NASA POWER usually has filled in. */
export const powerLatestDate = () => addDays(todayIso(), -POWER_LAG_DAYS);

interface PowerResponse {
  properties?: { parameter?: Record<string, Record<string, number>> };
  messages?: string[];
}

/**
 * Daily weather from NASA POWER for the days around `date` at a point on Earth.
 * POWER marks missing values as -999; those become null.
 */
export async function fetchPowerWindow(lat: number, lon: number, date: string): Promise<WeatherDay[]> {
  const latest = powerLatestDate();
  const start = addDays(date, -WINDOW_HALF_DAYS);
  const endWanted = addDays(date, WINDOW_HALF_DAYS);
  const end = endWanted > latest ? latest : endWanted;
  const url =
    'https://power.larc.nasa.gov/api/temporal/daily/point?' +
    new URLSearchParams({
      parameters: PARAMS.join(','),
      community: 'RE',
      latitude: lat.toFixed(4),
      longitude: lon.toFixed(4),
      start: compact(start),
      end: compact(end < start ? start : end),
      format: 'JSON',
    }).toString();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NASA POWER returned HTTP ${res.status}`);
  const json = (await res.json()) as PowerResponse;
  const p = json.properties?.parameter;
  if (!p) throw new Error('NASA POWER returned no data for this request');
  const val = (key: string, day: string) => {
    const v = p[key]?.[day];
    return typeof v === 'number' && v > -998 ? v : null;
  };
  return Object.keys(p.T2M ?? {}).map((day) => ({
    date: `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`,
    tMin: val('T2M_MIN', day),
    tMax: val('T2M_MAX', day),
    tMean: val('T2M', day),
    pressureMbar: val('PS', day) === null ? null : val('PS', day)! * 10, // kPa → mbar
    windMs: val('WS2M', day),
    humidityPct: val('RH2M', day),
    precipMm: val('PRECTOTCORR', day),
    solarKwhM2: val('ALLSKY_SFC_SW_DWN', day),
  }));
}
