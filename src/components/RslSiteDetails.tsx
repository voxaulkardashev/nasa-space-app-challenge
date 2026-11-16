import { rslCoordinateValue, type RslSite } from '../data/rslSites';
import { FactRow } from './FactRow';

interface RslSiteDetailsProps {
  site: RslSite;
  /** Heading level text size: 'small' inside the Explore pop-up. */
  compact?: boolean;
}

/** One RSL observation site: name, sourced coordinates, what was seen, and clickable sources. */
export function RslSiteDetails({ site, compact = false }: RslSiteDetailsProps) {
  return (
    <div className={`rsl-site${compact ? ' rsl-site--compact' : ''}`}>
      <p className="rsl-site__name">{site.name}</p>
      <ul className="info-panel__facts rsl-site__facts">
        <FactRow data={rslCoordinateValue(site)} />
      </ul>
      <p className="rsl-site__text">{site.description}</p>
      <p className="rsl-site__obs">
        Coordinates from HiRISE image{' '}
        <a href={site.observation.url} target="_blank" rel="noreferrer">
          {site.observation.id}
        </a>{' '}
        ({site.observation.date}).
      </p>
      <p className="rsl-site__label">Sources</p>
      <ul className="rsl-site__sources">
        {site.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
