import { useState } from 'react';
import { FEATURED_SITES } from '../data/featuredSites';
import type { FeaturedSite } from '../data/types';
import { getWorld } from '../data/worlds';

interface SiteSearchProps {
  onChoose: (site: FeaturedSite) => void;
}

/** Search box for featured sites on both worlds (by name or type, e.g. "crater"). */
export function SiteSearch({ onChoose }: SiteSearchProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = q
    ? FEATURED_SITES.filter((s) => `${s.name} ${s.kind} ${getWorld(s.worldId).name}`.toLowerCase().includes(q)).slice(0, 8)
    : [];

  const choose = (site: FeaturedSite) => {
    onChoose(site);
    setQuery('');
  };

  return (
    <div className="site-search">
      <input
        type="search"
        className="site-search__input"
        placeholder="Search sites on Mars and Earth…"
        aria-label="Search featured sites"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) choose(results[0]);
          if (e.key === 'Escape') {
            e.stopPropagation();
            setQuery('');
          }
        }}
      />
      {q && (
        <ul className="site-search__results" role="listbox">
          {results.length === 0 && <li className="site-search__empty">No featured site matches “{query}”.</li>}
          {results.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => choose(s)}>
                <span>{s.name}</span>
                <span className="site-search__meta">
                  {getWorld(s.worldId).name} · {s.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
