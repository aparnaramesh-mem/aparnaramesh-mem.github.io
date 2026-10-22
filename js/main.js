/* Progressive enhancement only: all content and program details work without JS. */
(function () {
  'use strict';

  var root = document.documentElement;
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var themeSwitch = document.getElementById('theme-switch');
  var copyButton = document.getElementById('copy-email');
  var copyStatus = document.getElementById('copy-status');
  var desktop = window.matchMedia('(min-width: 821px)');

  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  if (navToggle && navMenu) {
    navToggle.hidden = false;
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) navMenu.querySelector('a').focus({ preventScroll: true });
    });
    document.addEventListener('click', function (event) {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        navToggle.focus();
      }
    });
    document.addEventListener('focusin', function (event) {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) setMenu(false);
    });
    desktop.addEventListener('change', function () { setMenu(false); });
  }

  // Preserve native anchor navigation and browser Back/Forward behavior.
  // Focusing the destination puts the next Tab in the destination section.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      setMenu(false);
      target.focus({ preventScroll: true });
    });
  });

  function syncTheme() {
    if (themeSwitch) themeSwitch.setAttribute('aria-checked', String(root.dataset.theme === 'dark'));
  }

  if (themeSwitch) {
    themeSwitch.hidden = false;
    syncTheme();
    themeSwitch.addEventListener('click', function () {
      var theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = theme;
      syncTheme();
      try { localStorage.setItem('theme', theme); } catch (e) { /* Storage is optional. */ }
    });
  }

  if (copyButton && copyStatus && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText('contact.aparnaramesh@gmail.com');
        copyStatus.textContent = 'Email address copied.';
      } catch (e) {
        copyStatus.textContent = 'You can select and copy the email address above.';
      }
    });
  }

  var navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  var sections = Array.from(document.querySelectorAll('main > section')).filter(function (section) {
    return navLinks.some(function (link) { return link.getAttribute('href') === '#' + section.id; });
  });
  var queued = false;

  function updateCurrentLocation() {
    queued = false;
    var header = document.querySelector('.site-header');
    var readingLine = header.getBoundingClientRect().height + 100;
    var activeId = 'home';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= readingLine) activeId = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) activeId = 'contact';
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + activeId) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function queueLocationUpdate() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(updateCurrentLocation);
  }

  // Older print engines need disclosures explicitly opened for printing.
  var printOpened = null;
  window.addEventListener('beforeprint', function () {
    if (printOpened !== null) return;
    printOpened = Array.from(document.querySelectorAll('details:not([open])'));
    printOpened.forEach(function (details) { details.open = true; });
  });
  window.addEventListener('afterprint', function () {
    if (printOpened === null) return;
    printOpened.forEach(function (details) { details.open = false; });
    printOpened = null;
  });

  // Collapse only after the mobile controls and listeners are ready.
  root.classList.add('has-js');
  updateCurrentLocation();
  window.addEventListener('scroll', queueLocationUpdate, { passive: true });
  window.addEventListener('resize', queueLocationUpdate);
})();
