import type { World, WorldId } from '../data/types';

interface WorldSwitchProps {
  worlds: World[];
  activeId: WorldId;
  onChange: (id: WorldId) => void;
}

/** Large two-way switch (Mars | Earth) for jumping between worlds on the Explore screen. */
export function WorldSwitch({ worlds, activeId, onChange }: WorldSwitchProps) {
  const activeIndex = Math.max(
    0,
    worlds.findIndex((w) => w.id === activeId),
  );
  return (
    <div
      className="world-switch"
      role="group"
      aria-label="Switch world"
      style={{ ['--count' as string]: worlds.length, ['--index' as string]: activeIndex }}
    >
      <span className="world-switch__thumb" aria-hidden="true" />
      {worlds.map((w) => (
        <button
          key={w.id}
          type="button"
          className={`world-switch__option${w.id === activeId ? ' is-active' : ''}`}
          aria-pressed={w.id === activeId}
          onClick={() => onChange(w.id)}
        >
          <span className="world-switch__dot" style={{ background: w.highlightColor }} aria-hidden="true" />
          {w.name}
        </button>
      ))}
    </div>
  );
}
