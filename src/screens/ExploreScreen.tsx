import { FeaturedSiteList } from '../components/FeaturedSiteList';
import { SitePanel } from '../components/SitePanel';
import { featuredSitesFor } from '../data/featuredSites';
import { TILE_LAYERS } from '../data/tileLayers';
import { WORLDS } from '../data/worlds';
import { WorldSwitch } from '../components/WorldSwitch';
import type { FeaturedSite, World } from '../data/types';
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
}

/** Screen 3: pick a site on the globe and see data about that spot. */
export function ExploreScreen({ world, site, detailStatus, active, onChooseFeatured, onSwitchWorld, onBack }: ExploreScreenProps) {
  const currentSite = world && site?.worldId === world.id ? site : null;
  // Elevation data downloads only once the Explore screen is opened.
  const elevation = useElevationGrid(world?.id ?? null, active);
  return (
    <section
      className={`screen screen--explore${active ? ' is-active' : ''}`}
      inert={!active}
      aria-label={world ? `Explore ${world.name}` : 'Explore'}
    >
      <button type="button" className="btn btn--ghost return-button" onClick={onBack}>
        <span aria-hidden="true">←</span> {world ? `${world.name} overview` : 'Overview'}
      </button>

      {world && (
        <div className="world-switch-wrap">
          <WorldSwitch worlds={WORLDS} activeId={world.id} onChange={onSwitchWorld} />
        </div>
      )}

      {world && (
        <SitePanel
          world={world}
          site={currentSite}
          extraFacts={currentSite ? elevationFacts(world, currentSite, elevation) : []}
          siteList={
            <FeaturedSiteList
              sites={featuredSitesFor(world.id)}
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
        {detailStatus.active && world && TILE_LAYERS[world.id] && (
          <p className="imagery-credit">
            Close-up imagery:{' '}
            <a href={TILE_LAYERS[world.id]!.source.url} target="_blank" rel="noreferrer">
              {TILE_LAYERS[world.id]!.label}
            </a>
            {TILE_LAYERS[world.id]!.caveat && <> · {TILE_LAYERS[world.id]!.caveat}</>}
          </p>
        )}
        <p>Click to pick a site · Drag to rotate · Scroll or pinch to zoom</p>
      </div>
    </section>
  );
}
