import { InfoPanel } from '../components/InfoPanel';
import type { World } from '../data/types';

interface WorldOverviewScreenProps {
  world: World | null;
  active: boolean;
  onExplore: () => void;
  onReturn: () => void;
}

/** Screen 2: the selected world large in 3D (rotate/zoom) plus its info panel. */
export function WorldOverviewScreen({ world, active, onExplore, onReturn }: WorldOverviewScreenProps) {
  return (
    <section
      className={`screen screen--overview${active ? ' is-active' : ''}`}
      inert={!active}
      aria-label={world ? `${world.name} overview` : 'World overview'}
    >
      <button type="button" className="btn btn--ghost return-button" onClick={onReturn}>
        <span aria-hidden="true">←</span> All worlds
      </button>

      {world && (
        <InfoPanel
          world={world}
          actions={
            <>
              <button type="button" className="btn btn--primary" onClick={onExplore}>
                Explore {world.name}
              </button>
              <button type="button" className="btn btn--ghost" onClick={onReturn}>
                Return
              </button>
            </>
          }
        />
      )}

      <p className="controls-hint">Drag to rotate · Scroll or pinch to zoom</p>
    </section>
  );
}
