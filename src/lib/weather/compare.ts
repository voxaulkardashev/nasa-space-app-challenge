import { windowStats, type WindowStats } from './stats';
import type { WeatherReport } from './types';

export interface DimensionScore {
  id: string;
  label: string;
  earth: number | null;
  mars: number | null;
  unit: string;
  /** 0–1, or null when one side has no data. */
  score: number | null;
  /** How this dimension's score is calculated (shown on screen). */
  rule: string;
}

export interface WeatherComparison {
  earthStats: WindowStats;
  marsStats: WindowStats;
  dimensions: DimensionScore[];
  /** Mean of the dimension scores that have data (0–1), or null if none do. */
  overall: number | null;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** 100% when equal, falling in a straight line to 0% at a difference of `range`. */
const linear = (a: number | null, b: number | null, range: number) =>
  a === null || b === null ? null : clamp01(1 - Math.abs(a - b) / range);

/** Smaller value divided by larger (both positive). */
const ratio = (a: number | null, b: number | null) =>
  a === null || b === null || a <= 0 || b <= 0 ? null : Math.min(a, b) / Math.max(a, b);

export const TEMP_RANGE_C = 40;
export const VARIABILITY_RANGE_C = 10;

/**
 * Compares the weather in two windows of real NASA data. The percentage is an
 * estimate made by this app (method shown on screen), not a NASA product.
 */
export function compareWeather(earth: WeatherReport, mars: WeatherReport): WeatherComparison {
  const e = windowStats(earth.days);
  const m = windowStats(mars.days);
  const tempRule = `100% if equal, falling to 0% at a ${TEMP_RANGE_C} °C difference`;
  const dimensions: DimensionScore[] = [
    { id: 'low', label: 'Average daily low', earth: e.avgLow, mars: m.avgLow, unit: '°C', score: linear(e.avgLow, m.avgLow, TEMP_RANGE_C), rule: tempRule },
    { id: 'high', label: 'Average daily high', earth: e.avgHigh, mars: m.avgHigh, unit: '°C', score: linear(e.avgHigh, m.avgHigh, TEMP_RANGE_C), rule: tempRule },
    { id: 'swing', label: 'Average day–night swing', earth: e.avgSwing, mars: m.avgSwing, unit: '°C', score: linear(e.avgSwing, m.avgSwing, TEMP_RANGE_C), rule: tempRule },
    {
      id: 'variability',
      label: 'Day-to-day variability (pattern)',
      earth: e.variability,
      mars: m.variability,
      unit: '°C',
      score: linear(e.variability, m.variability, VARIABILITY_RANGE_C),
      rule: `Standard deviation of the daily midpoint temperature; 100% if equal, 0% at a ${VARIABILITY_RANGE_C} °C difference`,
    },
    {
      id: 'pressure',
      label: 'Average surface air pressure',
      earth: e.avgPressure,
      mars: m.avgPressure,
      unit: 'mbar',
      score: ratio(e.avgPressure, m.avgPressure),
      rule: 'Lower pressure divided by higher pressure',
    },
  ];
  const scored = dimensions.map((d) => d.score).filter((s): s is number => s !== null);
  return {
    earthStats: e,
    marsStats: m,
    dimensions,
    overall: scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : null,
  };
}
