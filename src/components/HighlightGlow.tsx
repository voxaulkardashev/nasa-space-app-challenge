import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { AdditiveBlending, Color, MathUtils, type ShaderMaterial } from 'three';

interface HighlightGlowProps {
  color: string;
  /** 0 = invisible, 1 = full glow. Animated smoothly towards this value. */
  strength: number;
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    float glow = pow(rim, 2.5) * uStrength;
    gl_FragColor = vec4(uColor * glow, glow);
  }
`;

/**
 * A soft rim of light around a body, used ONLY as a hover/selection highlight.
 * It is an interface effect, not a depiction of an atmosphere.
 */
export function HighlightGlow({ color, strength }: HighlightGlowProps) {
  const materialRef = useRef<ShaderMaterial>(null);

  useEffect(() => {
    materialRef.current?.uniforms.uColor.value.set(color);
  }, [color]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms.uStrength;
    u.value = MathUtils.damp(u.value, strength, 8, delta);
  });

  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
        args={[
          {
            uniforms: { uColor: { value: new Color(color) }, uStrength: { value: 0 } },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
          },
        ]}
      />
    </mesh>
  );
}
