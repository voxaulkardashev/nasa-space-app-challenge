import { PSG_MARS_URL, PSG_NOW_METHOD } from '../data/weatherSources';
import type { DataValue } from '../data/types';
import type { LatLon } from '../lib/geo';
import { MARS_NOW_PARAMS, sampleMarsGrid, type MarsNowParam, type PsgLocal } from '../lib/weather/marsNow';
import type { MarsNowState } from '../lib/weather/useMarsNow';
import { FactRow } from './FactRow';
import { MarsWeatherLegend } from './MarsWeatherLegend';

interface MarsNowCardProps {
  site: LatLon | null;
  state: MarsNowState;
  onRefresh: () => void;
  overlay: MarsNowParam | null;
  onOverlayChange: (param: MarsNowParam | null) => void;
  /** PSG's exact reading for the pin (what its own website shows), when it has loaded. */
  local?: { status: 'idle' | 'loading' } | { status: 'ready'; data: PsgLocal } | { status: 'error'; message: string };
}

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * "Right now on Mars": NASA Goddard's PSG model for the current time at the pin,
 * plus a switch to colour the whole globe by one of the values. Model estimates,
 * labelled as such; Curiosity's measurements stay in the analysis below.
 */
export function MarsNowCard({ site, state, onRefresh, overlay, onOverlayChange, local }: MarsNowCardProps) {
  const data = state.status === 'ready' ? state.data : null;
  const source = {
    name: `NASA Goddard PSG Mars Explorer${data?.model ? ` (${data.model})` : ''}`,
    url: PSG_MARS_URL,
    sourceDate: data?.marsTime ? `Model time ${data.marsTime}` : 'Current time',
    accessed: data ? `${time(data.fetchedAt)} today` : 'today',
  };
  const exact = local?.status === 'ready' ? local.data : null;
  const exactSource = exact && {
    name: `NASA Goddard PSG Mars Explorer${exact.model ? ` (${exact.model})` : ''}`,
    url: PSG_MARS_URL,
    sourceDate: exact.marsTime ? `Model time ${exact.marsTime}` : 'Current time',
    accessed: `${time(exact.fetchedAt)} today`,
  };
  const exactMethod =
    'Read from NASA Goddard’s PSG Mars Explorer for your pin’s exact location and the current time (the same numbers its own website shows). PSG uses EMARS data from the past Mars year most similar to now, at today’s season and time of day: model estimates, not measurements. The app says it “should be only used for testing purposes”.';
  const fmt = (v: number | null, unit: string, digits = 0) => (v === null ? null : `${v.toFixed(digits)}${unit ? ` ${unit}` : ''}`);
  const exactRows: DataValue[] = exact && exactSource
    ? (
        [
          ['now-air', 'Air temperature now', fmt(exact.airNowC, '°C')],
          ['now-range', 'Air temperature today', exact.todayMinC !== null && exact.todayMaxC !== null ? `${exact.todayMinC} °C to ${exact.todayMaxC} °C` : null],
          ['now-ground', 'Ground temperature now', fmt(exact.groundNowC, '°C')],
          ['now-pres', 'Surface pressure', fmt(exact.pressureMbar, 'mbar', 3)],
          ['now-wind', 'Wind speed', fmt(exact.windKmh, 'km/h')],
          ['now-dust', 'Dust opacity (τ)', fmt(exact.dustTau, '', 3)],
          ['now-ice', 'Ice-cloud opacity (τ)', fmt(exact.iceTau, '', 3)],
          ['now-vapor', 'Water vapour', fmt(exact.vaporPrUm, 'pr-µm', 1)],
        ] as const
      ).flatMap(([id, label, value]) => (value ? [{ id, label, value, status: 'estimated' as const, method: exactMethod, source: exactSource }] : []))
    : [];
  const gridRows: DataValue[] =
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
            <>
              {local?.status === 'loading' && !exact && (
                <p className="weather__muted view-switch__loading" role="status">
                  <span className="detail-loading__spinner" aria-hidden="true" /> Asking NASA’s model about this exact spot…
                </p>
              )}
              {local?.status === 'error' && (
                <p className="weather__muted">
                  PSG’s exact reading for this spot didn’t load, so these are approximate values from its whole-planet grid.
                </p>
              )}
              <ul className="info-panel__facts weather__facts">
                {(exact ? exactRows : local?.status === 'loading' ? [] : gridRows).map((r) => (
                  <FactRow key={r.id} data={r} />
                ))}
              </ul>
            </>
          ) : (
            <p className="weather__muted">Drop a pin to see the current model values at that spot.</p>
          )}
          <p className="weather__muted">
            {(exact?.marsTime ?? data.marsTime) ? `Mars time ${exact?.marsTime ?? data.marsTime}. ` : ''}
            {(exact?.model ?? data.model) ? `Model: ${exact?.model ?? data.model} (the past Mars year most similar to now). ` : ''}
            {exact?.altitudeM != null ? `Model ground height here: ${exact.altitudeM} m. ` : ''}Updated {time(exact?.fetchedAt ?? data.fetchedAt)}.
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
