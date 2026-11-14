/**
 * Fetch recent space-weather events from NASA's DONKI database and save a
 * small, dated summary to src/data/donki.json (shown on the World Overview).
 *
 * Runs automatically in the GitHub deploy workflow (daily and on every push),
 * so visitors never call the API themselves and never hit rate limits.
 * You can also run it by hand:   node scripts/fetch_donki.mjs
 *
 * Sources, tried in order:
 *   1. NASA CCMC DONKI web service (no key):  https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/<TYPE>
 *   2. api.nasa.gov DONKI. Uses the key in the NASA_API_KEY environment variable
 *      (sent in the X-Api-Key header, so it never appears in a URL or log);
 *      without one it falls back to NASA's shared, heavily rate-limited DEMO_KEY.
 *
 * Each event type is fetched separately; a type that no source can provide is
 * saved as null and the website says it is unavailable. If EVERY type fails,
 * the existing src/data/donki.json is left untouched and the script exits
 * successfully, so a NASA outage never breaks the website.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/data/donki.json', import.meta.url));
const WINDOW_DAYS = 30;
const TYPES = ['FLR', 'CME', 'SEP', 'GST'];
const API_KEY = process.env.NASA_API_KEY || '';

const isoDate = (d) => d.toISOString().slice(0, 10);
const end = new Date();
const start = new Date(end.getTime() - WINDOW_DAYS * 24 * 3600 * 1000);
const startDate = isoDate(start);
const endDate = isoDate(end);

const SOURCES = [
  {
    name: 'NASA CCMC DONKI web service',
    url: (type) => `https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/${type}?startDate=${startDate}&endDate=${endDate}`,
  },
  {
    name: 'api.nasa.gov DONKI',
    url: (type) =>
      `https://api.nasa.gov/DONKI/${type}?startDate=${startDate}&endDate=${endDate}` + (API_KEY ? '' : '&api_key=DEMO_KEY'),
    headers: API_KEY ? { 'X-Api-Key': API_KEY } : {},
    // Shown in the saved file (never contains the key).
    publicUrl: (type) => `https://api.nasa.gov/DONKI/${type}?startDate=${startDate}&endDate=${endDate}`,
  },
];

async function getJson(url, headers = {}) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const data = text.trim() ? JSON.parse(text) : []; // DONKI returns an empty body when there are no events
      if (!Array.isArray(data)) throw new Error(`unexpected reply: ${text.slice(0, 120)}`);
      return data;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error('unreachable');
}

/** Fetch each event type from the first source that answers. A type no source can provide is null. */
async function fetchAll() {
  const results = {};
  const sources = {};
  for (const type of TYPES) {
    results[type] = null;
    for (const source of SOURCES) {
      try {
        results[type] = await getJson(source.url(type), source.headers);
        sources[type] = { name: source.name, url: (source.publicUrl ?? source.url)(type) };
        break;
      } catch (err) {
        console.warn(`  ${type}: ${source.name} failed (${err.message})`);
      }
    }
  }
  return { results, sources };
}

// "X1.2" > "M9.9" > "C3.0" ...
const CLASS_RANK = { A: 0, B: 1, C: 2, M: 3, X: 4 };
const flareScore = (classType = '') => (CLASS_RANK[classType[0]] ?? -1) * 1000 + (parseFloat(classType.slice(1)) || 0);

function summariseFlares(FLR) {
  if (!FLR) return null;
  const byClass = { X: 0, M: 0, C: 0, B: 0 };
  for (const f of FLR) if (f.classType && f.classType[0] in byClass) byClass[f.classType[0]]++;
  const strongest = [...FLR].sort((a, b) => flareScore(b.classType) - flareScore(a.classType))[0];
  return {
    count: FLR.length,
    byClass,
    strongest: strongest ? { classType: strongest.classType, peakTime: strongest.peakTime, link: strongest.link } : null,
  };
}

function summariseCmes(CME) {
  if (!CME) return null;
  let fastest = null;
  for (const c of CME) {
    for (const a of c.cmeAnalyses ?? []) {
      if (!a.isMostAccurate || typeof a.speed !== 'number') continue;
      if (!fastest || a.speed > fastest.speedKmS) fastest = { speedKmS: a.speed, time: c.startTime, link: c.link };
    }
  }
  return { count: CME.length, fastest };
}

function summariseSep(SEP) {
  if (!SEP) return null;
  const latest = [...SEP].sort((a, b) => (b.eventTime ?? '').localeCompare(a.eventTime ?? ''))[0];
  return { count: SEP.length, latest: latest ? { time: latest.eventTime, link: latest.link } : null };
}

function summariseStorms(GST) {
  if (!GST) return null;
  let maxKp = null;
  for (const g of GST) {
    for (const k of g.allKpIndex ?? []) {
      if (!maxKp || k.kpIndex > maxKp.kp) maxKp = { kp: k.kpIndex, time: k.observedTime, link: g.link };
    }
  }
  return { count: GST.length, maxKp };
}

console.log(`DONKI: fetching ${TYPES.join(', ')} for ${startDate} to ${endDate}`);
const { results, sources } = await fetchAll();
if (TYPES.every((t) => results[t] === null)) {
  const previous = await readFile(OUT, 'utf8').catch(() => null);
  console.warn(previous ? '  All sources failed; keeping the existing snapshot.' : '  All sources failed and no snapshot exists.');
  process.exit(0);
}

const snapshot = {
  fetchedAt: new Date().toISOString(),
  window: { start: startDate, end: endDate },
  // Which service supplied each type (null = no source answered at fetch time).
  sources: Object.fromEntries(TYPES.map((t) => [t, sources[t] ?? null])),
  flares: summariseFlares(results.FLR),
  cmes: summariseCmes(results.CME),
  sep: summariseSep(results.SEP),
  storms: summariseStorms(results.GST),
};
await writeFile(OUT, JSON.stringify(snapshot, null, 2) + '\n');
const n = (x) => (x ? x.count : 'unavailable');
console.log(
  `  saved: flares ${n(snapshot.flares)}, CMEs ${n(snapshot.cmes)}, SEP events ${n(snapshot.sep)}, geomagnetic storms ${n(snapshot.storms)}`,
);
