/* Jediné místo, které je potřeba upravit před startem.
   startAt: přesný začátek serveru včetně časové zóny (CEST = +02:00).
   Dokud je null, timeline je statická a živé hodiny se neukazují.
   Náhled bez data: přidej do adresy ?sim=17 (start byl před 17 min) nebo ?sim=-30 (start za 30 min). */
window.FTN = window.FTN || {};
FTN.config = {
  startAt: '2026-10-02T16:00:00+02:00', // pátek 2. 10. 2026, 16:00 CEST
  timeZone: 'Europe/Prague',
  liveHours: 9, // jak dlouho po startu ukazovat živý stav (16:00 → cca 01:00)
  keys: { checks: 'ftn-eu31-v1', mode: 'ftn-eu31-mode', hideDone: 'ftn-eu31-hide' }
};
