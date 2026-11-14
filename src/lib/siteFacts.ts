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

  const analogues: DataValue = {
    id: 'analogues',
    label: 'Similar Earth sites',
    value: 'Not yet available',
    status: 'placeholder',
    reason: 'The Earth analogue comparison is planned for a later milestone. No comparison has been made.',
  };

  return [coordinates, ...(featured?.facts ?? []), ...extra, analogues];
}
