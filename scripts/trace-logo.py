# Zeichnet die Form des Metall-Logos als SVG nach (Hintergrund V2). Quelle: Alphakanal des freigestellten 600-px-Logos.
# Wird ersetzt, sobald die Originaldatei von Tomtron da ist.
# Aufruf (im Projektordner): %LOCALAPPDATA%\Programs\rembg\Scripts\python scripts\trace-logo.py
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from skimage.measure import approximate_polygon, find_contours

root = Path(__file__).resolve().parent.parent
src = Image.open(root / 'public/wp-content/uploads/2022/01/Logo_Dicular-Rec-Metal-600x600-2.png').convert('RGBA')
alpha = src.getchannel('A')
box = alpha.getbbox()
pad = 2
alpha = alpha.crop((box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad))
SCALE = 6
big = alpha.resize((alpha.width * SCALE, alpha.height * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SCALE * 0.6))
data = np.asarray(big, dtype=float)
parts = []
for c in find_contours(data, 128):
    if len(c) < SCALE * 12:  # Krümel weg
        continue
    pts = approximate_polygon(c, 0.5)[:-1]
    parts.append('M' + 'L'.join(f'{round(p[1])} {round(p[0])}' for p in pts) + 'Z')
h, w = data.shape
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path fill-rule="evenodd" d="{"".join(parts)}"/></svg>\n'
out = root / 'public/v2/logo-form.svg'
out.write_text(svg, encoding='utf-8')
print(out.name, f'{len(svg) // 1024} KB', len(parts), 'Teilformen', w, h)
