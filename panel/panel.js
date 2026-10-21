/* Yönetim paneli — TOFAŞ Basketbol Okulları · DİBA Denizli
   Veriler Supabase'deki web_* tablolarında durur; site bunları okur.
   Giriş, DİBA mobil uygulamasındaki yönetici hesabıyla (telefon + şifre) yapılır.
   Yazma izni Supabase güvenlik kurallarında (RLS): yalnız yönetici ekler/düzenler/siler. */

(function () {
  'use strict';

  var CFG = window.SUPABASE_CONFIG;
  var sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, storageKey: 'diba-web-panel' } });
  var BUCKET = 'web-media';
  var PHONE_DOMAIN = 'tel.kulup.app';   // mobil uygulamadaki src/lib/phone.ts ile aynı

  /* ---------------------------------------------------------------- yardımcı */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  function slugify(s) {
    return String(s || '').toLocaleLowerCase('tr-TR')
      .replace(/[çğıöşüâîû]/g, function (c) { return { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' }[c]; })
      .normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'kayit';
  }
  function normalizePhone(input) {
    var d = String(input || '').replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('90') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return /^5\d{9}$/.test(d) ? d : null;
  }
  var DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  function trDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    if (!m) return '';
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return m[3] + '.' + m[2] + '.' + m[1] + ' ' + DAYS[d.getDay()];
  }
  function hhmm(t) { return t ? String(t).slice(0, 5) : ''; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /** Sitedeki göreli görsel yolları panelden önizlemek için */
  function mediaSrc(u) { return !u ? '' : /^(https?:|data:|\/)/.test(u) ? u : '../' + u; }

  var toastTimer;
  function toast(msg, isErr) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('is-err', !!isErr);
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, isErr ? 5000 : 2600);
  }
  function errText(e) {
    var m = (e && (e.message || e.error_description)) || String(e);
    if (/Invalid login credentials/i.test(m)) return 'Telefon ya da şifre hatalı.';
    if (/row-level security|permission denied/i.test(m)) return 'Bu işlem için yönetici yetkisi gerekiyor.';
    if (/duplicate key/i.test(m)) return 'Bu kimlikte bir kayıt zaten var.';
    if (/violates foreign key/i.test(m)) return 'Bu kayıt başka kayıtlarda kullanılıyor.';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.';
    return m;
  }

  /* ---------------------------------------------------- ortak listeler (seçim) */

  var LOOK = { teams: [], opponents: [], venues: [] };
  function loadLookups() {
    return Promise.all([
      sb.from('web_teams').select('id,name,full_name,group_code,sort').order('sort'),
      sb.from('web_opponents').select('id,name,logo_url').order('name'),
      sb.from('web_venues').select('id,name,short_name').order('sort')
    ]).then(function (r) {
      LOOK.teams = r[0].data || []; LOOK.opponents = r[1].data || []; LOOK.venues = r[2].data || [];
    });
  }
  function teamName(id) { var t = LOOK.teams.filter(function (x) { return x.id === id; })[0]; return t ? t.name : (id || ''); }
  function oppName(id) { var t = LOOK.opponents.filter(function (x) { return x.id === id; })[0]; return t ? t.name : ''; }
  function venueName(id) { var t = LOOK.venues.filter(function (x) { return x.id === id; })[0]; return t ? (t.short_name || t.name) : ''; }
  function groupCodes() {
    var seen = {}, out = [];
    LOOK.teams.forEach(function (t) { if (!seen[t.group_code]) { seen[t.group_code] = 1; out.push([t.group_code, t.group_code.toUpperCase() === 'KIDS' ? 'Kids' : t.group_code.toUpperCase()]); } });
    return out;
  }
  var STATUS = [['scheduled', 'Planlandı'], ['completed', 'Oynandı'], ['postponed', 'Ertelendi'], ['cancelled', 'İptal']];
  var POST_TYPE = [['photo', 'Fotoğraf'], ['album', 'Albüm'], ['video', 'Video'], ['poster', 'Afiş / Duyuru']];
  var POST_CAT = [['mac', 'Maç'], ['antrenman', 'Antrenman'], ['duyuru', 'Duyuru'], ['etkinlik', 'Etkinlik']];

  /* --------------------------------------------------------- bölüm tanımları */
  // fields: [k, etiket, tür, seçenekler/ayar] — dizi içinde dizi aynı satıra dizer

  var ENT = {
    matches: {
      title: 'Maçlar', one: 'Maç', table: 'web_matches', idMode: 'auto',
      sub: 'Fikstür, saat, salon ve skorlar. Skor girince maç "Oynandı" olur.',
      order: [['match_date', true], ['match_time', true]],
      filters: [{ k: 'team_id', label: 'Tüm takımlar', opts: function () { return LOOK.teams.map(function (t) { return [t.id, t.name]; }); } }],
      search: function (r) { return [teamName(r.team_id), oppName(r.opponent_id), r.opponent_name, r.code, r.week].join(' '); },
      cols: [
        ['Tarih', function (r) { return '<b>' + esc(trDate(r.match_date)) + '</b>'; }],
        ['Saat', function (r) { return esc(hhmm(r.match_time) || '—'); }],
        ['Takım', function (r) { return '<span class="pill">' + esc(teamName(r.team_id)) + '</span>'; }],
        ['Rakip', function (r) {
          var n = r.opponent_team_id ? 'DİBA ' + teamName(r.opponent_team_id) : (oppName(r.opponent_id) || r.opponent_name || '—');
          return esc(n) + ' <span class="pill">' + (r.is_home ? 'İç saha' : 'Deplasman') + '</span>';
        }],
        ['Hafta', function (r) { return esc(r.week || ''); }],
        ['Skor', function (r) { return r.our_score != null && r.their_score != null ? '<span class="score">' + r.our_score + ' – ' + r.their_score + '</span>' : '—'; }],
        ['Durum', function (r) { return statusPill(r); }]
      ],
      fields: [
        ['team_id', 'Takımımız', 'select', { opts: function () { return LOOK.teams.map(function (t) { return [t.id, t.full_name]; }); }, req: true }],
        [['match_date', 'Tarih', 'date', { req: true }], ['match_time', 'Saat', 'time']],
        ['opponent_id', 'Rakip kulüp', 'select', { opts: function () { return LOOK.opponents.map(function (o) { return [o.id, o.name]; }); }, empty: '— Listeden seçin —', hint: 'Listede yoksa önce "Rakipler" bölümünden ekleyin ya da aşağıya adını yazın.' }],
        [['opponent_name', 'Rakip adı (listede yoksa)', 'text'], ['opponent_team_id', 'Kulüp içi maç: rakip takımımız', 'select', { opts: function () { return LOOK.teams.map(function (t) { return [t.id, t.name]; }); }, empty: '—' }]],
        ['is_home', 'İç saha maçı (biz ev sahibiyiz)', 'bool'],
        [['competition', 'Organizasyon', 'text', { list: ['Denizli U14 Erkekler', 'Denizli U16 Erkekler', 'Hazırlık maçı', 'Turnuva'] }], ['week', 'Hafta', 'text', { ph: '1. Hafta' }]],
        [['venue_id', 'Salon', 'select', { opts: function () { return LOOK.venues.map(function (v) { return [v.id, v.name]; }); }, empty: '—' }], ['code', 'TBF maç no', 'text', { ph: 'BTO986' }]],
        [['our_score', 'Bizim skor', 'number'], ['their_score', 'Rakip skor', 'number'], ['status', 'Durum', 'select', { opts: function () { return STATUS; } }]],
        ['notes', 'Not', 'textarea']
      ],
      defaults: function () { return { is_home: true, status: 'scheduled', match_date: today(), venue_id: 'engelsiz' }; },
      beforeSave: function (d) {
        if (!d.opponent_id && !d.opponent_team_id && !d.opponent_name) throw new Error('Rakip seçin ya da rakibin adını yazın.');
        if ((d.our_score == null) !== (d.their_score == null)) throw new Error('Skoru iki taraf için de girin.');
        if (d.our_score != null && d.status === 'scheduled') d.status = 'completed';
        return d;
      }
    },

    teams: {
      title: 'Takımlar', one: 'Takım', table: 'web_teams', idMode: 'manual',
      sub: 'Takım menüsündeki yaş grupları, takım sayfaları ve ön kayıt formundaki grup önerisi.',
      order: [['sort', true]],
      search: function (r) { return [r.name, r.full_name, r.league].join(' '); },
      cols: [
        ['', function (r) { return r.photo_url ? '<img class="thumb" src="' + esc(mediaSrc(r.photo_url)) + '" alt="">' : '<span class="thumb"></span>'; }],
        ['Takım', function (r) { return '<b>' + esc(r.name) + '</b> · ' + esc(r.full_name); }],
        ['Doğum yılı', function (r) { return esc(r.years_label || ''); }],
        ['Lig', function (r) { return esc(r.league || '—'); }],
        ['Sıra', function (r) { return r.sort; }],
        ['Durum', function (r) { return r.is_active ? '<span class="pill pill--ok">Yayında</span>' : '<span class="pill pill--off">Gizli</span>'; }]
      ],
      fields: [
        [['name', 'Kısa ad (menüde)', 'text', { req: true, ph: 'U14' }], ['id', 'Adres kimliği', 'text', { req: true, ph: 'u14', hint: 'Yalnız küçük harf, rakam ve tire. Oluşturduktan sonra değişmez.', createOnly: true }]],
        ['full_name', 'Sayfa başlığı', 'text', { req: true, ph: 'U14 Erkek' }],
        [['group_code', 'Yaş grubu kodu', 'text', { req: true, ph: 'u14', hint: 'U16 A ve U16 B gibi aynı yaştaki takımlarda aynı kod ("u16"). Haberler bu kodla eşleşir.' }], ['sort', 'Menü sırası', 'number']],
        [['years_label', 'Doğum yılı yazısı', 'text', { ph: '2013–2014 doğumlu' }], ['age_label', 'Yaş yazısı', 'text', { ph: '12–13 yaş' }]],
        ['birth_years', 'Doğum yılları (ön kayıt önerisi)', 'years', { hint: 'Virgülle: 2013, 2014' }],
        [['league', 'Lig', 'text', { ph: 'Denizli U14 Erkekler' }], ['tbf_url', 'TBF takım sayfası', 'text', { ph: 'https://tbf.org.tr/...' }]],
        ['note', 'Kısa not', 'text'],
        ['photo_url', 'Takım fotoğrafı', 'image'],
        ['is_active', 'Sitede göster', 'bool']
      ],
      defaults: function () { return { is_active: true, sort: (LOOK.teams.length + 1) * 10 }; },
      deleteWarn: 'Bu takımın TÜM MAÇLARI da silinir, oyuncuları takımsız kalır. Takımı yalnız gizlemek için "Sitede göster" işaretini kaldırabilirsiniz.'
    },

    players: {
      title: 'Oyuncular', one: 'Oyuncu', table: 'web_players', idMode: 'slug', slugFrom: 'name',
      sub: 'Kadro sayfaları ve oyuncu profilleri. Çocuk sporcular için yalnız doğum yılı tutulur.',
      order: [['team_id', true], ['name', true]],
      filters: [{ k: 'team_id', label: 'Tüm takımlar', opts: function () { return LOOK.teams.map(function (t) { return [t.id, t.name]; }); } }],
      search: function (r) { return [r.name, teamName(r.team_id), r.position].join(' '); },
      cols: [
        ['', function (r) { return r.photo_url ? '<img class="thumb" src="' + esc(mediaSrc(r.photo_url)) + '" alt="">' : '<span class="thumb"></span>'; }],
        ['Ad soyad', function (r) { return '<b>' + esc(r.name) + '</b>'; }],
        ['Takım', function (r) { return '<span class="pill">' + esc(teamName(r.team_id) || '—') + '</span>'; }],
        ['Doğum yılı', function (r) { return esc(r.born || ''); }],
        ['No', function (r) { return r.number == null ? '—' : r.number; }],
        ['Durum', function (r) { return r.is_active ? '<span class="pill pill--ok">Yayında</span>' : '<span class="pill pill--off">Gizli</span>'; }]
      ],
      fields: [
        ['name', 'Ad soyad', 'text', { req: true }],
        [['team_id', 'Takım', 'select', { opts: function () { return LOOK.teams.map(function (t) { return [t.id, t.full_name]; }); }, req: true }], ['born', 'Doğum yılı', 'number', { req: true }]],
        [['number', 'Forma no', 'number'], ['position', 'Pozisyon', 'text', { list: ['Oyun kurucu', 'Şutör', 'Kanat', 'Uzun forvet', 'Pivot'] }]],
        ['photo_url', 'Fotoğraf', 'image', { hint: 'Fotoğraf eklemeden önce velinin yazılı onayını alın (KVKK).' }],
        ['bio', 'Biyografi', 'textarea'],
        ['is_active', 'Sitede göster', 'bool']
      ],
      defaults: function () { return { is_active: true, born: new Date().getFullYear() - 12 }; }
    },

    coaches: {
      title: 'Antrenörler', one: 'Antrenör', table: 'web_coaches', idMode: 'slug', slugFrom: 'name',
      sub: 'Antrenörlerimiz sayfası ve antrenör profilleri.',
      order: [['sort', true]],
      search: function (r) { return [r.name, r.title].join(' '); },
      cols: [
        ['', function (r) { return r.photo_url ? '<img class="thumb" src="' + esc(mediaSrc(r.photo_url)) + '" alt="">' : '<span class="thumb"></span>'; }],
        ['Ad soyad', function (r) { return '<b>' + esc(r.name) + '</b>'; }],
        ['Görev', function (r) { return esc(r.title); }],
        ['Sıra', function (r) { return r.sort; }],
        ['Durum', function (r) { return r.is_active ? '<span class="pill pill--ok">Yayında</span>' : '<span class="pill pill--off">Gizli</span>'; }]
      ],
      fields: [
        [['name', 'Ad soyad', 'text', { req: true }], ['title', 'Görev', 'text', { req: true, list: ['Baş Antrenör', 'Yardımcı Antrenör', 'Atletik Performans Antrenörü', 'Altyapı Koordinatörü'] }]],
        ['photo_url', 'Fotoğraf', 'image'],
        ['bio', 'Biyografi', 'textarea', { hint: 'Paragraflar arasında boş satır bırakın.' }],
        ['social', 'Sosyal medya', 'social'],
        [['sort', 'Sıra', 'number'], ['is_active', 'Sitede göster', 'bool']]
      ],
      defaults: function () { return { is_active: true, sort: 100, social: {} }; }
    },

    posts: {
      title: 'Haberler', one: 'Haber', table: 'web_posts', idMode: 'auto',
      sub: 'Ana sayfa slider\'ı son 7 haberi gösterir. Takım seçilen haberler o takımın sayfasında da görünür.',
      order: [['post_date', false]],
      filters: [{ k: 'cat', label: 'Tüm kategoriler', opts: function () { return POST_CAT; } }],
      search: function (r) { return [r.title, r.body].join(' '); },
      cols: [
        ['', function (r) { return r.image_url ? '<img class="thumb" src="' + esc(mediaSrc(r.image_url)) + '" alt="">' : '<span class="thumb"></span>'; }],
        ['Tarih', function (r) { return esc(trDate(r.post_date)); }],
        ['Başlık', function (r) { return '<b>' + esc(r.title) + '</b>'; }],
        ['Kategori', function (r) { var c = POST_CAT.filter(function (x) { return x[0] === r.cat; })[0]; return '<span class="pill">' + esc(c ? c[1] : r.cat) + '</span>'; }],
        ['Durum', function (r) { return r.is_published ? '<span class="pill pill--ok">Yayında</span>' : '<span class="pill pill--off">Taslak</span>'; }]
      ],
      fields: [
        ['title', 'Başlık', 'text', { req: true }],
        [['post_date', 'Tarih', 'date', { req: true }], ['cat', 'Kategori', 'select', { opts: function () { return POST_CAT; } }], ['type', 'Tür', 'select', { opts: function () { return POST_TYPE; } }]],
        ['body', 'Metin', 'textarea'],
        ['image_url', 'Görsel', 'image'],
        ['link_url', 'Bağlantı (Instagram gönderisi vb.)', 'text', { ph: 'https://www.instagram.com/p/...' }],
        ['groups', 'İlgili takımlar', 'groups'],
        ['is_published', 'Yayında', 'bool']
      ],
      defaults: function () { return { post_date: today(), cat: 'duyuru', type: 'photo', is_published: true, groups: [] }; }
    },

    opponents: {
      title: 'Rakipler', one: 'Rakip kulüp', table: 'web_opponents', idMode: 'slug', slugFrom: 'name',
      sub: 'Maçlarda seçilen rakip kulüpler ve logoları.',
      order: [['name', true]],
      search: function (r) { return r.name; },
      cols: [
        ['', function (r) { return r.logo_url ? '<img class="thumb" style="object-fit:contain" src="' + esc(mediaSrc(r.logo_url)) + '" alt="">' : '<span class="thumb"></span>'; }],
        ['Kulüp', function (r) { return '<b>' + esc(r.name) + '</b>'; }]
      ],
      fields: [
        ['name', 'Kulüp adı', 'text', { req: true, hint: 'A/B takımları ayrı kayıt: "Servergazi Basketbol (A)".' }],
        ['logo_url', 'Logo', 'image']
      ],
      defaults: function () { return {}; },
      deleteWarn: 'Bu rakibin seçili olduğu maçlarda rakip boş kalır.'
    },

    venues: {
      title: 'Salonlar', one: 'Salon', table: 'web_venues', idMode: 'slug', slugFrom: 'short_name',
      sub: '"Antrenman Salonlarımız" sayfası ve maç salonları.',
      order: [['sort', true]],
      search: function (r) { return [r.name, r.address].join(' '); },
      cols: [
        ['Salon', function (r) { return '<b>' + esc(r.name) + '</b>'; }],
        ['Adres', function (r) { return esc(r.address || ''); }],
        ['Salonlar sayfası', function (r) { return r.listed ? '<span class="pill pill--ok">Görünür</span>' : '<span class="pill">Yalnız maçlarda</span>'; }]
      ],
      fields: [
        ['name', 'Salon adı', 'text', { req: true }],
        [['short_name', 'Kısa ad', 'text', { req: true, ph: 'Erbakır Fen Lisesi' }], ['capacity', 'Kapasite', 'text', { ph: '300 kişi' }]],
        ['use_text', 'Kullanım', 'text', { ph: 'Antrenman salonu' }],
        ['address', 'Adres', 'text'],
        ['maps_embed', 'Google Haritası (embed adresi)', 'text', { ph: 'https://www.google.com/maps?q=37.80,29.05&z=16&output=embed', hint: 'Koordinat ya da salon adıyla: https://www.google.com/maps?q=SALON+ADI&z=16&output=embed' }],
        ['directions_url', 'Yol tarifi bağlantısı', 'text', { ph: 'https://www.google.com/maps/dir/?api=1&destination=...' }],
        ['photo_url', 'Salon fotoğrafı', 'image'],
        [['listed', '"Antrenman Salonlarımız" sayfasında göster', 'bool'], ['sort', 'Sıra', 'number']]
      ],
      defaults: function () { return { listed: true, sort: 100 }; },
      deleteWarn: 'Bu salonun seçili olduğu maçlarda salon boş kalır.'
    },

    faq: {
      title: 'SSS', one: 'Soru', table: 'web_faq', idMode: 'auto',
      sub: 'Ön Kayıt sayfasındaki sıkça sorulan sorular.',
      order: [['sort', true]],
      search: function (r) { return [r.question, r.answer].join(' '); },
      cols: [
        ['Soru', function (r) { return '<b>' + esc(r.question) + '</b>'; }],
        ['Cevap', function (r) { return esc((r.answer || '—').slice(0, 90)); }],
        ['Sıra', function (r) { return r.sort; }]
      ],
      fields: [
        ['question', 'Soru', 'text', { req: true }],
        ['answer', 'Cevap', 'textarea', { hint: 'Boş bırakılırsa "bizi arayın" yazar.' }],
        [['sort', 'Sıra', 'number'], ['is_active', 'Sitede göster', 'bool']]
      ],
      defaults: function () { return { is_active: true, sort: 100 }; }
    }
  };

  function statusPill(r) {
    var past = r.match_date < today();
    if (r.status === 'cancelled') return '<span class="pill pill--off">İptal</span>';
    if (r.status === 'postponed') return '<span class="pill pill--warn">Ertelendi</span>';
    if (r.our_score != null) return '<span class="pill pill--ok">Oynandı</span>';
    if (past) return '<span class="pill pill--warn">Skor bekliyor</span>';
    return '<span class="pill">Planlandı</span>';
  }

  /* ------------------------------------------------------------ menü / görünüm */

  var NAV = [
    ['ozet', 'Özet'],
    ['sep', 'Fikstür ve takımlar'], ['matches'], ['teams'], ['players'], ['opponents'],
    ['sep', 'Kulüp'], ['coaches'], ['venues'],
    ['sep', 'Medya ve sayfalar'], ['posts'], ['faq'], ['settings', 'Okul bilgileri']
  ];
  var current = 'ozet';
  var ROWS = [];          // geçerli bölümün kayıtları
  var COUNTS = {};

  function buildNav() {
    var nav = $('#sideNav');
    nav.innerHTML = NAV.map(function (n) {
      if (n[0] === 'sep') return '<div class="side__sep">' + esc(n[1]) + '</div>';
      var label = n[1] || ENT[n[0]].title;
      return '<button type="button" data-view="' + n[0] + '"' + (n[0] === current ? ' aria-current="page"' : '') + '>' + esc(label) +
        (COUNTS[n[0]] != null ? '<small>' + COUNTS[n[0]] + '</small>' : '') + '</button>';
    }).join('');
  }
  function go(view) {
    current = view;
    location.hash = view;
    buildNav();
    $('#side').classList.remove('is-open');
    if (view === 'ozet') return showSummary();
    if (view === 'settings') return showSettings();
    showList(view);
  }

  /* ----------------------------------------------------------------- özet */

  function showSummary() {
    $('#viewTitle').textContent = 'Özet';
    $('#viewSub').textContent = 'Skor bekleyen ve yaklaşan maçlar. Bir maça tıklayıp düzenleyebilirsiniz.';
    var v = $('#view');
    v.innerHTML = '<p class="hint">Yükleniyor…</p>';
    Promise.all([
      sb.from('web_matches').select('*').order('match_date').order('match_time'),
      sb.from('web_players').select('id', { count: 'exact', head: true }),
      sb.from('web_posts').select('id', { count: 'exact', head: true })
    ]).then(function (r) {
      if (r[0].error) throw r[0].error;
      var ms = r[0].data, t = today();
      var waiting = ms.filter(function (m) { return m.match_date < t && m.our_score == null && m.status === 'scheduled'; });
      var next = ms.filter(function (m) { return m.match_date >= t && m.status !== 'cancelled'; }).slice(0, 8);
      v.innerHTML =
        '<div class="cards">' +
        kpi(ms.length, 'Lig / maç') + kpi(ms.filter(function (m) { return m.our_score != null; }).length, 'Oynanan') +
        kpi(r[1].count || 0, 'Oyuncu') + kpi(r[2].count || 0, 'Haber') +
        '</div>' +
        '<h2 class="sec__title" style="font-size:19px;margin:6px 0 10px">Skor bekleyen maçlar</h2>' +
        (waiting.length ? '' : '<p class="hint" style="margin-bottom:18px">Skoru girilmemiş geçmiş maç yok.</p>') +
        '<div id="w"></div>' +
        '<h2 class="sec__title" style="font-size:19px;margin:22px 0 10px">Yaklaşan maçlar</h2><div id="n"></div>';
      ROWS = ms;
      if (waiting.length) $('#w', v).appendChild(table(ENT.matches, waiting, 'matches'));
      $('#n', v).appendChild(table(ENT.matches, next, 'matches'));
    }).catch(function (e) { v.innerHTML = '<p class="hint">' + esc(errText(e)) + '</p>'; });
  }
  function kpi(n, label) { return '<div class="kpi"><b>' + n + '</b><span>' + esc(label) + '</span></div>'; }

  /* ----------------------------------------------------------------- liste */

  var filterState = {};
  function showList(key) {
    var E = ENT[key];
    $('#viewTitle').textContent = E.title;
    $('#viewSub').textContent = E.sub || '';
    var v = $('#view');
    v.innerHTML = '';
    var bar = el('div', 'bar');
    (E.filters || []).forEach(function (f) {
      var s = el('select', 'input');
      s.innerHTML = '<option value="">' + esc(f.label) + '</option>' + f.opts().map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('');
      s.value = filterState[key + f.k] || '';
      s.addEventListener('change', function () { filterState[key + f.k] = s.value; render(); });
      bar.appendChild(s);
    });
    var q = el('input', 'input');
    q.type = 'search'; q.placeholder = 'Ara…';
    q.addEventListener('input', render);
    bar.appendChild(q);
    bar.appendChild(el('span', 'grow'));
    var add = el('button', 'btn btn--primary btn--sm', '+ Yeni ' + esc(E.one.toLocaleLowerCase('tr-TR')));
    add.type = 'button';
    add.addEventListener('click', function () { openForm(key, null); });
    bar.appendChild(add);
    v.appendChild(bar);
    var host = el('div');
    v.appendChild(host);
    host.innerHTML = '<p class="hint">Yükleniyor…</p>';

    var query = sb.from(E.table).select('*');
    E.order.forEach(function (o) { query = query.order(o[0], { ascending: o[1], nullsFirst: false }); });
    query.then(function (res) {
      if (res.error) throw res.error;
      ROWS = res.data;
      COUNTS[key] = ROWS.length; buildNav();
      render();
    }).catch(function (e) { host.innerHTML = '<p class="hint">' + esc(errText(e)) + '</p>'; });

    function render() {
      var text = q.value.trim().toLocaleLowerCase('tr-TR');
      var rows = ROWS.filter(function (r) {
        var ok = (E.filters || []).every(function (f) { var val = filterState[key + f.k]; return !val || String(r[f.k]) === val; });
        return ok && (!text || E.search(r).toLocaleLowerCase('tr-TR').indexOf(text) > -1);
      });
      host.innerHTML = '';
      host.appendChild(table(E, rows, key));
    }
  }

  function table(E, rows, key) {
    var wrap = el('div', 'list');
    if (!rows.length) { wrap.innerHTML = '<div class="empty">Kayıt yok.</div>'; return wrap; }
    var t = el('table');
    t.innerHTML = '<thead><tr>' + E.cols.map(function (c) { return '<th>' + esc(c[0]) + '</th>'; }).join('') + '<th></th></tr></thead>';
    var tb = el('tbody');
    rows.forEach(function (r) {
      var tr = el('tr');
      tr.innerHTML = E.cols.map(function (c) { return '<td>' + c[1](r) + '</td>'; }).join('') +
        '<td class="acts"><button type="button" data-act="edit">Düzenle</button><button type="button" class="del" data-act="del">Sil</button></td>';
      tr.querySelector('[data-act="edit"]').addEventListener('click', function () { openForm(key, r); });
      tr.querySelector('[data-act="del"]').addEventListener('click', function () { removeRow(key, r); });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }

  function removeRow(key, r) {
    var E = ENT[key];
    var label = r.name || r.title || r.question || (r.match_date ? trDate(r.match_date) + ' maçı' : r.id);
    var msg = '"' + label + '" silinsin mi? Bu işlem geri alınamaz.' + (E.deleteWarn ? '\n\n' + E.deleteWarn : '');
    if (!window.confirm(msg)) return;
    sb.from(E.table).delete().eq('id', r.id).then(function (res) {
      if (res.error) throw res.error;
      toast(E.one + ' silindi.');
      refreshAfterChange(key);
    }).catch(function (e) { toast(errText(e), true); });
  }

  function refreshAfterChange(key) {
    var needLook = key === 'teams' || key === 'opponents' || key === 'venues';
    (needLook ? loadLookups() : Promise.resolve()).then(function () { go(current); });
  }

  /* ------------------------------------------------------------------ form */

  var editing = null;   // { key, row }

  function fieldHTML(f, val) {
    var k = f[0], label = f[1], type = f[2], o = f[3] || {};
    var req = o.req ? ' required' : '';
    var lab = '<span>' + esc(label) + (o.req ? ' *' : '') + '</span>';
    var hint = o.hint ? '<small>' + esc(o.hint) + '</small>' : '';
    var listAttr = o.list ? ' list="dl-' + k + '"' : '';
    var dl = o.list ? '<datalist id="dl-' + k + '">' + o.list.map(function (x) { return '<option value="' + esc(x) + '">'; }).join('') + '</datalist>' : '';
    var ro = o.createOnly && editing && editing.row ? ' readonly' : '';
    var v = val == null ? '' : val;
    switch (type) {
      case 'textarea':
        return '<label class="fld">' + lab + '<textarea class="input" name="' + k + '"' + req + '>' + esc(v) + '</textarea>' + hint + '</label>';
      case 'number':
        return '<label class="fld">' + lab + '<input class="input" type="number" name="' + k + '" value="' + esc(v) + '"' + req + '>' + hint + '</label>';
      case 'date':
        return '<label class="fld">' + lab + '<input class="input" type="date" name="' + k + '" value="' + esc(v) + '"' + req + '>' + hint + '</label>';
      case 'time':
        return '<label class="fld">' + lab + '<input class="input" type="time" name="' + k + '" value="' + esc(hhmm(v)) + '"' + req + '>' + hint + '</label>';
      case 'bool':
        return '<label class="chk"><input type="checkbox" name="' + k + '"' + (v ? ' checked' : '') + '>' + esc(label) + '</label>';
      case 'select':
        return '<label class="fld">' + lab + '<select class="input" name="' + k + '"' + req + '>' +
          (o.req ? '' : '<option value="">' + esc(o.empty || '—') + '</option>') +
          o.opts().map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(v) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') +
          '</select>' + hint + '</label>';
      case 'years':
        return '<label class="fld">' + lab + '<input class="input" name="' + k + '" value="' + esc((v || []).join(', ')) + '">' + hint + '</label>';
      case 'groups':
        return '<div class="fld">' + lab + '<div class="chips">' + groupCodes().map(function (g) {
          return '<label><input type="checkbox" name="' + k + '" value="' + esc(g[0]) + '"' + ((v || []).indexOf(g[0]) > -1 ? ' checked' : '') + '>' + esc(g[1]) + '</label>';
        }).join('') + '</div><small>Seçilen takımların sayfasında da görünür.</small></div>';
      case 'social':
        var s = v || {};
        return '<div class="fld">' + lab + '<div class="row3">' +
          ['instagram', 'x', 'linkedin'].map(function (n) {
            return '<input class="input" name="social_' + n + '" placeholder="' + { instagram: 'Instagram adresi', x: 'X (Twitter) adresi', linkedin: 'LinkedIn adresi' }[n] + '" value="' + esc(s[n] || '') + '">';
          }).join('') + '</div><small>Tam adresi yapıştırın (https://...). Boş olanlar profilde görünmez.</small></div>';
      case 'image':
        return '<div class="fld">' + lab + '<div class="img-fld">' +
          (v ? '<img src="' + esc(mediaSrc(v)) + '" alt="" data-prev="' + k + '">' : '<span class="noimg" data-prev="' + k + '">Görsel yok</span>') +
          '<div><input class="input" name="' + k + '" value="' + esc(v) + '" placeholder="Görsel adresi ya da yükleyin">' +
          '<div class="btns"><label class="btn btn--outline btn--sm" style="cursor:pointer">Bilgisayardan yükle<input type="file" accept="image/png,image/jpeg,image/webp" data-upload="' + k + '" hidden></label>' +
          '<button type="button" class="btn btn--ghost btn--sm" data-clear="' + k + '">Kaldır</button></div></div></div>' + hint + '</div>';
      default:
        return '<label class="fld">' + lab + '<input class="input" name="' + k + '" value="' + esc(v) + '"' + req + listAttr + ro + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>' + dl + hint + '</label>';
    }
  }

  function flatFields(E) {
    var out = [];
    E.fields.forEach(function (f) { if (Array.isArray(f[0])) f.forEach(function (x) { out.push(x); }); else out.push(f); });
    return out;
  }

  function openForm(key, row) {
    var E = ENT[key];
    editing = { key: key, row: row };
    var data = row || E.defaults();
    $('#drawerTitle').textContent = (row ? E.one + ' düzenle' : 'Yeni ' + E.one.toLocaleLowerCase('tr-TR'));
    $('#drawerBody').innerHTML = E.fields.map(function (f) {
      if (Array.isArray(f[0])) return '<div class="row' + f.length + '">' + f.map(function (x) { return fieldHTML(x, data[x[0]]); }).join('') + '</div>';
      return fieldHTML(f, data[f[0]]);
    }).join('');
    $$('#drawerBody [data-upload]').forEach(function (inp) { inp.addEventListener('change', function () { upload(inp, key); }); });
    $$('#drawerBody [data-clear]').forEach(function (b) {
      b.addEventListener('click', function () { var k = b.getAttribute('data-clear'); $('#editForm [name="' + k + '"]').value = ''; setPreview(k, ''); });
    });
    $$('#drawerBody .img-fld input.input').forEach(function (inp) { inp.addEventListener('change', function () { setPreview(inp.name, inp.value); }); });
    var d = $('#drawer');
    d.setAttribute('aria-hidden', 'false');
    setTimeout(function () { var first = $('#drawerBody input:not([readonly]), #drawerBody select, #drawerBody textarea'); if (first) first.focus(); }, 60);
  }
  function closeForm() { $('#drawer').setAttribute('aria-hidden', 'true'); editing = null; }

  function setPreview(k, url) {
    var p = $('#drawerBody [data-prev="' + k + '"]');
    if (!p) return;
    var n = url ? el('img') : el('span', 'noimg', 'Görsel yok');
    if (url) { n.src = mediaSrc(url); n.alt = ''; }
    n.setAttribute('data-prev', k);
    p.replaceWith(n);
  }

  function upload(inp, key) {
    var file = inp.files && inp.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Görsel 5 MB\'tan küçük olmalı.', true); return; }
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
    var path = key + '/' + Date.now() + '-' + slugify(file.name.replace(/\.[^.]+$/, '')) + '.' + ext;
    var k = inp.getAttribute('data-upload');
    toast('Görsel yükleniyor…');
    sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false }).then(function (res) {
      if (res.error) throw res.error;
      var url = sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      $('#editForm [name="' + k + '"]').value = url;
      setPreview(k, url);
      toast('Görsel yüklendi. Kaydetmeyi unutmayın.');
    }).catch(function (e) { toast(errText(e), true); });
  }

  function collect(E) {
    var form = $('#editForm');
    var d = {};
    flatFields(E).forEach(function (f) {
      var k = f[0], type = f[2];
      if (type === 'bool') { d[k] = !!form.elements[k].checked; return; }
      if (type === 'groups') { d[k] = $$('input[name="' + k + '"]:checked', form).map(function (x) { return x.value; }); return; }
      if (type === 'social') {
        d[k] = {};
        ['instagram', 'x', 'linkedin'].forEach(function (n) { var v = form.elements['social_' + n].value.trim(); if (v) d[k][n] = v; });
        return;
      }
      var raw = form.elements[k] ? form.elements[k].value.trim() : '';
      if (type === 'years') { d[k] = raw ? raw.split(/[,\s]+/).map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); }) : []; return; }
      if (type === 'number') { d[k] = raw === '' ? null : Number(raw); return; }
      d[k] = raw === '' ? null : raw;
    });
    return d;
  }

  function uniqueId(E, base) {
    return sb.from(E.table).select('id').like('id', base + '%').then(function (res) {
      var taken = (res.data || []).map(function (r) { return r.id; });
      if (taken.indexOf(base) === -1) return base;
      for (var i = 2; i < 100; i++) if (taken.indexOf(base + '-' + i) === -1) return base + '-' + i;
      return base + '-' + Date.now();
    });
  }

  function save(ev) {
    ev.preventDefault();
    if (!editing) return;
    var key = editing.key, E = ENT[key], row = editing.row;
    var d;
    try {
      d = collect(E);
      var missing = flatFields(E).filter(function (f) { return f[3] && f[3].req && (d[f[0]] == null || d[f[0]] === ''); });
      if (missing.length) throw new Error('"' + missing[0][1] + '" alanını doldurun.');
      if (d.id != null && !/^[a-z0-9-]+$/.test(d.id)) throw new Error('Adres kimliği yalnız küçük harf, rakam ve tire içerebilir.');
      if (E.beforeSave) d = E.beforeSave(d);
    } catch (e) { toast(e.message, true); return; }

    var btn = $('#saveBtn');
    btn.disabled = true;
    var p;
    if (row) {
      if (E.idMode === 'manual') delete d.id;   // kimlik oluşturulduktan sonra değişmez
      p = sb.from(E.table).update(d).eq('id', row.id);
    } else if (E.idMode === 'slug') {
      p = uniqueId(E, slugify(d[E.slugFrom])).then(function (id) { d.id = id; return sb.from(E.table).insert(d); });
    } else {
      p = sb.from(E.table).insert(d);
    }
    Promise.resolve(p).then(function (res) {
      if (res && res.error) throw res.error;
      toast(row ? 'Kaydedildi.' : E.one + ' eklendi.');
      closeForm();
      refreshAfterChange(key);
    }).catch(function (e) { toast(errText(e), true); }).then(function () { btn.disabled = false; });
  }

  /* ------------------------------------------------------- okul bilgileri */

  var SETTINGS_FIELDS = [
    ['name', 'Kurum adı'], ['phone_display', 'Telefon (görünen)', '0 (540) 244 19 74'], ['tel', 'Telefon bağlantısı', 'tel:+905402441974'],
    ['whatsapp', 'WhatsApp bağlantısı', 'https://wa.me/905402441974'], ['venue', 'Antrenman salonu'], ['address', 'Açık adres'],
    ['instagram', 'Instagram (okul)'], ['diba_instagram', 'Instagram (DİBA)'], ['season', 'Sezon', '2026-2027']
  ];
  function showSettings() {
    $('#viewTitle').textContent = 'Okul bilgileri';
    $('#viewSub').textContent = 'Ön kayıt formu (WhatsApp numarası) ve SSS cevaplarında kullanılır.';
    var v = $('#view');
    v.innerHTML = '<p class="hint">Yükleniyor…</p>';
    sb.from('web_settings').select('value').eq('key', 'okul').maybeSingle().then(function (res) {
      if (res.error) throw res.error;
      var val = (res.data && res.data.value) || {};
      var f = el('form', 'list');
      f.style.padding = '20px';
      f.style.display = 'grid';
      f.style.gap = '14px';
      f.style.maxWidth = '720px';
      f.innerHTML = SETTINGS_FIELDS.map(function (x) {
        return '<label class="fld"><span>' + esc(x[1]) + '</span><input class="input" name="' + x[0] + '" value="' + esc(val[x[0]] || '') + '"' + (x[2] ? ' placeholder="' + esc(x[2]) + '"' : '') + '></label>';
      }).join('') + '<div><button class="btn btn--primary" type="submit">Kaydet</button></div>';
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var out = {};
        SETTINGS_FIELDS.forEach(function (x) { out[x[0]] = f.elements[x[0]].value.trim(); });
        sb.from('web_settings').upsert({ key: 'okul', value: out }).then(function (r) {
          if (r.error) throw r.error;
          toast('Okul bilgileri kaydedildi.');
        }).catch(function (er) { toast(errText(er), true); });
      });
      v.innerHTML = '';
      v.appendChild(f);
    }).catch(function (e) { v.innerHTML = '<p class="hint">' + esc(errText(e)) + '</p>'; });
  }

  /* ------------------------------------------------------------ oturum */

  function showLogin(msg) {
    $('#app').hidden = true;
    $('#login').hidden = false;
    $('#loginErr').textContent = msg || '';
  }

  function enter(session) {
    return sb.rpc('web_is_admin').then(function (res) {
      if (res.error || !res.data) {
        return sb.auth.signOut().then(function () { showLogin('Bu hesap yönetici değil. Panele yalnız kulüp yöneticileri girebilir.'); });
      }
      $('#login').hidden = true;
      $('#app').hidden = false;
      sb.from('profiles').select('full_name').eq('id', session.user.id).maybeSingle().then(function (p) {
        $('#who').innerHTML = '<b>' + esc((p.data && p.data.full_name) || 'Yönetici') + '</b><br>Yönetici';
      });
      return loadLookups().then(function () {
        var start = (location.hash || '').slice(1);
        go(ENT[start] || start === 'settings' ? start : 'ozet');
      });
    });
  }

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, phone = normalizePhone(f.elements.phone.value), pw = f.elements.password.value;
    if (!phone) { $('#loginErr').textContent = 'Geçerli bir cep telefonu yazın (05xx xxx xx xx).'; return; }
    if (!pw) { $('#loginErr').textContent = 'Şifrenizi yazın.'; return; }
    $('#loginErr').textContent = '';
    var b = f.querySelector('button[type="submit"]');
    b.disabled = true; b.textContent = 'Giriş yapılıyor…';
    sb.auth.signInWithPassword({ email: phone + '@' + PHONE_DOMAIN, password: pw }).then(function (res) {
      if (res.error) throw res.error;
      return enter(res.data.session);
    }).catch(function (err) { $('#loginErr').textContent = errText(err); })
      .then(function () { b.disabled = false; b.textContent = 'Giriş yap'; });
  });

  $('#logout').addEventListener('click', function () { sb.auth.signOut().then(function () { showLogin(''); }); });
  $('#sideNav').addEventListener('click', function (e) { var b = e.target.closest('[data-view]'); if (b) go(b.getAttribute('data-view')); });
  $('#menuBtn').addEventListener('click', function () { $('#side').classList.toggle('is-open'); });
  $('#editForm').addEventListener('submit', save);
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeForm); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && editing) closeForm(); });

  sb.auth.getSession().then(function (res) {
    var s = res.data && res.data.session;
    if (s) enter(s); else showLogin('');
  });
})();
