import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { layerColor } from '../data/geoLayers';
import type { MapLabel } from '../data/mapLabels';
import { TILE_LAYERS } from '../data/tileLayers';
import type { FeaturedSite, GeoLayerId, World, WorldId } from '../data/types';
import { assetUrl } from '../data/worlds';
import { mapTiles, type MapView } from '../lib/flatMap';
import { normalizeLon, type LatLon } from '../lib/geo';
import { usesBottomPanel } from '../lib/layout';
import type { DetailStatus } from '../lib/tiles';
import { FlatMapTile } from './FlatMapTile';

interface FlatMapProps {
  world: World;
  site: LatLon | null;
  labels: MapLabel[];
  /** Featured-site pins (Explore only). */
  featured: FeaturedSite[];
  activeLayers: GeoLayerId[];
  selectedFeaturedId?: string;
  /** A click drops a pin (Explore, after pressing Drop pin). */
  picking: boolean;
  onPick: (worldId: WorldId, point: LatLon) => void;
  onChooseFeatured: (site: FeaturedSite) => void;
  /** Changes each time the map should fly to the site. */
  flyRequest: number;
  panelWidth: number;
  onDetailStatusChange?: (status: DetailStatus) => void;
}

/** A press that moves more than this many pixels is a drag (pan), not a click. */
const CLICK_TOLERANCE_PX = 5;

/** Where the middle of the free area (beside / above the sidebar) is, like the globe's view offset. */
function freeCentre(w: number, h: number, panelWidth: number) {
  if (usesBottomPanel(w)) return { cx: w / 2, cy: h * 0.3, freeW: w };
  const shift = Math.min((panelWidth + 20) / 2, w * 0.3);
  return { cx: w / 2 - shift, cy: h / 2, freeW: w - 2 * shift };
}

const clampView = (v: MapView, minPpd: number, maxPpd: number): MapView => ({
  lon: Math.max(-180, Math.min(180, v.lon)),
  lat: Math.max(-90, Math.min(90, v.lat)),
  ppd: Math.max(minPpd, Math.min(maxPpd, v.ppd)),
});

/**
 * The 2D view: the world as a flat latitude/longitude map (like the NASA
 * images themselves), with sharper NASA-hosted tiles as you zoom in.
 * Drag to pan, scroll or pinch to zoom.
 */
export function FlatMap({
  world,
  site,
  labels,
  featured,
  activeLayers,
  selectedFeaturedId,
  picking,
  onPick,
  onChooseFeatured,
  flyRequest,
  panelWidth,
  onDetailStatusChange,
}: FlatMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const { cx, cy, freeW } = freeCentre(size.w, size.h, panelWidth);
  const minPpd = (freeW * 0.94) / 360;
  // The 2D map only uses tile sources hosted by NASA.
  const layers = useMemo(() => (TILE_LAYERS[world.id] ?? []).filter((l) => l.nasaHosted !== false), [world.id]);
  const maxPpd = Math.max(...layers.map((l) => (l.tileSize * 2 ** l.maxLevel) / l.level0TileDeg), 50) * 2;
  const [view, setView] = useState<MapView>({ lon: 0, lat: 0, ppd: minPpd });
  const v = clampView(view, minPpd, maxPpd);
  const viewRef = useRef(v);
  viewRef.current = v;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; moved: number } | null>(null);
  const pinchDist = useRef(0);
  const anim = useRef(0);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /** Latitude/longitude under a screen point. */
  const toLatLon = (x: number, y: number, view: MapView = viewRef.current): LatLon => ({
    lon: view.lon + (x - cx) / view.ppd,
    lat: view.lat - (y - cy) / view.ppd,
  });

  /** Zoom by `factor`, keeping the point under (x, y) where it is. */
  const zoomAt = (factor: number, x: number, y: number) => {
    cancelAnimationFrame(anim.current);
    setView((prev) => {
      const cur = clampView(prev, minPpd, maxPpd);
      const ppd = Math.max(minPpd, Math.min(maxPpd, cur.ppd * factor));
      const at = toLatLon(x, y, cur);
      return { ppd, lon: at.lon - (x - cx) / ppd, lat: at.lat + (y - cy) / ppd };
    });
  };

  // Scroll to zoom (registered by hand so the page itself never scrolls).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  // Fly to the site when asked (featured site chosen, world switched...).
  useEffect(() => {
    if (!flyRequest || !site) return;
    const from = viewRef.current;
    const to = { lon: site.lon, lat: site.lat, ppd: Math.max(from.ppd, minPpd * 6) };
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      const k = 1 - (1 - t) ** 3;
      setView({ lon: from.lon + (to.lon - from.lon) * k, lat: from.lat + (to.lat - from.lat) * k, ppd: from.ppd * (to.ppd / from.ppd) ** k });
      if (t < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim.current);
    // Only a new fly request should start a flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyRequest]);

  const onPointerDown = (e: ReactPointerEvent) => {
    cancelAnimationFrame(anim.current);
    ref.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) drag.current = { x: e.clientX, y: e.clientY, moved: 0 };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      if (drag.current) drag.current.moved = Infinity; // a pinch is never a click
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current > 0) zoomAt(dist / pinchDist.current, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinchDist.current = dist;
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (drag.current) drag.current.moved += Math.abs(dx) + Math.abs(dy);
    setView((p) => {
      const cur = clampView(p, minPpd, maxPpd);
      return { ...cur, lon: cur.lon - dx / cur.ppd, lat: cur.lat + dy / cur.ppd };
    });
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = 0;
    const d = drag.current;
    if (pointers.current.size === 0) drag.current = null;
    if (!d || d.moved > CLICK_TOLERANCE_PX || !picking) return;
    const p = toLatLon(e.clientX, e.clientY);
    if (Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180) onPick(world.id, { lat: p.lat, lon: normalizeLon(p.lon) });
  };

  // Visible area and the NASA tiles that cover it.
  const bounds = {
    west: v.lon - cx / v.ppd,
    east: v.lon + (size.w - cx) / v.ppd,
    north: v.lat + cy / v.ppd,
    south: v.lat - (size.h - cy) / v.ppd,
  };
  const { tiles, activeLayer } = mapTiles(layers, v.ppd, bounds);
  const activeId = activeLayer?.id;
  useEffect(() => {
    onDetailStatusChange?.({ active: Boolean(activeId), loading: false, sourceId: activeId });
  }, [activeId, onDetailStatusChange]);

  const x = (lon: number) => cx + (lon - v.lon) * v.ppd;
  const y = (lat: number) => cy - (lat - v.lat) * v.ppd;
  const onScreen = (p: LatLon) => {
    const px = x(p.lon);
    const py = y(p.lat);
    return px > -100 && px < size.w + 100 && py > -40 && py < size.h + 40;
  };
  const worldW = 360 * v.ppd;
  const worldH = 180 * v.ppd;

  return (
    <div
      ref={ref}
      className={`flat-map${picking ? ' is-picking' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="application"
      aria-label={`2D map of ${world.name}. Drag to pan, scroll or pinch to zoom.`}
    >
      <div className="flat-map__world" style={{ left: x(-180), top: y(90), width: worldW, height: worldH }}>
        <img className="flat-map__base" src={assetUrl(world.textures.color)} alt="" draggable={false} />
        {tiles.map((t) => (
          <FlatMapTile key={t.id} tile={t} ppd={v.ppd} />
        ))}
      </div>

      {labels.filter(onScreen).map((l) => (
        <span key={l.id} className={`place-label place-label--${l.worldId} flat-map__label`} style={{ left: x(l.lon), top: y(l.lat) }} title={l.kind}>
          <span className="place-label__dot" aria-hidden="true" />
          {l.name}
        </span>
      ))}

      {featured.filter(onScreen).map((f) => (
        <button
          key={f.id}
          type="button"
          className={`site-pin flat-map__pin${f.id === selectedFeaturedId ? ' is-selected' : ''}`}
          style={{ left: x(f.lon), top: y(f.lat), ['--pin' as string]: layerColor(f.layers.find((l) => activeLayers.includes(l)) ?? f.layers[0]) }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onChooseFeatured(f)}
        >
          <span className="site-pin__dot" aria-hidden="true" />
          <span className="site-pin__name">{f.name}</span>
        </button>
      ))}

      {site && onScreen(site) && <span className="flat-map__marker" style={{ left: x(site.lon), top: y(site.lat) }} aria-label="Selected site" />}

      <div className="flat-map__zoom" style={{ left: cx * 2 - 64 }}>
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomAt(1.6, cx, cy)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => zoomAt(1 / 1.6, cx, cy)} aria-label="Zoom out">
          −
        </button>
      </div>
    </div>
  );
}
