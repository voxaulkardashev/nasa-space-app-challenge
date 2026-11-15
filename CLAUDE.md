# Planetary Analogue Explorer

A web app built by a team of six high school students for the NASA Space Apps Challenge. Users pick a world (Mars or Earth; the Moon was removed on 15 November 2026), explore it on a 3D globe, select a site, and see which Earth locations resemble it and why, using measured NASA data.

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
- **15 November 2026 (team wireframe):**
  - Moon removed.
  - Big Explore button, and a Mars | Earth switch.
  - Site pins, and geological layer filters.
  - NASA-documented Earth ⇄ Mars analogue pairs, with a corresponding-site pop-up.
  - Compare view, side-by-side mode, draggable sidebar, search, and a Use cases page.
  - Comparisons show cited similarities and differences, never a similarity percentage (rule 4).
- **15 November 2026 (weather):**
  - 📍 Drop pin button on Explore (clicks drop a pin only in pin mode).
  - Weather assistant at the top of the sidebar: rule-based, real data only. Earth from NASA POWER (labelled Estimated, MERRA-2); Mars from Curiosity REMS at Gale crater (labelled Measured, with distance from pin and the CAB disclaimer). Feed copy refreshed by `scripts/fetch_rems.mjs`.
  - Weather comparison between a Mars pin and an Earth pin: an Estimated similarity percentage, always shown with every per-dimension value and score.
- **15 November 2026 (map views):**
  - **Globe | 2D | Topography** switch on Overview and Explore:
    - 2D uses NASA-hosted tiles only.
    - Topography raises the surface with MOLA (Mars) and NASA Blue Marble topography (Earth, 0–6400 m), with the exaggeration shown.
  - **Place labels:** Mars features from the IAU/USGS Gazetteer; Earth cities approximate, labelled Estimated, to be confirmed.
- **15 November 2026 (Gale research):** in the Compare view, Gale's column shows the team's six research sections (`src/data/siteResearch.ts`, `SiteResearchColumn`) with four NASA images, clickable citations [1]–[7] and PSG Mars Explorer weather (EMARS MY32, Estimated). Citation [5] (ADS) is still to be confirmed.
- **15 November 2026 (Mars right now):** the weather assistant shows NASA Goddard PSG Mars Explorer's current model values at any Mars pin (PSG's exact reading for that spot, matching its website), plus an optional colour layer on the globe and 2D map from PSG's global grids. Labelled Estimated, never presented as measured live weather. In Gale's Compare column, Temperature/Weather shows PSG's live reading for Gale, and a separate Seasonal Weather Comparison section has a six-date 2026 table (PSG builds 2026 values from Mars Year 32 data, and the site says so).
- **Not built:** a computed analogue engine (scores from measured per-dimension Earth data) and the Python back end. Do not build them until asked.
- Deadline: Sunday 15 November 2026, 11:59 PM Pacific.

The full requirements are in `docs/requirements.md` (copy of the team's requirements document, if present).
