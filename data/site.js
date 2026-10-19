/* Denizli Tofaş Basketbol Okulları — site içeriği
   Kaynak: ICERIK.md (19 Ekim 2026, kulübün Instagram hesabı ve açık kaynaklar).
   Burada olmayan bilgi (ücret, saat, biyografi…) sitede "tbd" yer tutucusu
   olarak görünür; liste YAPILACAKLAR.md'de. */

window.SITE = {
  school: {
    name: 'Denizli Tofaş Basketbol Okulları',
    slogan: "Türkiye'nin En Büyük Altyapı Organizasyonu",
    phoneDisplay: '0 (540) 244 19 74',
    tel: 'tel:+905402441974',
    wa: 'https://wa.me/905402441974',
    waNumber: '905402441974',
    venue: 'Erbakır Fen Lisesi Spor Salonu',
    address: 'Şemikler Mah. 3121 Sk. No: 24A, Erbakır Fen Lisesi, Merkezefendi / Denizli',
    lat: 37.80414,
    lng: 29.05163,
    directions: 'https://www.google.com/maps/dir/?api=1&destination=37.80414,29.05163',
    instagram: 'https://www.instagram.com/denizlitofasbasket/'
  },

  /* Doğum yılı eşlemesi 2026-27 sezonuna göre, TBF yaş kategorisi mantığıyla
     hesaplandı — kulüple doğrulanacak. */
  groups: [
    { id: 'kids', name: 'Kids', age: '6–8 yaş', yearsLabel: '2018–2020 doğumlu', years: [2018, 2019, 2020],
      note: 'Mini basketbol', text: 'Basketbolla ilk tanışma: mini basketbol grubu.' },
    { id: 'u10', name: 'U10', age: '9 yaş ve altı', yearsLabel: '2017 ve sonrası', years: [2017],
      note: 'Hazırlık maçları', text: 'Logos Basketbol ve Denizli Basket ile hazırlık maçlarına çıktı.' },
    { id: 'u11', name: 'U11', age: '10 yaş', yearsLabel: '2016 doğumlu', years: [2016],
      note: 'İstasyon antrenmanı', text: 'Hız, çabukluk, kuvvet ve sıçrama istasyonlarıyla çalışıyor.' },
    { id: 'u12', name: 'U12', age: '11 yaş', yearsLabel: '2015 doğumlu', years: [2015],
      note: 'Hazırlık maçları', text: 'Saygın Basketbol ve Denizli Basket U12 ile hazırlık maçları yaptı.' },
    { id: 'u14', name: 'U14', age: '12–13 yaş', yearsLabel: '2013–2014 doğumlu', years: [2013, 2014],
      note: 'Dostluk maçları', text: 'Logos Basketbol U14 ile dostluk maçında sahaya çıktı.' },
    { id: 'u16', name: 'U16', age: '14–15 yaş', yearsLabel: '2011–2012 doğumlu', years: [2011, 2012],
      note: 'Dostluk maçları', text: 'Logos Basketbol U16 ile dostluk maçında sahaya çıktı.' }
  ],

  /* 12 Eylül 2026 "İleri Basketbol Staff Kadrosu" afişinden — yazımlar doğrulanacak */
  coaches: [
    { name: 'Yiğit Soydaş', title: 'Baş Antrenör', photo: '', bio: '' },
    { name: 'Anıl Çetkin', title: 'Baş Antrenör', photo: '', bio: '' },
    { name: 'Mustafa Ekiz', title: 'Atletik Performans Antrenörü', photo: '', bio: '' },
    { name: 'Egemen Ege', title: 'Yardımcı Antrenör', photo: '', bio: '' },
    { name: 'Selin Karagöz', title: 'Yardımcı Antrenör', photo: '', bio: '' }
  ],

  /* Instagram gönderileri — görsel: assets/instagram/<code>.jpg (küçük: 600/<code>.jpg)
     cat: mac · antrenman · duyuru · etkinlik */
  posts: [
    { code: 'DeWwV1-jeWa', date: '11.10.2026', type: 'photo', cat: 'mac',
      title: 'Denizli Basket ile hazırlık maçları',
      text: 'U10 ve U11 takımlarımız Denizli Basket S.K. ile keyifli hazırlık maçları oynadı. Misafirperverlikleri için Denizli Basket ailesine teşekkür ederiz.' },
    { code: 'DeAFdPFiHqC', date: '02.10.2026', type: 'photo', cat: 'etkinlik',
      title: "TOFAŞ A Takımı Denizli'de öğrencilerimizle",
      text: "TOFAŞ oyuncu ve antrenörleri Denizli'de spor okulu öğrencilerimizle buluştu; hatıra fotoğrafları çekildi, imzalar dağıtıldı.",
      via: '@tofassporkulubu ortak paylaşımı' },
    { code: 'DdMyVmNN4W2', date: '12.09.2026', type: 'poster', cat: 'duyuru',
      title: '2026-2027 sezonuna hazırız',
      text: 'Yeni sezonda sporcularımızı çalıştıracak teknik ekibimiz belli oldu.' },
    { code: 'DdJsbaptWT9', date: '11.09.2026', type: 'video', cat: 'mac',
      title: 'U10 hazırlık maçı',
      text: 'U10 takımımızın Logos Akademi Basketbol ile oynadığı hazırlık maçından anlar.' },
    { code: 'DdFP_n5tVEz', date: '09.09.2026', type: 'photo', cat: 'mac',
      title: 'U12 – Denizli Basket hazırlık maçı',
      text: 'U12 takımımız, Denizli Basket altyapı U12 takımıyla karşılaştı.' },
    { code: 'DdEU4bvtPNy', date: '09.09.2026', type: 'photo', cat: 'etkinlik',
      title: '#80s #basketball',
      text: 'Takımımızdan eğlenceli bir kare.' },
    { code: 'DdEFY7rt9Mb', date: '09.09.2026', type: 'photo', cat: 'mac',
      title: 'Saygın Basketbol U12 ile hazırlık maçı',
      text: 'Kardeş kulübümüz Saygın Basketbol S.K. U12 takımıyla centilmence bir maç oynadık.' },
    { code: 'DdCqJ6cjWk5', date: '08.09.2026', type: 'album', cat: 'mac',
      title: "Logos Basketbol'u ağırladık",
      text: 'Logos Basketbol U16, U14, U11 ve U10 takımlarıyla kulübümüzde dostluk maçları oynadık.' },
    { code: 'DcgZBzMt7gQ', date: '26.08.2026', type: 'video', cat: 'antrenman',
      title: 'U10 çalışıyor',
      text: 'U10 grubumuzun antrenmanından kısa bir video.' },
    { code: 'DcOnRZyNopd', date: '19.08.2026', type: 'video', cat: 'antrenman',
      title: 'U12 ve U11 istasyon antrenmanı',
      text: 'U12 ve U11 gruplarımız hız, çabukluk, kuvvet ve sıçrama istasyonlarında çalıştı.' },
    { code: 'Db_qfR0Bkm6', date: '13.08.2026', type: 'video', cat: 'antrenman',
      title: 'Haftanın son çalışmaları',
      text: 'U16, U14, U12, U11, U10 ve Kids gruplarımızla verimli bir haftayı geride bıraktık.' },
    { code: 'Db-hQRmt1n0', date: '13.08.2026', type: 'poster', cat: 'duyuru',
      title: '2026-2027 sezonunda sahadayız',
      text: 'Yaz boyunca haftada 4 antrenman; disiplinli ve gelişim odaklı eğitim. Kontenjanlar dolmadan yerini al!' }
  ],

  /* Ana sayfa slider'ı — gönderi kodları */
  slider: ['DeAFdPFiHqC', 'DdCqJ6cjWk5', 'Db-hQRmt1n0', 'DdMyVmNN4W2', 'DeWwV1-jeWa'],

  /* Hazırlık maçları — gönderilerden. Skor paylaşılmadığı için gösterilmiyor.
     home: ev sahibi (11.10'da Denizli Basket'in misafiriydik, 08.09'da Logos'u biz ağırladık) */
  matches: [
    { date: '11.10.2026', groups: 'U10 · U11', home: 'Denizli Basket S.K.', away: 'Denizli Tofaş', post: 'DeWwV1-jeWa' },
    { date: '11.09.2026', groups: 'U10', home: 'Denizli Tofaş', away: 'Logos Akademi Basketbol', post: 'DdJsbaptWT9' },
    { date: '09.09.2026', groups: 'U12', home: 'Denizli Tofaş', away: 'Denizli Basket', post: 'DdFP_n5tVEz' },
    { date: '09.09.2026', groups: 'U12', home: 'Denizli Tofaş', away: 'Saygın Basketbol S.K.', post: 'DdEFY7rt9Mb' },
    { date: '08.09.2026', groups: 'U16 · U14 · U11 · U10', home: 'Denizli Tofaş', away: 'Logos Basketbol', post: 'DdCqJ6cjWk5' }
  ],

  /* SSS — cevapların bir kısmı kulüple doğrulanacak (YAPILACAKLAR.md) */
  faq: [
    { q: 'Kaç yaşından itibaren başlayabilir?',
      a: '6 yaşından itibaren. En küçükler Kids (mini basketbol) grubunda başlıyor; 16 yaşa kadar yaşa göre gruplarımız var.' },
    { q: 'Daha önce basketbol oynamamış olması sorun mu?',
      a: 'Hayır. Çocuklar yaşlarına ve seviyelerine göre gruplandırılıyor.' },
    { q: 'Antrenmanlar nerede yapılıyor?',
      a: 'Erbakır Fen Lisesi spor salonunda, Merkezefendi / Denizli.' },
    { q: 'Haftada kaç gün antrenman var?',
      a: 'Yaz döneminde haftada 4 antrenman yapılıyor. Sezon içi program ve grup saatleri için bizi arayın.', tbd: true },
    { q: 'Maçlara çıkıyor muyuz?',
      a: 'Evet; Denizli kulüpleriyle (Denizli Basket, Logos Basketbol, Saygın Basketbol…) düzenli hazırlık ve dostluk maçları oynuyoruz.' },
    { q: 'Ücret ne kadar?',
      a: 'Ücret ve kayıt bilgisi için 0 (540) 244 19 74 numarasını arayabilir ya da WhatsApp’tan yazabilirsiniz.' },
    { q: 'Deneme antrenmanı var mı?',
      a: '', tbd: true }
  ]
};
