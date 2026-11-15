import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3, type Group } from 'three';
import type { MapLabel } from '../data/mapLabels';
import { latLonToVector } from '../lib/geo';

interface MapLabelsLayerProps {
  labels: MapLabel[];
  /** Scene radius of the surface at a point (raised in the Topography view). */
  radiusAt?: (lat: number, lon: number) => number;
}

const worldPos = new Vector3();
const centre = new Vector3();
const toCamera = new Vector3();

/** Place names (cities, named Martian features) glued to the globe. Hidden on the far side. */
export function MapLabelsLayer({ labels, radiusAt }: MapLabelsLayerProps) {
  return (
    <>
      {labels.map((l) => (
        <PlaceLabel key={l.id} label={l} radius={(radiusAt?.(l.lat, l.lon) ?? 1) + 0.0003} />
      ))}
    </>
  );
}

function PlaceLabel({ label, radius }: { label: MapLabel; radius: number }) {
  const group = useRef<Group>(null);
  const el = useRef<HTMLSpanElement>(null);
  const position = useMemo(() => latLonToVector(label.lat, label.lon, radius), [label.lat, label.lon, radius]);

  useFrame(({ camera }) => {
    const g = group.current;
    const span = el.current;
    if (!g || !span) return;
    g.getWorldPosition(worldPos);
    g.parent?.getWorldPosition(centre);
    centre.subVectors(worldPos, centre).normalize();
    toCamera.subVectors(camera.position, worldPos).normalize();
    span.style.opacity = centre.dot(toCamera) > 0.2 ? '1' : '0';
  });

  return (
    <group ref={group} position={position}>
      {/* Not `center`: the label is shifted in CSS so its DOT, not the middle of the text, sits on the coordinates. */}
      <Html zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
        <span ref={el} className={`place-label place-label--${label.worldId} is-anchored`} title={label.kind}>
          <span className="place-label__dot" aria-hidden="true" />
          {label.name}
        </span>
      </Html>
    </group>
  );
}
