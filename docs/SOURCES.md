# Sources

Every dataset, texture and value used in the app, with where it came from and when.
Required by rule 8 in `CLAUDE.md`. **Update this file whenever you add or change data.**

All items below were accessed on **14 November 2026**.

> **The Moon was removed from the app on 15 November 2026** (team decision). Its textures, elevation grid, featured sites, photos and tile layer were deleted, and their rows removed from this file. They remain in the Git history.
Textures were downloaded and processed with `scripts/fetch_textures.py`, so the steps can be repeated exactly.

## Textures (`public/textures/`)

| File | Size | Source | Dataset / original file | What we changed | Caveats |
|---|---|---|---|---|---|
| `earth/earth_color.jpg` | 4096×2048 | [NASA Earth Observatory — Blue Marble: Next Generation with Topography and Bathymetry](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/) | July 2004 composite, `world.topo.bathy.200407.3x5400x2700.jpg` | Resized from 5400×2700 | Cloud-free monthly composite; relief shading is part of the image. |
| `mars/mars_color.jpg` | 4096×2048 | [NASA Solar System Treks — Mars Trek tile service](https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml) | Layer `Mars_Viking_MDIM21_ClrMosaic_global_232m` (Viking MDIM 2.1 colorized global mosaic), zoom level 3 (16×8 tiles of 256 px) | Tiles joined into one image; JPEG | Colorized mosaic: **colours are approximate, not true colour**. The tile service does not state a date. **To do:** find and cite the original USGS Astrogeology product page for this mosaic. |
| `mars/mars_elevation.jpg` | 2048×1024 | [NASA Solar System Treks — Mars Trek tile service](https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m_8/1.0.0/WMTSCapabilities.xml) | Layer `Mars_MGS_MOLA_DEM_mosaic_global_463m_8` (MGS MOLA elevation, 8-bit), zoom level 2 (8×4 tiles) | Tiles joined; contrast-stretched to 8-bit | Visual bump map only, as above. The tile service does not state a date. |

All textures are equirectangular (2:1) maps centred on 0° longitude, which lines up with the sphere in the app.

## Values in the info panel (`src/data/worlds.ts`)

Copied exactly from the NASA NSSDCA Planetary Fact Sheets (author/curator D. R. Williams, NASA Goddard):

| World | Source | Source last updated |
|---|---|---|
| Mars | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html> | 19 May 2025 |
| Earth | <https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html> | 15 November 2024 |

Notes on how fact-sheet entries map to the panel:

- **Mean radius**: "Volumetric mean radius".
- **Mars and Earth, mean distance from the Sun**: "Semimajor axis" in 10⁶ km.

**World Overview sidebars (from 15 November 2026)** no longer list day length, radius, distance or gravity. See *World Overview: analog-science data* below. The team's three text sections moved to the landing page's **About the project** pop-up (`src/data/about.ts`).


## Explore screen (Milestone 2)

All accessed **14 November 2026**.

### Elevation grids (`public/data/elevation/`)

Made with `scripts/prepare_elevation.py`. Each is 1440×720 little-endian Int16 files in metres, at 4 cells per degree. Each cell is the mean of the source pixels inside it. The app shows the value of the cell containing the chosen point, without interpolation.

| File | Source | Original file | Notes |
|---|---|---|---|
| `mars_elevation_4ppd.bin` | [USGS Astrogeology: Mars MGS MOLA DEM mosaic, global, 463 m](https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif) | `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif` (46080×23040, signed 16-bit, no-data −32768) | Cell size about 14.8 km. Range after averaging: −8,046 m to +21,123 m. **The file does not state its vertical reference surface.** The range matches MOLA heights above the Mars areoid, but this has not been checked against USGS documentation, and the app says so. **To do:** find the USGS product page and confirm. |

**Regional slope** is **Estimated**. We calculate it from the height differences between neighbouring grid cells (central differences), so it averages over about two cells (15–30 km). Real local slopes can be much steeper.

### Featured sites (`src/data/featuredSites.ts`)

| Site | Coordinates (°N, °E) | Source | Label |
|---|---|---|---|
| Jezero, Gale, Olympus Mons, Valles Marineris, Hellas Planitia (Mars) | Centre latitude/longitude, plus diameter. The Gazetteer gives planetocentric 0–360° E, converted to −180…+180 | Gazetteer (feature IDs 14300, 2071, 4453, 6288, 2432) | Measured |
| Meteor Crater, Haughton crater (Earth) | 35.03, −111.02 and 75.38, −89.67 | **Compiled from Wikipedia and ESA image captions.** The Earth Impact Database (passc.net), the usual authority, did not respond. | **Estimated, team to confirm** |

The Meteor Crater description (about 1.2 km across, roughly 50,000 years old) comes from [NASA Science: Meteor Crater, Arizona, USA](https://science.nasa.gov/resource/meteor-crater-arizona-usa/). The other descriptions are short, general context, such as which rover landed where.

**Click coordinates** are **Estimated**. Precision is about one pixel of the 4096-wide map: roughly 5.2 km on Mars and 9.8 km on Earth.

### Close-up imagery (streamed from NASA when zoomed in)

| World | Service and layer | Notes |
|---|---|---|
| Mars | [NASA Mars Trek WMTS](https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml): `Mars_Viking_MDIM21_ClrMosaic_global_232m`, levels up to 7 | Colorized; colours approximate |
| Earth | [NASA GIBS WMTS (EPSG:4326)](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml): `BlueMarble_ShadedRelief_Bathymetry`, 500m tile set, levels up to 7 | Cloud-free composite |

Tiles are downloaded by each visitor's browser directly from NASA (no API key needed), and the app shows a credit while they're on screen. If NASA's servers are unreachable, the normal globe texture stays visible.

### NASA photos for featured sites (`src/data/sitePhotos.ts`)

One photo per featured site, chosen by hand from the [NASA Image and Video Library](https://images.nasa.gov) (search API `images-api.nasa.gov`) on **14 November 2026**. Each image loads from `images-assets.nasa.gov`, and the app links back to its NASA page. Captions, dates, centres and credits are copied from NASA's records. Where NASA lists no individual credit, the app shows "NASA".

| Site | NASA ID | NASA title / caption | Date | Credit |
|---|---|---|---|---|
| Jezero | PIA23239 | Jezero Crater, Mars 2020's Landing Site | 2019-05-15 | NASA/JPL-Caltech/MSSS/JHU-APL |
| Gale | PIA15292 | Mount Sharp Inside Gale Crater, Mars | 2012-03-28 | NASA/JPL-Caltech/ESA/DLR/FU Berlin/MSSS |
| Olympus Mons | PIA00300 | Olympus Mons | 1998-06-04 | NASA/JPL/USGS |
| Valles Marineris | PIA00422 | Valles Marineris | 1998-06-08 | NASA/JPL/USGS |
| Hellas Planitia | PIA00406 | Hellas Mosaic | 1998-06-08 | NASA/JPL/USGS |
| Meteor Crater | iss074e0208832 | Meteor Crater in Arizona | 2026-01-26 | NASA |
| Haughton crater | ARC-2007-ACD09-0255-001 | K-10 Red driving near 'The Fortress' formation at Haughton Crater, Devon Island, Canada. (first sentence of NASA's description; the title is only the ID) | 2007-07-15 | NASA/Lorenzo Fluckiger (from NASA's description) |

- NASA's own descriptions are **not** shown in the app, because some quote figures that differ slightly from our cited values.
- The Jezero image uses false colour from orbital mineral data, as explained on its NASA page.

### Analogue pairs, new sites and geological layers (added 15 November 2026)

**Earth ⇄ Mars pairs** (`src/data/analogues.ts`). Every similarity and difference is quoted or closely paraphrased from NASA:

| Earth site | Mars site | NASA source |
|---|---|---|
| Lake Salda, Turkey | Jezero | [Planetary Analog Explorer: "Looking for Life: Turkey and Mars"](https://science.nasa.gov/solar-system/analog-explorer/) |
| Atacama Desert, Chile | Jezero (Perseverance) | Analog Explorer: "Looking for Life: the Atacama Desert and Mars" |
| Verde Valley, Arizona | Gale (Curiosity at Mount Sharp) | Analog Explorer: "Looking for Life: Arizona and Mars" |
| Death Valley, California | Utopia Planitia (Viking 2) | Analog Explorer: "Rocky Reconnaissance: California and Mars" |
| Pilot Valley, Utah | Phoenix landing site (northern plains) | Analog Explorer: "Looking for Life: Utah and Mars" |
| Haughton crater, Canada | Mars in general | [10 Things to Know About Planetary Analogs](https://science.nasa.gov/solar-system/planetary-analogs/10-things-to-know-about-planetary-analogs/) |
| Holuhraun, Iceland | Mars in general ("geologic cousins") | Analog Explorer: "Flood Basalts on Mars & in Iceland" |

NASA calls these *analogs*: places with things in common, not equivalents. The app never shows a similarity percentage, because we have no measured per-dimension Earth data to calculate one (CLAUDE.md rule 4).

**New Mars sites:**

- **Utopia Planitia:** IAU/USGS Gazetteer feature 6260 (46.74° N, 117.52° E, diameter 3,560.45 km, record updated 21 June 2012).
- **Phoenix landing site:** nominal 68.15° N, 125.9° W, from the [NASA NSSDCA Phoenix record](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A), which also says the site is "about 3.5 km below the planetary reference". Our MOLA grid cell there reads −4,141 m. The 640 m gap may come from the 15 km cell average and/or different reference surfaces. **To do:** the team should look into this.

**New Earth sites** (coordinates **Estimated**, compiled from public reference pages, team to confirm):

| Site | Coordinates |
|---|---|
| Lake Salda | 37.55, 29.68 (BirdLife / Key Biodiversity Areas factsheet) |
| Verde Valley | 34.75, −112.02 (Wikipedia) |
| Death Valley | 36.24, −116.83 (Wikipedia, national park point) |
| Atacama (Yungay) | −24.08, −69.99 (McKay et al. 2003, *Astrobiology*, as read via search; digits partly garbled, so approximate) |
| Pilot Valley | 41.0, −113.9 (Wikipedia) |
| Holuhraun | 64.85, −16.83 (Wikipedia) |

**Geological layers** (`src/data/geoLayers.ts`): impact structures, aeolian processes, sediments & mineralogy, and terrain/glaciers/rivers. Each site is assigned by the team from its cited descriptions. For example, Hellas is in "aeolian" because NASA Image Library titles include "Hellas Dunes" and "Dunes in Hellas". The filter shows or hides sites; it is **not** a geological map overlay.

### Compare view and new site photos (added 15 November 2026)

**What the Compare view shows:**

- The two sites side by side: NASA photos, coordinates, official diameter, and Mars elevation and slope. Earth elevation shows as a Placeholder, because no Earth elevation dataset has been added.
- The pair's NASA-cited similarities and differences.
- **What Earth cannot reproduce:** surface gravity (Mars 3.73 vs Earth 9.820 m/s²; NSSDCA Mars/Earth ratio 0.380), surface pressure (6.36 vs 1014 mbar, drawn on a log scale) and average temperature (~214 K vs 288 K). All values come from the NSSDCA fact sheets. Radiation shielding is shown with the NASA quotes listed under Space weather.

**New photos** (NASA Image and Video Library, 15 November 2026):

| Site | NASA ID | Title | Date | Credit |
|---|---|---|---|---|
| Utopia Planitia | PIA04023 | Viking Lander 2 Anniversary | 2002-12-13 | NASA/JPL/Arizona State University |
| Phoenix landing site | PIA10701 | Color Image of Phoenix Lander on Mars Surface | 2008-05-27 | NASA/JPL-Caltech/University of Arizona |
| Lake Salda | PIA24375 | Lake Salda Beach | 2021-01-27 | NASA/JPL-Caltech |
| Death Valley | PIA23265 | NASA's Mars 2020 Mission Drops in on Death Valley | 2019-05-24 | NASA/JPL-Caltech |
| Holuhraun | jsc2024e055198 | Artemis II Crew geology training in Iceland - jsc2024e055198 | 2024-08-01 | Robert Markowitz, NASA-JSC |

- The Lake Salda photo caption is also quoted as a similarity. NASA's caption says "Jezero Carter", which we show as "Jezero [Crater]".
- Verde Valley, Atacama and Pilot Valley have no matching image in the library.

### Use cases page (`src/data/useCases.ts`, added 15 November 2026)

This page lists **documented NASA uses** of the featured places. It is not a ranking: the app does not rate which site is "best".

Each entry is quoted or closely paraphrased from its source:

- NASA Image and Video Library records: PIA23239 (Jezero), PIA15292 (Gale), PIA04023 (Viking 2 / Utopia), PIA23265 (Death Valley Lander Vision System test), ARC-2007-ACD09-0255-001 (K-10 Red rover at Haughton) and jsc2024e055198 (Artemis II geology training in Iceland)
- The NSSDCA Phoenix record
- The NASA Planetary Analog Explorer
- NASA's "10 Things to Know About Planetary Analogs"

### Deeper zoom: sharper close-up sources (added 15 November 2026)

When you zoom in past what the first layer can show, Explore switches to a sharper one. The on-screen credit always names the source in use.

| World | Source | Detail we use | Notes |
|---|---|---|---|
| Mars | **MRO Context Camera (CTX) global mosaic, beta**. NASA Mars Trek layer `CTX_beta01_uncontrolled_5m_Caltech` ("CTX Global BETA Uncontrolled 5m Caltech"), [capabilities](https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/WMTSCapabilities.xml) | Levels up to 10, about 20 m per pixel | Tiles are served by Esri's `astro.arcgis.com` (the URL given in NASA Trek's capabilities file), not by NASA. Greyscale. "Beta" and "uncontrolled" mean positions may be slightly offset. Level-11 tiles came back only partly drawn when tested, so we stop at level 10. **To do:** find the mosaic's own publication or credit page and cite it. |
| Earth | **Landsat WELD true colour, global annual composite (v3.1)**. NASA GIBS layer `Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual`, time 2000-12-01, 31.25m tile set ([capabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml)) | Levels up to 11, about 30 m per pixel | The layer only offers 1983–85, 1988–90 and 1998–2000; we use 2000. It covers land only: its pure-black "no data" pixels (oceans, lakes) are made transparent in the browser, so the Blue Marble image shows through. Very dark real pixels (values ≤ 4 out of 255) are treated the same way. |

The closest zoom is now about 0.3% of the radius above the surface: roughly 10 km on Mars and 19 km on Earth.

### World Overview: analog-science data (`src/data/analogOverview.ts`, added 15 November 2026)

**Conditions** (each with a Measured or Estimated label in the app):

- **Mars**, from the [NSSDCA Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) (last updated 19 May 2025):
  - atmosphere 95.1% CO₂, 2.59% N₂, 1.94% Ar, 0.16% O₂
  - water vapour 210 ppm
  - pressure 6.36 mbar (4.0–8.7)
  - daily temperature range 184–242 K (Viking 1 Lander site)
  - winds 2–7 / 5–10 / 17–30 m/s (Viking Lander sites)
  - topographic range 30 km
- **Mars, other sources:**
  - **No global magnetic field:** [NASA MAVEN auroras article](https://science.nasa.gov/missions/maven/nasas-maven-illuminates-new-understanding-of-auroras-at-mars/).
  - **Near-surface water ice "believed to consist of 50% water ice by volume"** in mapped areas, from the [Mars Odyssey instruments page](https://science.nasa.gov/mission/odyssey/science-instruments/). Labelled **Estimated**, because NASA says "believed".
- **Earth**, from the [NSSDCA Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) (last updated 15 November 2024):
  - dry air 78.08% N₂, 20.95% O₂, Ar 9,340 ppm, CO₂ 420 ppm
  - water about 1%, highly variable
  - pressure 1014 mbar
  - daily range 283–293 K
  - winds 0–100 m/s
  - topographic range 20.4 km
  - surface magnetic field 0.24–0.66 gauss
- The "about 160 times" pressure ratio is our calculation (1014 ÷ 6.36).

**Datasets list:** CRISM ([NASA resource page, 19 June 2006](https://science.nasa.gov/resource/spectrometer-for-mars-reconnaissance-orbiter/)), Mars Odyssey GRS and THEMIS (instruments page above), Curiosity SAM ([largest organic molecules article](https://science.nasa.gov/missions/mars-science-laboratory/nasas-curiosity-rover-detects-largest-organic-molecules-found-on-mars/)), Perseverance SHERLOC (["Bright Angel" photojournal](https://science.nasa.gov/photojournal/perseverances-sherloc-finds-organic-molecules-in-bright-angel/)), MOLA (USGS), Landsat WELD, SRTM/ASTER GDEM and Blue Marble (GIBS capabilities), and the Planetary Analog Explorer.

**Marked "Debated"** (rule 6):

- **SAM organics:** NASA says "there's no way to confirm the source".
- **SHERLOC organics:** NASA says they "can be created by both geological as well as biological sources".

All pages were accessed 15 November 2026.

## Weather assistant and weather comparison (Explore, added 15 November 2026)

The assistant only repeats and summarises values downloaded from these NASA sources. It is rule-based (no AI language model), so it cannot make up numbers; when a feed has no value, it says so.

| World | Source | What is used | Label in the app |
|---|---|---|---|
| Earth | [NASA POWER Daily API](https://power.larc.nasa.gov/docs/services/api/temporal/daily/) (`power.larc.nasa.gov/api/temporal/daily/point`, community RE). Called live from the visitor's browser when they press **Analyze**. | `T2M`, `T2M_MAX`, `T2M_MIN` (air temperature at 2 m, °C), `PS` (surface pressure, kPa, shown ×10 as mbar), `WS2M` (wind at 2 m, m/s), `RH2M` (relative humidity, %), `PRECTOTCORR` (precipitation, mm/day), `ALLSKY_SFC_SW_DWN` (all-sky sunlight at the surface, kWh/m²/day). Daily values from 1 January 1981 to about 3 days ago; missing values (`-999`) are shown as “no value”. | **Estimated**: POWER's weather values come from NASA's MERRA-2 reanalysis (observations combined with a weather model) on a grid of about 0.5° × 0.625°, so they describe the grid cell around the pin, not a weather station at it. |
| Mars | [NASA Mars weather feed](https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json) on mars.nasa.gov: daily summaries from the Curiosity rover's REMS instrument, provided by Centro de Astrobiología (CAB). A copy is saved to `public/data/weather/msl_rems.json` by `scripts/fetch_rems.mjs` (run by the deploy workflow on every push and daily); values are not changed, only unused fields are dropped. First copy saved 15 November 2026: 4,745 sols, 7 August 2012 to 25 August 2026. | `min_temp`, `max_temp` (air, °C), `pressure` (Pa, shown ÷100 as mbar), `min_gts_temp`, `max_gts_temp` (ground, °C), `atmo_opacity`, `local_uv_irradiance_index`, `season`, `ls`, `sunrise`, `sunset`. Wind and humidity fields exist but are always blank (`--`), so the app says “no data in this NASA feed”. | **Measured** (named feed, sol and date). The feed's own disclaimer is shown with every Mars result: the data are for outreach, measured at the rover (which can influence them), and some days are missing; scientific REMS data are in NASA's Planetary Data System. |

**Mars pins away from Gale crater.** Curiosity is the only Mars station with a daily NASA feed used here, so any Mars pin gets Gale crater's weather. The app always says this, with the distance from the pin to Gale crater's centre (−5.37°, 137.81° E, IAU/USGS Gazetteer of Planetary Nomenclature). The distance is labelled **Estimated**: great-circle distance on a sphere of Mars's mean radius, 3,389.5 km (NASA NSSDCA Mars fact sheet).

**Right now on Mars (added 15 November 2026).**
- **Source:** [NASA Goddard PSG Mars Explorer](https://psg.gsfc.nasa.gov/apps/mars/). Visitors' browsers call it when they open Explore on Mars (the site allows this: `Access-Control-Allow-Origin: *`).
- **What it fetches:** global grids from `index.php?param=Tair|Tsurf|Psurf|Wind|Dust|Vapor` for the current time, at 60 × 36 points (6° of longitude × about 5° of latitude). The app's page supplies the model name (for example "EMARS MY32 Moderate dust", the past Mars year most similar to now) and the Mars date.
- **Wind:** sent as east–west (`data`) and north–south (`vector`) parts. The speed is √(east² + north²), as in the app's own script.
- **At a pin:** the app sends PSG the same request its own page sends for a location and the current time, and reads the numbers from the reply (`parsePsgPage` in `src/lib/weather/marsNow.ts`). They match PSG's website exactly (checked at Gale, 15 Nov 2026 21:21 UT: −37 °C, ground −55 °C, 6.183 mbar, 12 km/h, dust 0.272, ice 0.175, 6.7 pr-µm). If that request fails, the card falls back to values interpolated from the coarse grid and says they are approximate. The grids are still used for the whole-planet colour layer.
- **Label:** **Estimated**. These are model values, not measurements. No live, measured weather exists for all of Mars: InSight's api.nasa.gov feed ends in October 2020, Curiosity's newest sol is 25 August 2026, and the MEDA feed is blank.
- **Caveat:** the app says it "should be only used for testing purposes", and the site says so.

**Not used:** the Perseverance MEDA feed on mars.nasa.gov (almost empty when checked on 15 November 2026) and api.nasa.gov InSight weather (only seven sols from October 2020).

**Weather similarity percentage** (`src/lib/weather/compare.ts`). Labelled **Estimated**; calculated by this app, not a NASA product. It uses the days with data within ±3 days of each chosen date:

| Dimension | Score |
|---|---|
| Average daily low, average daily high, average day–night swing | 100% if equal, falling in a straight line to 0% at a 40 °C difference |
| Day-to-day variability: standard deviation of the daily midpoint, (low + high) ÷ 2 | 100% if equal, 0% at a 10 °C difference |
| Average surface air pressure | lower pressure ÷ higher pressure |

The overall percentage is the plain average of the dimensions that have data. Every dimension's values and score are shown with it (CLAUDE.md rule 4), along with what is not compared (wind, humidity and precipitation, which have no Mars values) and what Earth cannot reproduce (gravity, thin atmosphere, radiation). The 40 °C and 10 °C ranges are the team's choice for a readable scale, not a scientific standard.

## Map views and place labels (Overview and Explore, added 15 November 2026)

### Place labels (`src/data/mapLabels.ts`)

| World | Source | Notes | Label |
|---|---|---|---|
| Mars | [IAU/USGS Gazetteer of Planetary Nomenclature](https://planetarynames.wr.usgs.gov/), Mars feature centre points (`MARS_nomenclature_center_pts.zip`, metadata title "Planetary Nomenclature of Mars", downloaded 15 November 2026) | 27 features. Names and centre coordinates copied exactly; longitudes converted from 0–360° E to −180–180°. The Gazetteer is maintained by the USGS Astrogeology Science Center with NASA support for the IAU, and is the naming source used by NASA's planetary maps. The short "kind" (Volcano, Plain…) is our plain-language reading of the IAU feature type (Mons, Planitia…). | Map labels for orientation |
| Earth | **Not a NASA dataset.** 29 very large cities, with approximate city-centre coordinates (rounded to 0.01°) entered by the team. | We did not find a NASA city-location dataset we could download here (NASA SEDAC's settlement points need an Earthdata login). Shown with an **Estimated** label saying the positions are approximate. **To do:** confirm, or replace with NASA SEDAC GRUMP settlement points. | Estimated |

### 2D map

The flat map uses the same NASA colour maps as the globes (`public/textures/`, see above), plus the **NASA-hosted** close-up tile sources from the Explore screen: Mars Trek Viking MDIM 2.1 (Mars, about 330 m per pixel at most) and GIBS Blue Marble and Landsat WELD (Earth, about 30 m per pixel at most). The Esri-served CTX layer is **not** used in 2D, because the team asked for NASA-only sources there, so the closest Mars zoom is less sharp in 2D than on the globe.

### Topography view (raised relief)

The surface is raised and lowered using these height grids (2880×1440 cells, 8 per degree, gzip-compressed, made by `scripts/prepare_elevation.py`). The sharp close-up imagery from the Explore screen is draped over the raised terrain. Heights are multiplied by a vertical exaggeration (Mars ×20 and Earth ×50 to start; the slider goes ×1–×100), always shown on screen.

| World | File | Source | Notes | Label |
|---|---|---|---|---|
| Mars | `public/data/elevation/mars_topography_8ppd.bin.gz` | Same MOLA source as the Explore elevation values (see *Elevation grids* above), averaged to 8 cells per degree (about 7.4 km). MOLA is an instrument on NASA's Mars Global Surveyor; the mosaic file is published by USGS Astrogeology. | Range −8,144 to +21,157 m. | Measured |
| Earth | `public/data/elevation/earth_topography_8ppd.bin.gz` (and `earth_elevation_4ppd.bin`, 4 per degree, not used by the app yet) | [NASA Earth Observatory — Blue Marble: Next Generation, Topography and Bathymetry Maps](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/), file `gebco_08_rev_elev_21600x10800.tif` (8-bit greyscale; server "last modified" 19 December 2025; imagery by Jesse Allen, NASA Earth Observatory, using GEBCO data). | NASA's page says "Data in these images were scaled 0-6400 meters", so grey value *g* is converted to *g* ÷ 255 × 6400 m (assumed linear), then averaged to 0.125° cells (area-weighted box filter). Range 0 to 6,239 m (each cell averages about 14 km, so peaks are lower than the real summits). Oceans and land below sea level are flat at 0 m. Used only for the Topography view, not as Explore values. | Estimated |

## Compare view: Gale Crater research (`src/data/siteResearch.ts`, added 15 November 2026)

In the Compare view, Gale's column (left) shows the team's research in six sections in place of the standard photo and facts. The text is the team's, edited for clarity and checked against each source. Citations [1]–[7] are clickable in the app.

| # | Source | Checked |
|---|---|---|
| 1 | [NASA Science — Mineral Content Comparison at Two Gale Crater Sites](https://science.nasa.gov/resource/mineral-content-comparison-at-two-gale-crater-sites/) (13 Dec 2016, credit NASA/JPL-Caltech) | Yes. Wording corrected: the drill collects the samples and CheMin analyses them. The hematite detail was added from the caption. |
| 2 | [NASA Science — A Guide to Gale Crater](https://science.nasa.gov/resource/a-guide-to-gale-crater/) (2 Aug 2017, video transcript) | Yes |
| 3 | [Smithsonian NASM — 10 Years of Curiosity on Mars](https://airandspace.si.edu/stories/editorial/10-years-curiosity-mars) | Yes. "From hospitable to uninhabitable" was reworded to the article's "wetter, potentially habitable conditions … as conditions became drier". |
| 4 | [NASA Science — Gale Crater's Surface Materials](https://science.nasa.gov/resource/gale-craters-surface-materials/) (19 Jun 2015) | Yes. The diameter, 96 miles (154 km), is stated there. "Mars is typically grayish-green" is clarified as describing this false-colour image. |
| 5 | [ADS record 2013IJAsB..12...25W](https://ui.adsabs.harvard.edu/abs/2013IJAsB..12...25W/abstract) (International Journal of Astrobiology, vol. 12, p. 25, 2013) | **No.** ADS refused automated requests (HTTP 405). The link is kept as the team gave it. Every sentence it supports is also supported by [2]. **To do:** a teammate should confirm it. |
| 6 | [NASA JPL — Topography of Gale Crater, PIA15093](https://www.jpl.nasa.gov/images/pia15093-topography-of-gale-crater/) (21 Nov 2011, credit NASA/JPL-Caltech) | Yes. The caption matches word for word. |
| 7 | [NASA Goddard PSG — Mars Explorer](https://psg.gsfc.nasa.gov/apps/mars/) | **Temperature/Weather** is live: when the view opens, the browser asks PSG for Gale (5.37° S, 137.81° E) at the current time, the same request PSG's page makes (`SiteLiveWeather`, `fetchPsgLocal`), with a Refresh button. By team decision the website shows **only live values**, not PSG's daily minima and maxima. Daily values read earlier for six 2026 dates are kept in [`docs/gale-weather-2026.md`](gale-weather-2026.md), not shown on the site. All values are **Estimated** (model, not rover measurements). PSG builds them from the most similar past Mars year (Mars Year 32). The app says it "should be only used for testing purposes", and the website says so too. |

**Images** (`public/images/gale/`), downloaded 15 November 2026, resized for the web (no other changes):

| File | Source | Credit |
|---|---|---|
| `mineral-comparison-pia21149.jpg` | [NASA Science page](https://science.nasa.gov/resource/mineral-content-comparison-at-two-gale-crater-sites/) (original 570×538) | NASA/JPL-Caltech |
| `gale-terrain-themis-pia14290.jpg` | [Gale Crater: Future Home of Mars Rover Curiosity](https://science.nasa.gov/resource/gale-crater-future-home-of-mars-rover-curiosity/) (original 2200×1700, resized to 1200 wide) | NASA/JPL-Caltech/ASU |
| `gale-surface-materials-pia19674.jpg` | [Original image](https://assets.science.nasa.gov/content/dam/science/psd/mars/downloadable_items/3/8/38715_Mars-Odyssey-THEMIS-Gale-Crater-Minerals-pia19674.jpg) (2965×3706, resized to 900 wide) | NASA/JPL-Caltech/Arizona State University |
| `gale-topography-pia15093.jpg` | File from the [NASA Image and Video Library, PIA15093](https://images.nasa.gov/details/PIA15093) (788×720), the same image as on the [JPL page](https://www.jpl.nasa.gov/images/pia15093-topography-of-gale-crater/), which the app links to | NASA/JPL-Caltech |

The team's mineral-image link was a Google redirect (`google.com/url?q=…`). The app links directly to its destination, the NASA page in source 1.

## Space weather (World Overview, `src/data/donki.json`)

- **Data:** NASA **DONKI** (Space Weather Database Of Notifications, Knowledge, Information), run by NASA's Community Coordinated Modeling Center.
- **Event types:** solar flares (FLR), coronal mass ejections (CME), solar energetic particle events (SEP) and geomagnetic storms (GST), for the last 30 days.
- **How it's fetched:** `scripts/fetch_donki.mjs` tries the CCMC web service (`kauai.ccmc.gsfc.nasa.gov`) first, then `api.nasa.gov/DONKI`. The deploy workflow runs it on every push and once a day, so visitors never call the API.
- **What's saved:** the file records the date range, the fetch time and which service supplied each type. The app shows these in each row's source line.
- **Counts** are labelled **Measured**: they're the number of events DONKI catalogued in the window. The "fastest CME" speed is DONKI's "most accurate" analysis for that event.
- **First snapshot** (fetched 14 November 2026 for 15 October to 14 November 2026): 89 CMEs, 0 SEP events, 1 geomagnetic storm (max Kp 6). Solar flares were **unavailable**, because api.nasa.gov's FLR endpoint returned 404 for every date range and the CCMC service could not be reached. The app shows flares as a Placeholder until a later fetch succeeds.
- **Limitation:** DONKI records activity at the Sun and near Earth. It doesn't say which events reached Mars, and the app says so.

**Radiation context quotes** (shown with the space weather section):

| World | Quote | Source |
|---|---|---|
| Mars | "Mars does not have a global magnetic field like Earth." | [NASA Science: NASA's MAVEN Illuminates New Understanding of Auroras at Mars](https://science.nasa.gov/missions/maven/nasas-maven-illuminates-new-understanding-of-auroras-at-mars/) |
| Earth | "This global magnetic field helps to shield us from the harsh conditions of space. Without it, much more radiation would reach Earth's surface." | [NASA Science: Solar Wind on the Moon](https://science.nasa.gov/moon/solar-wind/) |

Each quote is followed by a related figure from the NASA NSSDCA fact sheets:

- **Mars:** surface pressure, 6.36 mbar
- **Earth:** surface magnetic field, 0.24–0.66 gauss, and surface pressure, 1014 mbar

Pages accessed 14 November 2026. Their publication dates were not checked.

## Decorative elements (not data)

- **Starfield**: random points from drei's `<Stars>` component. Not a star catalogue. A real one, such as NASA SVS "Deep Star Maps", could replace it later.
- **Hover glow** around worlds: an interface highlight, not an atmosphere.
- **Sizes on the Select screen**: not to scale (the screen says so).
- **Spin**: slow decorative rotation in the real direction (west to east), not at the real speed.
