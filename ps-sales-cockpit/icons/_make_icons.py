"""Generate PS Sales Cockpit toolbar icons (16/32/48/128 px PNG).

Style: dark rounded-square tile with red 'PS' monogram — consistent with the
PS AI HUB extension family.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ICON_DIR = Path(__file__).resolve().parent

BG = (17, 20, 24, 255)        # near-black (matches header)
ACCENT = (210, 34, 49, 255)   # PS red
FG = (255, 255, 255, 255)


def find_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def make_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    radius = max(2, size // 5)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BG)

    # Red accent bar at the bottom — distinguishes Sales Cockpit visually.
    bar_h = max(2, size // 8)
    draw.rounded_rectangle(
        (0, size - bar_h, size - 1, size - 1), radius=radius // 2, fill=ACCENT
    )

    # Monogram
    text = "PS"
    font_size = max(8, int(size * 0.55))
    while font_size > 6:
        font = find_font(font_size)
        bbox = draw.textbbox((0, 0), text, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if tw <= size * 0.78 and th <= size * 0.7:
            break
        font_size -= 1
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1] - bar_h // 4
    draw.text((x, y), text, font=font, fill=FG)

    return img


def main() -> None:
    for size in (16, 32, 48, 128):
        out = ICON_DIR / f"icon{size}.png"
        make_icon(size).save(out, "PNG", optimize=True)
        print(f"wrote {out} ({size}x{size})")


if __name__ == "__main__":
    main()
