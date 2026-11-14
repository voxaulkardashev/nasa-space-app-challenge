import type { WorldId } from '../data/types';
import type { Screen } from './navigation';

/**
 * Where each body sits in the 3D scene for a given screen.
 * Pure maths, no React, so it is easy to read and change.
 *
 * Units are "scene units"; a body with scale 1 has radius 1.
 * Sizes are NOT to scale (the real Moon is ~27% of Earth's radius);
 * the Select screen says so on screen.
 */

export interface BodyPose {
  position: [number, number, number];
  scale: number;
}

export interface SceneLayout {
  bodies: Record<WorldId, BodyPose>;
  /** Camera distance from the centre on the Select screen. */
  selectCameraDistance: number;
  /** Gap between the bottom of a world and its name button. */
  labelGap: number;
}

/** Must match the 760px breakpoint in index.css where the info panel moves to the bottom. */
export function usesBottomPanel(widthPx: number): boolean {
  return widthPx <= 760;
}

/** Narrow portrait screens (phones) stack the worlds vertically. */
export function isPortrait(aspect: number): boolean {
  return aspect < 0.85;
}

export function computeLayout(
  order: WorldId[],
  screen: Screen,
  selectedId: WorldId | null,
  aspect: number,
): SceneLayout {
  const portrait = isPortrait(aspect);
  const spacing = portrait ? 2.4 : 3.3;
  const selectScale = portrait ? 0.75 : 1.15;
  const overviewScale = portrait ? 1.35 : 2.1;
  const selectCameraDistance = portrait ? 12 : 10;
  const labelGap = portrait ? 0.3 : 0.45;
  // On phones the stack sits a little low, leaving room for the title.
  const stackCentreY = portrait ? -0.45 : 0.15;

  const bodies = {} as Record<WorldId, BodyPose>;
  order.forEach((id, index) => {
    const offset = (index - (order.length - 1) / 2) * spacing;
    const selectPosition: [number, number, number] = portrait ? [0, stackCentreY - offset, 0] : [offset, stackCentreY, 0];

    if (screen === 'select' || selectedId === null) {
      bodies[id] = { position: selectPosition, scale: selectScale };
    } else if (id === selectedId) {
      bodies[id] = { position: [0, 0, 0], scale: overviewScale };
    } else {
      // Other worlds shrink away while one is being viewed.
      bodies[id] = {
        position: [selectPosition[0] * 2.2, selectPosition[1] * 2.2, -4],
        scale: 0,
      };
    }
  });

  return { bodies, selectCameraDistance, labelGap };
}
