import type { ImageryCredit } from '../data/types';

interface ImageryCreditsProps {
  imagery: ImageryCredit[];
}

/** Collapsible list of where the 3D body's images come from, with caveats. */
export function ImageryCredits({ imagery }: ImageryCreditsProps) {
  return (
    <details className="imagery-credits">
      <summary>About this imagery</summary>
      <ul>
        {imagery.map((item) => (
          <li key={item.role}>
            <strong>{item.role}:</strong> {item.dataset}.{' '}
            <a href={item.source.url} target="_blank" rel="noreferrer">
              {item.source.name}
            </a>{' '}
            ({item.source.sourceDate}; accessed {item.source.accessed}). {item.processing}
            {item.caveat && <em className="imagery-credits__caveat"> {item.caveat}</em>}
          </li>
        ))}
      </ul>
    </details>
  );
}
