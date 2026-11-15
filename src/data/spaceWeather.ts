import donkiSnapshot from './donki.json';
import { NSSDCA_EARTH, NSSDCA_MARS } from './sources';
import type { SourceRef, WorldId } from './types';

/**
 * Space weather from NASA's DONKI database.
 * src/data/donki.json is written by scripts/fetch_donki.mjs, which the deploy
 * workflow runs daily and on every push; the committed copy is the fallback.
 */

interface DonkiSource {
  name: string;
  url: string;
}

export interface DonkiSnapshot {
  /** When the data was fetched (ISO time). */
  fetchedAt: string;
  /** The 30-day period the events cover (YYYY-MM-DD). */
  window: { start: string; end: string };
  /** Which service supplied each event type; null if none answered at fetch time. */
  sources: Record<'FLR' | 'CME' | 'SEP' | 'GST', DonkiSource | null>;
  flares: {
    count: number;
    byClass: Record<'X' | 'M' | 'C' | 'B', number>;
    strongest: { classType: string; peakTime: string; link: string } | null;
  } | null;
  cmes: { count: number; fastest: { speedKmS: number; time: string; link: string } | null } | null;
  sep: { count: number; latest: { time: string; link: string } | null } | null;
  storms: { count: number; maxKp: { kp: number; time: string; link: string } | null } | null;
}

export const DONKI: DonkiSnapshot = donkiSnapshot as DonkiSnapshot;

/** Short NASA quotes on why space radiation reaches each surface differently. */
export interface RadiationContext {
  quote: string;
  quoteSource: SourceRef;
  /** A related measured value from a fact sheet. */
  detail: string;
  detailSource: SourceRef;
}

const ACCESSED = '14 November 2026';

const NASA_SOLAR_WIND_ON_MOON: SourceRef = {
  name: 'NASA Science — Solar Wind on the Moon',
  url: 'https://science.nasa.gov/moon/solar-wind/',
  sourceDate: 'Page date not stated',
  accessed: ACCESSED,
};

const NASA_MAVEN_AURORAS: SourceRef = {
  name: 'NASA Science — NASA’s MAVEN Illuminates New Understanding of Auroras at Mars',
  url: 'https://science.nasa.gov/missions/maven/nasas-maven-illuminates-new-understanding-of-auroras-at-mars/',
  sourceDate: 'Page date not checked',
  accessed: ACCESSED,
};

export const RADIATION_CONTEXT: Record<WorldId, RadiationContext> = {
  mars: {
    quote: 'Mars does not have a global magnetic field like Earth.',
    quoteSource: NASA_MAVEN_AURORAS,
    detail: 'Surface pressure: 6.36 mbar at mean radius (Earth: 1014 mbar).',
    detailSource: NSSDCA_MARS,
  },
  earth: {
    quote:
      'This global magnetic field helps to shield us from the harsh conditions of space. Without it, much more radiation would reach Earth’s surface.',
    quoteSource: NASA_SOLAR_WIND_ON_MOON,
    detail: 'Surface magnetic field strength: 0.24–0.66 gauss; surface pressure: 1014 mbar.',
    detailSource: NSSDCA_EARTH,
  },
};
