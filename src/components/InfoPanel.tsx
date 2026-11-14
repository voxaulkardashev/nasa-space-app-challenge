import type { ReactNode } from 'react';
import type { World } from '../data/types';
import { FactRow } from './FactRow';
import { ImageryCredits } from './ImageryCredits';

interface InfoPanelProps {
  world: World;
  /** Buttons shown at the bottom of the panel. */
  actions: ReactNode;
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

      <ul className="info-panel__facts">
        {world.facts.map((fact) => (
          <FactRow key={fact.id} data={fact} />
        ))}
      </ul>
      <p className="info-panel__hint">Tap a label to see where a value comes from.</p>

      <div className="info-panel__actions">{actions}</div>

      <ImageryCredits imagery={world.imagery} />
    </aside>
  );
}
