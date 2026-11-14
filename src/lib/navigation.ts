import type { LatLon } from './geo';
import type { WorldId } from '../data/types';

/**
 * Which screen is showing. Kept as simple app state (no router library).
 * Future screens (e.g. the analogue comparison) are added here.
 */
export type Screen = 'select' | 'overview' | 'explore';

/** The site the user picked on the Explore screen. */
export interface SelectedSite extends LatLon {
  worldId: WorldId;
  /** How it was chosen: a click on the globe, or a featured site from the list. */
  picked: 'click' | 'featured';
  /** Featured site id, when picked from the list. */
  featuredId?: string;
}
