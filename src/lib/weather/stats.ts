import type { WeatherDay } from './types';

const values = (days: WeatherDay[], pick: (d: WeatherDay) => number | null | undefined) =>
  days.map(pick).filter((v): v is number => typeof v === 'number');

export function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

/** Population standard deviation. */
export function std(xs: number[]): number | null {
  const m = mean(xs);
  if (m === null || xs.length < 2) return null;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}

/** Summary of a window of days, all computed from the downloaded values. */
export interface WindowStats {
  dayCount: number;
  firstDate: string | null;
  lastDate: string | null;
  avgLow: number | null;
  avgHigh: number | null;
  avgSwing: number | null;
  /** Standard deviation of each day's midpoint ((low + high) / 2). */
  variability: number | null;
  avgPressure: number | null;
  coldest: number | null;
  warmest: number | null;
  /** Change in the daily midpoint from the first to the last day. */
  trend: number | null;
}

export function windowStats(days: WeatherDay[]): WindowStats {
  const withTemps = days.filter((d) => d.tMin !== null && d.tMax !== null);
  const lows = values(withTemps, (d) => d.tMin);
  const highs = values(withTemps, (d) => d.tMax);
  const mids = withTemps.map((d) => (d.tMin! + d.tMax!) / 2);
  return {
    dayCount: withTemps.length,
    firstDate: withTemps[0]?.date ?? null,
    lastDate: withTemps.at(-1)?.date ?? null,
    avgLow: mean(lows),
    avgHigh: mean(highs),
    avgSwing: mean(withTemps.map((d) => d.tMax! - d.tMin!)),
    variability: std(mids),
    avgPressure: mean(values(days, (d) => d.pressureMbar)),
    coldest: lows.length ? Math.min(...lows) : null,
    warmest: highs.length ? Math.max(...highs) : null,
    trend: mids.length >= 2 ? mids.at(-1)! - mids[0] : null,
  };
}

export const fmtC = (v: number | null | undefined, digits = 1) => (typeof v === 'number' ? `${v.toFixed(digits)} °C` : 'no data');
export const fmtMbar = (v: number | null | undefined) =>
  typeof v === 'number' ? `${v >= 100 ? v.toFixed(0) : v.toFixed(2)} mbar` : 'no data';
