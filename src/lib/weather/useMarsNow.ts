import { useCallback, useEffect, useState } from 'react';
import { loadMarsNow, type MarsNow } from './marsNow';

export type MarsNowState = { status: 'idle' } | { status: 'loading' } | { status: 'ready'; data: MarsNow } | { status: 'error'; message: string };

type Result = { nonce: number; ok: true; data: MarsNow } | { nonce: number; ok: false; message: string };

/** Current NASA model conditions for all of Mars, downloaded once `enabled` turns on (cached for 10 minutes). */
export function useMarsNow(enabled: boolean): { state: MarsNowState; refresh: () => void } {
  const [result, setResult] = useState<Result | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    loadMarsNow(nonce > 0).then(
      (data) => !cancelled && setResult({ nonce, ok: true, data }),
      (err: unknown) => !cancelled && setResult({ nonce, ok: false, message: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
  }, [enabled, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  let state: MarsNowState;
  if (result?.ok) state = { status: 'ready', data: result.data }; // a refresh keeps the old values on screen
  else if (result && result.nonce === nonce) state = { status: 'error', message: result.message };
  else state = enabled ? { status: 'loading' } : { status: 'idle' };
  return { state, refresh };
}
