import { useState } from 'react';
import { AboutModal } from '../components/AboutModal';
import { TUTORIAL_SEEN_KEY } from '../data/tutorial';

interface SelectWorldScreenProps {
  active: boolean;
  /** Starts the guided tour. */
  onStartTour: () => void;
  tourRunning: boolean;
}

/** Whether this browser has already seen (or dismissed) the tour offer. */
function tourSeen(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Screen 1: the title, the "About the project" button and footnotes. The
 * worlds themselves (and their name buttons) live in the shared 3D scene
 * behind this layer.
 */
export function SelectWorldScreen({ active, onStartTour, tourRunning }: SelectWorldScreenProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  // First visit: offer the tour once (remembered in this browser).
  const [offer, setOffer] = useState(() => !tourSeen());
  const dismissOffer = () => {
    setOffer(false);
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
    } catch {
      // Not saved: the offer may show again next visit.
    }
  };
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
        <button type="button" className="btn btn--ghost select-about__btn" onClick={onStartTour}>
          <span aria-hidden="true">?</span> Take the tour
        </button>
      </div>
      {offer && active && !tourRunning && (
        <div className="tour-offer" role="dialog" aria-label="Take the tour">
          <p className="tour-offer__title">New here?</p>
          <p className="tour-offer__text">Take a quick guided tour of how the explorer works.</p>
          <div className="tour-offer__actions">
            <button type="button" className="btn btn--ghost" onClick={dismissOffer}>
              No thanks
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setOffer(false);
                onStartTour();
              }}
            >
              Start the tour
            </button>
          </div>
        </div>
      )}
      <footer className="select-footer">
        Sizes are not to scale · Starfield is decorative · Imagery: NASA (see “About this imagery” on each world)
      </footer>
      {aboutOpen && active && <AboutModal onClose={() => setAboutOpen(false)} />}
    </section>
  );
}
