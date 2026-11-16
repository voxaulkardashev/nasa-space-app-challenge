import type { SourceRef, WorldId } from './types';

/**
 * Elevation grids used on the Explore screen (made by scripts/prepare_elevation.py).
 * Format: little-endian Int16 heights in metres, row 0 = north, column 0 = 180°W.
 */
export interface ElevationDataset {
  /** Path inside public/. */
  path: string;
  width: number;
  height: number;
  /** What "0 m" means for this world. */
  reference: string;
  /** Highest value in the grid (m), used to keep the camera above raised terrain. */
  maxHeightM: number;
  /** Dataset name as shown in the source line. */
  dataset: string;
  source: SourceRef;
}

const ACCESSED = '14 November 2026';

export const ELEVATION: Partial<Record<WorldId, ElevationDataset>> = {
  mars: {
    path: 'data/elevation/mars_elevation_4ppd.bin',
    width: 1440,
    height: 720,
    // The file does not state its vertical reference; its range matches MOLA heights above
    // the Mars areoid, but that is unconfirmed (see docs/SOURCES.md).
    reference: 'reference surface still to be confirmed (see sources)',
    maxHeightM: 21123,
    dataset: 'MGS MOLA global elevation mosaic, 463 m/pixel (Mars_MGS_MOLA_DEM_mosaic_global_463m.tif), averaged to 4 cells per degree',
    source: {
      name: 'USGS Astrogeology — Mars MGS MOLA DEM mosaic (global, 463 m)',
      url: 'https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif',
      sourceDate: 'Date not stated in the file listing',
      accessed: ACCESSED,
    },
  },
};

/**
 * Earth heights for the Topography view, and for Explore values at dropped pins.
 * NASA's page states the greyscale map was "scaled 0-6400 meters"; oceans are 0.
 */
const EARTH_TOPOGRAPHY: ElevationDataset = {
  path: 'data/elevation/earth_topography_8ppd.bin.gz',
  width: 2880,
  height: 1440,
  reference: 'sea level (oceans and land below sea level are shown at 0 m)',
  maxHeightM: 6239,
  dataset:
    'Blue Marble: Next Generation land topography (gebco_08_rev_elev_21600x10800.tif, greyscale scaled 0–6400 m), averaged to 8 cells per degree',
  source: {
    name: 'NASA Earth Observatory — Blue Marble: Next Generation, Topography and Bathymetry Maps (imagery by Jesse Allen, using GEBCO data)',
    url: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/',
    sourceDate: 'File last modified 19 December 2025 (original data: GEBCO 2008)',
    accessed: '15 November 2026',
  },
};

// Explore also shows Earth heights from the same grid (featured Earth sites use a published value instead).
ELEVATION.earth = {
  ...EARTH_TOPOGRAPHY,
  reference: 'above sea level; land below sea level and oceans read 0 m, heights in steps of about 25 m',
};

/** Height grids for the Topography view. */
export const TOPOGRAPHY: Partial<Record<WorldId, ElevationDataset>> = {
  // Same MOLA source as the Explore values, averaged to 8 cells per degree (about 7.4 km) instead of 4.
  mars: ELEVATION.mars && {
    ...ELEVATION.mars,
    path: 'data/elevation/mars_topography_8ppd.bin.gz',
    width: 2880,
    height: 1440,
    maxHeightM: 21157,
    dataset: 'MGS MOLA global elevation mosaic, 463 m/pixel (Mars_MGS_MOLA_DEM_mosaic_global_463m.tif), averaged to 8 cells per degree',
  },
  earth: EARTH_TOPOGRAPHY,
};

/** Starting vertical exaggeration per world (real relief is too small to see at globe scale). */
export const DEFAULT_EXAGGERATION: Record<WorldId, number> = { mars: 20, earth: 50 };
