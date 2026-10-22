#!/usr/bin/env python3
"""Build optimized portrait assets and the social card. Requires Pillow.

Run from the repository root: python tools/build-images.py
The reviewed portrait source is kept in assets/; original photos are preserved.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
ASSETS = REPO / "assets"


def font(size, bold=False):
    names = ["Arial Bold.ttf", "Arial.ttf"] if bold else ["Arial.ttf"]
    candidates = [Path("/System/Library/Fonts/Supplemental") / name for name in names]
    candidates += [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default(size=size)


def build_portrait():
    source = ImageOps.exif_transpose(Image.open(ASSETS / "aparna-professional-source.png")).convert("RGB")
    for width in (320, 640):
        # Only responsive resizing/encoding; the approved edit is the source.
        image = ImageOps.fit(source, (width, width * 5 // 4), method=Image.Resampling.LANCZOS)
        clean = Image.frombytes("RGB", image.size, image.tobytes())
        stem = ASSETS / f"aparna-professional-{width}"
        clean.save(stem.with_suffix(".webp"), "WEBP", quality=86, method=6)
        clean.save(stem.with_suffix(".jpg"), "JPEG", quality=89, optimize=True, progressive=True)
        print(f"Portrait {width}w: {stem.with_suffix('.webp').stat().st_size // 1024}KB WebP")


def build_social_card():
    image = Image.new("RGB", (1200, 630), "#fafaf8")
    draw = ImageDraw.Draw(image)
    draw.text((72, 62), "Aparna Ramesh", font=font(30, True), fill="#152238")
    draw.line((72, 122, 1128, 122), fill="#dce0e4", width=2)
    draw.text((72, 174), "TECHNICAL PROJECT MANAGEMENT", font=font(21, True), fill="#b64a12")
    draw.text((72, 236), "Complex delivery.", font=font(76, True), fill="#152238")
    draw.text((72, 326), "Clear execution.", font=font(76, True), fill="#152238")
    draw.text((72, 480), "5 years  /  20+ releases  /  40 engineers coordinated", font=font(28), fill="#475569")
    image.save(ASSETS / "social-preview.png", optimize=True)
    print("Social card: 1200 x 630")


if __name__ == "__main__":
    build_portrait()
    build_social_card()
