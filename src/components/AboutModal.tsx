import { useEffect } from 'react';
import { ABOUT_SECTIONS } from '../data/about';

interface AboutModalProps {
  onClose: () => void;
}

/** "About the project" pop-up on the landing page: the team's three titled sections. */
export function AboutModal({ onClose }: AboutModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div className="compare-backdrop" onClick={onClose}>
      <div className="compare about" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
        <header className="compare__header">
          <div>
            <p className="info-panel__eyebrow">Planetary Analogue Explorer</p>
            <h2 id="about-title" className="compare__title">
              About the project
            </h2>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Close about">
            ✕ Close
          </button>
        </header>
        {ABOUT_SECTIONS.map((section) => (
          <section key={section.id} className="info-box" aria-labelledby={`about-${section.id}`}>
            <h3 id={`about-${section.id}`} className="info-box__title">
              {section.title}
            </h3>
            <p className="info-box__body">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
