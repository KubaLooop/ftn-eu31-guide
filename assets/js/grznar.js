/* Easter egg: když ECO hráč klikne „Nechci“ u packů nebo skipu HoK, ozve se Grznar.
   Spouští se jen tlačítkem, nikdy odškrtnutím, ať nevyskočí omylem. */
(function () {
  var dlg = document.getElementById('grznar');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var msg = document.getElementById('grzMsg');

  function grznar(text) {
    msg.textContent = text;
    if (!dlg.open) dlg.showModal();
  }

  document.querySelectorAll('[data-grznar]').forEach(function (b) {
    b.addEventListener('click', function (ev) { ev.preventDefault(); grznar(b.getAttribute('data-grznar')); });
  });

  document.getElementById('grzClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
})();
