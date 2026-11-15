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
import { DEFAULT_EXAGGERATION, TOPOGRAPHY } from '../data/elevation';
import { MAP_LABELS } from '../data/mapLabels';
import { maxRaise, type ViewMode } from '../lib/topography';
import { useElevationGrid } from '../lib/useElevationGrid';
import { CameraRig } from './CameraRig';
import { PlanetBody } from './PlanetBody';
import { PlanetLabel } from './PlanetLabel';
import { SceneLighting } from './SceneLighting';

interface SpaceSceneProps {
  screen: Screen;
  selectedId: WorldId | null;
  hoveredId: WorldId | null;
  /** Each world's selected site (Explore). */
  sites: Partial<Record<WorldId, SelectedSite>>;
  /** Explore side-by-side mode. */
  sideBySide: boolean;
  /** Increases each time the camera should fly to the current site. */
  flyRequest: number;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
  onPick: (worldId: WorldId, site: LatLon) => void;
  onDetailStatusChange: (status: DetailStatus) => void;
  activeLayers: GeoLayerId[];
  onChooseFeatured: (site: FeaturedSite) => void;
  /** Sidebar width in px, so the globe is centred in the space beside it. */
  panelWidth: number;
  /** Globe, flat 2D map (drawn outside the 3D scene) or raised topography. */
  viewMode: ViewMode;
  /** Show place names (cities, named features). */
  showLabels: boolean;
  /** Topography view: vertical exaggeration per world. */
  exaggeration: Record<WorldId, number>;
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
  sites,
  sideBySide,
  flyRequest,
  onHoverChange,
  onSelect,
  onPick,
  onDetailStatusChange,
  activeLayers,
  onChooseFeatured,
  panelWidth,
  viewMode,
  showLabels,
  exaggeration,
}: SpaceSceneProps) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const controlsRef = useRef<OrbitControlsRef>(null);
  const spinners = useRef<Partial<Record<WorldId, Group>>>({});

  const onSelectScreen = screen === 'select';
  const exploring = screen === 'explore';
  // The 2D map is drawn as a web page layer, so the globes step aside.
  const flat = viewMode === 'map2d' && !onSelectScreen;
  const layout = computeLayout(
    WORLDS.map((w) => w.id),
    screen,
    selectedId,
    aspect,
    sideBySide,
    flat,
  );
  const userControlled = !flat && (screen === 'overview' || (exploring && !sideBySide));
  const topoOn = viewMode === 'topo' && !onSelectScreen && !sideBySide;
  const topoState = useElevationGrid(selectedId, topoOn, TOPOGRAPHY);
  const topoGrid = topoOn && topoState.status === 'ready' ? topoState.grid : null;
  const exag = selectedId ? (exaggeration[selectedId] ?? DEFAULT_EXAGGERATION[selectedId]) : 1;
  const topoDataset = selectedId ? TOPOGRAPHY[selectedId] : undefined;
  const raise = topoGrid && topoDataset && selectedId ? maxRaise(topoDataset.maxHeightM, exag, WORLDS.find((w) => w.id === selectedId)!.meanRadiusKm) : 0;
  const site = selectedId ? (sites[selectedId] ?? null) : null;
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
        const labelled = featuredSitesFor(world.id).filter((f) => f.layers.some((l) => activeLayers.includes(l)));
        const featuredShown = exploring && (isFocused || sideBySide);
        const placeLabels =
          showLabels && !onSelectScreen && (isFocused || (exploring && sideBySide))
            ? MAP_LABELS[world.id].filter((l) => !(featuredShown && l.featuredId && labelled.some((f) => f.id === l.featuredId)))
            : undefined;
        return (
          <group key={world.id}>
            <PlanetBody
              world={world}
              pose={pose}
              hovered={hoveredId === world.id}
              selected={isFocused}
              interactive={onSelectScreen}
              pickable={exploring && (isFocused || sideBySide)}
              sideBySide={exploring && sideBySide}
              spinning={!exploring}
              site={exploring ? (sites[world.id] ?? null) : null}
              onSpinnerReady={(id, g) => {
                if (g) spinners.current[id] = g;
                else delete spinners.current[id];
              }}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
              onPick={onPick}
              onDetailStatusChange={onDetailStatusChange}
              labelledSites={labelled}
              placeLabels={placeLabels}
              topo={isFocused && topoGrid ? { grid: topoGrid, exaggeration: exag } : null}
              activeLayers={activeLayers}
              selectedSiteId={sites[world.id]?.featuredId}
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
        flyTarget={exploring && !sideBySide && site ? site : null}
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
        minDistance={exploring && !sideBySide ? focusedScale * (1.003 + raise) : 3.4}
        maxDistance={16}
      />
    </>
  );
}
