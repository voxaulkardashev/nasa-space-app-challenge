import type { ReactNode } from 'react';
import { ANALOG_OVERVIEW } from '../data/analogOverview';
import type { FeaturedSite, World } from '../data/types';
import { AnalogSitesList } from './AnalogSitesList';
import { FactRow } from './FactRow';
import { ImageryCredits } from './ImageryCredits';
import { SpaceWeatherSection } from './SpaceWeatherSection';

interface InfoPanelProps {
  world: World;
  /** Optional buttons shown near the bottom of the panel. */
  actions?: ReactNode;
  /** Opens a featured site on the Explore screen (from the analog sites list). */
  onOpenSite?: (site: FeaturedSite) => void;
}

/**
 * Translucent World Overview panel: analog-relevant conditions, the analog
 * site pairs in this app, and recent space weather.
 * Content comes from src/data/analogOverview.ts.
 */
export function InfoPanel({ world, actions, onOpenSite }: InfoPanelProps) {
  const overview = ANALOG_OVERVIEW[world.id];
  return (
    <aside className="info-panel" aria-labelledby="info-panel-title">
      <header className="info-panel__header">
        <p className="info-panel__eyebrow">World overview · analog science</p>
        <h2 id="info-panel-title" className="info-panel__title">
          {world.name}
        </h2>
        <p className="info-panel__tagline">{overview.intro}</p>
      </header>

      <section className="info-box" aria-labelledby="ov-conditions">
        <h3 id="ov-conditions" className="info-box__title">
          Conditions that matter for analog science
        </h3>
        <ul className="info-panel__facts">
          {overview.conditions.map((fact) => (
            <FactRow key={fact.id} data={fact} />
          ))}
        </ul>
        <p className="info-panel__hint">Tap a label to see where a value comes from.</p>
      </section>

      <section className="info-box" aria-labelledby="ov-sites">
        <h3 id="ov-sites" className="info-box__title">
          Analog sites in this app
        </h3>
        <AnalogSitesList worldId={world.id} onOpenSite={onOpenSite} />
        <p className="info-panel__hint">Chosen by our team (not NASA-documented pairs). Analogs share features; they are not the same.</p>
      </section>

      <SpaceWeatherSection worldId={world.id} />

      {actions && <div className="info-panel__actions">{actions}</div>}

      <ImageryCredits imagery={world.imagery} />
    </aside>
  );
}
