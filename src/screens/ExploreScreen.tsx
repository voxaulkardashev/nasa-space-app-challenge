import { FeaturedSiteList } from '../components/FeaturedSiteList';
import { SitePanel } from '../components/SitePanel';
import { featuredSitesFor } from '../data/featuredSites';
import type { FeaturedSite, World } from '../data/types';
import type { SelectedSite } from '../lib/navigation';

interface ExploreScreenProps {
  world: World | null;
  site: SelectedSite | null;
  active: boolean;
  onChooseFeatured: (site: FeaturedSite) => void;
  onBack: () => void;
  onReturnToWorlds: () => void;
}

/** Screen 3: pick a site on the globe and see data about that spot. */
export function ExploreScreen({ world, site, active, onChooseFeatured, onBack, onReturnToWorlds }: ExploreScreenProps) {
  const currentSite = world && site?.worldId === world.id ? site : null;
  return (
    <section
      className={`screen screen--explore${active ? ' is-active' : ''}`}
      inert={!active}
      aria-label={world ? `Explore ${world.name}` : 'Explore'}
    >
      <button type="button" className="btn btn--ghost return-button" onClick={onBack}>
        <span aria-hidden="true">←</span> {world?.name ?? 'Overview'}
      </button>

      {world && (
        <SitePanel
          world={world}
          site={currentSite}
          siteList={
            <FeaturedSiteList
              sites={featuredSitesFor(world.id)}
              activeId={currentSite?.featuredId}
              onChoose={onChooseFeatured}
            />
          }
          actions={
            <>
              <button type="button" className="btn btn--ghost" onClick={onBack}>
                Back to overview
              </button>
              <button type="button" className="btn btn--ghost" onClick={onReturnToWorlds}>
                All worlds
              </button>
            </>
          }
        />
      )}

      <p className="controls-hint">Click to pick a site · Drag to rotate · Scroll or pinch to zoom</p>
    </section>
  );
}
