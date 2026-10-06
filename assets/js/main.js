/**
 * Markets Decoded Inc. — page runtime
 * ------------------------------------------------------------------
 * 1. Renders components into [data-component] slots.
 * 2. Wires behaviour: mega menu, mobile drawer, scroll reveal,
 *    count-up numbers, insight filters and the contact form.
 *
 * Next.js migration: rendering is replaced by JSX; each behaviour
 * below becomes a small client component or hook (see
 * MIGRATION_TO_NEXTJS.md).
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- */
  /* Contact form configuration                                       */
  /* ---------------------------------------------------------------- */
  // The form opens a pre-filled email to the site inbox (site-data.js →
  // site.email). To post directly instead, set FORM_ENDPOINT to a form
  // service URL (e.g. 'https://formspree.io/f/<id>').
  var FORM_ENDPOINT = '';
  var FORM_ENDPOINT_IS_PLACEHOLDER = !FORM_ENDPOINT;

  var data = window.SITE_DATA;
  var C = window.Components;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- */
  /* 1. Render                                                         */
  /* ---------------------------------------------------------------- */
  function render() {
    var slots = document.querySelectorAll('[data-component]');
    Array.prototype.forEach.call(slots, function (el) {
      var name = el.getAttribute('data-component');
      var fn = C[name];
      if (!fn) {
        console.warn('[components] Unknown component:', name);
        return;
      }
      var props = {};
      var raw = el.getAttribute('data-props');
      if (raw) {
        try { props = JSON.parse(raw); } catch (e) { console.warn('[components] Bad data-props on', name, e); }
      }
      // `replace` swaps the slot element itself (used for header/footer
      // so landmarks are not wrapped in extra divs).
      if (el.hasAttribute('data-replace')) {
        el.outerHTML = fn(props, data);
      } else {
        el.innerHTML = fn(props, data);
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* 2a. Mega menu (desktop)                                           */
  /* ---------------------------------------------------------------- */
  function initMegaMenu() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var triggers = header.querySelectorAll('.nav-trigger');
    var hoverTimer;
    var hoverOpenedAt = 0;

    function closeAll(except) {
      Array.prototype.forEach.call(triggers, function (t) {
        if (t === except) return;
        t.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
      header.classList.toggle('mega-open', !!except);
    }

    function open(t) {
      closeAll(t);
      t.setAttribute('aria-expanded', 'true');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = false;
      header.classList.add('mega-open');
    }

    Array.prototype.forEach.call(triggers, function (t) {
      var item = t.parentElement;
      t.addEventListener('click', function () {
        // A click right after hover-open should not immediately close it.
        if (t.getAttribute('aria-expanded') === 'true' && Date.now() - hoverOpenedAt > 500) closeAll();
        else open(t);
      });
      // Hover intent for pointer devices
      item.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { open(t); hoverOpenedAt = Date.now(); }, 90);
      });
      item.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'touch') return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { closeAll(); }, 180);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openT = header.querySelector('.nav-trigger[aria-expanded="true"]');
      if (openT) { closeAll(); openT.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeAll();
    });
    // Close when focus leaves the nav entirely
    header.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !header.querySelector('.primary-nav').contains(e.relatedTarget)) closeAll();
    });

    // Elevated header once the page scrolls
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------- */
  /* 2b. Mobile drawer                                                 */
  /* ---------------------------------------------------------------- */
  function initDrawer() {
    var toggle = document.querySelector('.menu-toggle');
    var drawer = document.getElementById('mobile-drawer');
    if (!toggle || !drawer) return;
    var closeBtn = drawer.querySelector('.drawer-close');
    var lastFocus;

    function focusables() {
      return drawer.querySelectorAll('a[href], button, summary, [tabindex]:not([tabindex="-1"])');
    }
    function openDrawer() {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('no-scroll');
      closeBtn.focus();
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('no-scroll');
      setTimeout(function () { drawer.hidden = true; }, reduceMotion ? 0 : 250);
      if (lastFocus) lastFocus.focus();
    }

    toggle.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') return closeDrawer();
      if (e.key !== 'Tab') return;
      var f = focusables();
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Close after following an in-page link
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeDrawer();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && !drawer.hidden) closeDrawer();
    });
  }

  /* ---------------------------------------------------------------- */
  /* 2c. Scroll reveal + count-up                                      */
  /* ---------------------------------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target) || reduceMotion) return;
    var start = null, dur = 1200;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        var counts = entry.target.querySelectorAll('[data-count]');
        Array.prototype.forEach.call(counts, countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- */
  /* 2d. Insight filters                                               */
  /* ---------------------------------------------------------------- */
  function initFilters() {
    var group = document.querySelector('.filters');
    if (!group) return;
    var status = document.getElementById('filter-status');
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(group.querySelectorAll('[data-filter]'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      var shown = 0;
      Array.prototype.forEach.call(document.querySelectorAll('.insight-card'), function (card) {
        var match = f === 'all' || card.getAttribute('data-type') === f;
        card.hidden = !match;
        if (match) { shown++; card.classList.add('is-visible'); }
      });
      if (status) status.textContent = 'Showing ' + shown + (shown === 1 ? ' item' : ' items') + (f === 'all' ? '' : ' of type ' + f) + '.';
    });
  }

  /* ---------------------------------------------------------------- */
  /* 2e. Contact form                                                  */
  /* ---------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var statusEl = form.querySelector('.form-status');

    // Pre-select interest from ?interest=… (e.g. links from CTAs)
    try {
      var interest = new URLSearchParams(window.location.search).get('interest');
      if (interest && form.interest.querySelector('option[value="' + CSS.escape(interest) + '"]')) form.interest.value = interest;
    } catch (e) { /* older browsers: ignore */ }

    var messages = {
      name: 'Please enter your name.',
      email: 'Please enter a valid work email.',
      firm: 'Please enter your firm.',
      role: 'Please enter your role.',
      interest: 'Please choose what you’re interested in.',
      message: 'Please add a short message.'
    };

    function validate() {
      var firstInvalid = null;
      Object.keys(messages).forEach(function (name) {
        var input = form.elements[name];
        var err = document.getElementById(name + '-error');
        var ok = input.checkValidity() && String(input.value).trim() !== '';
        input.setAttribute('aria-invalid', String(!ok));
        if (ok) {
          err.hidden = true; err.textContent = '';
          input.removeAttribute('aria-describedby');
        } else {
          err.hidden = false; err.textContent = messages[name];
          input.setAttribute('aria-describedby', name + '-error');
          if (!firstInvalid) firstInvalid = input;
        }
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    function labelFor(value) {
      var i = data.contact.interests.filter(function (x) { return x.value === value; })[0];
      return i ? i.label : value;
    }

    function mailtoFallback(fd) {
      var subject = 'Website enquiry: ' + labelFor(fd.get('interest'));
      var body =
        'Name: ' + fd.get('name') + '\n' +
        'Email: ' + fd.get('email') + '\n' +
        'Firm: ' + fd.get('firm') + '\n' +
        'Role: ' + fd.get('role') + '\n' +
        'Interest: ' + labelFor(fd.get('interest')) + '\n\n' +
        fd.get('message');
      window.location.href = 'mailto:' + data.site.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      statusEl.textContent = 'Your email app should open with your message ready to send. If it does not, email us at ' + data.site.email + '.';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('is-error', 'is-success');
      if (!validate()) {
        statusEl.textContent = 'Please correct the highlighted fields.';
        statusEl.classList.add('is-error');
        return;
      }
      var fd = new FormData(form);
      if (fd.get('_gotcha')) return; // bot

      if (FORM_ENDPOINT_IS_PLACEHOLDER || !window.fetch) {
        mailtoFallback(fd);
        return;
      }

      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      statusEl.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          statusEl.textContent = 'Thank you. A member of our team will reply within one business day.';
          statusEl.classList.add('is-success');
        })
        .catch(function () {
          statusEl.classList.add('is-error');
          mailtoFallback(fd);
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------------------------------------------------------------- */
  function boot() {
    if (!data || !C) {
      console.error('[site] SITE_DATA or Components failed to load.');
      return;
    }
    render();
    initMegaMenu();
    initDrawer();
    initReveal();
    initFilters();
    initContactForm();
    // Re-apply hash scroll after JS-rendered content exists.
    if (window.location.hash) {
      var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
