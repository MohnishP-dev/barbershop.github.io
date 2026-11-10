/* ==========================================================================
   Pankaj Barber Shop — main.js
   --------------------------------------------------------------------------
   Everything editable lives in SITE below. Hours are read from the shop's
   public Google listing and are shown in Muscat time (Asia/Muscat, UTC+4)
   no matter where the visitor is browsing from.
   ========================================================================== */

const SITE = {
  name: 'Pankaj Barber Shop',
  timeZone: 'Asia/Muscat',

  /* Daily sessions, in minutes from midnight. Google listing: 8:30 AM–1 PM
     and 4 PM–11 PM, seven days a week. */
  sessions: [
    { open: 8 * 60 + 30, close: 13 * 60 },
    { open: 16 * 60,    close: 23 * 60 }
  ],

  mapUrl: 'https://maps.app.goo.gl/YVuALALM1w35sD3P8'
};

/* ---------------------------------------------------------------- helpers */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/** Current time in the shop's timezone, as { day, minutes }. */
function shopTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE.timeZone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const val = type => (parts.find(p => p.type === type) || {}).value || '0';
  let hour = parseInt(val('hour'), 10);
  if (hour === 24) hour = 0;                    // some engines emit 24 for midnight

  return {
    day: Math.max(0, DAYS.indexOf(val('weekday'))),
    minutes: hour * 60 + parseInt(val('minute'), 10)
  };
}

/** 795 -> "12:45 PM" */
function fmtTime(mins) {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${suffix}`;
}

/* ---------------------------------------------------- open / closed badge */
function renderStatus() {
  const badge = $('#status');
  const text  = $('#statusText');
  if (!badge || !text) return;

  const { minutes } = shopTime();
  const sessions = SITE.sessions;

  const current = sessions.find(s => minutes >= s.open && minutes < s.close);
  const upcoming = sessions.find(s => minutes < s.open);

  if (current) {
    badge.dataset.state = 'open';
    text.textContent = `Open now · Closes ${fmtTime(current.close)}`;
  } else {
    badge.dataset.state = 'closed';
    const next = upcoming || sessions[0];        // first session tomorrow
    const label = upcoming ? 'Opens' : 'Opens tomorrow';
    text.textContent = upcoming
      ? `Closed · ${label} ${fmtTime(next.open)}`
      : `Closed · ${label} at ${fmtTime(next.open)}`;
  }
}

/* -------------------------------------------------------- today's hours */
function highlightToday() {
  const { day } = shopTime();
  $$('#hoursTable tr').forEach(row => {
    row.classList.toggle('is-today', Number(row.dataset.day) === day);
  });
}

/* ------------------------------------------------------------ header bar */
function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 14);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------- mobile menu */
function initNav() {
  const burger = $('#burger');
  const nav = $('#nav');
  if (!burger || !nav) return;

  const setOpen = open => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', e => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });
}

/* ------------------------------------------------- scroll reveal + stagger */
function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  // gentle stagger among siblings that enter together
  items.forEach(el => {
    const siblings = $$('.reveal', el.parentElement);
    const i = Math.min(siblings.indexOf(el), 5);
    el.style.transitionDelay = `${i * 75}ms`;
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(el => io.observe(el));
}

/* --------------------------------------------------- active nav highlight */
function initActiveLink() {
  const links = $$('.nav a[href^="#"]');
  const sections = links
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ------------------------------------------------------------ back to top */
function initToTop() {
  const btn = $('#toTop');
  if (!btn) return;

  btn.hidden = false;
  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 650);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------------ boot */
function init() {
  renderStatus();
  highlightToday();
  initHeader();
  initNav();
  initReveal();
  initActiveLink();
  initToTop();

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // keep the badge and "today" row truthful across midnight / long visits
  setInterval(() => { renderStatus(); highlightToday(); }, 60000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
