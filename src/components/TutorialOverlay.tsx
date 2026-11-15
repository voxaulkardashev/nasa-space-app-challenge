import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { TutorialStep } from '../data/tutorial';

interface TutorialOverlayProps {
  step: TutorialStep;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const PAD = 8;
const CARD_W = 340;
const GAP = 14;

/** One box around every rendered element matching the selector (or null if there is none). Off-screen
 *  elements still count, so the highlight follows them while a panel scrolls them into view. */
function measure(selector: string | undefined, first = false): Box | null {
  if (!selector) return null;
  const rects = [...document.querySelectorAll(selector)]
    .filter((el) => !el.closest('[inert]'))
    .slice(0, first ? 1 : undefined)
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
  if (!rects.length) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left: left - PAD, top: top - PAD, width: right - left + PAD * 2, height: bottom - top + PAD * 2 };
}

/** Where the card goes: beside the highlight if there is room, otherwise above or below it (phones: top or bottom). */
function cardPosition(box: Box | null, cardH: number): { left: number; top: number } {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cardW = Math.min(CARD_W, w - 24);
  const clampX = (x: number) => Math.max(12, Math.min(w - cardW - 12, x));
  const clampY = (y: number) => Math.max(12, Math.min(h - cardH - 12, y));
  if (!box) return { left: (w - cardW) / 2, top: clampY((h - cardH) / 2) };
  if (w <= 760) {
    // Phones: the card sits at the opposite end of the screen from the highlight.
    const below = box.top + box.height / 2 < h / 2;
    return { left: clampX((w - cardW) / 2), top: below ? h - cardH - 16 : 16 };
  }
  if (box.left + box.width + GAP + cardW <= w - 12) return { left: box.left + box.width + GAP, top: clampY(box.top) };
  if (box.left - GAP - cardW >= 12) return { left: box.left - GAP - cardW, top: clampY(box.top) };
  if (box.top + box.height + GAP + cardH <= h - 12) return { left: clampX(box.left), top: box.top + box.height + GAP };
  return { left: clampX(box.left), top: clampY(box.top - GAP - cardH) };
}

/**
 * Guided tour: dims the page, cuts a highlighted "spotlight" around the step's
 * target and shows a card with the explanation and Back / Next / Skip.
 * It follows the target while the app animates (camera flights, panels opening).
 */
export function TutorialOverlay({ step, index, total, onNext, onBack, onClose }: TutorialOverlayProps) {
  const [box, setBox] = useState<Box | null>(null);
  const [cardH, setCardH] = useState(220);
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const last = index === total - 1;

  // Bring the target into view inside scrolling panels (e.g. the sidebar) when the step starts.
  // (Instant, not smooth: a long smooth scroll could still be moving when the step is read.)
  useEffect(() => {
    const reveal = () => {
      if (!step.target) return;
      const el = [...document.querySelectorAll(step.target)].find((e) => !e.closest('[inert]'));
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ block: 'nearest' });
    };
    // Once the screen has switched, and again after panels finish opening.
    const timers = [250, 900].map((ms) => window.setTimeout(reveal, ms));
    nextRef.current?.focus();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  // Follow the target every frame (things move while the app animates); only re-render when it changes.
  useEffect(() => {
    let raf = 0;
    let prev = '';
    const tick = () => {
      const b = measure(step.target, step.first);
      const key = b ? `${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.width)},${Math.round(b.height)}` : 'none';
      if (key !== prev) {
        prev = key;
        setBox(b);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight);
  }, [step, box]);

  // Keys: arrows move, Esc closes (and stops the app's own Esc "go back").
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft' && index > 0) onBack();
      else return;
      e.stopPropagation();
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [index, onNext, onBack, onClose]);

  const pos = cardPosition(box, cardH);

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-body">
      {/* The spotlight: a transparent box whose huge shadow dims everything else. It stays mounted
          (so it glides between targets); with no target it shrinks to the centre and just dims the page. */}
      <div
        className={`tour__spotlight${box ? '' : ' is-empty'}`}
        style={box ? { left: box.left, top: box.top, width: box.width, height: box.height } : { left: '50%', top: '50%', width: 0, height: 0 }}
      />
      <div ref={cardRef} className="tour__card" style={{ left: pos.left, top: pos.top, width: Math.min(CARD_W, window.innerWidth - 24) }}>
        <p className="tour__count">
          Step {index + 1} of {total}
        </p>
        <h2 id="tour-title" className="tour__title">
          {step.title}
        </h2>
        <p id="tour-body" className="tour__body">
          {step.body}
        </p>
        <div className="tour__progress" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i === index ? 'is-on' : i < index ? 'is-done' : ''} />
          ))}
        </div>
        <div className="tour__actions">
          <button type="button" className="btn btn--ghost tour__skip" onClick={onClose}>
            {last ? 'Close' : 'Skip tour'}
          </button>
          <span className="tour__nav">
            {index > 0 && (
              <button type="button" className="btn btn--ghost" onClick={onBack}>
                Back
              </button>
            )}
            <button ref={nextRef} type="button" className="btn btn--primary" onClick={last ? onClose : onNext}>
              {last ? 'Finish' : 'Next'}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
