import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { SRGBColorSpace, type Texture } from 'three';
import type { World } from '../data/types';
import { assetUrl } from '../data/worlds';
import type { ElevationGrid } from '../lib/elevationGrid';
import { buildTopoGeometry } from '../lib/topography';

/** Colour maps are stored in sRGB; anisotropy keeps them sharp where the sphere curves away. */
function configureColorMap(texture: Texture, anisotropy: number) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
}

interface TopoSurfaceProps {
  world: World;
  grid: ElevationGrid;
  exaggeration: number;
}

/**
 * Topography view: the NASA colour map draped over a sphere that is raised and
 * lowered by the world's NASA elevation grid (heights exaggerated, as stated on screen).
 */
export function TopoSurface({ world, grid, exaggeration }: TopoSurfaceProps) {
  const gl = useThree((s) => s.gl);
  const map = useTexture(assetUrl(world.textures.color)) as Texture;
  const geometry = useMemo(() => buildTopoGeometry(grid, exaggeration, world.meanRadiusKm), [grid, exaggeration, world.meanRadiusKm]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => configureColorMap(map, Math.min(8, gl.capabilities.getMaxAnisotropy())), [map, gl]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial map={map} roughness={1} metalness={0} />
    </mesh>
  );
}
