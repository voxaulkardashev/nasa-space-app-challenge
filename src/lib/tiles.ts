import type { TileLayerDef } from '../data/tileLayers';
import { normalizeLon, type LatLon } from './geo';

/**
 * Which map tiles to show for the current view. Pure maths, no three.js.
 * Distances are in units of the world's radius (1 = the surface).
 */

export interface TileKey {
  /** Id of the tile source (layer) this tile comes from. */
  source: string;
  z: number;
  row: number;
  col: number;
  /** Western, eastern, northern, southern edges in degrees (clipped to the globe). */
  west: number;
  east: number;
  north: number;
  south: number;
  /** Fraction of the tile image that lies on the globe (tiles may overhang at 180°E / 90°S). */
  uSpan: number;
  vSpan: number;
}

/** Width in pixels of the base colour maps; tiles are only used when sharper than this. */
const BASE_MAP_WIDTH_PX = 4096;
/** Never request more tiles than this for one view. */
const MAX_TILES = 96;
const FOV_DEG = 45;

export const tileKeyId = (k: { source: string; z: number; row: number; col: number }) => `${k.source}/${k.z}/${k.row}/${k.col}`;

export function tileDeg(layer: TileLayerDef, z: number): number {
  return layer.level0TileDeg / 2 ** z;
}

/**
 * @param centre   the point on the surface straight below the camera
 * @param distance camera distance from the centre of the world (radius = 1)
 * @param viewportHeightPx height of the 3D view in pixels
 * @param aspect   width / height of the 3D view
 */
export function visibleTiles(
  layer: TileLayerDef,
  centre: LatLon,
  distance: number,
  viewportHeightPx: number,
  aspect: number,
): TileKey[] {
  const altitude = Math.max(distance - 1, 1e-4);
  const halfFov = ((FOV_DEG / 2) * Math.PI) / 180;
  // Ground seen from top to bottom of the screen, in degrees of arc (flat-ground approximation).
  const viewDeg = ((2 * altitude * Math.tan(halfFov)) * 180) / Math.PI;
  const degPerScreenPx = viewDeg / viewportHeightPx;

  // Smallest level whose pixels are at least as fine as the screen's.
  let z = Math.ceil(Math.log2(layer.level0TileDeg / (layer.tileSize * degPerScreenPx)));
  z = Math.min(layer.maxLevel, Math.max(0, z));
  const basePixelDeg = 360 / BASE_MAP_WIDTH_PX;
  if (tileDeg(layer, z) / layer.tileSize >= basePixelDeg) return []; // base map is already as sharp

  // How far from the centre we can see: limited by the horizon and by the screen size.
  const horizonDeg = (Math.acos(Math.min(1, 1 / distance)) * 180) / Math.PI;
  const halfExtent = Math.min(horizonDeg, viewDeg * Math.max(aspect, 1) * 0.6);

  for (; z >= 0; z--) {
    const keys = tilesAround(layer, z, centre, halfExtent);
    if (keys.length <= MAX_TILES) return tileDeg(layer, z) / layer.tileSize < basePixelDeg ? keys : [];
  }
  return [];
}

function tilesAround(layer: TileLayerDef, z: number, centre: LatLon, halfExtent: number): TileKey[] {
  const d = tileDeg(layer, z);
  const north = Math.min(90, centre.lat + halfExtent);
  const south = Math.max(-90, centre.lat - halfExtent);
  const maxAbsLat = Math.max(Math.abs(north), Math.abs(south));
  const lonHalf = maxAbsLat > 89 ? 180 : halfExtent / Math.max(Math.cos((maxAbsLat * Math.PI) / 180), 0.05);
  const wholeWorld = lonHalf >= 180;

  const firstRow = Math.max(0, Math.floor((90 - north) / d));
  const lastRow = Math.floor((90 - south - 1e-9) / d);
  const cols = new Set<number>();
  if (wholeWorld) {
    for (let c = 0; c * d < 360; c++) cols.add(c);
  } else {
    for (let lon = centre.lon - lonHalf; lon <= centre.lon + lonHalf + d; lon += d) {
      const l = Math.min(normalizeLon(Math.min(lon, centre.lon + lonHalf)), 179.999999);
      cols.add(Math.floor((l + 180) / d));
    }
  }

  const keys: TileKey[] = [];
  for (let row = firstRow; row <= lastRow; row++) {
    for (const col of cols) {
      const key = makeTileKey(layer, z, row, col);
      if (!key) continue;
      // Skip tiles whose centre is clearly farther away than the visible area
      // (the lat/lon box above is much wider than the view near the poles).
      const tileCentre = { lat: (key.north + key.south) / 2, lon: (key.west + key.east) / 2 };
      if (angularDistanceDeg(centre, tileCentre) > halfExtent + d * 0.75) continue;
      keys.push(key);
    }
  }
  return keys;
}

/** The edges of one tile, clipped to the globe. Returns null for tiles entirely off the map. */
export function makeTileKey(layer: TileLayerDef, z: number, row: number, col: number): TileKey | null {
  const d = tileDeg(layer, z);
  const north = 90 - row * d;
  const west = -180 + col * d;
  if (west >= 180 || north <= -90 || row < 0 || col < 0) return null;
  const south = Math.max(-90, north - d);
  const east = Math.min(180, west + d);
  return { source: layer.id, z, row, col, west, east, north, south, uSpan: (east - west) / d, vSpan: (north - south) / d };
}

/**
 * The lower-resolution tile one level up that covers the same area.
 * (Each level halves the tile size from the same top-left corner, so the
 * parent's row and column are simply half, rounded down.)
 */
export function parentKey(layer: TileLayerDef, key: TileKey): TileKey | null {
  if (key.z === 0) return null;
  return makeTileKey(layer, key.z - 1, Math.floor(key.row / 2), Math.floor(key.col / 2));
}

/** Status reported to the screen: are close-up tiles showing, and are more still downloading? */
export interface DetailStatus {
  active: boolean;
  loading: boolean;
  /** Which source is supplying the close-up tiles (for the credit line). */
  sourceId?: string;
}

/** Degrees of surface per screen pixel, looking straight down from `distance` (radius = 1). */
export function screenDegPerPx(distance: number, viewportHeightPx: number): number {
  const altitude = Math.max(distance - 1, 1e-4);
  const halfFov = ((FOV_DEG / 2) * Math.PI) / 180;
  return ((2 * altitude * Math.tan(halfFov)) * 180) / Math.PI / viewportHeightPx;
}

/** Degrees per pixel at a source's finest level. */
export function finestDegPerPx(layer: TileLayerDef): number {
  return tileDeg(layer, layer.maxLevel) / layer.tileSize;
}

/**
 * Pick the source for the current view from a stack (coarsest first): the first
 * one that is at least as sharp as the screen, otherwise the sharpest.
 */
export function chooseLayer(layers: TileLayerDef[], distance: number, viewportHeightPx: number): TileLayerDef {
  const need = screenDegPerPx(distance, viewportHeightPx);
  return layers.find((l) => finestDegPerPx(l) <= need) ?? layers[layers.length - 1];
}

/** The tile of a given level that contains a point. */
export function coveringKey(layer: TileLayerDef, z: number, lat: number, lon: number): TileKey | null {
  const d = tileDeg(layer, z);
  return makeTileKey(layer, z, Math.floor((90 - lat) / d), Math.floor((lon + 180) / d));
}

/** Great-circle angle between two points, in degrees. */
export function angularDistanceDeg(a: LatLon, b: LatLon): number {
  const r = Math.PI / 180;
  const cos =
    Math.sin(a.lat * r) * Math.sin(b.lat * r) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.cos((a.lon - b.lon) * r);
  return Math.acos(Math.min(1, Math.max(-1, cos))) / r;
}
