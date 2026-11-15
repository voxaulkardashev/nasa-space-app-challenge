import { DONKI, RADIATION_CONTEXT } from '../data/spaceWeather';
import type { WorldId } from '../data/types';
import { spaceWeatherFacts } from '../lib/spaceWeatherFacts';
import { FactRow } from './FactRow';

interface SpaceWeatherSectionProps {
  worldId: WorldId;
}

/**
 * Recent solar activity from NASA DONKI, plus a NASA quote on how exposed this
 * world's surface is. Collapsed by default to keep the panel uncluttered.
 */
export function SpaceWeatherSection({ worldId }: SpaceWeatherSectionProps) {
  const facts = spaceWeatherFacts(DONKI);
  const context = RADIATION_CONTEXT[worldId];
  const summary = [
    DONKI.cmes ? `${DONKI.cmes.count} CMEs` : null,
    DONKI.storms ? `${DONKI.storms.count} storm${DONKI.storms.count === 1 ? '' : 's'}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <details className="space-weather">
      <summary>
        <span className="space-weather__title">Space weather · last 30 days</span>
        {summary && <span className="space-weather__summary">{summary}</span>}
      </summary>

      <blockquote className="space-weather__quote">
        “{context.quote}”
        <cite>
          —{' '}
          <a href={context.quoteSource.url} target="_blank" rel="noreferrer">
            {context.quoteSource.name}
          </a>
        </cite>
      </blockquote>
      <p className="space-weather__detail">
        {context.detail}{' '}
        <a href={context.detailSource.url} target="_blank" rel="noreferrer">
          ({context.detailSource.name})
        </a>
      </p>

      <ul className="info-panel__facts">
        {facts.map((fact) => (
          <FactRow key={fact.id} data={fact} />
        ))}
      </ul>

      <p className="space-weather__note">
        Events catalogued by NASA&apos;s DONKI from {DONKI.window.start} to {DONKI.window.end} (updated{' '}
        {DONKI.fetchedAt.slice(0, 10)}). DONKI records activity at the Sun and near Earth; it does not tell us which
        events reached Mars.
      </p>
    </details>
  );
}
