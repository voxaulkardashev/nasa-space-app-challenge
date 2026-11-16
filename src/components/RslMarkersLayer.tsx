import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3, type Group } from 'three';
import { rslLon, type RslSite } from '../data/rslSites';
import { latLonToVector } from '../lib/geo';

interface RslMarkersLayerProps {
  sites: RslSite[];
  openId?: string | null;
  onOpen: (id: string) => void;
  /** Scene radius of the surface at a point (raised in the Topography view). */
  radiusAt?: (lat: number, lon: number) => number;
}

const worldPos = new Vector3();
const centre = new Vector3();
const toCamera = new Vector3();

/** "RSL observed" markers on the Mars globe (one per sourced HiRISE observation). Hidden on the far side. */
export function RslMarkersLayer({ sites, openId, onOpen, radiusAt }: RslMarkersLayerProps) {
  return (
    <>
      {sites.map((s) => (
        <RslMarker key={s.id} site={s} open={s.id === openId} onOpen={onOpen} radius={(radiusAt?.(s.lat, rslLon(s)) ?? 1) + 0.0003} />
      ))}
    </>
  );
}

function RslMarker({ site, open, onOpen, radius }: { site: RslSite; open: boolean; onOpen: (id: string) => void; radius: number }) {
  const group = useRef<Group>(null);
  const el = useRef<HTMLButtonElement>(null);
  const position = useMemo(() => latLonToVector(site.lat, rslLon(site), radius), [site, radius]);

  useFrame(({ camera }) => {
    const g = group.current;
    const b = el.current;
    if (!g || !b) return;
    g.getWorldPosition(worldPos);
    g.parent?.getWorldPosition(centre);
    centre.subVectors(worldPos, centre).normalize();
    toCamera.subVectors(camera.position, worldPos).normalize();
    const facing = centre.dot(toCamera) > 0.15;
    b.style.opacity = facing ? '1' : '0';
    b.style.pointerEvents = facing ? 'auto' : 'none';
  });

  return (
    <group ref={group} position={position}>
      <Html zIndexRange={[20, 16]} style={{ pointerEvents: 'none' }}>
        <button
          ref={el}
          type="button"
          className={`rsl-pin${open ? ' is-selected' : ''}`}
          title={`RSL observed: ${site.name}`}
          aria-label={`RSL observed: ${site.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(site.id);
          }}
        >
          <span className="rsl-pin__shape" aria-hidden="true" />
        </button>
      </Html>
    </group>
  );
}
