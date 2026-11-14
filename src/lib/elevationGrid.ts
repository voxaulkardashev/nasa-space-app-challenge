import type { ElevationDataset } from '../data/elevation';
import type { LatLon } from './geo';

/** A loaded elevation grid: heights in metres, row 0 = north, column 0 = 180°W. */
export interface ElevationGrid {
  dataset: ElevationDataset;
  heights: Int16Array;
}

export async function loadElevationGrid(dataset: ElevationDataset, url: string): Promise<ElevationGrid> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url} (HTTP ${response.status})`);
  const buffer = await response.arrayBuffer();
  const expected = dataset.width * dataset.height * 2;
  if (buffer.byteLength !== expected) {
    throw new Error(`${url} has ${buffer.byteLength} bytes, expected ${expected}`);
  }
  // The files are little-endian; DataView reads them correctly on any computer.
  const view = new DataView(buffer);
  const heights = new Int16Array(dataset.width * dataset.height);
  for (let i = 0; i < heights.length; i++) heights[i] = view.getInt16(i * 2, true);
  return { dataset, heights };
}

/** Row and column of the grid cell that contains a point. */
function cellOf(grid: ElevationGrid, { lat, lon }: LatLon): { row: number; col: number } {
  const { width, height } = grid.dataset;
  const row = Math.min(height - 1, Math.max(0, Math.floor(((90 - lat) / 180) * height)));
  const col = (((Math.floor(((lon + 180) / 360) * width) % width) + width) % width);
  return { row, col };
}

function heightAt(grid: ElevationGrid, row: number, col: number): number {
  const { width, height } = grid.dataset;
  const r = Math.min(height - 1, Math.max(0, row));
  const c = ((col % width) + width) % width; // wraps around at ±180°
  return grid.heights[r * width + c];
}

/** Elevation (m) of the grid cell containing the point. No interpolation. */
export function elevationAt(grid: ElevationGrid, point: LatLon): number {
  const { row, col } = cellOf(grid, point);
  return heightAt(grid, row, col);
}

/** Size of one grid cell in km: [east–west at this latitude, north–south]. */
export function cellSizeKm(grid: ElevationGrid, lat: number, radiusKm: number): [number, number] {
  const { width, height } = grid.dataset;
  const ns = (Math.PI * radiusKm) / height;
  const ew = ((2 * Math.PI * radiusKm) / width) * Math.cos((lat * Math.PI) / 180);
  return [ew, ns];
}

/**
 * Average slope (degrees) around the point, from the height differences of the
 * neighbouring cells (central differences). It averages over about two cells,
 * so real local slopes can be much steeper. Returns null very close to the poles,
 * where the east–west cell size shrinks towards zero.
 */
export function slopeAt(grid: ElevationGrid, point: LatLon, radiusKm: number): number | null {
  const { row, col } = cellOf(grid, point);
  const [ewKm, nsKm] = cellSizeKm(grid, point.lat, radiusKm);
  if (ewKm < 0.5) return null;
  const dzdx = (heightAt(grid, row, col + 1) - heightAt(grid, row, col - 1)) / (2 * ewKm * 1000);
  const dzdy = (heightAt(grid, row - 1, col) - heightAt(grid, row + 1, col)) / (2 * nsKm * 1000);
  return (Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI;
}
