import { useEffect, useState, type CSSProperties } from 'react';
import { LoadingOverlay } from './components/LoadingOverlay';
import { CompareModal } from './components/CompareModal';
import { WeatherComparison } from './components/WeatherComparison';
import { SpaceScene } from './components/SpaceScene';
import { FlatMap } from './components/FlatMap';
import { ViewModeSwitch } from './components/ViewModeSwitch';
import { TutorialOverlay } from './components/TutorialOverlay';
import { TUTORIAL_STEPS, TUTORIAL_SEEN_KEY, type TutorialStage } from './data/tutorial';
import { DEFAULT_EXAGGERATION } from './data/elevation';
import { featuredSitesFor } from './data/featuredSites';
import { MAP_LABELS } from './data/mapLabels';
import { RSL_SITES } from './data/rslSites';
import type { ViewMode } from './lib/topography';
import { pairsForSite } from './data/analogues';
import { getFeaturedSite } from './data/featuredSites';
import { ALL_LAYER_IDS } from './data/geoLayers';
import type { FeaturedSite, GeoLayerId, WorldId } from './data/types';
import { getWorld } from './data/worlds';
import type { LatLon } from './lib/geo';
import type { Screen, SelectedSite } from './lib/navigation';
import { PanelWidthContext, clampPanelWidth, initialPanelWidth } from './lib/panelWidth';
import type { DetailStatus } from './lib/tiles';
import { useWeather } from './lib/weather/useWeather';
import { useMarsNow } from './lib/weather/useMarsNow';
import type { MarsNowParam } from './lib/weather/marsNow';
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
  const [sideBySide, setSideBySide] = useState(false);
  const [panelWidth, setPanelWidth] = useState(initialPanelWidth);
  const [detailStatus, setDetailStatus] = useState<DetailStatus>({ active: false, loading: false });
  // Drop-pin mode: the next click on a globe drops a pin (then the mode turns off).
  const [pinMode, setPinMode] = useState(false);
  const [weatherCompareOpen, setWeatherCompareOpen] = useState(false);
  const weather = useWeather();
  // Globe / flat 2D map / raised topography (Overview and Explore), place labels, height exaggeration.
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [showLabels, setShowLabels] = useState(true);
  const [exaggeration, setExaggeration] = useState<Record<WorldId, number>>(DEFAULT_EXAGGERATION);
  // "Right now on Mars": NASA's current model for the whole planet (downloaded when exploring Mars) and the globe colour layer.
  const [marsOverlay, setMarsOverlay] = useState<MarsNowParam | null>(null);
  const marsNow = useMarsNow(screen === 'explore' && selectedId === 'mars');
  // Guided tour: index of the current step, or null when it isn't running.
  const [tourStep, setTourStep] = useState<number | null>(null);
  // Mars: "RSL observed" markers (on by default) and the one whose details are open.
  const [showRsl, setShowRsl] = useState(true);
  const [openRslId, setOpenRslId] = useState<string | null>(null);

  const selectedWorld = selectedId ? getWorld(selectedId) : null;
  const site = selectedId ? (sites[selectedId] ?? null) : null;
  const exploring = screen === 'explore';
  const marsOverlayGrid = exploring && marsOverlay && marsNow.state.status === 'ready' ? (marsNow.state.data.grids[marsOverlay] ?? null) : null;
  const rslShown = exploring && showRsl ? RSL_SITES : [];
  const openRsl = exploring && showRsl && selectedId === 'mars' ? (RSL_SITES.find((s) => s.id === openRslId) ?? null) : null;
  const shownFeatured = exploring && selectedId ? featuredSitesFor(selectedId).filter((f) => (f.layers.length === 0 || f.layers.some((l) => activeLayers.includes(l)))) : [];
  const viewSwitch = selectedId ? (
    <ViewModeSwitch
      className={exploring ? 'view-switch--explore' : 'view-switch--overview'}
      worldId={selectedId}
      mode={sideBySide && exploring ? 'globe' : viewMode}
      onChange={setViewMode}
      showLabels={showLabels}
      onToggleLabels={() => setShowLabels((v) => !v)}
      exaggeration={exaggeration[selectedId]}
      onExaggeration={(value) => setExaggeration((e) => ({ ...e, [selectedId]: value }))}
      globeOnly={exploring && sideBySide}
    />
  ) : null;

  const selectWorld = (id: WorldId) => {
    setSelectedId(id);
    setHoveredId(null);
    setScreen('overview');
  };
  const returnToWorlds = () => setScreen('select');

  const pickSite = (worldId: WorldId, point: LatLon) => {
    if (!pinMode) return; // clicks only drop a pin after pressing Drop pin
    setPinMode(false);
    setSelectedId(worldId); // in side-by-side mode the sidebar follows the globe you clicked
    setSites((prev) => ({ ...prev, [worldId]: { worldId, lat: point.lat, lon: point.lon, picked: 'click' } }));
  };

  const chooseFeatured = (featured: FeaturedSite) => {
    setSelectedId(featured.worldId);
    const asSite = (f: FeaturedSite): SelectedSite => ({ worldId: f.worldId, lat: f.lat, lon: f.lon, picked: 'featured', featuredId: f.id });
    setSites((prev) => {
      const next = { ...prev, [featured.worldId]: asSite(featured) };
      // Side by side: also turn the other globe to the first NASA-documented analogue.
      if (sideBySide) {
        const counterpart = pairsForSite(featured.id)
          .map((p) => (featured.worldId === 'mars' ? p.earthSiteId : p.marsSiteId))
          .map((id) => (id ? getFeaturedSite(id) : undefined))
          .find((f): f is FeaturedSite => Boolean(f));
        if (counterpart) next[counterpart.worldId] = asSite(counterpart);
      }
      return next;
    });
    setFlyRequest((n) => n + 1);
  };

  /** Moves the app to the screen a tour step needs (Mars, and Jezero for the site steps). */
  const applyTourStage = (stage: TutorialStage) => {
    if (stage === 'select') {
      setScreen('select');
      return;
    }
    setSelectedId('mars');
    setHoveredId(null);
    setScreen(stage === 'overview' ? 'overview' : 'explore');
    if (stage === 'explore-site' && sites.mars?.featuredId !== 'jezero') {
      const jezero = getFeaturedSite('jezero');
      if (jezero) chooseFeatured(jezero);
    }
  };
  const goToTourStep = (i: number) => {
    const step = TUTORIAL_STEPS[i];
    if (!step) return;
    applyTourStage(step.stage);
    setTourStep(i);
  };
  const startTour = () => {
    // A clean starting point: no pop-ups, single globe view.
    setCompareOpen(false);
    setWeatherCompareOpen(false);
    setPinMode(false);
    setSideBySide(false);
    setViewMode('globe');
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
    } catch {
      // Private browsing etc.: the offer may simply show again next time.
    }
    goToTourStep(0);
  };

  /** Explore screen: jump to the other world, keeping each world's last site. */
  const switchWorld = (id: WorldId) => {
    if (id === selectedId) return;
    setSelectedId(id);
    if (sites[id]) setFlyRequest((n) => n + 1);
  };

  // Pointer cursor when hovering a world on the Select screen; crosshair while exploring.
  useEffect(() => {
    document.body.style.cursor = screen === 'select' && hoveredId ? 'pointer' : screen === 'explore' && pinMode ? 'crosshair' : '';
  }, [screen, hoveredId, pinMode]);

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
      if (pinMode) {
        setPinMode(false); // Esc first cancels drop-pin mode
        return;
      }
      setScreen((s) => (s === 'explore' ? 'overview' : 'select'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinMode]);

  return (
    <PanelWidthContext.Provider value={{ width: panelWidth, setWidth: setPanelWidth }}>
    <main className={`app app--${screen}`} style={{ '--panel-width': `${panelWidth}px` } as CSSProperties}>
      <SpaceScene
        screen={screen}
        selectedId={selectedId}
        hoveredId={hoveredId}
        sites={sites}
        sideBySide={sideBySide}
        flyRequest={flyRequest}
        onHoverChange={setHoveredId}
        onSelect={selectWorld}
        onPick={pickSite}
        onDetailStatusChange={setDetailStatus}
        activeLayers={activeLayers}
        onChooseFeatured={chooseFeatured}
        panelWidth={panelWidth}
        viewMode={exploring && sideBySide ? 'globe' : viewMode}
        showLabels={showLabels}
        exaggeration={exaggeration}
        marsOverlay={marsOverlayGrid}
        rslSites={rslShown}
        openRslId={openRslId}
        onOpenRsl={setOpenRslId}
      />

      {viewMode === 'map2d' && !(exploring && sideBySide) && screen !== 'select' && selectedWorld && (
        <FlatMap
          key={selectedWorld.id}
          world={selectedWorld}
          site={exploring ? site : null}
          labels={
            showLabels
              ? MAP_LABELS[selectedWorld.id].filter((l) => !(l.featuredId && shownFeatured.some((f) => f.id === l.featuredId)))
              : []
          }
          featured={shownFeatured}
          activeLayers={activeLayers}
          selectedFeaturedId={site?.featuredId}
          picking={exploring && pinMode}
          onPick={pickSite}
          onChooseFeatured={chooseFeatured}
          flyRequest={exploring ? flyRequest : 0}
          panelWidth={panelWidth}
          onDetailStatusChange={exploring ? setDetailStatus : undefined}
          overlayGrid={selectedWorld.id === 'mars' ? marsOverlayGrid : null}
          rslSites={selectedWorld.id === 'mars' ? rslShown : []}
          openRslId={openRslId}
          onOpenRsl={exploring ? setOpenRslId : undefined}
        />
      )}

      <SelectWorldScreen active={screen === 'select'} onStartTour={startTour} tourRunning={tourStep !== null} />
      <WorldOverviewScreen
        world={selectedWorld}
        active={screen === 'overview'}
        onExplore={() => setScreen('explore')}
        onReturn={returnToWorlds}
        onOpenSite={(featured) => {
          chooseFeatured(featured);
          setScreen('explore');
        }}
        viewSwitch={screen === 'overview' ? viewSwitch : null}
        flatMap={viewMode === 'map2d'}
        onStartTour={startTour}
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
        sideBySide={sideBySide}
        onToggleSideBySide={() => setSideBySide((v) => !v)}
        onBack={() => {
          setPinMode(false);
          setScreen('overview');
        }}
        pinMode={pinMode}
        onTogglePinMode={() => setPinMode((v) => !v)}
        weatherState={weather.forSite(site)}
        onAnalyzeWeather={weather.analyze}
        otherSite={selectedId ? (sites[selectedId === 'mars' ? 'earth' : 'mars'] ?? null) : null}
        onCompareWeather={() => setWeatherCompareOpen(true)}
        viewSwitch={exploring ? viewSwitch : null}
        onStartTour={startTour}
        marsNow={{ state: marsNow.state, onRefresh: marsNow.refresh, overlay: marsOverlay, onOverlayChange: setMarsOverlay }}
        flatMap={viewMode === 'map2d' && !sideBySide}
        rsl={{
          show: showRsl,
          count: RSL_SITES.length,
          onToggle: () => {
            setShowRsl((v) => !v);
            setOpenRslId(null);
          },
          open: openRsl,
          onClose: () => setOpenRslId(null),
        }}
      />

      {compareOpen && screen === 'explore' && site && <CompareModal site={site} onClose={() => setCompareOpen(false)} />}

      {weatherCompareOpen && screen === 'explore' && sites.earth && sites.mars && (
        <WeatherComparison
          earthSite={sites.earth}
          marsSite={sites.mars}
          earthState={weather.forSite(sites.earth)}
          marsState={weather.forSite(sites.mars)}
          onAnalyze={weather.analyze}
          onClose={() => setWeatherCompareOpen(false)}
        />
      )}

      {tourStep !== null && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tourStep]}
          index={tourStep}
          total={TUTORIAL_STEPS.length}
          onNext={() => (tourStep + 1 < TUTORIAL_STEPS.length ? goToTourStep(tourStep + 1) : setTourStep(null))}
          onBack={() => goToTourStep(Math.max(0, tourStep - 1))}
          onClose={() => setTourStep(null)}
        />
      )}

      <LoadingOverlay />
    </main>
    </PanelWidthContext.Provider>
  );
}
