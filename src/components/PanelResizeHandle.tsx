import { useRef } from 'react';
import { clampPanelWidth, savePanelWidth, usePanelWidth } from '../lib/panelWidth';

/** Right margin of the sidebar in px (matches 1.25rem in index.css). */
const RIGHT_MARGIN = 20;

/**
 * Grab handle on the sidebar's left edge: drag to make the sidebar wider or
 * narrower (desktop only). Arrow keys also work when it has focus.
 */
export function PanelResizeHandle() {
  const { width, setWidth } = usePanelWidth();
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.classList.add('is-resizing');
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setWidth(clampPanelWidth(window.innerWidth - e.clientX - RIGHT_MARGIN));
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    document.body.classList.remove('is-resizing');
    savePanelWidth(width);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 60 : 20;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = clampPanelWidth(width + (e.key === 'ArrowLeft' ? step : -step));
      setWidth(next);
      savePanelWidth(next);
    }
  };

  return (
    <div
      className="panel-resize"
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize the sidebar"
      aria-valuenow={width}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <span className="panel-resize__grip" aria-hidden="true" />
    </div>
  );
}
