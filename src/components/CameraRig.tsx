import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import { MathUtils, PerspectiveCamera, Vector3, type Group } from 'three';
import { latLonToVector, type LatLon } from '../lib/geo';
import type { WorldId } from '../data/types';
import { usesBottomPanel } from '../lib/layout';
import type { OrbitControlsRef } from './SpaceScene';

interface CameraRigProps {
  /** True while a single world is being viewed (overview / explore). */
  focused: boolean;
  /** True when the user may rotate/zoom (OrbitControls is in charge). */
  userControlled: boolean;
  selectCameraDistance: number;
  /** Radius (scene units) of the world being viewed. */
  surfaceRadius: number;
  controlsRef: RefObject<OrbitControlsRef | null>;
  /** Changes each time the camera should fly to `flyTarget`. */
  flyRequest: number;
  flyTarget: LatLon | null;
  /** The rotating groups of each world (to find where the site is right now). */
  spinnersRef: RefObject<Partial<Record<WorldId, Group>>>;
  selectedId: WorldId | null;
  /** Sidebar width in px (desktop). */
  panelWidth: number;
}

const target = new Vector3();
const flyEnd = new Vector3();

/**
 * Moves the camera smoothly between screens and to sites.
 *
 * - On the Select screen it glides back to a fixed front view.
 * - When a world is focused it shifts the picture sideways (desktop) or
 *   upwards (phone) so the world is not hidden behind the info panel.
 *   This uses a "view offset", which moves the image without moving the
 *   orbit centre, so rotating still spins around the middle of the world.
 * - Near the surface it slows rotation down, so dragging stays precise.
 * - When asked, it flies the camera round to look straight down at a site.
 */
export function CameraRig({
  focused,
  userControlled,
  selectCameraDistance,
  surfaceRadius,
  controlsRef,
  flyRequest,
  flyTarget,
  spinnersRef,
  selectedId,
  panelWidth,
}: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const progress = useRef(0);
  const flyTime = useRef(-1);

  // Start a new flight whenever flyRequest changes.
  useEffect(() => {
    if (flyRequest > 0) flyTime.current = 0;
  }, [flyRequest]);

  // Stop a flight as soon as the user starts dragging or zooming, so it never fights them.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cancel = () => {
      flyTime.current = -1;
    };
    controls.addEventListener('start', cancel);
    return () => controls.removeEventListener('start', cancel);
  }, [controlsRef]);

  useFrame((_, delta) => {
    progress.current = MathUtils.damp(progress.current, focused ? 1 : 0, 4, delta);

    if (!userControlled) {
      camera.position.set(
        MathUtils.damp(camera.position.x, 0, 3, delta),
        MathUtils.damp(camera.position.y, 0, 3, delta),
        MathUtils.damp(camera.position.z, selectCameraDistance, 3, delta),
      );
      camera.lookAt(0, 0, 0);
    }

    // Fly to a site: swing round (keeping the current height, but not too far out).
    const flySpinner = selectedId ? spinnersRef.current[selectedId] : undefined;
    if (flyTime.current >= 0 && flyTarget && flySpinner && userControlled) {
      flyTime.current += delta;
      flySpinner.updateWorldMatrix(true, false);
      target.copy(latLonToVector(flyTarget.lat, flyTarget.lon, 1));
      flySpinner.localToWorld(target);
      const distance = MathUtils.clamp(camera.position.length(), surfaceRadius * 1.6, surfaceRadius * 2.6);
      flyEnd.copy(target).normalize().multiplyScalar(distance);
      const k = 1 - Math.exp(-4 * delta);
      // Move along the sphere (slerp-like) rather than straight through the planet.
      const len = MathUtils.lerp(camera.position.length(), distance, k);
      camera.position.lerp(flyEnd, k).setLength(len);
      if (camera.position.distanceTo(flyEnd) < 0.01 || flyTime.current > 3) flyTime.current = -1;
    }

    const controls = controlsRef.current;
    if (controls) {
      // Slower rotation close to the surface (height above surface ÷ radius).
      const height = Math.max(camera.position.length() - surfaceRadius, 0.001);
      controls.rotateSpeed = MathUtils.clamp((height / surfaceRadius) * 0.6, 0.02, 0.6);
    }

    if (camera instanceof PerspectiveCamera) {
      const { width, height } = size;
      const bottomPanel = usesBottomPanel(width);
      // Centre the world in the space left of the sidebar (sidebar + its 20 px margin, halved).
      const shiftX = bottomPanel ? 0 : Math.min((panelWidth + 20) / 2, width * 0.3) * progress.current;
      const shiftY = bottomPanel ? height * 0.2 * progress.current : 0;
      camera.setViewOffset(width, height, shiftX, shiftY, width, height);
    }
  });

  return null;
}
