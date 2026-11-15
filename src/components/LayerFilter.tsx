import { useState } from 'react';
import { GEO_LAYERS } from '../data/geoLayers';
import type { GeoLayerId } from '../data/types';

interface LayerFilterProps {
  active: GeoLayerId[];
  onChange: (layers: GeoLayerId[]) => void;
  /** How many featured sites on this world are currently shown. */
  shownCount: number;
  totalCount: number;
}

/**
 * Drop-down of geological filter layers. Several can be on at once; the globe
 * and the featured-site list then show only sites in those layers.
 */
export function LayerFilter({ active, onChange, shownCount, totalCount }: LayerFilterProps) {
  const [open, setOpen] = useState(false);
  const toggle = (id: GeoLayerId) =>
    onChange(active.includes(id) ? active.filter((l) => l !== id) : [...active, id]);

  return (
    <div className={`layer-filter${open ? ' is-open' : ''}`}>
      <button type="button" className="btn btn--ghost layer-filter__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">◧</span> Geological layers
        <span className="layer-filter__count">
          {shownCount}/{totalCount} sites
        </span>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="layer-filter__menu" role="group" aria-label="Geological layers">
          {GEO_LAYERS.map((layer) => (
            <label key={layer.id} className="layer-filter__item">
              <input type="checkbox" checked={active.includes(layer.id)} onChange={() => toggle(layer.id)} />
              <span className="layer-filter__swatch" style={{ background: layer.color }} aria-hidden="true" />
              <span>
                <span className="layer-filter__label">{layer.label}</span>
                <span className="layer-filter__desc">{layer.description}</span>
              </span>
            </label>
          ))}
          <div className="layer-filter__actions">
            <button type="button" onClick={() => onChange(GEO_LAYERS.map((l) => l.id))}>
              All
            </button>
            <button type="button" onClick={() => onChange([])}>
              None
            </button>
          </div>
          <p className="layer-filter__note">
            Sites are grouped by the team from the NASA and IAU descriptions cited for each site. This filters sites; it
            is not a geological map.
          </p>
        </div>
      )}
    </div>
  );
}
