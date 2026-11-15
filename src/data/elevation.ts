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
    dataset: 'MGS MOLA global elevation mosaic, 463 m/pixel (Mars_MGS_MOLA_DEM_mosaic_global_463m.tif), averaged to 4 cells per degree',
    source: {
      name: 'USGS Astrogeology — Mars MGS MOLA DEM mosaic (global, 463 m)',
      url: 'https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif',
      sourceDate: 'Date not stated in the file listing',
      accessed: ACCESSED,
    },
  },
};
