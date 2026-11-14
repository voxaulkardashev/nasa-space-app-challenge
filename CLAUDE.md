# Planetary Analogue Explorer

A web app built by a team of six high school students for the NASA Space Apps Challenge. Users pick a world (Moon, Mars or Earth), explore it on a 3D globe, select a site, and see which Earth locations resemble it and why, using measured NASA data.

The person you are working with is a beginner at software development. Explain what you are doing in plain language, give exact commands to run, and say what they should see when it works.

## Stack

- React + TypeScript (Vite)
- Three.js through React Three Fiber (and drei helpers if they save code)
- Planet surfaces: a sphere with real NASA imagery and elevation data, not a downloaded planet mesh. GLB/GLTF is for objects such as rovers or landers.
- Later: a separate Python back end (FastAPI) that precomputes Earth data into a tile-based feature store. Do not build it until asked.
- Avoid extra dependencies. Ask before adding one, and say why it is needed.

## Scientific integrity rules (these override everything else)

1. Never invent measurements, NASA datasets, instrument names or planetary characteristics. If you are not sure, say so and ask the team to confirm it.
2. Never claim an Earth location is equivalent to a Moon or Mars location. Show specific similarities and differences.
3. Every value shown in the interface carries one label: **Measured** (named dataset and date), **Estimated** (method stated) or **Placeholder** (visibly marked, not real data). Use the shared `DataLabel` component for this.
4. Never show a similarity score without the per-dimension values behind it.
5. Every analogue result must show what Earth cannot reproduce: gravity, vacuum or thin atmosphere, and radiation.
6. Where scientists disagree about a feature's cause (for example recurring slope lineae), show the competing explanations and label the interpretation as debated.
7. Do not silently replace real 3D content with static images or fake interactive elements. If something is impossible or impractical, explain why and suggest an alternative.
8. Cite the source and date for every dataset and texture in `docs/SOURCES.md`.

## Visual direction

Dark navy to black background with subtle stars; realistic textures and lighting; clean modern type; translucent information panels; smooth transitions; minimal clutter. Professional scientific visualisation, not a cartoonish space game.

## Code conventions

- Small, readable components with clear names. One component per file.
- TypeScript types for all data. No `any` without a comment explaining why.
- Keep data (planet info, layers, datasets) in `src/data/`, not inside components, so new worlds and layers can be added without rewriting screens.
- Suggested layout:
  - `src/screens/` one file per screen
  - `src/components/` shared UI and 3D components
  - `src/data/` world definitions and layer definitions
  - `public/textures/` NASA textures supplied by the team
  - `docs/` requirements, `SOURCES.md`, and notes
- Keep a `README.md` that gets a new teammate from clone to running app in a few commands.

## How to work

- Do not build everything at once. Work in stages.
- For each stage: say what you are building, list the files you create or change, write the code, explain how to run and test it, and check for errors before moving on.
- Run the build and any tests before saying a stage is done.
- If a network download is blocked or a file is missing, stop and tell the team what you need. Do not substitute something else without saying so.
- Once a change builds, lints and passes testing, push it straight to `main` (this publishes the live site via GitHub Pages). The team has said to do this without asking each time.

## Current status

- **Milestone 1 (done):** project foundation, the Select a World screen and the World Overview screen.
- **Milestone 2 (done):** the Explore screen.
  - Pick a site by clicking, or choose a featured site.
  - Measured elevation and estimated slope.
  - Sharp zoom imagery streamed from NASA Trek / GIBS.
  - NASA Image Library photos for featured sites.
  - DONKI space-weather context.
- **Next (not started):** the location-comparison system and the analogue engine (Milestone 3). Do not build them until asked. The Explore screen already shows a "Similar Earth sites" Placeholder row where results will go.
- Deadline: Sunday 15 November 2026, 11:59 PM Pacific.

The full requirements are in `docs/requirements.md` (copy of the team's requirements document, if present).
