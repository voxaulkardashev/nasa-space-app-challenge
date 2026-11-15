import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { MarsGrid } from '../lib/weather/marsNow';
import { paintMarsGrid } from '../lib/weather/marsOverlayCanvas';

interface MarsWeatherOverlayProps {
  grid: MarsGrid;
}

/** The current NASA model grid (e.g. air temperature) as a see-through colour layer on the Mars globe. */
export function MarsWeatherOverlay({ grid }: MarsWeatherOverlayProps) {
  const texture = useMemo(() => {
    const t = new CanvasTexture(paintMarsGrid(grid));
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [grid]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    // Just above the surface and the close-up tiles; clicks still reach the globe underneath.
    <mesh renderOrder={200} raycast={() => null}>
      <sphereGeometry args={[1.0008, 128, 64]} />
      <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}
