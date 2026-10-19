# TOFAŞ Basketbol Okulları × DİBA — Denizli İleri Basketbol

Denizli'de aynı çatı altındaki iki kulübün ortak sitesi: **TOFAŞ Basketbol
Okulları Denizli** (6–16 yaş basketbol eğitimi) ve **DİBA · Denizli İleri
Basketbol** (yerel ligde DİBA adıyla mücadele eden kulüp). İki marka eşit
ağırlıkta: header, footer, hero paneli ve paylaşım görselinde iki logo yan
yana durur; renkler TOFAŞ'ın lacivert + yeşil sistemidir. Hedef alan adı:
`denizliileribasketbol.com`.


Denizli Tofaş Basketbol Okulları'nın tanıtım ve ön kayıt sitesi. Tasarım sıfırdan
yapılmadı: Tofaş Spor Kulübü için hazırlanan sitenin (`~/Desktop/TOFAŞ`)
tasarım sistemi **birebir** alındı — aynı beyaz zemin, lacivert ve yeşil, üst
şerit, logo + yatay menü, hero slider + yan panel, fikstür satırları, sekmeli
haber kartları, kadro şeridi, tablo, lacivert galeri bandı ve footer. Değişen
taraf içerik: A takım modülleri (fikstür, puan durumu, bilet, lig logoları)
spor okulunun karşılıklarıyla değiştirildi.

**Canlı site:** https://ed1620.github.io/denizli-tofas-basketbol/ (GitHub Pages, `main` dalının kökünden; her push'ta birkaç dakika içinde güncellenir)

İçerik `ICERIK.md`'den gelir (kulübün Instagram hesabı ve açık kaynaklar).
Orada olmayan bilgi (ücret, saat, biyografi…) uydurulmadı; sitede
"Bilgi için arayın" yazar, liste `YAPILACAKLAR.md`'de. Build adımı yok.

## Çalıştırma

```bash
python3 -m http.server 8913
```

`http://localhost:8913` adresini açın. (TOFAŞ projesi 8912'yi kullanıyor.)

CSS veya JS'i değiştirdikten sonra sayfalardaki sürüm damgasını tazeleyin
(tarayıcı bayat dosya servis etmesin):

```bash
python3 tools/stamp.py
```

Veri `data/site.js` içinde global script olarak yüklendiği için `index.html`
çift tıklanarak da açılabilir; `fetch`/CORS gerekmez.

## Instagram fotoğrafları

Fotoğraflar `assets/instagram/<GÖNDERİ KODU>.jpg` olarak elle kaydedilir
(Instagram CDN linkleri süreli olduğu için sayfaya gömülmez). Kodlar ve
gönderilerin ne olduğu `ICERIK.md` → "Instagram gönderileri" tablosunda.
Kaydettikten sonra:

```bash
python3 tools/photos.py && python3 tools/stamp.py
```

`photos.py` görselleri `sips` ile en uzun kenar 1600 px'e küçültür,
`assets/instagram/600/` altına küçük resimleri üretir ve mevcut kodları
`data/photos.js`'e (`window.PHOTOS`) yazar. Site yalnız bu listedekileri
yükler; olmayanlar için lacivert zemin + soluk rozet yer tutucusu görünür,
konsola 404 düşmez.

## Sayfalar

| Dosya | İçerik | TOFAŞ karşılığı |
| --- | --- | --- |
| `index.html` | Gönderilerden 5'li slider + ön kayıt paneli, hazırlık maçları, sekmeli haberler, antrenör şeridi, yaş grupları tablosu, galeri + sayılar, konum ve harita | Ana sayfa (slider + sıradaki maç, son/yaklaşan maçlar, haberler, kadro şeridi, puan durumu, albümler) |
| `kulupler.html` | İki kulübün tanıtımı; DİBA bölümü (lig/takım bilgisi gelince doldurulacak) | Kulüp |
| `programlar.html` | Yaş grupları tablosu, grup kartları, antrenman yaklaşımı, yaz okulu | Puan durumu tablosu + branşlar + kulüp metin blokları |
| `antrenorler.html` | İki baş antrenör vitrini + teknik ekip kartları (fotoğraf yoksa baş harf) | Teknik kadro |
| `galeri.html` | Instagram fotoğrafları, klavyeyle gezilen lightbox | Galeri |
| `haberler.html` | Instagram gönderileri, kategori sekmeleri; kartlar gönderiye gider | Haberler |
| `kayit.html` | Ön kayıt formu (WhatsApp'a hazır mesaj) + SSS | — |
| `iletisim.html` | Adres, telefon/WhatsApp, sosyal medya, Google Haritası, yol tarifi | İletişim |

Her sayfada iki ana eylem: header'da **Ön Kayıt** ve **WhatsApp'tan Yaz**;
mobilde ekranın altında sabit `Ara · WhatsApp · Ön Kayıt` çubuğu.

## Logolar ve font

| Dosya | Kaynak |
| --- | --- |
| `assets/img/tofas-denizli.png` | TOFAŞ Bursa 1974 · Denizli Basketbol Okulları logosu (beyaz zemini kaldırıldı) |
| `assets/img/tofas-pill.png` | Aynı logonun yalnız hap kısmı — header, footer, hero paneli |
| `assets/img/diba.png`, `diba-buyuk.png` | DİBA Denizli 2025 logosu (PDF'teki saydam görselden) |
| `assets/img/og.jpg` | Paylaşım görseli: iki logo yan yana, 1200×630 |

**Fiat Typeface** (`assets/fonts/`) TOFAŞ logosundaki yazı karakteridir.
Türkçe harfleri (Ş İ Ğ Ö Ü Ç) ve noktalama içermediği için yalnız ASCII
içerikli yerlerde kullanılır: grup kodları (Kids, U10…), sayılar ve skor
etiketleri. Eksik karakterler otomatik olarak Archivo'ya düşer. Font
onlinewebfonts.com'dan, CC BY 4.0 ile geldi; kredi footer'da.

## Ön kayıt formu

Backend yok. Gönderilince alanlar doğrulanır (hata mesajı alanın altında,
Türkçe), doğum yılından grup önerilir ve
`https://wa.me/905402441974?text=…` hazır mesajla açılır. Örnek mesaj:

```
Merhaba, Denizli Tofaş Basketbol Okulları için ön kayıt yapmak istiyorum.

Veli: Ayşe Yılmaz
Telefon: 0532 111 22 33
Çocuğun adı: Ali
Doğum yılı: 2016 (önerilen grup: U11)
Daha önce basketbol oynadı mı: Hayır
```

`programlar.html`'deki grup bağlantıları `kayit.html?grup=u12` biçiminde
gelir ve doğum yılını önceden seçer. İleride Supabase'e bağlanabilir
(`~/Desktop/DİBA` aynı kulübün mobil uygulaması); şimdilik bağlı değil.

## Yapı

```
assets/css/style.css   TOFAŞ tasarım sistemi (birebir) + sonda "Denizli ekleri"
assets/js/app.js       header, scroll-reveal, slider, sekmeler, lightbox, render, form
data/site.js           içerik (window.SITE): okul, gruplar, antrenörler, gönderiler, maçlar, SSS
data/photos.js         mevcut Instagram fotoğrafları (tools/photos.py üretir)
assets/img/            logo, favicon (180 px), paylaşım görseli
assets/instagram/      Instagram fotoğrafları (+ 600/ küçük resimler)
tools/stamp.py         CSS/JS bağlantılarına sürüm damgası basar (TOFAŞ'tan)
tools/photos.py        fotoğrafları küçültür, listeyi yazar
```

Header ve footer, TOFAŞ'ta olduğu gibi her sayfada statik HTML olarak tekrar
eder; menüde değişiklik yaparken yedi sayfanın hepsini güncelleyin.

## Uygulanan tasarım kuralları

TOFAŞ sitesindekilerle aynı ([emilkowalski/skills](https://github.com/emilkowalski/skills) → `emil-design-eng`):

- **Özel easing eğrileri** (`--ease-out: cubic-bezier(.23,1,.32,1)`), UI'da `ease-in` yok.
- **Süreler 300 ms altında**; slider geçişi ve scroll-reveal bunun dışında.
- **Basılabilir her öğede `:active { scale(.97) }`.**
- **Sekmelerde `clip-path` klon tekniği.**
- **Sadece `transform`/`opacity` animasyonu.**
- **Kademeli giriş:** scroll-reveal'da öğe başına 45 ms, en fazla 8 öğe.
- **Hover'lar `@media (hover: hover) and (pointer: fine)` arkasında.**
- **`prefers-reduced-motion`:** hareket ve şerit animasyonu kalkar, opaklık geçişleri kalır.

## SEO ve erişilebilirlik

- Her sayfada ayrı `<title>`, `meta description` ve Open Graph etiketleri.
- Ana sayfada `SportsActivityLocation` JSON-LD (adres, telefon, koordinat, Instagram).
- "İçeriğe geç" bağlantısı, `:focus-visible`, klavyeyle açılıp Esc ile kapanan
  mobil menü, ok tuşları/Esc ile gezilen ve odağı içinde tutan lightbox,
  form hatalarında `aria-invalid` + `aria-describedby`.

## Veri notları

- Hazırlık maçlarının skorları paylaşılmadığı için satırlarda skor yerine
  `HAZIRLIK` yazar; her satır ilgili Instagram gönderisine bağlanır.
- Grup–doğum yılı eşlemesi 2026-27 sezonu için TBF yaş mantığıyla hesaplandı;
  Kids grubu 6–8 yaş (2018–2020) olarak kullanıcıyla netleştirildi. Kulüple
  doğrulanacak.
- Antrenör isimleri sezon afişinin görsel metninden okundu; yazımlar doğrulanacak.
- Harita koordinatı (37.80414, 29.05163) ilan sitesinden; Google Haritası'nda
  pin "Denizli Erbakır Fen Lisesi" etiketine düşüyor, salon girişi ayrıca
  doğrulanmalı.
