# Yapılacaklar / Kulüpten istenecek bilgiler

## DİBA (kullanıcı paylaşacak)
- [ ] DİBA'nın oynadığı lig, takımlar / yaş kategorileri, maç programı ve sonuçlar → `kulupler.html#diba` şu an "yakında" yer tutucusu gösteriyor
- [ ] DİBA'nın kendi Instagram hesabı var mı? (şu an @ileribasketbolakademi kullanılıyor)
- [ ] DİBA ile TOFAŞ okulunun antrenman yeri ve iletişim numarası aynı mı?

## Görseller
- [x] 12 Instagram fotoğrafı `assets/instagram/` altına indirildi (19.10.2026). Yeni gönderi eklerken: görseli `<KOD>.jpg` olarak kaydet, `data/site.js` → `posts`'a ekle, sonra `python3 tools/photos.py && python3 tools/stamp.py`
- [ ] Video gönderilerinin (DdJsbaptWT9, DcgZBzMt7gQ, DcOnRZyNopd, Db_qfR0Bkm6) kapakları Instagram'ın verdiği 360×640 sürüm; daha net kapak istenirse kulüpten orijinal kare alınmalı
- [ ] Logoların orijinal vektör (SVG/PDF) ya da saydam PNG halleri — şu an TOFAŞ Denizli logosu 1600 px JPG'den, DİBA logosu PDF'ten çıkarıldı
- [ ] Fiat Typeface lisansı: font onlinewebfonts.com'dan (CC BY 4.0, footer'da kredi var) ama dosyanın kendi telif satırı boş; resmî kullanım için kaynağı teyit edilmeli
- [ ] Antrenör fotoğrafları + kısa biyografiler, isim yazımlarının teyidi (fotoğraflar `assets/img/` altına, yolu ve biyografi `data/site.js` → `coaches` içindeki `photo` / `bio` alanlarına; şu an baş harf yer tutucusu ve "Biyografi yakında eklenecek" görünüyor)

## Program bilgileri
- [ ] Antrenman günleri ve saatleri (grup bazında) — sitede şu an "Bilgi için arayın" yazıyor
- [ ] Kış / sezon dönemi programı (yaz: haftada 4 antrenman)
- [ ] Aidat / ücret bilgisi (yayınlanacak mı?)
- [ ] Grup–doğum yılı eşlemesinin teyidi
- [ ] Kız/erkek ayrımı var mı, karma mı?
- [ ] Deneme antrenmanı var mı? (SSS'de cevap yerine "bizi arayın" yazıyor)
- [ ] Lig katılımı var mı (SSS'deki "Maçlara çıkıyor muyuz?" cevabı)
- [ ] Hiç oynamamış çocuklar için seviye gruplaması (SSS cevabı)
- [ ] DİBA · Denizli İleri Basketbol Akademi'nin yürütücü olarak 2025'ten beri sitede anılması

## İletişim / konum
- [ ] E-posta adresi
- [ ] Salon girişinin harita pininin doğrulanması (37.80414, 29.05163 ilan sitesinden; Google'da "Denizli Erbakır Fen Lisesi" etiketine düşüyor, salon girişi ayrıca kontrol edilmeli)
- [ ] Açık adres: posta kodu (20010) ve salon girişi

## Yayın
- [x] Yayın: GitHub Pages → https://ed1620.github.io/denizli-tofas-basketbol/
- [ ] Alan adı **denizliileribasketbol.com** alınıp GitHub Pages'e bağlanmalı; o zaman sayfalardaki `og:image` ve JSON-LD adresleri de yeni alan adıyla güncellenmeli
- [ ] Ön kayıt formu ileride Supabase'e bağlanabilir (`~/Desktop/DİBA` projesi aynı kulübün mobil uygulaması, Supabase kullanıyor) — şimdilik form WhatsApp mesajı açıyor
