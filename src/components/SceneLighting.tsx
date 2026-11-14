import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, type DirectionalLight } from 'three';

interface SceneLightingProps {
  /** On the Explore screen the light follows the camera so the area in view is always lit. */
  followCamera: boolean;
}

/** Fixed "Sun" direction used on the Select and Overview screens (upper left, in front). */
const SUN_POSITION = new Vector3(-6, 2.5, 5);
const offset = new Vector3();
const up = new Vector3();
const right = new Vector3();

/**
 * Scene lights.
 * - Select / Overview: a fixed Sun, so worlds show a realistic day side and night side.
 * - Explore: the light sits just above and to the left of the camera, like a headlamp,
 *   so whatever you look at is lit and its relief is visible. This is a viewing aid,
 *   not the real direction of the Sun (noted in docs/notes.md).
 */
export function SceneLighting({ followCamera }: SceneLightingProps) {
  const sun = useRef<DirectionalLight>(null);

  useFrame(({ camera }) => {
    const light = sun.current;
    if (!light) return;
    if (!followCamera) {
      light.position.copy(SUN_POSITION);
      return;
    }
    // Camera's own up and right directions, so the light comes from the upper left of the view.
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const d = camera.position.length();
    offset.copy(up).multiplyScalar(d * 0.6).addScaledVector(right, -d * 0.6);
    light.position.copy(camera.position).add(offset);
  });

  return (
    <>
      <directionalLight ref={sun} position={SUN_POSITION} intensity={3} />
      {/* Faint fill so the night side is not pure black (a little brighter while exploring). */}
      <ambientLight intensity={followCamera ? 0.2 : 0.06} />
    </>
  );
}
