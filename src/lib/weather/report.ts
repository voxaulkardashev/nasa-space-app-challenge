import { MARS_STATIONS, WINDOW_HALF_DAYS } from '../../data/weatherSources';
import type { WorldId } from '../../data/types';
import { getWorld } from '../../data/worlds';
import { daysBetween } from './dates';
import { fetchPowerWindow } from './power';
import { loadRems } from './rems';
import type { WeatherDay, WeatherReport } from './types';

const hasTemps = (d: WeatherDay) => d.tMin !== null && d.tMax !== null;

/** The day with temperature data closest to `date` (earlier day wins a tie). */
function nearestDay(days: WeatherDay[], date: string): WeatherDay | null {
  let best: WeatherDay | null = null;
  let bestGap = Infinity;
  for (const d of days) {
    if (!hasTemps(d)) continue;
    const gap = Math.abs(daysBetween(date, d.date));
    if (gap < bestGap) {
      best = d;
      bestGap = gap;
    }
  }
  return best;
}

/** Great-circle distance in km on a sphere. */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number, radiusKm: number): number {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Downloads real NASA weather for a pin and date.
 * Earth: NASA POWER at the pin itself. Mars: the nearest station with a daily
 * NASA feed (Curiosity's REMS at Gale crater), with its distance from the pin.
 */
export async function fetchWeatherReport(worldId: WorldId, lat: number, lon: number, date: string): Promise<WeatherReport> {
  const fetchedAt = new Date().toISOString();
  if (worldId === 'earth') {
    const all = await fetchPowerWindow(lat, lon, date);
    const focus = nearestDay(all, date);
    return {
      worldId,
      lat,
      lon,
      requestedDate: date,
      focus,
      focusIsExact: focus?.date === date,
      days: all.filter(hasTemps),
      source: 'power',
      fetchedAt,
    };
  }
  const station = MARS_STATIONS[0];
  const { fetched, days: sols } = await loadRems();
  const focus = nearestDay(sols, date);
  const days = focus ? sols.filter((d) => hasTemps(d) && Math.abs(daysBetween(focus.date, d.date)) <= WINDOW_HALF_DAYS) : [];
  return {
    worldId,
    lat,
    lon,
    requestedDate: date,
    focus,
    focusIsExact: focus?.date === date,
    days,
    source: 'rems',
    station: {
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      distanceKm: distanceKm(lat, lon, station.lat, station.lon, getWorld('mars').meanRadiusKm),
    },
    fetchedAt,
    snapshotFetched: fetched,
  };
}
