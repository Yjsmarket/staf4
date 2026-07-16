/* ==========================================================================
   Staff4You - interactie (puur client-side, geen backend)
   ========================================================================== */

/* --- Config: pas deze twee waarden aan met de echte gegevens ------------- */
var CONFIG = {
  EMAIL: 'info@staff-foryou.nl'   // [E-MAILADRES]
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

  /* --- Werkwijze: stappen na elkaar laten oplichten + gloeilijn vullen -- */
  var stepsWrap = document.querySelector('.steps-wrap');
  var steps = document.querySelectorAll('.step');
  var lineFill = document.querySelector('.steps-line-fill');
  var stepsDone = false;
  function litStep(i) {
    if (i >= steps.length) return;
    steps[i].classList.add('lit');
    if (lineFill && steps.length > 1) lineFill.style.transform = 'scaleX(' + (i / (steps.length - 1)) + ')';
  }
  function runSteps() {
    if (stepsDone) return;
    stepsDone = true;
    steps.forEach(function (s, i) { setTimeout(function () { litStep(i); }, i * 480); });
  }
  function checkSteps() {
    if (stepsDone || !stepsWrap) return;
    var r = stepsWrap.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.82 && r.bottom > 0) runSteps();
  }
  if (stepsWrap) {
    window.addEventListener('scroll', checkSteps, { passive: true });
    window.addEventListener('resize', checkSteps);
    checkSteps();
  }

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

      var lines = [
        'Nieuwe personeelsaanvraag - Staff4You', '',
        'Sector: ' + val('sector'),
        'Aantal krachten: ' + val('aantal'),
        'Startdatum: ' + val('startdatum'),
        'Periode: ' + val('periode'), '',
        'Bedrijf: ' + val('bedrijf'),
        'Contactpersoon: ' + val('contact'),
        'Contact: ' + val('contactinfo')
      ];
      if (opts.length) lines.push('Wensen: ' + opts.join(', '));
      if (val('opmerkingen')) { lines.push(''); lines.push('Opmerkingen: ' + val('opmerkingen')); }

      var subject = 'Personeelsaanvraag - ' + (val('sector') || 'Staff4You');
      window.location.href = 'mailto:' + CONFIG.EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('
'));
    });
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

  /* --- Mail links (met optioneel onderwerp) ---------------------------- */
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    var subj = a.getAttribute('data-subject');
    a.href = 'mailto:' + CONFIG.EMAIL + (subj ? '?subject=' + encodeURIComponent(subj) : '');
  });

})();
