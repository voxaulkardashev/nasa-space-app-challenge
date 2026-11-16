import type { SourceRef, WorldId } from './types';

/**
 * High-resolution imagery streamed while zoomed in on the Explore screen.
 * Every service uses a plain latitude/longitude (equirectangular) grid with its
 * top-left corner at 180°W, 90°N, and allows web pages on other sites to load
 * its tiles (CORS: *).
 *
 * Each world has a STACK of sources, coarsest first. The app uses the first
 * source while it is sharp enough for the view, then switches to the next,
 * sharper one as you zoom in further.
 */
export interface TileLayerDef {
  /** Short unique id, used in tile cache keys. */
  id: string;
  /** Shown in the on-screen credit. */
  label: string;
  /** Tile URL for zoom level z, row and column. */
  url: (z: number, row: number, col: number) => string;
  /** Pixels per tile side. */
  tileSize: number;
  /** Degrees covered by one tile at level 0 (it halves at each level). */
  level0TileDeg: number;
  /** Highest zoom level we use (may be below the service's own maximum; see notes). */
  maxLevel: number;
  /** Approximate ground detail at maxLevel, for the credit line. */
  finestDetail: string;
  source: SourceRef;
  caveat?: string;
  /** Tiles contain transparent areas (no data) that must show what is underneath. */
  transparent?: boolean;
  /** Pure-black pixels mean "no data" (e.g. oceans in a land-only layer) and are made see-through. */
  blackIsNoData?: boolean;
  /** False when the tiles are served from outside NASA (the 2D map uses NASA-hosted sources only). */
  nasaHosted?: boolean;
}

const ACCESSED = '14 November 2026';

const trek = (body: 'Mars', layer: string) => (z: number, row: number, col: number) =>
  `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0//default/default028mm/${z}/${row}/${col}.jpg`;

const VIKING: TileLayerDef = {
  id: 'mars-viking',
  label: 'NASA Mars Trek — Viking MDIM 2.1 colorized mosaic',
  url: trek('Mars', 'Mars_Viking_MDIM21_ClrMosaic_global_232m'),
  tileSize: 256,
  level0TileDeg: 180,
  maxLevel: 7,
  finestDetail: 'about 330 m per pixel',
  source: {
    name: 'NASA Solar System Treks (Mars Trek) — layer Mars_Viking_MDIM21_ClrMosaic_global_232m',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
    sourceDate: 'Date not stated by the tile service',
    accessed: ACCESSED,
  },
  caveat: 'Colorized mosaic: colours are approximate.',
};

const CTX: TileLayerDef = {
  id: 'mars-ctx',
  label: 'MRO Context Camera (CTX) global mosaic, beta01 — data credit: NASA/JPL/MSSS/The Murray Lab (Caltech); tiles hosted by Esri',
  url: (z, row, col) => `https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/${z}/${row}/${col}`,
  tileSize: 512,
  level0TileDeg: 180,
  // The service lists levels 0–11, but level-11 tiles came back only partly drawn when tested
  // (15 Nov 2026), so we stop at level 10.
  maxLevel: 10,
  finestDetail: 'about 20 m per pixel',
  source: {
    name: 'NASA Solar System Treks (Mars Trek) — layer CTX_beta01_uncontrolled_5m_Caltech (“CTX Global BETA Uncontrolled 5m Caltech”); tiles served by astro.arcgis.com',
    url: 'https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/WMTSCapabilities.xml',
    sourceDate: 'Date not stated by the tile service',
    accessed: '15 November 2026',
  },
  caveat: 'Greyscale; a beta, “uncontrolled” mosaic, so features can be offset slightly from their true position. The Murray Lab/Caltech grants free use of this mosaic for all purposes.',
  transparent: true,
  nasaHosted: false,
};

const BLUE_MARBLE: TileLayerDef = {
  id: 'earth-bluemarble',
  label: 'NASA GIBS — Blue Marble Shaded Relief and Bathymetry (MODIS)',
  url: (z, row, col) =>
    `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${z}/${row}/${col}.jpeg`,
  tileSize: 512,
  level0TileDeg: 288,
  maxLevel: 7,
  finestDetail: 'about 500 m per pixel',
  source: {
    name: 'NASA GIBS (Global Imagery Browse Services) — layer BlueMarble_ShadedRelief_Bathymetry, EPSG:4326, 500m tile set',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
    sourceDate: 'Date not stated by the tile service',
    accessed: ACCESSED,
  },
  caveat: 'Cloud-free composite.',
};

const LANDSAT_WELD: TileLayerDef = {
  id: 'earth-weld',
  label: 'NASA GIBS — Landsat WELD true colour, annual composite (2000)',
  url: (z, row, col) =>
    `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/2000-12-01/31.25m/${z}/${row}/${col}.jpeg`,
  tileSize: 512,
  level0TileDeg: 288,
  maxLevel: 11,
  finestDetail: 'about 30 m per pixel',
  source: {
    name: 'NASA GIBS — layer Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual (Surface Reflectance, NBAR, True Color, Global, Annual, v3.1, Landsat / WELD), time 2000-12-01, 31.25m tile set',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
    sourceDate: 'Annual composite for 2000 (the latest year the layer offers)',
    accessed: '15 November 2026',
  },
  caveat: 'Land only (oceans show the coarser Blue Marble image underneath); imagery is from around the year 2000.',
  blackIsNoData: true,
};

export const TILE_LAYERS: Partial<Record<WorldId, TileLayerDef[]>> = {
  mars: [VIKING, CTX],
  earth: [BLUE_MARBLE, LANDSAT_WELD],
};

export function getTileLayer(id: string): TileLayerDef | undefined {
  return Object.values(TILE_LAYERS)
    .flat()
    .find((l) => l?.id === id);
}
