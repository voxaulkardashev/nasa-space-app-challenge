import type { GeoLayerId } from './types';

/**
 * Geological filter layers for the Explore screen. Each featured site is
 * assigned to layers by the team, based on the NASA / IAU descriptions cited
 * for that site (see docs/SOURCES.md). This filters which sites are shown;
 * it is not a geological map overlay.
 */
export interface GeoLayer {
  id: GeoLayerId;
  label: string;
  description: string;
  /** Marker colour on the globe. */
  color: string;
}

export const GEO_LAYERS: GeoLayer[] = [
  { id: 'impact', label: 'Impact structures', description: 'Craters and basins made by impacts', color: '#ff9b6b' },
  { id: 'aeolian', label: 'Aeolian processes', description: 'Landforms shaped by wind, such as dunes and ripples', color: '#ffd166' },
  { id: 'sediments', label: 'Sediments & mineralogy', description: 'Lakebeds, deltas, salts and mineral deposits', color: '#7fd1ae' },
  { id: 'terrain', label: 'Terrain, glaciers & rivers', description: 'Volcanoes, canyons, plains, ice and river landforms', color: '#8ec5ff' },
];

export const ALL_LAYER_IDS: GeoLayerId[] = GEO_LAYERS.map((l) => l.id);

export function layerColor(id: GeoLayerId): string {
  return GEO_LAYERS.find((l) => l.id === id)?.color ?? '#ffffff';
}
