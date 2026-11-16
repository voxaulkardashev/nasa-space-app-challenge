import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from 'three';
import { buildStarfield } from '../lib/starfield';

const VERTEX = /* glsl */ `
  attribute vec3 color;
  attribute float size;
  attribute float phase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = color;
    vTwinkle = 0.82 + 0.18 * sin(uTime * (0.6 + fract(phase) * 0.8) + phase);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.5, size * uPixelRatio * (420.0 / -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 1.5) * vTwinkle;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.6 + 0.4 * core), alpha);
  }
`;

/**
 * Decorative starfield behind the planets: white, blue, yellow and orange-red stars of different
 * sizes, with a few dense clusters and some emptier patches, twinkling gently. Not a real star map.
 */
export function Starfield() {
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const data = buildStarfield();
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(data.positions, 3));
    g.setAttribute('color', new BufferAttribute(data.colors, 3));
    g.setAttribute('size', new BufferAttribute(data.sizes, 1));
    g.setAttribute('phase', new BufferAttribute(data.phases, 1));
    return g;
  }, []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );
  const mat = useRef(material);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame((state) => {
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uPixelRatio.value = Math.min(dpr, 2);
  });

  return <points geometry={geometry} material={material} raycast={() => null} frustumCulled={false} />;
}
