# Planetary Analogue Explorer

A web app for the NASA Space Apps Challenge. Pick a world (Moon, Mars or Earth) and explore it on an interactive 3D globe made from real NASA imagery. Later milestones will let you pick a site and see which Earth locations resemble it and why, using measured NASA data.

**Current status: Milestone 1.** Includes the *Select a World* screen and the *World Overview* screen (rotate/zoom plus an info panel). The Explore button leads to a "coming soon" screen.

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

1. A dark starry background, the title **Select a World**, and the Moon, Mars and Earth.
2. Hovering a world makes it glow and grow slightly. Clicking it (or its name) glides into its overview.
3. In the overview: drag to rotate, scroll (or pinch) to zoom. The panel lists facts, each with a **Measured** or **Placeholder** label. Tap a label to see its source.
4. **Explore** opens a "coming soon" screen. **Return** or **← All worlds** (or the Esc key) goes back.

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
scripts/
  fetch_textures.py  re-downloads and resizes the textures (not needed to run the app)
CLAUDE.md            project rules, including the scientific integrity rules
```

## Scientific integrity

Every value shown in the app is labelled **Measured** (named source and date), **Estimated** (method stated) or **Placeholder** (not real data). The labels use the shared `DataLabel` component. See `CLAUDE.md` for the full rules and `docs/SOURCES.md` for every source.

## Troubleshooting

- **`npm` is not recognized** (Windows): reopen the terminal after installing Node.js. If it still fails, restart the computer.
- **PowerShell says "running scripts is disabled"**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, answer `Y`, then try again.
- **Grey world with "Texture missing"**: a file in `public/textures/` is missing or renamed. Check the names against `docs/SOURCES.md`.
- **Black screen**: your browser or computer may have WebGL turned off. Test at <https://get.webgl.org>.
