import { useEffect, useState } from 'react';
import { pairsForSite } from '../data/analogues';
import { getFeaturedSite } from '../data/featuredSites';
import { SITE_PHOTOS } from '../data/sitePhotos';
import { SITE_RESEARCH } from '../data/siteResearch';
import type { FeaturedSite } from '../data/types';
import { getWorld } from '../data/worlds';
import { elevationFacts } from '../lib/elevationFacts';
import { formatLatLon } from '../lib/geo';
import type { SelectedSite } from '../lib/navigation';
import { useElevationGrid } from '../lib/useElevationGrid';
import { FactRow } from './FactRow';
import { EarthLimits } from './EarthLimits';
import { SitePhotoCard } from './SitePhotoCard';
import { SiteResearchColumn } from './SiteResearchColumn';

interface CompareModalProps {
  site: SelectedSite;
  onClose: () => void;
}

/**
 * Compare view: a Mars site and its Earth analogue (NASA-documented, or chosen by our team and marked so) side by
 * side, with cited similarities and differences, and the world-level things
 * Earth cannot reproduce (gravity, thin atmosphere, radiation).
 */
export function CompareModal({ site, onClose }: CompareModalProps) {
  const featured = site.featuredId ? getFeaturedSite(site.featuredId) : undefined;
  const pairs = featured ? pairsForSite(featured.id) : [];
  const [pairIndex, setPairIndex] = useState(0);
  const pair = pairs[Math.min(pairIndex, pairs.length - 1)];
  const marsElevation = useElevationGrid('mars', true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const marsSite = pair?.marsSiteId ? getFeaturedSite(pair.marsSiteId) : site.worldId === 'mars' ? featured : undefined;
  const earthSite = pair ? getFeaturedSite(pair.earthSiteId) : site.worldId === 'earth' ? featured : undefined;
  const title = pair
    ? `${marsSite?.name ?? 'Mars (in general)'} ⇄ ${earthSite?.name ?? 'Earth'}`
    : `${featured?.name ?? 'Selected site'} · Mars vs Earth`;

  return (
    <div className="compare-backdrop" onClick={onClose}>
      <div className="compare" role="dialog" aria-modal="true" aria-labelledby="compare-title" onClick={(e) => e.stopPropagation()}>
        <header className="compare__header">
          <div>
            <p className="info-panel__eyebrow">Compare</p>
            <h2 id="compare-title" className="compare__title">
              {title}
            </h2>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Close compare view">
            ✕ Close
          </button>
        </header>

        {pairs.length > 1 && (
          <div className="compare__tabs" role="tablist">
            {pairs.map((p, i) => {
              const otherId = site.worldId === 'mars' ? p.earthSiteId : p.marsSiteId;
              return (
                <button key={p.id} type="button" role="tab" aria-selected={i === pairIndex} className={`compare__tab${i === pairIndex ? ' is-active' : ''}`} onClick={() => setPairIndex(i)}>
                  {(otherId && getFeaturedSite(otherId)?.name) ?? 'Mars (in general)'}
                </button>
              );
            })}
          </div>
        )}

        <section className="compare__sites">
          <SiteColumn label="Mars" site={marsSite} elevation={marsSite ? elevationFacts(getWorld('mars'), marsSite, marsElevation) : []} />
          <SiteColumn
            label="Earth"
            site={earthSite}
            elevation={
              earthSite?.elevation ? [earthSite.elevation] : []
            }
          />
        </section>

        {pair?.documentedBy === 'placeholder' ? (
          <p className="compare__source compare__pair-source">
            <strong>Placeholder:</strong> an Earth analog for this site has not been selected yet. The Earth location and its map marker are temporary and
            are not a scientific comparison.
          </p>
        ) : pair?.documentedBy === 'team' ? (
          <p className="compare__source compare__pair-source">
            Analogue pair chosen by our team, <strong>not a NASA-documented pair</strong>. Each reason is cited in the columns above (main source:{' '}
            <a href={pair.source.url} target="_blank" rel="noreferrer">
              {pair.source.name}
            </a>
            ). Analogues share some features; they are not the same place.
          </p>
        ) : pair ? (
          <p className="compare__source compare__pair-source">
            Analogue pair from{' '}
            <a href={pair.source.url} target="_blank" rel="noreferrer">
              {pair.source.name}
            </a>{' '}
            — “{pair.title}” (accessed {pair.source.accessed}). NASA calls these places <em>analogs</em>: they share some features; they are not the same.
          </p>
        ) : (
          <p className="compare__muted compare__nopair">No NASA-documented analogue pair for this site in our list yet.</p>
        )}

        <EarthLimits />
      </div>
    </div>
  );
}

interface SiteColumnProps {
  label: string;
  site: FeaturedSite | undefined;
  elevation: ReturnType<typeof elevationFacts>;
}

function SiteColumn({ label, site, elevation }: SiteColumnProps) {
  if (!site) {
    return (
      <div className="compare__site is-empty">
        <p className="compare__site-world">{label}</p>
        <p className="compare__muted">No specific {label} site for this comparison.</p>
      </div>
    );
  }
  const photo = SITE_PHOTOS[site.id];
  const research = SITE_RESEARCH[site.id];
  if (research) {
    // Sites with team research (Gale) show it in place of the standard photo + facts.
    return (
      <div className="compare__site">
        <p className="compare__site-world">{label}</p>
        <h3 className="compare__site-name">{site.name}</h3>
        <SiteResearchColumn research={research} />
      </div>
    );
  }
  return (
    <div className="compare__site">
      <p className="compare__site-world">{label}</p>
      <h3 className="compare__site-name">{site.name}</h3>
      {photo ? <SitePhotoCard key={photo.nasaId} photo={photo} /> : <div className="compare__nophoto">No NASA photo for this site in our list.</div>}
      <ul className="info-panel__facts">
        <FactRow
          data={
            site.coordinateStatus === 'measured'
              ? { id: 'coords', label: 'Coordinates', value: formatLatLon(site), status: 'measured', source: site.coordinateSource }
              : { id: 'coords', label: 'Coordinates', value: formatLatLon(site), status: 'estimated', method: site.coordinateMethod ?? 'Approximate location.', source: site.coordinateSource }
          }
        />
        {site.facts.map((f) => (
          <FactRow key={f.id} data={f} />
        ))}
        {elevation.map((f) => (
          <FactRow key={f.id} data={f} />
        ))}
      </ul>
    </div>
  );
}
