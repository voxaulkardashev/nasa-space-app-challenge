import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useRef, type ComponentRef } from 'react';
import type { Group } from 'three';
import { WORLDS } from '../data/worlds';
import { featuredSitesFor } from '../data/featuredSites';
import type { FeaturedSite, GeoLayerId, WorldId } from '../data/types';
import type { LatLon } from '../lib/geo';
import { computeLayout } from '../lib/layout';
import type { Screen, SelectedSite } from '../lib/navigation';
import type { DetailStatus } from '../lib/tiles';
import { CameraRig } from './CameraRig';
import { PlanetBody } from './PlanetBody';
import { PlanetLabel } from './PlanetLabel';
import { SceneLighting } from './SceneLighting';

interface SpaceSceneProps {
  screen: Screen;
  selectedId: WorldId | null;
  hoveredId: WorldId | null;
  site: SelectedSite | null;
  /** Increases each time the camera should fly to the current site. */
  flyRequest: number;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
  onPick: (site: LatLon) => void;
  onDetailStatusChange: (status: DetailStatus) => void;
  activeLayers: GeoLayerId[];
  onChooseFeatured: (site: FeaturedSite) => void;
  /** Sidebar width in px, so the globe is centred in the space beside it. */
  panelWidth: number;
}

export type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

/**
 * Starting camera settings. Defined once, outside the component: if a new
 * object were passed on every render, React Three Fiber could re-apply it and
 * snap the camera back to its starting position, undoing the user's zoom.
 */
const CAMERA_SETTINGS = { position: [0, 0, 10] as [number, number, number], fov: 45, near: 0.01, far: 500 };

/**
 * The single 3D canvas that stays behind every screen. Keeping one canvas
 * means textures load once and the camera can glide between screens.
 */
export function SpaceScene(props: SpaceSceneProps) {
  return (
    <div className="space-scene">
      <Canvas
        camera={CAMERA_SETTINGS}
        dpr={[1, 2]}
        onPointerMissed={() => props.onHoverChange(null)}
      >
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}

function SceneContents({
  screen,
  selectedId,
  hoveredId,
  site,
  flyRequest,
  onHoverChange,
  onSelect,
  onPick,
  onDetailStatusChange,
  activeLayers,
  onChooseFeatured,
  panelWidth,
}: SpaceSceneProps) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const controlsRef = useRef<OrbitControlsRef>(null);
  const spinners = useRef<Partial<Record<WorldId, Group>>>({});

  const layout = computeLayout(
    WORLDS.map((w) => w.id),
    screen,
    selectedId,
    aspect,
  );
  const onSelectScreen = screen === 'select';
  const exploring = screen === 'explore';
  const userControlled = screen === 'overview' || exploring;
  const focusedScale = selectedId ? layout.bodies[selectedId].scale : 1;

  return (
    <>
      <SceneLighting followCamera={exploring} />

      {/* Decorative random starfield (not a real star catalogue). */}
      <Stars radius={120} depth={60} count={5000} factor={3.5} saturation={0} fade speed={0.4} />

      {WORLDS.map((world) => {
        const pose = layout.bodies[world.id];
        const [x, y, z] = pose.position;
        const isFocused = selectedId === world.id;
        return (
          <group key={world.id}>
            <PlanetBody
              world={world}
              pose={pose}
              hovered={hoveredId === world.id}
              selected={isFocused}
              interactive={onSelectScreen}
              pickable={exploring && isFocused}
              spinning={!exploring}
              site={exploring && site?.worldId === world.id ? site : null}
              onSpinnerReady={(id, g) => {
                if (g) spinners.current[id] = g;
                else delete spinners.current[id];
              }}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
              onPick={onPick}
              onDetailStatusChange={onDetailStatusChange}
              labelledSites={featuredSitesFor(world.id).filter((f) => f.layers.some((l) => activeLayers.includes(l)))}
              activeLayers={activeLayers}
              selectedSiteId={site?.worldId === world.id ? site.featuredId : undefined}
              onChooseFeatured={onChooseFeatured}
            />
            <PlanetLabel
              world={world}
              position={[x, y - pose.scale - layout.labelGap, z]}
              visible={onSelectScreen}
              hovered={hoveredId === world.id}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
            />
          </group>
        );
      })}

      <CameraRig
        focused={!onSelectScreen}
        userControlled={userControlled}
        selectCameraDistance={layout.selectCameraDistance}
        surfaceRadius={focusedScale}
        controlsRef={controlsRef}
        flyRequest={flyRequest}
        flyTarget={exploring && site ? site : null}
        spinnersRef={spinners}
        panelWidth={panelWidth}
        selectedId={selectedId}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={userControlled}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        // Explore lets you zoom right down towards the surface.
        minDistance={exploring ? focusedScale * 1.04 : 3.4}
        maxDistance={16}
      />
    </>
  );
}
