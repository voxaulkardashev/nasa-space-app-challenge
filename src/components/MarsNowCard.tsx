import { PSG_MARS_URL, PSG_NOW_METHOD } from '../data/weatherSources';
import type { DataValue } from '../data/types';
import type { LatLon } from '../lib/geo';
import { MARS_NOW_PARAMS, sampleMarsGrid, type MarsNowParam } from '../lib/weather/marsNow';
import type { MarsNowState } from '../lib/weather/useMarsNow';
import { FactRow } from './FactRow';
import { MarsWeatherLegend } from './MarsWeatherLegend';

interface MarsNowCardProps {
  site: LatLon | null;
  state: MarsNowState;
  onRefresh: () => void;
  overlay: MarsNowParam | null;
  onOverlayChange: (param: MarsNowParam | null) => void;
}

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * "Right now on Mars": NASA Goddard's PSG model for the current time at the pin,
 * plus a switch to colour the whole globe by one of the values. Model estimates,
 * labelled as such; Curiosity's measurements stay in the analysis below.
 */
export function MarsNowCard({ site, state, onRefresh, overlay, onOverlayChange }: MarsNowCardProps) {
  const data = state.status === 'ready' ? state.data : null;
  const source = {
    name: `NASA Goddard PSG Mars Explorer${data?.model ? ` (${data.model})` : ''}`,
    url: PSG_MARS_URL,
    sourceDate: data?.marsTime ? `Model time ${data.marsTime}` : 'Current time',
    accessed: data ? `${time(data.fetchedAt)} today` : 'today',
  };
  const rows: DataValue[] =
    data && site
      ? MARS_NOW_PARAMS.flatMap((p) => {
          const grid = data.grids[p.id];
          if (!grid) return [];
          const v = sampleMarsGrid(grid, site.lat, site.lon);
          return [{ id: `now-${p.id}`, label: p.label, value: `${v.toFixed(p.digits)}${p.unit ? ` ${p.unit}` : ''}`, status: 'estimated', method: PSG_NOW_METHOD, source }];
        })
      : [];
  const overlayGrid = data && overlay ? data.grids[overlay] : undefined;
  const overlayLabel = MARS_NOW_PARAMS.find((p) => p.id === overlay)?.label ?? '';

  return (
    <div className="mars-now">
      <div className="mars-now__head">
        <p className="mars-now__title">
          Right now on Mars <span className="mars-now__tag">NASA model, not a measurement</span>
        </p>
        <button type="button" className="weather__chip" onClick={onRefresh} disabled={state.status === 'loading'}>
          ↻ Refresh
        </button>
      </div>

      {state.status === 'loading' && (
        <p className="weather__muted view-switch__loading" role="status">
          <span className="detail-loading__spinner" aria-hidden="true" /> Loading current conditions from NASA…
        </p>
      )}
      {state.status === 'error' && (
        <p className="weather__error" role="alert">
          Couldn’t reach NASA’s Mars model ({state.message}). Try Refresh.
        </p>
      )}

      {data && (
        <>
          {site ? (
            <ul className="info-panel__facts weather__facts">
              {rows.map((r) => (
                <FactRow key={r.id} data={r} />
              ))}
            </ul>
          ) : (
            <p className="weather__muted">Drop a pin to see the current model values at that spot.</p>
          )}
          <p className="weather__muted">
            {data.marsTime ? `Mars time ${data.marsTime}. ` : ''}
            {data.model ? `Model: ${data.model} (the past Mars year most similar to now). ` : ''}Downloaded {time(data.fetchedAt)}.
          </p>

          <label className="mars-now__overlay">
            <span>Colour the whole globe by</span>
            <select value={overlay ?? ''} onChange={(e) => onOverlayChange((e.target.value || null) as MarsNowParam | null)}>
              <option value="">Nothing (off)</option>
              {MARS_NOW_PARAMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          {overlayGrid && <MarsWeatherLegend grid={overlayGrid} label={overlayLabel} />}

          <p className="weather__disclaimer">
            No spacecraft measures weather everywhere on Mars, so these are estimates from{' '}
            <a href={PSG_MARS_URL} target="_blank" rel="noreferrer">
              NASA Goddard’s PSG Mars Explorer
            </a>{' '}
            on a coarse grid (6° × about 5°), which smooths out craters and mountains. The app says it is “undergoing active development” and
            “should be only used for testing purposes”.
          </p>
        </>
      )}
    </div>
  );
}
