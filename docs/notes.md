# Technical notes

Short explanations of the less obvious parts of the code.

## How the app is put together

- `src/App.tsx` holds two pieces of state: which **screen** is showing (`select`, `overview`, `comingSoon`) and which **world** is selected. There is no router library.
- `src/components/SpaceScene.tsx` is a single 3D canvas that stays behind every screen. Screens are HTML layers on top of it (`src/screens/`). Because the canvas never reloads, textures load once and the camera can glide between screens.
- `src/lib/layout.ts` decides where each world sits for each screen. `PlanetBody` smoothly moves towards that position every frame (`MathUtils.damp`), and that is what makes the transitions.
- `src/components/CameraRig.tsx` moves the camera back to the front view on the Select screen. It also shifts the picture sideways (or upwards on phones) when the info panel is open. It uses a *view offset*, so rotating still spins around the centre of the world.
- On the overview screen, drei's `OrbitControls` handles drag-to-rotate and scroll/pinch-to-zoom, with zoom limits so you cannot fly inside the world.

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
