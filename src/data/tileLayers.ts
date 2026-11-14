import type { SourceRef, WorldId } from './types';

/**
 * High-resolution imagery streamed while zoomed in on the Explore screen.
 * All three services are NASA WMTS tile servers in plain latitude/longitude
 * (equirectangular) layout, with their top-left corner at 180°W, 90°N.
 * They allow web pages on other sites to load their tiles (CORS: *).
 */
export interface TileLayerDef {
  /** Shown in the on-screen credit. */
  label: string;
  /** Tile URL for zoom level z, row and column. */
  url: (z: number, row: number, col: number) => string;
  /** Pixels per tile side. */
  tileSize: number;
  /** Degrees covered by one tile at level 0 (it halves at each level). */
  level0TileDeg: number;
  /** Highest zoom level the service offers. */
  maxLevel: number;
  source: SourceRef;
  caveat?: string;
}

const ACCESSED = '14 November 2026';

const trek = (body: 'Mars' | 'Moon', layer: string) => (z: number, row: number, col: number) =>
  `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0//default/default028mm/${z}/${row}/${col}.jpg`;

export const TILE_LAYERS: Partial<Record<WorldId, TileLayerDef>> = {
  mars: {
    label: 'NASA Mars Trek — Viking MDIM 2.1 colorized mosaic',
    url: trek('Mars', 'Mars_Viking_MDIM21_ClrMosaic_global_232m'),
    tileSize: 256,
    level0TileDeg: 180,
    maxLevel: 7,
    source: {
      name: 'NASA Solar System Treks (Mars Trek) — layer Mars_Viking_MDIM21_ClrMosaic_global_232m',
      url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
      sourceDate: 'Date not stated by the tile service',
      accessed: ACCESSED,
    },
    caveat: 'Colorized mosaic: colours are approximate.',
  },
  moon: {
    label: 'NASA Moon Trek — LRO WAC global mosaic (greyscale)',
    url: trek('Moon', 'LRO_WAC_Mosaic_Global_303ppd_v02'),
    tileSize: 256,
    level0TileDeg: 180,
    maxLevel: 8,
    source: {
      name: 'NASA Solar System Treks (Moon Trek) — layer LRO_WAC_Mosaic_Global_303ppd_v02',
      url: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml',
      sourceDate: 'Date not stated by the tile service',
      accessed: ACCESSED,
    },
    caveat: 'Greyscale mosaic, so close-ups look grey rather than tinted.',
  },
  earth: {
    label: 'NASA GIBS — Blue Marble Shaded Relief and Bathymetry (MODIS)',
    url: (z, row, col) =>
      `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${z}/${row}/${col}.jpeg`,
    tileSize: 512,
    level0TileDeg: 288,
    maxLevel: 7,
    source: {
      name: 'NASA GIBS (Global Imagery Browse Services) — layer BlueMarble_ShadedRelief_Bathymetry, EPSG:4326, 500m tile set',
      url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
      sourceDate: 'Date not stated by the tile service',
      accessed: ACCESSED,
    },
    caveat: 'Cloud-free composite; maximum detail about 500 m per pixel.',
  },
};
