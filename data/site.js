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

  /* 12 Eylül 2026 "İleri Basketbol Staff Kadrosu" afişinden — yazımlar doğrulanacak.
     photo: 'assets/staff/<id>.jpg', bio: paragraf metni, social: { instagram, x, linkedin } */
  coaches: [
    { id: 'yigit-soydas', name: 'Yiğit Soydaş', title: 'Baş Antrenör', photo: '', bio: '', social: {} },
    { id: 'anil-cetkin', name: 'Anıl Çetkin', title: 'Baş Antrenör', photo: '', bio: '', social: {} },
    { id: 'mustafa-ekiz', name: 'Mustafa Ekiz', title: 'Atletik Performans Antrenörü', photo: '', bio: '', social: {} },
    { id: 'egemen-ege', name: 'Egemen Ege', title: 'Yardımcı Antrenör', photo: '', bio: '', social: {} },
    { id: 'selin-karagoz', name: 'Selin Karagöz', title: 'Yardımcı Antrenör', photo: '', bio: '', social: {} }
  ],

  /* Instagram gönderileri — görsel: assets/instagram/<code>.jpg (küçük: 600/<code>.jpg)
     cat: mac · antrenman · duyuru · etkinlik · groups: ilgili yaş grupları (takım sayfaları) */
  posts: [
    { code: 'DeWwV1-jeWa', groups: ['u10','u11'], date: '11.10.2026', type: 'photo', cat: 'mac',
      title: 'Denizli Basket ile hazırlık maçları',
      text: 'U10 ve U11 takımlarımız Denizli Basket S.K. ile keyifli hazırlık maçları oynadı. Misafirperverlikleri için Denizli Basket ailesine teşekkür ederiz.' },
    { code: 'DeAFdPFiHqC', date: '02.10.2026', type: 'photo', cat: 'etkinlik',
      title: "TOFAŞ A Takımı Denizli'de öğrencilerimizle",
      text: "TOFAŞ oyuncu ve antrenörleri Denizli'de spor okulu öğrencilerimizle buluştu; hatıra fotoğrafları çekildi, imzalar dağıtıldı.",
      via: '@tofassporkulubu ortak paylaşımı' },
    { code: 'DdMyVmNN4W2', date: '12.09.2026', type: 'poster', cat: 'duyuru',
      title: '2026-2027 sezonuna hazırız',
      text: 'Yeni sezonda sporcularımızı çalıştıracak teknik ekibimiz belli oldu.' },
    { code: 'DdJsbaptWT9', groups: ['u10'], date: '11.09.2026', type: 'video', cat: 'mac',
      title: 'U10 hazırlık maçı',
      text: 'U10 takımımızın Logos Akademi Basketbol ile oynadığı hazırlık maçından anlar.' },
    { code: 'DdFP_n5tVEz', groups: ['u12'], date: '09.09.2026', type: 'photo', cat: 'mac',
      title: 'U12 – Denizli Basket hazırlık maçı',
      text: 'U12 takımımız, Denizli Basket altyapı U12 takımıyla karşılaştı.' },
    { code: 'DdEU4bvtPNy', date: '09.09.2026', type: 'photo', cat: 'etkinlik',
      title: '#80s #basketball',
      text: 'Takımımızdan eğlenceli bir kare.' },
    { code: 'DdEFY7rt9Mb', groups: ['u12'], date: '09.09.2026', type: 'photo', cat: 'mac',
      title: 'Saygın Basketbol U12 ile hazırlık maçı',
      text: 'Kardeş kulübümüz Saygın Basketbol S.K. U12 takımıyla centilmence bir maç oynadık.' },
    { code: 'DdCqJ6cjWk5', groups: ['u16','u14','u11','u10'], date: '08.09.2026', type: 'album', cat: 'mac',
      title: "Logos Basketbol'u ağırladık",
      text: 'Logos Basketbol U16, U14, U11 ve U10 takımlarıyla kulübümüzde dostluk maçları oynadık.' },
    { code: 'DcgZBzMt7gQ', groups: ['u10'], date: '26.08.2026', type: 'video', cat: 'antrenman',
      title: 'U10 çalışıyor',
      text: 'U10 grubumuzun antrenmanından kısa bir video.' },
    { code: 'DcOnRZyNopd', groups: ['u12','u11'], date: '19.08.2026', type: 'video', cat: 'antrenman',
      title: 'U12 ve U11 istasyon antrenmanı',
      text: 'U12 ve U11 gruplarımız hız, çabukluk, kuvvet ve sıçrama istasyonlarında çalıştı.' },
    { code: 'Db_qfR0Bkm6', groups: ['u16','u14','u12','u11','u10','kids'], date: '13.08.2026', type: 'video', cat: 'antrenman',
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
    { id: 'h1', type: 'hazirlik', teams: ['u10','u11'], date: '11.10.2026', groups: 'U10 · U11', home: 'Denizli Basket S.K.', away: 'Denizli Tofaş', post: 'DeWwV1-jeWa' },
    { id: 'h2', type: 'hazirlik', teams: ['u10'], date: '11.09.2026', groups: 'U10', home: 'Denizli Tofaş', away: 'Logos Akademi Basketbol', post: 'DdJsbaptWT9' },
    { id: 'h3', type: 'hazirlik', teams: ['u12'], date: '09.09.2026', groups: 'U12', home: 'Denizli Tofaş', away: 'Denizli Basket', post: 'DdFP_n5tVEz' },
    { id: 'h4', type: 'hazirlik', teams: ['u12'], date: '09.09.2026', groups: 'U12', home: 'Denizli Tofaş', away: 'Saygın Basketbol S.K.', post: 'DdEFY7rt9Mb' },
    { id: 'h5', type: 'hazirlik', teams: ['u16','u14','u11','u10'], date: '08.09.2026', groups: 'U16 · U14 · U11 · U10', home: 'Denizli Tofaş', away: 'Logos Basketbol', post: 'DdCqJ6cjWk5' }
  ],

  /* Takımlar — group: haber/hazırlık maçı eşlemesi için yaş grubu kimliği.
     Kadrolar TBF Denizli sayfasından (19.10.2026); oyuncular için yalnız doğum yılı tutulur. */
  teams: [
    {
      "id": "kids",
      "group": "kids",
      "name": "Kids",
      "full": "Kids · Mini Basketbol",
      "league": "",
      "tbf": "",
      "photo": ""
    },
    {
      "id": "u10",
      "group": "u10",
      "name": "U10",
      "full": "U10",
      "league": "",
      "tbf": "",
      "photo": ""
    },
    {
      "id": "u11",
      "group": "u11",
      "name": "U11",
      "full": "U11",
      "league": "",
      "tbf": "",
      "photo": ""
    },
    {
      "id": "u12",
      "group": "u12",
      "name": "U12",
      "full": "U12",
      "league": "",
      "tbf": "",
      "photo": ""
    },
    {
      "id": "u14",
      "group": "u14",
      "name": "U14",
      "full": "U14 Erkek",
      "league": "Denizli U14 Erkekler",
      "tbf": "https://tbf.org.tr/ligler/22618/takim-detay/272169/genel-bakis",
      "photo": ""
    },
    {
      "id": "u16a",
      "group": "u16",
      "name": "U16 A",
      "full": "U16 Erkek · A Takımı",
      "league": "Denizli U16 Erkekler",
      "tbf": "https://tbf.org.tr/ligler/22620/takim-detay/272162/genel-bakis",
      "photo": ""
    },
    {
      "id": "u16b",
      "group": "u16",
      "name": "U16 B",
      "full": "U16 Erkek · B Takımı",
      "league": "Denizli U16 Erkekler",
      "tbf": "https://tbf.org.tr/ligler/22620/takim-detay/272184/genel-bakis",
      "photo": ""
    }
  ],

  players: [
    {
      "id": "ali-deniz-ilkimen",
      "name": "ALİ DENİZ İLKİMEN",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "arda-turhan",
      "name": "ARDA TURHAN",
      "born": 2013,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "arkin-yarkin",
      "name": "ARKIN YARKIN",
      "born": 2013,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "doruk-guven",
      "name": "DORUK GÜVEN",
      "born": 2013,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "doruk-ozturk",
      "name": "DORUK ÖZTÜRK",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "emir-efe-celer",
      "name": "EMİR EFE ÇELER",
      "born": 2013,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "muammer-ruzgar-caliskan",
      "name": "MUAMMER RÜZGAR ÇALIŞKAN",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "muzaffer-bozdemir",
      "name": "MUZAFFER BOZDEMİR",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "omer-yarici",
      "name": "ÖMER YARICI",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "sarp-guven",
      "name": "SARP GÜVEN",
      "born": 2013,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "suleyman-demir-dokgoz",
      "name": "SÜLEYMAN DEMİR DOKGÖZ",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "tuna-kargi",
      "name": "TUNA KARGI",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "yigit-kaan-oruc",
      "name": "YİĞİT KAAN ORUÇ",
      "born": 2014,
      "team": "u14",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "ahmet-teke",
      "name": "AHMET TEKE",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "ahmet-efe-yildiran",
      "name": "AHMET EFE YILDIRAN",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "ahmet-eren-tenekeci",
      "name": "AHMET EREN TENEKECİ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "asim-yigit-gurler",
      "name": "ASIM YİĞİT GÜRLER",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "egemen-erten",
      "name": "EGEMEN ERTEN",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "emir-cansuz",
      "name": "EMİR CANSUZ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "ismail-aras-degirmenci",
      "name": "İSMAİL ARAS DEĞİRMENCİ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "kayra-demir-ozdemir",
      "name": "KAYRA DEMİR ÖZDEMİR",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "mehmet-cinar-kaya",
      "name": "MEHMET ÇINAR KAYA",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "mert-ercan",
      "name": "MERT ERCAN",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "mustafa-eren-yagci",
      "name": "MUSTAFA EREN YAĞCI",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "mustafa-mert-oneri",
      "name": "MUSTAFA MERT ÖNERİ",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "mustafa-yigit-goven",
      "name": "MUSTAFA YİĞİT GÖVEN",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "omer-mete-gok",
      "name": "ÖMER METE GÖK",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "resat-cinar-hilinc",
      "name": "REŞAT ÇINAR HILINÇ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "salih-mert-yavas",
      "name": "SALİH MERT YAVAŞ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "talha-efe-celik",
      "name": "TALHA EFE ÇELİK",
      "born": 2011,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "tuncay-ege-bilgic",
      "name": "TUNCAY EGE BİLGİÇ",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "umut-eren-ozbudak",
      "name": "UMUT EREN ÖZBUDAK",
      "born": 2012,
      "team": "u16a",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    },
    {
      "id": "aras-koknar",
      "name": "ARAS KÖKNAR",
      "born": 2012,
      "team": "u16b",
      "number": "",
      "position": "",
      "photo": "",
      "bio": ""
    }
  ],

  /* Antrenman ve maç salonları */
  venues: [
    {
      "id": "erbakir",
      "name": "Erbakır Fen Lisesi Spor Salonu",
      "use": "Antrenman salonu",
      "address": "Şemikler Mah. 3121 Sk. No: 24A, Merkezefendi / Denizli",
      "lat": 37.80414,
      "lng": 29.05163,
      "maps": "https://www.google.com/maps?q=37.80414,29.05163&z=16&output=embed",
      "dir": "https://www.google.com/maps/dir/?api=1&destination=37.80414,29.05163",
      "capacity": "",
      "photo": ""
    },
    {
      "id": "engelsiz",
      "name": "Denizli Büyükşehir Belediyesi Engelsiz Yaşam Merkezi Spor Salonu",
      "use": "Lig maçları (TBF Denizli U14 ve U16 Erkekler)",
      "address": "Servergazi Mah. 409 Sk., Merkezefendi / Denizli",
      "lat": null,
      "lng": null,
      "maps": "https://www.google.com/maps?q=Denizli+B%C3%BCy%C3%BCk%C5%9Fehir+Belediyesi+Engelsiz+Ya%C5%9Fam+Merkezi+Spor+Salonu&z=16&output=embed",
      "dir": "https://www.google.com/maps/dir/?api=1&destination=Denizli+B%C3%BCy%C3%BCk%C5%9Fehir+Belediyesi+Engelsiz+Ya%C5%9Fam+Merkezi+Spor+Salonu",
      "capacity": "300 kişi",
      "photo": ""
    }
  ],

  /* Lig maçları — TBF Denizli fikstürü (Excel, 19.10.2026). Bizim taraf {team}, rakip {name, logo}.
     score boşsa maç oynanmadı. */
  league: [
    {
      "id": "ami579",
      "no": "AMI579",
      "comp": "Denizli U16 Erkekler",
      "week": "1. Hafta",
      "date": "23.10.2026",
      "time": "18:30",
      "home": {
        "team": "u16a"
      },
      "away": {
        "name": "Servergazi Basketbol (A)",
        "logo": "servergazi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami580",
      "no": "AMI580",
      "comp": "Denizli U16 Erkekler",
      "week": "1. Hafta",
      "date": "23.10.2026",
      "time": "20:00",
      "home": {
        "team": "u16b"
      },
      "away": {
        "name": "Pamukkale Akademi",
        "logo": "pamukkale-akademi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto986",
      "no": "BTO986",
      "comp": "Denizli U14 Erkekler",
      "week": "1. Hafta",
      "date": "26.10.2026",
      "time": "20:00",
      "home": {
        "name": "Saygın Spor (A)",
        "logo": ""
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto991",
      "no": "BTO991",
      "comp": "Denizli U14 Erkekler",
      "week": "2. Hafta",
      "date": "31.10.2026",
      "time": "14:00",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Servergazi Basketbol (A)",
        "logo": "servergazi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami585",
      "no": "AMI585",
      "comp": "Denizli U16 Erkekler",
      "week": "2. Hafta",
      "date": "03.11.2026",
      "time": "18:30",
      "home": {
        "name": "Servergazi Basketbol (A)",
        "logo": "servergazi"
      },
      "away": {
        "team": "u16b"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami586",
      "no": "AMI586",
      "comp": "Denizli U16 Erkekler",
      "week": "2. Hafta",
      "date": "03.11.2026",
      "time": "20:00",
      "home": {
        "name": "Servergazi Basketbol (B)",
        "logo": "servergazi"
      },
      "away": {
        "team": "u16a"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami588",
      "no": "AMI588",
      "comp": "Denizli U16 Erkekler",
      "week": "3. Hafta",
      "date": "06.11.2026",
      "time": "20:00",
      "home": {
        "team": "u16a"
      },
      "away": {
        "name": "Basket Denizli Spor",
        "logo": "basket-denizli"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1000",
      "no": "BTO1000",
      "comp": "Denizli U14 Erkekler",
      "week": "3. Hafta",
      "date": "09.11.2026",
      "time": "20:00",
      "home": {
        "name": "Servergazi Basketbol (B)",
        "logo": "servergazi"
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami589",
      "no": "AMI589",
      "comp": "Denizli U16 Erkekler",
      "week": "3. Hafta",
      "date": "10.11.2026",
      "time": "18:30",
      "home": {
        "team": "u16b"
      },
      "away": {
        "name": "Servergazi Basketbol (B)",
        "logo": "servergazi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1008",
      "no": "BTO1008",
      "comp": "Denizli U14 Erkekler",
      "week": "5. Hafta",
      "date": "12.11.2026",
      "time": "20:00",
      "home": {
        "name": "Çamlık Spor",
        "logo": "camlik"
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami592",
      "no": "AMI592",
      "comp": "Denizli U16 Erkekler",
      "week": "4. Hafta",
      "date": "13.11.2026",
      "time": "20:00",
      "home": {
        "name": "Basket Denizli Spor",
        "logo": "basket-denizli"
      },
      "away": {
        "team": "u16b"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1002",
      "no": "BTO1002",
      "comp": "Denizli U14 Erkekler",
      "week": "4. Hafta",
      "date": "14.11.2026",
      "time": "12:00",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Basket Denizli Spor",
        "logo": "basket-denizli"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami593",
      "no": "AMI593",
      "comp": "Denizli U16 Erkekler",
      "week": "4. Hafta",
      "date": "24.11.2026",
      "time": "18:30",
      "home": {
        "name": "Çamlık Spor",
        "logo": "camlik"
      },
      "away": {
        "team": "u16a"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1013",
      "no": "BTO1013",
      "comp": "Denizli U14 Erkekler",
      "week": "6. Hafta",
      "date": "28.11.2026",
      "time": "11:00",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Denizli Basket Akademi Spor",
        "logo": "denizli-basket-akademi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami597",
      "no": "AMI597",
      "comp": "Denizli U16 Erkekler",
      "week": "5. Hafta",
      "date": "04.12.2026",
      "time": "18:30",
      "home": {
        "team": "u16a"
      },
      "away": {
        "name": "Denizli Basket Akademi Spor",
        "logo": "denizli-basket-akademi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami598",
      "no": "AMI598",
      "comp": "Denizli U16 Erkekler",
      "week": "5. Hafta",
      "date": "04.12.2026",
      "time": "20:00",
      "home": {
        "team": "u16b"
      },
      "away": {
        "name": "Çamlık Spor",
        "logo": "camlik"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1025",
      "no": "BTO1025",
      "comp": "Denizli U14 Erkekler",
      "week": "8. Hafta",
      "date": "05.12.2026",
      "time": "11:00",
      "home": {
        "name": "Denizli Yıldızlar",
        "logo": ""
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami607",
      "no": "AMI607",
      "comp": "Denizli U16 Erkekler",
      "week": "7. Hafta",
      "date": "11.12.2026",
      "time": "20:00",
      "home": {
        "team": "u16b"
      },
      "away": {
        "team": "u16a"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami604",
      "no": "AMI604",
      "comp": "Denizli U16 Erkekler",
      "week": "6. Hafta",
      "date": "13.12.2026",
      "time": "14:00",
      "home": {
        "name": "Denizli Basket Akademi Spor",
        "logo": "denizli-basket-akademi"
      },
      "away": {
        "team": "u16b"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1034",
      "no": "BTO1034",
      "comp": "Denizli U14 Erkekler",
      "week": "9. Hafta",
      "date": "14.12.2026",
      "time": "20:00",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Kuzey Akademi Spor",
        "logo": "kuzey-akademi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami615",
      "no": "AMI615",
      "comp": "Denizli U16 Erkekler",
      "week": "8. Hafta",
      "date": "20.12.2026",
      "time": "15:30",
      "home": {
        "team": "u16a"
      },
      "away": {
        "name": "Logos Akademi Spor",
        "logo": "logos-akademi"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1038",
      "no": "BTO1038",
      "comp": "Denizli U14 Erkekler",
      "week": "10. Hafta",
      "date": "21.12.2026",
      "time": "20:00",
      "home": {
        "name": "Logos Akademi Spor",
        "logo": "logos-akademi"
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami617",
      "no": "AMI617",
      "comp": "Denizli U16 Erkekler",
      "week": "9. Hafta",
      "date": "22.12.2026",
      "time": "18:30",
      "home": {
        "name": "Logos Akademi Spor",
        "logo": "logos-akademi"
      },
      "away": {
        "team": "u16b"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami618",
      "no": "AMI618",
      "comp": "Denizli U16 Erkekler",
      "week": "9. Hafta",
      "date": "22.12.2026",
      "time": "20:00",
      "home": {
        "name": "Nova Atletik Spor Kulübü (A)",
        "logo": "nova-atletik"
      },
      "away": {
        "team": "u16a"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1046",
      "no": "BTO1046",
      "comp": "Denizli U14 Erkekler",
      "week": "11. Hafta",
      "date": "26.12.2026",
      "time": "15:30",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Nova Atletik Spor Kulübü (A)",
        "logo": "nova-atletik"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1051",
      "no": "BTO1051",
      "comp": "Denizli U14 Erkekler",
      "week": "12. Hafta",
      "date": "02.01.2027",
      "time": "14:00",
      "home": {
        "name": "Pamukkale Akademi",
        "logo": "pamukkale-akademi"
      },
      "away": {
        "team": "u14"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "bto1058",
      "no": "BTO1058",
      "comp": "Denizli U14 Erkekler",
      "week": "13. Hafta",
      "date": "07.01.2027",
      "time": "20:00",
      "home": {
        "team": "u14"
      },
      "away": {
        "name": "Sarayköy Gençlik ve Spor İlçe Müdürlüğü",
        "logo": "saraykoy"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami628",
      "no": "AMI628",
      "comp": "Denizli U16 Erkekler",
      "week": "11. Hafta",
      "date": "10.01.2027",
      "time": "12:30",
      "home": {
        "name": "Nova Atletik Spor Kulübü (B)",
        "logo": "nova-atletik"
      },
      "away": {
        "team": "u16b"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami629",
      "no": "AMI629",
      "comp": "Denizli U16 Erkekler",
      "week": "11. Hafta",
      "date": "10.01.2027",
      "time": "14:00",
      "home": {
        "name": "Pamukkale Akademi",
        "logo": "pamukkale-akademi"
      },
      "away": {
        "team": "u16a"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami625",
      "no": "AMI625",
      "comp": "Denizli U16 Erkekler",
      "week": "10. Hafta",
      "date": "20.01.2027",
      "time": "18:30",
      "home": {
        "team": "u16a"
      },
      "away": {
        "name": "Nova Atletik Spor Kulübü (B)",
        "logo": "nova-atletik"
      },
      "score": "",
      "venue": "engelsiz"
    },
    {
      "id": "ami626",
      "no": "AMI626",
      "comp": "Denizli U16 Erkekler",
      "week": "10. Hafta",
      "date": "20.01.2027",
      "time": "20:00",
      "home": {
        "team": "u16b"
      },
      "away": {
        "name": "Nova Atletik Spor Kulübü (A)",
        "logo": "nova-atletik"
      },
      "score": "",
      "venue": "engelsiz"
    }
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
