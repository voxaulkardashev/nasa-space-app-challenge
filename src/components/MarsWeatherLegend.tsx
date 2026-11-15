import { RAMP_CSS } from '../lib/weather/colorRamp';
import type { MarsGrid } from '../lib/weather/marsNow';

/** Colour key for the Mars weather map: the colour scale with the lowest and highest model values. */
export function MarsWeatherLegend({ grid, label }: { grid: MarsGrid; label: string }) {
  const unit = grid.unit === 'C' ? '°C' : grid.unit === 'tau' ? '' : grid.unit;
  return (
    <div className="mars-legend" aria-label={`${label} colour key`}>
      <span className="mars-legend__label">{label} on the globe</span>
      <span className="mars-legend__bar" style={{ background: RAMP_CSS }} />
      <span className="mars-legend__ends">
        <span>
          {grid.min} {unit}
        </span>
        <span>
          {grid.max} {unit}
        </span>
      </span>
    </div>
  );
}
