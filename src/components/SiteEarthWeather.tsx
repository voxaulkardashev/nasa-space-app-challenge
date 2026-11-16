import { useState } from 'react';
import { POWER_HOURLY_METHOD, POWER_HOURLY_URL } from '../data/weatherSources';
import type { DataValue } from '../data/types';
import { usePowerLatest } from '../lib/weather/usePowerLatest';
import type { PowerLatestHour } from '../lib/weather/powerLatest';
import { FactRow } from './FactRow';

interface SiteEarthWeatherProps {
  lat: number;
  lon: number;
  /** e.g. "Badwater Basin, California". */
  place: string;
  /** IANA time zone for showing the reading's local time, e.g. "America/Los_Angeles". */
  timeZone: string;
  /** Optional link to live station observations for the area (shown as further reading). */
  liveLink?: { label: string; url: string };
  /** Site-specific caveat about the model grid (e.g. mountains inside the grid box). */
  gridNote?: string;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const fmt = (v: number, digits = 0) => v.toFixed(digits);

function facts(d: PowerLatestHour): DataValue[] {
  const rows: DataValue[] = [];
  const est = (id: string, label: string, value: string): DataValue => ({ id, label, value, status: 'estimated', method: POWER_HOURLY_METHOD });
  if (d.tempC !== null) rows.push(est('pw-temp', 'Air temperature', `${fmt((d.tempC * 9) / 5 + 32)} °F (${fmt(d.tempC, 1)} °C)`));
  if (d.windMs !== null) {
    const dir = d.windDirDeg !== null ? ` from the ${COMPASS[Math.round(d.windDirDeg / 45) % 8]}` : '';
    rows.push(est('pw-wind', 'Wind speed', `${fmt(d.windMs * 2.23694)} mph (${fmt(d.windMs, 1)} m/s)${dir}`));
  }
  if (d.humidityPct !== null) rows.push(est('pw-rh', 'Relative humidity', `${fmt(d.humidityPct)} %`));
  if (d.precipMmHr !== null) rows.push(est('pw-rain', 'Rain in that hour', d.precipMmHr < 0.05 ? 'None' : `${fmt(d.precipMmHr, 1)} mm`));
  return rows;
}

/**
 * Newest weather at a fixed Earth site from NASA POWER (the weather assistant's Earth service),
 * loaded each time it is shown. Labelled Estimated, with the reading's date and time, because
 * POWER is a model product whose newest values are usually 1–2 days old, not live observations.
 */
export function SiteEarthWeather({ lat, lon, place, timeZone, liveLink, gridNote }: SiteEarthWeatherProps) {
  const [nonce, setNonce] = useState(0);
  const state = usePowerLatest(lat, lon, nonce);
  const data = state.status === 'ready' ? state.data : null;
  const when = (iso: string) =>
    new Date(iso).toLocaleString('en-US', { timeZone, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  const utc = (iso: string) => new Date(iso).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mars-now research__live earth-now">
      <div className="mars-now__head">
        <p className="mars-now__title">
          Latest NASA weather at {place} <span className="mars-now__tag">NASA model, not live</span>
        </p>
        <button type="button" className="weather__chip" onClick={() => setNonce((n) => n + 1)} disabled={state.status === 'loading'}>
          ↻ Refresh
        </button>
      </div>
      {state.status === 'loading' && (
        <p className="weather__muted view-switch__loading" role="status">
          <span className="detail-loading__spinner" aria-hidden="true" /> Loading the newest values from NASA POWER…
        </p>
      )}
      {state.status === 'error' && (
        <p className="weather__error" role="alert">
          Couldn’t reach{' '}
          <a href={POWER_HOURLY_URL} target="_blank" rel="noreferrer">
            NASA POWER
          </a>{' '}
          right now ({state.message}). Try Refresh.
        </p>
      )}
      {data && (
        <>
          <p className="earth-now__time">
            Newest hour available: <strong>{when(data.timeUtc)}</strong> ({utc(data.timeUtc)} UTC)
          </p>
          <ul className="info-panel__facts weather__facts">
            {facts(data).map((f) => (
              <FactRow key={f.id} data={f} />
            ))}
          </ul>
          <p className="weather__muted">
            Source:{' '}
            <a href={POWER_HOURLY_URL} target="_blank" rel="noreferrer">
              NASA POWER hourly API
            </a>
            {data.sources.length ? ` (model data: ${data.sources.join(', ')})` : ''}, for {lat.toFixed(2)}° N, {Math.abs(lon).toFixed(2)}° W. Loaded{' '}
            {new Date(data.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
          </p>
        </>
      )}
      <p className="weather__disclaimer">
        This is the same NASA service the weather assistant uses for Earth. It doesn’t offer live weather: its newest values are usually one to two days old, and
        they average a large area around the site (a grid box roughly 50 km wide).{gridNote ? ` ${gridNote}` : ''}
        {liveLink && (
          <>
            {' '}
            For live station readings, see{' '}
            <a href={liveLink.url} target="_blank" rel="noreferrer">
              {liveLink.label}
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}
