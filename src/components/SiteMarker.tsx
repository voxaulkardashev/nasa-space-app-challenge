import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Quaternion, Vector3, type Group } from 'three';
import { latLonToVector, type LatLon } from '../lib/geo';

interface SiteMarkerProps {
  site: LatLon;
}

const worldPos = new Vector3();

/**
 * A glowing ring and pin standing on the surface at the selected site.
 * It lives inside the rotating world, so it stays glued to its spot, and it
 * resizes with the camera distance so it is visible at any zoom.
 */
export function SiteMarker({ site }: SiteMarkerProps) {
  const group = useRef<Group>(null);
  const ring = useRef<Group>(null);

  const { position, quaternion } = useMemo(() => {
    const normal = latLonToVector(site.lat, site.lon);
    return {
      position: normal.clone().multiplyScalar(1.002),
      // Turn the marker so its "up" (Y) points straight out of the surface.
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal),
    };
  }, [site.lat, site.lon]);

  useFrame(({ camera, clock }) => {
    const g = group.current;
    if (!g || !g.parent) return;
    g.getWorldPosition(worldPos);
    const parentScale = g.parent.getWorldScale(new Vector3()).x || 1;
    const distance = camera.position.distanceTo(worldPos);
    // Constant size on screen, whatever the zoom.
    g.scale.setScalar(MathUtils.clamp(distance * 0.018, 0.002, 0.2) / parentScale);
    if (ring.current) {
      const pulse = 1 + 0.25 * Math.sin(clock.elapsedTime * 3);
      ring.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <group ref={group} position={position} quaternion={quaternion}>
      <group ref={ring}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.25, 48]} />
          <meshBasicMaterial color="#ffd166" transparent opacity={0.9} />
        </mesh>
      </group>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.38, 16, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
