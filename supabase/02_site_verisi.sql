-- =====================================================================
-- SİTENİN MEVCUT VERİSİ → Supabase (data/site.js'ten üretildi, 21.10.2026)
-- 01_site_semasi.sql'den SONRA bir kez çalıştırılır. Tekrar çalıştırmak güvenlidir
-- (aynı kimlikli kayıtları günceller).
-- =====================================================================
begin;

insert into public.web_settings (key, value) values
  ('okul', '{"name": "TOFAŞ Basketbol Okulları ve DİBA", "phone_display": "0 (540) 244 19 74", "tel": "tel:+905402441974", "whatsapp": "https://wa.me/905402441974", "address": "Şemikler Mah. 3121 Sk. No: 24A, Erbakır Fen Lisesi, Merkezefendi / Denizli", "venue": "Erbakır Fen Lisesi Spor Salonu", "instagram": "https://www.instagram.com/denizlitofasbasket/", "diba_instagram": "https://www.instagram.com/ileribasketbolakademi/", "season": "2026-2027"}'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.web_teams (id, name, full_name, group_code, years_label, age_label, birth_years, note, league, tbf_url, photo_url, sort, is_active) values
  ('kids', 'Kids', 'Kids · Mini Basketbol', 'kids', '2019–2020 doğumlu', '6–7 yaş', array[2019,2020]::int[], 'Mini basketbol', null, null, null, 10, true),
  ('u9', 'U9', 'U9', 'u9', '2018 doğumlu', '8 yaş', array[2018]::int[], 'Temel basketbol', null, null, null, 20, true),
  ('u10', 'U10', 'U10', 'u10', '2017 ve sonrası', '9 yaş ve altı', array[2017]::int[], 'Hazırlık maçları', null, null, null, 30, true),
  ('u11', 'U11', 'U11', 'u11', '2016 doğumlu', '10 yaş', array[2016]::int[], 'İstasyon antrenmanı', null, null, null, 40, true),
  ('u12', 'U12', 'U12', 'u12', '2015 doğumlu', '11 yaş', array[2015]::int[], 'Hazırlık maçları', null, null, null, 50, true),
  ('u14', 'U14', 'U14 Erkek', 'u14', '2013–2014 doğumlu', '12–13 yaş', array[2013,2014]::int[], 'Dostluk maçları', 'Denizli U14 Erkekler', 'https://tbf.org.tr/ligler/22618/takim-detay/272169/genel-bakis', null, 60, true),
  ('u16a', 'U16 A', 'U16 Erkek · A Takımı', 'u16', '2011–2012 doğumlu', '14–15 yaş', array[2011,2012]::int[], 'Dostluk maçları', 'Denizli U16 Erkekler', 'https://tbf.org.tr/ligler/22620/takim-detay/272162/genel-bakis', null, 70, true),
  ('u16b', 'U16 B', 'U16 Erkek · B Takımı', 'u16', '2011–2012 doğumlu', '14–15 yaş', array[2011,2012]::int[], 'Dostluk maçları', 'Denizli U16 Erkekler', 'https://tbf.org.tr/ligler/22620/takim-detay/272184/genel-bakis', null, 80, true)
on conflict (id) do update set name = excluded.name, full_name = excluded.full_name, group_code = excluded.group_code, years_label = excluded.years_label, age_label = excluded.age_label, birth_years = excluded.birth_years, note = excluded.note, league = excluded.league, tbf_url = excluded.tbf_url, photo_url = excluded.photo_url, sort = excluded.sort, is_active = excluded.is_active;

insert into public.web_opponents (id, name, logo_url) values
  ('servergazi-basketbol-a', 'Servergazi Basketbol (A)', 'assets/teams/servergazi.png'),
  ('pamukkale-akademi', 'Pamukkale Akademi', 'assets/teams/pamukkale-akademi.png'),
  ('saygin-spor-a', 'Saygın Spor (A)', null),
  ('servergazi-basketbol-b', 'Servergazi Basketbol (B)', 'assets/teams/servergazi.png'),
  ('basket-denizli-spor', 'Basket Denizli Spor', 'assets/teams/basket-denizli.png'),
  ('camlik-spor', 'Çamlık Spor', 'assets/teams/camlik.png'),
  ('denizli-basket-akademi-spor', 'Denizli Basket Akademi Spor', 'assets/teams/denizli-basket-akademi.png'),
  ('denizli-yildizlar', 'Denizli Yıldızlar', null),
  ('kuzey-akademi-spor', 'Kuzey Akademi Spor', 'assets/teams/kuzey-akademi.png'),
  ('logos-akademi-spor', 'Logos Akademi Spor', 'assets/teams/logos-akademi.png'),
  ('nova-atletik-spor-kulubu-a', 'Nova Atletik Spor Kulübü (A)', 'assets/teams/nova-atletik.png'),
  ('saraykoy-genclik-ve-spor-ilce-mudurlugu', 'Sarayköy Gençlik ve Spor İlçe Müdürlüğü', 'assets/teams/saraykoy.png'),
  ('nova-atletik-spor-kulubu-b', 'Nova Atletik Spor Kulübü (B)', 'assets/teams/nova-atletik.png')
on conflict (id) do update set name = excluded.name, logo_url = excluded.logo_url;

insert into public.web_venues (id, name, short_name, use_text, address, capacity, maps_embed, directions_url, photo_url, listed, sort) values
  ('erbakir', 'Erbakır Fen Lisesi Spor Salonu', 'Erbakır Fen Lisesi', 'Antrenman salonu', 'Şemikler Mah. 3121 Sk. No: 24A, Merkezefendi / Denizli', null, 'https://www.google.com/maps?q=37.80414,29.05163&z=16&output=embed', 'https://www.google.com/maps/dir/?api=1&destination=37.80414,29.05163', null, true, 10),
  ('engelsiz', 'Denizli Büyükşehir Belediyesi Engelsiz Yaşam Merkezi Spor Salonu', 'Engelsiz Yaşam Merkezi', 'Lig maçları (TBF Denizli U14 ve U16 Erkekler)', 'Servergazi Mah. 409 Sk., Merkezefendi / Denizli', '300 kişi', 'https://www.google.com/maps?q=Denizli+B%C3%BCy%C3%BCk%C5%9Fehir+Belediyesi+Engelsiz+Ya%C5%9Fam+Merkezi+Spor+Salonu&z=16&output=embed', 'https://www.google.com/maps/dir/?api=1&destination=Denizli+B%C3%BCy%C3%BCk%C5%9Fehir+Belediyesi+Engelsiz+Ya%C5%9Fam+Merkezi+Spor+Salonu', null, false, 20)
on conflict (id) do update set name = excluded.name, short_name = excluded.short_name, use_text = excluded.use_text, address = excluded.address, capacity = excluded.capacity, maps_embed = excluded.maps_embed, directions_url = excluded.directions_url, photo_url = excluded.photo_url, listed = excluded.listed, sort = excluded.sort;

insert into public.web_players (id, team_id, name, born, number, position, photo_url, bio, sort, is_active) values
  ('ali-deniz-ilkimen', 'u14', 'ALİ DENİZ İLKİMEN', 2014, null, null, null, null, 0, true),
  ('arda-turhan', 'u14', 'ARDA TURHAN', 2013, null, null, null, null, 0, true),
  ('arkin-yarkin', 'u14', 'ARKIN YARKIN', 2013, null, null, null, null, 0, true),
  ('doruk-guven', 'u14', 'DORUK GÜVEN', 2013, null, null, null, null, 0, true),
  ('doruk-ozturk', 'u14', 'DORUK ÖZTÜRK', 2014, null, null, null, null, 0, true),
  ('emir-efe-celer', 'u14', 'EMİR EFE ÇELER', 2013, null, null, null, null, 0, true),
  ('muammer-ruzgar-caliskan', 'u14', 'MUAMMER RÜZGAR ÇALIŞKAN', 2014, null, null, null, null, 0, true),
  ('muzaffer-bozdemir', 'u14', 'MUZAFFER BOZDEMİR', 2014, null, null, null, null, 0, true),
  ('omer-yarici', 'u14', 'ÖMER YARICI', 2014, null, null, null, null, 0, true),
  ('sarp-guven', 'u14', 'SARP GÜVEN', 2013, null, null, null, null, 0, true),
  ('suleyman-demir-dokgoz', 'u14', 'SÜLEYMAN DEMİR DOKGÖZ', 2014, null, null, null, null, 0, true),
  ('tuna-kargi', 'u14', 'TUNA KARGI', 2014, null, null, null, null, 0, true),
  ('yigit-kaan-oruc', 'u14', 'YİĞİT KAAN ORUÇ', 2014, null, null, null, null, 0, true),
  ('ahmet-teke', 'u16a', 'AHMET TEKE', 2011, null, null, null, null, 0, true),
  ('ahmet-efe-yildiran', 'u16a', 'AHMET EFE YILDIRAN', 2011, null, null, null, null, 0, true),
  ('ahmet-eren-tenekeci', 'u16a', 'AHMET EREN TENEKECİ', 2012, null, null, null, null, 0, true),
  ('asim-yigit-gurler', 'u16a', 'ASIM YİĞİT GÜRLER', 2012, null, null, null, null, 0, true),
  ('egemen-erten', 'u16a', 'EGEMEN ERTEN', 2012, null, null, null, null, 0, true),
  ('emir-cansuz', 'u16a', 'EMİR CANSUZ', 2012, null, null, null, null, 0, true),
  ('ismail-aras-degirmenci', 'u16a', 'İSMAİL ARAS DEĞİRMENCİ', 2012, null, null, null, null, 0, true),
  ('kayra-demir-ozdemir', 'u16a', 'KAYRA DEMİR ÖZDEMİR', 2012, null, null, null, null, 0, true),
  ('mehmet-cinar-kaya', 'u16a', 'MEHMET ÇINAR KAYA', 2012, null, null, null, null, 0, true),
  ('mert-ercan', 'u16a', 'MERT ERCAN', 2011, null, null, null, null, 0, true),
  ('mustafa-eren-yagci', 'u16a', 'MUSTAFA EREN YAĞCI', 2012, null, null, null, null, 0, true),
  ('mustafa-mert-oneri', 'u16a', 'MUSTAFA MERT ÖNERİ', 2011, null, null, null, null, 0, true),
  ('mustafa-yigit-goven', 'u16a', 'MUSTAFA YİĞİT GÖVEN', 2012, null, null, null, null, 0, true),
  ('omer-mete-gok', 'u16a', 'ÖMER METE GÖK', 2011, null, null, null, null, 0, true),
  ('resat-cinar-hilinc', 'u16a', 'REŞAT ÇINAR HILINÇ', 2012, null, null, null, null, 0, true),
  ('salih-mert-yavas', 'u16a', 'SALİH MERT YAVAŞ', 2012, null, null, null, null, 0, true),
  ('talha-efe-celik', 'u16a', 'TALHA EFE ÇELİK', 2011, null, null, null, null, 0, true),
  ('tuncay-ege-bilgic', 'u16a', 'TUNCAY EGE BİLGİÇ', 2012, null, null, null, null, 0, true),
  ('umut-eren-ozbudak', 'u16a', 'UMUT EREN ÖZBUDAK', 2012, null, null, null, null, 0, true),
  ('aras-koknar', 'u16b', 'ARAS KÖKNAR', 2012, null, null, null, null, 0, true)
on conflict (id) do update set team_id = excluded.team_id, name = excluded.name, born = excluded.born, number = excluded.number, position = excluded.position, photo_url = excluded.photo_url, bio = excluded.bio, sort = excluded.sort, is_active = excluded.is_active;

insert into public.web_coaches (id, name, title, photo_url, bio, social, sort, is_active) values
  ('yigit-soydas', 'Yiğit Soydaş', 'Baş Antrenör', null, null, '{}'::jsonb, 10, true),
  ('anil-cetkin', 'Anıl Çetkin', 'Baş Antrenör', null, null, '{}'::jsonb, 20, true),
  ('mustafa-ekiz', 'Mustafa Ekiz', 'Atletik Performans Antrenörü', null, null, '{}'::jsonb, 30, true),
  ('egemen-ege', 'Egemen Ege', 'Yardımcı Antrenör', null, null, '{}'::jsonb, 40, true),
  ('selin-karagoz', 'Selin Karagöz', 'Yardımcı Antrenör', null, null, '{}'::jsonb, 50, true)
on conflict (id) do update set name = excluded.name, title = excluded.title, photo_url = excluded.photo_url, bio = excluded.bio, social = excluded.social, sort = excluded.sort, is_active = excluded.is_active;

insert into public.web_matches (id, code, team_id, opponent_id, opponent_team_id, opponent_name, is_home, competition, week, match_date, match_time, venue_id, our_score, their_score, status) values
  ('ami579', 'AMI579', 'u16a', 'servergazi-basketbol-a', null, null, true, 'Denizli U16 Erkekler', '1. Hafta', '2026-10-23', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('ami580', 'AMI580', 'u16b', 'pamukkale-akademi', null, null, true, 'Denizli U16 Erkekler', '1. Hafta', '2026-10-23', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto986', 'BTO986', 'u14', 'saygin-spor-a', null, null, false, 'Denizli U14 Erkekler', '1. Hafta', '2026-10-26', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto991', 'BTO991', 'u14', 'servergazi-basketbol-a', null, null, true, 'Denizli U14 Erkekler', '2. Hafta', '2026-10-31', '14:00', 'engelsiz', null, null, 'scheduled'),
  ('ami585', 'AMI585', 'u16b', 'servergazi-basketbol-a', null, null, false, 'Denizli U16 Erkekler', '2. Hafta', '2026-11-03', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('ami586', 'AMI586', 'u16a', 'servergazi-basketbol-b', null, null, false, 'Denizli U16 Erkekler', '2. Hafta', '2026-11-03', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami588', 'AMI588', 'u16a', 'basket-denizli-spor', null, null, true, 'Denizli U16 Erkekler', '3. Hafta', '2026-11-06', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1000', 'BTO1000', 'u14', 'servergazi-basketbol-b', null, null, false, 'Denizli U14 Erkekler', '3. Hafta', '2026-11-09', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami589', 'AMI589', 'u16b', 'servergazi-basketbol-b', null, null, true, 'Denizli U16 Erkekler', '3. Hafta', '2026-11-10', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('bto1008', 'BTO1008', 'u14', 'camlik-spor', null, null, false, 'Denizli U14 Erkekler', '5. Hafta', '2026-11-12', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami592', 'AMI592', 'u16b', 'basket-denizli-spor', null, null, false, 'Denizli U16 Erkekler', '4. Hafta', '2026-11-13', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1002', 'BTO1002', 'u14', 'basket-denizli-spor', null, null, true, 'Denizli U14 Erkekler', '4. Hafta', '2026-11-14', '12:00', 'engelsiz', null, null, 'scheduled'),
  ('ami593', 'AMI593', 'u16a', 'camlik-spor', null, null, false, 'Denizli U16 Erkekler', '4. Hafta', '2026-11-24', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('bto1013', 'BTO1013', 'u14', 'denizli-basket-akademi-spor', null, null, true, 'Denizli U14 Erkekler', '6. Hafta', '2026-11-28', '11:00', 'engelsiz', null, null, 'scheduled'),
  ('ami597', 'AMI597', 'u16a', 'denizli-basket-akademi-spor', null, null, true, 'Denizli U16 Erkekler', '5. Hafta', '2026-12-04', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('ami598', 'AMI598', 'u16b', 'camlik-spor', null, null, true, 'Denizli U16 Erkekler', '5. Hafta', '2026-12-04', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1025', 'BTO1025', 'u14', 'denizli-yildizlar', null, null, false, 'Denizli U14 Erkekler', '8. Hafta', '2026-12-05', '11:00', 'engelsiz', null, null, 'scheduled'),
  ('ami607', 'AMI607', 'u16b', null, 'u16a', null, true, 'Denizli U16 Erkekler', '7. Hafta', '2026-12-11', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami604', 'AMI604', 'u16b', 'denizli-basket-akademi-spor', null, null, false, 'Denizli U16 Erkekler', '6. Hafta', '2026-12-13', '14:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1034', 'BTO1034', 'u14', 'kuzey-akademi-spor', null, null, true, 'Denizli U14 Erkekler', '9. Hafta', '2026-12-14', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami615', 'AMI615', 'u16a', 'logos-akademi-spor', null, null, true, 'Denizli U16 Erkekler', '8. Hafta', '2026-12-20', '15:30', 'engelsiz', null, null, 'scheduled'),
  ('bto1038', 'BTO1038', 'u14', 'logos-akademi-spor', null, null, false, 'Denizli U14 Erkekler', '10. Hafta', '2026-12-21', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami617', 'AMI617', 'u16b', 'logos-akademi-spor', null, null, false, 'Denizli U16 Erkekler', '9. Hafta', '2026-12-22', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('ami618', 'AMI618', 'u16a', 'nova-atletik-spor-kulubu-a', null, null, false, 'Denizli U16 Erkekler', '9. Hafta', '2026-12-22', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1046', 'BTO1046', 'u14', 'nova-atletik-spor-kulubu-a', null, null, true, 'Denizli U14 Erkekler', '11. Hafta', '2026-12-26', '15:30', 'engelsiz', null, null, 'scheduled'),
  ('bto1051', 'BTO1051', 'u14', 'pamukkale-akademi', null, null, false, 'Denizli U14 Erkekler', '12. Hafta', '2027-01-02', '14:00', 'engelsiz', null, null, 'scheduled'),
  ('bto1058', 'BTO1058', 'u14', 'saraykoy-genclik-ve-spor-ilce-mudurlugu', null, null, true, 'Denizli U14 Erkekler', '13. Hafta', '2027-01-07', '20:00', 'engelsiz', null, null, 'scheduled'),
  ('ami628', 'AMI628', 'u16b', 'nova-atletik-spor-kulubu-b', null, null, false, 'Denizli U16 Erkekler', '11. Hafta', '2027-01-10', '12:30', 'engelsiz', null, null, 'scheduled'),
  ('ami629', 'AMI629', 'u16a', 'pamukkale-akademi', null, null, false, 'Denizli U16 Erkekler', '11. Hafta', '2027-01-10', '14:00', 'engelsiz', null, null, 'scheduled'),
  ('ami625', 'AMI625', 'u16a', 'nova-atletik-spor-kulubu-b', null, null, true, 'Denizli U16 Erkekler', '10. Hafta', '2027-01-20', '18:30', 'engelsiz', null, null, 'scheduled'),
  ('ami626', 'AMI626', 'u16b', 'nova-atletik-spor-kulubu-a', null, null, true, 'Denizli U16 Erkekler', '10. Hafta', '2027-01-20', '20:00', 'engelsiz', null, null, 'scheduled')
on conflict (id) do update set code = excluded.code, team_id = excluded.team_id, opponent_id = excluded.opponent_id, opponent_team_id = excluded.opponent_team_id, opponent_name = excluded.opponent_name, is_home = excluded.is_home, competition = excluded.competition, week = excluded.week, match_date = excluded.match_date, match_time = excluded.match_time, venue_id = excluded.venue_id, our_score = excluded.our_score, their_score = excluded.their_score, status = excluded.status;

insert into public.web_posts (id, post_date, type, cat, title, body, image_url, link_url, groups, via, is_published) values
  ('DeWwV1-jeWa', '2026-10-11', 'photo', 'mac', 'Denizli Basket ile hazırlık maçları', 'U10 ve U11 takımlarımız Denizli Basket S.K. ile keyifli hazırlık maçları oynadı. Misafirperverlikleri için Denizli Basket ailesine teşekkür ederiz.', 'assets/instagram/DeWwV1-jeWa.jpg', 'https://www.instagram.com/p/DeWwV1-jeWa/', array['u10','u11']::text[], null, true),
  ('DeAFdPFiHqC', '2026-10-02', 'photo', 'etkinlik', 'TOFAŞ A Takımı Denizli''de öğrencilerimizle', 'TOFAŞ oyuncu ve antrenörleri Denizli''de spor okulu öğrencilerimizle buluştu; hatıra fotoğrafları çekildi, imzalar dağıtıldı.', 'assets/instagram/DeAFdPFiHqC.jpg', 'https://www.instagram.com/p/DeAFdPFiHqC/', '{}', '@tofassporkulubu ortak paylaşımı', true),
  ('DdMyVmNN4W2', '2026-09-12', 'poster', 'duyuru', '2026-2027 sezonuna hazırız', 'Yeni sezonda sporcularımızı çalıştıracak teknik ekibimiz belli oldu.', 'assets/instagram/DdMyVmNN4W2.jpg', 'https://www.instagram.com/p/DdMyVmNN4W2/', '{}', null, true),
  ('DdJsbaptWT9', '2026-09-11', 'video', 'mac', 'U10 hazırlık maçı', 'U10 takımımızın Logos Akademi Basketbol ile oynadığı hazırlık maçından anlar.', 'assets/instagram/DdJsbaptWT9.jpg', 'https://www.instagram.com/p/DdJsbaptWT9/', array['u10']::text[], null, true),
  ('DdFP_n5tVEz', '2026-09-09', 'photo', 'mac', 'U12 – Denizli Basket hazırlık maçı', 'U12 takımımız, Denizli Basket altyapı U12 takımıyla karşılaştı.', 'assets/instagram/DdFP_n5tVEz.jpg', 'https://www.instagram.com/p/DdFP_n5tVEz/', array['u12']::text[], null, true),
  ('DdEU4bvtPNy', '2026-09-09', 'photo', 'etkinlik', '#80s #basketball', 'Takımımızdan eğlenceli bir kare.', 'assets/instagram/DdEU4bvtPNy.jpg', 'https://www.instagram.com/p/DdEU4bvtPNy/', '{}', null, true),
  ('DdEFY7rt9Mb', '2026-09-09', 'photo', 'mac', 'Saygın Basketbol U12 ile hazırlık maçı', 'Kardeş kulübümüz Saygın Basketbol S.K. U12 takımıyla centilmence bir maç oynadık.', 'assets/instagram/DdEFY7rt9Mb.jpg', 'https://www.instagram.com/p/DdEFY7rt9Mb/', array['u12']::text[], null, true),
  ('DdCqJ6cjWk5', '2026-09-08', 'album', 'mac', 'Logos Basketbol''u ağırladık', 'Logos Basketbol U16, U14, U11 ve U10 takımlarıyla kulübümüzde dostluk maçları oynadık.', 'assets/instagram/DdCqJ6cjWk5.jpg', 'https://www.instagram.com/p/DdCqJ6cjWk5/', array['u16','u14','u11','u10']::text[], null, true),
  ('DcgZBzMt7gQ', '2026-08-26', 'video', 'antrenman', 'U10 çalışıyor', 'U10 grubumuzun antrenmanından kısa bir video.', 'assets/instagram/DcgZBzMt7gQ.jpg', 'https://www.instagram.com/p/DcgZBzMt7gQ/', array['u10']::text[], null, true),
  ('DcOnRZyNopd', '2026-08-19', 'video', 'antrenman', 'U12 ve U11 istasyon antrenmanı', 'U12 ve U11 gruplarımız hız, çabukluk, kuvvet ve sıçrama istasyonlarında çalıştı.', 'assets/instagram/DcOnRZyNopd.jpg', 'https://www.instagram.com/p/DcOnRZyNopd/', array['u12','u11']::text[], null, true),
  ('Db_qfR0Bkm6', '2026-08-13', 'video', 'antrenman', 'Haftanın son çalışmaları', 'U16, U14, U12, U11, U10 ve Kids gruplarımızla verimli bir haftayı geride bıraktık.', 'assets/instagram/Db_qfR0Bkm6.jpg', 'https://www.instagram.com/p/Db_qfR0Bkm6/', array['u16','u14','u12','u11','u10','kids']::text[], null, true),
  ('Db-hQRmt1n0', '2026-08-13', 'poster', 'duyuru', '2026-2027 sezonunda sahadayız', 'Yaz boyunca haftada 4 antrenman; disiplinli ve gelişim odaklı eğitim. Kontenjanlar dolmadan yerini al!', 'assets/instagram/Db-hQRmt1n0.jpg', 'https://www.instagram.com/p/Db-hQRmt1n0/', '{}', null, true)
on conflict (id) do update set post_date = excluded.post_date, type = excluded.type, cat = excluded.cat, title = excluded.title, body = excluded.body, image_url = excluded.image_url, link_url = excluded.link_url, groups = excluded.groups, via = excluded.via, is_published = excluded.is_published;

insert into public.web_faq (id, question, answer, sort, is_active) values
  ('sss-1', 'Kaç yaşından itibaren başlayabilir?', '6 yaşından itibaren. En küçükler Kids (mini basketbol) grubunda başlıyor; 16 yaşa kadar yaşa göre gruplarımız var.', 10, true),
  ('sss-2', 'Daha önce basketbol oynamamış olması sorun mu?', 'Hayır. Çocuklar yaşlarına ve seviyelerine göre gruplandırılıyor.', 20, true),
  ('sss-3', 'Antrenmanlar nerede yapılıyor?', 'Erbakır Fen Lisesi spor salonunda, Merkezefendi / Denizli.', 30, true),
  ('sss-4', 'Haftada kaç gün antrenman var?', 'Yaz döneminde haftada 4 antrenman yapılıyor. Sezon içi program ve grup saatleri için bizi arayın.', 40, true),
  ('sss-5', 'Maçlara çıkıyor muyuz?', 'Evet. DİBA adıyla TBF Denizli U14 ve U16 Erkekler liglerinde U14, U16 A ve U16 B takımlarımızla oynuyoruz; maç takvimi Tüm Fikstür sayfasında.', 50, true),
  ('sss-6', 'Ücret ne kadar?', 'Ücret ve kayıt bilgisi için 0 (540) 244 19 74 numarasını arayabilir ya da WhatsApp’tan yazabilirsiniz.', 60, true),
  ('sss-7', 'Deneme antrenmanı var mı?', null, 70, true)
on conflict (id) do update set question = excluded.question, answer = excluded.answer, sort = excluded.sort, is_active = excluded.is_active;

commit;
