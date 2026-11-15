# Planetary Analogue Explorer

A web app for the NASA Space Apps Challenge. Pick a world (Mars or Earth) and explore it on an interactive 3D globe made from real NASA imagery. Later milestones will let you pick a site and see which Earth locations resemble it and why, using measured NASA data.

**Current status: Milestone 2.** Three screens:

- *Select a World*
- *World Overview*: rotate/zoom plus an info panel
- *Explore*: pick a site and see its data. You can click anywhere or choose a featured site, read elevation and slope, and zoom in for sharp imagery streamed from NASA.

The Earth analogue comparison is the next milestone.

Built with React, TypeScript, Vite, three.js, React Three Fiber and drei.

---

## Run it on your computer

### 1. Install the tools (once)

| Tool | Get it | Check it works (type in a terminal) |
|---|---|---|
| **Node.js LTS** (v22 or newer, includes npm) | <https://nodejs.org> → download the **LTS** installer and click through it | `node -v` → `v22…` or higher, and `npm -v` → `10…` or higher |
| **Git** | <https://git-scm.com/downloads> (Windows: keep the default options) | `git --version` |
| **VS Code** (editor, optional but recommended) | <https://code.visualstudio.com> | — |

On **Windows**, after installing, open **PowerShell** or VS Code's terminal (*Terminal → New Terminal*). Close and reopen any terminal that was already open, so it finds Node.

### 2. Get the code and start the app

```bash
git clone https://github.com/voxaulkardashev/nasa-space-app-challenge.git
```
```bash
cd nasa-space-app-challenge
```
```bash
npm install
```
```bash
npm run dev
```

The terminal shows a local address, usually **http://localhost:5173/**. Open it in Chrome, Edge or Firefox. Stop the app with **Ctrl + C** in the terminal.

`npm install` is only needed the first time, and again whenever `package.json` changes.

### 3. What you should see

1. A dark starry background, the title **Select a World**, and Mars and Earth.
2. Hovering a world makes it glow and grow slightly. Clicking it (or its name) glides into its overview.
3. In the overview: drag to rotate, scroll (or pinch) to zoom. The sidebar shows analog-science data:
   - **Conditions:** atmosphere, water vapour, temperature range, winds, ice, terrain and magnetic field, each labelled Measured or Estimated (tap a label to see its source).
   - **Analog sites:** the NASA-documented pairs in the app. Click one to open it in Explore.
   - **Key NASA datasets:** with **Debated** tags where scientists disagree.

   On the landing page, **About the project** (bottom centre) explains the project.
4. **Explore** (the big glowing button under the globe) opens the Explore screen:
   - The **Mars | Earth** switch at the top right flips between worlds; each remembers its selected site.
   - Featured sites appear as labelled pins on the globe. **Geological layers** (top left) filters them by impact structures, aeolian processes, sediments & mineralogy, or terrain/glaciers/rivers.
   - **Search** (top of the sidebar) finds sites on both worlds.
   - Choosing a site shows its **corresponding site on the other world** (NASA-documented analogues) in a pop-up; click it to jump there.
   - **Compare** opens Mars and Earth side by side: NASA photos, cited similarities and differences, and what Earth cannot reproduce (gravity, thin air, radiation).
   - **Side by side** shows both globes at once; **Use cases** lists how NASA has used these places, with sources.
   - Drag the sidebar's left edge to make it wider.
   - Click the globe to drop a marker. The panel shows the coordinates, elevation and regional slope at that spot (Mars), each labelled.
   - Choose a **featured site** (for example Jezero or Gale) and the camera flies there.
   - Zoom in close and sharper NASA imagery loads in. A credit line appears at the bottom left.
   - Featured sites show an official **NASA photo** with its caption and credit.
5. **← (world name)**, **Back to overview**, **All worlds** or the Esc key go back.
6. On the World Overview, open **Space weather · last 30 days** to see recent solar activity from NASA's DONKI database, with a NASA quote on how exposed that world's surface is to radiation.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app locally and reloads the page as you edit code |
| `npm run build` | Checks all TypeScript types and builds the final website into `dist/` |
| `npm run preview` | Serves the built `dist/` folder so you can test the final version |
| `npm run lint` | Checks the code for common mistakes |

Before pushing changes, run `npm run lint` and `npm run build`; both should finish without errors.

## Deploying (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds and publishes the site every time something is pushed to the `main` branch.

One-time setup on GitHub:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. Push to `main` (or open the **Actions** tab → *Deploy to GitHub Pages* → **Run workflow**).
3. The site appears at `https://voxaulkardashev.github.io/nasa-space-app-challenge/`.

The workflow also runs **once a day** to refresh the space-weather data from NASA's DONKI database (`scripts/fetch_donki.mjs`).

**Recommended: add your free NASA API key** so the daily refresh isn't limited by NASA's shared demo key:

1. Get a key at <https://api.nasa.gov> (fill in the short form; the key is shown on screen and emailed to you).
2. On GitHub, go to the repository **Settings**, then **Secrets and variables**, then **Actions**, and click **New repository secret**.
3. Name: `NASA_API_KEY`. Secret: paste your key. Click **Add secret**.

Never put the key in the code or a commit. GitHub keeps secrets hidden, even in logs. If you skip this, the site still works and uses the last saved data.

## Project layout

```
src/
  App.tsx            which screen is showing + which world is selected
  screens/           one file per screen (Select, Overview, Coming soon)
  components/        shared UI and 3D pieces (PlanetBody, InfoPanel, DataLabel…)
  data/              world definitions, facts and sources: edit data here, not in components
  lib/               small helpers (layout maths, navigation type)
public/textures/     NASA textures (see docs/SOURCES.md)
docs/
  SOURCES.md         where every texture and value came from, with dates
  notes.md           how the code works, known limitations
public/data/elevation/  elevation grids for the Explore screen (see docs/SOURCES.md)
scripts/
  fetch_textures.py      re-downloads and resizes the textures (not needed to run the app)
  prepare_elevation.py   rebuilds the elevation grids (not needed to run the app)
  fetch_donki.mjs        refreshes the space-weather snapshot (run automatically on deploy)
CLAUDE.md            project rules, including the scientific integrity rules
```

## Scientific integrity

Every value shown in the app is labelled **Measured** (named source and date), **Estimated** (method stated) or **Placeholder** (not real data). The labels use the shared `DataLabel` component. See `CLAUDE.md` for the full rules and `docs/SOURCES.md` for every source.

## Troubleshooting

- **`npm` is not recognized** (Windows): reopen the terminal after installing Node.js. If it still fails, restart the computer.
- **PowerShell says "running scripts is disabled"**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, answer `Y`, then try again.
- **Grey world with "Texture missing"**: a file in `public/textures/` is missing or renamed. Check the names against `docs/SOURCES.md`.
- **Black screen**: your browser or computer may have WebGL turned off. Test at <https://get.webgl.org>.
- **Zoomed-in Explore view stays blurry**: the sharp imagery comes from trek.nasa.gov, gibs.earthdata.nasa.gov and, for the closest Mars views, astro.arcgis.com (Esri, which serves NASA Trek's CTX mosaic). Check your internet connection, or whether a school network blocks those sites.
