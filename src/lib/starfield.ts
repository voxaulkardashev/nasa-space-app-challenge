/**
 * Decorative starfield (not a real star catalogue): star positions, colours and sizes,
 * generated from a fixed seed so the sky looks the same on every visit.
 * Mostly scattered stars, a few dense clusters, and some emptier patches of sky.
 */

export interface StarfieldData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
}

/** Star colours (RGB 0–1) and how common each is. */
const PALETTE: { rgb: [number, number, number]; weight: number }[] = [
  { rgb: [1, 1, 1], weight: 0.48 }, // white
  { rgb: [0.5, 0.7, 1], weight: 0.22 }, // bright blue
  { rgb: [1, 0.86, 0.45], weight: 0.18 }, // yellow
  { rgb: [1, 0.45, 0.28], weight: 0.12 }, // orange-red
];

/** Small seeded random-number generator (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Vec = [number, number, number];

const randomDirection = (r: () => number): Vec => {
  const z = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return [s * Math.cos(t), s * Math.sin(t), z];
};

const angleBetween = (a: Vec, b: Vec) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));

/** A random direction within `maxAngle` radians of the camera's main view (towards −z, behind the planets). */
function inView(r: () => number, maxAngle: number): Vec {
  const a = r() * maxAngle;
  const t = r() * Math.PI * 2;
  return [Math.sin(a) * Math.cos(t), Math.sin(a) * Math.sin(t) * 0.65, -Math.cos(a)];
}

/** A direction scattered around `centre` by about `spread` radians (Gaussian-like). */
function around(centre: Vec, spread: number, r: () => number): Vec {
  const g = () => (r() + r() + r() - 1.5) * spread * 1.4;
  const v: Vec = [centre[0] + g(), centre[1] + g(), centre[2] + g()];
  const len = Math.hypot(...v);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function pickColour(r: () => number, bias?: number): [number, number, number] {
  // `bias` favours one palette entry (clusters tend to share a colour).
  if (bias !== undefined && r() < 0.55) return PALETTE[bias].rgb;
  let x = r();
  for (const p of PALETTE) {
    if ((x -= p.weight) <= 0) return p.rgb;
  }
  return PALETTE[0].rgb;
}

export function buildStarfield(seed = 20261116): StarfieldData {
  const r = rng(seed);
  const stars: { dir: Vec; rgb: [number, number, number]; size: number }[] = [];
  // Emptier patches: three in the main view, the rest anywhere.
  const voids = Array.from({ length: 7 }, (_, i) => ({ dir: i < 3 ? inView(r, 0.38) : randomDirection(r), radius: 0.07 + r() * 0.08 + (i < 3 ? 0 : 0.15) }));
  const size = () => {
    const x = r();
    return x > 0.985 ? 2.6 + r() * 1.2 : x > 0.9 ? 1.5 + r() * 0.8 : 0.7 + r() * 0.7; // a few bright stars
  };

  // Scattered background stars, thinned out inside the empty patches.
  for (let i = 0; i < 9000; i++) {
    const dir = randomDirection(r);
    const inVoid = voids.some((v) => angleBetween(dir, v.dir) < v.radius);
    if (inVoid && r() > 0.06) continue;
    stars.push({ dir, rgb: pickColour(r), size: size() });
  }

  // Dense clusters, each with a favoured colour.
  // Dense clusters (six in the main view), each with a favoured colour.
  for (let c = 0; c < 12; c++) {
    let centre = c < 6 ? inView(r, 0.4) : randomDirection(r);
    for (let tries = 0; tries < 10 && voids.some((v) => angleBetween(centre, v.dir) < v.radius + 0.1); tries++) centre = randomDirection(r);
    const count = 60 + Math.floor(r() * 140);
    const spread = 0.012 + r() * 0.035;
    const bias = Math.floor(r() * PALETTE.length);
    for (let i = 0; i < count; i++) stars.push({ dir: around(centre, spread, r), rgb: pickColour(r, bias), size: size() * 0.85 });
  }

  const n = stars.length;
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);
  const phases = new Float32Array(n);
  stars.forEach((s, i) => {
    const dist = 120 + r() * 60; // a shell well behind the planets
    positions.set([s.dir[0] * dist, s.dir[1] * dist, s.dir[2] * dist], i * 3);
    const brightness = 0.75 + r() * 0.25;
    colors.set([s.rgb[0] * brightness, s.rgb[1] * brightness, s.rgb[2] * brightness], i * 3);
    sizes[i] = s.size;
    phases[i] = r() * Math.PI * 2;
  });
  return { positions, colors, sizes, phases };
}
