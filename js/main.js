/* Site behaviour: theme, nav, scroll-spy, reveals, availability badge.
   No dependencies. The theme is applied earlier by the inline script in
   <head> so the page never paints in the wrong one. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------- Theme ----------------------------- */

  var themeSwitch = document.getElementById('theme-switch');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }

    if (themeSwitch) {
      var isDark = theme === 'dark';
      themeSwitch.setAttribute('aria-checked', String(isDark));
      themeSwitch.setAttribute('aria-label', 'Switch to ' + (isDark ? 'light' : 'dark') + ' mode');
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

  if (themeSwitch) {
    themeSwitch.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------- Mobile nav --------------------------- */

  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navbar = document.querySelector('.navbar');

  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('is-open', open);
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setMenu(!navMenu.classList.contains('is-open'));
    });
  }

  /* --------------------- Smooth scroll to sections --------------------- */

  document.querySelectorAll('[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      // Keep the URL shareable without the jump scrollIntoView already handled.
      history.replaceState(null, '', '#' + id);
    });
  });

  var heroScroll = document.getElementById('hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      document.getElementById('about').scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  /* ------------------------ Availability badge ------------------------ */

  var badgeWrap = document.getElementById('hero-badge-wrap');
  var badge = document.getElementById('hero-badge');
  var dropdown = document.getElementById('hero-badge-dropdown');
  var hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setBadge(open) {
    if (!badge || !dropdown) return;
    dropdown.hidden = !open;
    badge.setAttribute('aria-expanded', String(open));
  }

  if (badge && dropdown && badgeWrap) {
    if (hoverCapable) {
      badgeWrap.addEventListener('mouseenter', function () { setBadge(true); });
      badgeWrap.addEventListener('mouseleave', function () { setBadge(false); });
      // Hover already opened it by the time the click lands, so a toggle here
      // would close it on the way in. Keyboard Enter also arrives as a click.
      badge.addEventListener('click', function () { setBadge(true); });
      badge.addEventListener('focus', function () { setBadge(true); });
    } else {
      badge.addEventListener('click', function () { setBadge(dropdown.hidden); });
    }

    // Keyboard users get it via focus, and lose it when focus leaves the group.
    badgeWrap.addEventListener('focusout', function (e) {
      if (!badgeWrap.contains(e.relatedTarget)) setBadge(false);
    });
  }

  /* ------------------- Dismiss overlays on outside/Esc ------------------- */

  document.addEventListener('click', function (e) {
    if (badgeWrap && !badgeWrap.contains(e.target)) setBadge(false);

    if (
      navMenu && navMenu.classList.contains('is-open') &&
      !navMenu.contains(e.target) && !navToggle.contains(e.target)
    ) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    setBadge(false);
    if (navMenu && navMenu.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ------------------------- Navbar hairline ------------------------- */

  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------- Scroll-spy --------------------------- */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-menu > li > a[data-scroll]')
  );
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  /* Straight off scroll position rather than an IntersectionObserver band:
     when two sections overlap the band an observer has to guess which one
     you mean, and it picked the wrong one. This is unambiguous — the last
     section whose top has passed the reading line is the active one. */
  if (sections.length) {
    var spyQueued = false;

    var updateSpy = function () {
      spyQueued = false;
      var line = window.scrollY + parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10
      ) + 120;

      var activeId = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= line) activeId = s.id;
      });

      // Anything below the last section's start (i.e. the footer) keeps the
      // final link lit rather than dropping the highlight entirely.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        activeId = sections[sections.length - 1].id;
      }

      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + activeId);
      });
    };

    var queueSpy = function () {
      if (spyQueued) return;
      spyQueued = true;
      requestAnimationFrame(updateSpy);
    };

    updateSpy();
    window.addEventListener('scroll', queueSpy, { passive: true });
    window.addEventListener('resize', queueSpy);
  }

  /* ------------------------ Reveal on scroll ------------------------ */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }
})();
