from reportlab.lib.colors import HexColor

from make_more_options import (
    BURGUNDY,
    GOLD,
    INK,
    LIGHT_PHOTO,
    LOGO,
    RED,
    ROOT,
    WHITE,
    logo,
    photo,
    save_two_up,
    t,
)


def low_ink_half(c, base):
    # One 8.5 x 5.5 inch flyer on a white half of US Letter paper.
    c.setFillColor(WHITE)
    c.rect(0, base, 612, 396, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.rect(25, base + 383, 562, 4, stroke=0, fill=1)

    logo(c, 25, base + 293, 121, 82)
    t(c, 162, base + 362, "THE HOUSE OF", 11, RED, "Arial-Black")
    t(c, 159, base + 336, "CHICKEN &", 24, INK, "Georgia-Bold")
    t(c, 159, base + 306, "WAFFLES", 28, INK, "Georgia-Bold")

    t(c, 27, base + 250, "COME", 30, BURGUNDY, "Arial-Black")
    t(c, 27, base + 214, "HUNGRY!", 30, BURGUNDY, "Arial-Black")
    t(c, 28, base + 170, "105 Plainfield St", 17, INK, "Georgia-Bold")
    t(c, 28, base + 146, "Providence, RI", 13.5, RED, "Arial-Bold")

    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.roundRect(327, base + 136, 251, 152, 9, stroke=1, fill=0)
    photo(c, LIGHT_PHOTO, 331, base + 140, 243, 144, 6)

    c.setStrokeColor(HexColor("#C8B9AF"))
    c.setLineWidth(0.8)
    c.line(27, base + 120, 585, base + 120)
    t(c, 27, base + 100, "HOURS", 10.5, RED, "Arial-Black")
    t(c, 27, base + 75, "THURSDAY - SATURDAY", 12.5, BURGUNDY, "Arial-Black")
    t(c, 353, base + 75, "10 AM - 10 PM", 12.5, INK, "Arial-Bold")
    t(c, 27, base + 46, "SUNDAY", 12.5, BURGUNDY, "Arial-Black")
    t(c, 353, base + 46, "10 AM - 6 PM", 12.5, INK, "Arial-Bold")
    t(c, 27, base + 17, "Food image is illustrative.", 7.5, HexColor("#625B56"), "Arial")


if __name__ == "__main__":
    if not LOGO.exists() or not LIGHT_PHOTO.exists():
        raise FileNotFoundError("Flyer logo and food visual are missing.")
    save_two_up("Option_2_Retro_Diner_Low_Ink_Two_Up.pdf", low_ink_half)
