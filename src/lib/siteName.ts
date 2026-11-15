import { getFeaturedSite } from '../data/featuredSites';
import { formatLatLon } from './geo';
import type { SelectedSite } from './navigation';

/** "Jezero crater", or "Your pin (18.41° N, 77.69° E)" for a dropped pin. */
export function siteName(site: SelectedSite): string {
  const featured = site.featuredId ? getFeaturedSite(site.featuredId) : undefined;
  return featured ? featured.name : `Your pin (${formatLatLon(site, 1)})`;
}
