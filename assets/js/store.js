/* localStorage obalený v try/catch: v anonymním okně nebo s blokovanými daty stránka funguje dál, jen si nic nepamatuje. */
FTN.store = {
  get: function (key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
};
