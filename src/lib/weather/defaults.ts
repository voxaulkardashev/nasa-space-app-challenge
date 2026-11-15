import type { WorldId } from '../../data/types';
import { POWER_FIRST_DATE } from '../../data/weatherSources';
import { todayIso } from './dates';
import { powerLatestDate } from './power';

/** Curiosity landed on 6 August 2012 (US time); the feed's first sol is dated 2012-08-07. */
export const REMS_FIRST_DATE = '2012-08-07';

/** Allowed date range for the date picker on each world. */
export function dateRange(worldId: WorldId): { min: string; max: string } {
  return worldId === 'earth' ? { min: POWER_FIRST_DATE, max: powerLatestDate() } : { min: REMS_FIRST_DATE, max: todayIso() };
}

/** Starting date for the picker: the newest day likely to have data. */
export function defaultDate(worldId: WorldId): string {
  return dateRange(worldId).max;
}
