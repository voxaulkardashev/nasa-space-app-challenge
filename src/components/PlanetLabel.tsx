import { Html } from '@react-three/drei';
import type { World, WorldId } from '../data/types';

interface PlanetLabelProps {
  world: World;
  position: [number, number, number];
  visible: boolean;
  hovered: boolean;
  onHoverChange: (id: WorldId | null) => void;
  onSelect: (id: WorldId) => void;
}

/**
 * The name button under each world on the Select screen. It is a real HTML
 * button, so keyboard and screen-reader users can choose a world too.
 */
export function PlanetLabel({ world, position, visible, hovered, onHoverChange, onSelect }: PlanetLabelProps) {
  return (
    <Html position={position} center zIndexRange={[20, 10]}>
      <button
        type="button"
        className={`planet-label${hovered ? ' is-hovered' : ''}${visible ? '' : ' is-hidden'}`}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        onMouseEnter={() => onHoverChange(world.id)}
        onMouseLeave={() => onHoverChange(null)}
        onFocus={() => onHoverChange(world.id)}
        onBlur={() => onHoverChange(null)}
        onClick={() => onSelect(world.id)}
      >
        <span className="planet-label__name">{world.name}</span>
        <span className="planet-label__tagline">{world.tagline}</span>
      </button>
    </Html>
  );
}
