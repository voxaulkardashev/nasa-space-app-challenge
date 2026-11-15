import { useEffect, useState } from 'react';
import type { MapTile } from '../lib/flatMap';

/** Pixels darker than this in every channel count as "no data" (same rule as the globe). */
const NO_DATA_MAX = 4;

interface FlatMapTileProps {
  tile: MapTile;
  ppd: number;
}

/**
 * One NASA map tile on the 2D map, positioned by its latitude/longitude box.
 * Land-only layers (black = no data) are made see-through first, so the
 * coarser image underneath shows in the oceans.
 */
export function FlatMapTile({ tile, ppd }: FlatMapTileProps) {
  const url = tile.layer.url(tile.z, tile.row, tile.col);
  const [src, setSrc] = useState<string | null>(tile.layer.blackIsNoData ? null : url);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!tile.layer.blackIsNoData) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i] <= NO_DATA_MAX && px[i + 1] <= NO_DATA_MAX && px[i + 2] <= NO_DATA_MAX) px[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob || cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      });
    };
    img.src = url;
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, tile.layer.blackIsNoData]);

  if (!src) return null;
  const size = tile.deg * ppd;
  return (
    <img
      className={`flat-map__tile${loaded ? ' is-loaded' : ''}`}
      src={src}
      alt=""
      draggable={false}
      crossOrigin="anonymous"
      onLoad={() => setLoaded(true)}
      style={{ left: tile.col * size, top: tile.row * size, width: size, height: size }}
    />
  );
}
