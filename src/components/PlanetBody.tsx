import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { MathUtils, type Group } from 'three';
import type { World, WorldId } from '../data/types';
import type { BodyPose } from '../lib/layout';
import { HighlightGlow } from './HighlightGlow';
import { MissingTextureSphere } from './MissingTextureSphere';
import { PlanetSurface } from './PlanetSurface';
import { TextureErrorBoundary } from './TextureErrorBoundary';

interface PlanetBodyProps {
  world: World;
  pose: BodyPose;
  hovered: boolean;
  selected: boolean;
  /** Only clickable on the Select screen. */
  interactive: boolean;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
}

/** Slow decorative spin (radians per second). Positive = west-to-east, like the real bodies. */
const SPIN_SPEED = 0.04;

/** One world in the scene: glides to its layout pose, spins slowly, reacts to hover and click. */
export function PlanetBody({ world, pose, hovered, selected, interactive, onHoverChange, onSelect }: PlanetBodyProps) {
  const group = useRef<Group>(null);
  const spinner = useRef<Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const [x, y, z] = pose.position;
    const targetScale = pose.scale * (hovered && interactive ? 1.07 : 1);
    const lambda = 4; // higher = faster transition
    g.position.set(
      MathUtils.damp(g.position.x, x, lambda, delta),
      MathUtils.damp(g.position.y, y, lambda, delta),
      MathUtils.damp(g.position.z, z, lambda, delta),
    );
    const s = MathUtils.damp(g.scale.x, targetScale, lambda, delta);
    g.scale.setScalar(s);
    g.visible = s > 0.01;
    if (spinner.current) spinner.current.rotation.y += SPIN_SPEED * delta;
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    onHoverChange(world.id);
  };
  const handleOut = () => {
    if (interactive) onHoverChange(null);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    onSelect(world.id);
  };

  // Rotate so the chosen longitude faces the camera (see docs/notes.md for the maths).
  const initialRotation = -Math.PI / 2 - MathUtils.degToRad(world.initialLongitudeDeg);
  const glowStrength = interactive ? (hovered ? 1 : 0) : selected ? 0.25 : 0;

  return (
    <group ref={group} scale={0}>
      <group ref={spinner} rotation={[0, initialRotation, 0]}>
        <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
          <TextureErrorBoundary
            fallback={<MissingTextureSphere worldName={world.name} path={`public/${world.textures.color}`} />}
          >
            <Suspense fallback={null}>
              <PlanetSurface world={world} />
            </Suspense>
          </TextureErrorBoundary>
        </group>
      </group>
      <HighlightGlow color={world.highlightColor} strength={glowStrength} />
    </group>
  );
}
