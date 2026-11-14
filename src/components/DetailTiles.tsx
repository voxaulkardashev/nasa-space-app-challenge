import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { ClampToEdgeWrapping, SRGBColorSpace, TextureLoader, Vector3, type Group, type Texture } from 'three';
import type { TileLayerDef } from '../data/tileLayers';
import { vectorToLatLon } from '../lib/geo';
import { tileKeyId, visibleTiles, type TileKey } from '../lib/tiles';
import { TileMesh } from './TileMesh';

interface DetailTilesProps {
  layer: TileLayerDef;
  /** Reports whether close-up tiles are currently shown (for the on-screen credit). */
  onActiveChange?: (active: boolean) => void;
}

/** How often (seconds) to re-check which tiles the view needs. */
const CHECK_INTERVAL = 0.3;
/** Keep at most this many downloaded tiles in memory. */
const CACHE_LIMIT = 300;

const loader = new TextureLoader().setCrossOrigin('anonymous');
const localCamera = new Vector3();

interface CacheEntry {
  texture: Texture | null;
  failed: boolean;
  lastUsed: number;
}

/**
 * Streams sharper NASA map tiles for the part of the world in view.
 * Must be placed inside the world's rotating group (same coordinates as the
 * unit sphere). Tiles appear only once downloaded, so the normal globe always
 * shows underneath while they load.
 */
export function DetailTiles({ layer, onActiveChange }: DetailTilesProps) {
  const group = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const cache = useRef(new Map<string, CacheEntry>());
  const sinceCheck = useRef(CHECK_INTERVAL);
  /** Tiles that are both needed for the current view and already downloaded. */
  const [shown, setShown] = useState<{ key: TileKey; texture: Texture }[]>([]);

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
    const next = visibleTiles(layer, centre, distance, size.height, size.width / size.height);

    const now = performance.now();
    for (const key of next) {
      const id = tileKeyId(key);
      const entry = cache.current.get(id);
      if (entry) {
        entry.lastUsed = now;
        continue;
      }
      const fresh: CacheEntry = { texture: null, failed: false, lastUsed: now };
      cache.current.set(id, fresh);
      loader.load(
        layer.url(key.z, key.row, key.col),
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
          // Crop tiles that overhang the edge of the map (GIBS at 180°E / 90°S).
          texture.repeat.set(key.uSpan, key.vSpan);
          texture.offset.set(0, 1 - key.vSpan);
          fresh.texture = texture;
          sinceCheck.current = CHECK_INTERVAL; // redraw on the next frame
        },
        undefined,
        () => {
          fresh.failed = true;
        },
      );
    }
    evictOld(cache.current, new Set(next.map(tileKeyId)));

    const ready = next.flatMap((key) => {
      const texture = cache.current.get(tileKeyId(key))?.texture;
      return texture ? [{ key, texture }] : [];
    });
    setShown((prev) => (sameTiles(prev.map((t) => t.key), ready.map((t) => t.key)) ? prev : ready));
  });

  useEffect(() => {
    onActiveChange?.(shown.length > 0);
  }, [shown.length, onActiveChange]);

  // Free GPU memory when leaving the Explore screen.
  useEffect(() => {
    const entries = cache.current;
    return () => {
      for (const entry of entries.values()) entry.texture?.dispose();
      entries.clear();
      onActiveChange?.(false);
    };
  }, [onActiveChange]);

  return (
    <group ref={group}>
      {shown.map(({ key, texture }) => (
        <TileMesh key={tileKeyId(key)} tile={key} texture={texture} />
      ))}
    </group>
  );
}

function sameTiles(a: TileKey[], b: TileKey[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (tileKeyId(a[i]) !== tileKeyId(b[i])) return false;
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
