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
  function postUrl(code) { return 'https://www.instagram.com/p/' + code + '/'; }
  function imgTag(code, alt, small, attrs) {
    if (!hasPhoto(code)) return '';
    return '<img src="' + igSrc(code, small) + '" alt="' + esc(alt || '') + '" ' + (attrs == null ? 'loading="lazy"' : attrs) + ' decoding="async">';
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

  /** Haber kartı — TOFAŞ kartı; Instagram gönderisine gider. */
  function newsCard(p, badge) {
    var a = el('a', 'card');
    a.href = postUrl(p.code);
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML =
      '<div class="card__media ph">' +
      (badge ? '<span class="tag tag--blue card__badge">' + esc(badge) + '</span>' : '') +
      imgTag(p.code, p.title, true) + '</div>' +
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
    return { name: x.name, logo: x.logo ? 'assets/teams/' + x.logo + '.png' : '' };
  }
  var MATCHES = null;
  function allMatches() {
    if (MATCHES) return MATCHES;
    MATCHES = (S.league || []).map(function (m) {
      var h = normSide(m.home), a = normSide(m.away);
      return {
        id: m.id, no: m.no, comp: m.comp, week: m.week, date: m.date, time: m.time,
        home: h, away: a, score: m.score || '', venue: m.venue,
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
    return list.filter(function (m) { return !isPlayed(m) && dateKey(m.date, m.time) >= now; });
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
      '<div class="game__where"><b>' + esc(m.time || 'Saat TBA') + '</b><span>' + esc(v ? v.short : '') + '</span></div>' +
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
      img.src = igSrc(p.code);
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
   *  yoksa Instagram gönderisine gider. */
  function photoTile(p, list) {
    var a = el('a', 'tile');
    a.href = postUrl(p.code);
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML =
      '<div class="tile__media ph">' + imgTag(p.code, p.title, true) + '</div>' +
      '<div class="tile__body"><h3 class="tile__title">' + esc(p.title) + '</h3>' +
      '<div class="tile__meta">' + esc(fmtDate(p.date)) + (p.type === 'video' ? ' · Video' : '') + '</div></div>';
    if (hasPhoto(p.code)) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        LB.open(list, list.indexOf(p));
      });
    }
    return a;
  }
  function photoList() { return sortedPosts().filter(function (p) { return hasPhoto(p.code); }); }

  /* ------------------------------------------------------------ page: home */

  function pageHome() {
    /* --- slider (TOFAŞ) */
    var track = $('#slidertrack'), dots = $('#sliderdots');
    var slides = (S.slider || []).map(postByCode).filter(Boolean);
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
          imgTag(p.code, '', false, i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') +
          '<div class="slide__body">' +
          '<div class="slide__meta"><span class="tag">' + esc(CAT_LABEL[p.cat] || 'Haber') + '</span><span class="date">' + esc(fmtDate(p.date)) + '</span></div>' +
          '<h2 class="slide__title">' + esc(p.title) + '</h2>' +
          '<a class="btn btn--onblue btn--sm" href="' + postUrl(p.code) + '" target="_blank" rel="noopener">Instagram’da gör ' + ARROW + '</a>' +
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
    document.title = t.full + ' — TOFAŞ × DİBA Denizli';
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
    if (ms.length) { ms.forEach(function (m) { fx.appendChild(matchRow(m, t.id)); }); markReveal(fx, '.game'); }
    else fx.appendChild(el('p', 'sec__sub', 'Bu yaş grubunun TBF liginde maçı yok.'));

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
    document.title = t.full + ' Kadrosu — TOFAŞ × DİBA Denizli';
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
    $('#rs-count').textContent = list.length + ' sporcu · TBF lisans listesi';
    render('ad');
  }

  /* ---------------------------------------------------------- page: player */

  function pagePlayer() {
    var p = playerById(new URLSearchParams(location.search).get('id')) || (S.players || [])[0];
    if (!p) return;
    var t = teamById(p.team);
    document.title = personName(p.name) + ' — TOFAŞ × DİBA Denizli';
    $('#pl-crumb').textContent = personName(p.name);
    var tl = $('#pl-team-link'); tl.textContent = t.full; tl.href = 'kadro.html?id=' + t.id;
    $('#pl-name').textContent = personName(p.name);
    $('#pl-pos').textContent = t.full + (p.position ? ' · ' + p.position : '');
    var media = $('#pl-media');
    media.innerHTML = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="' + esc(personName(p.name)) + '">'
      : '<div class="pcard__ghost">' + esc(initials(p.name)) + '</div>';
    var facts = $('#pl-facts');
    [['Doğum yılı', p.born], ['Takım', t.name], ['Lig', t.league || '—'], ['Forma no', p.number || '—']]
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
  }

  /* ----------------------------------------------------------- page: match */

  function pageMatch() {
    var m = matchById(new URLSearchParams(location.search).get('id')) || allMatches()[0];
    if (!m) return;
    document.title = m.home.name + ' - ' + m.away.name + ' — TOFAŞ × DİBA Denizli';
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
  }

  /* -------------------------------------------------------- page: fixtures */

  function pageFixtures() {
    var host = $('#fixtures');
    if (!host) return;
    var all = allMatches();
    var tabs = [['Tümü', null]];
    (S.teams || []).filter(function (t) { return t.league; }).forEach(function (t) { tabs.push([t.name, t.id]); });
    function render(i) {
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
    document.title = personName(c.name) + ' — Antrenörlerimiz — TOFAŞ × DİBA Denizli';
    $('#co-crumb').textContent = personName(c.name);
    $('#co-name').textContent = personName(c.name);
    $('#co-title').textContent = c.title;
    $('#co-media').innerHTML = c.photo
      ? '<img src="' + esc(c.photo) + '" alt="' + esc(personName(c.name)) + '">'
      : '<div class="pcard__ghost">' + esc(initials(c.name)) + '</div>';
    var facts = $('#co-facts');
    [['Görev', c.title], ['Sezon', '2026-2027'], ['Kulüp', 'TOFAŞ × DİBA']]
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
    var list = photos.filter(function (p) { return hasPhoto(p.code); });
    photos.forEach(function (p) { host.appendChild(photoTile(p, list)); });
    markReveal(host, '.tile');
  }

  /* ---------------------------------------------------------- page: videos */

  function pageVideos() {
    var host = $('#videos');
    if (!host) return;
    sortedPosts().filter(function (p) { return p.type === 'video'; }).forEach(function (p) {
      var a = el('a', 'tile');
      a.href = postUrl(p.code);
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML =
        '<div class="tile__media ph">' + imgTag(p.code, p.title, true) + '</div>' +
        '<div class="tile__play"><span><svg viewBox="0 0 16 16"><path d="M3 1.5 14 8 3 14.5z"/></svg></span></div>' +
        '<div class="tile__body"><h3 class="tile__title">' + esc(p.title) + '</h3>' +
        '<div class="tile__meta">' + esc(fmtDate(p.date)) + ' · Instagram’da izle</div></div>';
      host.appendChild(a);
    });
    markReveal(host, '.tile');
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

  /* ----------------------------------------------------------------- boot */

  /** Açılış ekranı: TOFAŞ × DİBA logoları sayfa yüklenene kadar görünür, sonra solar.
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

  function boot() {
    loader();
    header();
    var page = document.body.getAttribute('data-page');
    try {
      ({
        home: pageHome, team: pageTeam, roster: pageRoster, player: pagePlayer, match: pageMatch, fixtures: pageFixtures,
        coaches: pageCoaches, coach: pageCoach, gallery: pageGallery, videos: pageVideos,
        news: pageNews, register: pageRegister
      }[page] || function () {})();
    } catch (err) {
      console.error('[denizli-tofas] render error', err);
    }
    reveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
