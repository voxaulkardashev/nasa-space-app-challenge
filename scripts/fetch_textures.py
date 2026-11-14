"""
Download and prepare the planet textures used by the app.

You do NOT need to run this to use the app: the finished textures are already
committed in public/textures/. This script exists so anyone can see exactly
where each texture came from and how it was resized, and can rebuild them.

Requirements: Python 3.9+ with Pillow and NumPy (pip install pillow numpy).

Usage (from the project root):
    python scripts/fetch_textures.py <download-cache-folder>

The cache folder holds the original downloads (some are large) and should be
OUTSIDE the project so they are never committed.

Every source below is also listed, with dates and notes, in docs/SOURCES.md.
"""

from __future__ import annotations

import io
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

# Some source images are bigger than Pillow's default safety limit.
Image.MAX_IMAGE_PIXELS = 400_000_000

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUT = PROJECT_ROOT / "public" / "textures"

SVS = "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720"
BMNG = (
    "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/"
    "bmng-topography-bathymetry/july/world.topo.bathy.200407.3x5400x2700.jpg"
)
TREK = "https://trek.nasa.gov/tiles/Mars/EQ"

COLOR_SIZE = (4096, 2048)
ELEVATION_SIZE = (2048, 1024)


def download(url: str, dest: Path) -> Path:
    """Download url to dest unless it is already there."""
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  cached  {dest.name}")
        return dest
    print(f"  fetch   {url}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as resp:
        dest.write_bytes(resp.read())
    return dest


def fetch_tile(url: str) -> Image.Image:
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as resp:
                return Image.open(io.BytesIO(resp.read()))
        except Exception:  # noqa: BLE001 - retry any network error
            if attempt == 3:
                raise
            time.sleep(2**attempt)
    raise RuntimeError("unreachable")


def stitch_trek(layer: str, level: int, cols: int, rows: int, ext: str, mode: str) -> Image.Image:
    """Download a whole zoom level of a NASA Trek WMTS layer and join the 256px tiles."""
    canvas = Image.new(mode, (cols * 256, rows * 256))
    for row in range(rows):
        for col in range(cols):
            url = f"{TREK}/{layer}/1.0.0//default/default028mm/{level}/{row}/{col}.{ext}"
            tile = fetch_tile(url).convert(mode)
            canvas.paste(tile, (col * 256, row * 256))
        print(f"  row {row + 1}/{rows} done")
    return canvas


def to_8bit_grayscale(img: Image.Image) -> Image.Image:
    """Stretch elevation values to the full 0-255 range (visual bump map only)."""
    arr = np.asarray(img, dtype=np.float64)
    lo, hi = np.percentile(arr, [0.1, 99.9])
    arr = np.clip((arr - lo) / (hi - lo), 0, 1) * 255
    return Image.fromarray(arr.astype(np.uint8), mode="L")


def save_jpg(img: Image.Image, path: Path, size: tuple[int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.size != size:
        img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  wrote   {path.relative_to(PROJECT_ROOT)}  {img.size[0]}x{img.size[1]}  "
          f"{path.stat().st_size / 1e6:.1f} MB")


def main() -> None:
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    cache = Path(sys.argv[1]).resolve()
    if PROJECT_ROOT in cache.parents or cache == PROJECT_ROOT:
        sys.exit("Please choose a cache folder outside the project.")

    print("Moon colour (NASA SVS CGI Moon Kit, LROC WAC, 2019 map)")
    src = download(f"{SVS}/lroc_color_poles_4k.tif", cache / "lroc_color_poles_4k.tif")
    save_jpg(Image.open(src).convert("RGB"), OUT / "moon" / "moon_color.jpg", COLOR_SIZE)

    print("Moon elevation (NASA SVS CGI Moon Kit, LOLA 16 px/deg)")
    src = download(f"{SVS}/ldem_16_uint.tif", cache / "ldem_16_uint.tif")
    elev = to_8bit_grayscale(Image.open(src))
    save_jpg(elev, OUT / "moon" / "moon_elevation.jpg", ELEVATION_SIZE)

    print("Earth colour (NASA Blue Marble Next Generation, July 2004, topography + bathymetry)")
    src = download(BMNG, cache / "world.topo.bathy.200407.3x5400x2700.jpg")
    save_jpg(Image.open(src).convert("RGB"), OUT / "earth" / "earth_color.jpg", COLOR_SIZE)

    print("Mars colour (NASA Mars Trek tiles: Viking MDIM 2.1 colorized mosaic, zoom 3)")
    mars = stitch_trek("Mars_Viking_MDIM21_ClrMosaic_global_232m", 3, 16, 8, "jpg", "RGB")
    save_jpg(mars, OUT / "mars" / "mars_color.jpg", COLOR_SIZE)

    print("Mars elevation (NASA Mars Trek tiles: MGS MOLA DEM 8-bit, zoom 2)")
    mola = stitch_trek("Mars_MGS_MOLA_DEM_mosaic_global_463m_8", 2, 8, 4, "png", "L")
    save_jpg(to_8bit_grayscale(mola), OUT / "mars" / "mars_elevation.jpg", ELEVATION_SIZE)

    print("Done.")


if __name__ == "__main__":
    main()
