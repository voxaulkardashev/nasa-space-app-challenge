import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { TILE_LAYERS } from '../data/tileLayers';
import type { World, WorldId } from '../data/types';
import { vectorToLatLon, type LatLon } from '../lib/geo';
import type { BodyPose } from '../lib/layout';
import type { DetailStatus } from '../lib/tiles';
import { DetailTiles } from './DetailTiles';
import { HighlightGlow } from './HighlightGlow';
import { MissingTextureSphere } from './MissingTextureSphere';
import { PlanetSurface } from './PlanetSurface';
import { SiteMarker } from './SiteMarker';
import { TextureErrorBoundary } from './TextureErrorBoundary';

interface PlanetBodyProps {
  world: World;
  pose: BodyPose;
  hovered: boolean;
  selected: boolean;
  /** Select screen: hover highlight + click to choose this world. */
  interactive: boolean;
  /** Explore screen: click the surface to pick a site. */
  pickable: boolean;
  /** Slow decorative spin on/off (off while exploring so sites stay put). */
  spinning: boolean;
  /** Site marker to show on this world, if any. */
  site: LatLon | null;
  /** Receives the spinner group so the camera can fly to sites on it. */
  onSpinnerReady?: (id: WorldId, group: Group | null) => void;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
  onPick: (site: LatLon) => void;
  /** Told whether sharp close-up tiles are showing / loading (Explore screen only). */
  onDetailStatusChange?: (status: DetailStatus) => void;
}

/** Slow decorative spin (radians per second). Positive = west-to-east, like the real bodies. */
const SPIN_SPEED = 0.04;
/** A press that moves more than this many pixels is a drag (rotate), not a click. */
const CLICK_TOLERANCE_PX = 5;

/** One world in the scene: glides to its layout pose, spins slowly, reacts to hover and click. */
export function PlanetBody({
  world,
  pose,
  hovered,
  selected,
  interactive,
  pickable,
  spinning,
  site,
  onSpinnerReady,
  onHoverChange,
  onSelect,
  onPick,
  onDetailStatusChange,
}: PlanetBodyProps) {
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
    if (spinner.current && spinning) spinner.current.rotation.y += SPIN_SPEED * delta;
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
    if (interactive) {
      e.stopPropagation();
      onSelect(world.id);
      return;
    }
    if (pickable && e.delta <= CLICK_TOLERANCE_PX) {
      e.stopPropagation();
      // Convert the hit point into the sphere's own coordinates, then to lat/lon.
      const local = e.object.worldToLocal(e.point.clone());
      onPick(vectorToLatLon(local));
    }
  };

  // Rotate so the chosen longitude faces the camera (see docs/notes.md for the maths).
  const initialRotation = -Math.PI / 2 - MathUtils.degToRad(world.initialLongitudeDeg);
  const glowStrength = interactive ? (hovered ? 1 : 0) : selected && !pickable ? 0.25 : 0;

  return (
    <group ref={group} scale={0}>
      <group
        ref={(g) => {
          spinner.current = g;
          onSpinnerReady?.(world.id, g);
        }}
        rotation={[0, initialRotation, 0]}
      >
        <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
          <TextureErrorBoundary
            fallback={<MissingTextureSphere worldName={world.name} path={`public/${world.textures.color}`} />}
          >
            <Suspense fallback={null}>
              <PlanetSurface world={world} />
            </Suspense>
          </TextureErrorBoundary>
        </group>
        {pickable && TILE_LAYERS[world.id] && (
          <DetailTiles layer={TILE_LAYERS[world.id]!} onStatusChange={onDetailStatusChange} />
        )}
        {site && <SiteMarker site={site} />}
      </group>
      <HighlightGlow color={world.highlightColor} strength={glowStrength} />
    </group>
  );
}
