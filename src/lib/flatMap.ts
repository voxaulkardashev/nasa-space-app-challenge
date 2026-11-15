import type { TileLayerDef } from '../data/tileLayers';

/**
 * Maths for the 2D map: a plain latitude/longitude (equirectangular) map,
 * like the NASA images themselves. `ppd` = screen pixels per degree.
 */

export interface MapView {
  lon: number;
  lat: number;
  ppd: number;
}

export interface MapTile {
  id: string;
  layer: TileLayerDef;
  z: number;
  row: number;
  col: number;
  /** Degrees covered by the tile (square). */
  deg: number;
}

/** Width in pixels of the base colour maps. */
const BASE_MAP_WIDTH_PX = 4096;
const MAX_TILES = 120;

/** Smallest level whose pixels are at least as fine as the screen's, capped at the layer's limit. */
export function levelFor(layer: TileLayerDef, ppd: number): number {
  const z = Math.ceil(Math.log2((layer.level0TileDeg * ppd) / layer.tileSize));
  return Math.min(layer.maxLevel, Math.max(0, z));
}

const pixelDeg = (layer: TileLayerDef, z: number) => layer.level0TileDeg / 2 ** z / layer.tileSize;

/**
 * Tiles to draw for the visible area, coarsest source first. Like the globe,
 * it uses the first source that is sharp enough, with coarser ones underneath.
 */
export function mapTiles(layers: TileLayerDef[], ppd: number, bounds: { west: number; east: number; north: number; south: number }): { tiles: MapTile[]; activeLayer: TileLayerDef | null } {
  const tiles: MapTile[] = [];
  let activeLayer: TileLayerDef | null = null;
  for (const layer of layers) {
    let z = levelFor(layer, ppd);
    if (pixelDeg(layer, z) >= 360 / BASE_MAP_WIDTH_PX) continue; // the base map is already this sharp
    let keys: MapTile[] = [];
    for (; z >= 0; z--) {
      keys = tilesIn(layer, z, bounds);
      if (keys.length <= MAX_TILES) break;
    }
    tiles.push(...keys);
    activeLayer = layer;
    if (pixelDeg(layer, levelFor(layer, ppd)) <= 1 / ppd) break; // sharp enough: stop here
  }
  return { tiles, activeLayer };
}

function tilesIn(layer: TileLayerDef, z: number, b: { west: number; east: number; north: number; south: number }): MapTile[] {
  const deg = layer.level0TileDeg / 2 ** z;
  const out: MapTile[] = [];
  const c0 = Math.max(0, Math.floor((b.west + 180) / deg));
  const c1 = Math.min(Math.ceil(360 / deg) - 1, Math.floor((b.east + 180) / deg));
  const r0 = Math.max(0, Math.floor((90 - b.north) / deg));
  const r1 = Math.min(Math.ceil(180 / deg) - 1, Math.floor((90 - b.south) / deg));
  for (let row = r0; row <= r1; row++) {
    for (let col = c0; col <= c1; col++) out.push({ id: `${layer.id}/${z}/${row}/${col}`, layer, z, row, col, deg });
  }
  return out;
}
