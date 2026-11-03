/* Comportamentos compartilhados por todas as páginas: topo, menu, e-mail e imagens pendentes */
(function () {
  'use strict';

  // Topo: ganha fundo desfocado quando a página rola
  var bar = document.getElementById('topbar');
  function onScroll() { if (bar) bar.classList.toggle('is-scrolled', (window.scrollY || document.documentElement.scrollTop || 0) > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu do celular
  var btn = document.getElementById('menuBtn'), nav = document.getElementById('menu-principal');
  function setMenu(open) {
    if (!btn || !nav) return;
    nav.classList.toggle('is-open', open);
    bar.classList.toggle('is-menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    btn.querySelector('.ml-hamburger').classList.toggle('active', open);
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
    });
  }

  // Copiar e-mail
  var copyBtn = document.getElementById('copyEmail'), copied = document.getElementById('copied');
  if (copyBtn && copied) {
    copyBtn.addEventListener('click', function () {
      var done = function () { copied.textContent = 'Copiado!'; setTimeout(function () { copied.textContent = ''; }, 1800); };
      try { navigator.clipboard.writeText('gui.mnz90@gmail.com').then(done, done); } catch (err) { done(); }
    });
  }

  // Imagem que ainda não está em assets/img: mostra uma caixa tracejada com o nome do arquivo, em vez do ícone de imagem quebrada
  function markMissing(img) {
    if (img.dataset.missing) return;
    img.dataset.missing = '1';
    var name = (img.getAttribute('src') || '').split('/').pop();
    if (window.console) console.warn('Imagem pendente: assets/img/' + name);
    if (img.closest('.cover-fan, .tl-item__logo, .cred__logo, .hero__avatar, .about-intro__illustration')) { img.style.visibility = 'hidden'; return; }
    var box = document.createElement('div');
    box.className = 'img-missing';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.getAttribute('alt') || name);
    box.textContent = 'Imagem pendente: ' + name;
    if (img.parentNode) img.parentNode.replaceChild(box, img);
  }
  window.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') markMissing(e.target);
  }, true);
  document.querySelectorAll('img').forEach(function (img) { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissing(img); });
})();
