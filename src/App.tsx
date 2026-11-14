import { useEffect, useState } from 'react';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SpaceScene } from './components/SpaceScene';
import type { WorldId } from './data/types';
import { getWorld } from './data/worlds';
import type { Screen } from './lib/navigation';
import { ComingSoonScreen } from './screens/ComingSoonScreen';
import { SelectWorldScreen } from './screens/SelectWorldScreen';
import { WorldOverviewScreen } from './screens/WorldOverviewScreen';

/**
 * The whole app: one 3D scene in the background, and the screens layered
 * on top. Navigation is just two pieces of state: which screen, which world.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedId, setSelectedId] = useState<WorldId | null>(null);
  const [hoveredId, setHoveredId] = useState<WorldId | null>(null);

  const selectedWorld = selectedId ? getWorld(selectedId) : null;

  const selectWorld = (id: WorldId) => {
    setSelectedId(id);
    setHoveredId(null);
    setScreen('overview');
  };
  const returnToWorlds = () => setScreen('select');

  // Pointer cursor when hovering a world on the Select screen.
  useEffect(() => {
    document.body.style.cursor = screen === 'select' && hoveredId ? 'pointer' : '';
  }, [screen, hoveredId]);

  // Escape key goes back one step.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setScreen((s) => (s === 'comingSoon' ? 'overview' : 'select'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className={`app app--${screen}`}>
      <SpaceScene
        screen={screen}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onHoverChange={setHoveredId}
        onSelect={selectWorld}
      />

      <SelectWorldScreen active={screen === 'select'} />
      <WorldOverviewScreen
        world={selectedWorld}
        active={screen === 'overview'}
        onExplore={() => setScreen('comingSoon')}
        onReturn={returnToWorlds}
      />
      <ComingSoonScreen
        world={selectedWorld}
        active={screen === 'comingSoon'}
        onBack={() => setScreen('overview')}
        onReturnToWorlds={returnToWorlds}
      />

      <LoadingOverlay />
    </main>
  );
}
