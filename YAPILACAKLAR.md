# Yapılacaklar / Kulüpten istenecek bilgiler

## Takımlar, sporcular, maçlar
- [x] U14 ve U16 (A/B) fikstürü ve kadroları eklendi (TBF Denizli, 19.10.2026)
- [ ] **U16 B kadrosu** TBF'de yalnız 1 sporcu görünüyor (Aras Köknar) — lisanslar tamamlanınca güncelle
- [ ] Kids, U9, U10, U11, U12 kadroları ve maç programları (TBF'de bu kategorilerde lig yok)
- [ ] U9 (2018) ve Kids (2019–2020) doğum yılı ayrımının teyidi (panel → Takımlar)
- [ ] Sporcu bilgilerinin sitede yayını için **veli onayı (KVKK)** — şu an ad soyad + doğum yılı yayında; fotoğraf eklemeden önce mutlaka yazılı onay alın
- [ ] Sporcu forma numaraları, pozisyonlar, fotoğraflar, kısa biyografiler (panel → Oyuncular)
- [ ] Takım fotoğrafları (panel → Takımlar)
- [ ] Maç sonuçları oynandıkça **panelden** (Özet → Skor bekleyen maçlar) girilmeli
- [ ] TBF'de takımların teknik kadrosu boş; hangi antrenör hangi takımda?
- [ ] Engelsiz Yaşam Merkezi'nin harita pini (şu an ad aramasıyla gösteriliyor) ve salon fotoğrafları
- [ ] Rakiplerden Denizli Yıldızlar ve Saygın Spor'un logosu TBF'de yok (baş harf gösteriliyor)
- [ ] Vizyon & Misyon metni taslak — kulüple onaylanmalı
- [ ] Antrenörlerin fotoğraf, biyografi ve sosyal medya hesapları (panel → Antrenörler)

## DİBA
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
- [x] Yönetim paneli: https://ed1620.github.io/denizli-tofas-basketbol/panel/ (DİBA yönetici hesabıyla)
- [ ] Ön kayıt formu ileride Supabase'e kaydedilebilir — şimdilik form WhatsApp mesajı açıyor
- [ ] Fiat Typeface lisansı CC BY 4.0 kaynak gösterilmesini istiyor; footer'daki kredi kullanıcı isteğiyle kaldırıldı, kredi `assets/fonts/LICENSE-fiat.txt` ve README'de

## Maç istatistikleri (24.10.2026)
- [ ] `supabase/04_mac_istatistikleri.sql` SQL Editor'da çalıştırılacak (istatistik tablosu, U16 1. hafta skorları, A/B kadro ayrımı).
- [ ] MUZAFFER BOZDEMİR (U16 B, #8): TBF kadro listesinde görünmüyor; doğum yılı girilecek.
- [ ] Panelde istatistik girişi yok; şimdilik yeni maçların istatistikleri TBF'den SQL ile aktarılıyor.
