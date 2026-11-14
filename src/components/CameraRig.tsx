import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { usesBottomPanel } from '../lib/layout';

interface CameraRigProps {
  /** True while a single world is being viewed (overview / coming soon). */
  focused: boolean;
  /** True when the user may rotate/zoom (OrbitControls is in charge). */
  userControlled: boolean;
  selectCameraDistance: number;
}

/**
 * Moves the camera smoothly between screens.
 *
 * - On the Select screen it glides back to a fixed front view.
 * - When a world is focused it shifts the picture sideways (desktop) or
 *   upwards (phone) so the world is not hidden behind the info panel.
 *   This uses a "view offset", which moves the image without moving the
 *   orbit centre, so rotating still spins around the middle of the world.
 */
export function CameraRig({ focused, userControlled, selectCameraDistance }: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const progress = useRef(0);

  useFrame((_, delta) => {
    progress.current = MathUtils.damp(progress.current, focused ? 1 : 0, 4, delta);

    if (!userControlled) {
      camera.position.set(
        MathUtils.damp(camera.position.x, 0, 3, delta),
        MathUtils.damp(camera.position.y, 0, 3, delta),
        MathUtils.damp(camera.position.z, selectCameraDistance, 3, delta),
      );
      camera.lookAt(0, 0, 0);
    }

    if (camera instanceof PerspectiveCamera) {
      const { width, height } = size;
      const bottomPanel = usesBottomPanel(width);
      const shiftX = bottomPanel ? 0 : Math.min(230, width * 0.17) * progress.current;
      const shiftY = bottomPanel ? height * 0.2 * progress.current : 0;
      camera.setViewOffset(width, height, shiftX, shiftY, width, height);
    }
  });

  return null;
}
