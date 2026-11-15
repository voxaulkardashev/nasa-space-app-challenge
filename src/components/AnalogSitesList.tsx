import { ANALOGUE_PAIRS } from '../data/analogues';
import { getFeaturedSite } from '../data/featuredSites';
import type { FeaturedSite, WorldId } from '../data/types';

interface AnalogSitesListProps {
  worldId: WorldId;
  /** Opens a site on the Explore screen. */
  onOpenSite?: (site: FeaturedSite) => void;
}

/**
 * The analog pairs in this app, seen from one world: each site here and its
 * NASA-documented counterpart(s) on the other world. Clicking a name opens it.
 */
export function AnalogSitesList({ worldId, onOpenSite }: AnalogSitesListProps) {
  const groups = new Map<string, { site: FeaturedSite | null; others: (FeaturedSite | null)[]; titles: string[] }>();
  for (const pair of ANALOGUE_PAIRS) {
    const hereId = worldId === 'mars' ? pair.marsSiteId : pair.earthSiteId;
    const otherId = worldId === 'mars' ? pair.earthSiteId : pair.marsSiteId;
    const key = hereId ?? 'general';
    const entry = groups.get(key) ?? { site: hereId ? (getFeaturedSite(hereId) ?? null) : null, others: [], titles: [] };
    entry.others.push(otherId ? (getFeaturedSite(otherId) ?? null) : null);
    entry.titles.push(pair.title);
    groups.set(key, entry);
  }

  const name = (site: FeaturedSite | null, fallback: string) =>
    site && onOpenSite ? (
      <button type="button" className="analog-list__site" onClick={() => onOpenSite(site)}>
        {site.name}
      </button>
    ) : (
      <span className="analog-list__plain">{site?.name ?? fallback}</span>
    );

  return (
    <ul className="analog-list">
      {[...groups.entries()].map(([key, g]) => (
        <li key={key} className="analog-list__item">
          <div className="analog-list__pair">
            {name(g.site, worldId === 'mars' ? 'Mars in general' : 'Earth')}
            <span className="analog-list__arrow" aria-label="is compared by NASA with">
              ⇄
            </span>
            <span className="analog-list__others">
              {g.others.map((o, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  {name(o, 'Mars in general')}
                </span>
              ))}
            </span>
          </div>
          <span className="analog-list__why">{[...new Set(g.titles)].join(' · ')}</span>
        </li>
      ))}
    </ul>
  );
}
