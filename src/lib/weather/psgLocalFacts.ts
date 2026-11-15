import { PSG_MARS_URL } from '../../data/weatherSources';
import type { DataValue } from '../../data/types';
import type { PsgLocal } from './marsNow';

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmt = (v: number | null, unit: string, digits = 0) => (v === null ? null : `${v.toFixed(digits)}${unit ? ` ${unit}` : ''}`);

/**
 * PSG's exact reading for one spot as labelled rows (Estimated: model values).
 * Shared by the "Right now on Mars" card and the Gale research section.
 * τ goes in the value: the uppercase label style would turn it into a T-like Τ.
 */
export function psgLocalFacts(exact: PsgLocal, place = 'your pin’s exact location'): DataValue[] {
  const source = {
    name: `NASA Goddard PSG Mars Explorer${exact.model ? ` (${exact.model})` : ''}`,
    url: PSG_MARS_URL,
    sourceDate: exact.marsTime ? `Model time ${exact.marsTime}` : 'Current time',
    accessed: `${time(exact.fetchedAt)} today`,
  };
  const method = `Read from NASA Goddard’s PSG Mars Explorer for ${place} and the current time (the same numbers its own website shows). PSG uses EMARS data from the past Mars year most similar to now, at today’s season and time of day: model estimates, not measurements. The app says it “should be only used for testing purposes”.`;
  return (
    [
      ['now-air', 'Air temperature now', fmt(exact.airNowC, '°C')],
      ['now-range', 'Air temperature today', exact.todayMinC !== null && exact.todayMaxC !== null ? `${exact.todayMinC} °C to ${exact.todayMaxC} °C` : null],
      ['now-ground', 'Ground temperature now', fmt(exact.groundNowC, '°C')],
      ['now-pres', 'Surface pressure', fmt(exact.pressureMbar, 'mbar', 3)],
      ['now-wind', 'Wind speed', fmt(exact.windKmh, 'km/h')],
      ['now-dust', 'Dust opacity', exact.dustTau === null ? null : `τ ${exact.dustTau.toFixed(3)}`],
      ['now-ice', 'Ice-cloud opacity', exact.iceTau === null ? null : `τ ${exact.iceTau.toFixed(3)}`],
      ['now-vapor', 'Water vapour', fmt(exact.vaporPrUm, 'pr-µm', 1)],
    ] as const
  ).flatMap(([id, label, value]) => (value ? [{ id, label, value, status: 'estimated' as const, method, source }] : []));
}
