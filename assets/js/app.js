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

  /** Lig ve hazırlık maçlarını tek biçime getirir. Bizim taraf her zaman DİBA logosuyla. */
  function normSide(x, teamIds) {
    if (typeof x === 'string') {
      var us = /tofa/i.test(x);
      return us ? { us: true, name: 'DİBA', logo: DIBA_LOGO, team: null } : { name: x, logo: '' };
    }
    if (x.team) {
      var t = teamById(x.team);
      return { us: true, name: 'DİBA ' + (t ? t.name : ''), logo: DIBA_LOGO, team: x.team };
    }
    return { name: x.name, logo: x.logo ? 'assets/teams/' + x.logo + '.png' : '' };
  }
  var MATCHES = null;
  function allMatches() {
    if (MATCHES) return MATCHES;
    var lg = (S.league || []).map(function (m) {
      var h = normSide(m.home), a = normSide(m.away);
      return {
        id: m.id, kind: 'lig', no: m.no, comp: m.comp, week: m.week, date: m.date, time: m.time,
        home: h, away: a, score: m.score || '', venue: m.venue,
        teams: [h.team, a.team].filter(Boolean),
        label: [h.team, a.team].filter(Boolean).map(function (id) { return teamById(id).name; }).join(' · ')
      };
    });
    var hz = (S.matches || []).map(function (m) {
      return {
        id: m.id, kind: 'hazirlik', comp: 'Hazırlık Maçı', week: '', date: m.date, time: '',
        home: normSide(m.home), away: normSide(m.away), score: '', venue: '', post: m.post,
        groups: m.teams || [], label: m.groups
      };
    });
    MATCHES = lg.concat(hz).sort(function (a, b) { return dateKey(a.date, a.time) - dateKey(b.date, b.time); });
    return MATCHES;
  }
  function matchById(id) { return allMatches().filter(function (m) { return m.id === id; })[0]; }
  /** Bir takımın maçları: lig maçları takım kimliğiyle, hazırlık maçları yaş grubuyla eşleşir. */
  function matchesOfTeam(t) {
    return allMatches().filter(function (m) {
      return m.kind === 'lig' ? m.teams.indexOf(t.id) > -1 : m.groups.indexOf(t.group) > -1;
    });
  }
  function isPlayed(m) { return m.kind === 'hazirlik' || /\d/.test(m.score); }
  function upcoming(list) {
    var now = new Date();
    return list.filter(function (m) { return !isPlayed(m) && dateKey(m.date, m.time) >= now; });
  }

  function crest(side) {
    if (side.logo) return '<img src="' + esc(side.logo) + '" alt="" loading="lazy">';
    return '<span class="crest" aria-hidden="true">' + esc(initials(side.name)) + '</span>';
  }

  /** Maç satırı — TOFAŞ fikstür satırı; tıklanınca maç detayına gider. */
  function matchRow(m) {
    var row = el('a', 'fx');
    row.href = 'mac.html?id=' + m.id;
    var mid = isPlayed(m) && m.kind === 'lig' ? esc(m.score.replace(/\s*-\s*/, '-'))
      : m.kind === 'hazirlik' ? 'HAZIRLIK'
      : (m.time || 'SAAT TBA');
    var cls = m.kind === 'lig' && isPlayed(m) ? '' : ' pending';
    row.innerHTML =
      '<div><div class="fx__comp">' + esc(m.kind === 'lig' ? m.label + ' · ' + m.week : m.label) + '</div>' +
      '<div class="fx__date">' + esc(fmtDate(m.date)) + '</div></div>' +
      '<div class="fx__row">' +
      '<div class="fx__team fx__team--a">' + crest(m.home) + '<b>' + esc(m.home.name) + '</b></div>' +
      '<div class="fx__score' + cls + '">' + mid + '</div>' +
      '<div class="fx__team">' + crest(m.away) + '<b>' + esc(m.away.name) + '</b></div>' +
      '</div>' +
      '<div class="fx__end"><div class="fx__venue">' + esc(m.kind === 'lig' ? m.comp : 'Hazırlık maçı') + '</div></div>';
    return row;
  }

  /** Yaş grupları — TOFAŞ puan durumu tablosunun dili. */
  function groupsTable(groups) {
    var wrap = el('div', 'tablewrap');
    var t = el('table', 'standings');
    var call = 'Bilgi için arayın';
    t.innerHTML =
      '<thead><tr><th>Grup</th><th>Doğum Yılı</th><th>Yaş</th><th>Öne Çıkan</th><th>Antrenman</th><th>Ücret</th></tr></thead>';
    var tb = el('tbody');
    groups.forEach(function (g) {
      var tr = el('tr');
      tr.innerHTML =
        '<td class="pts"><a href="takim.html?id=' + (teamsOfGroup(g.id)[0] || { id: g.id }).id + '">' + esc(g.name) + '</a></td>' +
        '<td>' + esc(g.yearsLabel) + '</td>' +
        '<td>' + esc(g.age) + '</td>' +
        '<td class="team">' + esc(g.note) + '</td>' +
        '<td class="muted">' + call + '</td>' +
        '<td class="muted">' + call + '</td>';
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
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

    /* --- yaklaşan lig maçları / son oynanan maçlar */
    var all = allMatches();
    var rh = $('#results'), uh = $('#upcoming');
    if (uh) {
      var up = upcoming(all).slice(0, 3);
      if (!up.length) uh.appendChild(el('p', 'sec__sub', 'Yaklaşan maç bulunmuyor.'));
      up.forEach(function (m) { uh.appendChild(matchRow(m)); });
      markReveal(uh, '.fx');
    }
    if (rh) {
      all.filter(isPlayed).reverse().slice(0, 3).forEach(function (m) { rh.appendChild(matchRow(m)); });
      markReveal(rh, '.fx');
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

    /* --- yaş grupları tablosu */
    var gh = $('#groups');
    if (gh) gh.appendChild(groupsTable(S.groups || []));

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
  /** Kadro listesi — TOFAŞ tablo dili; satır sporcu profiline gider. */
  function rosterTable(list) {
    var wrap = el('div', 'tablewrap');
    var t = el('table', 'standings roster-table');
    t.innerHTML = '<thead><tr><th>#</th><th>Sporcu</th><th>Doğum yılı</th><th>Pozisyon</th><th></th></tr></thead>';
    var tb = el('tbody');
    list.forEach(function (p, i) {
      var tr = el('tr');
      tr.innerHTML =
        '<td class="pos">' + esc(p.number || i + 1) + '</td>' +
        '<td class="team"><a href="oyuncu.html?id=' + p.id + '">' + esc(personName(p.name)) + '</a></td>' +
        '<td>' + esc(p.born) + '</td>' +
        '<td class="muted">' + esc(p.position || '—') + '</td>' +
        '<td><a class="link-more" href="oyuncu.html?id=' + p.id + '">Profil ' + ARROW + '</a></td>';
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    wrap.appendChild(t);
    return wrap;
  }
  function playersOf(teamId) { return (S.players || []).filter(function (p) { return p.team === teamId; }); }

  /** Kayan oyuncu şeridi (ana sayfadan taşındı): liste ikiye katlanır, -50%'de kusursuz döner. */
  function rosterStrip(host, list) {
    if (!host || !list.length) return;
    var base = list.slice();
    while (base.length < 10) base = base.concat(list);   // kısa kadro geniş ekranı doldursun
    base.concat(base).forEach(function (p) { host.appendChild(playerCard(p)); });
  }

  /** Sıradaki maç paneli — TOFAŞ "Sıradaki Maç" kutusu */
  function nextMatchPanel(host, m) {
    if (!host) return;
    if (!m) { host.innerHTML = '<div class="nextmatch__label">Sıradaki Maç</div><div class="nextmatch__comp">Takvimde yaklaşan maç yok.</div>'; return; }
    var v = venueById(m.venue);
    host.innerHTML =
      '<div class="nextmatch__label">Sıradaki Maç</div>' +
      '<div class="nextmatch__comp">' + esc(m.comp + (m.week ? ' · ' + m.week : '')) + '</div>' +
      '<div class="nextmatch__teams">' +
      '<div class="nextmatch__team">' + crest(m.home) + '<b>' + esc(m.home.name) + '</b></div>' +
      '<div class="nextmatch__vs">VS</div>' +
      '<div class="nextmatch__team">' + crest(m.away) + '<b>' + esc(m.away.name) + '</b></div>' +
      '</div>' +
      '<div class="nextmatch__when">' + esc(fmtLong(m)) + '</div>' +
      '<div class="nextmatch__where">' + esc(v ? v.name : '') + '</div>' +
      '<a class="btn btn--onblue" href="mac.html?id=' + m.id + '">Maç detayı ' + ARROW + '</a>';
  }

  /* ------------------------------------------------------------ page: team */

  function pageTeam() {
    var t = teamById(new URLSearchParams(location.search).get('id')) || (S.teams || [])[0];
    if (!t) return;
    var g = (S.groups || []).filter(function (x) { return x.id === t.group; })[0] || {};
    document.title = t.full + ' — TOFAŞ × DİBA Denizli';
    $('#tm-crumb').textContent = t.name;
    $('#tm-name').textContent = t.full;
    $('#tm-lead').textContent = [g.yearsLabel, g.age, t.league].filter(Boolean).join(' · ');
    var tbf = $('#tm-tbf');
    if (t.tbf) tbf.href = t.tbf; else tbf.remove();

    var media = $('#tm-photo');
    if (t.photo) media.innerHTML = '<img src="' + esc(t.photo) + '" alt="' + esc(t.full + ' takım fotoğrafı') + '">';
    else media.insertAdjacentHTML('beforeend', '<span class="team-photo__note">Takım fotoğrafı yakında</span>');

    var ms = matchesOfTeam(t);
    nextMatchPanel($('#tm-next'), upcoming(ms)[0]);

    var fx = $('#tm-fixtures');
    if (ms.length) { ms.forEach(function (m) { fx.appendChild(matchRow(m)); }); markReveal(fx, '.fx'); }
    else fx.appendChild(el('p', 'sec__sub', 'Bu grup için henüz maç takvimi yok.'));

    var roster = playersOf(t.id);
    var grid = $('#tm-roster');
    if (roster.length) {
      rosterStrip($('#rostertrack'), roster);
      grid.appendChild(rosterTable(roster));
      $('#tm-count').textContent = roster.length + ' sporcu · kaynak: TBF lisans listesi';
    } else {
      $('#tm-strip').remove();
      grid.outerHTML = '<p class="sec__sub">Kadro bilgisi yakında eklenecek.</p>';
    }

    var news = $('#tm-news');
    var posts = sortedPosts().filter(function (p) { return (p.groups || []).indexOf(t.group) > -1; });
    if (posts.length) { posts.slice(0, 4).forEach(function (p) { news.appendChild(newsCard(p)); }); markReveal(news, '.card'); }
    else news.outerHTML = '<p class="sec__sub">Bu takıma ait haber henüz yok.</p>';
  }

  /* ---------------------------------------------------------- page: player */

  function pagePlayer() {
    var p = playerById(new URLSearchParams(location.search).get('id')) || (S.players || [])[0];
    if (!p) return;
    var t = teamById(p.team);
    document.title = personName(p.name) + ' — TOFAŞ × DİBA Denizli';
    $('#pl-crumb').textContent = personName(p.name);
    var tl = $('#pl-team-link'); tl.textContent = t.full; tl.href = 'takim.html?id=' + t.id;
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
    $('#pl-all').href = 'takim.html?id=' + t.id;
  }

  /* ----------------------------------------------------------- page: match */

  function pageMatch() {
    var m = matchById(new URLSearchParams(location.search).get('id')) || allMatches()[0];
    if (!m) return;
    document.title = m.home.name + ' - ' + m.away.name + ' — TOFAŞ × DİBA Denizli';
    $('#mc-crumb').textContent = m.home.name + ' - ' + m.away.name;
    $('#mc-comp').textContent = m.comp + (m.week ? ' · ' + m.week : '');
    $('#mc-home').innerHTML = crest(m.home) + '<b>' + esc(m.home.name) + '</b>';
    $('#mc-away').innerHTML = crest(m.away) + '<b>' + esc(m.away.name) + '</b>';
    var played = m.kind === 'lig' && isPlayed(m);
    $('#mc-score').innerHTML = played ? esc(m.score) : '<span>' + esc(m.time || 'VS') + '</span>';
    $('#mc-when').textContent = fmtLong(m);
    $('#mc-status').textContent = m.kind === 'hazirlik' ? 'Hazırlık maçı · skor paylaşılmadı' : played ? 'Maç sonucu' : 'Maç henüz oynanmadı';

    var info = $('#mc-info');
    var v = venueById(m.venue);
    var rows = [['Tarih', fmtLong(m)], ['Organizasyon', m.comp]];
    if (m.week) rows.push(['Hafta', m.week]);
    if (m.no) rows.push(['Maç no', m.no]);
    if (v) rows.push(['Salon', v.name]);
    info.innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');

    var teamLinks = $('#mc-teams');
    var ids = m.kind === 'lig' ? m.teams : [];
    if (m.kind === 'hazirlik') m.groups.forEach(function (g) { teamsOfGroup(g).forEach(function (t) { ids.push(t.id); }); });
    ids.filter(function (x, i) { return ids.indexOf(x) === i; }).forEach(function (id) {
      var t = teamById(id);
      if (t) teamLinks.insertAdjacentHTML('beforeend', '<a class="btn btn--outline btn--sm" href="takim.html?id=' + t.id + '">' + esc(t.full) + '</a>');
    });
    if (m.kind === 'lig') teamLinks.insertAdjacentHTML('beforeend', '<a class="btn btn--outline btn--sm" href="https://tbf.org.tr/denizli" target="_blank" rel="noopener">TBF Denizli</a>');
    if (m.post) teamLinks.insertAdjacentHTML('beforeend', '<a class="btn btn--primary btn--sm" href="' + postUrl(m.post) + '" target="_blank" rel="noopener">Instagram gönderisi</a>');

    var vb = $('#mc-venue');
    if (v) {
      vb.querySelector('h3').textContent = v.name;
      vb.querySelector('p').textContent = v.address + (v.capacity ? ' · Kapasite ' + v.capacity : '');
      vb.querySelector('a').href = v.dir;
      $('#mc-map').innerHTML = '<iframe src="' + esc(v.maps) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="' + esc(v.name) + ' konumu"></iframe>';
    } else { vb.remove(); $('#mc-map').remove(); }

    var rel = $('#mc-related');
    var sameTeam = allMatches().filter(function (x) {
      return x.id !== m.id && x.kind === m.kind && (m.kind === 'lig' ? x.teams.some(function (t) { return m.teams.indexOf(t) > -1; }) : true);
    });
    var after = sameTeam.filter(function (x) { return dateKey(x.date, x.time) >= dateKey(m.date, m.time); }).slice(0, 3);
    (after.length ? after : sameTeam.slice(-3)).forEach(function (x) { rel.appendChild(matchRow(x)); });
    markReveal(rel, '.fx');
  }

  /* -------------------------------------------------------- page: fixtures */

  function pageFixtures() {
    var host = $('#fixtures');
    if (!host) return;
    var all = allMatches();
    var tabs = [['Tümü', function () { return true; }]];
    (S.teams || []).filter(function (t) { return t.league; }).forEach(function (t) {
      tabs.push([t.name, function (m) { return m.kind === 'lig' && m.teams.indexOf(t.id) > -1; }]);
    });
    tabs.push(['Hazırlık', function (m) { return m.kind === 'hazirlik'; }]);
    function render(i) {
      host.innerHTML = '';
      var month = '';
      all.filter(tabs[i][1]).forEach(function (m) {
        var d = dateKey(m.date, m.time), key = MONTHS[d.getMonth()] + ' ' + d.getFullYear();
        if (key !== month) { month = key; host.appendChild(el('h3', 'fx-month', esc(key))); }
        host.appendChild(matchRow(m));
      });
      markReveal(host, '.fx');
      reveal();
    }
    var t = $('#fixturetabs');
    if (t) buildTabs(t, tabs.map(function (x) { return x[0]; }), render);
    render(0);

    var sum = $('#fxsummary');
    if (sum) {
      var lg = all.filter(function (m) { return m.kind === 'lig'; });
      [['Lig maçı', lg.length], ['Oynanan', lg.filter(isPlayed).length], ['Kalan', lg.filter(function (m) { return !isPlayed(m); }).length], ['Hazırlık maçı', all.length - lg.length]]
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

  function boot() {
    header();
    var page = document.body.getAttribute('data-page');
    try {
      ({
        home: pageHome, team: pageTeam, player: pagePlayer, match: pageMatch, fixtures: pageFixtures,
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
