import { useEffect, useState } from 'react';
import type { DataValue, WorldId } from '../data/types';
import { REMS_DISCLAIMER, REMS_SOURCE, WINDOW_HALF_DAYS } from '../data/weatherSources';
import type { SelectedSite } from '../lib/navigation';
import { siteName } from '../lib/siteName';
import { compareWeather, type DimensionScore } from '../lib/weather/compare';
import { formatDate } from '../lib/weather/dates';
import { dateRange, defaultDate } from '../lib/weather/defaults';
import type { WeatherState } from '../lib/weather/useWeather';
import { DataLabel } from './DataLabel';
import { EarthLimits } from './EarthLimits';

interface WeatherComparisonProps {
  earthSite: SelectedSite;
  marsSite: SelectedSite;
  earthState: WeatherState | undefined;
  marsState: WeatherState | undefined;
  onAnalyze: (site: SelectedSite, date: string) => void;
  onClose: () => void;
}

const fmt = (v: number | null, unit: string) => (v === null ? 'no data' : `${unit === 'mbar' && v >= 100 ? v.toFixed(0) : v.toFixed(unit === 'mbar' ? 2 : 1)} ${unit}`);
const pct = (s: number | null) => (s === null ? '—' : `${Math.round(s * 100)}%`);

/**
 * Weather comparison between a pin on Earth and a pin on Mars: one percentage,
 * always shown with every per-dimension value behind it (CLAUDE.md rule 4).
 */
export function WeatherComparison({ earthSite, marsSite, earthState, marsState, onAnalyze, onClose }: WeatherComparisonProps) {
  const [dates, setDates] = useState<Record<WorldId, string>>({
    earth: earthState?.date ?? defaultDate('earth'),
    mars: marsState?.date ?? defaultDate('mars'),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const run = () => {
    if (!(earthState?.status === 'ready' && earthState.date === dates.earth)) onAnalyze(earthSite, dates.earth);
    if (!(marsState?.status === 'ready' && marsState.date === dates.mars)) onAnalyze(marsSite, dates.mars);
  };

  const earth = earthState?.status === 'ready' && earthState.date === dates.earth ? earthState.report : undefined;
  const mars = marsState?.status === 'ready' && marsState.date === dates.mars ? marsState.report : undefined;
  const loading = earthState?.status === 'loading' || marsState?.status === 'loading';
  const result = earth?.focus && mars?.focus ? compareWeather(earth, mars) : null;
  const scored = result?.dimensions.filter((d) => d.score !== null).length ?? 0;

  const overallLabel: DataValue | null =
    result && result.overall !== null
      ? {
          id: 'weather-similarity',
          label: 'Weather similarity',
          value: pct(result.overall),
          status: 'estimated',
          method: `Calculated by this app (not a NASA product): the average of the ${scored} per-dimension scores in the table, each from the ±${WINDOW_HALF_DAYS}-day windows of NASA data around the chosen dates.`,
        }
      : null;

  return (
    <div className="compare-backdrop" onClick={onClose}>
      <div className="compare weather-compare" role="dialog" aria-modal="true" aria-labelledby="wc-title" onClick={(e) => e.stopPropagation()}>
        <header className="compare__header">
          <div>
            <p className="info-panel__eyebrow">Compare weather</p>
            <h2 id="wc-title" className="compare__title">
              {siteName(marsSite)} ⇄ {siteName(earthSite)}
            </h2>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Close weather comparison">
            ✕ Close
          </button>
        </header>

        <div className="weather-compare__pickers">
          {(
            [
              ['mars', marsSite, marsState],
              ['earth', earthSite, earthState],
            ] as const
          ).map(([id, s, st]) => (
            <label key={id} className="weather__date">
              <span>
                {id === 'mars' ? 'Mars' : 'Earth'} · {siteName(s)}
              </span>
              <input
                type="date"
                value={dates[id]}
                min={dateRange(id).min}
                max={dateRange(id).max}
                onChange={(e) => setDates((d) => ({ ...d, [id]: e.target.value }))}
              />
              {st?.status === 'error' && <em className="weather__error">{st.error}</em>}
            </label>
          ))}
          <button type="button" className="btn btn--primary" onClick={run} disabled={loading || !dates.earth || !dates.mars}>
            {loading ? 'Loading NASA data…' : result ? 'Update comparison' : 'Run comparison'}
          </button>
        </div>

        {!result && !loading && (
          <p className="compare__muted">Choose a date for each pin and press <strong>Run comparison</strong>. Both use real NASA data only.</p>
        )}

        {earth && !earth.focus && <p className="weather__error">NASA POWER returned no temperature values for the Earth pin near that date.</p>}
        {mars && !mars.focus && <p className="weather__error">The Mars weather feed has no measurements near that date.</p>}

        {result && earth && mars && (
          <>
            <section className="weather-compare__overall">
              <p className="weather-compare__pct">{pct(result.overall)}</p>
              <div>
                <p>
                  <strong>Weather similarity</strong> {overallLabel && <DataLabel data={overallLabel} />}
                </p>
                <p className="compare__muted">
                  Average of the {scored} scores below. A similar score in one place does not make the two places the same:
                  check each line.
                </p>
              </div>
            </section>

            <table className="weather-compare__table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Mars</th>
                  <th>Earth</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {result.dimensions.map((d) => (
                  <DimensionRow key={d.id} d={d} />
                ))}
              </tbody>
            </table>

            <div className="weather-compare__notes">
              <p>
                <strong>Data used.</strong> Mars: {mars.days.length} sols of Curiosity REMS measurements in Gale crater (
                {formatDate(mars.days[0].date)} – {formatDate(mars.days.at(-1)!.date)}),{' '}
                <DataLabel data={{ id: 'm', label: 'Mars data', value: '', status: 'measured', source: { ...REMS_SOURCE, sourceDate: `${formatDate(mars.days[0].date)} – ${formatDate(mars.days.at(-1)!.date)}`, accessed: mars.snapshotFetched ? `copy saved ${formatDate(mars.snapshotFetched.slice(0, 10))}` : formatDate(mars.fetchedAt.slice(0, 10)) } }} />
                {mars.station && Math.round(mars.station.distanceKm) >= 50 && (
                  <> — about {Math.round(mars.station.distanceKm).toLocaleString('en-US')} km from your Mars pin, so this is Gale’s weather, not the pin’s</>
                )}
                . Earth: {earth.days.length} days of NASA POWER values at the pin ({formatDate(earth.days[0].date)} – {formatDate(earth.days.at(-1)!.date)}),{' '}
                <DataLabel data={{ id: 'e', label: 'Earth data', value: '', status: 'estimated', method: 'NASA POWER daily values from the MERRA-2 reanalysis (model grid of about 0.5° × 0.625°).' }} />.
              </p>
              <p>
                <strong>Not compared</strong> (no Mars values in the NASA feed): wind, humidity, precipitation. Earth’s values for these
                are in the sidebar.
              </p>
              <p className="weather__disclaimer">{REMS_DISCLAIMER}</p>
            </div>

            <EarthLimits />
          </>
        )}
      </div>
    </div>
  );
}

function DimensionRow({ d }: { d: DimensionScore }) {
  return (
    <tr>
      <td>
        {d.label}
        <span className="weather-compare__rule">{d.rule}</span>
      </td>
      <td>{fmt(d.mars, d.unit)}</td>
      <td>{fmt(d.earth, d.unit)}</td>
      <td>
        <span className="weather-compare__score">
          <span className="weather-compare__bar" aria-hidden="true">
            <span style={{ width: `${(d.score ?? 0) * 100}%` }} />
          </span>
          {pct(d.score)}
        </span>
      </td>
    </tr>
  );
}
