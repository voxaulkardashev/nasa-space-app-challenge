/**
 * Colour scale for the Mars weather map: dark blue (low) → teal → yellow → red (high).
 * Used by the globe overlay, the 2D map overlay and the legend, so they always match.
 */
const STOPS: [number, [number, number, number]][] = [
  [0, [30, 40, 120]],
  [0.25, [40, 120, 190]],
  [0.5, [60, 190, 160]],
  [0.75, [240, 210, 80]],
  [1, [220, 60, 50]],
];

export function rampColor(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (x <= t1) {
      const f = (x - t0) / (t1 - t0);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** CSS gradient of the same scale (for the legend). */
export const RAMP_CSS = `linear-gradient(to right, ${STOPS.map(([t, c]) => `rgb(${c.join(',')}) ${t * 100}%`).join(', ')})`;
