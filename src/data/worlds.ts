import {
  BLUE_MARBLE_NG,
  MARS_TREK_MOLA,
  MARS_TREK_VIKING,
  NSSDCA_EARTH,
  NSSDCA_MARS,
} from './sources';
import type { PlaceholderValue, World, WorldId } from './types';

/**
 * World definitions. To add a new world, add an entry here (and its textures
 * in public/textures/<id>/); the screens read everything from this list.
 *
 * Every "measured" value below is copied exactly from the named NSSDCA fact
 * sheet. Please re-check them against the source if you edit anything.
 */

const analoguePlaceholder: PlaceholderValue = {
  id: 'analogues',
  label: 'Earth analogue sites',
  value: 'Not yet available',
  status: 'placeholder',
  reason:
    'The location comparison is planned for a later milestone. No analogue data has been loaded.',
};

export const WORLDS: World[] = [
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'The fourth planet from the Sun',
    textures: {
      color: 'textures/mars/mars_color.jpg',
      elevation: 'textures/mars/mars_elevation.jpg',
      bumpScale: 3,
    },
    imagery: [
      {
        role: 'Surface colour',
        dataset: 'Viking MDIM 2.1 colorized global mosaic (Mars Trek layer Mars_Viking_MDIM21_ClrMosaic_global_232m)',
        source: MARS_TREK_VIKING,
        processing: 'Downloaded the 16×8 tiles of zoom level 3 and joined them into one 4096×2048 JPEG.',
        caveat: 'This is a colorized mosaic; colours are approximate, not true colour.',
      },
      {
        role: 'Elevation (bump shading)',
        dataset: 'MGS MOLA elevation, 8-bit version (Mars Trek layer Mars_MGS_MOLA_DEM_mosaic_global_463m_8)',
        source: MARS_TREK_MOLA,
        processing:
          'Joined the 8×4 tiles of zoom level 2 into one 2048×1024 image and contrast-stretched it. Used only for lighting effects; heights are not read from it.',
      },
    ],
    meanRadiusKm: 3389.5,
    initialLongitudeDeg: -70,
    highlightColor: '#f0a27a',
    facts: [
      { id: 'radius', label: 'Mean radius', value: '3,389.5 km', note: 'Volumetric mean radius', status: 'measured', source: NSSDCA_MARS },
      { id: 'gravity', label: 'Surface gravity', value: '3.73 m/s²', note: 'Mean value', status: 'measured', source: NSSDCA_MARS },
      { id: 'day', label: 'Length of day', value: '24.6597 hours', status: 'measured', source: NSSDCA_MARS },
      { id: 'pressure', label: 'Surface pressure', value: '6.36 mbar', note: 'At mean radius; varies 4.0–8.7 mbar with season', status: 'measured', source: NSSDCA_MARS },
      { id: 'temperature', label: 'Average temperature', value: '~214 K (−59 °C)', status: 'measured', source: NSSDCA_MARS },
      { id: 'distance', label: 'Mean distance from Sun', value: '227.956 million km', note: 'Orbit semimajor axis', status: 'measured', source: NSSDCA_MARS },
      analoguePlaceholder,
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'Our home planet',
    textures: {
      color: 'textures/earth/earth_color.jpg',
      bumpScale: 0,
    },
    imagery: [
      {
        role: 'Surface colour',
        dataset: 'Blue Marble: Next Generation, July 2004, with topography and bathymetry shading (world.topo.bathy.200407.3x5400x2700.jpg)',
        source: BLUE_MARBLE_NG,
        processing: 'Resized from 5400×2700 to 4096×2048.',
        caveat: 'Cloud-free monthly composite; relief shading is part of the image.',
      },
    ],
    meanRadiusKm: 6371.0,
    initialLongitudeDeg: 15,
    highlightColor: '#8ec5ff',
    facts: [
      { id: 'radius', label: 'Mean radius', value: '6,371.0 km', note: 'Volumetric mean radius', status: 'measured', source: NSSDCA_EARTH },
      { id: 'gravity', label: 'Surface gravity', value: '9.820 m/s²', note: 'Mean value', status: 'measured', source: NSSDCA_EARTH },
      { id: 'day', label: 'Length of day', value: '24.0000 hours', status: 'measured', source: NSSDCA_EARTH },
      { id: 'pressure', label: 'Surface pressure', value: '1014 mbar', status: 'measured', source: NSSDCA_EARTH },
      { id: 'temperature', label: 'Average temperature', value: '288 K (15 °C)', status: 'measured', source: NSSDCA_EARTH },
      { id: 'distance', label: 'Mean distance from Sun', value: '149.598 million km', note: 'Orbit semimajor axis', status: 'measured', source: NSSDCA_EARTH },
      analoguePlaceholder,
    ],
  },
];

export function getWorld(id: WorldId): World {
  const world = WORLDS.find((w) => w.id === id);
  if (!world) throw new Error(`Unknown world: ${id}`);
  return world;
}

/** Turns a path inside public/ into a URL that works locally and on GitHub Pages. */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
