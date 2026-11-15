import { rampColor } from './colorRamp';
import { sampleMarsGrid, type MarsGrid } from './marsNow';

/**
 * Paints a global model grid as a 360 × 180 equirectangular image (one pixel per
 * degree, 180° W at the left edge, like the planet maps), smoothly interpolated.
 */
export function paintMarsGrid(grid: MarsGrid): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const img = ctx.createImageData(360, 180);
  const span = grid.max - grid.min || 1;
  for (let y = 0; y < 180; y++) {
    const lat = 89.5 - y;
    for (let x = 0; x < 360; x++) {
      const [r, g, b] = rampColor((sampleMarsGrid(grid, lat, x - 179.5) - grid.min) / span);
      const i = (y * 360 + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
