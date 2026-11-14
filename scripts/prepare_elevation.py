"""
Prepare the elevation grids used on the Explore screen.

You do NOT need to run this to use the app: the finished files are committed in
public/data/elevation/. This script documents exactly how they were made.

Requirements: Python 3.9+ with Pillow and NumPy (pip install pillow numpy).

Usage (from the project root):
    python scripts/prepare_elevation.py <download-cache-folder> [moon] [mars]
    (with no world names, both are made)

Output format (both worlds):
    Raw little-endian signed 16-bit integers, heights in METRES,
    1440 columns x 720 rows (4 cells per degree).
    Row 0 is the northernmost row (90°N to 89.75°N);
    column 0 starts at 180°W. Each value is the MEAN of the source pixels
    inside that 0.25° x 0.25° cell.

Sources (also in docs/SOURCES.md):
  Moon: NASA SVS CGI Moon Kit, ldem_16_uint.tif — LOLA elevation, 16 px/deg,
        unsigned 16-bit half-metres offset by +20,000, relative to a
        1737.4 km sphere.
  Mars: USGS Astrogeology Mars_MGS_MOLA_DEM_mosaic_global_463m.tif —
        MGS MOLA elevation, 46080 x 23040, signed 16-bit metres.
"""

from __future__ import annotations

import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = 2_000_000_000

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUT = PROJECT_ROOT / "public" / "data" / "elevation"
WIDTH, HEIGHT = 1440, 720

SOURCES = {
    "moon": ("https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_16_uint.tif", "ldem_16_uint.tif"),
    "mars": (
        "https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif",
        "Mars_MGS_MOLA_DEM_mosaic_global_463m.tif",
    ),
}


def download(url: str, dest: Path) -> Path:
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  cached  {dest.name}")
        return dest
    print(f"  fetch   {url}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=600) as resp, open(dest, "wb") as f:
        while chunk := resp.read(1 << 20):
            f.write(chunk)
    return dest


def block_mean(arr: np.ndarray, out_h: int, out_w: int) -> np.ndarray:
    """Average equal-sized blocks (source size must be a multiple of the output size)."""
    h, w = arr.shape
    fy, fx = h // out_h, w // out_w
    assert fy * out_h == h and fx * out_w == w, (arr.shape, out_h, out_w)
    return arr.reshape(out_h, fy, out_w, fx).mean(axis=(1, 3))


def save(name: str, metres: np.ndarray) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    grid = np.round(metres).astype("<i2")
    path = OUT / f"{name}_elevation_4ppd.bin"
    grid.tofile(path)
    print(f"  wrote   {path.relative_to(PROJECT_ROOT)}  {grid.shape[1]}x{grid.shape[0]}  "
          f"min {grid.min()} m, max {grid.max()} m, {path.stat().st_size / 1e6:.1f} MB")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cache = Path(sys.argv[1]).resolve()
    worlds = set(sys.argv[2:]) or {"moon", "mars"}

    if "moon" in worlds:
        make_moon(cache)
    if "mars" in worlds:
        make_mars(cache)
    print("Done.")


def make_moon(cache: Path) -> None:
    print("Moon (LOLA via NASA SVS CGI Moon Kit)")
    src = download(SOURCES["moon"][0], cache / SOURCES["moon"][1])
    raw = np.asarray(Image.open(src), dtype=np.float64)  # half-metres + 20000
    metres = (raw - 20000.0) / 2.0
    save("moon", block_mean(metres, HEIGHT, WIDTH))


def make_mars(cache: Path) -> None:
    print("Mars (MGS MOLA via USGS Astrogeology)")
    src = download(SOURCES["mars"][0], cache / SOURCES["mars"][1])
    img = Image.open(src)
    w, h = img.size
    tags = img.tag_v2
    # The file is an uncompressed, little-endian TIFF with one image row per strip,
    # stored back to back, so it can be read in slices without loading 2 GB at once.
    offsets = tags[273]
    assert tags[259] == 1 and tags[278] == 1, "expected uncompressed, one row per strip"
    assert all(offsets[i + 1] - offsets[i] == w * 2 for i in range(len(offsets) - 1)), "strips not contiguous"
    nodata = int(float(tags.get(42113, -32768)))
    print(f"  source  {w}x{h}, int16, no-data value {nodata}")
    data = np.memmap(src, dtype="<i2", mode="r", offset=offsets[0], shape=(h, w))

    fy, fx = h // HEIGHT, w // WIDTH
    out = np.zeros((HEIGHT, WIDTH))
    for r in range(HEIGHT):
        block = data[r * fy:(r + 1) * fy].astype(np.float64).reshape(fy, WIDTH, fx)
        valid = block != nodata
        counts = valid.sum(axis=(0, 2))
        sums = np.where(valid, block, 0).sum(axis=(0, 2))
        out[r] = np.where(counts > 0, sums / np.maximum(counts, 1), np.nan)
    missing = int(np.isnan(out).sum())
    if missing:
        print(f"  note    {missing} cells had no data; filled with the mean of their row")
        row_means = np.nanmean(out, axis=1, keepdims=True)
        out = np.where(np.isnan(out), row_means, out)
    save("mars", out)


if __name__ == "__main__":
    main()
