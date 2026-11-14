import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { WORLDS } from '../data/worlds';
import type { WorldId } from '../data/types';
import { computeLayout } from '../lib/layout';
import type { Screen } from '../lib/navigation';
import { CameraRig } from './CameraRig';
import { PlanetBody } from './PlanetBody';
import { PlanetLabel } from './PlanetLabel';

interface SpaceSceneProps {
  screen: Screen;
  selectedId: WorldId | null;
  hoveredId: WorldId | null;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
}

/**
 * The single 3D canvas that stays behind every screen. Keeping one canvas
 * means textures load once and the camera can glide between screens.
 */
export function SpaceScene(props: SpaceSceneProps) {
  return (
    <div className="space-scene">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        onPointerMissed={() => props.onHoverChange(null)}
      >
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}

function SceneContents({ screen, selectedId, hoveredId, onHoverChange, onSelect }: SpaceSceneProps) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const layout = computeLayout(
    WORLDS.map((w) => w.id),
    screen,
    selectedId,
    aspect,
  );
  const onSelectScreen = screen === 'select';
  const userControlled = screen === 'overview';

  return (
    <>
      {/* The Sun: one bright directional light from the upper left. */}
      <directionalLight position={[-6, 2.5, 5]} intensity={3} />
      {/* Very faint fill so the night side is not pure black. */}
      <ambientLight intensity={0.06} />

      {/* Decorative random starfield (not a real star catalogue). */}
      <Stars radius={120} depth={60} count={5000} factor={3.5} saturation={0} fade speed={0.4} />

      {WORLDS.map((world) => {
        const pose = layout.bodies[world.id];
        const [x, y, z] = pose.position;
        return (
          <group key={world.id}>
            <PlanetBody
              world={world}
              pose={pose}
              hovered={hoveredId === world.id}
              selected={selectedId === world.id}
              interactive={onSelectScreen}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
            />
            <PlanetLabel
              world={world}
              position={[x, y - pose.scale - layout.labelGap, z]}
              visible={onSelectScreen}
              hovered={hoveredId === world.id}
              onHoverChange={onHoverChange}
              onSelect={onSelect}
            />
          </group>
        );
      })}

      <CameraRig
        focused={!onSelectScreen}
        userControlled={userControlled}
        selectCameraDistance={layout.selectCameraDistance}
      />
      <OrbitControls
        makeDefault
        enabled={userControlled}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minDistance={3.4}
        maxDistance={16}
      />
    </>
  );
}
