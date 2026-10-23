#!/usr/bin/env python3
"""Ortak header ve footer'ı tüm sayfalara uygular.

Header (açılış ekranı + menü) tools/parcalar/ust.html, footer (TBF bandı +
footer + script'ler) tools/parcalar/alt.html dosyasında durur. Bu betik her
sayfada <body ...> ile <main id="main"> arasını ve </main> ile </body> arasını
bu iki parçayla değiştirir; menüde o sayfanın bölümünü işaretler. Ardından
sürüm damgası için tools/stamp.py'yi çalıştırın.

Kullanım:  python3 tools/ortak.py && python3 tools/stamp.py
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UST = open(os.path.join(ROOT, "tools/parcalar/ust.html"), encoding="utf-8").read()
ALT = open(os.path.join(ROOT, "tools/parcalar/alt.html"), encoding="utf-8").read()

# Sayfa → menüde işaretlenecek bölüm
BOLUM = {
    "index.html": "anasayfa", "iletisim.html": "iletisim",
    "kulup.html": "kulup", "vizyon-misyon.html": "kulup", "antrenorler.html": "kulup",
    "antrenor.html": "kulup", "salonlar.html": "kulup",
    "takim.html": "takim", "kadro.html": "takim", "oyuncu.html": "takim",
    "fikstur.html": "takim", "mac.html": "takim",
    "galeri.html": "medya", "videolar.html": "medya", "haberler.html": "medya", "haber.html": "medya",
}

changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    name = os.path.basename(path)
    html = open(path, encoding="utf-8").read()
    aktif = BOLUM.get(name)
    ust = re.sub(r"\{\{aktif:(\w+)\}\}", lambda m: ' aria-current="page"' if m.group(1) == aktif else "", UST)
    new = re.sub(r"(<body[^>]*>\n).*?(<main id=\"main\">)", lambda m: m.group(1) + ust + m.group(2), html, count=1, flags=re.S)
    new = re.sub(r"(</main>\n).*?(</body>)", lambda m: m.group(1) + ALT + m.group(2), new, count=1, flags=re.S)
    if new != html:
        open(path, "w", encoding="utf-8").write(new)
        changed += 1

print(f"ortak parçalar · {changed} sayfa güncellendi")
