/* Živé hodiny dne 1: podle FTN.config.startAt označí kroky jako hotové / teď a ukáže další deadline. */
(function () {
  var cfg = FTN.config;
  var sim = new URLSearchParams(location.search).get('sim');
  var start = sim !== null && !isNaN(+sim) ? new Date(Date.now() - +sim * 60000)
            : cfg.startAt ? new Date(cfg.startAt) : null;
  if (!start || isNaN(start)) return;

  var items = [].slice.call(document.querySelectorAll('.tl-item[data-start]'));
  var card = document.getElementById('liveCard'), nowEl = document.getElementById('liveNow'),
      nextEl = document.getElementById('liveNext'), nav = document.getElementById('navLive');
  var fmt = new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit', timeZone: cfg.timeZone });

  function at(min) { return fmt.format(new Date(start.getTime() + min * 60000)); }
  function dur(min) {
    min = Math.max(1, Math.ceil(min));
    if (min < 60) return min + ' min';
    if (min < 1440) return Math.floor(min / 60) + ' h ' + (min % 60) + ' min';
    return Math.floor(min / 1440) + ' d ' + Math.floor(min % 1440 / 60) + ' h';
  }
  function own(li) { var f = li.getAttribute('data-for'); return !f || f === FTN.mode(); }

  function tick() {
    var m = (Date.now() - start.getTime()) / 60000;
    var current = null, next = null;
    items.forEach(function (li) {
      var s = +li.getAttribute('data-start'), e = +li.getAttribute('data-end');
      var isNow = m >= s && m < e && own(li);
      li.classList.toggle('is-past', m >= e);
      li.classList.toggle('is-now', isNow);
      if (isNow) current = li;
      if (own(li) && li.hasAttribute('data-deadline') && e > m && (!next || e < +next.getAttribute('data-end'))) next = li;
    });

    var show = m < cfg.liveHours * 60, nowText, nextText = '', navText = '';
    if (m < 0) {
      nowText = 'Start EU31 za ' + dur(-m);
      nextText = 'v ' + at(0) + ': Houbičkář a kódy';
      navText = 'start za ' + dur(-m);
    } else {
      nowText = current ? 'Teď: ' + current.getAttribute('data-name') : 'Teď: jeď podle checklistu Den 1';
      if (next) {
        var e = +next.getAttribute('data-end');
        nextText = 'Deadline ' + at(e) + ' · ' + next.getAttribute('data-deadline') + ' · za ' + dur(e - m);
        navText = at(e) + ' za ' + dur(e - m);
      }
    }
    card.hidden = nav.hidden = !show;
    if (!show) return;
    nowEl.textContent = nowText;
    nextEl.textContent = nextText;
    nav.textContent = navText || 'harmonogram';
  }

  document.addEventListener('ftn:mode', tick);
  tick();
  setInterval(tick, 20000);
})();
