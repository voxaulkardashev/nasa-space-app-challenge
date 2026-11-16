import { CounterpartPopup } from '../components/CounterpartPopup';
import { FeaturedSiteList } from '../components/FeaturedSiteList';
import { LayerFilter } from '../components/LayerFilter';
import { RslSitePopup } from '../components/RslSitePopup';
import type { RslSite } from '../data/rslSites';
import { PanelResizeHandle } from '../components/PanelResizeHandle';
import { SiteSearch } from '../components/SiteSearch';
import type { ComponentProps, ReactNode } from 'react';
import { SitePanel } from '../components/SitePanel';
import { featuredSitesFor, getFeaturedSite } from '../data/featuredSites';
import { getTileLayer } from '../data/tileLayers';
import { WORLDS } from '../data/worlds';
import { WorldSwitch } from '../components/WorldSwitch';
import { WeatherAssistant } from '../components/WeatherAssistant';
import { siteKey, type WeatherState } from '../lib/weather/useWeather';
import type { FeaturedSite, GeoLayerId, World } from '../data/types';
import { elevationFacts } from '../lib/elevationFacts';
import type { SelectedSite } from '../lib/navigation';
import type { DetailStatus } from '../lib/tiles';
import { useElevationGrid } from '../lib/useElevationGrid';

interface ExploreScreenProps {
  world: World | null;
  site: SelectedSite | null;
  /** Whether sharp close-up tiles are showing, and whether more are downloading. */
  detailStatus: DetailStatus;
  active: boolean;
  onChooseFeatured: (site: FeaturedSite) => void;
  onSwitchWorld: (id: World['id']) => void;
  onBack: () => void;
  activeLayers: GeoLayerId[];
  onLayersChange: (layers: GeoLayerId[]) => void;
  /** Opens the Compare view (when available). */
  onCompare?: () => void;
  sideBySide: boolean;
  onToggleSideBySide: () => void;
  /** Drop-pin mode: the next globe click drops a pin. */
  pinMode: boolean;
  onTogglePinMode: () => void;
  weatherState: WeatherState | undefined;
  onAnalyzeWeather: (site: SelectedSite, date: string) => void;
  /** The pin on the other world (for the weather comparison). */
  otherSite: SelectedSite | null;
  onCompareWeather: () => void;
  /** Globe / 2D / Topography switch. */
  viewSwitch?: ReactNode;
  /** Starts the guided tour. */
  onStartTour?: () => void;
  /** Mars: current NASA model conditions and the globe colour layer. */
  marsNow?: ComponentProps<typeof WeatherAssistant>['marsNow'];
  flatMap?: boolean;
  /** Mars: the "RSL observed" marker layer and the marker whose details are open. */
  rsl?: { show: boolean; count: number; onToggle: () => void; open: RslSite | null; onClose: () => void };
}

/** Credit line for the close-up imagery source currently on screen. */
function ImageryCredit({ sourceId }: { sourceId: string }) {
  const layer = getTileLayer(sourceId);
  if (!layer) return null;
  return (
    <p className="imagery-credit">
      Close-up imagery ({layer.finestDetail} at most):{' '}
      <a href={layer.source.url} target="_blank" rel="noreferrer">
        {layer.label}
      </a>
      {layer.caveat && <> · {layer.caveat}</>}
    </p>
  );
}

/** Screen 3: pick a site on the globe and see data about that spot. */
export function ExploreScreen({
  world,
  site,
  detailStatus,
  active,
  onChooseFeatured,
  onSwitchWorld,
  onBack,
  activeLayers,
  onLayersChange,
  onCompare,
  sideBySide,
  onToggleSideBySide,
  pinMode,
  onTogglePinMode,
  weatherState,
  onAnalyzeWeather,
  otherSite,
  onCompareWeather,
  viewSwitch,
  flatMap = false,
  marsNow,
  onStartTour,
  rsl,
}: ExploreScreenProps) {
  const currentSite = world && site?.worldId === world.id ? site : null;
  const allSites = world ? featuredSitesFor(world.id) : [];
  const shownSites = allSites.filter((f) => (f.layers.length === 0 || f.layers.some((l) => activeLayers.includes(l))));
  const featured = currentSite?.featuredId ? getFeaturedSite(currentSite.featuredId) : undefined;
  // Elevation data downloads only once the Explore screen is opened.
  const elevation = useElevationGrid(world?.id ?? null, active);
  return (
    <section
      className={`screen screen--explore${active ? ' is-active' : ''}`}
      inert={!active}
      aria-label={world ? `Explore ${world.name}` : 'Explore'}
    >
      <button
        type="button"
        className="btn btn--ghost return-button"
        onClick={onBack}
        aria-label={world ? `Back to ${world.name} overview` : 'Back to overview'}
      >
        <span aria-hidden="true">←</span>
        <span className="return-button__label">{world ? `${world.name} overview` : 'Overview'}</span>
      </button>

      {world && <PanelResizeHandle />}

      {world && viewSwitch}

      <LayerFilter
        active={activeLayers}
        onChange={onLayersChange}
        shownCount={shownSites.length}
        totalCount={allSites.length}
        rsl={world?.id === 'mars' && rsl ? { on: rsl.show, count: rsl.count, onToggle: rsl.onToggle } : undefined}
      />
      {world?.id === 'mars' && rsl?.open && <RslSitePopup site={rsl.open} onClose={rsl.onClose} />}

      {featured && <CounterpartPopup site={featured} onGo={onChooseFeatured} onCompare={onCompare} />}

      <div className="explore-topbar">
        <button
          type="button"
          className={`btn explore-topbar__btn pin-toggle${pinMode ? ' is-on' : ''}`}
          aria-pressed={pinMode}
          onClick={onTogglePinMode}
        >
          <span aria-hidden="true">📍</span> {pinMode ? 'Click the globe… (Esc cancels)' : 'Drop pin'}
        </button>
        {onStartTour && (
          <button type="button" className="btn explore-topbar__btn" onClick={onStartTour} aria-label="Take the tour">
            <span aria-hidden="true">?</span> Tour
          </button>
        )}
        <button
          type="button"
          className={`btn explore-topbar__btn side-by-side-toggle${sideBySide ? ' is-on' : ''}`}
          aria-pressed={sideBySide}
          onClick={onToggleSideBySide}
        >
          <span aria-hidden="true">◐◑</span> {sideBySide ? 'Single view' : 'Side by side'}
        </button>
      </div>


      {world && (
        <div className="world-switch-wrap">
          <WorldSwitch worlds={WORLDS} activeId={world.id} onChange={onSwitchWorld} />
        </div>
      )}

      {world && (
        <SitePanel
          world={world}
          site={currentSite}
          onCompare={onCompare}
          search={<SiteSearch onChoose={onChooseFeatured} />}
          assistant={
            <WeatherAssistant
              key={`${world.id}:${currentSite ? siteKey(currentSite) : 'none'}`}
              world={world}
              site={currentSite}
              state={weatherState}
              onAnalyze={onAnalyzeWeather}
              otherSite={otherSite}
              onCompareWeather={onCompareWeather}
              marsNow={marsNow}
            />
          }
          extraFacts={currentSite ? elevationFacts(world, currentSite, elevation) : []}
          siteList={
            <FeaturedSiteList
              sites={shownSites}
              activeId={currentSite?.featuredId}
              onChoose={onChooseFeatured}
            />
          }
        />
      )}

      <div className="controls-hint">
        {detailStatus.loading && (
          <p className="detail-loading" role="status">
            <span className="detail-loading__spinner" aria-hidden="true" /> Loading detail…
          </p>
        )}
        {detailStatus.active && detailStatus.sourceId && <ImageryCredit sourceId={detailStatus.sourceId} />}
        <p>
          {sideBySide
            ? pinMode
              ? 'Click either globe to drop your pin'
              : 'Side by side · Drag a globe to spin it · 📍 Drop pin, then click a globe'
            : pinMode
              ? 'Click the globe to drop your pin · Esc cancels'
              : flatMap
                ? '📍 Drop pin, then click the map · Drag to pan · Scroll or pinch to zoom'
                : '📍 Drop pin, then click the globe · Drag to rotate · Scroll or pinch to zoom'}
        </p>
      </div>
    </section>
  );
}
