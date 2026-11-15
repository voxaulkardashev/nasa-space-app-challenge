import { useState } from 'react';
import { AboutModal } from '../components/AboutModal';

interface SelectWorldScreenProps {
  active: boolean;
}

/**
 * Screen 1: the title, the "About the project" button and footnotes. The
 * worlds themselves (and their name buttons) live in the shared 3D scene
 * behind this layer.
 */
export function SelectWorldScreen({ active }: SelectWorldScreenProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <section className={`screen screen--select${active ? ' is-active' : ''}`} inert={!active} aria-label="Select a world">
      <header className="select-header">
        <p className="eyebrow">Planetary Analogue Explorer</p>
        <h1 className="select-title">Select a World</h1>
        <p className="select-subtitle">Choose a body to view it in 3D using NASA imagery.</p>
      </header>
      <div className="select-about">
        <button type="button" className="btn btn--ghost select-about__btn" onClick={() => setAboutOpen(true)}>
          <span aria-hidden="true">ⓘ</span> About the project
        </button>
      </div>
      <footer className="select-footer">
        Sizes are not to scale · Starfield is decorative · Imagery: NASA (see “About this imagery” on each world)
      </footer>
      {aboutOpen && active && <AboutModal onClose={() => setAboutOpen(false)} />}
    </section>
  );
}
