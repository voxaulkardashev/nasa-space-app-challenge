import snapshot from '../data/insightWeatherSnapshot.json';
import { INSIGHT_API_DOCS, INSIGHT_API_SAVED } from '../data/elysiumResearch';
import type { MeasuredValue } from '../data/types';
import { DataLabel } from './DataLabel';

interface Stat {
  av: number;
  mn: number;
  mx: number;
  ct: number;
}
interface Sol {
  First_UTC: string;
  Last_UTC: string;
  Season?: string;
  AT?: Stat;
  HWS?: Stat;
  PRE?: Stat;
  WD_most_common?: string;
}

const SOLS = snapshot.sol_keys.map((k) => ({ sol: k, ...(snapshot.sols as Record<string, Sol>)[k] }));
const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const kmh = (ms: number) => Math.round(ms * 3.6);

/** One Measured label for the whole table: InSight's own readings, as returned by NASA's InSight Weather API. */
const LABEL: MeasuredValue = {
  id: 'insight-history',
  label: 'InSight weather (historical)',
  value: `Sols ${SOLS[0].sol}–${SOLS[SOLS.length - 1].sol}`,
  status: 'measured',
  source: {
    name: 'NASA InSight Weather API (InSight lander TWINS wind/temperature sensors and pressure sensor)',
    url: INSIGHT_API_DOCS,
    sourceDate: `Sols ${SOLS[0].sol}–${SOLS[SOLS.length - 1].sol}: ${day(SOLS[0].First_UTC)} to ${day(SOLS[SOLS.length - 1].Last_UTC)}`,
    accessed: INSIGHT_API_SAVED,
  },
};

/**
 * Historical weather measured by NASA's InSight lander at its landing site in Elysium Planitia:
 * the last 7 sols the InSight Weather API still returns (October 2020). Never presented as current weather.
 */
export function InsightHistory() {
  return (
    <div className="mars-now research__live insight-history">
      <div className="mars-now__head">
        <p className="mars-now__title">
          Historical InSight measurements <span className="mars-now__tag">October 2020, not current weather</span>
        </p>
        <DataLabel data={LABEL} />
      </div>
      <div className="insight-history__scroll">
        <table className="insight-history__table">
          <thead>
            <tr>
              <th>Sol (Earth date, UTC)</th>
              <th>Air temp. low / avg / high</th>
              <th>Wind avg (max)</th>
              <th>Pressure avg</th>
            </tr>
          </thead>
          <tbody>
            {SOLS.map((s) => (
              <tr key={s.sol}>
                <td>
                  Sol {s.sol}
                  <span className="insight-history__date">{day(s.First_UTC)}</span>
                </td>
                <td>{s.AT ? `${s.AT.mn.toFixed(1)} / ${s.AT.av.toFixed(1)} / ${s.AT.mx.toFixed(1)} °C` : '—'}</td>
                <td>{s.HWS ? `${kmh(s.HWS.av)} km/h (${kmh(s.HWS.mx)})${s.WD_most_common ? `, mostly from ${s.WD_most_common}` : ''}` : '—'}</td>
                <td>{s.PRE ? `${Math.round(s.PRE.av)} Pa` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="weather__disclaimer">
        These are past measurements, not live weather. InSight’s mission ended in December 2022, and NASA’s{' '}
        <a href={INSIGHT_API_DOCS} target="_blank" rel="noreferrer">
          InSight Weather API
        </a>{' '}
        still returns only these 7 sols from October 2020 (the API lists the season as northern early winter). Sol 681 has fewer
        readings than the others. A copy of the API’s reply was saved on {INSIGHT_API_SAVED}; no current measurements from Elysium Planitia are available
        through this API.
      </p>
    </div>
  );
}
