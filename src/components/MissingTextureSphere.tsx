import { Html } from '@react-three/drei';

interface MissingTextureSphereProps {
  worldName: string;
  path: string;
}

/**
 * Shown when a texture file cannot be loaded. It is deliberately obvious
 * (plain grey + a visible label) so nobody mistakes it for real imagery.
 */
export function MissingTextureSphere({ worldName, path }: MissingTextureSphereProps) {
  return (
    <mesh>
      <sphereGeometry args={[1, 48, 24]} />
      <meshStandardMaterial color="#555b66" roughness={1} />
      <Html center className="missing-texture">
        <strong>Texture missing</strong>
        <span>
          {worldName}: {path}
        </span>
      </Html>
    </mesh>
  );
}
