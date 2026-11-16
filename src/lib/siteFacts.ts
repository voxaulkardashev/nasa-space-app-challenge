import { pairsForSite } from '../data/analogues';
import { getFeaturedSite } from '../data/featuredSites';
import type { DataValue, World } from '../data/types';
import { formatLatLon, pixelSizeKm } from './geo';
import type { SelectedSite } from './navigation';

/** Width in pixels of the colour maps the user clicks on (see docs/SOURCES.md). */
const COLOR_MAP_WIDTH_PX = 4096;

/**
 * The data rows shown for a selected site. Every row is a DataValue, so it
 * always carries a Measured / Estimated / Placeholder label.
 * Extra rows (e.g. elevation) are passed in by the caller.
 */
export function siteFacts(world: World, site: SelectedSite, extra: DataValue[] = []): DataValue[] {
  const featured = site.featuredId ? getFeaturedSite(site.featuredId) : undefined;
  const precision = pixelSizeKm(world.meanRadiusKm, COLOR_MAP_WIDTH_PX);
  let coordinates: DataValue;

  if (featured && featured.coordinateStatus === 'measured') {
    coordinates = {
      id: 'coordinates',
      label: 'Coordinates',
      value: formatLatLon(site),
      note: 'Latitude, east-positive longitude',
      status: 'measured',
      source: featured.coordinateSource,
    };
  } else if (featured && featured.coordinateStatus === 'placeholder') {
    coordinates = {
      id: 'coordinates',
      label: 'Coordinates',
      value: formatLatLon(site),
      note: 'Temporary marker',
      status: 'placeholder',
      reason: featured.coordinateMethod ?? 'Temporary location.',
    };
  } else if (featured) {
    coordinates = {
      id: 'coordinates',
      label: 'Coordinates',
      value: formatLatLon(site),
      note: 'Approximate — to be confirmed',
      status: 'estimated',
      method: featured.coordinateMethod ?? 'Approximate location.',
      source: featured.coordinateSource,
    };
  } else {
    coordinates = {
      id: 'coordinates',
      label: 'Coordinates',
      value: formatLatLon(site),
      note: `Latitude, east-positive longitude · about ±${precision.toFixed(1)} km`,
      status: 'estimated',
      method: `Calculated from the point you clicked on the ${COLOR_MAP_WIDTH_PX}-pixel-wide map. One pixel there is about ${precision.toFixed(1)} km at the equator, so the position is only as precise as that.`,
    };
  }

  // The analogue chosen for a featured site (dropped pins have none, so no row is shown).
  const others = featured
    ? pairsForSite(featured.id)
        .map((p) => getFeaturedSite(featured.worldId === 'mars' ? p.earthSiteId : (p.marsSiteId ?? '')))
        .filter((f): f is NonNullable<typeof f> => Boolean(f))
    : [];
  const analogues: DataValue[] = others.length
    ? [
        {
          id: 'analogues',
          label: featured?.worldId === 'mars' ? 'Similar Earth site' : 'Similar Mars site',
          value: others.map((o) => o.name).join(', '),
          note: 'Shares some features; not the same place. See Compare.',
          status: 'estimated',
          method: 'Chosen by our team from the research cited in the Compare view (not a NASA-documented pair and not a computed similarity score).',
        },
      ]
    : [];

  return [coordinates, ...(featured?.facts ?? []), ...extra, ...analogues];
}
