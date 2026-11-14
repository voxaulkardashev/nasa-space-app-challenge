import type { FeaturedSite } from '../data/types';

interface FeaturedSiteListProps {
  sites: FeaturedSite[];
  activeId?: string;
  onChoose: (site: FeaturedSite) => void;
}

/** Buttons for the featured sites of the current world. Choosing one flies the camera there. */
export function FeaturedSiteList({ sites, activeId, onChoose }: FeaturedSiteListProps) {
  if (sites.length === 0) return null;
  return (
    <nav className="featured-sites" aria-label="Featured sites">
      <h3 className="featured-sites__title">Featured sites</h3>
      <ul>
        {sites.map((site) => (
          <li key={site.id}>
            <button
              type="button"
              className={`featured-site${site.id === activeId ? ' is-active' : ''}`}
              aria-pressed={site.id === activeId}
              onClick={() => onChoose(site)}
            >
              <span className="featured-site__name">{site.name}</span>
              <span className="featured-site__kind">{site.kind}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
