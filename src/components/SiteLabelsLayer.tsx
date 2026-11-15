import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Vector3, type Group } from 'three';
import { layerColor } from '../data/geoLayers';
import type { FeaturedSite, GeoLayerId } from '../data/types';
import { latLonToVector } from '../lib/geo';

interface SiteLabelsLayerProps {
  sites: FeaturedSite[];
  activeLayers: GeoLayerId[];
  selectedSiteId?: string;
  onChoose: (site: FeaturedSite) => void;
  /** Scene radius of the surface at a point (raised in the Topography view). */
  radiusAt?: (lat: number, lon: number) => number;
}

const worldPos = new Vector3();
const worldNormal = new Vector3();
const toCamera = new Vector3();

/**
 * Labelled dots for the featured sites, glued to the rotating world (like
 * pins on a map). Labels on the far side of the globe are hidden.
 */
export function SiteLabelsLayer({ sites, activeLayers, selectedSiteId, onChoose, radiusAt }: SiteLabelsLayerProps) {
  return (
    <>
      {sites.map((site) => (
        <SiteLabel
          key={site.id}
          site={site}
          color={layerColor(site.layers.find((l) => activeLayers.includes(l)) ?? site.layers[0])}
          selected={site.id === selectedSiteId}
          onChoose={onChoose}
          radius={(radiusAt?.(site.lat, site.lon) ?? 1) + 0.0003}
        />
      ))}
    </>
  );
}

interface SiteLabelProps {
  site: FeaturedSite;
  color: string;
  selected: boolean;
  onChoose: (site: FeaturedSite) => void;
  radius: number;
}

function SiteLabel({ site, color, selected, onChoose, radius }: SiteLabelProps) {
  const group = useRef<Group>(null);
  const labelRef = useRef<HTMLButtonElement>(null);
  const position = useMemo(() => latLonToVector(site.lat, site.lon, radius), [site.lat, site.lon, radius]);

  useFrame(({ camera }) => {
    const g = group.current;
    const el = labelRef.current;
    if (!g || !el) return;
    // Visible only when the site faces the camera.
    g.getWorldPosition(worldPos);
    g.parent?.getWorldPosition(worldNormal);
    worldNormal.subVectors(worldPos, worldNormal).normalize();
    toCamera.subVectors(camera.position, worldPos).normalize();
    const facing = worldNormal.dot(toCamera) > 0.15;
    el.style.opacity = facing ? '1' : '0';
    el.style.pointerEvents = facing ? 'auto' : 'none';
  });

  return (
    <group ref={group} position={position}>
      {/* Not `center`: the pin is shifted in CSS so its DOT, not the middle of the name, sits on the site. */}
      <Html zIndexRange={[15, 5]} style={{ pointerEvents: 'none' }}>
        <button
          ref={labelRef}
          type="button"
          className={`site-pin is-anchored${selected ? ' is-selected' : ''}`}
          style={{ ['--pin' as string]: color }}
          onClick={(e) => {
            e.stopPropagation();
            onChoose(site);
          }}
        >
          <span className="site-pin__dot" aria-hidden="true" />
          <span className="site-pin__name">{site.name}</span>
        </button>
      </Html>
    </group>
  );
}
