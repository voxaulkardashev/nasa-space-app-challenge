import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, type MeshStandardMaterial, type Texture } from 'three';
import type { TileKey } from '../lib/tiles';

interface TileMeshProps {
  tile: TileKey;
  texture: Texture;
  /** Tile has see-through (no-data) areas: keep it transparent after fading in. */
  transparent?: boolean;
  /** Position of its source in the world's stack (0 = coarsest); sharper sources sit higher. */
  layerIndex?: number;
}

const DEG = Math.PI / 180;

/**
 * One map tile drawn as a curved patch of the sphere. Three.js's sphere
 * shape can be limited to a longitude/latitude window, which matches the
 * tiles exactly (phi = longitude + 180°, theta = 90° − latitude).
 *
 * Sharper tiles sit a hair higher than blurrier ones, so they always draw on
 * top. New tiles fade in over about a third of a second, like an online map.
 */
export function TileMesh({ tile, texture, transparent = false, layerIndex = 0 }: TileMeshProps) {
  const materialRef = useRef<MeshStandardMaterial>(null);

  const args = useMemo(() => {
    const segments = Math.max(4, Math.round((tile.east - tile.west) / 2) + 4);
    // Each source gets its own shell; within a source, sharper levels sit slightly higher.
    // (Tiny gaps are enough: the camera's near plane follows the zoom, keeping depth precise.)
    const radius = 1.00004 + layerIndex * 0.00004 + tile.z * 0.000002;
    return [
      radius,
      segments,
      segments,
      (tile.west + 180) * DEG,
      (tile.east - tile.west) * DEG,
      (90 - tile.north) * DEG,
      (tile.north - tile.south) * DEG,
    ] as const;
  }, [tile, layerIndex]);

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m || m.opacity >= 1) return;
    m.opacity = MathUtils.damp(m.opacity, 1, 10, delta);
    if (m.opacity > 0.99) {
      // Fully faded in: draw as a normal solid surface from now on.
      m.opacity = 1;
      if (!transparent) {
        m.transparent = false;
        m.needsUpdate = true;
      }
    }
  });

  return (
    <mesh renderOrder={1 + layerIndex * 20 + tile.z}>
      <sphereGeometry args={args} />
      <meshStandardMaterial ref={materialRef} map={texture} roughness={1} metalness={0} transparent opacity={0} />
    </mesh>
  );
}
