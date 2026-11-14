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

## Decorative elements (not data)

- **Starfield**: random points from drei's `<Stars>` component. Not a star catalogue. A real one, such as NASA SVS "Deep Star Maps", could replace it later.
- **Hover glow** around worlds: an interface highlight, not an atmosphere.
- **Sizes on the Select screen**: not to scale (the screen says so).
- **Spin**: slow decorative rotation in the real direction (west to east), not at the real speed.
