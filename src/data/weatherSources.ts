import type { SourceRef } from './types';

/**
 * Weather data sources for the Explore weather assistant (see docs/SOURCES.md).
 * Nothing here is invented: the assistant only reports values these services return.
 */

export const POWER_SOURCE: SourceRef = {
  name: 'NASA POWER Daily API (Prediction Of Worldwide Energy Resources), community RE; meteorology from MERRA-2',
  url: 'https://power.larc.nasa.gov/docs/services/api/temporal/daily/',
  sourceDate: 'Daily values for the date shown',
  accessed: 'when you press Analyze',
};

export const REMS_SOURCE: SourceRef = {
  name: 'NASA Mars weather feed (mars.nasa.gov) — Curiosity rover REMS (Rover Environmental Monitoring Station) data provided by Centro de Astrobiología (CAB)',
  url: 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json',
  sourceDate: 'Daily values for the sol shown',
  accessed: 'copied daily by the deploy workflow (scripts/fetch_rems.mjs)',
};

/** Short form of the feed's own disclaimer (shown with Mars results). */
export const REMS_DISCLAIMER =
  'From the feed’s disclaimer: values are “provided by Centro de Astrobiologia (CAB) and intended for outreach purposes only”; they are measured at the rover, so the rover itself can influence them, and some days have no data. Scientific REMS data are in NASA’s Planetary Data System.';

/** Mars weather stations with daily data in the feed above. */
export interface WeatherStation {
  id: string;
  name: string;
  /** Degrees north / east (Gale crater centre from the IAU/USGS Gazetteer; the rover drives within the crater). */
  lat: number;
  lon: number;
}

export const MARS_STATIONS: WeatherStation[] = [
  { id: 'rems-gale', name: 'Curiosity rover (REMS), Gale crater', lat: -5.37, lon: 137.81 },
];

/** First date with NASA POWER daily data. */
export const POWER_FIRST_DATE = '1981-01-01';
/** POWER's newest days are usually filled in after about 3 days. */
export const POWER_LAG_DAYS = 3;
/** Days either side of the chosen date used for averages and "patterns". */
export const WINDOW_HALF_DAYS = 3;
