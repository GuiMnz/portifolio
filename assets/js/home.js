/* Home: no celular (sem hover), o leque das capas abre quando o card entra na tela e o card em foco ganha o realce */
(function () {
  'use strict';
  var noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;

  if (noHover && !reduce) {
    var fanObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        clearTimeout(el._fanIn); clearTimeout(el._fanOut);
        if (!en.isIntersecting) { el.classList.remove('is-fanned'); return; }
        el._fanIn = setTimeout(function () { el.classList.add('is-fanned'); }, 150);
        el._fanOut = setTimeout(function () { el.classList.remove('is-fanned'); }, 1500);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.cover-fan').forEach(function (el) { fanObs.observe(el); });
  }

  if (noHover) {
    var lineObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var card = en.target.closest('.ml-card');
        if (card) card.classList.toggle('is-active', en.isIntersecting);
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    document.querySelectorAll('.ml-card__title-text').forEach(function (el) { lineObs.observe(el); });
  }
})();
