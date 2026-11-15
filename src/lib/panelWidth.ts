import { createContext, useContext } from 'react';

/** Shared sidebar width (desktop), changed by dragging the sidebar's left edge. */
export interface PanelWidthState {
  width: number;
  setWidth: (px: number) => void;
}

export const PanelWidthContext = createContext<PanelWidthState>({ width: 400, setWidth: () => {} });

export const usePanelWidth = () => useContext(PanelWidthContext);

const STORAGE_KEY = 'pae.panelWidth';
export const MIN_PANEL_WIDTH = 300;

export function maxPanelWidth(): number {
  return Math.max(MIN_PANEL_WIDTH, Math.min(760, Math.round(window.innerWidth * 0.6)));
}

export function clampPanelWidth(px: number): number {
  return Math.round(Math.min(maxPanelWidth(), Math.max(MIN_PANEL_WIDTH, px)));
}

/** Starting width: the viewer's last choice if saved, else 400 px (or 36% of narrow screens). */
export function initialPanelWidth(): number {
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (saved) return clampPanelWidth(saved);
  } catch {
    // Storage can be unavailable (private mode); fall back to the default.
  }
  return clampPanelWidth(Math.min(400, window.innerWidth * 0.36));
}

export function savePanelWidth(px: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(px));
  } catch {
    // Not important if it cannot be saved.
  }
}
