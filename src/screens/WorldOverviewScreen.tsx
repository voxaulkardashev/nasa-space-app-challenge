import { InfoPanel } from '../components/InfoPanel';
import { PanelResizeHandle } from '../components/PanelResizeHandle';
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

      {world && <InfoPanel world={world} />}
      {world && <PanelResizeHandle />}

      {world && (
        <div className="explore-cta-wrap">
          <button type="button" className="explore-cta" onClick={onExplore}>
            <span className="explore-cta__main">
              Explore {world.name} <span aria-hidden="true">→</span>
            </span>
            <span className="explore-cta__sub">Pick sites · see the data · compare Mars and Earth</span>
          </button>
          <p className="controls-hint controls-hint--inline">Drag to rotate · Scroll or pinch to zoom</p>
        </div>
      )}
    </section>
  );
}
