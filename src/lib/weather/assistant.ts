import { WINDOW_HALF_DAYS } from '../../data/weatherSources';
import { daysBetween, formatDate } from './dates';
import { fmtC, fmtMbar, windowStats } from './stats';
import type { WeatherReport } from './types';

/**
 * The weather assistant's replies. It is rule-based on purpose: every sentence
 * is filled in from the NASA values in the report, so it cannot make numbers up.
 * If the data has no answer, it says so.
 */

export interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  /** Bot replies that quote NASA values carry the report's data label. */
  quotesData?: boolean;
}

export const SUGGESTED_QUESTIONS = ['Temperature?', 'Air pressure?', 'Wind?', 'Weekly pattern?', 'Sky & sunlight?', 'How was this measured?'];

const NO_FEED_DATA = 'no data in this NASA feed';

function n(v: number | null | undefined, digits: number, unit: string) {
  return typeof v === 'number' ? `${v.toFixed(digits)} ${unit}` : null;
}

function dateLine(r: WeatherReport): string {
  const f = r.focus!;
  if (r.focusIsExact) return '';
  const gap = daysBetween(r.requestedDate, f.date);
  return ` There is no ${r.source === 'rems' ? 'measurement' : 'value'} for ${formatDate(r.requestedDate)}, so I’m using the nearest day with data, ${formatDate(f.date)} (${Math.abs(gap)} day${Math.abs(gap) === 1 ? '' : 's'} ${gap > 0 ? 'later' : 'earlier'}).`;
}

function where(r: WeatherReport): string {
  if (r.source === 'power') return 'at your pin';
  return `in Gale crater (Curiosity, sol ${r.focus?.sol})`;
}

function stationCaveat(r: WeatherReport): string {
  if (!r.station) return '';
  const km = Math.round(r.station.distanceKm);
  return km < 50
    ? `Your pin is about ${km} km from Curiosity’s weather station in Gale crater, so these are its measurements.`
    : `Mars has no weather station at your pin. The nearest one with daily NASA data is Curiosity’s REMS in Gale crater, about ${km.toLocaleString('en-US')} km away, so these values describe Gale crater, not your pin. Weather there can differ a lot from your pin.`;
}

function temperature(r: WeatherReport): string {
  const f = r.focus!;
  const mean = r.source === 'power' && typeof f.tMean === 'number' ? ` and a daily mean of ${fmtC(f.tMean)}` : '';
  const ground =
    r.source === 'rems' && (f.groundMin !== null || f.groundMax !== null)
      ? ` The ground was ${fmtC(f.groundMin, 0)} to ${fmtC(f.groundMax, 0)}.`
      : '';
  const air = r.source === 'power' ? 'Air temperature 2 m above the ground' : 'Air temperature';
  return `${air} ${where(r)} on ${formatDate(f.date)}: a low of ${fmtC(f.tMin)}, a high of ${fmtC(f.tMax)}${mean}.${ground}`;
}

function pressure(r: WeatherReport): string {
  const f = r.focus!;
  if (f.pressureMbar === null) return `There is no surface-pressure value for ${formatDate(f.date)} in this NASA feed.`;
  const extra =
    r.source === 'rems'
      ? ' That is less than 1% of the air pressure at Earth’s sea level (1,014 mbar on NASA’s Earth fact sheet).'
      : ' This is the pressure at the ground surface, so it is lower than the sea-level pressure on weather maps when the pin is at altitude.';
  return `Surface air pressure ${where(r)} on ${formatDate(f.date)}: ${fmtMbar(f.pressureMbar)}.${extra}`;
}

function wind(r: WeatherReport): string {
  const f = r.focus!;
  if (r.source === 'rems') return `Wind: ${NO_FEED_DATA}. The feed lists wind speed, but every sol is blank (“--”), so I can’t say anything about wind at Gale.`;
  const ws = n(f.windMs, 1, 'm/s');
  return ws ? `Average wind speed 2 m above the ground on ${formatDate(f.date)}: ${ws}.` : `Wind: no value for ${formatDate(f.date)}.`;
}

function moisture(r: WeatherReport): string {
  const f = r.focus!;
  if (r.source === 'rems') return `Humidity and precipitation: ${NO_FEED_DATA}. The feed’s humidity field is always blank.`;
  const rh = n(f.humidityPct, 0, '%');
  const pr = n(f.precipMm, 1, 'mm');
  return `On ${formatDate(f.date)}: relative humidity ${rh ?? 'no value'}, precipitation ${pr ?? 'no value'}${pr && f.precipMm === 0 ? ' (dry)' : ''}.`;
}

function sky(r: WeatherReport): string {
  const f = r.focus!;
  if (r.source === 'rems') {
    const parts = [
      f.opacity ? `the feed describes the sky as “${f.opacity}”` : 'no sky description',
      f.uv ? `UV index: ${f.uv}` : 'no UV value',
      f.sunrise && f.sunset ? `sunrise ${f.sunrise}, sunset ${f.sunset} (local time)` : null,
    ].filter(Boolean);
    return `On sol ${f.sol}: ${parts.join('; ')}.`;
  }
  const s = n(f.solarKwhM2, 2, 'kWh/m²');
  return s
    ? `Sunlight reaching the ground on ${formatDate(f.date)}: ${s} for the whole day (all-sky, so clouds are included).`
    : `Sunlight: NASA POWER has not filled in ${formatDate(f.date)} yet (its sunlight values arrive a few days after the temperature values).`;
}

function pattern(r: WeatherReport): string {
  const s = windowStats(r.days);
  if (s.dayCount < 2) return 'There are not enough days with data around this date to describe a pattern.';
  const trend =
    s.trend === null || Math.abs(s.trend) < 1
      ? 'stayed fairly steady'
      : s.trend > 0
        ? `warmed by about ${s.trend.toFixed(1)} °C`
        : `cooled by about ${Math.abs(s.trend).toFixed(1)} °C`;
  const sd = s.variability ?? 0;
  const steadiness = sd < 1 ? 'very steady from day to day' : sd < 3 ? 'fairly steady from day to day' : 'changeable from day to day';
  return `Across the ${s.dayCount} days with data from ${formatDate(s.firstDate!)} to ${formatDate(s.lastDate!)}, the daily midpoint temperature ${trend}. Lows averaged ${fmtC(s.avgLow)} and highs ${fmtC(s.avgHigh)}, a typical day–night swing of ${fmtC(s.avgSwing)}. The coldest low was ${fmtC(s.coldest)} and the warmest high ${fmtC(s.warmest)}. Day-to-day variation (standard deviation of the midpoint) was ${fmtC(sd)}: ${steadiness}.`;
}

function season(r: WeatherReport): string {
  const f = r.focus!;
  if (r.source === 'rems') return f.season ? `The feed gives the Mars season as “${f.season}”${f.ls ? ` (solar longitude Ls ${f.ls}°)` : ''}. Gale crater is just south of the equator.` : `Season: ${NO_FEED_DATA}.`;
  return 'NASA POWER doesn’t report seasons. You can compare dates yourself: pick a date six months away and press Analyze again.';
}

function method(r: WeatherReport): string {
  if (r.source === 'power')
    return 'Earth values come from the NASA POWER Daily API. Its weather values are from MERRA-2, a NASA reanalysis (satellite and ground observations combined with a weather model) on a grid of about 0.5° × 0.625°, so each value covers the grid cell around your pin. They are labelled Estimated because they are model-based, not readings from a station at your pin.';
  return 'Mars values come from NASA’s Curiosity weather feed on mars.nasa.gov: daily summaries of the rover’s REMS instrument, provided by Centro de Astrobiología (CAB) for outreach. They are labelled Measured, but the feed notes that values are taken at the rover (which can influence them) and that some days are missing. Scientific REMS data are in NASA’s Planetary Data System.';
}

/** The first message after Analyze: a short summary of everything in the report. */
export function summaryMessage(r: WeatherReport): string {
  if (!r.focus) {
    return r.source === 'power'
      ? 'NASA POWER returned no temperature values for this spot and date range, so I can’t describe the weather. Try another date.'
      : 'The NASA Mars weather feed has no measurements near this date, so I can’t describe the weather. Try another date.';
  }
  const f = r.focus;
  const intro = r.source === 'rems' ? `${stationCaveat(r)}${dateLine(r)}` : dateLine(r).trim();
  const lines = [intro, temperature(r), pressure(r)];
  if (r.source === 'power') {
    const extras = [
      n(f.windMs, 1, 'm/s') && `wind ${n(f.windMs, 1, 'm/s')}`,
      n(f.humidityPct, 0, '%') && `humidity ${n(f.humidityPct, 0, '%')}`,
      n(f.precipMm, 1, 'mm') && `precipitation ${n(f.precipMm, 1, 'mm')}`,
    ].filter(Boolean);
    if (extras.length) lines.push(`Also: ${extras.join(', ')}.`);
  } else {
    lines.push(`Wind, humidity and precipitation: ${NO_FEED_DATA}.`);
  }
  lines.push(`Ask me about the weekly pattern (±${WINDOW_HALF_DAYS} days), the sky, or how this was measured.`);
  return lines.filter(Boolean).join(' ');
}

/** Answers a typed question from the report only. */
export function answer(question: string, r: WeatherReport | null): { text: string; quotesData: boolean } {
  const q = question.toLowerCase();
  if (!r) return { text: 'Pick a date and press Analyze first. I only answer from NASA data I have downloaded.', quotesData: false };
  if (!r.focus) return { text: summaryMessage(r), quotesData: false };
  const rules: [RegExp, (r: WeatherReport) => string, boolean][] = [
    [/how.*(measur|know|calculat)|source|where.*(from|data)|method|reliab|accura|trust/, method, false],
    [/pattern|week|trend|chang|variab|steady|average|usual|typical/, pattern, true],
    [/season|month|\bls\b|solar longitude|winter|summer|spring|autumn|fall/, season, true],
    [/press|mbar|pascal|\bair\b|atmos/, pressure, true],
    [/wind|breez|gust|storm/, wind, true],
    [/humid|moist|rain|precip|snow|wet|dry|water/, moisture, true],
    [/sky|sun|uv|light|cloud|dust|opac|radiat|solar|bright/, sky, true],
    [/temp|hot|cold|warm|cool|freez|heat|degree|°|high|low/, temperature, true],
    [/compar|similar|analog|match|percent|%/, () => 'Drop or choose a pin on the other world too, analyze it, then press “Compare weather” below. You’ll get a similarity percentage with every value behind it.', false],
    [/where|station|distance|far|location|pin/, (rr) => (rr.station ? stationCaveat(rr) : `NASA POWER values are for the grid cell containing your pin (${rr.lat.toFixed(2)}°, ${rr.lon.toFixed(2)}°).`), false],
  ];
  for (const [re, fn, quotes] of rules) if (re.test(q)) return { text: fn(r), quotesData: quotes };
  return {
    text: `I can only answer from the NASA data I downloaded for ${formatDate(r.focus.date)}. Try asking about temperature, air pressure, wind, humidity, the sky, the weekly pattern, the season, or how it was measured.`,
    quotesData: false,
  };
}
