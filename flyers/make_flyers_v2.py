from pathlib import Path
from math import cos, sin, pi
import shutil

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
ART_SOURCE = Path("/Users/brehhhx3/.codex/generated_images/01a17405-9f22-7432-bbdb-db8a285b19cd/exec-28a0d329-0713-47c1-a857-6914e23b5754.png")
ART = ASSETS / "comic_food_art.png"
LOGO = ASSETS / "supplied_logo_crop.jpg"

INK = HexColor("#1F1716")
BURGUNDY = HexColor("#7F1723")
RED = HexColor("#B3282B")
GOLD = HexColor("#F6BF39")
PALE_GOLD = HexColor("#FFD872")
CREAM = HexColor("#FFF8E7")
BLUE = HexColor("#2176A5")
WHITE = HexColor("#FFFFFF")

pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Black", "/System/Library/Fonts/Supplemental/Arial Black.ttf"))


def text(c, x, y, value, size, color=INK, font="Arial-Bold"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def image_contain(c, path, x, y, w, h):
    with Image.open(path) as im:
        iw, ih = im.size
    ratio = min(w / iw, h / ih)
    dw, dh = iw * ratio, ih * ratio
    c.drawImage(ImageReader(str(path)), x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, mask="auto")


def logo_card(c, x, y, w, h):
    c.setFillColor(INK)
    c.roundRect(x + 5, y - 5, w, h, 13, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 13, stroke=0, fill=1)
    image_contain(c, LOGO, x + 8, y + 5, w - 16, h - 10)


def burst(c, cx, cy, inner, outer, count=18):
    for i in range(count):
        a = (2 * pi * i / count) + 0.15
        spread = 0.115
        points = [
            (cx + inner * cos(a - spread), cy + inner * sin(a - spread)),
            (cx + outer * cos(a), cy + outer * sin(a)),
            (cx + inner * cos(a + spread), cy + inner * sin(a + spread)),
        ]
        c.setFillColor(PALE_GOLD if i % 2 else CREAM)
        p = c.beginPath()
        p.moveTo(*points[0])
        p.lineTo(*points[1])
        p.lineTo(*points[2])
        p.close()
        c.drawPath(p, stroke=0, fill=1)


def dots(c, x0, y0, cols, rows, step, radius=1.6):
    c.setFillColor(BURGUNDY)
    for row in range(rows):
        for col in range(cols):
            c.circle(x0 + col * step, y0 + row * step, radius, stroke=0, fill=1)


def full_page(c):
    c.setFillColor(INK)
    c.rect(0, 0, 612, 792, stroke=0, fill=1)

    # Brand masthead
    logo_card(c, 31, 660, 166, 109)
    text(c, 222, 747, "THE HOUSE OF", 14, GOLD, "Arial-Black")
    text(c, 219, 706, "CHICKEN", 37, WHITE, "Arial-Black")
    text(c, 220, 662, "& WAFFLES", 35, WHITE, "Arial-Black")

    # Comic panel
    c.setFillColor(GOLD)
    c.rect(0, 258, 612, 382, stroke=0, fill=1)
    c.saveState()
    clip = c.beginPath()
    clip.rect(0, 258, 612, 382)
    c.clipPath(clip, stroke=0, fill=0)
    burst(c, 320, 438, 68, 398, 22)
    dots(c, 20, 285, 11, 9, 12, 1.4)
    dots(c, 521, 532, 8, 8, 10, 1.3)
    c.restoreState()
    image_contain(c, ART, 91, 276, 455, 353)

    # A tilted callout on top of the image borrows the energy of the restaurant sign.
    c.saveState()
    c.translate(34, 585)
    c.rotate(-7)
    c.setFillColor(INK)
    c.roundRect(4, -29, 333, 49, 8, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.roundRect(0, -25, 333, 49, 8, stroke=0, fill=1)
    text(c, 15, -10, "WE GET CHICKEN!", 27, WHITE, "Arial-Black")
    c.restoreState()

    # Print-first location and hours panel
    c.setFillColor(BURGUNDY)
    c.rect(0, 0, 612, 258, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, 250, 612, 8, stroke=0, fill=1)
    text(c, 35, 222, "COME FIND US", 13, GOLD, "Arial-Black")
    text(c, 33, 181, "105 Plainfield St", 33, WHITE, "Arial-Black")
    text(c, 35, 153, "Providence, RI", 20, WHITE, "Arial-Bold")
    c.setStrokeColor(HexColor("#BD6E69"))
    c.setLineWidth(1)
    c.line(35, 136, 577, 136)
    text(c, 35, 105, "THURSDAY - SATURDAY", 16, GOLD, "Arial-Black")
    text(c, 393, 105, "10 AM - 10 PM", 16, WHITE, "Arial-Bold")
    text(c, 35, 65, "SUNDAY", 16, GOLD, "Arial-Black")
    text(c, 393, 65, "10 AM - 6 PM", 16, WHITE, "Arial-Bold")
    text(c, 35, 22, "Illustrative food artwork.", 8, CREAM, "Arial")
    c.showPage()


def half_page(c, base):
    c.setFillColor(INK)
    c.rect(0, base, 612, 396, stroke=0, fill=1)
    logo_card(c, 22, base + 298, 120, 82)
    text(c, 159, base + 367, "THE HOUSE OF", 11, GOLD, "Arial-Black")
    text(c, 157, base + 337, "CHICKEN &", 26, WHITE, "Arial-Black")
    text(c, 157, base + 307, "WAFFLES", 26, WHITE, "Arial-Black")

    c.setFillColor(GOLD)
    c.rect(0, base + 108, 612, 181, stroke=0, fill=1)
    c.saveState()
    clip = c.beginPath()
    clip.rect(0, base + 108, 612, 181)
    c.clipPath(clip, stroke=0, fill=0)
    burst(c, 430, base + 203, 45, 235, 18)
    c.restoreState()
    image_contain(c, ART, 309, base + 111, 280, 174)
    text(c, 27, base + 238, "WE GET", 30, INK, "Arial-Black")
    text(c, 25, base + 198, "CHICKEN!", 37, BURGUNDY, "Arial-Black")
    text(c, 27, base + 143, "COME BY FOR", 15, INK, "Arial-Black")
    text(c, 27, base + 123, "CHICKEN & WAFFLES", 13, INK, "Arial-Black")

    c.setFillColor(BURGUNDY)
    c.rect(0, base, 612, 108, stroke=0, fill=1)
    text(c, 27, base + 76, "105 Plainfield St", 22, WHITE, "Arial-Black")
    text(c, 28, base + 51, "Providence, RI", 14, WHITE, "Arial-Bold")
    text(c, 315, base + 76, "THURSDAY - SATURDAY", 11.5, GOLD, "Arial-Black")
    text(c, 315, base + 57, "10 AM - 10 PM", 12.5, WHITE, "Arial-Bold")
    text(c, 315, base + 35, "SUNDAY  |  10 AM - 6 PM", 11.5, WHITE, "Arial-Bold")
    text(c, 28, base + 13, "Illustrative food artwork.", 7.2, CREAM, "Arial")


def main():
    ASSETS.mkdir(exist_ok=True)
    shutil.copy2(ART_SOURCE, ART)
    if not LOGO.exists():
        raise FileNotFoundError("Run make_flyers.py once to prepare the supplied logo crop.")

    poster = ROOT / "House_of_Chicken_and_Waffles_Comic_Flyer.pdf"
    c = canvas.Canvas(str(poster), pagesize=(612, 792), pageCompression=1)
    c.setTitle("The House of Chicken & Waffles - Comic Flyer")
    full_page(c)
    c.save()

    two_up = ROOT / "House_of_Chicken_and_Waffles_Comic_Two_Up.pdf"
    c = canvas.Canvas(str(two_up), pagesize=(612, 792), pageCompression=1)
    c.setTitle("The House of Chicken & Waffles - Comic Handouts")
    half_page(c, 396)
    half_page(c, 0)
    c.setStrokeColor(WHITE)
    c.setDash(4, 4)
    c.line(0, 396, 612, 396)
    c.save()
    print(poster)
    print(two_up)


if __name__ == "__main__":
    main()
