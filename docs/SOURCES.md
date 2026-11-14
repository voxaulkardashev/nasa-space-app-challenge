# Sources

Every dataset, texture and value used in the app, with where it came from and when.
Required by rule 8 in `CLAUDE.md`. **Update this file whenever you add or change data.**

All items below were accessed on **14 November 2026**.
Textures were downloaded and processed with `scripts/fetch_textures.py`, so the steps can be repeated exactly.

## Textures (`public/textures/`)

| File | Size | Source | Dataset / original file | What we changed | Caveats |
|---|---|---|---|---|---|
| `moon/moon_color.jpg` | 4096×2048 | [NASA SVS — CGI Moon Kit, ID 4720](https://svs.gsfc.nasa.gov/4720) (released 6 Sep 2019, page updated 9 Jan 2026). Credit: NASA's Scientific Visualization Studio; visualizer Ernie Wright; scientist Noah Petro. | 2019 colour map `lroc_color_poles_4k.tif`, adapted from the LROC WAC Hapke Normalized mosaic (bands 643/566/415 nm as R/G/B) | TIFF → JPEG (quality 88) | NASA says the map is "optimized for aesthetics, not science". Latitudes beyond ±70° are filled with lower-resolution LOLA albedo (LDAM). |
| `moon/moon_elevation.jpg` | 2048×1024 | Same page as above | LOLA displacement map `ldem_16_uint.tif` (16 px/degree, unsigned 16-bit half-metres, offset +20,000) | Resized from 5760×2880; contrast-stretched (0.1–99.9 percentile) to 8-bit | Used only as a **visual bump map** for lighting. Heights are not read from it; do not use this file for measurements. |
| `earth/earth_color.jpg` | 4096×2048 | [NASA Earth Observatory — Blue Marble: Next Generation with Topography and Bathymetry](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/) | July 2004 composite, `world.topo.bathy.200407.3x5400x2700.jpg` | Resized from 5400×2700 | Cloud-free monthly composite; relief shading is part of the image. |
| `mars/mars_color.jpg` | 4096×2048 | [NASA Solar System Treks — Mars Trek tile service](https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml) | Layer `Mars_Viking_MDIM21_ClrMosaic_global_232m` (Viking MDIM 2.1 colorized global mosaic), zoom level 3 (16×8 tiles of 256 px) | Tiles joined into one image; JPEG | Colorized mosaic: **colours are approximate, not true colour**. The tile service does not state a date. **To do:** find and cite the original USGS Astrogeology product page for this mosaic. |
| `mars/mars_elevation.jpg` | 2048×1024 | [NASA Solar System Treks — Mars Trek tile service](https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m_8/1.0.0/WMTSCapabilities.xml) | Layer `Mars_MGS_MOLA_DEM_mosaic_global_463m_8` (MGS MOLA elevation, 8-bit), zoom level 2 (8×4 tiles) | Tiles joined; contrast-stretched to 8-bit | Visual bump map only, as above. The tile service does not state a date. |

All textures are equirectangular (2:1) maps centred on 0° longitude, which lines up with the sphere in the app.

## Values in the info panel (`src/data/worlds.ts`)

Copied exactly from the NASA NSSDCA Planetary Fact Sheets (author/curator D. R. Williams, NASA Goddard):

| World | Source | Source last updated |
|---|---|---|
| Moon | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html> | 11 January 2024 |
| Mars | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html> | 19 May 2025 |
| Earth | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html> | 15 November 2024 |

Notes on how fact-sheet entries map to the panel:

- **Mean radius**: "Volumetric mean radius".
- **Moon, length of day**: "Synodic period" (29.53 days), labelled in the app as sunrise to sunrise.
- **Moon, mean distance from Earth**: "Semimajor axis" 0.3844 × 10⁶ km, shown as 384,400 km.
- **Moon, temperature range**: "Diurnal temperature range (equator)". **Moon, surface pressure**: the night-time value.
- **Mars and Earth, mean distance from the Sun**: "Semimajor axis" in 10⁶ km.

Each world's panel also has one **Placeholder** row, "Earth analogue sites: Not yet available". It is not real data; the analogue comparison is a later milestone.

## Explore screen (Milestone 2)

All accessed **14 November 2026**.

### Elevation grids (`public/data/elevation/`)

Made with `scripts/prepare_elevation.py`. Both are 1440×720 little-endian Int16 files in metres, at 4 cells per degree. Each cell is the mean of the source pixels inside it. The app shows the value of the cell containing the chosen point, without interpolation.

| File | Source | Original file | Notes |
|---|---|---|---|
| `moon_elevation_4ppd.bin` | [NASA SVS CGI Moon Kit (ID 4720)](https://svs.gsfc.nasa.gov/4720): LOLA gridded data "as of spring 2019" | `ldem_16_uint.tif` (5760×2880, unsigned 16-bit half-metres, offset +20,000) | Heights relative to a 1737.4 km sphere (as stated on the SVS page). Cell size about 7.6 km. Range after averaging: −8,613 m to +10,428 m. |
| `mars_elevation_4ppd.bin` | [USGS Astrogeology: Mars MGS MOLA DEM mosaic, global, 463 m](https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif) | `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif` (46080×23040, signed 16-bit, no-data −32768) | Cell size about 14.8 km. Range after averaging: −8,046 m to +21,123 m. **The file does not state its vertical reference surface.** The range matches MOLA heights above the Mars areoid, but this has not been checked against USGS documentation, and the app says so. **To do:** find the USGS product page and confirm. |

**Regional slope** is **Estimated**. We calculate it from the height differences between neighbouring grid cells (central differences), so it averages over about two cells (15–30 km). Real local slopes can be much steeper.

### Featured sites (`src/data/featuredSites.ts`)

| Site | Coordinates (°N, °E) | Source | Label |
|---|---|---|---|
| Apollo 11, 15, 17 | Lunar Module positions | [NASA NSSDCA Apollo Landing Sites](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html), last updated 6 March 2017 | Measured |
| Tycho, Shackleton (Moon) | Centre latitude/longitude, plus diameter | [IAU/USGS Gazetteer of Planetary Nomenclature](https://planetarynames.wr.usgs.gov/) (feature IDs 6163, 5450) | Measured |
| Jezero, Gale, Olympus Mons, Valles Marineris, Hellas Planitia (Mars) | Centre latitude/longitude, plus diameter. The Gazetteer gives planetocentric 0–360° E, converted to −180…+180 | Gazetteer (feature IDs 14300, 2071, 4453, 6288, 2432) | Measured |
| Meteor Crater, Haughton crater (Earth) | 35.03, −111.02 and 75.38, −89.67 | **Compiled from Wikipedia and ESA image captions.** The Earth Impact Database (passc.net), the usual authority, did not respond. | **Estimated, team to confirm** |

The Meteor Crater description (about 1.2 km across, roughly 50,000 years old) comes from [NASA Science: Meteor Crater, Arizona, USA](https://science.nasa.gov/resource/meteor-crater-arizona-usa/). The other descriptions are short, general context, such as which rover landed where.

**Click coordinates** are **Estimated**. Precision is about one pixel of the 4096-wide map: roughly 2.7 km on the Moon, 5.2 km on Mars and 9.8 km on Earth.

### Close-up imagery (streamed from NASA when zoomed in)

| World | Service and layer | Notes |
|---|---|---|
| Mars | [NASA Mars Trek WMTS](https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml): `Mars_Viking_MDIM21_ClrMosaic_global_232m`, levels up to 7 | Colorized; colours approximate |
| Moon | [NASA Moon Trek WMTS](https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml): `LRO_WAC_Mosaic_Global_303ppd_v02`, levels up to 8 | Greyscale |
| Earth | [NASA GIBS WMTS (EPSG:4326)](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml): `BlueMarble_ShadedRelief_Bathymetry`, 500m tile set, levels up to 7 | Cloud-free composite |

Tiles are downloaded by each visitor's browser directly from NASA (no API key needed), and the app shows a credit while they're on screen. If NASA's servers are unreachable, the normal globe texture stays visible.

## Decorative elements (not data)

- **Starfield**: random points from drei's `<Stars>` component. Not a star catalogue. A real one, such as NASA SVS "Deep Star Maps", could replace it later.
- **Hover glow** around worlds: an interface highlight, not an atmosphere.
- **Sizes on the Select screen**: not to scale (the screen says so).
- **Spin**: slow decorative rotation in the real direction (west to east), not at the real speed.
