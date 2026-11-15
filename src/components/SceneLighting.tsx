import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Vector3, type AmbientLight, type DirectionalLight } from 'three';
import type { Screen } from '../lib/navigation';

interface SceneLightingProps {
  screen: Screen;
}

/** Fixed "Sun" direction used on the Select and Overview screens (upper left, in front). */
const SUN_POSITION = new Vector3(-6, 2.5, 5);
/** Opposite the Sun: a soft fill that lights the night side on the Overview. */
const FILL_POSITION = new Vector3(6, -1.5, 3);
const offset = new Vector3();
const up = new Vector3();
const right = new Vector3();

/** Light strengths per screen (the lights fade smoothly between them). */
const LEVELS: Record<Screen, { ambient: number; fill: number }> = {
  select: { ambient: 0.06, fill: 0 },
  // Overview: the night side stays darker than the day side but its surface is visible.
  overview: { ambient: 0.22, fill: 0.55 },
  explore: { ambient: 0.2, fill: 0 },
};

/**
 * Scene lights.
 * - Select / Overview: a fixed Sun, so worlds show a realistic day side and night side.
 *   On the Overview a soft, slightly blue fill light from the other side keeps the
 *   night side readable (a viewing aid, like a photo's fill light; not a real light source).
 * - Explore: the light sits just above and to the left of the camera, like a headlamp,
 *   so whatever you look at is lit and its relief is visible. This is a viewing aid,
 *   not the real direction of the Sun (noted in docs/notes.md).
 */
export function SceneLighting({ screen }: SceneLightingProps) {
  const sun = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const followCamera = screen === 'explore';

  useFrame(({ camera }, delta) => {
    const target = LEVELS[screen];
    if (ambient.current) ambient.current.intensity = MathUtils.damp(ambient.current.intensity, target.ambient, 3, delta);
    if (fill.current) fill.current.intensity = MathUtils.damp(fill.current.intensity, target.fill, 3, delta);

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
      <directionalLight ref={fill} position={FILL_POSITION} intensity={0} color="#b9c8ff" />
      {/* Faint fill so the night side is never pure black. */}
      <ambientLight ref={ambient} intensity={LEVELS.select.ambient} />
    </>
  );
}
