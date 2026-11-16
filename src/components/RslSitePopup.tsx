import type { RslSite } from '../data/rslSites';
import { RslSiteDetails } from './RslSiteDetails';

interface RslSitePopupProps {
  site: RslSite;
  onClose: () => void;
}

/** Explore screen: details of the RSL marker the user clicked on the globe or 2D map. */
export function RslSitePopup({ site, onClose }: RslSitePopupProps) {
  return (
    <div className="rsl-popup" role="dialog" aria-label={`RSL observation: ${site.name}`}>
      <div className="rsl-popup__head">
        <span className="rsl-popup__eyebrow">
          <span className="rsl-legend rsl-legend--site" aria-hidden="true" /> RSL observed
        </span>
        <button type="button" className="rsl-popup__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <RslSiteDetails site={site} compact />
      <p className="rsl-popup__note">Marker = centre of the HiRISE image (accurate to a few km). Choose the Hale site and press Compare for the full RSL map and research.</p>
    </div>
  );
}
