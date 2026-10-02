/* Easter egg: když ECO hráč nechce kupovat packy nebo skipovat HoK, ozve se Grznar. */
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

  // ECO hráč na lvl 25 bez Fortress Packu
  var pack = document.getElementById('d1m');
  ['tl9', 'd1k'].forEach(function (id) {
    var lvl = document.getElementById(id);
    if (!lvl || !pack) return;
    lvl.addEventListener('change', function () {
      if (lvl.checked && !pack.checked && FTN.mode() === 'eco') grznar('Lvl 25 a bez Fortress Packu?');
    });
  });

  document.getElementById('grzClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
})();
