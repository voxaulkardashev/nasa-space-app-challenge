import { BufferAttribute, SphereGeometry } from 'three';
import type { ElevationGrid } from './elevationGrid';

/**
 * Raised-relief ("topography") helpers. Heights come from the world's NASA
 * elevation grid; they are multiplied by a vertical exaggeration that is
 * always shown on screen, because true relief is tiny at globe scale.
 */

export type ViewMode = 'globe' | 'map2d' | 'topo';

/** Height in metres at a point, interpolated between the four nearest cell centres. */
export function sampleHeight(grid: ElevationGrid, lat: number, lon: number): number {
  const { width, height } = grid.dataset;
  const x = ((lon + 180) / 360) * width - 0.5;
  const y = ((90 - lat) / 180) * height - 0.5;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const at = (r: number, c: number) => {
    const rr = Math.min(height - 1, Math.max(0, r));
    const cc = ((c % width) + width) % width;
    return grid.heights[rr * width + cc];
  };
  const top = at(y0, x0) * (1 - fx) + at(y0, x0 + 1) * fx;
  const bottom = at(y0 + 1, x0) * (1 - fx) + at(y0 + 1, x0 + 1) * fx;
  return top * (1 - fy) + bottom * fy;
}

/** Scene radius (planet radius = 1) of the raised surface at a point. */
export function raisedRadius(grid: ElevationGrid, lat: number, lon: number, exaggeration: number, radiusKm: number): number {
  return 1 + (sampleHeight(grid, lat, lon) / 1000 / radiusKm) * exaggeration;
}

/** Highest raised radius for a world (keeps the camera above the mountains). */
export function maxRaise(maxHeightM: number, exaggeration: number, radiusKm: number): number {
  return (maxHeightM / 1000 / radiusKm) * exaggeration;
}

const DEG = 180 / Math.PI;

/**
 * A sphere whose vertices are pushed in or out by the elevation grid.
 * Vertex positions follow the same latitude/longitude convention as lib/geo.ts,
 * so the colour map, labels and picking still line up.
 */
export function buildTopoGeometry(grid: ElevationGrid, exaggeration: number, radiusKm: number, widthSegments = 1024, heightSegments = 512): SphereGeometry {
  const geometry = new SphereGeometry(1, widthSegments, heightSegments);
  const pos = geometry.getAttribute('position') as BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const lat = Math.asin(Math.max(-1, Math.min(1, y))) * DEG;
    const lon = Math.atan2(-z, x) * DEG;
    const r = raisedRadius(grid, lat, lon, exaggeration, radiusKm);
    pos.setXYZ(i, x * r, y * r, z * r);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
