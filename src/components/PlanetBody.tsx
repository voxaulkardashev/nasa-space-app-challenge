import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { TILE_LAYERS } from '../data/tileLayers';
import type { FeaturedSite, GeoLayerId, World, WorldId } from '../data/types';
import { vectorToLatLon, type LatLon } from '../lib/geo';
import type { BodyPose } from '../lib/layout';
import type { DetailStatus } from '../lib/tiles';
import { DetailTiles } from './DetailTiles';
import { HighlightGlow } from './HighlightGlow';
import { MissingTextureSphere } from './MissingTextureSphere';
import { PlanetSurface } from './PlanetSurface';
import { SiteLabelsLayer } from './SiteLabelsLayer';
import { MapLabelsLayer } from './MapLabelsLayer';
import { RslMarkersLayer } from './RslMarkersLayer';
import type { RslSite } from '../data/rslSites';
import { TopoSurface } from './TopoSurface';
import { MarsWeatherOverlay } from './MarsWeatherOverlay';
import type { MarsGrid } from '../lib/weather/marsNow';
import type { MapLabel } from '../data/mapLabels';
import type { ElevationGrid } from '../lib/elevationGrid';
import { raisedRadius } from '../lib/topography';
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
  onPick: (worldId: WorldId, site: LatLon) => void;
  /** Explore side-by-side mode: drag to spin this globe, and turn it to face its site. */
  sideBySide?: boolean;
  /** Featured sites to label on this world (already filtered by layer). */
  labelledSites?: FeaturedSite[];
  activeLayers?: GeoLayerId[];
  selectedSiteId?: string;
  onChooseFeatured?: (site: FeaturedSite) => void;
  /** Told whether sharp close-up tiles are showing / loading (Explore screen only). */
  onDetailStatusChange?: (status: DetailStatus) => void;
  /** Topography view: raise the surface with this height grid and exaggeration. */
  topo?: { grid: ElevationGrid; exaggeration: number } | null;
  /** Place names (cities, named features) to show on this world. */
  placeLabels?: MapLabel[];
  /** Mars: current NASA model grid shown as a colour layer (not in the Topography view). */
  weatherOverlay?: MarsGrid | null;
  /** Mars, Explore: "RSL observed" markers (empty when the layer is off). */
  rslSites?: RslSite[];
  openRslId?: string | null;
  onOpenRsl?: (id: string) => void;
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
  labelledSites,
  activeLayers,
  selectedSiteId,
  onChooseFeatured,
  sideBySide = false,
  topo = null,
  placeLabels,
  weatherOverlay = null,
  rslSites,
  openRslId,
  onOpenRsl,
}: PlanetBodyProps) {
  const group = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const spinner = useRef<Group>(null);
  /** Side-by-side: rotation the globe is turning towards so its site faces the viewer. */
  const faceTarget = useRef<{ y: number; x: number } | null>(null);

  // In side-by-side mode, turn the globe so the selected site faces the camera.
  useEffect(() => {
    if (!sideBySide || !site || !spinner.current) {
      faceTarget.current = null;
      return;
    }
    const wanted = -Math.PI / 2 - MathUtils.degToRad(site.lon);
    const current = spinner.current.rotation.y;
    // Pick the equivalent angle closest to the current one, so it turns the short way.
    const y = wanted + Math.PI * 2 * Math.round((current - wanted) / (Math.PI * 2));
    faceTarget.current = { y, x: MathUtils.degToRad(site.lat) };
  }, [sideBySide, site?.lat, site?.lon, site]);

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

    const t = tilt.current;
    const target = faceTarget.current;
    if (t && spinner.current && target) {
      spinner.current.rotation.y = MathUtils.damp(spinner.current.rotation.y, target.y, 3, delta);
      t.rotation.x = MathUtils.damp(t.rotation.x, target.x, 3, delta);
    } else if (t && !sideBySide) {
      t.rotation.x = MathUtils.damp(t.rotation.x, 0, 3, delta);
    }
  });

  /** Side-by-side: drag the globe itself to spin (left/right) and tilt (up/down) it. */
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!sideBySide || !pickable) return;
    e.stopPropagation();
    let lastX = e.clientX;
    let lastY = e.clientY;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 0) faceTarget.current = null; // the user takes over
      if (spinner.current) spinner.current.rotation.y += dx * 0.008;
      if (tilt.current) tilt.current.rotation.x = MathUtils.clamp(tilt.current.rotation.x + dy * 0.008, -1.3, 1.3);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

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
      onPick(world.id, vectorToLatLon(local));
    }
  };

  // One function per grid + exaggeration (a new one every render would rebuild every terrain tile).
  const topoGrid = topo?.grid;
  const topoExag = topo?.exaggeration ?? 1;
  const radiusAt = useMemo(
    () => (topoGrid ? (lat: number, lon: number) => raisedRadius(topoGrid, lat, lon, topoExag, world.meanRadiusKm) : undefined),
    [topoGrid, topoExag, world.meanRadiusKm],
  );

  // Rotate so the chosen longitude faces the camera (see docs/notes.md for the maths).
  const initialRotation = -Math.PI / 2 - MathUtils.degToRad(world.initialLongitudeDeg);
  const glowStrength = interactive ? (hovered ? 1 : 0) : selected && !pickable ? 0.25 : 0;

  return (
    <group ref={group} scale={0}>
      <group ref={tilt}>
      <group
        ref={(g) => {
          spinner.current = g;
          onSpinnerReady?.(world.id, g);
        }}
        rotation={[0, initialRotation, 0]}
      >
        <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick} onPointerDown={handlePointerDown}>
          <TextureErrorBoundary
            fallback={<MissingTextureSphere worldName={world.name} path={`public/${world.textures.color}`} />}
          >
            <Suspense fallback={null}>
              {topo ? <TopoSurface world={world} grid={topo.grid} exaggeration={topo.exaggeration} /> : <PlanetSurface world={world} />}
            </Suspense>
          </TextureErrorBoundary>
        </group>
        {pickable && !sideBySide && TILE_LAYERS[world.id] && (
          <DetailTiles layers={TILE_LAYERS[world.id]!} onStatusChange={onDetailStatusChange} radiusAt={radiusAt} />
        )}
        {weatherOverlay && !topo && <MarsWeatherOverlay grid={weatherOverlay} />}
        {site && <SiteMarker site={site} radius={radiusAt?.(site.lat, site.lon)} />}
        {placeLabels && placeLabels.length > 0 && <MapLabelsLayer labels={placeLabels} radiusAt={radiusAt} />}
        {pickable && rslSites && rslSites.length > 0 && onOpenRsl && (
          <RslMarkersLayer sites={rslSites} openId={openRslId} onOpen={onOpenRsl} radiusAt={radiusAt} />
        )}
        {pickable && labelledSites && activeLayers && onChooseFeatured && (
          <SiteLabelsLayer
            sites={labelledSites}
            activeLayers={activeLayers}
            selectedSiteId={selectedSiteId}
            onChoose={onChooseFeatured}
            radiusAt={radiusAt}
          />
        )}
      </group>
      </group>
      <HighlightGlow color={world.highlightColor} strength={glowStrength} />
    </group>
  );
}
