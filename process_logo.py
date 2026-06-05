from PIL import Image

gray = Image.open("hermes_logo.jpg").convert("L")
alpha = gray.point(lambda p: 255 - p)  # white→0 (transparent), black→255 (opaque)

base = Image.new("RGBA", gray.size, (0, 0, 0, 0))
base.putalpha(alpha)
bbox = base.getbbox()

black = Image.new("RGBA", gray.size, (0, 0, 0, 0))
black.putalpha(alpha)
black = black.crop(bbox)
black.save("hermes_logo_black.png")
print(f"Saved hermes_logo_black.png ({black.width}x{black.height})")

white = Image.new("RGBA", gray.size, (255, 255, 255, 0))
white.putalpha(alpha)
white = white.crop(bbox)
white.save("hermes_logo_white.png")
print(f"Saved hermes_logo_white.png ({white.width}x{white.height})")

gold = Image.new("RGBA", gray.size, (212, 175, 55, 0))  # metallic gold
gold.putalpha(alpha)
gold = gold.crop(bbox)
gold.save("hermes_logo_gold.png")
print(f"Saved hermes_logo_gold.png ({gold.width}x{gold.height})")
