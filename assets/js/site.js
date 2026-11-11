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
    var bands = ['Linkin Park', 'Avenged Sevenfold', 'Bring Me the Horizon', 'BRAZA', 'Forfun', 'Gorillaz', 'Alabama Shakes', 'Black Alien', 'Bullet Bane', 'Criolo', 'Foo Fighters', 'O Rappa', 'Yellowcard', 'Colid', 'Emicida', 'Muse', 'Imagine Dragons', 'Baiana System', 'System of a Down', 'Three Days Grace', 'Sum 41', 'Rage Against the Machine', 'Selah Sue'];
    band.textContent = ' | Feito com vibe coding usando o Claude e ouvindo ' + bands[Math.floor(Math.random() * bands.length)] + '.';
  }

  // Toque (celular e tablet, sem mouse): o hover do CSS fica desligado e a página marca com .is-active
  // o card que ocupa a maior parte da tela (capa em leque, sublinhado e "Ver case" como botão). Um card por vez:
  // - candidato: card com pelo menos 60% de si à vista (ou da tela, se ele for maior que a tela);
  // - vence o candidato com mais pixels na tela; empate (dois cards inteiros no tablet): o mais perto do centro da tela;
  // - o card em foco só cede quando outro passa a ocupar 10% da tela a mais que ele, e sai quando restar menos de 35% dele à vista.
  // A conta é refeita ao rolar, no fim da rolagem, ao soltar o dedo e ao voltar à página, então nada fica preso depois de segurar e arrastar.
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ml-card'));
  if (!fine && cards.length) {
    var raf = 0;
    var checkFocus = function () {
      raf = 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var info = cards.map(function (card) {
        var r = card.getBoundingClientRect();
        var seen = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        return { card: card, seen: seen, ratio: r.height ? seen / Math.min(r.height, vh) : 0, dist: Math.abs((r.top + r.bottom) / 2 - vh / 2), on: card.classList.contains('is-active') };
      });
      var best = null, cur = null;
      info.forEach(function (c) {
        if (c.on && c.ratio >= 0.35) cur = c;
        if (c.ratio < 0.6) return;
        if (!best || c.seen > best.seen + 1 || (Math.abs(c.seen - best.seen) <= 1 && c.dist < best.dist)) best = c;
      });
      if (cur && (!best || best.seen < cur.seen + vh * 0.1)) best = cur;
      info.forEach(function (c) { c.card.classList.toggle('is-active', !!best && c.card === best.card); });
    };
    var onFocusScroll = function () { if (!raf) raf = requestAnimationFrame(checkFocus); };
    ['scroll', 'scrollend', 'resize', 'orientationchange', 'touchend', 'touchcancel', 'pointercancel', 'pageshow'].forEach(function (t) {
      window.addEventListener(t, onFocusScroll, { passive: true });
    });
    setTimeout(checkFocus, 0);
    setTimeout(checkFocus, 600);
  }
})();
