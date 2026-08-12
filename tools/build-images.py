#!/usr/bin/env python3
"""Regenerate the site's image derivatives from the original photos.

Run from anywhere:  python tools/build-images.py

Reads the originals from SOURCE_DIR, crops/resizes them, strips every scrap of
metadata (originals carry no GPS today, but re-encoding guarantees it), and
writes WebP + JPEG fallbacks at 1x and 2x into assets/.

To swap a photo: change the `source` (and `crop`) of an entry below and re-run.
Alternates that were considered are listed in README.md.
"""

from pathlib import Path

from PIL import Image, ImageOps

REPO = Path(__file__).resolve().parent.parent
SOURCE_DIR = Path(r"C:\Users\Koushik.B\Desktop\personal\pics")
OUT_DIR = REPO / "assets"

# crop is a (left, top, right, bottom) box in the EXIF-corrected original.
# widths are the output widths; height follows the crop's aspect ratio.
IMAGES = [
    {
        "name": "aparna-portrait",
        "source": "IMG-20260626-WA0020.jpg",
        # 960x1280 original. 3:4 environmental portrait, bottom-anchored and
        # centred on the subject, with ~19% headroom. Deliberately not a tight
        # headshot -- cropping closer would upscale past the source and go soft.
        "crop": (285, 560, 825, 1280),
        "widths": [400, 540],
        "quality": 84,
    },
    {
        "name": "aparna-charles",
        "source": "eb0b3639-49bf-4ecc-a8eb-723f8aea53d0.JPG",
        # 2000x1126 original, used full-frame as a 16:9 background band. The
        # final framing is done in CSS with object-fit/object-position so it
        # can adapt per breakpoint instead of being baked in here.
        "crop": None,
        "widths": [1200, 2000],
        "quality": 80,
    },
]


def strip(im: Image.Image) -> Image.Image:
    """Return a copy carrying pixels only -- no EXIF, ICC, or other metadata."""
    return Image.frombytes(im.mode, im.size, im.tobytes())


def build(spec: dict) -> None:
    src = SOURCE_DIR / spec["source"]
    if not src.exists():
        raise SystemExit(f"missing source photo: {src}")

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")

    if spec["crop"]:
        im = im.crop(spec["crop"])

    base_w, base_h = im.size
    ratio = base_h / base_w

    for width in spec["widths"]:
        if width > base_w:
            print(f"  ! skipping {width}w -- would upscale past the {base_w}px source")
            continue

        height = round(width * ratio)
        resized = strip(im.resize((width, height), Image.Resampling.LANCZOS))

        # 1x keeps the bare name so the src fallback is the small one.
        suffix = "" if width == min(spec["widths"]) else f"@{width}w"
        stem = OUT_DIR / f"{spec['name']}{suffix}"

        resized.save(stem.with_suffix(".webp"), "WEBP", quality=spec["quality"], method=6)
        resized.save(
            stem.with_suffix(".jpg"), "JPEG",
            quality=spec["quality"], optimize=True, progressive=True,
        )

        kb_webp = stem.with_suffix(".webp").stat().st_size // 1024
        kb_jpg = stem.with_suffix(".jpg").stat().st_size // 1024
        print(f"  {stem.name}  {width}x{height}  webp {kb_webp}KB / jpg {kb_jpg}KB")


def build_favicon() -> None:
    """Raster AR monogram at /favicon.ico.

    assets/favicon.svg is the icon browsers actually use; this exists only so
    the automatic /favicon.ico request doesn't 404 in the console.
    """
    from PIL import ImageDraw, ImageFont

    size = 256
    img = Image.new("RGB", (size, size))
    draw = ImageDraw.Draw(img)

    # Navy -> blue -> orange diagonal, matching --gradient.
    stops = [(0.0, (0, 14, 84)), (0.55, (43, 114, 215)), (1.0, (247, 105, 0))]
    for y in range(size):
        for_x_t = y / (2 * (size - 1))
        for x in range(0, size, 4):
            t = for_x_t + x / (2 * (size - 1))
            for i in range(len(stops) - 1):
                t0, c0 = stops[i]
                t1, c1 = stops[i + 1]
                if t0 <= t <= t1:
                    f = (t - t0) / (t1 - t0)
                    col = tuple(round(c0[j] + (c1[j] - c0[j]) * f) for j in range(3))
                    break
            else:
                col = stops[-1][1]
            draw.rectangle([x, y, x + 3, y], fill=col)

    font = None
    for candidate in (r"C:\Windows\Fonts\seguibl.ttf", r"C:\Windows\Fonts\arialbd.ttf",
                      r"C:\Windows\Fonts\segoeuib.ttf"):
        if Path(candidate).exists():
            font = ImageFont.truetype(candidate, 132)
            break

    if font:
        draw.text((size / 2, size / 2 - 6), "AR", font=font, fill="white", anchor="mm")

    ico = REPO / "favicon.ico"
    img.save(ico, "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"favicon.ico  {ico.stat().st_size // 1024}KB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for spec in IMAGES:
        print(f"{spec['name']}  <-  {spec['source']}")
        build(spec)
    build_favicon()


if __name__ == "__main__":
    main()
