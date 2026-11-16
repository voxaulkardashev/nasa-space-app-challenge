import { useEffect, useState } from 'react';
import { fetchPowerLatestHour, type PowerLatestHour } from './powerLatest';

type Result = { key: string; ok: true; data: PowerLatestHour } | { key: string; ok: false; message: string };

/** NASA POWER's newest hourly values at a point (asked again when `nonce` changes). */
export function usePowerLatest(lat: number, lon: number, nonce: number) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}#${nonce}`;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPowerLatestHour(lat, lon).then(
      (data) => !cancelled && setResult({ key, ok: true, data }),
      (err: unknown) => !cancelled && setResult({ key, ok: false, message: err instanceof Error ? err.message : String(err) }),
    );
    return () => {
      cancelled = true;
    };
    // `key` covers the position and refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!result || result.key !== key) return { status: 'loading' as const };
  return result.ok ? { status: 'ready' as const, data: result.data } : { status: 'error' as const, message: result.message };
}
