import { useEffect, useState } from 'react';
import { fetchPsgLocal, type PsgLocal } from './marsNow';

type Result = { key: string; ok: true; data: PsgLocal } | { key: string; ok: false; message: string };

/** PSG's exact reading for the pin (re-asked when the pin moves or `nonce` changes). */
export function usePsgLocal(site: { lat: number; lon: number } | null, nonce: number) {
  const key = site ? `${site.lat.toFixed(4)},${site.lon.toFixed(4)}#${nonce}` : '';
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!site) return;
    let cancelled = false;
    fetchPsgLocal(site.lat, site.lon).then(
      (data) => !cancelled && setResult({ key, ok: true, data }),
      (err: unknown) => !cancelled && setResult({ key, ok: false, message: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
    // `key` covers the pin position and refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!site) return { status: 'idle' as const };
  if (!result || result.key !== key) return { status: 'loading' as const };
  return result.ok ? { status: 'ready' as const, data: result.data } : { status: 'error' as const, message: result.message };
}
