import { Fragment, useState, type ReactNode } from 'react';
import type { ResearchCitation, ResearchFigure, SiteResearch } from '../data/siteResearch';
import { assetUrl } from '../data/worlds';
import { FactRow } from './FactRow';
import { SiteLiveWeather } from './SiteLiveWeather';

interface SiteResearchColumnProps {
  research: SiteResearch;
}

/** Turns "text [[1]] more" into text with clickable citation links. */
function withCitations(text: string, citations: ResearchCitation[]): ReactNode {
  return text.split(/(\[\[\d+\]\])/).map((part, i) => {
    const m = /^\[\[(\d+)\]\]$/.exec(part);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    const c = citations.find((x) => x.n === Number(m[1]));
    if (!c) return <Fragment key={i}>{part}</Fragment>;
    return (
      <a key={i} className="research__cite" href={c.url} target="_blank" rel="noreferrer" title={c.title}>
        [{c.n}]
      </a>
    );
  });
}

function ResearchImage({ figure }: { figure: ResearchFigure }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="site-photo research__figure">
      {failed ? (
        <div className="site-photo__missing">Image could not be loaded. See the source link below.</div>
      ) : (
        <a href={figure.sourceUrl} target="_blank" rel="noreferrer" className="site-photo__link">
          <img
            src={assetUrl(figure.src)}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </a>
      )}
      <figcaption>
        <span className="site-photo__caption">{figure.caption}</span>
        <span className="site-photo__meta">
          Credit: {figure.credit} · Source:{' '}
          <a href={figure.sourceUrl} target="_blank" rel="noreferrer">
            {figure.sourceLabel}
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Compare view: a site's research in place of the standard column (photo + facts),
 * in sections with images, labelled values and numbered, clickable citations.
 */
export function SiteResearchColumn({ research }: SiteResearchColumnProps) {
  return (
    <div className="research">
      {research.sections.map((section) => (
        <section key={section.id} className="research__section" aria-labelledby={`research-${section.id}`}>
          <h4 id={`research-${section.id}`} className="research__title">
            {section.title}
          </h4>
          {section.paragraphs.map((p, i) => (
            <p key={i} className="research__text">
              {withCitations(p, research.citations)}
            </p>
          ))}
          {section.facts && (
            <ul className="info-panel__facts research__facts">
              {section.facts.map((f) => (
                <FactRow key={f.id} data={f} />
              ))}
            </ul>
          )}
          {section.live && <SiteLiveWeather lat={section.live.lat} lon={section.live.lon} place={section.live.place} />}
          {section.figure && <ResearchImage figure={section.figure} />}
          {section.notes?.map((note, i) => (
            <p key={i} className="research__note">
              {note}
            </p>
          ))}
        </section>
      ))}

      <section className="research__section" aria-labelledby="research-sources">
        <h4 id="research-sources" className="research__title">
          Sources
        </h4>
        <ol className="research__sources">
          {research.citations.map((c) => (
            <li key={c.n} value={c.n}>
              <a href={c.url} target="_blank" rel="noreferrer">
                {c.title}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
