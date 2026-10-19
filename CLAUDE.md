# Denizli Tofaş Basketbol Okulları — Web Sitesi

Bu klasör, **Denizli Tofaş Basketbol Okulları**'nın tanıtım ve ön kayıt sitesidir.
Site sıfırdan tasarlanmayacak. Kullanıcının daha önce Tofaş Spor Kulübü için yaptığı tasarım temel alınacak:

> **Tasarım kaynağı:** `~/Desktop/TOFAŞ/` (tam yol: `/Users/erendogan20/Desktop/TOFAŞ`)
> İşe başlamadan önce şu dosyaları baştan sona oku:
> `README.md`, `assets/css/style.css`, `assets/js/app.js`, `index.html`, `kulup.html`, `iletisim.html`, `galeri.html`, `tools/stamp.py`

Tüm içerik bilgileri **`ICERIK.md`** dosyasında. Orada olmayan hiçbir bilgiyi (ücret, saat, isim, başarı, istatistik) **uydurma**. Bilmediğin her yer için görünür bir yer tutucu bırak ve `YAPILACAKLAR.md` dosyasına ekle.

---

## 1. Teknik çerçeve (TOFAŞ projesiyle aynı)

- Saf HTML + CSS + vanilla JS. **Build adımı yok**, framework yok, npm yok.
- Çalıştırma: `python3 -m http.server 8913` → `http://localhost:8913`
  (`.claude/launch.json` dosyasını TOFAŞ'takinin aynısı olarak, port 8913 ile oluştur; TOFAŞ 8912 kullanıyor.)
- Veri, TOFAŞ projesindeki gibi `data/site.js` içinde global `window.SITE` nesnesi olarak dursun; `index.html` çift tıklanınca da açılabilsin (fetch/CORS yok).
- CSS/JS değişince sürüm damgası: TOFAŞ'taki `tools/stamp.py`'yi kopyala ve kullan.
- Dil: Türkçe (`<html lang="tr">`). TR/EN düğmesi **olmayacak**.

### Klasör yapısı
```
index.html  programlar.html  antrenorler.html  galeri.html  haberler.html  kayit.html  iletisim.html
assets/css/style.css     ← TOFAŞ'taki tasarım sistemi kopyalanıp uyarlanır
assets/js/app.js         ← header, mobil menü, scroll-reveal, sekmeler, lightbox (TOFAŞ'tan)
assets/img/              ← logo burada (hazır)
assets/instagram/        ← Instagram fotoğrafları (bkz. bölüm 5)
data/site.js             ← tüm içerik (ICERIK.md'den)
tools/stamp.py
YAPILACAKLAR.md          ← eksik bilgi / doğrulanacaklar listesi
```

## 2. Tasarım kuralları

TOFAŞ projesindeki **kimliği ve tasarım sistemini aynen koru**: token'lar (`--navy`, `--blue`, `--green`, `--green-bright`…), Archivo + Inter, gölgeler, radius, `.wrap`, `.sec`, `.eyebrow`, `.btn`, kartlar, lacivert footer, üst şerit, beyaz header + yatay menü, mobil tam ekran menü.

Uygulanmış motion kuralları da aynen geçerli (README'deki "Uygulanan tasarım kuralları" bölümü): özel easing, 300 ms altı süreler, `:active { scale(.97) }`, yalnız transform/opacity animasyonu, kademeli scroll-reveal, hover'lar `@media (hover:hover) and (pointer:fine)` arkasında, `prefers-reduced-motion` desteği.

Spor okulu için uyarlamalar:
- Logo: `assets/img/logo.png` (yuvarlak TOFAŞ · BURSA 1974 rozeti, lacivert + nane yeşili). Header'da logonun yanında **"DENİZLİ TOFAŞ" / "Basketbol Okulları"** yazsın.
- Nane yeşili (logodaki yeşil, `--green-bright` civarı) bu sitede biraz daha öne çıkabilir: çocuk/veli hedef kitle, daha sıcak ve enerjik bir ton. Ama lacivert ana renk kalır.
- Hedef kitle **veliler**. Her sayfada kolay bulunan iki ana eylem olsun: **"Ön Kayıt"** ve **"WhatsApp'tan Yaz"**.
- Mobilde ekranın altında sabit bir eylem çubuğu: `Ara` · `WhatsApp` · `Ön Kayıt`.
- A takım odaklı modüller (fikstür, puan durumu, maç geri sayımı, bilet, lig logoları, EuroCup) **kullanılmayacak**.

## 3. Sayfalar

| Sayfa | İçerik |
| --- | --- |
| `index.html` | Hero (slogan + 6–16 yaş + iki CTA, arkada Instagram fotoğrafı) · "Neden Denizli Tofaş?" 3–4 kart (Tofaş altyapı ağı, yaşa göre gruplar, atletik performans çalışması, maç tecrübesi) · Yaş grupları şeridi · Antrenör ekibi önizleme · Son paylaşımlar (Instagram gönderileri haber kartı olarak) · Konum + harita · Ön kayıt CTA bandı |
| `programlar.html` | Gruplar: Kids, U10, U11, U12, U14, U16 — her biri kart. Antrenman yaklaşımı (teknik, istasyon/atletik çalışma, hazırlık maçları). Yaz okulu. Ücret ve saat yerine "Bilgi için arayın" (bilgi gelince doldurulacak) |
| `antrenorler.html` | Teknik ekip kartları (TOFAŞ `teknik-kadro.html` düzeni). Fotoğraf yoksa baş harf yer tutucusu (TOFAŞ'taki oyuncu yer tutucusu gibi) |
| `galeri.html` | Instagram fotoğrafları ızgara + TOFAŞ'taki klavyeyle gezilen lightbox |
| `haberler.html` | Instagram gönderileri tarih sırasıyla haber kartı (başlık + kısa metin + "Instagram'da gör" linki). Detay sayfası gerekmez |
| `kayit.html` | Ön kayıt formu (bkz. bölüm 4) + SSS (akordeon) |
| `iletisim.html` | Adres, telefon, WhatsApp, Instagram, gömülü Google Haritası, "Yol tarifi al" düğmesi |

Menü: Anasayfa · Programlar · Antrenörler · Galeri · Haberler · İletişim · **[Ön Kayıt]** (birincil düğme)

## 4. Ön kayıt formu

Backend yok. Form gönderilince **WhatsApp'a hazır mesaj** açsın:
`https://wa.me/905402441974?text=<encodeURIComponent(mesaj)>`

Alanlar: Veli adı soyadı · Telefon · Çocuğun adı · Doğum yılı (seçilince uygun grup otomatik önerilsin) · Daha önce basketbol oynadı mı? · Not.
Doğrulama istemci tarafında, hata mesajları alanın altında, Türkçe.
Formun altında küçük KVKK notu: bilgiler yalnızca kayıt iletişimi için kullanılır.
(İleride Supabase'e bağlanabilir; kullanıcının `~/Desktop/DİBA` projesi aynı kulübün mobil uygulaması ve Supabase kullanıyor. Şimdilik **bağlama**, sadece `YAPILACAKLAR.md`'ye not düş.)

## 5. Görseller

- **Logo:** `assets/img/logo.png` (512 px) ve `assets/img/logo-buyuk.png` (5000 px kaynak). Favicon ve paylaşım görseli için küçült (`sips -Z 180 …`).
- **Instagram fotoğrafları:** `assets/instagram/` klasörüne konacak. Dosya adı = gönderi kodu (ör. `DdCqJ6cjWk5.jpg`). Hangi gönderinin ne olduğu `ICERIK.md` → "Instagram gönderileri" tablosunda.
  - Klasör boşsa veya eksikse: **kullanıcıdan bu fotoğrafları oraya kaydetmesini iste**, beklerken lacivert→yeşil gradyanlı, top deseni olan şık yer tutucular kullan. Instagram CDN linklerini sayfaya doğrudan gömme (süreleri doluyor).
  - Görseller yerleşince `sips -Z 1600` ile küçült, galeri küçük resimleri için `-Z 600` sürümlerini üret.
- Hero için en uygun görsel: `DdCqJ6cjWk5` (Logos Basketbol ile toplu hazırlık maçı) veya `DeAFdPFiHqC` (Tofaş A takım oyuncularıyla buluşma).

## 6. Harita ve sosyal medya

- Google Haritası (API anahtarı gerektirmez):
  `<iframe src="https://www.google.com/maps?q=37.80414,29.05163&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Erbakır Fen Lisesi konumu">`
  Yol tarifi: `https://www.google.com/maps/dir/?api=1&destination=37.80414,29.05163`
  Koordinat ilan sitesinden alındı, yaklaşık olabilir → `YAPILACAKLAR.md`'ye "salon girişinin pinini doğrula" ekle.
- Sosyal linkler ve bütün iletişim bilgileri `ICERIK.md`'de. Üst şeritte ve footer'da Instagram (@denizlitofasbasket) önde; Tofaş ana kulüp hesapları footer'da "Ana kulüp" başlığı altında.
- Telefon her yerde `tel:+905402441974`, WhatsApp `https://wa.me/905402441974`.

## 7. SEO ve erişilebilirlik

- Her sayfada anlamlı `<title>` + `meta description` (ör. "Denizli Tofaş Basketbol Okulları — 6-16 yaş basketbol eğitimi, Merkezefendi").
- Open Graph etiketleri (paylaşım görseli: logo veya hero).
- Ana sayfada `SportsActivityLocation` JSON-LD (ad, adres, telefon, koordinat, Instagram `sameAs`).
- Görsellerde `alt`, klavyeyle gezilebilir menü/lightbox, `:focus-visible`, yeterli kontrast.

## 8. Çalışma sırası

1. TOFAŞ kaynak dosyalarını oku, `ICERIK.md`'yi oku.
2. Bir **plan** çıkar (sayfa iskeletleri, TOFAŞ'tan hangi bileşenlerin taşınacağı) ve kullanıcıya göster, onay al.
3. `style.css` + `app.js` + `data/site.js` → önce `index.html`, kullanıcıya önizlemede göster.
4. Diğer sayfalar.
5. Kontrol: masaüstü + 375 px mobil önizleme, konsolda hata yok, tüm linkler çalışıyor, form WhatsApp mesajını doğru oluşturuyor.
6. `README.md` yaz (TOFAŞ README'si tarzında) ve `YAPILACAKLAR.md`'yi güncelle.
