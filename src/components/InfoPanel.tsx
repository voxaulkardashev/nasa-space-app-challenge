import type { ReactNode } from 'react';
import type { World } from '../data/types';
import { FactRow } from './FactRow';
import { ImageryCredits } from './ImageryCredits';
import { SpaceWeatherSection } from './SpaceWeatherSection';

interface InfoPanelProps {
  world: World;
  /** Optional buttons shown near the bottom of the panel. */
  actions?: ReactNode;
}

/** Translucent panel with the selected world's key facts. */
export function InfoPanel({ world, actions }: InfoPanelProps) {
  return (
    <aside className="info-panel" aria-labelledby="info-panel-title">
      <header className="info-panel__header">
        <p className="info-panel__eyebrow">World overview</p>
        <h2 id="info-panel-title" className="info-panel__title">
          {world.name}
        </h2>
        <p className="info-panel__tagline">{world.tagline}</p>
      </header>

      {world.facts.length > 0 && (
        <>
          <ul className="info-panel__facts">
            {world.facts.map((fact) => (
              <FactRow key={fact.id} data={fact} />
            ))}
          </ul>
          <p className="info-panel__hint">Tap a label to see where a value comes from.</p>
        </>
      )}

      {world.infoSections?.map((section) => (
        <section key={section.id} className="info-box" aria-labelledby={`info-box-${section.id}`}>
          <h3 id={`info-box-${section.id}`} className="info-box__title">
            {section.title}
          </h3>
          <p className="info-box__body">{section.body}</p>
        </section>
      ))}

      <SpaceWeatherSection worldId={world.id} />

      {actions && <div className="info-panel__actions">{actions}</div>}

      <ImageryCredits imagery={world.imagery} />
    </aside>
  );
}
