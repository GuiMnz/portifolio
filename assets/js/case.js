/* Páginas de case: abas, antes e depois e visualizador de imagens */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Abas de painéis (Modos do checkout, Telas do app) ----------
  var mtRail = document.querySelector('.modes-tabs .ml-tabs');
  if (mtRail) {
    var mtTabs = Array.prototype.slice.call(mtRail.querySelectorAll('[role="tab"]'));
    var pickMt = function (i, focus) {
      mtTabs.forEach(function (t, j) {
        var on = i === j;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = $(t.getAttribute('aria-controls'));
        if (panel) panel.classList.toggle('is-hidden', !on);
      });
      mtRail.className = mtRail.className.replace(/ml-tabs--i\d/, 'ml-tabs--i' + i);
      if (focus) mtTabs[i].focus();
      // Com a página rolada, leva o painel novo para logo abaixo das abas flutuantes
      setTimeout(function () {
        var panel = $(mtTabs[i].getAttribute('aria-controls'));
        if (!panel) return;
        var stickyTop = parseFloat(getComputedStyle(mtRail).top) || 84;
        var delta = panel.getBoundingClientRect().top - (stickyTop + mtRail.getBoundingClientRect().height + 24);
        if (delta < -8) window.scrollTo({ top: window.scrollY + delta, behavior: reduce ? 'auto' : 'smooth' });
      }, 0);
    };
    mtTabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pickMt(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = mtTabs.length, to = null;
        if (e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to !== null) { e.preventDefault(); pickMt(to, true); }
      });
    });
  }

  // ---------- Antes e depois (Case 01) ----------
  var baPanel = $('ba-panel');
  if (baPanel) {
    var changes = [
      { key: 'k1', tab: 'ba-tab-0', antes: 'Encerramento manual + melhor preço disponível', depois: 'Ordem a mercado', onde: 'Operações comuns e day trade',
        aSrc: 'assets/img/ba1-antes.webp', aH: 1941, aAlt: 'Checkout antigo com encerramento manual e preço da ação em melhor disponível',
        dSrc: 'assets/img/ba1-depois.webp', dH: 2000, dAlt: 'Checkout novo com ordem a mercado e o campo de quantidade' },
      { key: 'k2', tab: 'ba-tab-1', antes: 'Encerramento manual + preço personalizado', depois: 'Ordem limitada', onde: 'Operações comuns e day trade',
        aSrc: 'assets/img/ba2-antes.webp', aH: 1910, aAlt: 'Checkout antigo com encerramento manual e preço da ação personalizado',
        dSrc: 'assets/img/ba2-depois.webp', dH: 1999, dAlt: 'Checkout novo com ordem limitada, preço de compra por ativo e quantidade' },
      { key: 'k3', tab: 'ba-tab-2', antes: 'Encerramento automático + melhor preço disponível', depois: 'Stop gain/loss', onde: 'Só no day trade',
        aSrc: 'assets/img/ba3-antes.webp', aH: 2029, aAlt: 'Checkout antigo com encerramento automático, lucro e prejuízo aproximados',
        dSrc: 'assets/img/ba3-depois.webp', dH: 2092, dAlt: 'Checkout novo no modo day trade, com topo preto e campos de stop loss e stop gain' }
    ];
    var baRail = baPanel.parentNode.querySelector('.ml-tabs');
    var baTabs = Array.prototype.slice.call(baRail.querySelectorAll('[role="tab"]'));
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    var pickBa = function (i, focus) {
      var c = changes[i];
      baTabs.forEach(function (t, j) {
        t.classList.toggle('is-active', i === j);
        t.setAttribute('aria-selected', i === j ? 'true' : 'false');
        t.tabIndex = i === j ? 0 : -1;
      });
      baRail.className = baRail.className.replace(/ml-tabs--i\d/, 'ml-tabs--i' + i);
      baPanel.className = baPanel.className.replace(/ml-ba--k\d/, 'ml-ba--' + c.key);
      baPanel.setAttribute('aria-labelledby', c.tab);
      baPanel.innerHTML =
        '<div class="ml-ba__side"><span class="ml-ba__tag">Antes</span>' +
        '<img class="ml-ba__screen" src="' + c.aSrc + '" alt="' + esc(c.aAlt) + '" width="900" height="' + c.aH + '">' +
        '<p class="ml-ba__caption"><strong>' + esc(c.antes) + '</strong></p></div>' +
        '<svg class="ml-ba__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>' +
        '<div class="ml-ba__side"><span class="ml-ba__tag">Depois</span>' +
        '<img class="ml-ba__screen" src="' + c.dSrc + '" alt="' + esc(c.dAlt) + '" width="900" height="' + c.dH + '">' +
        '<p class="ml-ba__caption"><strong>' + esc(c.depois) + '</strong><span class="ml-ba__sub">' + esc(c.onde) + '</span></p></div>';
      if (focus) baTabs[i].focus();
    };
    baTabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pickBa(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = baTabs.length, to = null;
        if (e.key === 'ArrowRight') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft') to = (i + n - 1) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to !== null) { e.preventDefault(); pickBa(to, true); }
      });
    });
  }

  // ---------- Visualizador de imagens: abre por cima da página; pinça, toque e arrasto ampliam ----------
  var lb = $('lb');
  if (!lb) return;
  var stage = $('lb-stage'), im = $('lbImg'), hint = $('lbHint'), zbtn = $('lbZoomBtn'), zicon = $('lbZoomIcon'), closeBtn = $('lbClose');
  var LB_MAX = 5, LB_TAP = 2.5;
  var z = { s: 1, x: 0, y: 0, ptrs: new Map(), pinch: null, pan: null, tap: null };
  var back = null, isZoomed = false;
  var isOpen = function () { return lb.classList.contains('is-open'); };

  function setZoomed(on) {
    if (on === isZoomed) return;
    isZoomed = on;
    stage.classList.toggle('is-zoomed', on);
    hint.textContent = on ? 'Arraste para navegar. Toque para voltar ao tamanho original.' : 'Toque ou use dois dedos para ampliar.';
    zbtn.setAttribute('aria-label', on ? 'Reduzir imagem' : 'Ampliar imagem');
    zicon.setAttribute('d', on ? 'M11 11h0' : 'M11 8v6');
  }
  function base() { var r = im.getBoundingClientRect(); return { L: r.left - z.x, T: r.top - z.y, W: r.width / z.s, H: r.height / z.s }; }
  function clamp(b) {
    var S = stage.getBoundingClientRect(), w = b.W * z.s, h = b.H * z.s;
    if (z.s <= 1) { z.s = 1; z.x = 0; z.y = 0; return; }
    z.x = w <= S.width ? (S.left + S.width / 2) - b.L - w / 2 : Math.min(S.left - b.L, Math.max(S.right - b.L - w, z.x));
    z.y = h <= S.height ? (S.top + S.height / 2) - b.T - h / 2 : Math.min(S.top - b.T, Math.max(S.bottom - b.T - h, z.y));
  }
  function apply(anim) {
    im.style.transition = anim ? 'transform 200ms ease' : 'none';
    im.style.transform = 'translate(' + z.x + 'px,' + z.y + 'px) scale(' + z.s + ')';
    setZoomed(z.s > 1.01);
  }
  function zoomAt(px, py, s, anim) {
    var b = base(), lx = (px - b.L - z.x) / z.s, ly = (py - b.T - z.y) / z.s;
    z.s = Math.min(LB_MAX, Math.max(1, s));
    z.x = px - b.L - lx * z.s; z.y = py - b.T - ly * z.s;
    clamp(b); apply(anim);
  }
  function reset() { z.s = 1; z.x = 0; z.y = 0; z.ptrs.clear(); z.pinch = null; z.pan = null; im.style.transition = 'none'; im.style.transform = ''; setZoomed(false); }
  function toggle(px, py) {
    if (px == null) { var S = stage.getBoundingClientRect(); px = S.left + S.width / 2; py = S.top + S.height / 2; }
    zoomAt(px, py, z.s > 1.01 ? 1 : LB_TAP, true);
  }
  function openLb(link) {
    var thumb = link.querySelector('img');
    back = link; reset();
    im.src = link.getAttribute('href'); im.alt = thumb ? thumb.alt : '';
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function closeLb() {
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    reset();
    if (back && back.focus) { try { back.focus({ preventScroll: true }); } catch (err) {} }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.lb')) return;
    var link = e.target.closest && e.target.closest('.case-img a');
    var shot = e.target.closest && e.target.closest('.ml-ba__screen');
    if (link) { e.preventDefault(); openLb(link); }
    else if (shot) { e.preventDefault(); openLb({ getAttribute: function () { return shot.getAttribute('src'); }, querySelector: function () { return shot; }, focus: function () {} }); }
  }, true);
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
  zbtn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  im.addEventListener('click', function (e) { e.stopPropagation(); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === stage || e.target.classList.contains('lb__bar')) closeLb();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) closeLb(); });

  var inStage = function (e) { return isOpen() && e.target && e.target.closest && e.target.closest('#lb-stage'); };
  document.addEventListener('pointerdown', function (e) {
    if (!inStage(e)) return;
    e.preventDefault();
    z.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (z.ptrs.size === 2) {
      var pts = Array.from(z.ptrs.values()), b = base();
      var mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
      z.pinch = { d0: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1, s0: z.s, lx: (mx - b.L - z.x) / z.s, ly: (my - b.T - z.y) / z.s };
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
      var pts = Array.from(z.ptrs.values());
      var mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
      z.s = Math.min(LB_MAX, Math.max(1, z.pinch.s0 * Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) / z.pinch.d0));
      z.x = mx - b.L - z.pinch.lx * z.s; z.y = my - b.T - z.pinch.ly * z.s;
      clamp(b); apply(false);
    } else if (z.pan) {
      if (z.tap && Math.hypot(e.clientX - z.tap.x, e.clientY - z.tap.y) > 8) z.tap = null;
      if (z.s > 1) { z.x = z.pan.tx + e.clientX - z.pan.x0; z.y = z.pan.ty + e.clientY - z.pan.y0; clamp(b); apply(false); }
    }
  }, { passive: false });
  function up(e) {
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
  document.addEventListener('pointerup', up);
  document.addEventListener('pointercancel', up);
  document.addEventListener('wheel', function (e) {
    if (!inStage(e)) return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { zoomAt(e.clientX, e.clientY, z.s * Math.exp(-e.deltaY * 0.01), false); return; }
    if (z.s > 1) { var b = base(); z.x -= e.deltaX; z.y -= e.deltaY; clamp(b); apply(false); }
  }, { passive: false });
})();
