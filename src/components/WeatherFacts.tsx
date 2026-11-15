import type { DataValue } from '../data/types';
import { getWorld } from '../data/worlds';
import { formatDate } from '../lib/weather/dates';
import { POWER_METHOD, weatherValue } from '../lib/weather/provenance';
import { fmtC, fmtMbar } from '../lib/weather/stats';
import type { WeatherReport } from '../lib/weather/types';
import { FactRow } from './FactRow';

/** The weather values the assistant talks about, as labelled rows. Only values NASA returned are shown. */
export function WeatherFacts({ report }: { report: WeatherReport }) {
  const f = report.focus;
  if (!f) return null;
  const v = (id: string, label: string, value: string, note?: string) => weatherValue(report, id, label, value, note);
  const rows: DataValue[] = [];
  if (report.station) {
    rows.push({
      id: 'station',
      label: 'Data from',
      value: `${report.station.name}, ${Math.round(report.station.distanceKm).toLocaleString('en-US')} km from pin`,
      note: 'Values below describe Gale crater, not your pin',
      status: 'estimated',
      method: `Distance along the surface from your pin to the centre of Gale crater (${report.station.lat}°, ${report.station.lon}° E, IAU/USGS Gazetteer), on a sphere of Mars’s mean radius, ${getWorld('mars').meanRadiusKm} km (NASA NSSDCA). Curiosity drives inside the crater, so its exact position differs slightly.`,
    });
  }
  const day = report.source === 'rems' ? `Sol ${f.sol} · ${formatDate(f.date)}` : formatDate(f.date);
  rows.push(v('w-low', 'Low (air)', fmtC(f.tMin), day));
  rows.push(v('w-high', 'High (air)', fmtC(f.tMax)));
  if (report.source === 'power' && f.tMean !== null) rows.push(v('w-mean', 'Daily mean', fmtC(f.tMean)));
  if (f.pressureMbar !== null) rows.push(v('w-pres', 'Surface pressure', fmtMbar(f.pressureMbar)));
  if (report.source === 'power') {
    if (f.windMs != null) rows.push(v('w-wind', 'Wind (2 m)', `${f.windMs.toFixed(1)} m/s`));
    if (f.humidityPct != null) rows.push(v('w-rh', 'Relative humidity', `${f.humidityPct.toFixed(0)} %`));
    if (f.precipMm != null) rows.push(v('w-pr', 'Precipitation', `${f.precipMm.toFixed(1)} mm`));
    if (f.solarKwhM2 != null) rows.push(v('w-sun', 'Sunlight (all-sky)', `${f.solarKwhM2.toFixed(2)} kWh/m²`, 'Total for the day'));
  } else {
    if (f.groundMin != null || f.groundMax != null) rows.push(v('w-ground', 'Ground temperature', `${fmtC(f.groundMin, 0)} to ${fmtC(f.groundMax, 0)}`));
    if (f.opacity) rows.push(v('w-sky', 'Sky (feed description)', f.opacity));
    if (f.uv) rows.push(v('w-uv', 'UV index (feed)', f.uv));
    if (f.season) rows.push(v('w-season', 'Mars season', f.season, f.ls ? `Solar longitude Ls ${f.ls}°` : undefined));
  }
  return (
    <>
      <ul className="info-panel__facts weather__facts">
        {rows.map((r) => (
          <FactRow key={r.id} data={r} />
        ))}
      </ul>
      {report.source === 'rems' && <p className="weather__muted">Not in this NASA feed: wind, humidity, precipitation.</p>}
      {report.source === 'power' && <p className="weather__muted" title={POWER_METHOD}>Earth values: NASA POWER (MERRA-2 model grid), so they are labelled Estimated.</p>}
    </>
  );
}
