#!/usr/bin/env python3
"""Instagram fotoğraflarını hazırlar ve listesini data/photos.js'e yazar.

assets/instagram/<KOD>.jpg dosyalarını (macOS `sips` ile) en uzun kenarı
1600 px olacak şekilde küçültür, galeri/kart küçük resimleri için
assets/instagram/600/<KOD>.jpg sürümlerini üretir. Ardından mevcut kodları
window.PHOTOS olarak yazar; site yalnız bu listedekileri yükler, diğerleri için
lacivert→nane yer tutucusu kalır (konsolda 404 olmaz).

Kullanım:  python3 tools/photos.py   (sonra: python3 tools/stamp.py)
"""
import os, glob, json, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "instagram")
THUMB = os.path.join(SRC, "600")
os.makedirs(THUMB, exist_ok=True)


def longest_edge(path):
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
                         capture_output=True, text=True).stdout
    nums = [int(l.split(":")[1]) for l in out.splitlines() if "pixel" in l]
    return max(nums) if nums else 0


codes = []
for path in sorted(glob.glob(os.path.join(SRC, "*.jp*g")) + glob.glob(os.path.join(SRC, "*.png"))):
    code, ext = os.path.splitext(os.path.basename(path))
    if ext.lower() != ".jpg":   # .jpeg / .png → .jpg
        dst = os.path.join(SRC, code + ".jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", path, "--out", dst], capture_output=True)
        os.remove(path)
        path = dst
    if longest_edge(path) > 1600:
        subprocess.run(["sips", "-Z", "1600", path], capture_output=True)
    thumb = os.path.join(THUMB, code + ".jpg")
    if not os.path.exists(thumb) or os.path.getmtime(thumb) < os.path.getmtime(path):
        subprocess.run(["sips", "-Z", "600", path, "--out", thumb], capture_output=True)
    codes.append(code)

with open(os.path.join(ROOT, "data", "photos.js"), "w", encoding="utf-8") as f:
    f.write("/* tools/photos.py tarafından üretilir — elle düzenlemeyin. */\n")
    f.write("window.PHOTOS = " + json.dumps(codes) + ";\n")

print(f"{len(codes)} fotoğraf hazır: {', '.join(codes) or '—'}")
