import { useProgress } from '@react-three/drei';

/** Full-screen message while the NASA images download. */
export function LoadingOverlay() {
  const { active, progress } = useProgress();
  return (
    <div className={`loading-overlay${active ? '' : ' is-done'}`} aria-hidden={!active} role="status">
      <div className="loading-overlay__text">Loading NASA imagery… {Math.round(progress)}%</div>
    </div>
  );
}
