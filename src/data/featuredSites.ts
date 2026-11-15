import type { FeaturedSite, MeasuredValue, SourceRef, WorldId } from './types';

/**
 * Featured sites for the Explore screen.
 *
 * Sources (accessed 14–15 November 2026; see docs/SOURCES.md):
 * - Mars craters and regions: IAU/USGS Gazetteer of Planetary Nomenclature.
 *   Mars longitudes there are 0–360° east; they are converted here to −180…+180
 *   (e.g. 226.20° E → −133.80°).
 * - Phoenix landing site: NASA NSSDCA spacecraft record (nominal 68.15° N, 125.9° W).
 * - Earth: NOT from an official gazetteer; approximate, marked Estimated (team to confirm).
 * - Layers: the team's grouping based on the cited descriptions (not a geological map).
 */

const ACCESSED = '14 November 2026';

function gazetteer(featureId: number, name: string, lastUpdated: string): SourceRef {
  return {
    name: `IAU/USGS Gazetteer of Planetary Nomenclature — ${name} (feature ${featureId})`,
    url: `https://planetarynames.wr.usgs.gov/Feature/${featureId}`,
    sourceDate: `Feature record last updated ${lastUpdated}`,
    accessed: ACCESSED,
  };
}

const NSSDCA_PHOENIX: SourceRef = {
  name: 'NASA NSSDCA — Phoenix Mars Lander spacecraft record (2007-034A)',
  url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A',
  sourceDate: 'Page date not stated',
  accessed: '15 November 2026',
};

const EARTH_COMPILED: SourceRef = {
  name: 'Compiled from public reference pages (Wikipedia, BirdLife, ESA); not an official gazetteer',
  url: 'https://en.wikipedia.org/',
  sourceDate: 'Not applicable',
  accessed: '15 November 2026',
};

function diameter(km: string, source: SourceRef): MeasuredValue {
  return { id: 'diameter', label: 'Diameter', value: `${km} km`, note: 'Official feature diameter', status: 'measured', source };
}

const JEZERO = gazetteer(14300, 'Jezero', 'Nov 17, 2010');
const GALE = gazetteer(2071, 'Gale', 'Nov 17, 2010');
const OLYMPUS = gazetteer(4453, 'Olympus Mons', 'Oct 01, 2006');
const VALLES = gazetteer(6288, 'Valles Marineris', 'Oct 01, 2006');
const HELLAS = gazetteer(2432, 'Hellas Planitia', 'Oct 01, 2006');
const UTOPIA = gazetteer(6260, 'Utopia Planitia', 'Jun 21, 2012');

const EARTH_METHOD =
  'Approximate centre of the named area, rounded to 0.01°, compiled from public reference pages. Not checked against an official gazetteer; the team should confirm it.';

const earth = (fields: Omit<FeaturedSite, 'worldId' | 'coordinateStatus' | 'coordinateSource' | 'coordinateMethod' | 'facts'>): FeaturedSite => ({
  ...fields,
  worldId: 'earth',
  coordinateStatus: 'estimated',
  coordinateSource: EARTH_COMPILED,
  coordinateMethod: EARTH_METHOD,
  facts: [],
});

export const FEATURED_SITES: FeaturedSite[] = [
  // ---------------- Mars ----------------
  {
    id: 'jezero', worldId: 'mars', name: 'Jezero', kind: 'Crater',
    lat: 18.41, lon: 77.69,
    description: 'Landing site of NASA’s Perseverance rover (February 2021). The crater contains an ancient river delta.',
    coordinateStatus: 'measured', coordinateSource: JEZERO, facts: [diameter('47.52', JEZERO)],
    layers: ['impact', 'sediments', 'terrain'],
  },
  {
    id: 'gale', worldId: 'mars', name: 'Gale', kind: 'Crater',
    lat: -5.37, lon: 137.81,
    description: 'Landing site of NASA’s Curiosity rover (August 2012), which is climbing the layered mountain in its centre.',
    coordinateStatus: 'measured', coordinateSource: GALE, facts: [diameter('154.08', GALE)],
    layers: ['impact', 'sediments'],
  },
  {
    id: 'utopia', worldId: 'mars', name: 'Utopia Planitia', kind: 'Plain',
    lat: 46.74, lon: 117.52,
    description: 'A vast northern plain. NASA’s Viking 2 lander photographed its rocky surface (NASA Analog Explorer).',
    coordinateStatus: 'measured', coordinateSource: UTOPIA, facts: [diameter('3,560.45', UTOPIA)],
    layers: ['terrain'],
  },
  {
    id: 'phoenix', worldId: 'mars', name: 'Phoenix landing site', kind: 'Lander site',
    lat: 68.15, lon: -125.9,
    description:
      'Where NASA’s Phoenix lander touched down on 25 May 2008: “a relatively boulder-free area with a high (30-60%) ratio of ice to rock” (NASA NSSDCA).',
    coordinateStatus: 'measured', coordinateSource: NSSDCA_PHOENIX, facts: [],
    layers: ['sediments', 'terrain'],
  },
  {
    id: 'olympus-mons', worldId: 'mars', name: 'Olympus Mons', kind: 'Volcano',
    lat: 18.65, lon: -133.8,
    description: 'An enormous shield volcano in the Tharsis region.',
    coordinateStatus: 'measured', coordinateSource: OLYMPUS, facts: [diameter('610.13', OLYMPUS)],
    layers: ['terrain'],
  },
  {
    id: 'valles-marineris', worldId: 'mars', name: 'Valles Marineris', kind: 'Canyon system',
    lat: -14.01, lon: -58.59,
    description: 'A system of canyons stretching thousands of kilometres along the Martian equator.',
    coordinateStatus: 'measured', coordinateSource: VALLES, facts: [diameter('3,761.28', VALLES)],
    layers: ['terrain'],
  },
  {
    id: 'hellas', worldId: 'mars', name: 'Hellas Planitia', kind: 'Impact basin',
    lat: -42.43, lon: 70.5,
    description: 'A vast, deep impact basin in the southern hemisphere. NASA images also record dune fields inside it.',
    coordinateStatus: 'measured', coordinateSource: HELLAS, facts: [diameter('2,299.16', HELLAS)],
    layers: ['impact', 'aeolian'],
  },

  // ---------------- Earth ----------------
  earth({
    id: 'lake-salda', name: 'Lake Salda, Turkey', kind: 'Lake',
    lat: 37.55, lon: 29.68,
    description: 'A lake whose light-coloured shoreline sediments NASA compares with Jezero crater on Mars.',
    layers: ['sediments'],
  }),
  earth({
    id: 'verde-valley', name: 'Verde Valley, Arizona', kind: 'Valley',
    lat: 34.75, lon: -112.02,
    description: 'Where scientists study how signs of life are preserved, to help Curiosity know what to look for on Mars (NASA).',
    layers: ['sediments'],
  }),
  earth({
    id: 'death-valley', name: 'Death Valley, California', kind: 'Desert valley',
    lat: 36.24, lon: -116.83,
    description: 'NASA’s Mars 2020 team practised hazard avoidance here before Perseverance and Ingenuity flew to Mars.',
    layers: ['terrain'],
  }),
  earth({
    id: 'atacama', name: 'Atacama Desert (Yungay), Chile', kind: 'Desert',
    lat: -24.08, lon: -69.99,
    description: 'One of the driest places on Earth; NASA describes it as an analog for the dry, rugged terrain on Mars.',
    layers: ['sediments', 'terrain'],
  }),
  earth({
    id: 'pilot-valley', name: 'Pilot Valley, Utah', kind: 'Salt playa',
    lat: 41.0, lon: -113.9,
    description: 'A salt flat containing perchlorate, a salt NASA has observed in many places on Mars.',
    layers: ['sediments'],
  }),
  earth({
    id: 'holuhraun', name: 'Holuhraun, Iceland', kind: 'Lava field',
    lat: 64.85, lon: -16.83,
    description: 'A flood-basalt lava field. NASA scientists went there because “this volcano has geologic cousins on Mars.”',
    layers: ['terrain'],
  }),
  earth({
    id: 'haughton', name: 'Haughton crater, Devon Island', kind: 'Impact crater',
    lat: 75.38, lon: -89.67,
    description: 'An impact crater in the Canadian High Arctic and home of NASA’s Haughton-Mars Project mission analog.',
    layers: ['impact', 'terrain'],
  }),
  earth({
    id: 'meteor-crater', name: 'Meteor Crater (Barringer Crater)', kind: 'Impact crater',
    lat: 35.03, lon: -111.02,
    description: 'A well-preserved impact crater in Arizona, about 1.2 km across and roughly 50,000 years old (NASA Science).',
    layers: ['impact'],
  }),
];

export function featuredSitesFor(worldId: WorldId): FeaturedSite[] {
  return FEATURED_SITES.filter((s) => s.worldId === worldId);
}

export function getFeaturedSite(id: string): FeaturedSite | undefined {
  return FEATURED_SITES.find((s) => s.id === id);
}
