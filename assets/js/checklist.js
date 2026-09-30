/* Odškrtávání, progress bary sekcí, „pokračovat“, „skrýt hotové“ a reset. */
(function () {
  var keys = FTN.config.keys;
  var state = FTN.store.get(keys.checks, {}) || {};
  var boxes = [].slice.call(document.querySelectorAll('.wrap input[type=checkbox]'));

  function visible(el) { return el.offsetParent !== null; }
  function row(b) { return b.closest('li'); }
  // bonusové body jdou odškrtnout, ale nepočítají se do progressu ani do „pokračovat“
  function isBonus(b) { return !!b.closest('li.bonus'); }

  function update() {
    boxes.forEach(function (b) { var r = row(b); if (r) r.classList.toggle('done', b.checked); });
    document.querySelectorAll('[data-sec]').forEach(function (s) {
      var own = [].filter.call(s.querySelectorAll('input[type=checkbox]'), function (b) {
        if (isBonus(b)) return false;
        return visible(b) || (b.checked && document.body.classList.contains('hide-done') && !isOtherMode(b));
      });
      var done = own.filter(function (b) { return b.checked; }).length;
      var p = s.querySelector('.prog'), bar = s.querySelector('.bar i');
      if (p) p.textContent = done + ' / ' + own.length;
      if (bar) bar.style.width = (own.length ? done / own.length * 100 : 0) + '%';
    });
  }
  // skryté hotové položky se pořád počítají, jen ne ty z druhého režimu
  function isOtherMode(b) {
    var m = FTN.mode(), el = b.closest('[data-only],[data-for]');
    while (el) {
      var o = el.getAttribute('data-only') || el.getAttribute('data-for');
      if (o && o !== m) return true;
      el = el.parentElement && el.parentElement.closest('[data-only],[data-for]');
    }
    return false;
  }

  boxes.forEach(function (b) {
    if (state[b.id]) b.checked = true;
    b.addEventListener('change', function () {
      if (b.checked) state[b.id] = true; else delete state[b.id];
      FTN.store.set(keys.checks, state);
      update();
    });
  });

  // pokračovat: první neodškrtnutý bod, který se tě týká
  var cont = document.getElementById('continueBtn');
  cont.addEventListener('click', function () {
    var next = boxes.filter(function (b) { return !b.checked && visible(b) && !isBonus(b); })[0];
    if (!next) { cont.textContent = 'Všechno hotovo 🎉'; return; }
    var target = next.closest('.tl-card') || row(next);
    target.scrollIntoView({ block: 'center' });
    next.focus({ preventScroll: true });
    target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
  });

  // skrýt hotové
  var hide = document.getElementById('hideDoneBtn');
  function setHide(on) {
    document.body.classList.toggle('hide-done', on);
    hide.setAttribute('aria-pressed', on ? 'true' : 'false');
    FTN.store.set(keys.hideDone, on);
    update();
  }
  hide.addEventListener('click', function () { setHide(!document.body.classList.contains('hide-done')); });

  // reset na dvě kliknutí
  var armed = false, rb = document.getElementById('resetBtn'), msg = document.getElementById('resetMsg');
  rb.addEventListener('click', function () {
    if (!armed) { armed = true; msg.hidden = false; rb.textContent = 'Opravdu vymazat'; return; }
    state = {}; FTN.store.set(keys.checks, state);
    boxes.forEach(function (b) { b.checked = false; });
    armed = false; msg.hidden = true; rb.textContent = 'Vymazat odškrtnutí'; cont.textContent = '↓ Pokračovat, kde jsem skončil';
    update();
  });

  document.addEventListener('ftn:mode', update);
  setHide(FTN.store.get(keys.hideDone, false) === true);
})();
