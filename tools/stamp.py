#!/usr/bin/env python3
"""HTML sayfalarındaki CSS/JS bağlantılarına sürüm damgası basar.

Tarayıcı, aynı adresteki eski dosyayı önbellekten servis edebiliyor; damga
değişince yeni istek atılıyor. assets/css/style.css, assets/js/app.js,
data/site.js ve data/photos.js dosyalarının en son değişme zamanı damga olarak kullanılır.

Kullanım:  python3 tools/stamp.py
"""
import os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRACKED = ["assets/css/style.css", "assets/js/app.js", "data/site.js", "data/photos.js"]

version = str(int(max(os.path.getmtime(os.path.join(ROOT, f)) for f in TRACKED)))
pattern = re.compile(r'((?:href|src)=")((?:\.\./)*(?:assets/css/style\.css|assets/js/app\.js|data/site\.js|data/photos\.js))(?:\?v=\d+)?(")')

changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    html = open(path, encoding="utf-8").read()
    new = pattern.sub(lambda m: f"{m.group(1)}{m.group(2)}?v={version}{m.group(3)}", html)
    if new != html:
        open(path, "w", encoding="utf-8").write(new)
        changed += 1

print(f"sürüm {version} · {changed} sayfa güncellendi")
