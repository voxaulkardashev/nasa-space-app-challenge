import { RADIATION_CONTEXT } from '../data/spaceWeather';
import { WORLD_METRICS } from '../data/worldComparison';
import { getWorld } from '../data/worlds';
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
      <div className="compare__radiation">
        <h4>Radiation shielding</h4>
        <div className="compare__radiation-grid">
          {(['mars', 'earth'] as const).map((id) => (
            <blockquote key={id}>
              <strong>{getWorld(id).name}:</strong> “{RADIATION_CONTEXT[id].quote}”
              <cite>
                <a href={RADIATION_CONTEXT[id].quoteSource.url} target="_blank" rel="noreferrer">
                  {RADIATION_CONTEXT[id].quoteSource.name}
                </a>
              </cite>
            </blockquote>
          ))}
        </div>
        <p className="compare__muted">
          NASA describes two layers of protection on Earth: a thick atmosphere and a global magnetic field. Mars has a far
          thinner atmosphere (6.36 vs 1014 mbar) and no global magnetic field, so it lacks both. No Earth analogue site can
          reproduce Mars’s gravity, thin air or radiation environment.
        </p>
      </div>
    </section>
  );
}
