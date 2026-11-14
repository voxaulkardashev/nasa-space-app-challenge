import type { FeaturedSite, MeasuredValue, SourceRef, WorldId } from './types';

/**
 * Featured sites for the Explore screen.
 *
 * Sources (all accessed 14 November 2026; see docs/SOURCES.md):
 * - Moon/Mars craters and regions: IAU/USGS Gazetteer of Planetary Nomenclature.
 *   Mars longitudes there are 0–360° east; they are converted here to −180…+180
 *   (e.g. 226.20° E → −133.80°).
 * - Apollo sites: NASA NSSDCA "Apollo Landing Sites" (Lunar Module positions).
 * - Earth: NOT from an official gazetteer yet; marked Estimated (team to confirm).
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

const NSSDCA_APOLLO_SITES: SourceRef = {
  name: 'NASA NSSDCA — Apollo Landing Sites (Lunar Module positions)',
  url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html',
  sourceDate: 'Last updated 6 March 2017',
  accessed: ACCESSED,
};

const EARTH_COMPILED: SourceRef = {
  name: 'Compiled from Wikipedia and ESA image captions (not an official gazetteer)',
  url: 'https://en.wikipedia.org/wiki/List_of_impact_craters_on_Earth',
  sourceDate: 'Not applicable',
  accessed: ACCESSED,
};

function diameter(km: string, source: SourceRef): MeasuredValue {
  return { id: 'diameter', label: 'Diameter', value: `${km} km`, note: 'Official feature diameter', status: 'measured', source };
}

const SHACKLETON = gazetteer(5450, 'Shackleton', 'Oct 04, 2023');
const TYCHO = gazetteer(6163, 'Tycho', 'Oct 18, 2010');
const JEZERO = gazetteer(14300, 'Jezero', 'Nov 17, 2010');
const GALE = gazetteer(2071, 'Gale', 'Nov 17, 2010');
const OLYMPUS = gazetteer(4453, 'Olympus Mons', 'Oct 01, 2006');
const VALLES = gazetteer(6288, 'Valles Marineris', 'Oct 01, 2006');
const HELLAS = gazetteer(2432, 'Hellas Planitia', 'Oct 01, 2006');

const EARTH_METHOD =
  'Approximate centre, rounded to 0.01°, compiled from public reference pages. Not yet checked against an official source; the team should confirm it.';

export const FEATURED_SITES: FeaturedSite[] = [
  // ---------------- Moon ----------------
  {
    id: 'apollo-11', worldId: 'moon', name: 'Apollo 11 — Tranquility Base', kind: 'Apollo landing site',
    lat: 0.67416, lon: 23.47314,
    description: 'Where the first crewed Moon landing touched down in July 1969, in Mare Tranquillitatis.',
    coordinateStatus: 'measured', coordinateSource: NSSDCA_APOLLO_SITES, facts: [],
  },
  {
    id: 'apollo-15', worldId: 'moon', name: 'Apollo 15 — Hadley–Apennine', kind: 'Apollo landing site',
    lat: 26.13239, lon: 3.6333,
    description: 'Landing site at the edge of the Apennine mountains, next to the Hadley Rille channel.',
    coordinateStatus: 'measured', coordinateSource: NSSDCA_APOLLO_SITES, facts: [],
  },
  {
    id: 'apollo-17', worldId: 'moon', name: 'Apollo 17 — Taurus–Littrow', kind: 'Apollo landing site',
    lat: 20.1911, lon: 30.7723,
    description: 'The last crewed Moon landing (December 1972), in a valley on the edge of Mare Serenitatis.',
    coordinateStatus: 'measured', coordinateSource: NSSDCA_APOLLO_SITES, facts: [],
  },
  {
    id: 'tycho', worldId: 'moon', name: 'Tycho', kind: 'Crater',
    lat: -43.3, lon: -11.22,
    description: 'A large crater in the southern highlands with bright rays of ejecta that are easy to see on the globe.',
    coordinateStatus: 'measured', coordinateSource: TYCHO, facts: [diameter('85.29', TYCHO)],
  },
  {
    id: 'shackleton', worldId: 'moon', name: 'Shackleton', kind: 'Crater',
    lat: -89.67, lon: 129.78,
    description: 'A crater almost exactly at the lunar south pole. Its floor never receives direct sunlight.',
    coordinateStatus: 'measured', coordinateSource: SHACKLETON, facts: [diameter('20.92', SHACKLETON)],
  },

  // ---------------- Mars ----------------
  {
    id: 'jezero', worldId: 'mars', name: 'Jezero', kind: 'Crater',
    lat: 18.41, lon: 77.69,
    description: 'Landing site of NASA’s Perseverance rover (February 2021). The crater contains an ancient river delta.',
    coordinateStatus: 'measured', coordinateSource: JEZERO, facts: [diameter('47.52', JEZERO)],
  },
  {
    id: 'gale', worldId: 'mars', name: 'Gale', kind: 'Crater',
    lat: -5.37, lon: 137.81,
    description: 'Landing site of NASA’s Curiosity rover (August 2012), which is climbing the layered mountain in its centre.',
    coordinateStatus: 'measured', coordinateSource: GALE, facts: [diameter('154.08', GALE)],
  },
  {
    id: 'olympus-mons', worldId: 'mars', name: 'Olympus Mons', kind: 'Volcano',
    lat: 18.65, lon: -133.8,
    description: 'An enormous shield volcano in the Tharsis region.',
    coordinateStatus: 'measured', coordinateSource: OLYMPUS, facts: [diameter('610.13', OLYMPUS)],
  },
  {
    id: 'valles-marineris', worldId: 'mars', name: 'Valles Marineris', kind: 'Canyon system',
    lat: -14.01, lon: -58.59,
    description: 'A system of canyons stretching thousands of kilometres along the Martian equator.',
    coordinateStatus: 'measured', coordinateSource: VALLES, facts: [diameter('3,761.28', VALLES)],
  },
  {
    id: 'hellas', worldId: 'mars', name: 'Hellas Planitia', kind: 'Impact basin',
    lat: -42.43, lon: 70.5,
    description: 'A vast, deep impact basin in the southern hemisphere.',
    coordinateStatus: 'measured', coordinateSource: HELLAS, facts: [diameter('2,299.16', HELLAS)],
  },

  // ---------------- Earth ----------------
  {
    id: 'meteor-crater', worldId: 'earth', name: 'Meteor Crater (Barringer Crater)', kind: 'Impact crater',
    lat: 35.03, lon: -111.02,
    description: 'A well-preserved impact crater in Arizona, about 1.2 km across and roughly 50,000 years old (NASA Science).',
    coordinateStatus: 'estimated', coordinateSource: EARTH_COMPILED, coordinateMethod: EARTH_METHOD, facts: [],
  },
  {
    id: 'haughton', worldId: 'earth', name: 'Haughton crater, Devon Island', kind: 'Impact crater',
    lat: 75.38, lon: -89.67,
    description: 'An impact crater in the Canadian High Arctic, one of the highest-latitude impact craters known.',
    coordinateStatus: 'estimated', coordinateSource: EARTH_COMPILED, coordinateMethod: EARTH_METHOD, facts: [],
  },
];

export function featuredSitesFor(worldId: WorldId): FeaturedSite[] {
  return FEATURED_SITES.filter((s) => s.worldId === worldId);
}

export function getFeaturedSite(id: string): FeaturedSite | undefined {
  return FEATURED_SITES.find((s) => s.id === id);
}
