/* Páginas de case: abas (antes e depois, modos/telas) e visualizador de imagens */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Abas ---------- */
  // Liga um trilho .ml-tabs: clique, setas, Home e End. onPick(i) troca o conteúdo.
  function setupTabs(rail, onPick) {
    var tabs = Array.prototype.slice.call(rail.querySelectorAll('[role="tab"]'));
    var n = tabs.length, cur = 0;
    tabs.forEach(function (t, i) { if (t.classList.contains('is-active')) cur = i; });
    function pick(i, focus) {
      cur = i;
      rail.className = rail.className.replace(/\bml-tabs--i\d\b/, 'ml-tabs--i' + i);
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      onPick(i);
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { pick(i, false); }); });
    rail.addEventListener('keydown', function (e) {
      var next;
      if (e.key === 'ArrowRight') next = (cur + 1) % n;
      else if (e.key === 'ArrowLeft') next = (cur + n - 1) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      else return;
      e.preventDefault();
      pick(next, true);
    });
  }

  // Abas de modos/telas: mostram um painel por vez. Com a página rolada, o painel novo volta para logo abaixo das abas flutuantes.
  document.querySelectorAll('[data-tabs="mt"]').forEach(function (rail) {
    setupTabs(rail, function (i) {
      var panels = document.querySelectorAll('.mt__panel');
      panels.forEach(function (p) { p.classList.toggle('is-hidden', p.id !== 'mt-panel-' + i); });
      var panel = document.getElementById('mt-panel-' + i);
      if (!panel) return;
      var stickyTop = parseFloat(getComputedStyle(rail).top) || 84;
      var want = stickyTop + rail.getBoundingClientRect().height + 24;
      var delta = panel.getBoundingClientRect().top - want;
      if (Math.abs(delta) < 8) return;
      window.scrollTo({ top: window.scrollY + delta, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  // Antes e depois (case do checkout): as três mudanças trocam as telas e as legendas do mesmo painel
  var BA = [
    { key: 'k1', antes: 'Encerramento manual + melhor preço disponível', depois: 'Ordem a mercado', onde: 'Operações comuns e day trade',
      antesSrc: 'assets/img/ba1-antes.webp', antesH: 1941, antesAlt: 'Checkout antigo com encerramento manual e preço da ação em melhor disponível',
      depoisSrc: 'assets/img/ba1-depois.webp', depoisH: 2000, depoisAlt: 'Checkout novo com ordem a mercado e o campo de quantidade' },
    { key: 'k2', antes: 'Encerramento manual + preço personalizado', depois: 'Ordem limitada', onde: 'Operações comuns e day trade',
      antesSrc: 'assets/img/ba2-antes.webp', antesH: 1910, antesAlt: 'Checkout antigo com encerramento manual e preço da ação personalizado',
      depoisSrc: 'assets/img/ba2-depois.webp', depoisH: 1999, depoisAlt: 'Checkout novo com ordem limitada, preço de compra por ativo e quantidade' },
    { key: 'k3', antes: 'Encerramento automático + melhor preço disponível', depois: 'Stop gain/loss', onde: 'Só no day trade',
      antesSrc: 'assets/img/ba3-antes.webp', antesH: 2029, antesAlt: 'Checkout antigo com encerramento automático, lucro e prejuízo aproximados',
      depoisSrc: 'assets/img/ba3-depois.webp', depoisH: 2092, depoisAlt: 'Checkout novo no modo day trade, com topo preto e campos de stop loss e stop gain' }
  ];
  var baPanel = document.getElementById('ba-panel');
  document.querySelectorAll('[data-tabs="ba"]').forEach(function (rail) {
    setupTabs(rail, function (i) {
      if (!baPanel) return;
      var c = BA[i];
      baPanel.className = 'ml-ba ml-ba--' + c.key;
      baPanel.setAttribute('aria-labelledby', 'ba-tab-' + i);
      var shots = baPanel.querySelectorAll('.ml-ba__screen');
      shots[0].src = c.antesSrc; shots[0].alt = c.antesAlt; shots[0].height = c.antesH;
      shots[1].src = c.depoisSrc; shots[1].alt = c.depoisAlt; shots[1].height = c.depoisH;
      var caps = baPanel.querySelectorAll('.ml-ba__caption');
      caps[0].querySelector('strong').textContent = c.antes;
      caps[1].querySelector('strong').textContent = c.depois;
      caps[1].querySelector('.ml-ba__sub').textContent = c.onde;
    });
  });
  // Pré-carrega as telas das outras mudanças, para a troca ser imediata
  if (baPanel) BA.forEach(function (c) { [c.antesSrc, c.depoisSrc].forEach(function (s) { var im = new Image(); im.src = s; }); });

  /* ---------- Visualizador de imagens ---------- */
  var lb = document.querySelector('.lb');
  if (!lb) return;
  var stage = document.getElementById('lb-stage');
  var lbImg = lb.querySelector('.lb__img');
  var hint = lb.querySelector('.lb__hint');
  var zoomBtn = lb.querySelector('.lb__zoom');
  var zoomPath = lb.querySelector('.lb__zoom-path');
  var closeBtn = lb.querySelector('.lb__close');
  var isOpen = false, isZoom = false, returnTo = null;
  var LB_MAX = 5, LB_TAP = 2.5;
  var z = { s: 1, x: 0, y: 0, ptrs: new Map(), pinch: null, pan: null, tap: null };

  function setZoomUi(zoomed) {
    if (zoomed === isZoom) return;
    isZoom = zoomed;
    stage.classList.toggle('is-zoomed', zoomed);
    hint.textContent = zoomed ? 'Arraste para navegar. Toque para voltar ao tamanho original.' : 'Toque ou use dois dedos para ampliar.';
    zoomBtn.setAttribute('aria-label', zoomed ? 'Reduzir imagem' : 'Ampliar imagem');
    zoomPath.setAttribute('d', zoomed ? 'M11 11h0' : 'M11 8v6');
  }
  function base() { var r = lbImg.getBoundingClientRect(); return { L: r.left - z.x, T: r.top - z.y, W: r.width / z.s, H: r.height / z.s }; }
  function clamp(b) {
    var S = stage.getBoundingClientRect(), w = b.W * z.s, h = b.H * z.s;
    if (z.s <= 1) { z.s = 1; z.x = 0; z.y = 0; return; }
    z.x = w <= S.width ? (S.left + S.width / 2) - b.L - w / 2 : Math.min(S.left - b.L, Math.max(S.right - b.L - w, z.x));
    z.y = h <= S.height ? (S.top + S.height / 2) - b.T - h / 2 : Math.min(S.top - b.T, Math.max(S.bottom - b.T - h, z.y));
  }
  function apply(anim) {
    lbImg.style.transition = anim ? 'transform 200ms ease' : 'none';
    lbImg.style.transform = 'translate(' + z.x + 'px,' + z.y + 'px) scale(' + z.s + ')';
    setZoomUi(z.s > 1.01);
  }
  function zoomAt(px, py, s, anim) {
    var b = base(), lx = (px - b.L - z.x) / z.s, ly = (py - b.T - z.y) / z.s;
    z.s = Math.min(LB_MAX, Math.max(1, s));
    z.x = px - b.L - lx * z.s; z.y = py - b.T - ly * z.s;
    clamp(b); apply(anim);
  }
  function reset() {
    z.s = 1; z.x = 0; z.y = 0; z.ptrs.clear(); z.pinch = null; z.pan = null;
    lbImg.style.transition = 'none'; lbImg.style.transform = '';
    setZoomUi(false);
  }
  function toggle(px, py) {
    var S = stage.getBoundingClientRect();
    if (px == null) { px = S.left + S.width / 2; py = S.top + S.height / 2; }
    zoomAt(px, py, z.s > 1.01 ? 1 : LB_TAP, true);
  }
  function open(src, alt, from) {
    returnTo = from;
    reset();
    lbImg.src = src; lbImg.alt = alt || '';
    isOpen = true;
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function close() {
    isOpen = false;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    reset();
    if (returnTo && returnTo.focus) { try { returnTo.focus({ preventScroll: true }); } catch (err) {} }
  }

  // Imagens do case (e telas do antes e depois) abrem por cima da página, em vez de abrir uma aba nova
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest || t.closest('.lb')) return;
    var link = t.closest('.case-img a');
    var shot = t.closest('.ml-ba__screen');
    var img = link ? link.querySelector('img') : shot;
    if (!img) return;
    e.preventDefault();
    open((link && link.getAttribute('href')) || img.getAttribute('src'), img.getAttribute('alt'), link || img);
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  zoomBtn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  lbImg.addEventListener('click', function (e) { e.stopPropagation(); });
  lb.addEventListener('click', function (e) {
    var c = e.target.classList;
    if (c.contains('lb') || c.contains('lb__stage') || c.contains('lb__bar')) close();
  });

  // Gestos: pinça (2 dedos) amplia no ponto entre os dedos, 1 dedo arrasta, toque alterna 1x/2,5x; no desktop, Ctrl + rodinha ou pinça do trackpad
  function inStage(e) { return isOpen && e.target && e.target.closest && e.target.closest('#lb-stage'); }
  document.addEventListener('pointerdown', function (e) {
    if (!inStage(e)) return;
    e.preventDefault();
    z.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (z.ptrs.size === 2) {
      var v = Array.from(z.ptrs.values()), a = v[0], c = v[1], b = base();
      var mx = (a.x + c.x) / 2, my = (a.y + c.y) / 2;
      z.pinch = { d0: Math.hypot(a.x - c.x, a.y - c.y) || 1, s0: z.s, lx: (mx - b.L - z.x) / z.s, ly: (my - b.T - z.y) / z.s };
      z.pan = null; z.tap = null;
    } else if (z.ptrs.size === 1) {
      z.pan = { x0: e.clientX, y0: e.clientY, tx: z.x, ty: z.y };
      z.tap = { x: e.clientX, y: e.clientY, t: Date.now() };
    }
  }, { passive: false });
  document.addEventListener('pointermove', function (e) {
    if (!z.ptrs.has(e.pointerId)) return;
    e.preventDefault();
    z.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    var b = base();
    if (z.pinch && z.ptrs.size >= 2) {
      var v = Array.from(z.ptrs.values()), a = v[0], c = v[1];
      var mx = (a.x + c.x) / 2, my = (a.y + c.y) / 2;
      z.s = Math.min(LB_MAX, Math.max(1, z.pinch.s0 * Math.hypot(a.x - c.x, a.y - c.y) / z.pinch.d0));
      z.x = mx - b.L - z.pinch.lx * z.s; z.y = my - b.T - z.pinch.ly * z.s;
      clamp(b); apply(false);
    } else if (z.pan) {
      if (z.tap && Math.hypot(e.clientX - z.tap.x, e.clientY - z.tap.y) > 8) z.tap = null;
      if (z.s > 1) { z.x = z.pan.tx + e.clientX - z.pan.x0; z.y = z.pan.ty + e.clientY - z.pan.y0; clamp(b); apply(false); }
    }
  }, { passive: false });
  function onUp(e) {
    if (!z.ptrs.has(e.pointerId)) return;
    z.ptrs.delete(e.pointerId);
    if (z.ptrs.size < 2) z.pinch = null;
    if (z.ptrs.size === 1) { var p = Array.from(z.ptrs.values())[0]; z.pan = { x0: p.x, y0: p.y, tx: z.x, ty: z.y }; }
    if (z.ptrs.size === 0) {
      z.pan = null;
      var t = z.tap; z.tap = null;
      if (t && Date.now() - t.t < 300 && e.target && e.target.classList && e.target.classList.contains('lb__img')) toggle(e.clientX, e.clientY);
    }
  }
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);
  document.addEventListener('wheel', function (e) {
    if (!inStage(e)) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { zoomAt(e.clientX, e.clientY, z.s * Math.exp(-e.deltaY * 0.01), false); return; }
    if (z.s > 1) { var b = base(); z.x -= e.deltaX; z.y -= e.deltaY; clamp(b); apply(false); }
  }, { passive: false });
})();
