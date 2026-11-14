import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { NoColorSpace, SRGBColorSpace, type Texture } from 'three';
import { assetUrl } from '../data/worlds';
import type { World } from '../data/types';

/** Sets colour handling and sharpness (anisotropy helps where the sphere curves away). */
function configureTexture(texture: Texture, colorSpace: string, anisotropy: number) {
  texture.colorSpace = colorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
}

interface PlanetSurfaceProps {
  world: World;
}

/**
 * A unit sphere wrapped in the world's NASA colour map, with optional
 * elevation-based bump shading. Suspends (shows the loading screen) while
 * the images download.
 */
export function PlanetSurface({ world }: PlanetSurfaceProps) {
  const gl = useThree((state) => state.gl);
  const { color, elevation, bumpScale } = world.textures;

  const urls: Record<string, string> = { map: assetUrl(color) };
  if (elevation) urls.bumpMap = assetUrl(elevation);

  // useTexture returns an object with the same keys as `urls`.
  const textures = useTexture(urls) as Record<string, Texture>;
  const { map, bumpMap } = textures;

  useLayoutEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    // Colour maps are stored in sRGB; elevation maps are plain numbers.
    configureTexture(map, SRGBColorSpace, anisotropy);
    if (bumpMap) configureTexture(bumpMap, NoColorSpace, anisotropy);
  }, [map, bumpMap, gl]);

  return (
    <mesh>
      <sphereGeometry args={[1, 128, 64]} />
      <meshStandardMaterial map={map} bumpMap={bumpMap ?? null} bumpScale={bumpScale} roughness={1} metalness={0} />
    </mesh>
  );
}
