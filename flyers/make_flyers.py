from pathlib import Path
import subprocess

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
SOURCE_LOGO = Path("/Users/brehhhx3/Desktop/House of Chix & Waffles/IMG_1764.heic")
SOURCE_FOOD = Path("/Users/brehhhx3/.codex/generated_images/01a17405-9f22-7432-bbdb-db8a285b19cd/exec-2911aa3d-ed6c-4559-b159-7a1061d6d09b.png")

CREAM = HexColor("#FCF8EF")
INK = HexColor("#241A17")
RED = HexColor("#8B1E1F")
GOLD = HexColor("#E7B63C")
MUTED = HexColor("#675B54")
LINE = HexColor("#DDD3C4")

pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Black", "/System/Library/Fonts/Supplemental/Arial Black.ttf"))


def prepare_assets():
    ASSETS.mkdir(exist_ok=True)
    # A straight crop of the supplied printed logo keeps the original artwork intact.
    converted_logo = ASSETS / "supplied_logo_full.jpg"
    subprocess.run(["/usr/bin/sips", "-s", "format", "jpeg", "-Z", "1400", str(SOURCE_LOGO), "--out", str(converted_logo)], check=True, capture_output=True)
    logo = Image.open(converted_logo).convert("RGB")
    logo.crop((150, 340, 1110, 1080)).save(ASSETS / "supplied_logo_crop.jpg", quality=96)
    Image.open(SOURCE_FOOD).convert("RGB").save(ASSETS / "illustrative_food.jpg", quality=96)


def draw_text(c, x, y, value, size, color=INK, font="Arial-Bold"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def cover_image(c, path, x, y, w, h, radius=0):
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, radius)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, dw, dh)
    c.restoreState()


def draw_full_page(c):
    w, h = 612, 792
    c.setFillColor(CREAM)
    c.rect(0, 0, w, h, stroke=0, fill=1)
    c.setFillColor(RED)
    c.rect(0, h - 11, w, 11, stroke=0, fill=1)

    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(35, 631, 186, 128, 12, stroke=0, fill=1)
    cover_image(c, ASSETS / "supplied_logo_crop.jpg", 43, 639, 170, 112, 7)

    draw_text(c, 241, 742, "THE HOUSE OF", 13, RED)
    draw_text(c, 239, 702, "CHICKEN", 35, INK, "Arial-Black")
    draw_text(c, 240, 662, "& WAFFLES", 34, INK, "Arial-Black")
    draw_text(c, 242, 638, "PROVIDENCE, RHODE ISLAND", 10.5, MUTED)

    cover_image(c, ASSETS / "illustrative_food.jpg", 35, 306, 542, 308, 16)

    draw_text(c, 36, 278, "COME BY FOR CHICKEN & WAFFLES", 13, RED, "Arial-Black")
    draw_text(c, 35, 237, "105 Plainfield St", 29, INK, "Arial-Black")
    draw_text(c, 37, 210, "Providence, RI", 19, INK, "Arial-Bold")

    c.setFillColor(RED)
    c.roundRect(35, 59, 542, 128, 14, stroke=0, fill=1)
    draw_text(c, 55, 160, "HOURS", 12, GOLD, "Arial-Black")
    draw_text(c, 55, 131, "THURSDAY - SATURDAY", 16, HexColor("#FFFFFF"), "Arial-Black")
    draw_text(c, 356, 131, "10 AM - 10 PM", 16, HexColor("#FFFFFF"), "Arial-Bold")
    c.setStrokeColor(HexColor("#B95B53"))
    c.line(55, 116, 557, 116)
    draw_text(c, 55, 88, "SUNDAY", 16, HexColor("#FFFFFF"), "Arial-Black")
    draw_text(c, 356, 88, "10 AM - 6 PM", 16, HexColor("#FFFFFF"), "Arial-Bold")
    draw_text(c, 36, 36, "Food image is illustrative.", 8.5, MUTED, "Arial")
    c.showPage()


def draw_half(c, base):
    c.setFillColor(CREAM)
    c.rect(0, base, 612, 396, stroke=0, fill=1)
    c.setFillColor(RED)
    c.rect(0, base + 389, 612, 7, stroke=0, fill=1)

    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(26, base + 264, 147, 110, 10, stroke=0, fill=1)
    cover_image(c, ASSETS / "supplied_logo_crop.jpg", 31, base + 270, 137, 98, 6)
    draw_text(c, 190, base + 357, "THE HOUSE OF", 11.5, RED)
    draw_text(c, 187, base + 321, "CHICKEN", 29, INK, "Arial-Black")
    draw_text(c, 188, base + 289, "& WAFFLES", 27, INK, "Arial-Black")

    cover_image(c, ASSETS / "illustrative_food.jpg", 336, base + 104, 250, 164, 11)
    draw_text(c, 28, base + 236, "105 Plainfield St", 22, INK, "Arial-Black")
    draw_text(c, 29, base + 211, "Providence, RI", 16, INK, "Arial-Bold")
    draw_text(c, 29, base + 182, "COME BY FOR CHICKEN & WAFFLES", 10.5, RED, "Arial-Black")

    c.setFillColor(RED)
    c.roundRect(26, base + 22, 560, 69, 10, stroke=0, fill=1)
    draw_text(c, 42, base + 65, "THURSDAY - SATURDAY", 12, HexColor("#FFFFFF"), "Arial-Black")
    draw_text(c, 288, base + 65, "10 AM - 10 PM", 12, HexColor("#FFFFFF"), "Arial-Bold")
    draw_text(c, 42, base + 39, "SUNDAY", 12, HexColor("#FFFFFF"), "Arial-Black")
    draw_text(c, 288, base + 39, "10 AM - 6 PM", 12, HexColor("#FFFFFF"), "Arial-Bold")
    draw_text(c, 28, base + 8, "Food image is illustrative.", 7.5, MUTED, "Arial")


def main():
    prepare_assets()
    full = ROOT / "House_of_Chicken_and_Waffles_Full_Page_Flyer.pdf"
    c = canvas.Canvas(str(full), pagesize=(612, 792), pageCompression=1)
    c.setTitle("The House of Chicken & Waffles - Full Page Flyer")
    draw_full_page(c)
    c.save()

    handout = ROOT / "House_of_Chicken_and_Waffles_Two_Up_Handouts.pdf"
    c = canvas.Canvas(str(handout), pagesize=(612, 792), pageCompression=1)
    c.setTitle("The House of Chicken & Waffles - Two Handouts Per Page")
    draw_half(c, 396)
    draw_half(c, 0)
    c.setStrokeColor(LINE)
    c.setDash(4, 4)
    c.line(0, 396, 612, 396)
    c.save()
    print(full)
    print(handout)


if __name__ == "__main__":
    main()
