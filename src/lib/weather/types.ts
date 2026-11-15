import type { WorldId } from '../../data/types';

/** One day of weather from NASA POWER (Earth) or Curiosity REMS (Mars). Missing values are null. */
export interface WeatherDay {
  date: string; // YYYY-MM-DD (Earth date)
  tMin: number | null; // °C, air
  tMax: number | null; // °C, air
  tMean: number | null; // °C (Earth: POWER daily mean; Mars: midpoint of low and high)
  pressureMbar: number | null;
  // Earth only (NASA POWER)
  windMs?: number | null;
  humidityPct?: number | null;
  precipMm?: number | null;
  solarKwhM2?: number | null;
  // Mars only (REMS feed)
  sol?: string;
  season?: string;
  ls?: string;
  opacity?: string;
  uv?: string;
  sunrise?: string;
  sunset?: string;
  groundMin?: number | null;
  groundMax?: number | null;
}

export interface WeatherReport {
  worldId: WorldId;
  /** The pin's position. */
  lat: number;
  lon: number;
  requestedDate: string;
  /** The day reported on: the requested date, or the nearest date with data. */
  focus: WeatherDay | null;
  focusIsExact: boolean;
  /** All days with data in the window around the date (for averages and patterns). */
  days: WeatherDay[];
  source: 'power' | 'rems';
  /** Mars: the station the values come from and its distance from the pin. */
  station?: { name: string; lat: number; lon: number; distanceKm: number };
  fetchedAt: string;
  /** Mars: when the app's copy of the NASA feed was saved (ISO time). */
  snapshotFetched?: string;
}
