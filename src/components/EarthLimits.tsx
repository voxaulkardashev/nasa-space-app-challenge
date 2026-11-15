import { RADIATION_CONTEXT } from '../data/spaceWeather';
import { WORLD_METRICS } from '../data/worldComparison';
import { MetricBars } from './MetricBars';

/** "What Earth cannot reproduce": gravity, thin atmosphere and radiation (CLAUDE.md rule 5). */
export function EarthLimits() {
  return (
    <section className="compare__world">
      <h3>What Earth cannot reproduce</h3>
      <div className="compare__metrics">
        {WORLD_METRICS.map((m) => (
          <MetricBars key={m.id} metric={m} />
        ))}
      </div>
      {/* Radiation must always be stated (CLAUDE.md rule 5), so this note stays without the old "Radiation shielding" box. */}
      <p className="compare__muted compare__radiation-note">
        Radiation: Mars has a far thinner atmosphere (6.36 vs 1014 mbar) and{' '}
        <a href={RADIATION_CONTEXT.mars.quoteSource.url} target="_blank" rel="noreferrer">
          no global magnetic field
        </a>
        , the two layers that protect Earth’s surface. No Earth analogue site can reproduce Mars’s gravity, thin air or radiation environment.
      </p>
    </section>
  );
}
