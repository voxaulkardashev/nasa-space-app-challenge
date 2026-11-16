# Sources

> **Disclaimer (shown in the app):** Planetary Analogue Explorer is a student project for the NASA Space Apps Challenge and is not affiliated with, sponsored by or endorsed by NASA, JPL or Caltech. NASA and JPL images are used with their credit lines under the [JPL Image Use Policy](https://www.jpl.nasa.gov/jpl-image-use-policy/) ("may be used for any purpose without prior permission"; a credit line is required; endorsement must not be implied; no NASA logos). Partner-owned images (credits naming ASU, MSSS, ESA/DLR, FU Berlin, LANL/CNES/IRAP and others) are for educational, non-commercial use.

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
| Badwater Basin, California | Gale | **Chosen by the team (16 Nov 2026), not a NASA-documented pair.** Replaced the earlier NASA pair for Gale at the team's request. See "Compare view: Badwater Basin" below. |
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
| Badwater Basin | 36.23, −116.77 (Estimated; see "Compare view: Badwater Basin") |
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
- Atacama and Pilot Valley have no matching image in the library. Badwater Basin uses PIA26197 ("Badwater, Death Valley", 14 Dec 2023, credit NASA/METI/AIST/Japan Space Systems, and U.S./Japan ASTER Science Team).

### Use cases page (removed 15 November 2026)

> **Removed at the team's request (15 November 2026):** the Use cases button, its pop-up and `src/data/useCases.ts` were deleted. The rest of this section is kept for the record.

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
| Mars | **MRO Context Camera (CTX) global mosaic, beta**. NASA Mars Trek layer `CTX_beta01_uncontrolled_5m_Caltech` ("CTX Global BETA Uncontrolled 5m Caltech"), [capabilities](https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/WMTSCapabilities.xml) | Levels up to 10, about 20 m per pixel | Tiles are served by Esri's `astro.arcgis.com` (the URL given in NASA Trek's capabilities file), not by NASA. Greyscale. "Beta" and "uncontrolled" mean positions may be slightly offset. Level-11 tiles came back only partly drawn when tested, so we stop at level 10. **Terms (checked 16 November 2026):** the Esri service's own description says: "The Murray Lab/Caltech grants free use of the beta01 version of the mosaic for all purposes. Data credit should be to: NASA/JPL/MSSS/The Murray Lab." Its attribution text is "Source: NASA/JPL/MSSS/Caltech Murray Lab/Esri". The app's credit line shows this. The mosaic is described in Dickson, Ehlmann, Kerber & Fassett (2024), *Earth and Space Science*, and on the [Murray Lab page](https://murray-lab.caltech.edu/CTX/). NASA Trek's own capabilities file uses this Esri address; NASA does not host a copy. **Not confirmed:** Esri's own terms for this public service (Esri's general terms cover its basemaps; no page specific to this service was found). |
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

## Compare view: Jezero crater research (`src/data/jezeroResearch.ts`, added 15 November 2026)

In the Compare view, Jezero's column (left) shows the team's research in six sections in place of the standard photo and facts. It uses the same component as Gale (`SiteResearchColumn`). Every claim was checked against its source on 15 November 2026. Papers whose publisher pages refused automated access were checked through their official abstracts on Crossref (`api.crossref.org`).

| # | Source | Used for |
|---|---|---|
| 1 | Bykov et al. (2026), "In Situ Detection of Opal-A in Jezero Crater, Mars", JGR Planets, [10.1029/2025JE009375](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE009375) | Opal-A detected by SHERLOC and PIXL in the "Bills Bay" patch |
| 2 | McNeil et al. (2025), "Hydrated Silica in Oxia Planum, Mars", JGR Planets, [10.1029/2025JE008989](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2025JE008989) | Opal's formula SiO₂·nH₂O and why opal matters for habitability. **This paper is about Oxia Planum, not Jezero**, so it is cited only for these general facts. |
| 3 | [NASA JPL, "NASA's Perseverance Rover Deciphers Ancient History of Martian Lake"](https://www.jpl.nasa.gov/news/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/) (12 Dec 2023) | The lake (35 km wide, 30 m deep at most); stages of water; silica preserving organics; organics forming geologically or biologically; no fossil-like structures or microbial chemical changes seen yet |
| 4 | [NASA JPL, "NASA's Perseverance Makes New Discoveries in Mars' Jezero Crater"](https://www.jpl.nasa.gov/news/nasas-perseverance-makes-new-discoveries-in-mars-jezero-crater/) (25 Aug 2022) | Crater floor made of two types of igneous rock; olivine grains 1–3 mm from slowly cooling magma |
| 5 | Farley et al. (2022), Science, [10.1126/science.abo2196](https://doi.org/10.1126/science.abo2196) | "The lowest exposed unit … Séítah … olivine-rich … accumulated at the base of a magma body" |
| 6 | Liu et al. (2022), Science, [10.1126/science.abo2756](https://doi.org/10.1126/science.abo2756) | Coarse-grained olivine "similar to some martian meteorites"; olivine cumulate |
| 7 | [NASA Photojournal, "Perseverance Views 'Pico Turquino Hills'" (PIA26473)](https://science.nasa.gov/photojournal/perseverance-views-pico-turquino-hills/) | Rim rocks mostly olivine, plagioclase and pyroxene |
| 8 | [Goudge et al. (2017), LPSC XLVIII abstract 1195](https://www.hou.usra.edu/meetings/lpsc2017/pdf/1195.pdf) | Open-basin lake; delta deposit at the western inlet valley |
| 9 | [IAU/USGS Gazetteer, Jezero (feature 14300)](https://planetarynames.wr.usgs.gov/Feature/14300) | Crater diameter 47.52 km |
| 10 | [NASA, "Perseverance's First 2 Regolith Samples" (PIA25589)](https://science.nasa.gov/resource/perseverances-first-2-regolith-samples/) | Regolith samples from a mega-ripple (2 and 6 Dec 2022); why regolith is studied |
| 11 | Bell et al. (2022), Science Advances, [10.1126/sciadv.abo4856](https://doi.org/10.1126/sciadv.abo4856) | Pyroxene dominates fine regolith; olivine dominates coarse regolith |
| 12 | Murphy et al. (2026), Science Advances, [10.1126/sciadv.adx0047](https://www.science.org/doi/10.1126/sciadv.adx0047?referrer=https%3A%2F%2Fwww.google.com%2F) | Complex organic carbon in mudstones in an ancient river valley in Jezero; Raman cannot tell whether it comes from abiotic or biotic sources |
| 13 | [NASA Goddard PSG Mars Explorer](https://psg.gsfc.nasa.gov/apps/mars/) | Temperature/Weather. Same method as Gale: PSG's reading for 18.41° N, 77.69° E at the current time, loaded live. Labelled as **a prediction based on past data** (EMARS, most similar Mars year = MY32), not live measurements, with the same disclaimers. **Estimated.** |
| 14 | [NASA Photojournal, "Jezero Crater Elevation Graph" (PIA26476)](https://science.nasa.gov/photojournal/jezero-crater-elevation-graph/) | The graph and its caption. Jezero is about 2,600 m below datum (Measured). Region elevations and the ~590 m climb were read off the graph by eye (Estimated). |

**Other credits** (listed at the bottom of the column, exactly as the team gave them): the two JGR Planets papers, the Science Advances paper (with its original `?referrer=` link) and the JPL lake article.

**Images** (`public/images/jezero/`), from the NASA Image and Video Library (`images-assets.nasa.gov`), downloaded 15 November 2026 and resized (no other changes):
- `bills-bay-pixl-pia26205.jpg`: PIA26205, credit NASA/JPL-Caltech/MSSS
- `jezero-delta-themis-pia26252.jpg`: PIA26252, credit NASA/JPL-Caltech/ASU
- `regolith-samples-pia25589.jpg`: PIA25589, credit NASA/JPL-Caltech
- `jezero-elevation-graph-pia26476.jpg`: PIA26476, credit NASA/JPL-Caltech/LANL/CNES/IRAP/DLR, the same file as on the Photojournal page

**Changes to the team's text, and why:**
- **"Jezero Crater was 22 miles (35 km) in diameter … 98 feet (30 m) deep":** these figures describe the **lake**, not the crater. JPL: "the lake eventually grew as wide as 22 miles (35 kilometers) in diameter and as deep as 100 feet (30 meters)". The crater is 47.52 km across (Gazetteer). The text now says this. The cited LPSC abstract (source 1) does not contain these figures; they come from source 3.
- **"Filled with water at least twice separately":** no source found. The LPSC abstract reports "a lack of major lake level drops during filling of the basin". Replaced with JPL's sourced sequence of water stages.
- **"Jezero Crater was an ancient river valley":** Jezero is an impact crater that held a lake; the organics were found in "an ancient river valley in Jezero crater" (source 12). Reworded.
- **"Could potentially [support life] again":** removed; no source supports it.
- **"The usual rocks are basaltic":** written as "igneous (volcanic) rock", which the sources state. The word "basaltic" was not confirmed in the sources read.
- **Soil Properties** (not in the original research): written from sources 10 and 11 only.

**Not verified (team to add sources):**
- "Feldspar, the most common mineral group in Earth's crust": a USGS page could not be opened from this environment.
- "Organic molecules make up proteins, carbohydrates, lipids and nucleic acids": general biology, kept from the team's text.

Both are left without a citation rather than given one that wasn't read.

> **Also removed 15 November 2026 (team request):** the World Overview's "Key NASA datasets for analog & astrobiology work" box and its data, and, in the Compare view, the Similarities/Differences lists and the "Radiation shielding" box. "What Earth cannot reproduce" stays, including a one-line radiation note required by CLAUDE.md rule 5.

## Compare view: Badwater Basin, California (`src/data/badwaterResearch.ts`, added 16 November 2026)

At the team's request, **Badwater Basin replaced the earlier Earth site paired with Gale**. That earlier site and its NASA pair were removed from the app. The new Gale ⇄ Badwater Basin pair (`badwater-gale` in `src/data/analogues.ts`) was **chosen by the team**. It is marked `documentedBy: 'team'`, and everywhere it appears it is labelled "chosen by our team, not a NASA-documented pair". The Compare view shows Gale on the left and Badwater Basin's seven sections on the right (Introduction, Earth Analog Reasoning, Mineral Composition, Terrain and Landforms, Current Life & Biosphere, Climate/Temperature/Weather, Elevation), plus "What Earth cannot reproduce". Badwater Basin is in California; the app never mentions Nevada. All pages were read on 16 November 2026, and the links are kept exactly as the team gave them.

| # | Source | Used for |
|---|---|---|
| 1 | [NPS, Badwater Basin](https://www.nps.gov/places/badwater-basin.htm) (last updated 7 Jan 2026) | Lowest point in North America, 282 ft (86 m) below sea level; salt flats of nearly 200 sq mi, mostly sodium chloride plus calcite, gypsum, borax; spring-fed pool, very salty; endemic snail; pickleweed; Lake Manly evaporated "tens of thousands of years" ago; salt polygons form as groundwater rises and evaporates; Black Mountains east, Panamint Range west; Telescope Peak 11,049 ft (3,368 m); boating prohibited on Lake Manly. **Measured** values: elevation and Telescope Peak. |
| 2 | [NPS, Badwater Basin photo gallery](https://www.nps.gov/media/photo/gallery.htm?pg=5846958&id=F3AECF9F-155D-4519-3EAABFC85829E3CB) | Photos and captions: salt crust uplifted and eroded, salt pools lined with growing crystals, temporary lake from rainwater, salt and mud crust shaped by wind and rain. Records read from the gallery's own data service (`/npgallery/api/search/execute/albumid/…`). |
| 3 | [NPS, Death Valley Weather](https://www.nps.gov/deva/planyourvisit/weather.htm) | Hottest place on Earth, driest in North America; summer often above 120 °F (49 °C); rainfall under 2 in (5 cm); wind common, sudden dust storms; heated air trapped by valley walls and recycled down; temperatures drop 3–5 °F per 1,000 ft; links NOAA for current conditions |
| 4 | [NPCA, "Some Like It Very Hot"](https://www.npca.org/articles/1767-some-like-it-very-hot) (Spring 2018) | A belt of peaks cycles rising hot air down to the valley floor; rain shadow of four mountain ranges |
| 5 | [NPS, Death Valley Animals](https://www.nps.gov/deva/learn/nature/animals.htm) (last updated 20 Mar 2024) | Great diversity of wildlife with adaptations to heat and drought |
| 6 | [NASA JPL, "NASA's Curiosity Mars Rover Starts Unpacking Boxwork Formations"](https://www.jpl.nasa.gov/news/nasas-curiosity-mars-rover-starts-unpacking-boxwork-formations/) (23 Jun 2025) | Gale: long-lived lakes; groundwater deposited minerals in cracks; magnesium sulfates and calcium sulfate veins form as water dries up; wind sandblasting exposed the mineral ridges |
| 7 | [U.S. Department of the Interior, Copyright](https://www.doi.gov/copyright) | Image rights: federal materials are generally public domain; credit the source |
| 8 | [NASA POWER Hourly API](https://power.larc.nasa.gov/docs/services/api/temporal/hourly/) | Climate/Temperature/Weather card (below) |

**Weather card (`SiteEarthWeather`, `src/lib/weather/powerLatest.ts`):**
- **What the team asked for:** live weather from "the same weather API that is already used by the website's chatbot".
- **What that API can give:** the chatbot uses NASA POWER for Earth. POWER does not provide live weather, so the card loads POWER's **newest hour** each time it is shown and states that hour, in Pacific time and UTC. On 16 Nov 2026 the newest hour was 14 Nov 2026, 23:00 UTC.
- **What it shows:** temperature in °F and °C, wind speed in mph and m/s with direction, humidity and rain. Every value is labelled **Estimated** (NASA's GEOS-IT model, grid of about 0.5°, which includes the surrounding mountains).
- **Left out:** surface pressure. The model gives about 92 kPa because its ground height is far above the basin floor, so the value would mislead.
- **Live readings:** the card links NOAA's Death Valley page (linked from source 3) for live station data. Using a live source in the app would mean adding a non-NASA weather service; the team can decide.

**Coordinates:** 36.23° N, 116.77° W, **Estimated**. This is the approximate position of the Badwater pool and boardwalk, rounded to 0.01°. It was checked by eye on NASA GIBS Landsat imagery (WELD 2000 layer): the point sits on the eastern edge of the salt flat at the foot of the Black Mountains. It is consistent with NASA's ASTER scene of Badwater Basin, centred at 36.3° N, 116.8° W ([PIA26197](https://science.nasa.gov/photojournal/badwater-death-valley/)). The NPS page gives no coordinates. The USGS GNIS gazetteer could not be queried from this environment, so the team should confirm the coordinates there. The existing "Death Valley, California" site (paired with Utopia Planitia) is a separate NASA pair and was not changed. Its pin lies about 5 km west, so the two overlap when zoomed out.

**Images** (`public/images/badwater/`): three NPS gallery photos, each marked **"Public domain"** with photo credit **"NPS"** in the gallery records. Not resized.
- `salt-flat-uplift-nps.jpg`: "Uplift on the salt flats"
- `salt-polygons-storm-nps.jpg`: "Badwater Storm"
- `lake-manly-temporary-nps.jpg`: "Lake Manly"

The photo on the NPS place page itself was not used, because its rights status isn't stated there.

**Changes to the team's text, and why:**
- **"Lowest point in the United States":** NPS says "lowest point in North America". Written as "North America, and so in the United States".
- **Lake Manly "evaporated … thousands of years ago":** NPS says "tens of thousands of years". Corrected.
- **"Collects rainwater and spring water to form the Badwater Pool":** NPS calls the pool spring-fed. The gallery says rainwater forms a temporary lake in the lowest part of the basin. Both are now described separately.
- **"Gravitational gradient for winds" at Gale:** not supported by the sources. Rewritten with what NPS and NPCA say about air movement in Death Valley, and what JPL says about wind erosion in Gale.
- **"Numerous species of insects and countless bacteria":** none of the seven sources says this about Badwater, so it was removed. The NPS page's "many organisms not only survive, but thrive here" is used instead.
- **"Similar sediment formations" in Gale's lake:** written as the specific salty minerals JPL names (magnesium sulfates, calcium sulfate veins).
- **Not individually cited:** "Mars has no plate tectonics to lift up fresh rock, so wind erosion is one of the main ways older layers are exposed" (the team's point; general planetary science, not stated in source 6).

## Compare view: Hale Crater and recurring slope lineae (`src/data/haleResearch.ts`, `src/data/rslSites.ts`, added 16 November 2026)

The app had no Hale or RSL entry before this, so Hale was **added as a new Mars featured site** (`src/data/featuredSites.ts`, layers: impact, terrain). Its coordinates and diameter come from the [IAU/USGS Gazetteer, Hale (feature 2322)](https://planetarynames.wr.usgs.gov/Feature/2322): centre 35.78° S, 323.50° E (−36.50° in the app's −180…180 convention), diameter 149.00 km, name adopted 1973. The Gazetteer's newer polygon outline gives 35.69° S, 323.64° E and 137.31 km; the app uses the record's main values. In the Compare view, Hale's left column shows the team's five sections (Background, Hale Crater, RSL Mineral Composition, Crater Terrain, RSL Mechanisms). The right side shows the app's standard message for a site with no NASA-documented Earth pair, plus "What Earth cannot reproduce". Sources were checked on 16 November 2026.

| # | Source | Used for |
|---|---|---|
| 1 | Munaretto et al. (2020), Planetary and Space Science 187, 104947, [10.1016/j.pss.2020.104947](https://doi.org/10.1016/j.pss.2020.104947) (the team's original source) | 125 RSL (in some cases groups of RSL) visible in both CaSSIS and HiRISE images of Hale's central peak; most lengthening on slopes > 30–32°; RSL at Hale better explained as dry granular flows than seeping water. **How it was checked:** DOI, title, authors and volume confirmed on Crossref. The publisher page, ADS and the INAF open-access copy could not be read from this environment (bot check, and the repository was "under maintenance"), so the numbers were checked against the paper's abstract as quoted in web-search results from ScienceDirect, ADS and the INAF repository. The team may want to confirm the numbers in the full text. |
| 2 | McEwen et al. (2011), Science 333, 740–743, [10.1126/science.1204816](https://doi.org/10.1126/science.1204816) | RSL first reported in 2011 from HiRISE; seasonal flows on warm slopes; "might be explained by transient flows of liquid salty water" (abstract, via Crossref) |
| 3 | [NASA Photojournal PIA19916, "Recurring 'Lineae' on Slopes at Hale Crater, Mars"](https://science.nasa.gov/photojournal/recurring-lineae-on-slopes-at-hale-crater-mars/) (28 Sep 2015) | Background image; CRISM detected hydrated salts on Hale's RSL slopes; terrain model made from two HiRISE stereo images |
| 4 | [NASA Photojournal PIA22070, "Seasonal Dark Streaks in Tivat Crater, Mars"](https://science.nasa.gov/photojournal/seasonal-dark-streaks-in-tivat-crater-mars/) (20 Nov 2017) | Discovery in 2011; HiRISE "has confirmed many thousands of them at more than 50 sites"; RSL appear in warm seasons, extend downslope, fade |
| 5 | Dundas et al. (2017), Nature Geoscience 10, 903–907, [10.1038/s41561-017-0012-5](https://doi.org/10.1038/s41561-017-0012-5) | Granular flows; limited role for liquid water (title; findings summarised in source 13) |
| 6 | [NASA Photojournal PIA19359, "Seasonal Flows in the Central Mountains of Hale Crater"](https://science.nasa.gov/photojournal/seasonal-flows-in-the-central-mountains-of-hale-crater/) (8 Apr 2015) | One of the most active RSL sites; unusually "reddish", "perhaps due to oxidized iron compounds, like rust"; activity began much earlier, well developed in early spring |
| 7 | [NASA Photojournal PIA17734, "Active Slope Flows on the Central Hills of Hale Crater"](https://science.nasa.gov/photojournal/active-slope-flows-on-the-central-hills-of-hale-crater/) (29 May 2013) | Thousands of seasonal flows on steep slopes below bedrock outcrops |
| 8 | [NASA Photojournal PIA22994, "Hale Crater"](https://science.nasa.gov/photojournal/hale-crater-3/) (THEMIS, 11 Jan 2019) | Oblique impact; oval crater; impact created the central mountain range; near the northern part of Argyre Planitia |
| 9 | [IAU/USGS Gazetteer, Hale (feature 2322)](https://planetarynames.wr.usgs.gov/Feature/2322) | Centre coordinates and diameter (Measured) |
| 10 | Ojha et al. (2015), Nature Geoscience 8, 829–832, [10.1038/ngeo2546](https://doi.org/10.1038/ngeo2546) | Reported spectral evidence for hydrated salts in RSL (title, via Crossref; the publisher page was not read) |
| 11 | Leask et al. (2018), Geophysical Research Letters 45, [10.1029/2018GL080077](https://doi.org/10.1029/2018GL080077) | CRISM artefact that mimics mineral absorptions; "few to none of the perchlorate detections reported in published literature remain robust" (abstract, via Crossref) |
| 12 | Gough et al. (2020), Geophysical Research Letters 47, e2020GL087618, [10.1029/2020GL087618](https://doi.org/10.1029/2020GL087618) | Dry-flow trigger tested for Hale: loss of water from soil salts in warm months lowers soil cohesion, slope failure exposes darker material (abstract, via Crossref) |
| 13 | [NASA Photojournal PIA22114, "Transient Slope Lineae Formation in a Well-Preserved Crater"](https://science.nasa.gov/photojournal/transient-slope-lineae-formation-in-a-well-preserved-crater/) (20 Nov 2017) | Mechanisms image; flows end at about the angle of repose for sand; likely granular material |
| 14 | [NASA Photojournal PIA21608, "Seasonal Flows in Valles Marineris"](https://science.nasa.gov/photojournal/seasonal-flows-in-valles-marineris/) (4 May 2017) | "The role of water in RSL activity is a matter of active debate" |
| 15 | [NASA Photojournal PIA23101, "Bedrock in the Central Peaks of Hale Crater"](https://science.nasa.gov/photojournal/bedrock-in-the-central-peaks-of-hale-crater/) (18 Mar 2019) | Bedrock outcrops in the central peak complex |

**Images** (`public/images/hale/`), downloaded 16 November 2026 and resized (no other changes):
- `rsl-hale-pia19916.jpg`: PIA19916 from the NASA Image Library, credit NASA/JPL-Caltech/Univ. of Arizona
- `tivat-rsl-pia22114.jpg`: PIA22114 from the NASA Image Library, credit NASA/JPL-Caltech/Univ. of Arizona
- `hale-overview-viking-trek.jpg` and `hale-topography-mola-trek.jpg`: assembled by the team from NASA Mars Trek map tiles (zoom level 7, about 0.0055° per pixel), cropped to 33.0–38.4° S, 319.8–327.4° E. Layers `Mars_Viking_MDIM21_ClrMosaic_global_232m` (Viking colour mosaic, colours approximate) and `Mars_MGS_MOLA_ClrShade_merge_global_463m` (MOLA colour shaded relief; the tiles come with no numeric colour scale, so the caption says only "higher" and "lower"). Script: `trek_mosaic.py` in the session scratchpad (fetches tiles, pastes them, crops).
- **Wikipedia image (team's Crater Terrain source):** Wikipedia could not be opened from this environment, so that image and its credit were not checked. NASA data (the MOLA relief above) was used instead, as the task preferred.

**Changes to the team's text, and why:**
- **"On the northern rim of the Argyre basin":** NASA says "near the northern part of Argyre Planitia" and "north of Argyre Planitia". Written as "near the northern edge".
- **Coordinates:** the team's "35.7° S, 323.5° E" agrees with the Gazetteer; the column shows the Gazetteer's 35.78° S, 323.50° E.
- **Mineral composition:** split into "detected in association with RSL" (CRISM hydrated salts, now debated) and "confirmed as part of the streaks themselves" (none in the sources checked). The reddish colour is presented as NASA's suggestion, not a detection. No mineral list was invented.
- **Mechanisms:** both labelled **Debated**; liquid water on present-day Mars is not stated as fact. NASA's 2015 caption ("corroborating the hypothesis that the streaks are formed by briny liquid water") is quoted in context with the later doubts.
- **Not individually cited:** "in large craters, such peaks are made of deeper rock lifted up as the crater forms" (general crater science, kept from the team's text) and the team's sentences on why RSL matter for exploration.

### RSL observation map (`src/data/rslSites.ts`, `RslMap`, `RslMarkersLayer`)

The map in Hale's Background section, and the cyan "RSL observed" diamonds on the Explore globe and 2D map (toggle: Geological layers → Observations), show **only places where a NASA image release says RSL are seen in that HiRISE image**. Each marker is the **centre of the cited HiRISE image**, read from its catalogue page on `www.uahirise.org` (16 November 2026). Images are about 5–6 km wide, so markers are accurate to a few kilometres.

| Site | Marker (image centre) | HiRISE image | NASA source(s) |
|---|---|---|---|
| Hale Crater, central peaks | 35.677° S, 323.484° E | [ESP_038073_1440](https://www.uahirise.org/ESP_038073_1440) | PIA19359, PIA17734, PIA19916 |
| Palikir Crater (in Newton) | 41.637° S, 202.295° E | [ESP_021555_1380](https://www.uahirise.org/ESP_021555_1380) | PIA14473 (Newton crater, 2011), PIA17933, PIA17727 |
| Horowitz Crater | 32.042° S, 140.802° E | [PSP_005787_1475](https://www.uahirise.org/PSP_005787_1475) | PIA14475 |
| Tivat Crater | 45.943° S, 9.534° E | [ESP_023184_1335](https://www.uahirise.org/ESP_023184_1335) | PIA22070, PIA22114 |
| Asimov Crater, central pit | 46.840° S, 5.144° E | [ESP_040485_1330](https://www.uahirise.org/ESP_040485_1330) | PIA18561, PIA22898 |
| Raga Crater | 48.113° S, 242.433° E | [ESP_040028_1315](https://www.uahirise.org/ESP_040028_1315) | PIA19309 |
| Garni Crater (Valles Marineris) | 11.517° S, 290.317° E | [ESP_031059_1685](https://www.uahirise.org/ESP_031059_1685) | PIA19917 |
| Coprates Chasma | 12.930° S, 295.417° E | [ESP_034830_1670](https://www.uahirise.org/ESP_034830_1670) | PIA18119 |
| Juventae Chasma | 4.692° S, 298.578° E | [ESP_030373_1755](https://www.uahirise.org/ESP_030373_1755) | PIA19118 |
| Krupac Crater | 7.792° S, 86.044° E | [ESP_049488_1720](https://www.uahirise.org/ESP_049488_1720) | PIA21605 |

Each NASA page names the HiRISE image used. Crater names were cross-checked against the Gazetteer: every crater marker lies inside the named crater or on its wall (for example Palikir's marker is on the crater wall, matching the HiRISE title "Slope Features on Wall of Palikir Crater").

**Not plotted:** places NASA describes only as candidate, possible or "resembling" RSL (for example images of Ius Chasma and Ganges Chasma), and Cerberus Fossae, where the status was unclear. The map says it is incomplete: NASA reports RSL at more than 50 sites (PIA22070). It links NASA's own Valles Marineris site map (PIA20756) as context. Grey italic names on the map (Olympus Mons, Valles Marineris, Argyre Planitia, Hellas Planitia) are for orientation only and come from the app's Gazetteer labels.

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
