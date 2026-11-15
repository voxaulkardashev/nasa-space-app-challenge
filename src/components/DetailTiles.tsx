import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  ImageLoader,
  LoadingManager,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  type Group,
} from 'three';
import type { TileLayerDef } from '../data/tileLayers';
import { vectorToLatLon } from '../lib/geo';
import {
  chooseLayer,
  coveringKey,
  parentKey,
  tileKeyId,
  visibleTiles,
  type DetailStatus,
  type TileKey,
} from '../lib/tiles';
import { TileMesh } from './TileMesh';

interface DetailTilesProps {
  /** Tile sources for this world, coarsest first. */
  layers: TileLayerDef[];
  /** Reports whether close-up tiles are showing, whether more are downloading, and from which source. */
  onStatusChange?: (status: DetailStatus) => void;
  /** Topography view: drape tiles over the raised terrain. */
  radiusAt?: (lat: number, lon: number) => number;
}

/** How often (seconds) to re-check which tiles the view needs. */
const CHECK_INTERVAL = 0.3;
/** Keep at most this many downloaded tiles in memory. */
const CACHE_LIMIT = 300;
/** How many zoom levels up to look for a blurrier stand-in while a tile downloads. */
const MAX_FALLBACK_LEVELS = 4;
/** Keep the stand-in for this long (ms) after the sharp tile arrives, while it fades in. */
const FADE_OVERLAP_MS = 600;
/** Pixels darker than this in every channel count as "no data" for blackIsNoData sources. */
const NO_DATA_MAX = 4;

/**
 * Tiles use their OWN loading manager. The default one drives the full-screen
 * "Loading NASA imagery" overlay; tiles must load quietly in the background.
 */
const manager = new LoadingManager();
const textureLoader = new TextureLoader(manager).setCrossOrigin('anonymous');
const imageLoader = new ImageLoader(manager).setCrossOrigin('anonymous');
const localCamera = new Vector3();

interface CacheEntry {
  key: TileKey;
  texture: Texture | null;
  failed: boolean;
  lastUsed: number;
  /** When the texture finished downloading (ms), for the fade-in overlap. */
  loadedAt: number;
}

interface ShownTile {
  key: TileKey;
  texture: Texture;
  transparent: boolean;
}

/** Makes pure-black "no data" pixels see-through (e.g. oceans in a land-only Landsat layer). */
function blackToTransparent(image: HTMLImageElement): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i] <= NO_DATA_MAX && px[i + 1] <= NO_DATA_MAX && px[i + 2] <= NO_DATA_MAX) px[i + 3] = 0;
  }
  ctx.putImageData(data, 0, 0);
  return new CanvasTexture(canvas);
}

/**
 * Streams sharper map tiles for the part of the world in view, the way online
 * maps do: nothing blocks the screen, new tiles fade in, and while a sharp tile
 * is still downloading a blurrier one stays in its place. When you zoom past
 * what the first source can show, it switches to the next, sharper source.
 *
 * Must be placed inside the world's rotating group (same coordinates as the
 * unit sphere). The normal globe always shows underneath.
 */
export function DetailTiles({ layers, onStatusChange, radiusAt }: DetailTilesProps) {
  const group = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const cache = useRef(new Map<string, CacheEntry>());
  const sinceCheck = useRef(CHECK_INTERVAL);
  const [shown, setShown] = useState<ShownTile[]>([]);
  const [loading, setLoading] = useState(false);
  const [sourceId, setSourceId] = useState<string | undefined>(undefined);

  /** Starts downloading a tile unless it is already cached (or being downloaded). */
  const requestTile = (layer: TileLayerDef, key: TileKey, now: number) => {
    const id = tileKeyId(key);
    const existing = cache.current.get(id);
    if (existing) {
      existing.lastUsed = now;
      return;
    }
    const entry: CacheEntry = { key, texture: null, failed: false, lastUsed: now, loadedAt: 0 };
    cache.current.set(id, entry);
    const done = (texture: Texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
      // Crop tiles that overhang the edge of the map (GIBS at 180°E / 90°S).
      texture.repeat.set(key.uSpan, key.vSpan);
      texture.offset.set(0, 1 - key.vSpan);
      texture.needsUpdate = true;
      entry.texture = texture;
      entry.loadedAt = performance.now();
      sinceCheck.current = CHECK_INTERVAL; // redraw on the next frame
    };
    const fail = () => {
      entry.failed = true; // e.g. offline: the normal globe simply stays visible
    };
    const url = layer.url(key.z, key.row, key.col);
    if (layer.blackIsNoData) imageLoader.load(url, (img) => done(blackToTransparent(img)), undefined, fail);
    else textureLoader.load(url, done, undefined, fail);
  };

  const readyTexture = (key: TileKey | null) => (key ? cache.current.get(tileKeyId(key))?.texture : null);

  useFrame(({ camera }, delta) => {
    sinceCheck.current += delta;
    const g = group.current;
    if (!g || sinceCheck.current < CHECK_INTERVAL || layers.length === 0) return;
    sinceCheck.current = 0;

    // Camera position in the world's own coordinates (radius 1, rotation undone).
    g.updateWorldMatrix(true, false);
    localCamera.copy(camera.position);
    g.worldToLocal(localCamera);
    const distance = localCamera.length();
    const centre = vectorToLatLon(localCamera);
    const layer = chooseLayer(layers, distance, size.height);
    const coarser = layers.slice(0, layers.indexOf(layer));
    const wanted = visibleTiles(layer, centre, distance, size.height, size.width / size.height);

    const now = performance.now();
    for (const key of wanted) requestTile(layer, key, now);

    // Each wanted tile if ready; otherwise (or while it fades in) the nearest ready stand-in:
    // an ancestor in the same source, then the coarser sources' sharpest tile covering it.
    const toDraw = new Map<string, ShownTile>();
    const add = (key: TileKey, texture: Texture, l: TileLayerDef) =>
      toDraw.set(tileKeyId(key), { key, texture, transparent: Boolean(l.transparent || l.blackIsNoData) });
    let pending = 0;
    for (const key of wanted) {
      const entry = cache.current.get(tileKeyId(key));
      if (entry?.texture) {
        add(key, entry.texture, layer);
        if (now - entry.loadedAt > FADE_OVERLAP_MS && !layer.transparent && !layer.blackIsNoData) continue;
      } else if (!entry?.failed) {
        pending++;
      }
      let standIn = false;
      let parent = parentKey(layer, key);
      for (let i = 0; parent && i < MAX_FALLBACK_LEVELS; i++, parent = parentKey(layer, parent)) {
        const tex = readyTexture(parent);
        if (tex) {
          cache.current.get(tileKeyId(parent))!.lastUsed = now;
          add(parent, tex, layer);
          standIn = true;
          break;
        }
      }
      // Transparent sources always need something underneath (e.g. oceans in Landsat).
      if (!standIn || layer.transparent || layer.blackIsNoData) {
        const lat = (key.north + key.south) / 2;
        const lon = (key.west + key.east) / 2;
        for (const c of [...coarser].reverse()) {
          const under = coveringKey(c, c.maxLevel, lat, lon);
          const tex = readyTexture(under);
          if (under && tex) {
            cache.current.get(tileKeyId(under))!.lastUsed = now;
            add(under, tex, c);
            break;
          }
          if (under && !cache.current.has(tileKeyId(under))) requestTile(c, under, now);
        }
      }
    }

    evictOld(cache.current, new Set(toDraw.keys()));
    const next = [...toDraw.values()].sort((a, b) => layerRank(layers, a.key) - layerRank(layers, b.key) || a.key.z - b.key.z);
    setShown((prev) => (sameTiles(prev, next) ? prev : next));
    setLoading(pending > 0);
    setSourceId(wanted.length ? layer.id : undefined);
  });

  useEffect(() => {
    onStatusChange?.({ active: shown.length > 0, loading, sourceId: shown.length ? sourceId : undefined });
  }, [shown.length, loading, sourceId, onStatusChange]);

  // Free GPU memory when leaving the Explore screen.
  useEffect(() => {
    const entries = cache.current;
    return () => {
      for (const entry of entries.values()) entry.texture?.dispose();
      entries.clear();
      onStatusChange?.({ active: false, loading: false });
    };
  }, [onStatusChange]);

  return (
    <group ref={group}>
      {shown.map(({ key, texture, transparent }) => (
        <TileMesh key={tileKeyId(key)} tile={key} texture={texture} transparent={transparent} layerIndex={layerRankByKey(layers, key)} radiusAt={radiusAt} />
      ))}
    </group>
  );
}

function layerRankByKey(layers: TileLayerDef[], key: TileKey): number {
  return Math.max(0, layers.findIndex((l) => l.id === key.source));
}

/** Draw order: coarser sources first, then sharper ones on top. */
function layerRank(layers: TileLayerDef[], key: TileKey): number {
  return layerRankByKey(layers, key) * 100;
}

function sameTiles(a: ShownTile[], b: ShownTile[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (tileKeyId(a[i].key) !== tileKeyId(b[i].key)) return false;
  return true;
}

function evictOld(cache: Map<string, CacheEntry>, inUse: Set<string>) {
  if (cache.size <= CACHE_LIMIT) return;
  const oldest = [...cache.entries()].filter(([id]) => !inUse.has(id)).sort((a, b) => a[1].lastUsed - b[1].lastUsed);
  for (const [id, entry] of oldest.slice(0, cache.size - CACHE_LIMIT)) {
    entry.texture?.dispose();
    cache.delete(id);
  }
}
