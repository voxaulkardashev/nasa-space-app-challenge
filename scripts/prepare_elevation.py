"""
Prepare the elevation grids used on the Explore screen.

You do NOT need to run this to use the app: the finished files are committed in
public/data/elevation/. This script documents exactly how they were made.

Requirements: Python 3.9+ with Pillow and NumPy (pip install pillow numpy).

Usage (from the project root):
    python scripts/prepare_elevation.py <download-cache-folder>

Output format:
    Raw little-endian signed 16-bit integers, heights in METRES,
    1440 columns x 720 rows (4 cells per degree).
    The Topography view also uses sharper copies at 8 cells per degree
    (2880 x 1440), saved gzip-compressed as <world>_topography_8ppd.bin.gz.
    Row 0 is the northernmost row (90°N to 89.75°N);
    column 0 starts at 180°W. Each value is the MEAN of the source pixels
    inside that 0.25° x 0.25° cell.

Sources (also in docs/SOURCES.md):
  Mars:  USGS Astrogeology Mars_MGS_MOLA_DEM_mosaic_global_463m.tif —
         MGS MOLA elevation, 46080 x 23040, signed 16-bit metres.
  Earth: NASA Earth Observatory, Blue Marble: Next Generation topography,
         gebco_08_rev_elev_21600x10800.tif — 8-bit greyscale land topography.
         NASA's page says "Data in these images were scaled 0-6400 meters",
         so grey value g becomes g / 255 * 6400 m. Oceans are 0 (sea level).
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
    "mars": (
        "https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif",
        "Mars_MGS_MOLA_DEM_mosaic_global_463m.tif",
    ),
    "earth": (
        "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/topography/gebco_08_rev_elev_21600x10800.tif",
        "gebco_08_rev_elev_21600x10800.tif",
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


def save_topography(name: str, metres: np.ndarray) -> None:
    """Sharper grid for the Topography view, gzip-compressed (the browser unpacks it)."""
    import gzip
    OUT.mkdir(parents=True, exist_ok=True)
    grid = np.round(metres).astype("<i2")
    path = OUT / f"{name}_topography_8ppd.bin.gz"
    with gzip.open(path, "wb", compresslevel=9) as f:
        f.write(grid.tobytes())
    print(f"  wrote   {path.relative_to(PROJECT_ROOT)}  {grid.shape[1]}x{grid.shape[0]}  "
          f"min {grid.min()} m, max {grid.max()} m, {path.stat().st_size / 1e6:.1f} MB compressed")


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
    make_mars(cache)
    make_earth(cache)
    print("Done.")


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

    save("mars", mola_means(data, nodata, HEIGHT, WIDTH))
    save_topography("mars", mola_means(data, nodata, HEIGHT * 2, WIDTH * 2))


def mola_means(data: np.ndarray, nodata: int, out_h: int, out_w: int) -> np.ndarray:
    """Mean of the valid source pixels in each output cell, one strip of rows at a time."""
    h, w = data.shape
    fy, fx = h // out_h, w // out_w
    out = np.zeros((out_h, out_w))
    for r in range(out_h):
        block = data[r * fy:(r + 1) * fy].astype(np.float64).reshape(fy, out_w, fx)
        valid = block != nodata
        counts = valid.sum(axis=(0, 2))
        sums = np.where(valid, block, 0).sum(axis=(0, 2))
        out[r] = np.where(counts > 0, sums / np.maximum(counts, 1), np.nan)
    missing = int(np.isnan(out).sum())
    if missing:
        print(f"  note    {missing} cells had no data; filled with the mean of their row")
        row_means = np.nanmean(out, axis=1, keepdims=True)
        out = np.where(np.isnan(out), row_means, out)
    return out


def make_earth(cache: Path) -> None:
    print("Earth (NASA Earth Observatory Blue Marble topography, scaled 0-6400 m)")
    src = download(SOURCES["earth"][0], cache / SOURCES["earth"][1])
    grey = np.asarray(Image.open(src).convert("L"), dtype=np.float64)
    print(f"  source  {grey.shape[1]}x{grey.shape[0]}, 8-bit, grey {grey.min():.0f}-{grey.max():.0f}")
    metres = grey / 255.0 * 6400.0
    save("earth", block_mean(metres, HEIGHT, WIDTH))
    # 21600 is not a whole multiple of 2880, so average with Pillow's box filter (area-weighted mean).
    sharp = Image.fromarray(metres.astype(np.float32), mode="F").resize((WIDTH * 2, HEIGHT * 2), Image.Resampling.BOX)
    save_topography("earth", np.asarray(sharp, dtype=np.float64))


if __name__ == "__main__":
    main()
