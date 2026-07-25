/* ============================================================
   KAMATENU SUPPLIERS — script.js
   Handles: dark/light theme (persisted), mobile nav, FAQ
   accordion, active-link highlighting, back-to-top, newsletter
   + booking form feedback.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (dark / light) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'kamatenu-theme';

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Respect saved choice, else system preference, else default dark
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme){
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches){
    applyTheme('light');
  } else {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav after clicking a link
  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all other items (single-open accordion)
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item){
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Active nav link on scroll (single-page sections only) ---------- */
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.main-nav > ul > li > a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        const matchingLink = document.querySelector(`.main-nav > ul > li > a[href="#${id}"]`);
        // Only steal "active" state for genuine same-page hash links.
        // On this multi-page site the top-level nav links point to
        // separate .html files, so this is a no-op there and leaves
        // the server-set current-page highlight alone.
        if (matchingLink){
          navLinks.forEach(link => link.classList.toggle('active', link === matchingLink));
        }
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 480);
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Newsletter form (front-end only) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterNote.textContent = 'Thank you — you are on the list for offers and updates.';
    newsletterNote.classList.add('success');
    newsletterForm.reset();
  });

  /* ---------- Book Event form (front-end only) ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const bookingNote = document.getElementById('bookingNote');

  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    bookingNote.textContent = 'Request received — our team will call you within 24 hours to confirm details.';
    bookingNote.classList.add('success');
    bookingForm.reset();
  });

});