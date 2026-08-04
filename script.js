/* ══════════════════════════════════════════════════════════════
   SANTIAGO HERMOSILLA — PORTFOLIO
   Vanilla JS. Sin dependencias, sin build.
   ══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const SKILLS = [
  { name:'HTML5',      pct:96, icon:'devicon-html5-plain colored',      lvl:'expert' },
  { name:'CSS3',       pct:93, icon:'devicon-css3-plain colored',       lvl:'expert' },
  { name:'React',      pct:92, icon:'devicon-react-original colored',   lvl:'adv'    },
  { name:'JavaScript', pct:90, icon:'devicon-javascript-plain colored', lvl:'adv'    },
  { name:'TypeScript', pct:85, icon:'devicon-typescript-plain colored', lvl:'adv'    },
  { name:'Node.js',    pct:82, icon:'devicon-nodejs-plain colored',     lvl:'solid'  },
  { name:'Express',    pct:80, icon:'devicon-express-original',         lvl:'solid'  },
  { name:'MongoDB',    pct:78, icon:'devicon-mongodb-plain colored',    lvl:'solid'  },
  { name:'MySQL',      pct:78, icon:'devicon-mysql-original colored',   lvl:'solid'  },
  { name:'Git',        pct:76, icon:'devicon-git-plain colored',        lvl:'solid'  },
];

const LEVELS = {
  expert: { es:'Experto',  en:'Expert'   },
  adv:    { es:'Avanzado', en:'Advanced' },
  solid:  { es:'Sólido',   en:'Solid'    },
};

const ROLES = {
  es:['Desarrollador Full Stack.','Entusiasta de React.','Constructor de UI.','Dev de JavaScript.'],
  en:['Full Stack Developer.','React Enthusiast.','UI Builder.','JavaScript Dev.'],
};

const UI = {
  sending: { es:'Enviando…',                                    en:'Sending…' },
  ok:      { es:'✓ ¡Mensaje enviado! Te respondo a la brevedad.', en:'✓ Message sent! I\'ll get back to you shortly.' },
  err:     { es:'✕ Algo falló. Escribime directo por mail.',      en:'✕ Something went wrong. Email me directly.' },
  invalid: { es:'✕ Completá todos los campos con datos válidos.', en:'✕ Please fill every field with valid data.' },
  demo:    { es:'Ver demo',  en:'Live demo'   },
  repo:    { es:'Ver código', en:'View code'  },
};

let lang = localStorage.getItem('sh-lang') || 'es';

/* ─────────────────────────────────────────────
   IDIOMA
   ───────────────────────────────────────────── */
function applyLang(next){
  lang = next;
  localStorage.setItem('sh-lang', lang);
  document.documentElement.lang = lang;

  $$('[data-es][data-en]').forEach(el => {
    const val = el.dataset[lang];
    if (val !== undefined) el.textContent = val;
  });

  $$('[data-ph-es][data-ph-en]').forEach(el => {
    el.placeholder = lang === 'es' ? el.dataset.phEs : el.dataset.phEn;
  });

  const toggle = $('#langToggle');
  toggle.classList.toggle('en', lang === 'en');
  $$('[data-lang-opt]', toggle).forEach(o => o.classList.toggle('on', o.dataset.langOpt === lang));

  $$('.sk__level').forEach(el => { el.textContent = LEVELS[el.dataset.lvl][lang]; });

  restartTypewriter();
  if ($('#modal').classList.contains('open')) renderModal(activeCard);
}

$('#langToggle').addEventListener('click', () => applyLang(lang === 'es' ? 'en' : 'es'));

/* ─────────────────────────────────────────────
   TEMA
   ───────────────────────────────────────────── */
const savedTheme = localStorage.getItem('sh-theme')
  || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
document.documentElement.dataset.theme = savedTheme;

$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('sh-theme', next);
});

/* ─────────────────────────────────────────────
   LOADER + WIPE
   ───────────────────────────────────────────── */
function buildLoader(){
  const host = $('#loaderName');
  const frag = document.createDocumentFragment();
  let i = 0;

  // Una palabra = un bloque indivisible. El wrap ocurre entre palabras,
  // nunca entre letras.
  'Santiago Hermosilla'.split(' ').forEach(word => {
    const w = document.createElement('span');
    w.className = 'loader__word';
    [...word].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.animationDelay = `${0.18 + i++ * 0.035}s`;
      w.appendChild(s);
    });
    frag.appendChild(w);
  });

  host.appendChild(frag);
}

function runLoader(){
  const loader = $('#loader'), bar = $('#loaderBar'), pct = $('#loaderPct'), wipe = $('#wipe');
  document.body.classList.add('locked');

  if (REDUCED){
    loader.remove(); document.body.classList.remove('locked'); boot();
    return;
  }

  buildLoader();

  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.random() * 9 + 4);
    bar.style.width = n + '%';
    pct.textContent = String(Math.floor(n)).padStart(2, '0');

    if (n >= 100){
      clearInterval(tick);

      setTimeout(() => {
        wipe.classList.add('sweep');                 // 780ms de barrido continuo

        // A los 380ms el naranja tapa la pantalla entera: ese es el punto ciego
        // donde se cambia el loader por el sitio, sin fade ni parpadeo.
        setTimeout(() => {
          loader.remove();
          document.body.classList.remove('locked');
          boot();
        }, 380);

        setTimeout(() => wipe.remove(), 820);
      }, 140);
    }
  }, 115);
}

/* ─────────────────────────────────────────────
   TYPEWRITER
   ───────────────────────────────────────────── */
let twTimer = null;
function restartTypewriter(){
  clearTimeout(twTimer);
  const out = $('#typewriter');
  if (!out) return;

  const list = ROLES[lang];
  let i = 0, c = 0, deleting = false;
  const myLang = lang;

  (function loop(){
    if (myLang !== lang) return;                     // el idioma cambió: cortá esta instancia
    const word = list[i];
    c += deleting ? -1 : 1;
    out.textContent = word.slice(0, c);

    let wait = deleting ? 42 : 72;
    if (!deleting && c === word.length){ deleting = true; wait = 1700; }
    else if (deleting && c === 0){ deleting = false; i = (i + 1) % list.length; wait = 320; }

    twTimer = setTimeout(loop, wait);
  })();
}

/* ─────────────────────────────────────────────
   STACK
   ───────────────────────────────────────────── */
function buildStack(){
  const grid = $('#stackGrid');
  grid.innerHTML = SKILLS.map((s, i) => `
    <article class="sk reveal" data-cursor="card" style="transition-delay:${i * 45}ms">
      <div class="sk__top">
        <span class="sk__logo"><i class="${s.icon}"></i></span>
        <span>
          <span class="sk__name">${s.name}</span><br>
          <span class="sk__level" data-lvl="${s.lvl}">${LEVELS[s.lvl][lang]}</span>
        </span>
        <span class="sk__pct">${s.pct}%</span>
      </div>
      <div class="sk__track"><div class="sk__bar" data-pct="${s.pct}"></div></div>
    </article>
  `).join('');
}

/* ─────────────────────────────────────────────
   REVEAL + BARRAS
   ───────────────────────────────────────────── */
function observeAll(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');

      const bar = $('.sk__bar', e.target);
      if (bar) setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 180);

      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────── */
function initNav(){
  const nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');

  const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('on', open);
    document.body.classList.toggle('locked', open);
  });

  links.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A') return;
    links.classList.remove('open');
    burger.classList.remove('on');
    document.body.classList.remove('locked');
  });

  // link activo según sección visible
  const sections = $$('main section[id]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.nav__links a').forEach(a =>
        a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

/* ─────────────────────────────────────────────
   CURSOR
   ───────────────────────────────────────────── */
function initCursor(){
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot = $('#cursorDot'), ring = $('#cursorRing');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.add('cursor-on');
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;

    const hit = e.target.closest('[data-cursor]');
    const kind = hit ? hit.dataset.cursor : '';
    document.body.classList.toggle('cur-link',   kind === 'link');
    document.body.classList.toggle('cur-card',   kind === 'card');
    document.body.classList.toggle('cur-hidden', kind === 'hidden');
  }, { passive:true });

  addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));

  (function follow(){
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(follow);
  })();
}

/* ─────────────────────────────────────────────
   MODAL DE PROYECTOS
   ───────────────────────────────────────────── */
let activeCard = null;
const modal = $('#modal');

function renderModal(card){
  if (!card) return;
  const d = card.dataset;

  $('#modalMedia').innerHTML = d.img
    ? `<img src="${d.img}" alt="${d.title}">`
    : `<div class="poster"><span class="poster__num">${d.poster || ''}</span>
         <span class="poster__label mono">${d.techs.split(',').slice(0,3).join(' · ')}</span></div>`;

  $('#modalTitle').textContent = d.title;
  $('#modalDesc').textContent  = lang === 'es' ? d.longEs : d.longEn;
  $('#modalTags').innerHTML    = d.techs.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');

  const cta = [];
  if (d.demo) cta.push(`<a class="btn btn--solid" href="${d.demo}" target="_blank" rel="noopener" data-cursor="link">${UI.demo[lang]}</a>`);
  if (d.repo) cta.push(`<a class="btn btn--ghost" href="${d.repo}" target="_blank" rel="noopener" data-cursor="link">${UI.repo[lang]}</a>`);
  $('#modalCta').innerHTML = cta.join('');
}

function openModal(card){
  activeCard = card;
  renderModal(card);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
  $('#modalClose').focus();
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('locked');
  if (activeCard) activeCard.focus?.();
  activeCard = null;
}

function initModal(){
  $$('#projects .proj').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(card); }
    });
  });

  $('#modalClose').addEventListener('click', closeModal);
  $('.modal__backdrop').addEventListener('click', closeModal);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ─────────────────────────────────────────────
   FORMULARIO (Formspree)
   ───────────────────────────────────────────── */
function initForm(){
  const form = $('#contactForm'), note = $('#formNote'), btn = $('#submitBtn');
  const label = $('span', btn);
  const original = { es:'Enviar mensaje', en:'Send message' };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    note.className = 'form__note';

    if (!form.checkValidity()){
      note.textContent = UI.invalid[lang];
      note.classList.add('err');
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    label.textContent = UI.sending[lang];
    note.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('formspree');

      form.reset();
      note.textContent = UI.ok[lang];
      note.classList.add('ok');
    } catch {
      note.textContent = UI.err[lang];
      note.classList.add('err');
    } finally {
      btn.disabled = false;
      label.textContent = original[lang];
      label.dataset.es = original.es;
      label.dataset.en = original.en;
    }
  });
}

/* ─────────────────────────────────────────────
   BOOT
   ───────────────────────────────────────────── */
function boot(){
  buildStack();
  applyLang(lang);
  observeAll();
  initNav();
  initCursor();
  initModal();
  initForm();
}

runLoader();

})();
