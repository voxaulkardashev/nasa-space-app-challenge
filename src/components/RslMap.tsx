import { useEffect, useRef, useState } from 'react';
import { MAP_LABELS } from '../data/mapLabels';
import { RSL_CONTEXT_LINKS, RSL_PRECISION_NOTE, RSL_SITES, rslLon } from '../data/rslSites';
import { assetUrl, getWorld } from '../data/worlds';
import { RslSiteDetails } from './RslSiteDetails';

interface RslMapProps {
  /** The featured site whose column shows this map (its marker gets a ring). */
  siteId?: string;
}

/** Map window: latitudes 30° N to 70° S (every plotted site lies inside), all longitudes. */
const NORTH = 30;
const SOUTH = -70;
const SPAN = NORTH - SOUTH;
/** Named places shown as plain grey context text (IAU/USGS names already used by the app). */
const CONTEXT_IDS = ['mars-valles-marineris', 'mars-argyre-planitia', 'mars-hellas-planitia', 'mars-olympus-mons'];
const ZOOMS = [1, 2, 3];

const left = (lon: number) => `${((lon + 180) / 360) * 100}%`;
const top = (lat: number) => `${((NORTH - lat) / SPAN) * 100}%`;

/**
 * "Where RSL have been observed on Mars": the Mars colour map with one marker per
 * sourced HiRISE observation (src/data/rslSites.ts). Click a marker or a name to
 * see its coordinates, what was observed and the sources. Zoom with − / +.
 */
export function RslMap({ siteId }: RslMapProps) {
  const [selectedId, setSelectedId] = useState(RSL_SITES.find((s) => s.featuredId === siteId)?.id ?? RSL_SITES[0].id);
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = RSL_SITES.find((s) => s.id === selectedId) ?? RSL_SITES[0];
  const mars = getWorld('mars');
  const context = MAP_LABELS.mars.filter((l) => CONTEXT_IDS.includes(l.id));

  // Keep the selected marker in view when zoomed in.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = ((rslLon(selected) + 180) / 360) * el.scrollWidth;
    el.scrollTo({ left: x - el.clientWidth / 2 });
  }, [zoom, selected]);

  return (
    <div className="rsl-map">
      <h5 className="rsl-map__title">Where RSL have been observed on Mars</h5>
      <p className="rsl-map__intro">
        Each marker is a place where NASA reports RSL in a HiRISE image. Click a marker or a name for its coordinates and sources; zoom in (+) where markers are close together.
      </p>

      <div className="rsl-map__frame">
        <div ref={scrollRef} className="rsl-map__scroll">
          <div className="rsl-map__world" style={{ width: `${zoom * 100}%` }}>
            <img
              className="rsl-map__image"
              src={assetUrl(mars.textures.color)}
              alt="Map of Mars from 30° N to 70° S with markers at observed RSL sites."
              style={{ top: `${(-(90 - NORTH) / SPAN) * 100}%`, height: `${(180 / SPAN) * 100}%` }}
              draggable={false}
            />
            {context.map((l) => (
              <span key={l.id} className="rsl-map__context" style={{ left: left(l.lon), top: top(l.lat) }}>
                {l.name}
              </span>
            ))}
            {RSL_SITES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`rsl-marker${s.id === selectedId ? ' is-selected' : ''}${s.featuredId && s.featuredId === siteId ? ' is-home' : ''}`}
                style={{ left: left(rslLon(s)), top: top(s.lat) }}
                aria-label={`${i + 1}. ${s.name}`}
                aria-pressed={s.id === selectedId}
                title={s.name}
                onClick={() => setSelectedId(s.id)}
              >
                <span className="rsl-marker__shape" aria-hidden="true" />
                <span className="rsl-marker__num" aria-hidden="true">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rsl-map__zoom">
          <button type="button" onClick={() => setZoom((z) => ZOOMS[Math.max(0, ZOOMS.indexOf(z) - 1)])} disabled={zoom === ZOOMS[0]} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={() => setZoom((z) => ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(z) + 1)])} disabled={zoom === ZOOMS[ZOOMS.length - 1]} aria-label="Zoom in">
            +
          </button>
        </div>
      </div>

      <ul className="rsl-map__legend" aria-label="Legend">
        <li>
          <span className="rsl-legend rsl-legend--site" aria-hidden="true" /> RSL observed (marker = centre of the HiRISE image)
        </li>
        {siteId && (
          <li>
            <span className="rsl-legend rsl-legend--home" aria-hidden="true" /> Hale Crater, this site
          </li>
        )}
        <li>
          <span className="rsl-legend rsl-legend--context" aria-hidden="true">
            Aa
          </span>{' '}
          Place name for orientation only (IAU), not an RSL site
        </li>
      </ul>

      <ol className="rsl-map__list">
        {RSL_SITES.map((s) => (
          <li key={s.id}>
            <button type="button" className={s.id === selectedId ? 'is-selected' : ''} aria-pressed={s.id === selectedId} onClick={() => setSelectedId(s.id)}>
              {s.name}
            </button>
          </li>
        ))}
      </ol>

      <RslSiteDetails site={selected} />

      <p className="research__note">{RSL_PRECISION_NOTE}</p>
      <p className="research__note">
        This map is not complete: it shows the {RSL_SITES.length} sites whose sources we checked, while NASA says HiRISE has confirmed RSL at more than
        50 sites. Places described only as candidate or possible RSL are not plotted. Context:{' '}
        {RSL_CONTEXT_LINKS.map((c, i) => (
          <span key={c.url}>
            {i > 0 && '; '}
            <a href={c.url} target="_blank" rel="noreferrer">
              {c.label}
            </a>
          </span>
        ))}
        . Base map: Viking colour mosaic used by this app (colours approximate).
      </p>
    </div>
  );
}
