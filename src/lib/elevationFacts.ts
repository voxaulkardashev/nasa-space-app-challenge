import type { DataValue, World } from '../data/types';
import { cellSizeKm, elevationAt, slopeAt } from './elevationGrid';
import type { LatLon } from './geo';
import type { ElevationState } from './useElevationGrid';

const formatMetres = (m: number) => `${m < 0 ? '−' : ''}${Math.abs(m).toLocaleString('en-US')} m`;

/** Elevation and slope rows for a site, each with its data label. */
export function elevationFacts(world: World, site: LatLon, state: ElevationState): DataValue[] {
  if (state.status === 'unavailable') {
    return [
      {
        id: 'elevation',
        label: 'Elevation',
        value: 'Not yet available',
        status: 'placeholder',
        reason: `No elevation dataset has been added for ${world.name} yet.`,
      },
    ];
  }
  if (state.status === 'loading') {
    return [{ id: 'elevation', label: 'Elevation', value: 'Loading…', status: 'placeholder', reason: 'The elevation data is still downloading.' }];
  }
  if (state.status === 'error') {
    return [
      { id: 'elevation', label: 'Elevation', value: 'Could not load', status: 'placeholder', reason: `The elevation file failed to load: ${state.message}` },
    ];
  }

  const { grid } = state;
  const [ewKm, nsKm] = cellSizeKm(grid, site.lat, world.meanRadiusKm);
  const cellText = `${nsKm.toFixed(1)} km`;
  const elevation: DataValue = {
    id: 'elevation',
    label: 'Elevation',
    value: formatMetres(elevationAt(grid, site)),
    note: `Average of a ${cellText} grid cell, ${grid.dataset.reference}`,
    status: 'measured',
    source: {
      ...grid.dataset.source,
      name: `${grid.dataset.source.name}: ${grid.dataset.dataset}`,
    },
  };

  const slope = slopeAt(grid, site, world.meanRadiusKm);
  const slopeRow: DataValue =
    slope === null
      ? {
          id: 'slope',
          label: 'Regional slope',
          value: 'Not available near the pole',
          status: 'placeholder',
          reason: 'Grid cells become too narrow near the poles for this slope calculation.',
        }
      : {
          id: 'slope',
          label: 'Regional slope',
          value: `${slope.toFixed(1)}°`,
          note: `Averaged over about ${(2 * Math.max(ewKm, nsKm)).toFixed(0)} km; local slopes can be much steeper`,
          status: 'estimated',
          method: `Calculated by us from the height differences between neighbouring cells of the elevation grid (central differences over two ${cellText} cells).`,
        };

  return [elevation, slopeRow];
}
