/* Comportamentos de todas as páginas: topo, menu, e-mail, banda do rodapé e foco dos cards no celular */
(function () {
  'use strict';

  // Topo: ganha fundo desfocado quando a página rola mais de 8px
  var bar = document.getElementById('topbar');
  function onScroll() {
    if (bar) bar.classList.toggle('is-scrolled', (window.scrollY || document.documentElement.scrollTop || 0) > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('menu-principal');
  function setMenu(open) {
    if (!btn || !nav || !bar) return;
    nav.classList.toggle('is-open', open);
    bar.classList.toggle('is-menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    var burger = btn.querySelector('.ml-hamburger');
    if (burger) burger.classList.toggle('active', open);
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
    });
  }

  // Copiar e-mail
  var copyBtn = document.getElementById('copyEmail');
  var copied = document.getElementById('copied');
  if (copyBtn && copied) {
    var timer = 0;
    copyBtn.addEventListener('click', function () {
      try { if (navigator.clipboard) navigator.clipboard.writeText('gui.mnz90@gmail.com'); } catch (err) {}
      copied.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(function () { copied.hidden = true; }, 1800);
    });
  }

  // Easter egg do rodapé: uma banda sorteada a cada carregamento da página
  var band = document.getElementById('footerBand');
  if (band) {
    var bands = ['Linkin Park', 'Avenged Sevenfold', 'Bring Me the Horizon', 'BRAZA', 'Forfun', 'Gorillaz', 'Alabama Shakes', 'Black Alien', 'Bullet Bane', 'Criolo', 'Foo Fighters', 'O Rappa', 'Yellowcard'];
    band.textContent = ' | Feito com vibe coding usando o Claude e ouvindo ' + bands[Math.floor(Math.random() * bands.length)] + '.';
  }

  // Celular (sem hover): o card mais visível ganha .is-active, que repete o hover do desktop
  // (capa em leque, sublinhado e "Ver case" como botão). Entra em foco com 60% do card, ou metade da tela, à vista;
  // sai quando o próximo toma o foco ou quando restar menos de 35% dele à vista.
  var noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ml-card'));
  if (noHover && cards.length) {
    var raf = 0;
    var checkFocus = function () {
      raf = 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var best = null, bestSeen = 0;
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        var seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        var keep = card.classList.contains('is-active')
          ? seen >= Math.min(r.height, vh) * 0.35
          : (seen >= r.height * 0.6 || seen >= vh * 0.5);
        if (keep && seen > bestSeen) { best = card; bestSeen = seen; }
      });
      cards.forEach(function (card) { card.classList.toggle('is-active', card === best); });
    };
    var onFocusScroll = function () { if (!raf) raf = requestAnimationFrame(checkFocus); };
    window.addEventListener('scroll', onFocusScroll, { passive: true });
    window.addEventListener('resize', onFocusScroll);
    setTimeout(checkFocus, 0);
    setTimeout(checkFocus, 600);
  }
})();
