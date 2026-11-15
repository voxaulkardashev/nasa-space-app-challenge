/**
 * Save a copy of NASA's Curiosity rover weather feed (REMS daily summaries,
 * provided by Centro de Astrobiología, CAB) to public/data/weather/msl_rems.json.
 * The Explore weather assistant reads this copy for Mars.
 *
 * Why a copy: visitors then load it from our own site, so a slow or blocked
 * connection to mars.nasa.gov can't break the feature. The values are not
 * changed, only fields the app doesn't use are dropped.
 *
 * Runs automatically in the GitHub deploy workflow (daily and on every push).
 * By hand:   node scripts/fetch_rems.mjs
 * If NASA can't be reached, the existing file is kept and the script exits successfully.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';
const OUT = fileURLToPath(new URL('../public/data/weather/msl_rems.json', import.meta.url));
const KEEP = ['terrestrial_date', 'sol', 'ls', 'season', 'min_temp', 'max_temp', 'pressure', 'atmo_opacity', 'local_uv_irradiance_index', 'sunrise', 'sunset', 'min_gts_temp', 'max_gts_temp'];

async function main() {
  let json;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(FEED, { signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      json = await res.json();
      break;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt === 3) {
        console.warn('Could not reach the NASA Mars weather feed; keeping the existing snapshot.');
        return;
      }
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
  if (!Array.isArray(json?.soles) || json.soles.length === 0) {
    console.warn('Feed had no "soles" list; keeping the existing snapshot.');
    return;
  }
  const soles = json.soles.map((s) => Object.fromEntries(KEEP.map((k) => [k, s[k] ?? '--'])));
  const out = {
    source: 'NASA Mars weather feed (mars.nasa.gov), Curiosity rover REMS data provided by Centro de Astrobiología (CAB)',
    url: FEED,
    fetched: new Date().toISOString(),
    soles,
  };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out) + '\n');
  const dates = soles.map((s) => s.terrestrial_date).sort();
  console.log(`Saved ${soles.length} sols (${dates[0]} to ${dates.at(-1)}) to ${OUT}`);
}

main();
