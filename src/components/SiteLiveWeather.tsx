import { useState } from 'react';
import { PSG_MARS_URL } from '../data/weatherSources';
import { psgLocalFacts } from '../lib/weather/psgLocalFacts';
import { usePsgLocal } from '../lib/weather/usePsgLocal';
import { FactRow } from './FactRow';

interface SiteLiveWeatherProps {
  lat: number;
  lon: number;
  /** e.g. "Gale Crater (5.37° S, 137.81° E)", used in the method note. */
  place: string;
}

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Current conditions at a fixed site, read from NASA Goddard's PSG Mars Explorer when shown (model values, labelled Estimated). */
export function SiteLiveWeather({ lat, lon, place }: SiteLiveWeatherProps) {
  const [nonce, setNonce] = useState(0);
  const local = usePsgLocal({ lat, lon }, nonce);
  const data = local.status === 'ready' ? local.data : null;

  return (
    <div className="mars-now research__live">
      <div className="mars-now__head">
        <p className="mars-now__title">
          Right now at {place.split(' (')[0]} <span className="mars-now__tag">NASA model, not a measurement</span>
        </p>
        <button type="button" className="weather__chip" onClick={() => setNonce((n) => n + 1)} disabled={local.status === 'loading'}>
          ↻ Refresh
        </button>
      </div>
      {local.status === 'loading' && (
        <p className="weather__muted view-switch__loading" role="status">
          <span className="detail-loading__spinner" aria-hidden="true" /> Loading current conditions from NASA…
        </p>
      )}
      {local.status === 'error' && (
        <p className="weather__error" role="alert">
          Couldn’t reach{' '}
          <a href={PSG_MARS_URL} target="_blank" rel="noreferrer">
            NASA’s PSG Mars Explorer
          </a>{' '}
          right now ({local.message}). Try Refresh.
        </p>
      )}
      {data && (
        <>
          <ul className="info-panel__facts weather__facts">
            {psgLocalFacts(data, place).map((f) => (
              <FactRow key={f.id} data={f} />
            ))}
          </ul>
          <p className="weather__muted">
            {data.marsTime ? `Mars time ${data.marsTime}. ` : ''}
            {data.model ? `Model: ${data.model} (the past Mars year most similar to now). ` : ''}
            {data.altitudeM != null ? `Model ground height here: ${data.altitudeM} m. ` : ''}Updated {time(data.fetchedAt)}.
          </p>
        </>
      )}
    </div>
  );
}
