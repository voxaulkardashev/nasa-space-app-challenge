import { POWER_SOURCE, REMS_SOURCE } from '../../data/weatherSources';
import type { DataValue } from '../../data/types';
import { formatDate } from './dates';
import type { WeatherReport } from './types';

/** Explains how NASA POWER values are produced (shown with every Earth value). */
export const POWER_METHOD =
  'NASA POWER daily value. POWER’s weather values come from MERRA-2, a NASA reanalysis that combines satellite and ground observations with a weather model on a grid of about 0.5° × 0.625°. It is the value for the grid cell containing your pin, not a reading from a weather station at that spot.';

/** Builds a labelled value for anything taken from a weather report. */
export function weatherValue(report: WeatherReport, id: string, label: string, value: string, note?: string): DataValue {
  if (report.source === 'power') {
    return { id, label, value, note, status: 'estimated', method: POWER_METHOD, source: POWER_SOURCE };
  }
  const day = report.focus;
  return {
    id,
    label,
    value,
    note,
    status: 'measured',
    source: {
      ...REMS_SOURCE,
      sourceDate: day ? `Sol ${day.sol} (${formatDate(day.date)})` : REMS_SOURCE.sourceDate,
      accessed: report.snapshotFetched ? `copy saved ${formatDate(report.snapshotFetched.slice(0, 10))}` : formatDate(report.fetchedAt.slice(0, 10)),
    },
  };
}
