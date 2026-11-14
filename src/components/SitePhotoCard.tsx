import { useState } from 'react';
import type { SitePhoto } from '../data/types';

interface SitePhotoCardProps {
  photo: SitePhoto;
}

/** A NASA photo of the selected site, with NASA's caption, date, credit and a link to the original record. */
export function SitePhotoCard({ photo }: SitePhotoCardProps) {
  const [failed, setFailed] = useState(false);
  const pageUrl = `https://images.nasa.gov/details/${encodeURIComponent(photo.nasaId)}`;

  return (
    <figure className="site-photo">
      {failed ? (
        <div className="site-photo__missing">Photo could not be loaded from NASA right now.</div>
      ) : (
        <a href={pageUrl} target="_blank" rel="noreferrer" className="site-photo__link">
          <img src={photo.imageUrl} alt={photo.caption} loading="lazy" onError={() => setFailed(true)} />
        </a>
      )}
      <figcaption>
        <span className="site-photo__caption">{photo.caption}</span>
        <span className="site-photo__meta">
          {photo.date} · {photo.center} · Credit: {photo.credit} ·{' '}
          <a href={pageUrl} target="_blank" rel="noreferrer">
            NASA Image and Video Library
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
