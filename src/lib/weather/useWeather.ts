import { useCallback, useState } from 'react';
import type { WorldId } from '../../data/types';
import type { SelectedSite } from '../navigation';
import { fetchWeatherReport } from './report';
import type { WeatherReport } from './types';

export interface WeatherState {
  status: 'loading' | 'ready' | 'error';
  /** Which pin the state belongs to (lat,lon). */
  siteKey: string;
  date: string;
  report?: WeatherReport;
  error?: string;
}

export const siteKey = (s: { lat: number; lon: number }) => `${s.lat.toFixed(5)},${s.lon.toFixed(5)}`;

/** Weather reports for each world's pin, kept in App so the comparison can use both. */
export function useWeather() {
  const [weather, setWeather] = useState<Partial<Record<WorldId, WeatherState>>>({});

  const analyze = useCallback(async (site: SelectedSite, date: string): Promise<WeatherReport | null> => {
    const key = siteKey(site);
    setWeather((w) => ({ ...w, [site.worldId]: { status: 'loading', siteKey: key, date } }));
    try {
      const report = await fetchWeatherReport(site.worldId, site.lat, site.lon, date);
      setWeather((w) => (w[site.worldId]?.siteKey === key ? { ...w, [site.worldId]: { status: 'ready', siteKey: key, date, report } } : w));
      return report;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setWeather((w) =>
        w[site.worldId]?.siteKey === key
          ? { ...w, [site.worldId]: { status: 'error', siteKey: key, date, error: `Couldn’t reach NASA (${msg}). Check your connection and try again.` } }
          : w,
      );
      return null;
    }
  }, []);

  /** The state for a site, or undefined if the stored report is for a different pin. */
  const forSite = (site: SelectedSite | null | undefined) => {
    if (!site) return undefined;
    const s = weather[site.worldId];
    return s && s.siteKey === siteKey(site) ? s : undefined;
  };

  return { analyze, forSite };
}
