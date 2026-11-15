import { NSSDCA_EARTH, NSSDCA_MARS } from './sources';
import type { DataValue, SourceRef, WorldId } from './types';

/**
 * World Overview sidebar content: data that matters for planetary-analog work
 * (not just day length and gravity). Every value is labelled Measured /
 * Estimated with its source; findings scientists disagree about are marked
 * as debated (CLAUDE.md rule 6). See docs/SOURCES.md.
 */

export interface AnalogOverview {
  /** Short intro line under the world name. */
  intro: string;
  conditions: DataValue[];
}

const ACCESSED = '15 November 2026';
const page = (name: string, url: string, sourceDate = 'Page date not checked'): SourceRef => ({ name, url, sourceDate, accessed: ACCESSED });

const MAVEN_AURORAS = page(
  'NASA Science — NASA’s MAVEN Illuminates New Understanding of Auroras at Mars',
  'https://science.nasa.gov/missions/maven/nasas-maven-illuminates-new-understanding-of-auroras-at-mars/',
);
const ODYSSEY_INSTRUMENTS = page('NASA Science — Mars Odyssey Science Instruments', 'https://science.nasa.gov/mission/odyssey/science-instruments/');

export const ANALOG_OVERVIEW: Record<WorldId, AnalogOverview> = {
  mars: {
    intro: 'Conditions that matter when comparing Mars with Earth analog sites.',
    conditions: [
      { id: 'atmosphere', label: 'Atmosphere (by volume)', value: '95.1% CO₂ · 2.59% N₂ · 1.94% Ar · 0.16% O₂', note: 'Oxygen is 0.16% (Earth: 20.95%)', status: 'measured', source: NSSDCA_MARS },
      { id: 'water-vapour', label: 'Water vapour in the air', value: '210 ppm', note: 'A minor gas, by volume', status: 'measured', source: NSSDCA_MARS },
      { id: 'pressure', label: 'Surface pressure', value: '6.36 mbar', note: 'At mean radius; varies 4.0–8.7 mbar with season', status: 'measured', source: NSSDCA_MARS },
      { id: 'temp-range', label: 'Daily temperature range', value: '184 K to 242 K (−89 to −31 °C)', note: 'Viking 1 Lander site', status: 'measured', source: NSSDCA_MARS },
      { id: 'winds', label: 'Wind speeds', value: '2–30 m/s', note: '2–7 m/s summer, 5–10 m/s fall, 17–30 m/s in dust storms (Viking Lander sites)', status: 'measured', source: NSSDCA_MARS },
      { id: 'ground-ice', label: 'Near-surface water ice', value: 'Up to ~50% by volume in places', note: 'In the upper metre of soil, in the areas marked on NASA’s hydrogen map', status: 'estimated', method: 'NASA: areas on the Mars Odyssey Gamma Ray Spectrometer hydrogen map “are believed to consist of 50% water ice by volume”; the neutron detectors sense hydrogen in the upper metre of the surface.', source: ODYSSEY_INSTRUMENTS },
      { id: 'topography', label: 'Topographic range', value: '30 km', note: 'Our MOLA grid (15 km cells) spans −8.0 to +21.1 km', status: 'measured', source: NSSDCA_MARS },
      { id: 'magnetic', label: 'Global magnetic field', value: 'None', note: 'Only small magnetised patches of crust (NASA)', status: 'measured', source: MAVEN_AURORAS },
    ],
  },
  earth: {
    intro: 'Conditions that make Earth sites useful analogs — and where they differ from Mars.',
    conditions: [
      { id: 'atmosphere', label: 'Atmosphere (dry air, by volume)', value: '78.08% N₂ · 20.95% O₂ · 9,340 ppm Ar · 420 ppm CO₂', note: 'Mars’s air is 95.1% CO₂', status: 'measured', source: NSSDCA_EARTH },
      { id: 'water-vapour', label: 'Water vapour in the air', value: 'About 1% (highly variable)', note: 'Mars: 210 ppm', status: 'measured', source: NSSDCA_EARTH },
      { id: 'pressure', label: 'Surface pressure', value: '1014 mbar', note: 'About 160 times Mars’s 6.36 mbar (calculated)', status: 'measured', source: NSSDCA_EARTH },
      { id: 'temp-range', label: 'Daily temperature range', value: '283 K to 293 K (10 to 20 °C)', note: 'As listed on the fact sheet', status: 'measured', source: NSSDCA_EARTH },
      { id: 'winds', label: 'Wind speeds', value: '0 to 100 m/s', status: 'measured', source: NSSDCA_EARTH },
      { id: 'topography', label: 'Topographic range', value: '20.4 km', note: 'Mars: 30 km', status: 'measured', source: NSSDCA_EARTH },
      { id: 'magnetic', label: 'Global magnetic field', value: '0.24–0.66 gauss at the surface', note: 'NASA: it “helps to shield us from the harsh conditions of space”', status: 'measured', source: NSSDCA_EARTH },
    ],
  },
};
