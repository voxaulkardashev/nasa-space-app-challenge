import { useEffect, useState, type CSSProperties } from 'react';
import { LoadingOverlay } from './components/LoadingOverlay';
import { CompareModal } from './components/CompareModal';
import { SpaceScene } from './components/SpaceScene';
import { ALL_LAYER_IDS } from './data/geoLayers';
import type { FeaturedSite, GeoLayerId, WorldId } from './data/types';
import { getWorld } from './data/worlds';
import type { LatLon } from './lib/geo';
import type { Screen, SelectedSite } from './lib/navigation';
import { PanelWidthContext, clampPanelWidth, initialPanelWidth } from './lib/panelWidth';
import type { DetailStatus } from './lib/tiles';
import { ExploreScreen } from './screens/ExploreScreen';
import { SelectWorldScreen } from './screens/SelectWorldScreen';
import { WorldOverviewScreen } from './screens/WorldOverviewScreen';

/**
 * The whole app: one 3D scene in the background, and the screens layered
 * on top. Navigation is a few pieces of state: which screen, which world,
 * and (on the Explore screen) which site.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedId, setSelectedId] = useState<WorldId | null>(null);
  const [hoveredId, setHoveredId] = useState<WorldId | null>(null);
  // Each world remembers its own selected site, so switching Mars ⇄ Earth keeps both.
  const [sites, setSites] = useState<Partial<Record<WorldId, SelectedSite>>>({});
  const [flyRequest, setFlyRequest] = useState(0);
  const [activeLayers, setActiveLayers] = useState<GeoLayerId[]>(ALL_LAYER_IDS);
  const [compareOpen, setCompareOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(initialPanelWidth);
  const [detailStatus, setDetailStatus] = useState<DetailStatus>({ active: false, loading: false });

  const selectedWorld = selectedId ? getWorld(selectedId) : null;
  const site = selectedId ? (sites[selectedId] ?? null) : null;

  const selectWorld = (id: WorldId) => {
    setSelectedId(id);
    setHoveredId(null);
    setScreen('overview');
  };
  const returnToWorlds = () => setScreen('select');

  const pickSite = (point: LatLon) => {
    if (!selectedId) return;
    setSites((prev) => ({ ...prev, [selectedId]: { worldId: selectedId, lat: point.lat, lon: point.lon, picked: 'click' } }));
  };

  const chooseFeatured = (featured: FeaturedSite) => {
    setSelectedId(featured.worldId);
    setSites((prev) => ({
      ...prev,
      [featured.worldId]: { worldId: featured.worldId, lat: featured.lat, lon: featured.lon, picked: 'featured', featuredId: featured.id },
    }));
    setFlyRequest((n) => n + 1);
  };

  /** Explore screen: jump to the other world, keeping each world's last site. */
  const switchWorld = (id: WorldId) => {
    if (id === selectedId) return;
    setSelectedId(id);
    if (sites[id]) setFlyRequest((n) => n + 1);
  };

  // Pointer cursor when hovering a world on the Select screen; crosshair while exploring.
  useEffect(() => {
    document.body.style.cursor = screen === 'select' && hoveredId ? 'pointer' : screen === 'explore' ? 'crosshair' : '';
  }, [screen, hoveredId]);

  // Keep the sidebar within limits when the window is resized.
  useEffect(() => {
    const onResize = () => setPanelWidth((w) => clampPanelWidth(w));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Escape key goes back one step.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setScreen((s) => (s === 'explore' ? 'overview' : 'select'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <PanelWidthContext.Provider value={{ width: panelWidth, setWidth: setPanelWidth }}>
    <main className={`app app--${screen}`} style={{ '--panel-width': `${panelWidth}px` } as CSSProperties}>
      <SpaceScene
        screen={screen}
        selectedId={selectedId}
        hoveredId={hoveredId}
        site={site}
        flyRequest={flyRequest}
        onHoverChange={setHoveredId}
        onSelect={selectWorld}
        onPick={pickSite}
        onDetailStatusChange={setDetailStatus}
        activeLayers={activeLayers}
        onChooseFeatured={chooseFeatured}
        panelWidth={panelWidth}
      />

      <SelectWorldScreen active={screen === 'select'} />
      <WorldOverviewScreen
        world={selectedWorld}
        active={screen === 'overview'}
        onExplore={() => setScreen('explore')}
        onReturn={returnToWorlds}
      />
      <ExploreScreen
        world={selectedWorld}
        site={site}
        detailStatus={detailStatus}
        active={screen === 'explore'}
        onChooseFeatured={chooseFeatured}
        onSwitchWorld={switchWorld}
        activeLayers={activeLayers}
        onLayersChange={setActiveLayers}
        onCompare={() => setCompareOpen(true)}
        onBack={() => setScreen('overview')}
      />

      {compareOpen && screen === 'explore' && site && <CompareModal site={site} onClose={() => setCompareOpen(false)} />}

      <LoadingOverlay />
    </main>
    </PanelWidthContext.Provider>
  );
}
