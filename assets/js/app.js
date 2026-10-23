/* Denizli Tofaş Basketbol Okulları — interactions & data rendering
   TOFAŞ sitesinin app.js'i temel alındı (header, reveal, slider, sekmeler,
   lightbox, kart render'ları); A takıma özel parçalar okul içeriğine uyarlandı.
   Motion sözleşmesi: yalnız transform/opacity, girişte ease-out, UI'da <300ms. */

(function () {
  'use strict';

  var S = window.SITE || {};
  var SC = S.school || {};
  var PHOTOS = window.PHOTOS || [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = function () { return matchMedia('(hover: hover) and (pointer: fine)').matches; };

  /* ---------------------------------------------------------------- utils */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /** Kişi adları büyük harf kalır — TOFAŞ sitesindeki kulüp dili. */
  function personName(s) { return String(s || '').normalize('NFC').toLocaleUpperCase('tr-TR'); }
  function initials(s) {
    return String(s || '').trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toLocaleUpperCase('tr-TR');
  }

  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  function parseDate(s) {
    var m = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(String(s || ''));
    return m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date(0);
  }
  function fmtDate(s) {
    var m = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(String(s || ''));
    return m ? +m[1] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[3] : (s || '');
  }

  var ARROW = '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CAT_LABEL = { mac: 'Maç', antrenman: 'Antrenman', duyuru: 'Duyuru', etkinlik: 'Etkinlik' };
  var CATS = [['Tüm Haberler', null], ['Maçlar', 'mac'], ['Antrenman', 'antrenman'], ['Duyurular', 'duyuru'], ['Etkinlik', 'etkinlik']];

  /* ------------------------------------------------- Instagram görselleri */

  /* Görseller assets/instagram/ altına elle konuyor; tools/photos.py onları
     küçültüp data/photos.js'e (window.PHOTOS) listeler. Listede olmayan gönderi
     için .ph yer tutucusu (lacivert + soluk rozet) görünür. */
  function hasPhoto(code) { return PHOTOS.indexOf(code) > -1; }
  function igSrc(code, small) { return 'assets/instagram/' + (small ? '600/' : '') + code + '.jpg'; }
  /** Haber detay sayfası */
  function postLink(p) { return 'haber.html?id=' + encodeURIComponent(p.code); }
  /** Dış bağlantı: panelden girilen bağlantı; yoksa yalnız Instagram gönderi kodu
   *  olan (panelden eklenmemiş) haberlerde Instagram gönderisi, diğerlerinde boş */
  function extLink(p) {
    if (p.link) return p.link;
    return /^[A-Za-z0-9_-]{10,12}$/.test(p.code) ? 'https://www.instagram.com/p/' + p.code + '/' : '';
  }
  function extLabel(url) { return /instagram\.com/.test(url) ? 'Instagram’da gör' : 'Bağlantıyı aç'; }
  /** Gönderi görseli: panelden yüklenen görsel; yerel Instagram arşivinde küçük sürüm (600/) */
  function postImgSrc(p, small) {
    if (p.image && !/^assets\/instagram\//.test(p.image)) return p.image;
    if (hasPhoto(p.code)) return igSrc(p.code, small);
    return '';
  }
  function postImg(p, alt, small, attrs) {
    var src = postImgSrc(p, small);
    if (!src) return '';
    return '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" ' + (attrs == null ? 'loading="lazy"' : attrs) + ' decoding="async">';
  }
  function postByCode(code) { return (S.posts || []).filter(function (p) { return p.code === code; })[0]; }
  function sortedPosts() {
    return (S.posts || []).slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  }

  /* --------------------------------------------------------------- header */

  function header() {
    var hdr = $('.hdr');
    if (!hdr) return;

    var stuck = false;
    function onScroll() {
      var s = window.scrollY > 4;
      if (s !== stuck) { stuck = s; hdr.setAttribute('data-stuck', String(s)); }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Açılır menüler (TOFAŞ): masaüstünde hover, dokunmatikte ve klavyede tıklama */
    $$('.nav__item').forEach(function (item) {
      var menu = $('.nav__menu', item);
      if (!menu) return;
      var trigger = $('.nav__link', item);
      var t;
      function open(v) {
        item.setAttribute('data-open', String(v));
        trigger.setAttribute('aria-expanded', String(v));
      }
      item.addEventListener('mouseenter', function () { if (fine()) { clearTimeout(t); open(true); } });
      item.addEventListener('mouseleave', function () { if (fine()) t = setTimeout(function () { open(false); }, 90); });
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        open(item.getAttribute('data-open') !== 'true');
      });
    });
    document.addEventListener('click', function (e) {
      $$('.nav__item[data-open="true"]').forEach(function (i) { if (!i.contains(e.target)) i.setAttribute('data-open', 'false'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') $$('.nav__item[data-open="true"]').forEach(function (i) { i.setAttribute('data-open', 'false'); });
    });

    var burger = $('.burger'), nav = $('.nav');
    if (burger && nav) {
      var setOpen = function (open) {
        burger.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('nav--open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      };
      burger.addEventListener('click', function () {
        setOpen(burger.getAttribute('aria-expanded') !== 'true');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setOpen(false); burger.focus(); }
      });
      window.addEventListener('resize', function () { if (window.innerWidth > 900) setOpen(false); });
    }
  }

  /* --------------------------------------------------------------- reveal */

  function reveal() {
    var items = $$('[data-reveal]:not(.in)');
    if (!items.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function (n) {
          return n.hasAttribute && n.hasAttribute('data-reveal');
        });
        var i = Math.min(sibs.indexOf(e.target), 7);
        e.target.style.setProperty('--d', (i > 0 ? i * 45 : 0) + 'ms');
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    items.forEach(function (n) { io.observe(n); });
  }
  function markReveal(container, sel) {
    $$(sel, container).forEach(function (n) { n.setAttribute('data-reveal', ''); });
  }

  /* ----------------------------------------------------------------- tabs */

  /** Kırpılmış klon tekniği: aktif etiket, listenin ikinci bir kopyası olarak
   *  clip-path ile açığa çıkar; renk değişimi göstergeyle birebir senkron olur. */
  function buildTabs(host, labels, onChange) {
    host.classList.add('tabs');
    host.innerHTML = '';
    var list = el('div', 'tabs__list');
    var ind = el('div', 'tabs__ind');
    var clip = el('div', 'tabs__clip');
    var clipList = el('div', 'tabs__list');
    clip.setAttribute('aria-hidden', 'true');
    clip.appendChild(clipList);

    labels.forEach(function (label, i) {
      var b = el('button', 'tabs__btn', esc(label));
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.i = i;
      list.appendChild(b);
      clipList.appendChild(el('span', 'tabs__btn', esc(label)));
    });
    host.appendChild(ind);
    host.appendChild(list);
    host.appendChild(clip);

    var active = 0;
    function place() {
      var b = list.children[active];
      if (!b) return;
      var l = b.offsetLeft, w = b.offsetWidth;
      ind.style.width = w + 'px';
      ind.style.transform = 'translateX(' + l + 'px)';
      clip.style.clipPath = 'inset(0 ' + Math.max(0, (host.clientWidth - 8) - (l + w)) + 'px 0 ' + l + 'px round 7px)';
    }
    function select(i, silent) {
      active = i;
      $$('.tabs__btn', list).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); });
      place();
      if (!silent) onChange(i);
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('.tabs__btn');
      if (b) select(+b.dataset.i);
    });
    window.addEventListener('resize', place);
    requestAnimationFrame(function () { select(0, true); });
    return { select: select, place: place };
  }

  /* ------------------------------------------------------------- renderers */

  /** Haber kartı — TOFAŞ kartı; haber sayfasına gider. */
  function newsCard(p, badge) {
    var a = el('a', 'card');
    a.href = postLink(p);
    a.innerHTML =
      '<div class="card__media ph">' +
      (badge ? '<span class="tag tag--blue card__badge">' + esc(badge) + '</span>' : '') +
      postImg(p, p.title, true) + '</div>' +
      '<div class="card__body">' +
      '<h3 class="card__title">' + esc(p.title) + '</h3>' +
      '<div class="card__meta"><span class="date">' + esc(fmtDate(p.date)) + '</span></div>' +
      '</div>';
    return a;
  }

  /** Teknik kadro kartı — TOFAŞ .scard; fotoğraf yoksa baş harf. */
  function staffCard(c) {
    var d = el('a', 'scard');
    d.href = 'antrenor.html?id=' + c.id;
    d.innerHTML =
      '<div class="scard__media pcard__media">' +
      (c.photo
        ? '<img src="' + esc(c.photo) + '" alt="' + esc(personName(c.name)) + '" loading="lazy" decoding="async">'
        : '<div class="pcard__ghost">' + esc(initials(c.name)) + '</div>') +
      '</div>' +
      '<div class="scard__body"><h3 class="scard__name">' + esc(personName(c.name)) + '</h3>' +
      '<div class="scard__title">' + esc(c.title) + '</div></div>';
    return d;
  }

  /* ------------------------------------------------- takımlar ve maçlar */

  var DIBA_LOGO = 'assets/img/diba.png';
  function teamById(id) { return (S.teams || []).filter(function (t) { return t.id === id; })[0]; }
  function playerById(id) { return (S.players || []).filter(function (p) { return p.id === id; })[0]; }
  function venueById(id) { return (S.venues || []).filter(function (v) { return v.id === id; })[0]; }
  function coachById(id) { return (S.coaches || []).filter(function (c) { return c.id === id; })[0]; }
  /** Grup kimliği (u16) → o gruba ait takımlar (u16a, u16b) */
  function teamsOfGroup(g) { return (S.teams || []).filter(function (t) { return t.group === g; }); }

  function dateKey(d, t) {
    var m = /^(\d{2})\.(\d{2})\.(\d{4})/.exec(d || '');
    var h = /^(\d{2}):(\d{2})/.exec(t || '');
    return m ? new Date(+m[3], +m[2] - 1, +m[1], h ? +h[1] : 0, h ? +h[2] : 0) : new Date(0);
  }
  var DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  function fmtLong(m) {
    var d = dateKey(m.date, m.time);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + DAYS[d.getDay()] + (m.time ? ' ' + m.time : '');
  }

  /** Lig maçını sayfa biçimine getirir. Bizim taraf her zaman DİBA logosuyla. */
  function normSide(x) {
    if (x.team) {
      var t = teamById(x.team);
      return { us: true, name: 'DİBA ' + (t ? t.name : ''), logo: DIBA_LOGO, team: x.team };
    }
    return { name: x.name, logo: x.logo ? (/[\/.]/.test(x.logo) ? x.logo : 'assets/teams/' + x.logo + '.png') : '' };
  }
  var MATCHES = null;
  function allMatches() {
    if (MATCHES) return MATCHES;
    MATCHES = (S.league || []).map(function (m) {
      var h = normSide(m.home), a = normSide(m.away);
      return {
        id: m.id, no: m.no, comp: m.comp, week: m.week, date: m.date, time: m.time,
        home: h, away: a, score: m.score || '', venue: m.venue, status: m.status || 'scheduled',
        quarters: m.quarters || null, tbf: m.tbf || '',
        teams: [h.team, a.team].filter(Boolean)
      };
    }).sort(function (a, b) { return dateKey(a.date, a.time) - dateKey(b.date, b.time); });
    return MATCHES;
  }
  function matchById(id) { return allMatches().filter(function (m) { return m.id === id; })[0]; }
  function matchesOfTeam(t) { return allMatches().filter(function (m) { return m.teams.indexOf(t.id) > -1; }); }
  function isPlayed(m) { return /\d/.test(m.score); }
  function upcoming(list) {
    var now = new Date();
    return list.filter(function (m) { return !isPlayed(m) && m.status !== 'cancelled' && dateKey(m.date, m.time) >= now; });
  }
  /** Bir maçı belirli bir takımın gözünden okur: biz kimiz, rakip kim, iç saha mı. */
  function perspective(m, teamId) {
    var ourHome = m.home.us && (!teamId || m.home.team === teamId);
    var us = ourHome ? m.home : m.away, opp = ourHome ? m.away : m.home;
    var res = null;
    if (isPlayed(m)) {
      var n = m.score.split('-').map(function (x) { return parseInt(x, 10); });
      var mine = ourHome ? n[0] : n[1], theirs = ourHome ? n[1] : n[0];
      res = { mine: mine, theirs: theirs, win: mine > theirs };
    }
    return { us: us, opp: opp, home: ourHome, res: res };
  }

  function crest(side) {
    if (side.logo) return '<img src="' + esc(side.logo) + '" alt="" loading="lazy">';
    return '<span class="crest" aria-hidden="true">' + esc(initials(side.name)) + '</span>';
  }

  var STATUS_LABEL = { postponed: 'Ertelendi', cancelled: 'İptal' };
  var MON3 = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  var DAY3 = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  /** Maç kartı — tarih bloğu, rakip, salon/saat, sonuç. Takım sayfasında o takımın gözünden okunur. */
  function matchRow(m, teamId) {
    var p = perspective(m, teamId);
    var d = dateKey(m.date, m.time);
    var v = venueById(m.venue);
    var a = el('a', 'game' + (p.res ? ' game--played' : ''));
    a.href = 'mac.html?id=' + m.id;
    a.innerHTML =
      '<div class="game__date"><b>' + d.getDate() + '</b><span>' + MON3[d.getMonth()] + '</span><small>' + DAY3[d.getDay()] + '</small></div>' +
      '<div class="game__opp">' +
        '<div class="game__crest">' + crest(p.opp) + '<i title="' + (p.home ? 'İç saha' : 'Deplasman') + '">' + (p.home ? 'vs' : '@') + '</i></div>' +
        '<div class="game__info"><div class="game__meta"><span class="game__team">' + esc(p.us.name) + '</span>' + esc(m.week) + '</div>' +
        '<div class="game__name">' + esc(p.opp.name) + '</div></div>' +
      '</div>' +
      '<div class="game__where"><b>' + esc(STATUS_LABEL[m.status] || m.time || 'Saat TBA') + '</b><span>' + esc(v ? v.short : '') + '</span></div>' +
      '<div class="game__end">' + (p.res
        ? '<span class="game__res ' + (p.res.win ? 'is-win' : 'is-loss') + '">' + (p.res.win ? 'G' : 'M') + '</span><b class="game__score">' + p.res.mine + '–' + p.res.theirs + '</b>'
        : '<span class="game__cta">Maç detayı ' + ARROW + '</span>') +
      '</div>';
    return a;
  }

  /** Öne çıkan maç kartı — sıradaki maç, yoksa son oynanan maç */
  function featuredGame(host, m, label) {
    if (!host) return;
    if (!m) { host.remove(); return; }
    var v = venueById(m.venue);
    var played = isPlayed(m);
    host.innerHTML =
      '<div class="feature__top"><span class="feature__label">' + esc(label) + '</span><span class="feature__comp">' + esc(m.comp + ' · ' + m.week) + '</span></div>' +
      '<div class="feature__row">' +
        '<div class="feature__team">' + crest(m.home) + '<b>' + esc(m.home.name) + '</b></div>' +
        '<div class="feature__mid">' + (played ? '<b class="feature__score">' + esc(m.score.replace(/\s*-\s*/, ' – ')) + '</b><span>Maç sonucu</span>'
          : '<b class="feature__time">' + esc(m.time || 'TBA') + '</b><span>' + esc(fmtLong(m).split(' · ')[0]) + '</span>') + '</div>' +
        '<div class="feature__team">' + crest(m.away) + '<b>' + esc(m.away.name) + '</b></div>' +
      '</div>' +
      '<div class="feature__foot"><span>' + esc(fmtLong(m)) + (v ? ' · ' + esc(v.short) : '') + '</span>' +
        '<a class="btn btn--onblue btn--sm" href="mac.html?id=' + m.id + '">Maç detayı ' + ARROW + '</a></div>';
  }

  /* -------------------------------------------------------------- lightbox */

  /* TOFAŞ lightbox'ı: ok tuşları + Esc. Odak kapat düğmesine gider, kapanınca
     tetikleyiciye döner. Liste yalnız fotoğrafı olan gönderilerden oluşur. */
  var LB = (function () {
    var node, img, count, lastFocus, state = { list: [], i: 0 };

    function build() {
      node = el('div', 'lb');
      node.setAttribute('role', 'dialog');
      node.setAttribute('aria-modal', 'true');
      node.setAttribute('aria-label', 'Fotoğraf görüntüleyici');
      node.innerHTML =
        '<div class="lb__inner">' +
        '<img alt="">' +
        '<div class="lb__bar">' +
        '<button class="lb__btn" type="button" data-act="prev" aria-label="Önceki"><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6z"/></svg></button>' +
        '<button class="lb__btn" type="button" data-act="next" aria-label="Sonraki"><svg viewBox="0 0 16 16"><path d="M6 2l6 6-6 6z"/></svg></button>' +
        '<span class="lb__count"></span>' +
        '<button class="lb__btn lb__close" type="button" data-act="close" aria-label="Kapat"><svg viewBox="0 0 16 16"><path d="M12.7 4.7 9.4 8l3.3 3.3-1.4 1.4L8 9.4l-3.3 3.3-1.4-1.4L6.6 8 3.3 4.7l1.4-1.4L8 6.6l3.3-3.3z"/></svg></button>' +
        '</div></div>';
      document.body.appendChild(node);
      img = $('img', node); count = $('.lb__count', node);

      node.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (b) {
          if (b.dataset.act === 'close') close();
          if (b.dataset.act === 'prev') go(-1);
          if (b.dataset.act === 'next') go(1);
          return;
        }
        if (e.target === node) close();
      });
      document.addEventListener('keydown', function (e) {
        if (node.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'Tab') {   // odak diyalog içinde kalsın
          var f = $$('.lb__btn', node).filter(function (n) { return n.offsetParent !== null; });
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    function render() {
      var p = state.list[state.i];
      img.src = postImgSrc(p);
      img.alt = p.title;
      count.textContent = (state.i + 1) + ' / ' + state.list.length + ' · ' + p.title;
      $$('.lb__btn[data-act="prev"], .lb__btn[data-act="next"]', node).forEach(function (b) {
        b.style.display = state.list.length > 1 ? '' : 'none';
      });
    }
    function go(d) {
      state.i = (state.i + d + state.list.length) % state.list.length;
      render();
    }
    function open(list, i) {
      if (!node) build();
      lastFocus = document.activeElement;
      state = { list: list, i: i || 0 };
      render();
      node.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      $('.lb__close', node).focus();
    }
    function close() {
      node.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    return { open: open };
  })();

  /** Galeri karesi — TOFAŞ albüm karesi. Fotoğrafı varsa lightbox'ta açılır,
   *  yoksa haber sayfasına gider. */
  function photoTile(p, list) {
    var a = el('a', 'tile');
    a.href = postLink(p);
    a.innerHTML =
      '<div class="tile__media ph">' + postImg(p, p.title, true) + '</div>' +
      '<div class="tile__body"><h3 class="tile__title">' + esc(p.title) + '</h3>' +
      '<div class="tile__meta">' + esc(fmtDate(p.date)) + (p.type === 'video' ? ' · Video' : '') + '</div></div>';
    if (postImgSrc(p)) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        LB.open(list, list.indexOf(p));
      });
    }
    return a;
  }
  function photoList() { return sortedPosts().filter(function (p) { return !!postImgSrc(p); }); }

  /* ------------------------------------------------------------ page: home */

  function pageHome() {
    /* --- slider (TOFAŞ) */
    var track = $('#slidertrack'), dots = $('#sliderdots');
    var slides = sortedPosts().slice(0, 7);   // son 7 haber
    if (track && slides.length) {
      var cur = 0, timer;
      var show = function (i) {
        cur = i;
        $$('.slide', track).forEach(function (n, j) { n.setAttribute('data-active', String(j === i)); });
        $$('.dot', dots).forEach(function (n, j) { n.setAttribute('aria-selected', String(j === i)); });
      };
      var rest = function () {
        clearInterval(timer);
        if (reduce) return;
        timer = setInterval(function () { show((cur + 1) % slides.length); }, 6000);
      };
      slides.forEach(function (p, i) {
        var d = el('div', 'slide ph');
        d.setAttribute('data-active', String(i === 0));
        d.innerHTML =
          postImg(p, '', false, i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') +
          '<div class="slide__body">' +
          '<div class="slide__meta"><span class="tag">' + esc(CAT_LABEL[p.cat] || 'Haber') + '</span><span class="date">' + esc(fmtDate(p.date)) + '</span></div>' +
          '<h2 class="slide__title">' + esc(p.title) + '</h2>' +
          '<a class="btn btn--onblue btn--sm" href="' + postLink(p) + '">Haberi oku ' + ARROW + '</a>' +
          '</div>';
        track.appendChild(d);
        var b = el('button', 'dot');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', String(i === 0));
        b.setAttribute('aria-label', (i + 1) + '. haber');
        b.addEventListener('click', function () { show(i); rest(); });
        dots.appendChild(b);
      });
      rest();
      var sw = $('#slider');
      sw.addEventListener('mouseenter', function () { if (fine()) clearInterval(timer); });
      sw.addEventListener('mouseleave', function () { if (fine()) rest(); });
    }

    /* --- maçlar: yaklaşanlar; sonuç varsa son sonuçlar da */
    var all = allMatches();
    var uh = $('#upcoming'), rh = $('#results');
    if (uh) {
      var up = upcoming(all).slice(0, 4);
      if (!up.length) uh.appendChild(el('p', 'sec__sub', 'Takvimde yaklaşan maç yok.'));
      up.forEach(function (m) { uh.appendChild(matchRow(m)); });
      markReveal(uh, '.game');
    }
    var played = all.filter(isPlayed).reverse().slice(0, 4);
    if (rh) {
      if (played.length) { played.forEach(function (m) { rh.appendChild(matchRow(m)); }); markReveal(rh, '.game'); }
      else { var col = rh.closest('[data-col]'); if (col) col.remove(); }
    }

    /* --- kategoriye göre haberler (TOFAŞ'taki branş sekmeleri) */
    var nhost = $('#newsgrid');
    if (nhost) {
      var posts = sortedPosts();
      var renderCat = function (i) {
        nhost.innerHTML = '';
        posts.filter(function (p) { return !CATS[i][1] || p.cat === CATS[i][1]; }).slice(0, 4)
          .forEach(function (p) { nhost.appendChild(newsCard(p, i === 0 ? null : CATS[i][0])); });
        markReveal(nhost, '.card');
        reveal();
      };
      var th = $('#newstabs');
      if (th) buildTabs(th, CATS.map(function (c) { return c[0]; }), renderCat);
      renderCat(0);
    }

    /* --- galeri önizleme */
    var gal = $('#galleryhome');
    if (gal) {
      var list = photoList();
      sortedPosts().filter(function (p) { return p.type !== 'video'; }).slice(0, 4)
        .forEach(function (p) { gal.appendChild(photoTile(p, list)); });
      markReveal(gal, '.tile');
    }
  }

  /* ----------------------------------------------------- oyuncu kartları */

  /** Oyuncu kartı — TOFAŞ oyuncu kartı; fotoğraf yoksa baş harf. */
  function playerCard(p) {
    var a = el('a', 'pcard');
    a.href = 'oyuncu.html?id=' + p.id;
    var t = teamById(p.team);
    a.innerHTML =
      '<div class="pcard__media">' +
      '<span class="pcard__pos">' + esc(t ? t.name : '') + '</span>' +
      (p.number ? '<span class="pcard__flag">#' + esc(p.number) + '</span>' : '') +
      (p.photo
        ? '<img src="' + esc(p.photo) + '" alt="' + esc(personName(p.name)) + '" loading="lazy" decoding="async">'
        : '<div class="pcard__ghost">' + esc(initials(p.name)) + '</div>') +
      '</div>' +
      '<div class="pcard__body"><h3 class="pcard__name">' + esc(personName(p.name)) + '</h3>' +
      '<div class="pcard__sub">' + esc(p.born + ' doğumlu') + (p.position ? ' · ' + esc(p.position) : '') + '</div></div>';
    return a;
  }
  function playersOf(teamId) { return (S.players || []).filter(function (p) { return p.team === teamId; }); }

  /** Kayan oyuncu şeridi (ana sayfadan taşındı): liste ikiye katlanır, -50%'de kusursuz döner. */
  function rosterStrip(host, list) {
    if (!host || !list.length) return;
    var base = list.slice();
    while (base.length < 10) base = base.concat(list);   // kısa kadro geniş ekranı doldursun
    base.concat(base).forEach(function (p) { host.appendChild(playerCard(p)); });
  }

  function teamFromQuery() {
    return teamById(new URLSearchParams(location.search).get('id')) || (S.teams || [])[0];
  }

  /** Takım başlığı (takım ve kadro sayfaları ortak): fotoğraf, ad, alt menü */
  function teamHeader(t, active) {
    var g = (S.groups || []).filter(function (x) { return x.id === t.group; })[0] || {};
    var photo = $('#tm-photo');
    if (photo) {
      if (t.photo) photo.insertAdjacentHTML('afterbegin', '<img src="' + esc(t.photo) + '" alt="' + esc(t.full + ' takım fotoğrafı') + '">');
      else photo.insertAdjacentHTML('beforeend', '<span class="team-photo__note">Takım fotoğrafı yakında</span>');
    }
    $$('[data-tm="name"]').forEach(function (n) { n.textContent = t.full; });
    $$('[data-tm="short"]').forEach(function (n) { n.textContent = t.name; });
    var lead = $('#tm-lead');
    if (lead) lead.textContent = [g.yearsLabel, t.league || 'Lig maçı yok'].filter(Boolean).join(' · ');
    var nav = $('#tm-nav');
    if (nav) {
      var items = [['Genel Bakış', 'takim.html?id=' + t.id, 'genel'], ['Kadro', 'kadro.html?id=' + t.id, 'kadro'],
        ['Fikstür', 'takim.html?id=' + t.id + '#fikstur', 'fikstur'], ['Haberler', 'takim.html?id=' + t.id + '#haberler', 'haberler']];
      if (t.tbf) items.push(['TBF', t.tbf, 'tbf']);
      nav.innerHTML = items.map(function (i) {
        var ext = i[2] === 'tbf' ? ' target="_blank" rel="noopener"' : '';
        return '<a href="' + i[1] + '"' + ext + (i[2] === active ? ' aria-current="page"' : '') + '>' + i[0] + '</a>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------ page: team */

  function pageTeam() {
    var t = teamFromQuery();
    if (!t) return;
    document.title = t.full + ' — TOFAŞ · DİBA Denizli';
    teamHeader(t, 'genel');

    var ms = matchesOfTeam(t);
    var next = upcoming(ms)[0];
    var last = ms.filter(isPlayed).slice(-1)[0];
    featuredGame($('#tm-feature'), next || last, next ? 'Sıradaki Maç' : 'Son Maç');

    var roster = playersOf(t.id);
    $('#tm-roster-link').href = 'kadro.html?id=' + t.id;
    if (roster.length) {
      rosterStrip($('#rostertrack'), roster);
      $('#tm-count').textContent = roster.length + ' sporcu';
    } else {
      $('#tm-strip').remove();
      $('#tm-roster-link').remove();
      $('#tm-count').textContent = 'Kadro bilgisi yakında eklenecek.';
    }

    var fx = $('#tm-fixtures');
    var xb = $('#tm-excel');
    if (ms.length) {
      ms.forEach(function (m) { fx.appendChild(matchRow(m, t.id)); });
      markReveal(fx, '.game');
      if (xb) xb.addEventListener('click', function () { downloadFixtures(ms, t.id, fileSlug(t.name)); });
    } else {
      fx.appendChild(el('p', 'sec__sub', 'Bu yaş grubunun TBF liginde maçı yok.'));
      if (xb) xb.remove();
    }

    var news = $('#tm-news');
    var posts = sortedPosts().filter(function (p) { return (p.groups || []).indexOf(t.group) > -1; });
    if (posts.length) { posts.slice(0, 4).forEach(function (p) { news.appendChild(newsCard(p)); }); markReveal(news, '.card'); }
    else news.outerHTML = '<p class="sec__sub">Bu takıma ait haber henüz yok.</p>';
  }

  /* ---------------------------------------------------------- page: roster */

  /** Kadro sayfası — Sidearms tarzı satırlar: numara rozeti, büyük ad, künye */
  function pageRoster() {
    var t = teamFromQuery();
    if (!t) return;
    document.title = t.full + ' Kadrosu — TOFAŞ · DİBA Denizli';
    teamHeader(t, 'kadro');
    var host = $('#rs-list');
    var list = playersOf(t.id);
    if (!list.length) { host.outerHTML = '<p class="sec__sub">Kadro bilgisi yakında eklenecek.</p>'; $('#rs-tools').remove(); return; }
    var sorts = {
      ad: function (a, b) { return a.name.localeCompare(b.name, 'tr'); },
      yil: function (a, b) { return a.born - b.born || a.name.localeCompare(b.name, 'tr'); },
      no: function (a, b) { return (+a.number || 999) - (+b.number || 999) || a.name.localeCompare(b.name, 'tr'); }
    };
    function render(key) {
      host.innerHTML = '';
      list.slice().sort(sorts[key]).forEach(function (p, i) {
        var a = el('a', 'rrow');
        a.href = 'oyuncu.html?id=' + p.id;
        a.innerHTML =
          '<div class="rrow__photo">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="" loading="lazy">' : '<span>' + esc(initials(p.name)) + '</span>') + '</div>' +
          '<div class="rrow__main"><div class="rrow__meta">' + esc([p.position, p.born + ' doğumlu'].filter(Boolean).join(' / ')) + '</div>' +
          '<div class="rrow__name">' + (p.number ? '<span class="rrow__no">' + esc(p.number) + '</span>' : '') + esc(personName(p.name)) + '</div></div>' +
          '<div class="rrow__side"><b>' + esc(t.name) + '</b><span>' + esc(t.league || '') + '</span></div>' +
          '<div class="rrow__go">Profil ' + ARROW + '</div>';
        host.appendChild(a);
      });
      markReveal(host, '.rrow');
      reveal();
    }
    var sel = $('#rs-sort');
    sel.addEventListener('change', function () { render(sel.value); });
    $('#rs-count').textContent = list.length + ' sporcu';
    render('ad');
  }

  /* ------------------------------------------------------ maç istatistikleri */

  function statsOfMatch(id) { return (S.stats || []).filter(function (x) { return x.match === id; }); }
  function statsOfPlayer(id) { return (S.stats || []).filter(function (x) { return x.player === id; }); }
  function secs(min) { var p = String(min || '0:00').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); }
  function mmss(s) { s = Math.round(s); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function pct(m, a) { return a ? Math.round(m / a * 100) + '%' : '–'; }
  function made(m, a) { return m + '/' + a; }
  var STAT_SUM = ['pts', 'fgm', 'fga', 'p2m', 'p2a', 'p3m', 'p3a', 'ftm', 'fta', 'oreb', 'dreb', 'reb', 'ast', 'tov', 'stl', 'blk', 'pf', 'fd', 'eff'];
  function sumStats(rows) {
    var t = { min: 0 };
    STAT_SUM.forEach(function (k) { t[k] = 0; });
    rows.forEach(function (r) { t.min += secs(r.min); STAT_SUM.forEach(function (k) { t[k] += +r[k] || 0; }); });
    return t;
  }
  var BOX_HEAD = '<th>Dk</th><th>Sayı</th><th>2 Sayı</th><th>3 Sayı</th><th>Serbest</th><th title="Hücum ribaundu">HR</th><th title="Savunma ribaundu">SR</th><th>Rib</th><th>Ast</th><th title="Top çalma">TÇ</th><th title="Top kaybı">TK</th><th>Blok</th><th>Faul</th>';
  function boxCells(r, min) {
    return '<td>' + esc(min) + '</td><td class="pts">' + r.pts + '</td>' +
      '<td>' + made(r.p2m, r.p2a) + '</td><td>' + made(r.p3m, r.p3a) + '</td><td>' + made(r.ftm, r.fta) + '</td>' +
      '<td>' + r.oreb + '</td><td>' + r.dreb + '</td><td>' + r.reb + '</td><td>' + r.ast + '</td><td>' + r.stl + '</td><td>' + r.tov + '</td><td>' + r.blk + '</td><td>' + r.pf + '</td>';
  }
  function statPlayerLink(r) {
    var p = playerById(r.player), nm = esc(personName(r.name));
    return p ? '<a href="oyuncu.html?id=' + encodeURIComponent(p.id) + '">' + nm + '</a>' : nm;
  }

  /** Maç sayfası: periyotlar, liderler ve oyuncu istatistikleri */
  function matchStats(m) {
    var sec = $('#mc-statsec');
    if (!sec) return;
    var rows = statsOfMatch(m.id);
    if (!m.quarters && !rows.length) { sec.remove(); return; }
    var pv = perspective(m), us = pv.us, opp = pv.opp;
    var q = $('#mc-quarters');
    if (m.quarters && m.quarters.ours) {
      var head = m.quarters.ours.map(function (_, i) { return '<th>' + (i < 4 ? (i + 1) + '. Periyot' : 'Uzatma') + '</th>'; }).join('');
      var line = function (side, arr) {
        var tot = arr.reduce(function (a, b) { return a + b; }, 0);
        return '<tr><td class="team">' + esc(side.name) + '</td>' + arr.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '<td class="pts">' + tot + '</td></tr>';
      };
      var a = line(us, m.quarters.ours), b = line(opp, m.quarters.theirs);
      q.innerHTML = '<table class="standings boxscore boxscore--q"><thead><tr><th>Takım</th>' + head + '<th>Toplam</th></tr></thead><tbody>' +
        (pv.home ? a + b : b + a) + '</tbody></table>';
    } else q.remove();

    if (!rows.length) { $('#mc-box').remove(); $('#mc-leaders').remove(); $('#mc-boxhead').remove(); }
    else {
      var played = rows.filter(function (r) { return secs(r.min) > 0; });
      var lead = $('#mc-leaders');
      [['pts', 'Sayı'], ['reb', 'Ribaund'], ['ast', 'Asist'], ['eff', 'Verimlilik']].forEach(function (k) {
        var best = played.slice().sort(function (x, y) { return y[k[0]] - x[k[0]]; })[0];
        if (!best) return;
        lead.appendChild(el('div', 'stat', '<b>' + best[k[0]] + '</b><span>' + esc(k[1]) + ' lideri</span><em>' + statPlayerLink(best) + '</em>'));
      });
      var t = sumStats(rows);
      $('#mc-box').innerHTML = '<table class="standings boxscore"><thead><tr><th>No</th><th>Oyuncu</th>' + BOX_HEAD + '<th>+/-</th><th title="Verimlilik">VP</th></tr></thead><tbody>' +
        rows.map(function (r) {
          var dnp = secs(r.min) === 0;
          return '<tr' + (dnp ? ' class="dnp"' : '') + '><td class="pos">' + esc(r.no) + '</td><td class="team">' + statPlayerLink(r) +
            (r.gs ? ' <small title="İlk beş">İ5</small>' : '') + (r.cap ? ' <small title="Kaptan">K</small>' : '') + '</td>' +
            (dnp ? '<td colspan="15" class="muted">Süre almadı</td>' : boxCells(r, r.min) + '<td>' + (r.pm > 0 ? '+' : '') + r.pm + '</td><td>' + r.eff + '</td>') + '</tr>';
        }).join('') +
        '</tbody><tfoot><tr><td></td><td class="team">Toplam</td>' + boxCells(t, mmss(t.min)) + '<td></td><td>' + t.eff + '</td></tr>' +
        '<tr class="pcts"><td></td><td class="team">Yüzde</td><td></td><td></td><td>' + pct(t.p2m, t.p2a) + '</td><td>' + pct(t.p3m, t.p3a) + '</td><td>' + pct(t.ftm, t.fta) + '</td><td colspan="10"></td></tr></tfoot></table>';
      markReveal(lead, '.stat');
    }
    var src = $('#mc-tbf');
    if (m.tbf) src.href = m.tbf; else src.remove();
  }

  /** Oyuncu sayfası: sezon ortalamaları ve maç maç istatistikler */
  function playerStats(p) {
    var sec = $('#pl-statsec');
    if (!sec) return;
    var rows = statsOfPlayer(p.id).map(function (r) { return { r: r, m: matchById(r.match) }; }).filter(function (x) { return x.m; })
      .sort(function (a, b) { return dateKey(a.m.date, a.m.time) - dateKey(b.m.date, b.m.time); });
    var played = rows.filter(function (x) { return secs(x.r.min) > 0; });
    if (!played.length) { sec.remove(); return; }
    var t = sumStats(played.map(function (x) { return x.r; })), n = played.length;
    var avg = function (v) { return (v / n).toFixed(1).replace('.', ','); };
    var box = $('#pl-avg');
    [[n, 'Maç'], [mmss(t.min / n), 'Dakika ort.'], [avg(t.pts), 'Sayı ort.'], [avg(t.reb), 'Ribaund ort.'], [avg(t.ast), 'Asist ort.'], [avg(t.eff), 'Verimlilik ort.']]
      .forEach(function (f) { box.appendChild(el('div', 'stat', '<b style="font-size:24px">' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span>')); });
    markReveal(box, '.stat');
    $('#pl-log').innerHTML = '<table class="standings boxscore"><thead><tr><th>Tarih</th><th>Rakip</th><th>Sonuç</th>' + BOX_HEAD + '<th>VP</th></tr></thead><tbody>' +
      rows.map(function (x) {
        var pv = perspective(x.m, p.team), r = x.r, dnp = secs(r.min) === 0;
        var res = pv.res ? '<span class="' + (pv.res.win ? 'win' : 'loss') + '">' + (pv.res.win ? 'G' : 'M') + '</span> ' + pv.res.mine + '-' + pv.res.theirs : '–';
        return '<tr' + (dnp ? ' class="dnp"' : '') + '><td class="pos">' + esc(x.m.date) + '</td><td class="team"><a href="mac.html?id=' + encodeURIComponent(x.m.id) + '">' + (pv.home ? '' : '@ ') + esc(pv.opp.name) + '</a></td><td>' + res + '</td>' +
          (dnp ? '<td colspan="14" class="muted">Süre almadı</td>' : boxCells(r, r.min) + '<td>' + r.eff + '</td>') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  /* ---------------------------------------------------------- page: player */

  function pagePlayer() {
    var p = playerById(new URLSearchParams(location.search).get('id')) || (S.players || [])[0];
    if (!p) return;
    var t = teamById(p.team);
    document.title = personName(p.name) + ' — TOFAŞ · DİBA Denizli';
    $('#pl-crumb').textContent = personName(p.name);
    var tl = $('#pl-team-link'); tl.textContent = t.full; tl.href = 'kadro.html?id=' + t.id;
    $('#pl-name').textContent = personName(p.name);
    $('#pl-pos').textContent = t.full + (p.position ? ' · ' + p.position : '');
    var media = $('#pl-media');
    media.innerHTML = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="' + esc(personName(p.name)) + '">'
      : '<div class="pcard__ghost">' + esc(initials(p.name)) + '</div>';
    var facts = $('#pl-facts');
    [['Doğum yılı', p.born || '—'], ['Takım', t.name], ['Lig', t.league || '—'], ['Forma no', p.number || '—']]
      .forEach(function (f) { facts.appendChild(el('div', 'stat', '<b style="font-size:21px">' + esc(f[1]) + '</b><span>' + esc(f[0]) + '</span>')); });
    markReveal(facts, '.stat');
    var bio = $('#pl-bio');
    bio.innerHTML = p.bio
      ? String(p.bio).split(/\n{2,}/).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('')
      : '<p>Biyografi yakında eklenecek.</p>';
    var others = $('#pl-others');
    playersOf(t.id).filter(function (x) { return x.id !== p.id; }).slice(0, 6).forEach(function (x) { others.appendChild(playerCard(x)); });
    markReveal(others, '.pcard');
    $('#pl-all').href = 'kadro.html?id=' + t.id;
    playerStats(p);
  }

  /* ----------------------------------------------------------- page: match */

  function pageMatch() {
    var m = matchById(new URLSearchParams(location.search).get('id')) || allMatches()[0];
    if (!m) return;
    document.title = m.home.name + ' - ' + m.away.name + ' — TOFAŞ · DİBA Denizli';
    $('#mc-crumb').textContent = m.home.name + ' - ' + m.away.name;
    $('#mc-comp').textContent = m.comp + ' · ' + m.week;
    $('#mc-home').innerHTML = crest(m.home) + '<b>' + esc(m.home.name) + '</b>';
    $('#mc-away').innerHTML = crest(m.away) + '<b>' + esc(m.away.name) + '</b>';
    var played = isPlayed(m);
    $('#mc-score').innerHTML = played ? esc(m.score) : '<span>' + esc(m.time || 'VS') + '</span>';
    $('#mc-when').textContent = fmtLong(m);
    $('#mc-status').textContent = played ? 'Maç sonucu' : 'Maç henüz oynanmadı';

    var v = venueById(m.venue);
    var rows = [['Tarih', fmtLong(m)], ['Organizasyon', m.comp], ['Hafta', m.week], ['Maç no', m.no]];
    if (v) rows.push(['Salon', v.name]);
    $('#mc-info').innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');

    var links = $('#mc-teams');
    m.teams.filter(function (x, i) { return m.teams.indexOf(x) === i; }).forEach(function (id) {
      var t = teamById(id);
      if (t) links.insertAdjacentHTML('beforeend', '<a class="btn btn--outline btn--sm" href="takim.html?id=' + t.id + '">' + esc(t.full) + '</a>');
    });
    links.insertAdjacentHTML('beforeend', '<a class="btn btn--outline btn--sm" href="https://tbf.org.tr/denizli" target="_blank" rel="noopener">TBF Denizli</a>');

    var vb = $('#mc-venue');
    if (v) {
      vb.querySelector('h3').textContent = v.name;
      vb.querySelector('p').textContent = v.address + (v.capacity ? ' · Kapasite ' + v.capacity : '');
      vb.querySelector('a').href = v.dir;
      $('#mc-map').innerHTML = '<iframe src="' + esc(v.maps) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="' + esc(v.name) + ' konumu"></iframe>';
    } else { vb.remove(); $('#mc-map').remove(); }

    var rel = $('#mc-related');
    var own = m.teams[0];
    var same = allMatches().filter(function (x) { return x.id !== m.id && x.teams.indexOf(own) > -1; });
    var after = same.filter(function (x) { return dateKey(x.date, x.time) >= dateKey(m.date, m.time); }).slice(0, 3);
    (after.length ? after : same.slice(-3)).forEach(function (x) { rel.appendChild(matchRow(x, own)); });
    markReveal(rel, '.game');
    matchStats(m);
  }

  /* ------------------------------------------------------- Excel (.xlsx) */

  /* Kütüphanesiz, gerçek .xlsx: Office Open XML dosyaları sıkıştırmasız ("stored")
     bir ZIP içine yazılır. Başlık satırı kalın, sabit ve filtreli. */
  var CRC_TABLE = (function () {
    var t = [], c;
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zipStore(files) {
    var enc = new TextEncoder(), parts = [], central = [], offset = 0;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = enc.encode(f.data), crc = crc32(data);
      var head = [].concat([0x50, 0x4b, 0x03, 0x04], u16(20), u16(0x0800), u16(0), u16(0), u16(0x21),
        u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
      parts.push(new Uint8Array(head), name, data);
      central.push(new Uint8Array([].concat([0x50, 0x4b, 0x01, 0x02], u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21),
        u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset))), name);
      offset += head.length + name.length + data.length;
    });
    var size = central.reduce(function (n, b) { return n + b.length; }, 0);
    var end = new Uint8Array([].concat([0x50, 0x4b, 0x05, 0x06], u16(0), u16(0), u16(files.length), u16(files.length), u32(size), u32(offset), u16(0)));
    return new Blob(parts.concat(central, [end]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  function xmlEsc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; });
  }
  function colName(i) { var s = ''; i++; while (i) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; }

  /** rows: ilk satır başlık. widths: sütun genişlikleri (karakter). */
  function xlsxBlob(sheetName, rows, widths) {
    var last = colName(rows[0].length - 1) + rows.length;
    var sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
      '<cols>' + widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>' +
      '<sheetData>' + rows.map(function (r, ri) {
        return '<row r="' + (ri + 1) + '">' + r.map(function (v, ci) {
          var ref = colName(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : '';
          if (typeof v === 'number') return '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>';
          return '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(v) + '</t></is></c>';
        }).join('') + '</row>';
      }).join('') + '</sheetData>' +
      '<autoFilter ref="A1:' + last + '"/></worksheet>';
    var files = [
      { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + xmlEsc(sheetName.slice(0, 31)) + '" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">\'' + xmlEsc(sheetName.slice(0, 31)) + '\'!$A$1:$' + colName(rows[0].length - 1) + '$' + rows.length + '</definedName></definedNames></workbook>' },
      { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1D2751"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' },
      { name: 'xl/worksheets/sheet1.xml', data: sheet }
    ];
    return zipStore(files);
  }

  /** Maç listesini Excel olarak indirir. teamId verilirse o takımın gözünden yazar. */
  function downloadFixtures(list, teamId, fileLabel) {
    var head = ['Tarih', 'Gün', 'Saat', 'Takımımız', 'Lig', 'Hafta', 'Maç No', 'Ev Sahibi', 'Misafir', 'Rakip', 'İç saha / Deplasman', 'Sonuç', 'Skor', 'Salon', 'Adres'];
    var rows = [head].concat(list.map(function (m) {
      var p = perspective(m, teamId), v = venueById(m.venue), d = dateKey(m.date, m.time);
      return [m.date, DAYS[d.getDay()], m.time || '', p.us.name, m.comp, m.week, m.no, m.home.name, m.away.name, p.opp.name,
        p.home ? 'İç saha' : 'Deplasman', p.res ? (p.res.win ? 'Galibiyet' : 'Mağlubiyet') : 'Oynanmadı',
        p.res ? p.res.mine + '-' + p.res.theirs : '', v ? v.name : '', v ? v.address : ''];
    }));
    var blob = xlsxBlob('Fikstür', rows, [12, 11, 7, 14, 22, 9, 10, 32, 32, 32, 17, 12, 8, 44, 42]);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'DIBA-fikstur-2026-2027' + (fileLabel ? '-' + fileLabel : '') + '.xlsx';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function fileSlug(s) {
    return String(s).toLocaleLowerCase('tr-TR').replace(/[çğıöşü]/g, function (c) { return { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c]; }).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* -------------------------------------------------------- page: fixtures */

  function pageFixtures() {
    var host = $('#fixtures');
    if (!host) return;
    var all = allMatches();
    var tabs = [['Tümü', null]];
    (S.teams || []).filter(function (t) { return t.league; }).forEach(function (t) { tabs.push([t.name, t.id]); });
    var current = 0;
    function filtered(i) { var id = tabs[i][1]; return all.filter(function (m) { return !id || m.teams.indexOf(id) > -1; }); }
    function render(i) {
      current = i;
      host.innerHTML = '';
      var month = '', id = tabs[i][1];
      all.filter(function (m) { return !id || m.teams.indexOf(id) > -1; }).forEach(function (m) {
        var d = dateKey(m.date, m.time), key = MONTHS[d.getMonth()] + ' ' + d.getFullYear();
        if (key !== month) { month = key; host.appendChild(el('h3', 'fx-month', esc(key))); }
        host.appendChild(matchRow(m, id));
      });
      markReveal(host, '.game');
      reveal();
    }
    var t = $('#fixturetabs');
    if (t) buildTabs(t, tabs.map(function (x) { return x[0]; }), render);
    render(0);
    var xb = $('#fx-excel');
    if (xb) xb.addEventListener('click', function () {
      downloadFixtures(filtered(current), tabs[current][1], current ? fileSlug(tabs[current][0]) : 'tum-takimlar');
    });

    var sum = $('#fxsummary');
    if (sum) {
      var played = all.filter(isPlayed).length;
      [['Lig maçı', all.length], ['Oynanan', played], ['Kalan', all.length - played], ['Takım', tabs.length - 1]]
        .forEach(function (x) { sum.appendChild(el('div', 'stat', '<b>' + x[1] + '</b><span>' + x[0] + '</span>')); });
      markReveal(sum, '.stat');
    }
  }

  /* --------------------------------------------------------- page: coaches */

  /** Baş antrenör vitrini — TOFAŞ teknik kadro sayfasındaki .coach */
  function coachSpot(c) {
    var d = el('a', 'coach');
    d.href = 'antrenor.html?id=' + c.id;
    d.innerHTML =
      '<div class="coach__media pcard__media">' +
      (c.photo
        ? '<img src="' + esc(c.photo) + '" alt="' + esc(personName(c.name)) + '">'
        : '<div class="pcard__ghost">' + esc(initials(c.name)) + '</div>') +
      '</div>' +
      '<div class="coach__body"><span class="eyebrow coach__role">' + esc(c.title) + '</span>' +
      '<h2 class="coach__name">' + esc(personName(c.name)) + '</h2>' +
      '<p class="coach__bio">' + (c.bio ? esc(String(c.bio).split(/\n/)[0]) : 'Biyografi yakında eklenecek.') + '</p>' +
      '<span class="link-more" style="margin-top:14px">Profili gör ' + ARROW + '</span></div>';
    return d;
  }

  function pageCoaches() {
    var list = S.coaches || [];
    var heads = list.filter(function (c) { return /baş antrenör/i.test(c.title); });
    var rest = list.filter(function (c) { return heads.indexOf(c) === -1; });
    var hh = $('#headcoaches'), sh = $('#staff');
    if (hh) { heads.forEach(function (c) { hh.appendChild(coachSpot(c)); }); markReveal(hh, '.coach'); }
    if (sh) { rest.forEach(function (c) { sh.appendChild(staffCard(c)); }); markReveal(sh, '.scard'); }
  }

  var SOCIAL_LABEL = { instagram: 'Instagram', x: 'X', twitter: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook', tiktok: 'TikTok' };

  /** Antrenör profili — fotoğraf, unvan, biyografi, sosyal medya */
  function pageCoach() {
    var c = coachById(new URLSearchParams(location.search).get('id')) || (S.coaches || [])[0];
    if (!c) return;
    document.title = personName(c.name) + ' — Antrenörlerimiz — TOFAŞ · DİBA Denizli';
    $('#co-crumb').textContent = personName(c.name);
    $('#co-name').textContent = personName(c.name);
    $('#co-title').textContent = c.title;
    $('#co-media').innerHTML = c.photo
      ? '<img src="' + esc(c.photo) + '" alt="' + esc(personName(c.name)) + '">'
      : '<div class="pcard__ghost">' + esc(initials(c.name)) + '</div>';
    var facts = $('#co-facts');
    [['Görev', c.title], ['Sezon', '2026-2027'], ['Kulüp', 'TOFAŞ · DİBA']]
      .forEach(function (f) { facts.appendChild(el('div', 'stat', '<b style="font-size:17px">' + esc(f[1]) + '</b><span>' + esc(f[0]) + '</span>')); });
    var soc = $('#co-social');
    var links = Object.keys(c.social || {}).filter(function (k) { return c.social[k]; });
    if (links.length) links.forEach(function (k) {
      soc.insertAdjacentHTML('beforeend', '<a class="btn btn--outline btn--sm" href="' + esc(c.social[k]) + '" target="_blank" rel="noopener">' + esc(SOCIAL_LABEL[k] || k) + ' ' + ARROW + '</a>');
    });
    else soc.remove();
    $('#co-bio').innerHTML = c.bio
      ? String(c.bio).split(/\n{2,}/).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('')
      : '<p>Biyografi yakında eklenecek.</p>';
    var others = $('#co-others');
    (S.coaches || []).filter(function (x) { return x.id !== c.id; }).forEach(function (x) { others.appendChild(staffCard(x)); });
    markReveal(others, '.scard');
  }

  /* --------------------------------------------------------- page: gallery */

  function pageGallery() {
    var host = $('#albums');
    if (!host) return;
    var photos = sortedPosts().filter(function (p) { return p.type !== 'video'; });
    var list = photos.filter(function (p) { return !!postImgSrc(p); });
    photos.forEach(function (p) { host.appendChild(photoTile(p, list)); });
    markReveal(host, '.tile');
  }

  /* ---------------------------------------------------------- page: videos */

  function pageVideos() {
    var host = $('#videos');
    if (!host) return;
    sortedPosts().filter(function (p) { return p.type === 'video'; }).forEach(function (p) {
      var a = el('a', 'tile'), ext = extLink(p);
      a.href = ext || postLink(p);
      if (ext) { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML =
        '<div class="tile__media ph">' + postImg(p, p.title, true) + '</div>' +
        '<div class="tile__play"><span><svg viewBox="0 0 16 16"><path d="M3 1.5 14 8 3 14.5z"/></svg></span></div>' +
        '<div class="tile__body"><h3 class="tile__title">' + esc(p.title) + '</h3>' +
        '<div class="tile__meta">' + esc(fmtDate(p.date)) + (ext ? ' · ' + (/instagram\.com/.test(ext) ? 'Instagram’da izle' : 'İzle') : '') + '</div></div>';
      host.appendChild(a);
    });
    markReveal(host, '.tile');
  }

  /* ------------------------------------------------------------ page: post */

  function pagePost() {
    var posts = sortedPosts(), id = new URLSearchParams(location.search).get('id');
    var p = posts.filter(function (x) { return x.code === id; })[0] || posts[0];
    if (!p) return;
    document.title = p.title + ' — TOFAŞ · DİBA Denizli';
    $('#pt-crumb').textContent = p.title;
    $('#pt-title').textContent = p.title;
    $('#pt-meta').innerHTML = '<span class="tag tag--blue">' + esc(CAT_LABEL[p.cat] || 'Haber') + '</span><span class="date">' + esc(fmtDate(p.date)) + '</span>';
    var media = $('#pt-media'), img = postImg(p, p.title, false, '');
    if (img) media.innerHTML = img; else media.remove();
    $('#pt-body').innerHTML = (p.text || '').split(/\n{2,}|\n/).filter(Boolean)
      .map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var ext = extLink(p);
    if (ext) $('#pt-acts').insertAdjacentHTML('afterbegin',
      '<a class="btn btn--primary btn--sm" href="' + esc(ext) + '" target="_blank" rel="noopener">' + extLabel(ext) + ' ' + ARROW + '</a>');
    var rel = $('#pt-related');
    posts.filter(function (x) { return x !== p; }).slice(0, 3).forEach(function (x) { rel.appendChild(newsCard(x)); });
    markReveal(rel, '.card');
  }

  /* ------------------------------------------------------------ page: news */

  function pageNews() {
    var host = $('#newslist');
    if (!host) return;
    var posts = sortedPosts();
    function render(i) {
      host.innerHTML = '';
      posts.filter(function (p) { return !CATS[i][1] || p.cat === CATS[i][1]; })
        .forEach(function (p) { host.appendChild(newsCard(p, i === 0 ? null : CATS[i][0])); });
      markReveal(host, '.card');
      reveal();
    }
    var t = $('#newslisttabs');
    if (t) buildTabs(t, CATS.map(function (c) { return c[0]; }), render);
    render(0);
  }

  /* -------------------------------------------------------- page: register */

  function groupForYear(y) {
    return (S.groups || []).filter(function (g) { return g.years.indexOf(+y) > -1; })[0] || null;
  }
  function normalizePhone(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.indexOf('90') === 0 && d.length === 12) d = d.slice(2);
    if (d.charAt(0) === '0' && d.length === 11) d = d.slice(1);
    return /^5\d{9}$/.test(d) ? d : null;
  }
  function fmtPhone(d) { return '0' + d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 8) + ' ' + d.slice(8); }

  function faq() {
    var host = $('#faq');
    if (!host) return;
    (S.faq || []).forEach(function (f, i) {
      var d = el('details');
      if (i === 0) d.open = true;
      d.innerHTML = '<summary>' + esc(f.q) + '</summary><p class="faq__a">' +
        (f.a ? esc(f.a) : 'Bu konuda bilgi için bizi arayın: <a href="' + SC.tel + '">' + esc(SC.phoneDisplay) + '</a>') + '</p>';
      host.appendChild(d);
    });
    markReveal(host, 'details');
  }

  function pageRegister() {
    faq();
    var form = $('#kayitform');
    if (!form) return;
    var yearSel = form.elements.dogum;
    var sug = $('#suggest');

    // Doğum yılı seçenekleri: grupların kapsadığı yıllar + "Diğer"
    var years = [];
    (S.groups || []).forEach(function (g) { years = years.concat(g.years); });
    for (var y = Math.max.apply(null, years); y >= Math.min.apply(null, years); y--) yearSel.appendChild(new Option(String(y), String(y)));
    yearSel.appendChild(new Option('Diğer', 'diger'));

    function suggestion() {
      var v = yearSel.value;
      if (!v) { sug.hidden = true; return; }
      var g = groupForYear(v);
      sug.innerHTML = g
        ? 'Önerilen grup: <b>' + esc(g.name) + '</b> (' + esc(g.age) + ')'
        : '6–16 yaş dışı için uygun grubu telefonda konuşalım: <a href="' + SC.tel + '">' + esc(SC.phoneDisplay) + '</a>';
      sug.hidden = false;
    }
    yearSel.addEventListener('change', suggestion);

    // ?grup=u12 ile gelindiyse o grubun yılını seç
    var pre = new URLSearchParams(location.search).get('grup');
    var preG = (S.groups || []).filter(function (g) { return g.id === pre; })[0];
    if (preG) { yearSel.value = String(Math.max.apply(null, preG.years)); suggestion(); }

    var rules = {
      veli: function (v) {
        v = v.trim();
        if (!v) return 'Lütfen adınızı ve soyadınızı yazın.';
        if (v.split(/\s+/).length < 2) return 'Ad ve soyadınızı birlikte yazın.';
        return '';
      },
      telefon: function (v) {
        if (!v.trim()) return 'Size ulaşabilmemiz için telefon numarası gerekli.';
        return normalizePhone(v) ? '' : 'Geçerli bir cep telefonu yazın (ör. 0540 244 19 74).';
      },
      cocuk: function (v) { return v.trim().length >= 2 ? '' : 'Lütfen çocuğunuzun adını yazın.'; },
      dogum: function (v) { return v ? '' : 'Lütfen doğum yılını seçin.'; },
      oynadi: function (v) { return v ? '' : 'Lütfen bir seçenek işaretleyin.'; },
      not: function (v) { return v.length > 500 ? 'Not en fazla 500 karakter olabilir.' : ''; }
    };
    var tried = false;

    function value(name) { var f = form.elements[name]; return f && f.value != null ? f.value : ''; }
    function nodes(name) { var f = form.elements[name]; return f.length && !f.tagName ? Array.prototype.slice.call(f) : [f]; }
    function check(name) {
      var msg = rules[name](value(name));
      var err = $('#err-' + name);
      if (err) err.textContent = msg;
      nodes(name).forEach(function (n) { n.setAttribute('aria-invalid', String(!!msg)); });
      return !msg;
    }

    Object.keys(rules).forEach(function (name) {
      nodes(name).forEach(function (n) {
        n.addEventListener(n.type === 'radio' || n.tagName === 'SELECT' ? 'change' : 'blur', function () { if (tried || n.value) check(name); });
        n.addEventListener('input', function () { if (tried) check(name); });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var bad = Object.keys(rules).filter(function (n) { return !check(n); });
      if (bad.length) { nodes(bad[0])[0].focus(); return; }

      var g = groupForYear(value('dogum'));
      var lines = [
        'Merhaba, Denizli Tofaş Basketbol Okulları için ön kayıt yapmak istiyorum.',
        '',
        'Veli: ' + value('veli').trim(),
        'Telefon: ' + fmtPhone(normalizePhone(value('telefon'))),
        'Çocuğun adı: ' + value('cocuk').trim(),
        'Doğum yılı: ' + (value('dogum') === 'diger' ? 'Diğer' : value('dogum')) + (g ? ' (önerilen grup: ' + g.name + ')' : ''),
        'Daha önce basketbol oynadı mı: ' + value('oynadi')
      ];
      if (value('not').trim()) lines.push('Not: ' + value('not').trim());
      var url = SC.wa + '?text=' + encodeURIComponent(lines.join('\n'));

      var done = $('#formdone');
      if (done) { $('a', done).href = url; done.hidden = false; }
      // 'noopener' özelliği window.open'ı her zaman null döndürür; bu yüzden elle kesiyoruz
      var w = window.open(url, '_blank');
      if (w) w.opener = null;
      else location.href = url;
    });
  }

  /* ------------------------------------------------ canlı veri (Supabase) */

  /* Site verisi yönetim panelinden girilir ve Supabase'deki web_* tablolarında durur.
     Sayfa açılırken bu tablolar okunur (açılış ekranı bu sırada görünür). Supabase'e
     ulaşılamazsa data/site.js'teki yedek veriyle devam edilir. */
  var CFG = window.SUPABASE_CONFIG || null;
  var REMOTE_TABLES = {
    web_settings: '',
    web_teams: '&is_active=eq.true&order=sort,name',
    web_opponents: '',
    web_venues: '&order=sort,name',
    web_players: '&is_active=eq.true&order=sort,name',
    web_coaches: '&is_active=eq.true&order=sort,name',
    web_matches: '&order=match_date,match_time',
    web_posts: '&is_published=eq.true&order=post_date.desc',
    web_faq: '&is_active=eq.true&order=sort',
    web_match_stats: '&order=match_id,sort'
  };
  /* Bu tablolar okunamazsa (ör. henüz oluşturulmadıysa) site yine canlı veriyle açılır */
  var OPTIONAL_TABLES = { web_match_stats: true };

  function fetchTable(t) {
    return fetch(CFG.url + '/rest/v1/' + t + '?select=*' + REMOTE_TABLES[t], {
      headers: { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key }
    }).then(function (r) {
      if (!r.ok) throw new Error(t + ' ' + r.status);
      return r.json();
    }).catch(function (e) {
      if (OPTIONAL_TABLES[t]) return [];
      throw e;
    });
  }
  function isoToTr(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? m[3] + '.' + m[2] + '.' + m[1] : ''; }
  function hhmm(t) { return t ? String(t).slice(0, 5) : ''; }

  /** Supabase satırlarını sitenin kullandığı biçime çevirir. */
  function toSite(r) {
    var settings = {}; r.web_settings.forEach(function (x) { settings[x.key] = x.value; });
    var okul = settings.okul || {};
    var teams = r.web_teams.map(function (t) {
      return { id: t.id, group: t.group_code, name: t.name, full: t.full_name, league: t.league || '', tbf: t.tbf_url || '', photo: t.photo_url || '',
        yearsLabel: t.years_label || '', age: t.age_label || '', years: t.birth_years || [], note: t.note || '' };
    });
    var groups = [], seen = {};
    teams.forEach(function (t) {
      if (seen[t.group]) { seen[t.group].count++; return; }
      seen[t.group] = { id: t.group, name: t.name, age: t.age, yearsLabel: t.yearsLabel, years: t.years, note: t.note, text: t.note, count: 1 };
      groups.push(seen[t.group]);
    });
    groups.forEach(function (g) { if (g.count > 1) g.name = g.id.toUpperCase(); });
    var opp = {}; r.web_opponents.forEach(function (o) { opp[o.id] = o; });
    var league = r.web_matches.map(function (m) {
      var ours = { team: m.team_id };
      var other = m.opponent_team_id ? { team: m.opponent_team_id }
        : opp[m.opponent_id] ? { name: opp[m.opponent_id].name, logo: opp[m.opponent_id].logo_url || '' }
        : { name: m.opponent_name || 'Rakip', logo: '' };
      var scored = m.our_score != null && m.their_score != null;
      return {
        id: m.id, no: m.code || '', comp: m.competition || '', week: m.week || '', date: isoToTr(m.match_date), time: hhmm(m.match_time),
        home: m.is_home ? ours : other, away: m.is_home ? other : ours, venue: m.venue_id, status: m.status,
        quarters: m.quarters || null, tbf: m.tbf_url || '',
        score: scored ? (m.is_home ? m.our_score + '-' + m.their_score : m.their_score + '-' + m.our_score) : ''
      };
    });
    return {
      school: {
        name: okul.name || SC.name, phoneDisplay: okul.phone_display || SC.phoneDisplay, tel: okul.tel || SC.tel, wa: okul.whatsapp || SC.wa,
        venue: okul.venue || SC.venue, address: okul.address || SC.address, instagram: okul.instagram || SC.instagram
      },
      groups: groups,
      teams: teams,
      players: r.web_players.map(function (p) {
        return { id: p.id, name: p.name, born: p.born || '', team: p.team_id, number: p.number == null ? '' : String(p.number), position: p.position || '', photo: p.photo_url || '', bio: p.bio || '' };
      }),
      coaches: r.web_coaches.map(function (c) {
        return { id: c.id, name: c.name, title: c.title, photo: c.photo_url || '', bio: c.bio || '', social: c.social || {} };
      }),
      venues: r.web_venues.map(function (v) {
        return { id: v.id, name: v.name, short: v.short_name || v.name, use: v.use_text || '', address: v.address || '', capacity: v.capacity || '',
          maps: v.maps_embed || '', dir: v.directions_url || '', photo: v.photo_url || '', listed: v.listed };
      }),
      league: league,
      posts: r.web_posts.map(function (p) {
        return { code: p.id, date: isoToTr(p.post_date), type: p.type, cat: p.cat, title: p.title, text: p.body || '', groups: p.groups || [],
          via: p.via || '', image: p.image_url || '', link: p.link_url || '' };
      }),
      faq: r.web_faq.map(function (f) { return { q: f.question, a: f.answer || '' }; }),
      stats: r.web_match_stats.map(function (x) {
        return { match: x.match_id, player: x.player_id, name: x.player_name, no: x.jersey || '', gs: x.starter, cap: x.captain, min: x.minutes || '0:00',
          pts: x.pts, fgm: x.fgm, fga: x.fga, p2m: x.p2m, p2a: x.p2a, p3m: x.p3m, p3a: x.p3a, ftm: x.ftm, fta: x.fta,
          oreb: x.oreb, dreb: x.dreb, reb: x.reb, ast: x.ast, tov: x.tov, stl: x.stl, blk: x.blk, pf: x.pf, fd: x.fd, pm: x.plus_minus, eff: x.eff };
      })
    };
  }

  function loadRemote() {
    if (!CFG || !window.fetch || !window.Promise) return Promise.resolve(null);
    var names = Object.keys(REMOTE_TABLES);
    var timeout = new Promise(function (_, rej) { setTimeout(function () { rej(new Error('zaman aşımı')); }, 4500); });
    return Promise.race([Promise.all(names.map(fetchTable)), timeout]).then(function (rows) {
      var r = {}; names.forEach(function (n, i) { r[n] = rows[i]; });
      return toSite(r);
    }).catch(function (e) {
      console.warn('[site] canlı veri alınamadı, yedek veri kullanılıyor:', e.message);
      return null;
    });
  }

  /** Header'daki Takım menüsünü güncel takım listesinden kurar. */
  function teamMenu() {
    var trigger = $$('.nav__link').filter(function (a) { return /^Takım/.test(a.textContent.trim()); })[0];
    var menu = trigger && trigger.parentNode.querySelector('.nav__menu');
    if (!menu || !(S.teams || []).length) return;
    menu.innerHTML = S.teams.map(function (t) { return '<a href="takim.html?id=' + encodeURIComponent(t.id) + '">' + esc(t.name) + '</a>'; }).join('') +
      '<a href="fikstur.html">Tüm Fikstür</a>';
  }

  /* --------------------------------------------------------- page: venues */

  function pageVenues() {
    var host = $('#venues');
    if (!host) return;
    (S.venues || []).filter(function (v) { return v.listed !== false; }).forEach(function (v) {
      var a = el('article', 'venue');
      a.innerHTML =
        '<div class="venue__photo ph">' + (v.photo ? '<img src="' + esc(v.photo) + '" alt="' + esc(v.name) + '" loading="lazy">' : '<span class="team-photo__note">Salon fotoğrafı yakında</span>') + '</div>' +
        '<div class="venue__body">' + (v.use ? '<span class="eyebrow">' + esc(v.use) + '</span>' : '') +
        '<h3>' + esc(v.name) + '</h3>' + (v.address ? '<p>' + esc(v.address) + '</p>' : '') +
        (v.capacity ? '<p><strong>Kapasite:</strong> ' + esc(v.capacity) + '</p>' : '') +
        (v.dir ? '<div class="btnrow" style="margin-top:auto"><a class="btn btn--primary btn--sm" href="' + esc(v.dir) + '" target="_blank" rel="noopener">Yol tarifi al ' + ARROW + '</a></div>' : '') +
        '</div>' +
        (v.maps ? '<div class="venue__map"><iframe src="' + esc(v.maps) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="' + esc(v.name) + ' konumu"></iframe></div>' : '');
      host.appendChild(a);
    });
    markReveal(host, '.venue');
  }

  /* ----------------------------------------------------------------- boot */

  /** Açılış ekranı: TOFAŞ · DİBA logoları sayfa yüklenene kadar görünür, sonra solar.
   *  JS çalışmazsa CSS'teki zaman aşımı ekranı yine kaldırır. */
  function loader() {
    var l = $('.loader');
    if (!l) return;
    var shown = Date.now(), done = false;
    function hide() {
      if (done) return;
      done = true;
      var wait = Math.max(0, 1600 - (Date.now() - shown));   // logolar tam görünsün
      setTimeout(function () {
        l.classList.add('is-done');
        setTimeout(function () { l.remove(); }, 400);
      }, reduce ? 0 : wait);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 3500);   // yavaş bağlantıda harita/görsel beklenmez
  }

  function render() {
    header();
    teamMenu();
    var page = document.body.getAttribute('data-page');
    try {
      ({
        home: pageHome, team: pageTeam, roster: pageRoster, player: pagePlayer, match: pageMatch, fixtures: pageFixtures,
        coaches: pageCoaches, coach: pageCoach, gallery: pageGallery, videos: pageVideos, venues: pageVenues,
        news: pageNews, post: pagePost, register: pageRegister
      }[page] || function () {})();
    } catch (err) {
      console.error('[denizli-tofas] render error', err);
    }
    reveal();
  }

  /* Oyuncu fotoğrafları veli onayı alınana kadar yalnız yerelde görünür:
     data/yerel.js (git dışı) yalnız localhost'ta yüklenir, canlı sitede istenmez. */
  function loadLocal() {
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return Promise.resolve();
    return new Promise(function (done) {
      var s = document.createElement('script');
      s.src = 'data/yerel.js?v=' + Date.now();
      s.onload = s.onerror = function () { done(); };
      document.head.appendChild(s);
    });
  }
  function applyLocal() {
    var f = window.YEREL_FOTOLAR;
    if (!f) return;
    (S.players || []).forEach(function (p) { if (!p.photo && f[p.id]) p.photo = f[p.id]; });
  }

  function boot() {
    loader();
    Promise.all([loadRemote(), loadLocal()]).then(function (res) {
      var remote = res[0];
      if (remote) { S = remote; SC = S.school; MATCHES = null; }
      applyLocal();
      render();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
