import { useEffect, useRef, type ReactNode } from 'react';
import { getFeaturedSite } from '../data/featuredSites';
import type { DataValue, World } from '../data/types';
import type { SelectedSite } from '../lib/navigation';
import { siteFacts } from '../lib/siteFacts';
import { FactRow } from './FactRow';

interface SitePanelProps {
  world: World;
  site: SelectedSite | null;
  /** Extra labelled rows for the site (e.g. elevation). */
  extraFacts?: DataValue[];
  /** Featured-site picker (added below the site details). */
  siteList?: ReactNode;
  actions: ReactNode;
}

/** Translucent panel on the Explore screen: the selected site's data, or how to pick one. */
export function SitePanel({ world, site, extraFacts, siteList, actions }: SitePanelProps) {
  const featured = site?.featuredId ? getFeaturedSite(site.featuredId) : undefined;
  const panelRef = useRef<HTMLElement>(null);

  // Scroll back to the top when a new site is chosen, so its data is in view (matters on phones).
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [site?.lat, site?.lon]);

  return (
    <aside ref={panelRef} className="info-panel site-panel" aria-labelledby="site-panel-title" aria-live="polite">
      <header className="info-panel__header">
        <p className="info-panel__eyebrow">Explore · {world.name}</p>
        <h2 id="site-panel-title" className="info-panel__title">
          {featured ? featured.name : site ? 'Selected site' : 'Pick a site'}
        </h2>
        <p className="info-panel__tagline">
          {featured
            ? featured.description
            : site
              ? 'Click elsewhere on the globe to move the marker.'
              : 'Click anywhere on the globe, or choose a featured site below.'}
        </p>
      </header>

      {site && (
        <>
          <ul className="info-panel__facts">
            {siteFacts(world, site, extraFacts).map((fact) => (
              <FactRow key={fact.id} data={fact} />
            ))}
          </ul>
          <p className="info-panel__hint">Tap a label to see where a value comes from.</p>
        </>
      )}

      {siteList}

      <div className="info-panel__actions">{actions}</div>
    </aside>
  );
}
