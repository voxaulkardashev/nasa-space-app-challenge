import { TOPOGRAPHY } from '../data/elevation';
import { EARTH_LABEL_NOTE } from '../data/mapLabels';
import type { DataValue, WorldId } from '../data/types';
import type { ViewMode } from '../lib/topography';
import { useElevationGrid } from '../lib/useElevationGrid';
import { DataLabel } from './DataLabel';

interface ViewModeSwitchProps {
  worldId: WorldId;
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  exaggeration: number;
  onExaggeration: (value: number) => void;
  /** Side-by-side mode only works with globes. */
  globeOnly?: boolean;
  className?: string;
}

const MODES: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'globe', label: 'Globe', icon: '◯' },
  { id: 'map2d', label: '2D', icon: '▭' },
  { id: 'topo', label: 'Topography', icon: '⛰' },
];

/** Globe / 2D map / Topography switch, plus place labels on/off and the height exaggeration. */
export function ViewModeSwitch({ worldId, mode, onChange, showLabels, onToggleLabels, exaggeration, onExaggeration, globeOnly, className = '' }: ViewModeSwitchProps) {
  const topo = TOPOGRAPHY[worldId];
  // Same download as the 3D view uses (shared cache), so this only reports its progress.
  const heights = useElevationGrid(worldId, mode === 'topo' && !globeOnly, TOPOGRAPHY);
  const topoLabel: DataValue | null = topo
    ? worldId === 'mars'
      ? { id: 'topo', label: 'Heights', value: '', status: 'measured', source: topo.source }
      : {
          id: 'topo',
          label: 'Heights',
          value: '',
          status: 'estimated',
          method: `Grey values of NASA's Blue Marble topography map converted to metres (NASA: "scaled 0-6400 meters"), averaged to 0.25° cells. Oceans are flat at sea level. Source: ${topo.source.name}.`,
          source: topo.source,
        }
    : null;
  const cityLabel: DataValue = { id: 'cities', label: 'City labels', value: '', status: 'estimated', method: EARTH_LABEL_NOTE };

  return (
    <div className={`view-switch ${className}`}>
      <div className="view-switch__modes" role="radiogroup" aria-label="Map view">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            disabled={globeOnly && m.id !== 'globe'}
            className={`view-switch__mode${mode === m.id ? ' is-active' : ''}`}
            onClick={() => onChange(m.id)}
          >
            <span aria-hidden="true">{m.icon}</span> {m.label}
          </button>
        ))}
        <button type="button" className={`view-switch__mode view-switch__labels${showLabels ? ' is-active' : ''}`} aria-pressed={showLabels} onClick={onToggleLabels}>
          Aa Labels
        </button>
      </div>
      {globeOnly && <p className="view-switch__note">2D and Topography are off in side-by-side mode.</p>}
      {mode === 'topo' && !globeOnly && topo && (
        <div className="view-switch__topo">
          <label>
            <span>
              Heights exaggerated <strong>×{exaggeration}</strong>
            </span>
            <input type="range" min={1} max={100} step={1} value={exaggeration} onChange={(e) => onExaggeration(Number(e.target.value))} />
          </label>
          {heights.status === 'loading' && (
            <p className="view-switch__note view-switch__loading" role="status">
              <span className="detail-loading__spinner" aria-hidden="true" /> Loading NASA height data…
            </p>
          )}
          {heights.status === 'error' && (
            <p className="view-switch__note weather__error" role="alert">
              Couldn’t load the height data. Check your connection and try again.
            </p>
          )}
          <p className="view-switch__note">
            Real relief is tiny next to a planet’s size, so heights are stretched to be visible. Heights: {topo.dataset}.{' '}
            {topoLabel && <DataLabel data={topoLabel} />}
          </p>
        </div>
      )}
      {mode === 'map2d' && !globeOnly && (
        <p className="view-switch__note">Flat latitude/longitude map from NASA imagery. Drag to pan, scroll or pinch to zoom.</p>
      )}
      {showLabels && worldId === 'earth' && (
        <p className="view-switch__note">
          City positions are approximate. <DataLabel data={cityLabel} />
        </p>
      )}
    </div>
  );
}
