import { useEffect } from 'react';
import { getFeaturedSite } from '../data/featuredSites';
import type { FeaturedSite } from '../data/types';
import { USE_CASES } from '../data/useCases';
import { getWorld } from '../data/worlds';

interface UseCasesModalProps {
  onClose: () => void;
  onGo: (site: FeaturedSite) => void;
}

/** "Use cases": what NASA has actually used each place for, grouped, with sources. No rankings. */
export function UseCasesModal({ onClose, onGo }: UseCasesModalProps) {
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

  return (
    <div className="compare-backdrop" onClick={onClose}>
      <div className="compare use-cases" role="dialog" aria-modal="true" aria-labelledby="use-cases-title" onClick={(e) => e.stopPropagation()}>
        <header className="compare__header">
          <div>
            <p className="info-panel__eyebrow">Places and use cases</p>
            <h2 id="use-cases-title" className="compare__title">
              How NASA uses these places
            </h2>
            <p className="compare__muted">
              Each entry is a documented NASA use, with its source. These are not rankings or scores: we have not rated which
              site is “best”.
            </p>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Close use cases">
            ✕ Close
          </button>
        </header>

        <div className="use-cases__groups">
          {USE_CASES.map((group) => (
            <section key={group.id} className="use-cases__group">
              <h3>{group.title}</h3>
              <p className="compare__muted">{group.intro}</p>
              <ul>
                {group.entries.map((entry) => {
                  const site = getFeaturedSite(entry.siteId);
                  if (!site) return null;
                  return (
                    <li key={`${group.id}-${entry.siteId}`} className="use-cases__entry">
                      <button
                        type="button"
                        className="use-cases__site"
                        onClick={() => {
                          onGo(site);
                          onClose();
                        }}
                      >
                        {site.name} <span className="use-cases__world">{getWorld(site.worldId).name}</span> <span aria-hidden="true">→</span>
                      </button>
                      <p>{entry.text}</p>
                      <a href={entry.source.url} target="_blank" rel="noreferrer" className="use-cases__source">
                        {entry.source.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
