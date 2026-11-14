import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, type MeshStandardMaterial, type Texture } from 'three';
import type { TileKey } from '../lib/tiles';

interface TileMeshProps {
  tile: TileKey;
  texture: Texture;
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
export function TileMesh({ tile, texture }: TileMeshProps) {
  const materialRef = useRef<MeshStandardMaterial>(null);

  const args = useMemo(() => {
    const segments = Math.max(4, Math.round((tile.east - tile.west) / 2) + 4);
    const radius = 1.0003 + tile.z * 0.00002;
    return [
      radius,
      segments,
      segments,
      (tile.west + 180) * DEG,
      (tile.east - tile.west) * DEG,
      (90 - tile.north) * DEG,
      (tile.north - tile.south) * DEG,
    ] as const;
  }, [tile]);

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m || !m.transparent) return;
    m.opacity = MathUtils.damp(m.opacity, 1, 10, delta);
    if (m.opacity > 0.99) {
      // Fully faded in: draw as a normal solid surface from now on.
      m.opacity = 1;
      m.transparent = false;
      m.needsUpdate = true;
    }
  });

  return (
    <mesh renderOrder={1 + tile.z}>
      <sphereGeometry args={args} />
      <meshStandardMaterial ref={materialRef} map={texture} roughness={1} metalness={0} transparent opacity={0} />
    </mesh>
  );
}
