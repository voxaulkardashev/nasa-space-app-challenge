import type { World } from '../data/types';

interface ComingSoonScreenProps {
  world: World | null;
  active: boolean;
  onBack: () => void;
  onReturnToWorlds: () => void;
}

/** Temporary stand-in for the Explore screen, which is planned for a later milestone. */
export function ComingSoonScreen({ world, active, onBack, onReturnToWorlds }: ComingSoonScreenProps) {
  return (
    <section className={`screen screen--coming-soon${active ? ' is-active' : ''}`} inert={!active} aria-label="Coming soon">
      <div className="coming-soon-card">
        <p className="eyebrow">Coming soon</p>
        <h2>Explore {world?.name ?? 'this world'}</h2>
        <p>
          Here you will be able to pick a site on the surface and compare it with Earth locations, showing measured
          similarities and differences. This screen will be built in a later milestone.
        </p>
        <div className="coming-soon-card__actions">
          <button type="button" className="btn btn--primary" onClick={onBack}>
            Back to overview
          </button>
          <button type="button" className="btn btn--ghost" onClick={onReturnToWorlds}>
            All worlds
          </button>
        </div>
      </div>
    </section>
  );
}
