import { useMemo } from 'react';
import type { Texture } from 'three';
import type { TileKey } from '../lib/tiles';

interface TileMeshProps {
  tile: TileKey;
  texture: Texture;
}

const DEG = Math.PI / 180;
/** Tiles sit a hair above the base globe so they always draw on top of it. */
const TILE_RADIUS = 1.0004;

/**
 * One map tile drawn as a curved patch of the sphere. Three.js's sphere
 * shape can be limited to a longitude/latitude window, which matches the
 * tiles exactly (phi = longitude + 180°, theta = 90° − latitude).
 */
export function TileMesh({ tile, texture }: TileMeshProps) {
  const args = useMemo(() => {
    const segments = Math.max(4, Math.round((tile.east - tile.west) / 2) + 4);
    return [
      TILE_RADIUS,
      segments,
      segments,
      (tile.west + 180) * DEG,
      (tile.east - tile.west) * DEG,
      (90 - tile.north) * DEG,
      (tile.north - tile.south) * DEG,
    ] as const;
  }, [tile]);

  return (
    <mesh renderOrder={1}>
      <sphereGeometry args={args} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  );
}
