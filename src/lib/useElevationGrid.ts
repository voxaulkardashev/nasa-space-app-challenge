import { useEffect, useState } from 'react';
import { ELEVATION } from '../data/elevation';
import type { WorldId } from '../data/types';
import { assetUrl } from '../data/worlds';
import { loadElevationGrid, type ElevationGrid } from './elevationGrid';

export type ElevationState =
  | { status: 'unavailable' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; grid: ElevationGrid };

const cache = new Map<WorldId, Promise<ElevationGrid>>();

/** Loads a world's elevation grid the first time it is needed (only on the Explore screen). */
export function useElevationGrid(worldId: WorldId | null, enabled: boolean): ElevationState {
  const dataset = worldId ? ELEVATION[worldId] : undefined;
  const [state, setState] = useState<{ id: WorldId | null; value: ElevationState }>({
    id: null,
    value: { status: 'loading' },
  });

  useEffect(() => {
    if (!worldId || !dataset || !enabled) return;
    let cancelled = false;
    let promise = cache.get(worldId);
    if (!promise) {
      promise = loadElevationGrid(dataset, assetUrl(dataset.path));
      cache.set(worldId, promise);
    }
    promise.then(
      (grid) => !cancelled && setState({ id: worldId, value: { status: 'ready', grid } }),
      (err: unknown) => {
        cache.delete(worldId);
        if (!cancelled) setState({ id: worldId, value: { status: 'error', message: String(err) } });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [worldId, dataset, enabled]);

  if (!dataset) return { status: 'unavailable' };
  return state.id === worldId ? state.value : { status: 'loading' };
}
