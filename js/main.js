/* ==========================================================================
   Staff4You - interactie (puur client-side, geen backend)
   ========================================================================== */

/* --- Config: pas deze twee waarden aan met de echte gegevens ------------- */
var CONFIG = {
  WHATSAPP: '31600000000',        // [WHATSAPP-NUMMER] zonder + of spaties, bv. 31612345678
  TEL: '+31600000000',            // [TELEFOONNUMMER]
  EMAIL: 'info@staff-foryou.nl'
};

(function () {
  'use strict';

  /* --- Header scroll-status -------------------------------------------- */
  var header = document.querySelector('.header');
  var isSolidPage = header && header.classList.contains('solid');
  function onScroll() {
    if (isSolidPage) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  if (header && !isSolidPage) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }

  /* --- Mobiel menu ------------------------------------------------------ */
  var menu = document.getElementById('mobileMenu');
  var openBtn = document.getElementById('menuOpen');
  var closeBtn = document.getElementById('menuClose');
  function closeMenu() { if (menu) menu.classList.remove('open'); document.body.style.overflow = ''; }
  if (openBtn) openBtn.addEventListener('click', function () { menu.classList.add('open'); document.body.style.overflow = 'hidden'; });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* --- Reveal bij scrollen --------------------------------------------- */
  var revEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revEls.forEach(function (el) { ro.observe(el); });
  } else { revEls.forEach(function (el) { el.classList.add('in'); }); }

  /* --- Hoe het werkt: lijn + stappen laten oplichten ------------------- */
  var steps = document.querySelectorAll('.step');
  var lineEl = document.querySelector('.steps-line');
  if ('IntersectionObserver' in window && steps.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('lit');
          if (lineEl) lineEl.classList.add('fill');
        }
      });
    }, { threshold: 0.4 });
    steps.forEach(function (s) { so.observe(s); });
  } else { steps.forEach(function (s) { s.classList.add('lit'); }); if (lineEl) lineEl.classList.add('fill'); }

  /* --- Swipe-track pijlen ---------------------------------------------- */
  document.querySelectorAll('[data-track]').forEach(function (block) {
    var track = block.querySelector('.track');
    var prev = block.querySelector('[data-prev]');
    var next = block.querySelector('[data-next]');
    if (!track) return;
    function step() { var c = track.querySelector('*'); return c ? c.getBoundingClientRect().width + 16 : 320; }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* --- FAQ accordion ---------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      if (open) { item.classList.remove('open'); a.style.maxHeight = 0; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* --- Tarieven tabs ---------------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = group.querySelectorAll('.tab');
    var panels = group.querySelectorAll('.price-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var target = group.querySelector('#' + tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });

  /* --- Optie-keuzes (widget) ------------------------------------------- */
  document.querySelectorAll('.opt input').forEach(function (input) {
    input.addEventListener('change', function () {
      var opt = input.closest('.opt');
      if (!opt) return;
      if (input.type === 'radio') {
        opt.parentNode.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
      }
      opt.classList.toggle('sel', input.checked);
    });
  });

  /* --- Aanvraag-widget: stappen ---------------------------------------- */
  var W = document.getElementById('aanvraag');
  if (W) {
    var panels = W.querySelectorAll('.wpanel');
    var stepEls = W.querySelectorAll('.wstep');
    var wline = W.querySelector('.wline');
    var toStep2 = W.querySelector('[data-next-step]');
    var back = W.querySelector('[data-prev-step]');

    function showStep(n) {
      panels.forEach(function (p) { p.classList.toggle('active', p.dataset.panel == n); });
      stepEls.forEach(function (s) {
        var sn = s.dataset.step;
        s.classList.toggle('active', sn == n);
        s.classList.toggle('done', sn < n);
      });
      if (wline) wline.classList.toggle('filled', n >= 2);
    }

    function validateStep1() {
      var ok = true;
      W.querySelectorAll('[data-panel="1"] [required]').forEach(function (f) {
        var wf = f.closest('.wfield');
        if (!f.value.trim()) { if (wf) wf.classList.add('err'); ok = false; }
        else if (wf) wf.classList.remove('err');
      });
      return ok;
    }

    if (toStep2) toStep2.addEventListener('click', function () { if (validateStep1()) showStep(2); });
    if (back) back.addEventListener('click', function () { showStep(1); });

    W.querySelectorAll('[required]').forEach(function (f) {
      f.addEventListener('input', function () { var wf = f.closest('.wfield'); if (wf) wf.classList.remove('err'); });
    });

    var submit = W.querySelector('[data-submit]');
    if (submit) submit.addEventListener('click', function () {
      var ok = true;
      W.querySelectorAll('[data-panel="2"] [required]').forEach(function (f) {
        var wf = f.closest('.wfield');
        if (!f.value.trim()) { if (wf) wf.classList.add('err'); ok = false; }
        else if (wf) wf.classList.remove('err');
      });
      if (!validateStep1()) { showStep(1); return; }
      if (!ok) return;

      function val(name) { var el = W.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; }
      var opts = [];
      W.querySelectorAll('[data-panel="2"] .opt.sel input').forEach(function (i) { opts.push(i.dataset.label || i.value); });

      var msg =
        '*Nieuwe personeelsaanvraag - Staff4You*%0A%0A' +
        '*Sector:* ' + enc(val('sector')) + '%0A' +
        '*Aantal krachten:* ' + enc(val('aantal')) + '%0A' +
        '*Startdatum:* ' + enc(val('startdatum')) + '%0A' +
        '*Periode:* ' + enc(val('periode')) + '%0A%0A' +
        '*Bedrijf:* ' + enc(val('bedrijf')) + '%0A' +
        '*Contactpersoon:* ' + enc(val('contact')) + '%0A' +
        '*Telefoon/e-mail:* ' + enc(val('contactinfo')) + '%0A' +
        (opts.length ? '*Wensen:* ' + enc(opts.join(', ')) + '%0A' : '') +
        (val('opmerkingen') ? '%0A*Opmerkingen:* ' + enc(val('opmerkingen')) : '');

      window.open('https://wa.me/' + CONFIG.WHATSAPP + '?text=' + msg, '_blank');
    });

    function enc(s) { return encodeURIComponent(s).replace(/%20/g, ' '); }
  }

  /* --- Prefill vanuit knoppen elders ----------------------------------- */
  document.querySelectorAll('[data-prefill-sector]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var sec = btn.dataset.prefillSector;
      var sel = document.querySelector('#aanvraag [name="sector"]');
      if (sel) {
        Array.prototype.forEach.call(sel.options, function (o) { if (o.value === sec) sel.value = sec; });
        var wf = sel.closest('.wfield'); if (wf) wf.classList.remove('err');
      }
      var hero = document.getElementById('top');
      if (hero) { e.preventDefault(); hero.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* --- Sectorkaarten vullen de widget vooraf in ------------------------ */
  var sectorSelect = document.querySelector('#aanvraag [name="sector"]');
  if (sectorSelect) {
    document.querySelectorAll('#sectoren .sector-card').forEach(function (card) {
      var h = card.querySelector('h3');
      if (!h) return;
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      function pick() {
        var name = h.textContent.trim();
        Array.prototype.forEach.call(sectorSelect.options, function (o) {
          if (o.text.trim() === name) sectorSelect.value = o.value;
        });
        var wf = sectorSelect.closest('.wfield'); if (wf) wf.classList.remove('err');
        var top = document.getElementById('top'); if (top) top.scrollIntoView({ behavior: 'smooth' });
      }
      card.addEventListener('click', pick);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  }

  /* --- Set WhatsApp / tel links overal -------------------------------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    var text = a.dataset.wa || 'Hoi Staff4You, ik heb een vraag.';
    a.href = 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(text);
  });
  document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:' + CONFIG.TEL; });
  document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = 'mailto:' + CONFIG.EMAIL; });

  /* --- Jaartal footer --------------------------------------------------- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
