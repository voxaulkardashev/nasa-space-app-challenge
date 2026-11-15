import {
  BLUE_MARBLE_NG,
  MARS_TREK_MOLA,
  MARS_TREK_VIKING,
} from './sources';
import type { World, WorldId } from './types';

/**
 * World definitions. To add a new world, add an entry here (and its textures
 * in public/textures/<id>/); the screens read everything from this list.
 *
 * The World Overview sidebar content (analog-relevant conditions and datasets)
 * lives in src/data/analogOverview.ts.
 */


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
