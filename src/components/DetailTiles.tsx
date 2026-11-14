import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import {
  ClampToEdgeWrapping,
  LoadingManager,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type Group,
  type Texture,
} from 'three';
import type { TileLayerDef } from '../data/tileLayers';
import { vectorToLatLon } from '../lib/geo';
import { parentKey, tileKeyId, visibleTiles, type DetailStatus, type TileKey } from '../lib/tiles';
import { TileMesh } from './TileMesh';

interface DetailTilesProps {
  layer: TileLayerDef;
  /** Reports whether close-up tiles are showing and whether more are downloading. */
  onStatusChange?: (status: DetailStatus) => void;
}

/** How often (seconds) to re-check which tiles the view needs. */
const CHECK_INTERVAL = 0.3;
/** Keep at most this many downloaded tiles in memory. */
const CACHE_LIMIT = 300;
/** How many zoom levels up to look for a blurrier stand-in while a tile downloads. */
const MAX_FALLBACK_LEVELS = 4;
/** Keep the stand-in for this long (ms) after the sharp tile arrives, while it fades in. */
const FADE_OVERLAP_MS = 600;

/**
 * Tiles use their OWN loading manager. The default one drives the full-screen
 * "Loading NASA imagery" overlay; tiles must load quietly in the background.
 */
const loader = new TextureLoader(new LoadingManager()).setCrossOrigin('anonymous');
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
}

/**
 * Streams sharper NASA map tiles for the part of the world in view, the way
 * online maps do: nothing blocks the screen, new tiles fade in, and while a
 * sharp tile is still downloading its blurrier "parent" tile (if already
 * downloaded) stays in its place, so the view never drops back to blurry.
 *
 * Must be placed inside the world's rotating group (same coordinates as the
 * unit sphere). The normal globe always shows underneath.
 */
export function DetailTiles({ layer, onStatusChange }: DetailTilesProps) {
  const group = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const cache = useRef(new Map<string, CacheEntry>());
  const sinceCheck = useRef(CHECK_INTERVAL);
  const [shown, setShown] = useState<ShownTile[]>([]);
  const [loading, setLoading] = useState(false);

  /** Starts downloading a tile unless it is already cached (or being downloaded). */
  const requestTile = (key: TileKey, now: number) => {
    const id = tileKeyId(key);
    const existing = cache.current.get(id);
    if (existing) {
      existing.lastUsed = now;
      return;
    }
    const entry: CacheEntry = { key, texture: null, failed: false, lastUsed: now, loadedAt: 0 };
    cache.current.set(id, entry);
    loader.load(
      layer.url(key.z, key.row, key.col),
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
        // Crop tiles that overhang the edge of the map (GIBS at 180°E / 90°S).
        texture.repeat.set(key.uSpan, key.vSpan);
        texture.offset.set(0, 1 - key.vSpan);
        entry.texture = texture;
        entry.loadedAt = performance.now();
        sinceCheck.current = CHECK_INTERVAL; // redraw on the next frame
      },
      undefined,
      () => {
        entry.failed = true; // e.g. offline: the normal globe simply stays visible
      },
    );
  };

  useFrame(({ camera }, delta) => {
    sinceCheck.current += delta;
    const g = group.current;
    if (!g || sinceCheck.current < CHECK_INTERVAL) return;
    sinceCheck.current = 0;

    // Camera position in the world's own coordinates (radius 1, rotation undone).
    g.updateWorldMatrix(true, false);
    localCamera.copy(camera.position);
    g.worldToLocal(localCamera);
    const distance = localCamera.length();
    const centre = vectorToLatLon(localCamera);
    const wanted = visibleTiles(layer, centre, distance, size.height, size.width / size.height);

    const now = performance.now();
    for (const key of wanted) requestTile(key, now);

    // Build the list to draw: each wanted tile if ready, otherwise its nearest ready ancestor.
    const toDraw = new Map<string, ShownTile>();
    let pending = 0;
    for (const key of wanted) {
      const entry = cache.current.get(tileKeyId(key));
      if (entry?.texture) {
        toDraw.set(tileKeyId(key), { key, texture: entry.texture });
        if (now - entry.loadedAt > FADE_OVERLAP_MS) continue; // fully faded in: no stand-in needed
      } else if (!entry?.failed) {
        pending++;
      }
      let parent = parentKey(layer, key);
      for (let i = 0; parent && i < MAX_FALLBACK_LEVELS; i++, parent = parentKey(layer, parent)) {
        const parentEntry = cache.current.get(tileKeyId(parent));
        if (parentEntry?.texture) {
          parentEntry.lastUsed = now;
          toDraw.set(tileKeyId(parent), { key: parent, texture: parentEntry.texture });
          break;
        }
      }
    }

    evictOld(cache.current, new Set(toDraw.keys()));
    const next = [...toDraw.values()].sort((a, b) => a.key.z - b.key.z); // coarse first, sharp on top
    setShown((prev) => (sameTiles(prev, next) ? prev : next));
    setLoading(pending > 0);
  });

  useEffect(() => {
    onStatusChange?.({ active: shown.length > 0, loading });
  }, [shown.length, loading, onStatusChange]);

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
      {shown.map(({ key, texture }) => (
        <TileMesh key={tileKeyId(key)} tile={key} texture={texture} />
      ))}
    </group>
  );
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
