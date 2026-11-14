import { Vector3 } from 'three';

/**
 * Converting between latitude/longitude and points on our unit spheres.
 *
 * Three.js wraps an equirectangular map so that, in the sphere's own
 * coordinates, a point at latitude φ and longitude λ (east positive) sits at
 *   x = cos φ · cos λ,   y = sin φ,   z = −cos φ · sin λ
 * (see docs/notes.md). These two functions are exact inverses of each other.
 */

export interface LatLon {
  /** Degrees, −90 (south) to +90 (north). */
  lat: number;
  /** Degrees, −180 to +180, east positive. */
  lon: number;
}

const DEG = Math.PI / 180;

export function latLonToVector(lat: number, lon: number, radius = 1): Vector3 {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return new Vector3(
    radius * Math.cos(phi) * Math.cos(lambda),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(lambda),
  );
}

export function vectorToLatLon(v: Vector3): LatLon {
  const n = v.clone().normalize();
  return {
    lat: Math.asin(Math.max(-1, Math.min(1, n.y))) / DEG,
    lon: Math.atan2(-n.z, n.x) / DEG,
  };
}

/** Wraps any longitude into −180…+180 (e.g. 226.2 → −133.8). */
export function normalizeLon(lon: number): number {
  return ((((lon + 180) % 360) + 360) % 360) - 180;
}

/** "18.41° N, 77.69° E" */
export function formatLatLon({ lat, lon }: LatLon, decimals = 2): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(decimals)}° ${ns}, ${Math.abs(lon).toFixed(decimals)}° ${ew}`;
}

/** Ground distance covered by one pixel at the equator of a map `widthPx` wide. */
export function pixelSizeKm(meanRadiusKm: number, widthPx: number): number {
  return (2 * Math.PI * meanRadiusKm) / widthPx;
}
