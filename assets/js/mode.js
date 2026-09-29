/* Přepínač F2P / ECO. Pořadí priority: #eco / #f2p v adrese, pak uložená volba, pak F2P. */
(function () {
  var key = FTN.config.keys.mode;
  var hint = document.getElementById('modeHint');
  var buttons = document.querySelectorAll('[data-mode-btn]');

  function setMode(m) {
    document.body.setAttribute('data-mode', m);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode-btn') === m ? 'true' : 'false'); });
    if (hint) hint.textContent = m === 'eco' ? 'Zobrazuji plán pro ECO hráče (F2P body + nákupy).' : 'Zobrazuji plán pro F2P hráče.';
    FTN.store.set(key, m);
    document.dispatchEvent(new CustomEvent('ftn:mode', { detail: m }));
  }

  buttons.forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode-btn')); }); });

  var h = (location.hash || '').slice(1), saved = FTN.store.get(key, 'f2p');
  FTN.mode = function () { return document.body.getAttribute('data-mode'); };
  setMode(h === 'eco' || h === 'f2p' ? h : (saved === 'eco' ? 'eco' : 'f2p'));
})();
