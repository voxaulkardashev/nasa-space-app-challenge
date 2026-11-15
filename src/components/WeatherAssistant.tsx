import { useEffect, useRef, useState, type FormEvent } from 'react';
import { REMS_DISCLAIMER } from '../data/weatherSources';
import type { DataValue, World } from '../data/types';
import type { SelectedSite } from '../lib/navigation';
import { siteName } from '../lib/siteName';
import { answer, summaryMessage, SUGGESTED_QUESTIONS } from '../lib/weather/assistant';
import { formatDate } from '../lib/weather/dates';
import { dateRange, defaultDate } from '../lib/weather/defaults';
import { weatherValue } from '../lib/weather/provenance';
import type { WeatherState } from '../lib/weather/useWeather';
import { DataLabel } from './DataLabel';
import { WeatherFacts } from './WeatherFacts';
import { MarsNowCard } from './MarsNowCard';
import type { MarsNowState } from '../lib/weather/useMarsNow';
import { sampleMarsGrid, MARS_NOW_PARAMS, type MarsNowParam } from '../lib/weather/marsNow';
import { marsNowReply, NOW_QUESTION } from '../lib/weather/assistant';
import { usePsgLocal } from '../lib/weather/usePsgLocal';

interface WeatherAssistantProps {
  world: World;
  site: SelectedSite | null;
  state: WeatherState | undefined;
  onAnalyze: (site: SelectedSite, date: string) => void;
  /** The pin on the other world, if there is one (for the comparison). */
  otherSite: SelectedSite | null;
  onCompareWeather: () => void;
  /** Mars only: current NASA model conditions (all of Mars) and the globe colour layer. */
  marsNow?: { state: MarsNowState; onRefresh: () => void; overlay: MarsNowParam | null; onOverlayChange: (p: MarsNowParam | null) => void };
}

interface QA {
  id: number;
  question: string;
  reply: string;
  quotesData: boolean;
  /** The report the reply was built from. */
  reportAt: string;
}

/**
 * Weather assistant at the top of the Explore sidebar. Rule-based: it only
 * repeats and summarises values downloaded from NASA, so it cannot invent weather.
 */
export function WeatherAssistant({ world, site, state, onAnalyze, otherSite, onCompareWeather, marsNow }: WeatherAssistantProps) {
  const range = dateRange(world.id);
  const [date, setDate] = useState(state?.date ?? defaultDate(world.id));
  const [input, setInput] = useState('');
  const [qa, setQa] = useState<QA[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const report = state?.status === 'ready' ? state.report : undefined;
  // Mars: PSG's exact reading for this pin (what its website shows). Refresh asks again.
  const [localNonce, setLocalNonce] = useState(0);
  const local = usePsgLocal(world.id === 'mars' && marsNow ? site : null, localNonce);
  const marsNowProps = marsNow && { ...marsNow, local, onRefresh: () => { marsNow.onRefresh(); setLocalNonce((n) => n + 1); } };
  const thread = report ? qa.filter((m) => m.reportAt === report.fetchedAt) : [];

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread.length, report?.fetchedAt]);

  if (!site) {
    return (
      <section className="weather info-box" aria-label="Weather assistant">
        <h3 className="info-box__title">Weather assistant</h3>
        <p className="weather__muted">Press <strong>📍 Drop pin</strong> and click the globe, or choose a site, then pick a date to see its weather from NASA data.</p>
        {world.id === 'mars' && marsNowProps && <MarsNowCard site={null} {...marsNowProps} />}
      </section>
    );
  }

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    // "What's it like right now?" on Mars: answer from NASA's current model, if it has loaded.
    const now = world.id === 'mars' && marsNow?.state.status === 'ready' ? marsNow.state.data : null;
    const exact = local.status === 'ready' ? local.data : null;
    const reply =
      exact && NOW_QUESTION.test(q.toLowerCase())
        ? {
            text: marsNowReply(
              [
                { label: 'Air temperature', value: exact.airNowC, unit: '°C', digits: 0 },
                { label: 'Ground temperature', value: exact.groundNowC, unit: '°C', digits: 0 },
                { label: 'Surface pressure', value: exact.pressureMbar, unit: 'mbar', digits: 3 },
                { label: 'Wind speed', value: exact.windKmh, unit: 'km/h', digits: 0 },
                { label: 'Dust opacity (τ)', value: exact.dustTau, unit: '', digits: 3 },
                { label: 'Water vapour', value: exact.vaporPrUm, unit: 'pr-µm', digits: 1 },
              ].flatMap((v) => (v.value === null ? [] : [{ ...v, value: v.value }])),
              exact.model,
              exact.marsTime,
            ),
            quotesData: false,
          }
        : now && NOW_QUESTION.test(q.toLowerCase())
        ? {
            text: marsNowReply(
              MARS_NOW_PARAMS.flatMap((p) => {
                const g = now.grids[p.id];
                return g ? [{ label: p.label, value: sampleMarsGrid(g, site.lat, site.lon), unit: p.unit, digits: p.digits }] : [];
              }),
              now.model,
              now.marsTime,
            ),
            quotesData: false,
          }
        : answer(q, report ?? null);
    setQa((list) => [...list, { id: list.length, question: q, reply: reply.text, quotesData: reply.quotesData, reportAt: report?.fetchedAt ?? '' }]);
    setInput('');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };
  const label: DataValue | null = report?.focus ? weatherValue(report, 'chat', 'Weather in this reply', 'values quoted above') : null;
  const otherName = world.id === 'mars' ? 'Earth' : 'Mars';

  return (
    <section className="weather info-box" aria-label="Weather assistant">
      <h3 className="info-box__title">Weather assistant · {siteName(site)}</h3>
      <form
        className="weather__controls"
        onSubmit={(e) => {
          e.preventDefault();
          if (date) onAnalyze(site, date);
        }}
      >
        <label className="weather__date">
          <span>Date</span>
          <input type="date" value={date} min={range.min} max={range.max} required onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="submit" className="btn btn--primary weather__analyze" disabled={state?.status === 'loading'}>
          {state?.status === 'loading' ? 'Loading…' : 'Analyze'}
        </button>
      </form>
      <p className="weather__muted">
        {world.id === 'earth'
          ? `NASA POWER: daily values from ${formatDate(range.min)} to about 3 days ago.`
          : 'Mars: Curiosity’s daily weather reports from Gale crater (the only Mars station with a daily NASA feed here).'}
      </p>

      {world.id === 'mars' && marsNowProps && <MarsNowCard site={site} {...marsNowProps} />}

      {state?.status === 'error' && <p className="weather__error" role="alert">{state.error}</p>}

      {report && (
        <>
          <div className="weather__log" ref={logRef} aria-live="polite">
            <div className="weather__msg weather__msg--bot">
              <p>{summaryMessage(report)}</p>
              {label && <DataLabel data={label} />}
            </div>
            {thread.map((m) => (
              <div key={m.id}>
                <div className="weather__msg weather__msg--user"><p>{m.question}</p></div>
                <div className="weather__msg weather__msg--bot">
                  <p>{m.reply}</p>
                  {m.quotesData && label && <DataLabel data={label} />}
                </div>
              </div>
            ))}
          </div>
          {report.focus && (
            <>
              <div className="weather__chips">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button key={q} type="button" className="weather__chip" onClick={() => ask(q)}>
                    {q}
                  </button>
                ))}
              </div>
              <form className="weather__ask" onSubmit={submit}>
                <input type="text" value={input} placeholder="Ask about this weather…" aria-label="Ask the weather assistant" onChange={(e) => setInput(e.target.value)} />
                <button type="submit" className="btn">Ask</button>
              </form>
              <WeatherFacts report={report} />
              {report.source === 'rems' && <p className="weather__disclaimer">{REMS_DISCLAIMER}</p>}
            </>
          )}
        </>
      )}

      {otherSite ? (
        <button type="button" className="btn weather__compare" onClick={onCompareWeather}>
          Compare weather with {siteName(otherSite)} on {otherName}
        </button>
      ) : (
        <p className="weather__muted">To compare weather, also drop a pin (or choose a site) on {otherName}.</p>
      )}
    </section>
  );
}
