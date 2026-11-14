import type { SourceRef } from './types';

/**
 * Every external source the app uses. Keep this in sync with docs/SOURCES.md.
 * "accessed" is the date the team (or Claude, on the team's behalf) downloaded it.
 */

const ACCESSED = '14 November 2026';

export const NSSDCA_MOON: SourceRef = {
  name: 'NASA NSSDCA Moon Fact Sheet',
  url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
  sourceDate: 'Last updated 11 January 2024',
  accessed: ACCESSED,
};

export const NSSDCA_MARS: SourceRef = {
  name: 'NASA NSSDCA Mars Fact Sheet',
  url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
  sourceDate: 'Last updated 19 May 2025',
  accessed: ACCESSED,
};

export const NSSDCA_EARTH: SourceRef = {
  name: 'NASA NSSDCA Earth Fact Sheet',
  url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
  sourceDate: 'Last updated 15 November 2024',
  accessed: ACCESSED,
};

export const SVS_CGI_MOON_KIT: SourceRef = {
  name: "NASA Scientific Visualization Studio — CGI Moon Kit (ID 4720)",
  url: 'https://svs.gsfc.nasa.gov/4720',
  sourceDate: 'Released 6 September 2019; page updated 9 January 2026',
  accessed: ACCESSED,
};

export const BLUE_MARBLE_NG: SourceRef = {
  name: 'NASA Earth Observatory — Blue Marble: Next Generation with Topography and Bathymetry',
  url: 'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/',
  sourceDate: 'July 2004 monthly composite',
  accessed: ACCESSED,
};

export const MARS_TREK_VIKING: SourceRef = {
  name: 'NASA Solar System Treks (Mars Trek) — layer Mars_Viking_MDIM21_ClrMosaic_global_232m',
  url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
  sourceDate: 'Date not stated by the tile service',
  accessed: ACCESSED,
};

export const MARS_TREK_MOLA: SourceRef = {
  name: 'NASA Solar System Treks (Mars Trek) — layer Mars_MGS_MOLA_DEM_mosaic_global_463m_8',
  url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m_8/1.0.0/WMTSCapabilities.xml',
  sourceDate: 'Date not stated by the tile service',
  accessed: ACCESSED,
};
