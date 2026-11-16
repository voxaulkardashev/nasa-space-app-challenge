import type { WorldId } from '../data/types';
import type { Screen } from './navigation';

/**
 * Where each body sits in the 3D scene for a given screen.
 * Pure maths, no React, so it is easy to read and change.
 *
 * Units are "scene units"; a body with scale 1 has radius 1.
 * Sizes are NOT to scale (Mars's real radius is about 53% of Earth's);
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
  /** Explore "side by side" mode: show every world at once. */
  sideBySide = false,
  /** 2D map view: the globes shrink away (the flat map is drawn outside the 3D scene). */
  hidden = false,
): SceneLayout {
  const portrait = isPortrait(aspect);
  // Fewer worlds → bigger globes on the Select screen.
  const few = order.length <= 2;
  const spacing = portrait ? (few ? 3.0 : 2.4) : few ? 4.2 : 3.3;
  const selectScale = portrait ? (few ? 1.0 : 0.75) : few ? 1.55 : 1.15;
  const overviewScale = portrait ? 1.35 : 2.1;
  const selectCameraDistance = portrait ? 12 : 10;
  const labelGap = portrait ? 0.3 : 0.45;
  // On phones the stack sits a little low, leaving room for the title.
  // (A little higher than before, so the landing buttons and footer don't crowd the lower world's name.)
  const stackCentreY = portrait ? (few ? -0.3 : -0.45) : 0.05;

  const bodies = {} as Record<WorldId, BodyPose>;
  order.forEach((id, index) => {
    const offset = (index - (order.length - 1) / 2) * spacing;
    const selectPosition: [number, number, number] = portrait ? [0, stackCentreY - offset, 0] : [offset, stackCentreY, 0];

    if (hidden) {
      bodies[id] = { position: [0, 0, 0], scale: 0 };
    } else if (screen === 'explore' && sideBySide) {
      // Side by side: worlds in a row in the free space beside the sidebar.
      const sbsSpacing = portrait ? 1.95 : 3.6;
      const x = (index - (order.length - 1) / 2) * sbsSpacing;
      bodies[id] = { position: [x, portrait ? 0.35 : 0, 0], scale: portrait ? 0.8 : 1.45 };
    } else if (screen === 'select' || selectedId === null) {
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
