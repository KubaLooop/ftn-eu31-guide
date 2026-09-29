/* Rozklik infografik přes <dialog>. Bez podpory dialogu se obrázek prostě otevře jako odkaz. */
(function () {
  var dlg = document.getElementById('lightbox');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var img = document.getElementById('lbImg'), cap = document.getElementById('lbCap');

  document.querySelectorAll('a.shot').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      var thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = thumb ? thumb.alt : '';
      dlg.showModal();
    });
  });
  document.getElementById('lbClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { img.removeAttribute('src'); });
})();
