import { pairsForSite } from '../data/analogues';
import { getFeaturedSite } from '../data/featuredSites';
import { getWorld } from '../data/worlds';
import type { FeaturedSite } from '../data/types';

interface CounterpartPopupProps {
  site: FeaturedSite;
  onGo: (site: FeaturedSite) => void;
  onCompare?: () => void;
}

/**
 * Small pop-up at the bottom of the screen: the analogue (NASA-documented, or chosen by our team and marked so) of the
 * selected site on the other world. Clicking it jumps there.
 */
export function CounterpartPopup({ site, onGo, onCompare }: CounterpartPopupProps) {
  const pairs = pairsForSite(site.id);
  const otherWorld = getWorld(site.worldId === 'mars' ? 'earth' : 'mars');

  return (
    <div className="counterpart" role="region" aria-label={`Analogue sites on ${otherWorld.name}`}>
      <div className="counterpart__header">
        <span className="counterpart__eyebrow">Corresponding site on {otherWorld.name}</span>
        {onCompare && (
          <button type="button" className="btn btn--primary counterpart__compare" onClick={onCompare}>
            Compare
          </button>
        )}
      </div>
      {pairs.length === 0 && (
        <p className="counterpart__none">No NASA-documented analogue for this site in our list yet.</p>
      )}
      <div className="counterpart__cards">
        {pairs.map((pair) => {
          const otherId = site.worldId === 'mars' ? pair.earthSiteId : pair.marsSiteId;
          const other = otherId ? getFeaturedSite(otherId) : undefined;
          if (!other) {
            return (
              <div key={pair.id} className="counterpart__card is-static">
                <span className="counterpart__name">Mars in general</span>
                <span className="counterpart__why">{pair.title}: NASA compares it with Mars as a whole, not one site.</span>
              </div>
            );
          }
          return (
            <button key={pair.id} type="button" className="counterpart__card" onClick={() => onGo(other)}>
              <span className="counterpart__name">
                {other.name} <span aria-hidden="true">→</span>
              </span>
              <span className="counterpart__why">
                {pair.title} ({pair.documentedBy === 'team' ? 'chosen by our team, not a NASA-documented pair' : 'NASA Analog Explorer'})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
