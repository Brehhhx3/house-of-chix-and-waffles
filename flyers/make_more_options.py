from pathlib import Path
import shutil

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
LOGO = ASSETS / "supplied_logo_crop.jpg"
LIGHT_PHOTO = ASSETS / "illustrative_food.jpg"
DARK_SOURCE = Path("/Users/brehhhx3/.codex/generated_images/01a17405-9f22-7432-bbdb-db8a285b19cd/exec-feff0453-5535-4e63-b970-77845d870318.png")
DARK_PHOTO = ASSETS / "dark_food_visual.jpg"

CREAM = HexColor("#FFF9EC")
INK = HexColor("#231A19")
BURGUNDY = HexColor("#801C2B")
RED = HexColor("#A62532")
GOLD = HexColor("#F3C64A")
BLUE = HexColor("#156D91")
PALE_BLUE = HexColor("#D8E9E8")
WHITE = HexColor("#FFFFFF")

pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Black", "/System/Library/Fonts/Supplemental/Arial Black.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold", "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"))


def t(c, x, y, s, size, color=INK, font="Arial-Bold"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, s)


def photo(c, path, x, y, w, h, radius=0):
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, radius)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
    c.restoreState()


def logo(c, x, y, w, h):
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 10, stroke=0, fill=1)
    photo(c, LOGO, x + 6, y + 6, w - 12, h - 12, 6)


def checker(c, y, height, square=18):
    c.setFillColor(BURGUNDY)
    c.rect(0, y, 612, height, stroke=0, fill=1)
    c.saveState()
    clip = c.beginPath()
    clip.rect(0, y, 612, height)
    c.clipPath(clip, stroke=0, fill=0)
    cols = (612 // square) + 1
    rows = (height // square) + 1
    c.setFillColor(CREAM)
    for row in range(rows):
        for col in range(cols):
            if (row + col) % 2 == 0:
                c.rect(col * square, y + row * square, square, square, stroke=0, fill=1)
    c.restoreState()


def diner_full(c):
    c.setFillColor(CREAM)
    c.rect(0, 0, 612, 792, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.rect(0, 781, 612, 11, stroke=0, fill=1)
    logo(c, 35, 646, 163, 117)
    t(c, 222, 740, "THE HOUSE OF", 14, RED, "Arial-Black")
    t(c, 218, 697, "CHICKEN &", 33, INK, "Georgia-Bold")
    t(c, 219, 653, "WAFFLES", 38, INK, "Georgia-Bold")

    c.setFillColor(GOLD)
    c.roundRect(41, 312, 536, 313, 17, stroke=0, fill=1)
    photo(c, LIGHT_PHOTO, 35, 320, 536, 297, 15)
    c.saveState()
    c.translate(373, 335)
    c.rotate(5)
    c.setFillColor(BURGUNDY)
    c.roundRect(0, 0, 188, 43, 6, stroke=0, fill=1)
    t(c, 13, 12, "COME HUNGRY!", 17, WHITE, "Arial-Black")
    c.restoreState()

    t(c, 36, 281, "105 Plainfield St", 29, INK, "Georgia-Bold")
    t(c, 38, 251, "Providence, RI", 18, RED, "Arial-Bold")
    c.setFillColor(BURGUNDY)
    c.roundRect(35, 71, 542, 155, 12, stroke=0, fill=1)
    t(c, 54, 197, "OPEN THURSDAY TO SUNDAY", 12, GOLD, "Arial-Black")
    t(c, 54, 160, "THURSDAY - SATURDAY", 15, WHITE, "Arial-Black")
    t(c, 383, 160, "10 AM - 10 PM", 15, WHITE, "Arial-Bold")
    c.setStrokeColor(HexColor("#C27879"))
    c.line(54, 145, 557, 145)
    t(c, 54, 112, "SUNDAY", 15, WHITE, "Arial-Black")
    t(c, 383, 112, "10 AM - 6 PM", 15, WHITE, "Arial-Bold")
    t(c, 37, 51, "Food image is illustrative.", 8, INK, "Arial")
    checker(c, 0, 31, 15)
    c.showPage()


def diner_half(c, base):
    c.setFillColor(CREAM)
    c.rect(0, base, 612, 396, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.rect(0, base + 390, 612, 6, stroke=0, fill=1)
    logo(c, 22, base + 295, 121, 84)
    t(c, 160, base + 364, "THE HOUSE OF", 11, RED, "Arial-Black")
    t(c, 157, base + 338, "CHICKEN &", 24, INK, "Georgia-Bold")
    t(c, 157, base + 307, "WAFFLES", 28, INK, "Georgia-Bold")
    c.setFillColor(GOLD)
    c.roundRect(317, base + 119, 271, 169, 12, stroke=0, fill=1)
    photo(c, LIGHT_PHOTO, 312, base + 125, 271, 161, 10)
    t(c, 27, base + 245, "COME", 31, BURGUNDY, "Arial-Black")
    t(c, 27, base + 208, "HUNGRY!", 31, BURGUNDY, "Arial-Black")
    t(c, 28, base + 164, "105 Plainfield St", 17, INK, "Georgia-Bold")
    t(c, 28, base + 141, "Providence, RI", 13.5, RED, "Arial-Bold")
    c.setFillColor(BURGUNDY)
    c.rect(0, base + 18, 612, 91, stroke=0, fill=1)
    t(c, 27, base + 82, "THURSDAY - SATURDAY", 12, GOLD, "Arial-Black")
    t(c, 307, base + 82, "10 AM - 10 PM", 12, WHITE, "Arial-Bold")
    t(c, 27, base + 46, "SUNDAY", 12, GOLD, "Arial-Black")
    t(c, 307, base + 46, "10 AM - 6 PM", 12, WHITE, "Arial-Bold")
    t(c, 27, base + 26, "Food image is illustrative.", 7.2, CREAM, "Arial")
    checker(c, base, 18, 9)


def color_full(c):
    c.setFillColor(BLUE)
    c.rect(0, 0, 612, 792, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, 780, 612, 12, stroke=0, fill=1)
    logo(c, 34, 654, 164, 114)
    t(c, 220, 741, "CRAVING", 34, GOLD, "Arial-Black")
    t(c, 219, 696, "CHICKEN &", 35, WHITE, "Arial-Black")
    t(c, 219, 651, "WAFFLES?", 38, WHITE, "Arial-Black")
    c.setFillColor(GOLD)
    c.roundRect(45, 319, 530, 313, 20, stroke=0, fill=1)
    photo(c, DARK_PHOTO, 36, 327, 530, 305, 18)

    c.setFillColor(CREAM)
    c.rect(0, 0, 612, 297, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, 290, 612, 7, stroke=0, fill=1)
    t(c, 36, 257, "COME GET CHICKEN & WAFFLES", 13, BLUE, "Arial-Black")
    t(c, 34, 216, "105 Plainfield St", 31, INK, "Arial-Black")
    t(c, 36, 185, "Providence, RI", 19, BLUE, "Arial-Bold")
    c.setFillColor(BURGUNDY)
    c.roundRect(35, 49, 542, 114, 12, stroke=0, fill=1)
    t(c, 52, 130, "THURSDAY - SATURDAY", 15, GOLD, "Arial-Black")
    t(c, 383, 130, "10 AM - 10 PM", 15, WHITE, "Arial-Bold")
    t(c, 52, 88, "SUNDAY", 15, GOLD, "Arial-Black")
    t(c, 383, 88, "10 AM - 6 PM", 15, WHITE, "Arial-Bold")
    t(c, 36, 27, "Food image is illustrative.", 8, INK, "Arial")
    c.showPage()


def color_half(c, base):
    c.setFillColor(BLUE)
    c.rect(0, base, 612, 396, stroke=0, fill=1)
    logo(c, 22, base + 294, 121, 84)
    t(c, 157, base + 362, "CRAVING", 23, GOLD, "Arial-Black")
    t(c, 156, base + 333, "CHICKEN &", 23, WHITE, "Arial-Black")
    t(c, 156, base + 303, "WAFFLES?", 26, WHITE, "Arial-Black")
    c.setFillColor(GOLD)
    c.roundRect(318, base + 124, 270, 163, 12, stroke=0, fill=1)
    photo(c, DARK_PHOTO, 312, base + 130, 270, 156, 10)
    t(c, 27, base + 244, "COME GET", 27, WHITE, "Arial-Black")
    t(c, 27, base + 211, "CHICKEN &", 27, WHITE, "Arial-Black")
    t(c, 27, base + 178, "WAFFLES", 27, GOLD, "Arial-Black")

    c.setFillColor(CREAM)
    c.rect(0, base, 612, 111, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, base + 105, 612, 6, stroke=0, fill=1)
    t(c, 27, base + 76, "105 Plainfield St", 20, INK, "Arial-Black")
    t(c, 28, base + 49, "Providence, RI", 13.5, BLUE, "Arial-Bold")
    t(c, 302, base + 80, "THURSDAY - SATURDAY", 10.8, BURGUNDY, "Arial-Black")
    t(c, 302, base + 61, "10 AM - 10 PM", 12, INK, "Arial-Bold")
    t(c, 302, base + 39, "SUNDAY  |  10 AM - 6 PM", 11.5, INK, "Arial-Bold")
    t(c, 28, base + 12, "Food image is illustrative.", 7.2, INK, "Arial")


def save_one(name, drawer):
    out = ROOT / name
    c = canvas.Canvas(str(out), pagesize=(612, 792), pageCompression=1)
    c.setTitle(name.replace("_", " ").removesuffix(".pdf"))
    drawer(c)
    c.save()
    print(out)


def save_two_up(name, drawer):
    out = ROOT / name
    c = canvas.Canvas(str(out), pagesize=(612, 792), pageCompression=1)
    c.setTitle(name.replace("_", " ").removesuffix(".pdf"))
    drawer(c, 396)
    drawer(c, 0)
    c.setStrokeColor(HexColor("#BEB6AA"))
    c.setDash(4, 4)
    c.line(0, 396, 612, 396)
    c.save()
    print(out)


def main():
    ASSETS.mkdir(exist_ok=True)
    Image.open(DARK_SOURCE).convert("RGB").save(DARK_PHOTO, quality=96)
    if not LOGO.exists() or not LIGHT_PHOTO.exists():
        raise FileNotFoundError("Run make_flyers.py first to prepare the logo and light food visual.")
    save_one("Option_2_Retro_Diner_Flyer.pdf", diner_full)
    save_two_up("Option_2_Retro_Diner_Two_Up.pdf", diner_half)
    save_one("Option_3_Color_Pop_Flyer.pdf", color_full)
    save_two_up("Option_3_Color_Pop_Two_Up.pdf", color_half)


if __name__ == "__main__":
    main()
