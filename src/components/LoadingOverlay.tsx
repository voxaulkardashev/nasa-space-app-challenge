import { useProgress } from '@react-three/drei';
import { useState } from 'react';

/**
 * Full-screen message while the app's main NASA images download.
 * It only ever appears ONCE, when the app first opens; after that, any
 * loading (e.g. close-up tiles) happens quietly in the background.
 */
export function LoadingOverlay() {
  const { active, progress } = useProgress();
  const [finished, setFinished] = useState(false);

  // Remember that the first load has finished (React's "adjust state during render" pattern).
  if (!finished && !active && progress === 100) setFinished(true);

  const visible = !finished;
  return (
    <div className={`loading-overlay${visible ? '' : ' is-done'}`} aria-hidden={!visible} role="status">
      <div className="loading-overlay__text">Loading NASA imagery… {Math.round(progress)}%</div>
    </div>
  );
}
