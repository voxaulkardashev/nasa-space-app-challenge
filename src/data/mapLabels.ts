import type { WorldId } from './types';

/**
 * Place names shown on the globes and flat maps (Overview and Explore).
 * They are map labels for orientation, not measurements. Sources: docs/SOURCES.md.
 */

export interface MapLabel {
  id: string;
  worldId: WorldId;
  name: string;
  /** Short description, e.g. "Volcano" or "City". */
  kind: string;
  /** Degrees north / east. */
  lat: number;
  lon: number;
  /** Mars: feature number in the IAU/USGS Gazetteer of Planetary Nomenclature. */
  gazetteerId?: number;
  /** Same place as a featured site: on Explore the featured pin is shown instead. */
  featuredId?: string;
}

/**
 * Mars: names and centre coordinates copied from the IAU/USGS Gazetteer of
 * Planetary Nomenclature (MARS_nomenclature_center_pts, downloaded 15 November 2026),
 * longitudes converted from 0–360° E to −180–180°. The "kind" is a plain-language
 * description of the IAU feature type (e.g. Mons = mountain, Planitia = low plain).
 */
const MARS_LABELS: MapLabel[] = [
  { id: 'mars-olympus-mons', worldId: 'mars', name: 'Olympus Mons', kind: 'Volcano', lat: 18.65, lon: -133.80, gazetteerId: 4453 },
  { id: 'mars-valles-marineris', worldId: 'mars', name: 'Valles Marineris', kind: 'Canyon system', lat: -14.01, lon: -58.59, gazetteerId: 6288 },
  { id: 'mars-hellas-planitia', worldId: 'mars', name: 'Hellas Planitia', kind: 'Impact basin', lat: -42.43, lon: 70.50, gazetteerId: 2432 },
  { id: 'mars-utopia-planitia', worldId: 'mars', name: 'Utopia Planitia', kind: 'Plain', lat: 46.74, lon: 117.52, gazetteerId: 6260 },
  { id: 'mars-arsia-mons', worldId: 'mars', name: 'Arsia Mons', kind: 'Volcano', lat: -8.26, lon: -120.09, gazetteerId: 394 },
  { id: 'mars-pavonis-mons', worldId: 'mars', name: 'Pavonis Mons', kind: 'Volcano', lat: 1.48, lon: -112.96, gazetteerId: 4620 },
  { id: 'mars-ascraeus-mons', worldId: 'mars', name: 'Ascraeus Mons', kind: 'Volcano', lat: 11.92, lon: -104.08, gazetteerId: 417 },
  { id: 'mars-alba-mons', worldId: 'mars', name: 'Alba Mons', kind: 'Volcano', lat: 41.08, lon: -110.71, gazetteerId: 14306 },
  { id: 'mars-elysium-mons', worldId: 'mars', name: 'Elysium Mons', kind: 'Volcano', lat: 25.02, lon: 147.21, gazetteerId: 1783 },
  { id: 'mars-noctis-labyrinthus', worldId: 'mars', name: 'Noctis Labyrinthus', kind: 'Canyon maze', lat: -6.36, lon: -101.19, gazetteerId: 4324 },
  { id: 'mars-argyre-planitia', worldId: 'mars', name: 'Argyre Planitia', kind: 'Impact basin', lat: -49.84, lon: -43.31, gazetteerId: 371 },
  { id: 'mars-isidis-planitia', worldId: 'mars', name: 'Isidis Planitia', kind: 'Impact basin', lat: 13.94, lon: 88.38, gazetteerId: 2735 },
  { id: 'mars-chryse-planitia', worldId: 'mars', name: 'Chryse Planitia', kind: 'Plain', lat: 28.43, lon: -40.31, gazetteerId: 1203 },
  { id: 'mars-acidalia-planitia', worldId: 'mars', name: 'Acidalia Planitia', kind: 'Plain', lat: 49.76, lon: -20.74, gazetteerId: 38 },
  { id: 'mars-amazonis-planitia', worldId: 'mars', name: 'Amazonis Planitia', kind: 'Plain', lat: 25.75, lon: -162.91, gazetteerId: 220 },
  { id: 'mars-arabia-terra', worldId: 'mars', name: 'Arabia Terra', kind: 'Highlands', lat: 21.25, lon: 5.72, gazetteerId: 336 },
  { id: 'mars-terra-cimmeria', worldId: 'mars', name: 'Terra Cimmeria', kind: 'Highlands', lat: -32.68, lon: 147.75, gazetteerId: 5930 },
  { id: 'mars-tempe-terra', worldId: 'mars', name: 'Tempe Terra', kind: 'Highlands', lat: 38.69, lon: -70.61, gazetteerId: 5916 },
  { id: 'mars-syrtis-major-planum', worldId: 'mars', name: 'Syrtis Major Planum', kind: 'Plateau', lat: 9.20, lon: 67.10, gazetteerId: 5796 },
  { id: 'mars-hesperia-planum', worldId: 'mars', name: 'Hesperia Planum', kind: 'Plateau', lat: -21.42, lon: 109.89, gazetteerId: 2488 },
  { id: 'mars-lunae-planum', worldId: 'mars', name: 'Lunae Planum', kind: 'Plateau', lat: 10.79, lon: -65.51, gazetteerId: 3519 },
  { id: 'mars-solis-planum', worldId: 'mars', name: 'Solis Planum', kind: 'Plateau', lat: -26.40, lon: -89.67, gazetteerId: 5625 },
  { id: 'mars-meridiani-planum', worldId: 'mars', name: 'Meridiani Planum', kind: 'Plain', lat: -0.04, lon: -3.14, gazetteerId: 3854 },
  { id: 'mars-kasei-valles', worldId: 'mars', name: 'Kasei Valles', kind: 'Outflow channels', lat: 25.14, lon: -62.88, gazetteerId: 2942 },
  { id: 'mars-ares-vallis', worldId: 'mars', name: 'Ares Vallis', kind: 'Outflow channel', lat: 10.29, lon: -25.61, gazetteerId: 358 },
  { id: 'mars-planum-boreum', worldId: 'mars', name: 'Planum Boreum', kind: 'North polar plateau', lat: 87.32, lon: 54.96, gazetteerId: 4754 },
  { id: 'mars-planum-australe', worldId: 'mars', name: 'Planum Australe', kind: 'South polar plateau', lat: -83.35, lon: 157.70, gazetteerId: 4753 },
];

/**
 * Earth: a selection of very large cities, for orientation.
 * NOT from a NASA dataset: approximate city-centre positions (rounded to
 * 0.01°) entered by the team. Shown as Estimated; to be confirmed.
 */
export const EARTH_LABEL_NOTE =
  'City positions are approximate city-centre coordinates entered by the team (not from a NASA dataset); they are for orientation only.';

const city = (id: string, name: string, lat: number, lon: number): MapLabel => ({ id: `earth-${id}`, worldId: 'earth', name, kind: 'City', lat, lon });

const EARTH_LABELS: MapLabel[] = [
  city('new-york', 'New York', 40.71, -74.01),
  city('los-angeles', 'Los Angeles', 34.05, -118.24),
  city('mexico-city', 'Mexico City', 19.43, -99.13),
  city('toronto', 'Toronto', 43.65, -79.38),
  city('sao-paulo', 'São Paulo', -23.55, -46.63),
  city('buenos-aires', 'Buenos Aires', -34.6, -58.38),
  city('lima', 'Lima', -12.05, -77.04),
  city('london', 'London', 51.51, -0.13),
  city('paris', 'Paris', 48.86, 2.35),
  city('moscow', 'Moscow', 55.76, 37.62),
  city('istanbul', 'Istanbul', 41.01, 28.98),
  city('cairo', 'Cairo', 30.04, 31.24),
  city('lagos', 'Lagos', 6.52, 3.38),
  city('kinshasa', 'Kinshasa', -4.32, 15.31),
  city('nairobi', 'Nairobi', -1.29, 36.82),
  city('johannesburg', 'Johannesburg', -26.2, 28.05),
  city('tehran', 'Tehran', 35.69, 51.39),
  city('karachi', 'Karachi', 24.86, 67.01),
  city('delhi', 'Delhi', 28.61, 77.21),
  city('mumbai', 'Mumbai', 19.08, 72.88),
  city('dhaka', 'Dhaka', 23.81, 90.41),
  city('bangkok', 'Bangkok', 13.76, 100.5),
  city('beijing', 'Beijing', 39.9, 116.41),
  city('shanghai', 'Shanghai', 31.23, 121.47),
  city('seoul', 'Seoul', 37.57, 126.98),
  city('tokyo', 'Tokyo', 35.68, 139.69),
  city('manila', 'Manila', 14.6, 120.98),
  city('jakarta', 'Jakarta', -6.21, 106.85),
  city('sydney', 'Sydney', -33.87, 151.21),
];

export const MAP_LABELS: Record<WorldId, MapLabel[]> = { mars: MARS_LABELS, earth: EARTH_LABELS };

export const gazetteerUrl = (id: number) => `https://planetarynames.wr.usgs.gov/Feature/${id}`;
