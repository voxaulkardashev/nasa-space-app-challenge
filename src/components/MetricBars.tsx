import type { WorldMetric } from '../data/worldComparison';
import { DataLabel } from './DataLabel';

interface MetricBarsProps {
  metric: WorldMetric;
}

const MARS_COLOR = '#f0a27a';
const EARTH_COLOR = '#8ec5ff';

/** A small two-bar chart (Mars vs Earth) for one measured value. Plain SVG, no chart library. */
export function MetricBars({ metric }: MetricBarsProps) {
  const toLen = (v: number) => (metric.scale === 'log' ? Math.log10(v + 1) : v);
  const max = Math.max(toLen(metric.mars.value), toLen(metric.earth.value));
  const rows = [
    { name: 'Mars', color: MARS_COLOR, v: metric.mars },
    { name: 'Earth', color: EARTH_COLOR, v: metric.earth },
  ];

  return (
    <figure className="metric">
      <figcaption className="metric__title">
        {metric.label}
        {metric.scale === 'log' && <span className="metric__scale">log scale</span>}
      </figcaption>
      <svg className="metric__chart" viewBox="0 0 300 64" role="img" aria-label={`${metric.label}: Mars ${metric.mars.display}, Earth ${metric.earth.display}`}>
        {rows.map((row, i) => {
          const w = Math.max(2, (toLen(row.v.value) / max) * 140);
          const y = 6 + i * 30;
          return (
            <g key={row.name}>
              <text x="0" y={y + 15} className="metric__axis">
                {row.name}
              </text>
              <rect x="48" y={y} width={w} height="20" rx="4" fill={row.color} opacity="0.85" />
              <text x={52 + w} y={y + 15} className="metric__value">
                {row.v.display}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="metric__labels">
        <DataLabel data={{ id: `${metric.id}-mars`, label: `${metric.label} (Mars)`, value: metric.mars.display, status: 'measured', source: metric.mars.source }} />
        <DataLabel data={{ id: `${metric.id}-earth`, label: `${metric.label} (Earth)`, value: metric.earth.display, status: 'measured', source: metric.earth.source }} />
      </div>
      <p className="metric__note">{metric.note}</p>
    </figure>
  );
}
