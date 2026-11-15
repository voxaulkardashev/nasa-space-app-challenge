# Technical notes

Short explanations of the less obvious parts of the code.

## How the app is put together

- `src/App.tsx` holds two pieces of state: which **screen** is showing (`select`, `overview`, `explore`), which **world** is selected, and which **site** is picked. There is no router library.
- `src/components/SpaceScene.tsx` is a single 3D canvas that stays behind every screen. Screens are HTML layers on top of it (`src/screens/`). Because the canvas never reloads, textures load once and the camera can glide between screens.
- `src/lib/layout.ts` decides where each world sits for each screen. `PlanetBody` smoothly moves towards that position every frame (`MathUtils.damp`), and that is what makes the transitions.
- `src/components/CameraRig.tsx` moves the camera back to the front view on the Select screen. It also shifts the picture sideways (or upwards on phones) when the info panel is open. It uses a *view offset*, so rotating still spins around the centre of the world.
- On the overview screen, drei's `OrbitControls` handles drag-to-rotate and scroll/pinch-to-zoom, with zoom limits so you cannot fly inside the world.

## Explore screen

- **Picking a site.** `PlanetBody` converts the clicked 3D point into the sphere's own coordinates, then into latitude/longitude (`src/lib/geo.ts`). A press that moves more than 5 pixels counts as a drag (rotate), not a click.
- **Featured sites** live in `src/data/featuredSites.ts`. Choosing one sets the site and bumps `flyRequest`; `CameraRig` then swings the camera round to look straight down at it. Starting to drag or zoom cancels the flight.
- **Elevation and slope.** `src/lib/useElevationGrid.ts` downloads the world's elevation grid (`public/data/elevation/`) the first time Explore opens. `src/lib/elevationGrid.ts` reads the cell under the site and works out the slope from its neighbours. `src/lib/elevationFacts.ts` turns those numbers into labelled `DataValue` rows.
- **Sharp zoom.** `src/components/DetailTiles.tsx` runs about three times a second:
  1. It works out the point below the camera and how far away the camera is.
  2. `src/lib/tiles.ts` then picks the zoom level and the NASA tiles that cover the view.
  3. Each tile is drawn by `TileMesh` as a curved patch of sphere exactly matching its latitude/longitude box, slightly above the base globe.
  4. Tiles appear only once downloaded, so there are never holes.
  5. Up to 300 tiles are kept in memory, and they're freed when you leave Explore.
- **Tile services** are defined in `src/data/tileLayers.ts`. All three are plain lat/lon grids with the top-left corner at 180° W, 90° N. Trek tiles are 256 px and start at 180° per tile. GIBS tiles are 512 px and start at 288° per tile, so some GIBS tiles overhang the map edge and get cropped.
- **Deeper zoom** (`src/data/tileLayers.ts`):
  - Each world has a *stack* of tile sources: Mars uses Viking colour, then CTX greyscale (~20 m/px); Earth uses Blue Marble, then Landsat WELD (~30 m/px).
  - `chooseLayer` (in `src/lib/tiles.ts`) picks the first source that's sharp enough for the view.
  - While a sharp tile loads, its parent or the coarser source shows underneath.
  - `CameraRig` moves the near clipping plane with the height above the ground, and shrinks zoom steps near the surface, so close-ups don't clip or jump.
- **Lighting** (`SceneLighting.tsx`): Select and Overview use a fixed Sun, so you see a real day/night side. In Explore the light follows the camera like a headlamp, so the area you're looking at is always lit. That's a viewing aid, not the real Sun direction.
- **Loading like an online map**:
  - The full-screen "Loading NASA imagery" overlay only appears on first load.
  - Close-up tiles use their own loading manager, so they never trigger it.
  - New tiles fade in, and while a sharp tile downloads, its blurrier parent tile stays in its place.
  - A small "Loading detail…" hint shows in the corner.
- **Drop pin.** Clicking the globe only drops a pin after pressing **📍 Drop pin** (`pinMode` in `App.tsx`); the mode turns off after one pin, and Esc cancels it. Featured-site labels stay clickable at all times.
- **Weather assistant** (`src/components/WeatherAssistant.tsx`, logic in `src/lib/weather/`):
  - `power.ts` calls NASA POWER for the chosen date ±3 days; `rems.ts` loads the saved copy of the Curiosity feed once; `report.ts` picks the nearest day with data and, for Mars, the distance to Gale crater.
  - `assistant.ts` writes every reply from the report with fixed sentence templates. Typed questions are matched by keywords (temperature, pressure, wind…). There is no AI model on purpose: a key can't be hidden on GitHub Pages, and a language model could invent numbers.
  - Reports are kept per world in `App.tsx` (`useWeather.ts`), so the comparison can use both pins.
- **Weather comparison** (`WeatherComparison.tsx`, maths in `compare.ts`): see docs/SOURCES.md for the scoring rules.
- **Camera settings** in `SpaceScene.tsx` are a constant on purpose. Passing a new object on every render could make React Three Fiber reset the camera and undo the user's zoom.

## NASA APIs used

| Service | Where | Called from | Key |
|---|---|---|---|
| Mars Trek WMTS, GIBS | Explore close-up tiles | Visitors' browsers | No |
| NASA Image and Video Library | Featured-site photos (`src/data/sitePhotos.ts`) | Chosen once by hand; images load from `images-assets.nasa.gov` | No |
| NASA POWER Daily API | Weather assistant, Earth pins | Visitors' browsers, when they press Analyze | No |
| Mars weather feed (mars.nasa.gov, Curiosity REMS) | Weather assistant, Mars pins | The deploy workflow (`scripts/fetch_rems.mjs`) saves a copy to `public/data/weather/` | No |
| DONKI (CCMC service or api.nasa.gov) | Space weather on the World Overview | The deploy workflow (`scripts/fetch_donki.mjs`), on push and daily | `NASA_API_KEY` repo secret if set, else `DEMO_KEY` |

- **Why the workflow fetches DONKI, not the visitor's browser:** the demo key has small hourly and daily limits per internet address, and a whole school network shares one address. A key built into the website would also be public.
- **What gets saved:** the workflow writes `src/data/donki.json` before building. The copy committed in the repo is the fallback if NASA can't be reached.
- **Flares unavailable:** on 14 November 2026, api.nasa.gov's FLR (solar flare) endpoint returned 404, so flares show as unavailable until a later fetch works.

## Which side of a world faces you

Three.js wraps an equirectangular map so that longitude 0° faces +X and 90° W faces the camera (+Z). To make longitude `L` (degrees east) face the camera, rotate the sphere around Y by `-π/2 - L` (in radians). `initialLongitudeDeg` in `src/data/worlds.ts` sets this per world. A positive Y rotation turns the world west-to-east, the real direction for all three bodies.

## Data labels

`src/data/types.ts` makes `DataValue` a union type. TypeScript will not compile a `measured` value without a `source`, an `estimated` value without a `method`, or a `placeholder` without a `reason`. `DataLabel` shows the badge; tapping it shows where the value came from.

## Adding a world

1. Put its textures in `public/textures/<id>/` and record them in `docs/SOURCES.md`.
2. Add its id to `WorldId` in `src/data/types.ts`.
3. Add an entry to `WORLDS` in `src/data/worlds.ts`.

The screens do not need changes. The Select screen layout spaces however many worlds there are, but more than three or four will need a rethink.

## Known limitations

- Needs WebGL (any modern browser). Very old laptops or school-managed devices may be slow.
- three.js is large, so `npm run build` prints a "chunks larger than 500 kB" **warning**. It is not an error. The app's code is about 330 kB after compression; the textures (~5.7 MB) load separately.
- A harmless console warning, "THREE.Clock: This module has been deprecated", comes from inside React Three Fiber, not from our code.
- Elevation is used only for lighting (bump map). The surface is not physically raised. True-height displacement would need much more detail and visible exaggeration, so it is left for later.
- Elevation values come from 4-cells-per-degree grids (14.8 km cells on Mars), so small features such as a single crater rim are averaged out. There's no elevation for Earth yet; it shows as a Placeholder.
- Close-up imagery needs an internet connection to NASA's servers.
- **Mars weather comes from one place.** Curiosity's daily reports from Gale crater are the only Mars weather feed used, so every Mars pin gets Gale's weather (the app says so, with the distance). The feed's newest sol is usually weeks to months behind today; the assistant then uses the nearest date with data and says how far away it is.
- mars.nasa.gov refuses automated "HeadlessChrome" browsers. That is one reason the feed is copied at build time instead of fetched by visitors' browsers.
- NASA POWER fills in its newest days about 3 days late (sunlight a little later), so the Earth date picker stops 3 days before today.
