interface SelectWorldScreenProps {
  active: boolean;
}

/**
 * Screen 1: the title and footnotes. The worlds themselves (and their name
 * buttons) live in the shared 3D scene behind this layer.
 */
export function SelectWorldScreen({ active }: SelectWorldScreenProps) {
  return (
    <section className={`screen screen--select${active ? ' is-active' : ''}`} inert={!active} aria-label="Select a world">
      <header className="select-header">
        <p className="eyebrow">Planetary Analogue Explorer</p>
        <h1 className="select-title">Select a World</h1>
        <p className="select-subtitle">Choose a body to view it in 3D using NASA imagery.</p>
      </header>
      <footer className="select-footer">
        Sizes are not to scale · Starfield is decorative · Imagery: NASA (see “About this imagery” on each world)
      </footer>
    </section>
  );
}
