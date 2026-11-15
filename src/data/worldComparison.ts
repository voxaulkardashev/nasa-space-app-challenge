import { NSSDCA_EARTH, NSSDCA_MARS } from './sources';
import type { SourceRef } from './types';

/**
 * World-level values for the Compare view: the things Earth cannot reproduce
 * for Mars (CLAUDE.md rule 5: gravity, thin atmosphere, radiation).
 * All numbers are copied from the NASA NSSDCA fact sheets (see docs/SOURCES.md).
 */

export interface ComparedValue {
  value: number;
  display: string;
  source: SourceRef;
}

export interface WorldMetric {
  id: string;
  label: string;
  unit: string;
  mars: ComparedValue;
  earth: ComparedValue;
  /** Bars use a logarithmic scale when the values differ hugely (stated on screen). */
  scale: 'linear' | 'log';
  /** Plain-language note shown under the chart. */
  note: string;
}

export const WORLD_METRICS: WorldMetric[] = [
  {
    id: 'gravity',
    label: 'Surface gravity',
    unit: 'm/s²',
    mars: { value: 3.73, display: '3.73 m/s²', source: NSSDCA_MARS },
    earth: { value: 9.82, display: '9.820 m/s²', source: NSSDCA_EARTH },
    scale: 'linear',
    note: 'The NSSDCA Mars fact sheet gives the Mars/Earth ratio as 0.380: objects weigh about 38% of their Earth weight on Mars.',
  },
  {
    id: 'pressure',
    label: 'Surface air pressure',
    unit: 'mbar',
    mars: { value: 6.36, display: '6.36 mbar', source: NSSDCA_MARS },
    earth: { value: 1014, display: '1014 mbar', source: NSSDCA_EARTH },
    scale: 'log',
    note: 'Mars’s air is far thinner: 6.36 mbar at mean radius (varying 4.0–8.7 mbar with season). Shown on a log scale because the gap is so large.',
  },
  {
    id: 'temperature',
    label: 'Average temperature',
    unit: 'K',
    mars: { value: 214, display: '~214 K (−59 °C)', source: NSSDCA_MARS },
    earth: { value: 288, display: '288 K (15 °C)', source: NSSDCA_EARTH },
    scale: 'linear',
    note: 'Planet-wide averages from the fact sheets; local temperatures at a site vary a lot.',
  },
];
