import { PSG_MARS_URL } from '../../data/weatherSources';

/**
 * "Right now on Mars": NASA Goddard's PSG Mars Explorer model for the current
 * time, for the whole planet. These are MODEL values (EMARS data for the past
 * Mars year most similar to now, at today's season and time of day), not
 * measurements. Every value shown from here is labelled Estimated.
 */

export type MarsNowParam = 'Tair' | 'Tsurf' | 'Psurf' | 'Wind' | 'Dust' | 'Vapor';

export const MARS_NOW_PARAMS: { id: MarsNowParam; label: string; unit: string; digits: number }[] = [
  { id: 'Tair', label: 'Air temperature', unit: '°C', digits: 0 },
  { id: 'Tsurf', label: 'Ground temperature', unit: '°C', digits: 0 },
  { id: 'Psurf', label: 'Surface pressure', unit: 'mbar', digits: 2 },
  { id: 'Wind', label: 'Wind speed', unit: 'km/h', digits: 0 },
  { id: 'Dust', label: 'Dust opacity (τ)', unit: '', digits: 2 },
  { id: 'Vapor', label: 'Water vapour', unit: 'pr-µm', digits: 1 },
];

/** One global grid from PSG: values[row][col], row 0 = southernmost latitude, longitudes in °E (0–360). */
export interface MarsGrid {
  param: MarsNowParam;
  unit: string;
  min: number;
  max: number;
  lats: number[];
  lons: number[];
  values: number[];
  /** Wind only: the north–south part (values holds the east–west part). Speed = √(east² + north²), as the PSG app computes it. */
  north?: number[];
}

export interface MarsNow {
  /** When the browser downloaded the model data (ISO time). */
  fetchedAt: string;
  /** e.g. "EMARS MY32 Moderate dust", as stated by the app, or null if it could not be read. */
  model: string | null;
  /** e.g. "MY39, Sol 45 09:04 MTC (Ls 22.45)", or null. */
  marsTime: string | null;
  grids: Partial<Record<MarsNowParam, MarsGrid>>;
}

interface PsgGridResponse {
  header: { param: string; unit: string; min: number; max: number; nlat: number; nlon: number; lats: number[]; lons: number[] };
  data: number[];
  /** Wind: north–south component (data is east–west). */
  vector?: number[];
}

async function fetchGrid(param: MarsNowParam): Promise<MarsGrid> {
  const res = await fetch(`${PSG_MARS_URL}index.php?param=${param}`);
  if (!res.ok) throw new Error(`PSG returned HTTP ${res.status}`);
  const json = (await res.json()) as PsgGridResponse;
  const h = json.header;
  if (!Array.isArray(json.data) || json.data.length !== h.nlat * h.nlon) throw new Error('PSG returned an unexpected grid');
  if (param === 'Wind' && Array.isArray(json.vector) && json.vector.length === json.data.length) {
    // The header's 0–100 is a display scale, so use the real range of the speeds.
    const speeds = json.data.map((u, i) => Math.hypot(u, json.vector![i]));
    const round = (x: number) => Math.round(x * 100) / 100;
    return { param, unit: h.unit, min: round(Math.min(...speeds)), max: round(Math.max(...speeds)), lats: h.lats, lons: h.lons, values: json.data, north: json.vector };
  }
  return { param, unit: h.unit, min: h.min, max: h.max, lats: h.lats, lons: h.lons, values: json.data };
}

/** The app's own page says which model year and Mars date it is using right now. */
async function fetchHeader(): Promise<{ model: string | null; marsTime: string | null }> {
  try {
    const res = await fetch(PSG_MARS_URL);
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const model = /Climatological data based on (.+?) -?\d+ °C/.exec(text)?.[1]?.trim() ?? null;
    const marsTime = /MY\d+, Sol \d+ [\d:]+ MTC \(Ls [\d.]+\)/.exec(text)?.[0] ?? null;
    return { model, marsTime };
  } catch {
    return { model: null, marsTime: null };
  }
}

let cache: { at: number; promise: Promise<MarsNow> } | null = null;
/** Re-use a download for this long, so the app doesn't keep asking NASA's server. */
const CACHE_MS = 10 * 60 * 1000;

/** Current model conditions for the whole of Mars (all parameters above). */
export function loadMarsNow(force = false): Promise<MarsNow> {
  if (!force && cache && Date.now() - cache.at < CACHE_MS) return cache.promise;
  const promise = Promise.all([Promise.all(MARS_NOW_PARAMS.map((p) => fetchGrid(p.id))), fetchHeader()]).then(([grids, header]) => ({
    fetchedAt: new Date().toISOString(),
    ...header,
    grids: Object.fromEntries(grids.map((g) => [g.param, g])) as MarsNow['grids'],
  }));
  cache = { at: Date.now(), promise };
  promise.catch(() => {
    cache = null;
  });
  return promise;
}

/** Index of the first value ≥ x in an increasing list (clamped). */
function bracket(list: number[], x: number): [number, number, number] {
  if (x <= list[0]) return [0, 0, 0];
  const last = list.length - 1;
  if (x >= list[last]) return [last, last, 0];
  let i = 1;
  while (list[i] < x) i++;
  return [i - 1, i, (x - list[i - 1]) / (list[i] - list[i - 1])];
}

/** Model value at a point, interpolated between the four surrounding grid points (wraps at 0°/360°). */
export function sampleMarsGrid(grid: MarsGrid, lat: number, lon: number): number {
  const nlon = grid.lons.length;
  const [r0, r1, fy] = bracket(grid.lats, lat);
  const east = ((lon % 360) + 360) % 360;
  const step = 360 / nlon;
  const x = (east - grid.lons[0]) / step;
  const c0 = ((Math.floor(x) % nlon) + nlon) % nlon;
  const c1 = (c0 + 1) % nlon;
  const fx = x - Math.floor(x);
  const interp = (values: number[]) => {
    const v = (r: number, c: number) => values[r * nlon + c];
    const top = v(r1, c0) * (1 - fx) + v(r1, c1) * fx;
    const bottom = v(r0, c0) * (1 - fx) + v(r0, c1) * fx;
    return bottom * (1 - fy) + top * fy;
  };
  // Wind: interpolate both parts, then combine into a speed (same order as the PSG app).
  return grid.north ? Math.hypot(interp(grid.values), interp(grid.north)) : interp(grid.values);
}
