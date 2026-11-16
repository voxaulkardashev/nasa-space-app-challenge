import type { FeaturedSite, MeasuredValue, SourceRef, WorldId } from './types';

/**
 * Featured sites for the Explore screen.
 *
 * Sources (accessed 14–15 November 2026; see docs/SOURCES.md):
 * - Mars craters and regions: IAU/USGS Gazetteer of Planetary Nomenclature.
 *   Mars longitudes there are 0–360° east; they are converted here to −180…+180
 *   (e.g. 226.20° E → −133.80°).
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



function diameter(km: string, source: SourceRef): MeasuredValue {
  return { id: 'diameter', label: 'Diameter', value: `${km} km`, note: 'Official feature diameter', status: 'measured', source };
}

const JEZERO = gazetteer(14300, 'Jezero', 'Nov 17, 2010');
const GALE = gazetteer(2071, 'Gale', 'Nov 17, 2010');
const HALE: SourceRef = { ...gazetteer(2322, 'Hale', ''), sourceDate: 'Name adopted by the IAU in 1973; record date not stated', accessed: '16 November 2026' };



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
    id: 'hale', worldId: 'mars', name: 'Hale', kind: 'Crater',
    lat: -35.78, lon: -36.5,
    description:
      'A large oval impact crater near the northern edge of the Argyre basin. Its central peaks are one of the most active sites of recurring slope lineae (RSL), dark seasonal streaks on steep slopes (NASA).',
    coordinateStatus: 'measured', coordinateSource: HALE, facts: [diameter('149.00', HALE)],
    layers: ['impact', 'terrain'],
  },

  {
    id: 'elysium-planitia', worldId: 'mars', name: 'Elysium Planitia', kind: 'Volcanic plain (InSight landing site)',
    lat: 4.502, lon: 135.623,
    description:
      'A broad, young volcanic plain near the equator. The pin marks where NASA’s InSight lander touched down (26 November 2018), not the centre of the whole plain.',
    coordinateStatus: 'estimated',
    coordinateSource: {
      name: 'NASA NSSDCA — InSight Mars Lander (landed in western Elysium Planitia); landing ellipse centre 4.4° N, 135.8° E (Golombek et al. 2016)',
      url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A',
      sourceDate: 'Page date not stated',
      accessed: '16 November 2026',
    },
    coordinateMethod: 'InSight lander position (4.502° N, 135.623° E) supplied by the team; consistent with NASA’s record and the landing-ellipse centre. Marks the landing site, not the centre of Elysium Planitia.',
    facts: [],
    layers: ['terrain'],
  },

  // ---------------- Earth ----------------
  // TEMPORARY placeholder (no analog chosen yet for Elysium Planitia). Replace this entry, the
  // 'elysium-placeholder' pair in analogues.ts and src/data/placeholderResearch.ts together.
  {
    id: 'earth-placeholder', worldId: 'earth', name: 'Earth Location Placeholder', kind: 'Temporary marker — not an analog',
    lat: 46.0, lon: 2.0,
    description: 'An Earth analog for Elysium Planitia has not been selected yet. This location and map marker are temporary and will be replaced.',
    coordinateStatus: 'placeholder',
    coordinateSource: { name: 'None (placeholder)', url: 'https://planetarynames.wr.usgs.gov/Feature/1784', sourceDate: 'Not applicable', accessed: 'Not applicable' },
    coordinateMethod: 'Arbitrary point on land used only to test the map and comparison layout.',
    facts: [],
    layers: [],
  },
  {
    id: 'lake-lappajarvi', worldId: 'earth', name: 'Lake Lappajärvi, Finland', kind: 'Impact crater lake',
    lat: 63.2, lon: 23.7,
    description: 'Europe’s largest crater lake, filling a meteorite impact structure about 78 million years old in western Finland (Lappajärvi Geopark).',
    coordinateStatus: 'estimated',
    coordinateSource: { name: 'Crater Lake Lappajärvi Geopark — Birth of the crater lake', url: 'https://kraatterijarvigeopark.fi/birth-of-the-crater-lake', sourceDate: 'Page date not stated', accessed: '16 November 2026' },
    coordinateMethod: 'Approximate centre of the lake (63.20° N, 23.70° E) supplied by the team, rounded to 0.01°; on the lake, not a nearby town. Team to confirm.',
    facts: [],
    layers: ['impact', 'sediments'],
  },
  {
    id: 'badwater-basin', worldId: 'earth', name: 'Badwater Basin, California', kind: 'Salt flat basin',
    lat: 36.23, lon: -116.77,
    description:
      'The lowest point in North America, 282 ft (86 m) below sea level, in Death Valley National Park, California: vast salt flats left by the ancient Lake Manly (NPS).',
    coordinateStatus: 'estimated',
    coordinateSource: {
      name: 'NASA Photojournal PIA26197 — Badwater, Death Valley (ASTER scene centred at 36.3° N, 116.8° W)',
      url: 'https://science.nasa.gov/photojournal/badwater-death-valley/',
      sourceDate: '14 December 2023',
      accessed: '16 November 2026',
    },
    coordinateMethod:
      'Approximate position of the Badwater pool and boardwalk at the foot of the Black Mountains, rounded to 0.01°, checked by eye on NASA GIBS Landsat imagery and consistent with NASA’s ASTER scene of Badwater Basin (PIA26197). Not from an official gazetteer (USGS GNIS could not be queried); the team should confirm it.',
    facts: [],
    layers: ['sediments', 'terrain'],
  },
  {
    id: 'mcmurdo-dry-valleys', worldId: 'earth', name: 'McMurdo Dry Valleys', kind: 'South Fork of Wright Valley — Don Juan Pond',
    lat: -77.563, lon: 161.216,
    description:
      'Snow-free polar desert valleys west of McMurdo Sound, Antarctica (NASA). The pin marks Don Juan Pond in the South Fork of Wright Valley, where dark, wet streaks form on the slopes.',
    coordinateStatus: 'estimated',
    coordinateSource: {
      name: 'Polar Geospatial Center — map “Don Juan Pond, Wright Valley” (location inset)',
      url: 'https://data.pgc.umn.edu/maps/antarctica/era/04/pdf/Don%20Juan%20Pond%20Wright%20Valley.pdf',
      sourceDate: 'Map date not checked',
      accessed: '16 November 2026',
    },
    coordinateMethod:
      'Position of Don Juan Pond printed on the PGC map inset (77° 33.784′ S, 161° 12.948′ E), read from a web-search excerpt because the PDF host is not reachable from our environment; agrees with other published positions within about 1 km. Team to confirm.',
    facts: [],
    layers: ['sediments', 'terrain'],
  },
];

export function featuredSitesFor(worldId: WorldId): FeaturedSite[] {
  return FEATURED_SITES.filter((s) => s.worldId === worldId);
}

export function getFeaturedSite(id: string): FeaturedSite | undefined {
  return FEATURED_SITES.find((s) => s.id === id);
}
