/* Horní lišta: tažení myší a kolečko do stran (když se nevejde), zvýraznění aktuální sekce
   a výška lišty do --nav-h, aby kotvy nezajížděly pod ni. */
(function () {
  var nav = document.querySelector('nav.jump');
  if (!nav) return;
  var root = document.documentElement;

  function edges() {
    var max = nav.scrollWidth - nav.clientWidth;
    nav.classList.toggle('more-left', max > 2 && nav.scrollLeft > 2);
    nav.classList.toggle('more-right', max > 2 && nav.scrollLeft < max - 2);
    root.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  nav.addEventListener('scroll', edges, { passive: true });
  window.addEventListener('resize', edges);
  document.addEventListener('ftn:mode', edges);

  // kolečko myši posouvá lištu do stran, dokud má kam
  nav.addEventListener('wheel', function (ev) {
    var max = nav.scrollWidth - nav.clientWidth;
    if (max <= 0 || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return;
    var next = Math.max(0, Math.min(max, nav.scrollLeft + ev.deltaY));
    if (next === nav.scrollLeft) return;
    ev.preventDefault();
    nav.scrollLeft = next;
  }, { passive: false });

  // tažení myší (dotyk umí posouvat sám)
  var startX = 0, startLeft = 0, down = false, moved = false;
  nav.addEventListener('pointerdown', function (ev) {
    if (ev.pointerType !== 'mouse' || ev.button !== 0 || nav.scrollWidth <= nav.clientWidth) return;
    down = true; moved = false; startX = ev.clientX; startLeft = nav.scrollLeft;
  });
  window.addEventListener('pointermove', function (ev) {
    if (!down) return;
    var dx = ev.clientX - startX;
    if (!moved && Math.abs(dx) > 4) { moved = true; nav.classList.add('dragging'); }
    if (moved) nav.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', function () {
    if (!down) return;
    down = false;
    // klik na konci tažení nesmí otevřít odkaz
    if (moved) setTimeout(function () { nav.classList.remove('dragging'); }, 0);
  });

  // aktuální sekce: zvýraznit odkaz a posunout ho do viditelné části lišty
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]:not(.live)'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var current = null;
  function mark(id) {
    var a = byId[id];
    if (!a || a === current) return;
    if (current) current.removeAttribute('aria-current');
    a.setAttribute('aria-current', 'true');
    current = a;
    var max = nav.scrollWidth - nav.clientWidth;
    if (max > 0) nav.scrollTo({ left: Math.max(0, a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2), behavior: 'smooth' });
  }
  // aktuální je poslední viditelná sekce, jejíž začátek už projel pod lištu
  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var ticking = false;
  function spy() {
    ticking = false;
    var line = nav.offsetHeight + 40, pick = null;
    sections.forEach(function (s) { if (s.offsetParent !== null && s.getBoundingClientRect().top <= line) pick = s; });
    // úplně dole se poslední krátké sekce nemusí dostat nahoru
    if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) {
      var vis = sections.filter(function (s) { return s.offsetParent !== null; });
      pick = vis[vis.length - 1];
    }
    if (pick) mark(pick.id);
    else if (current) { current.removeAttribute('aria-current'); current = null; }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  document.addEventListener('ftn:mode', spy);
  spy();

  edges();
})();
