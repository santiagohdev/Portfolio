/* ══════════════════════════════════════════════════════════════
   SANTIAGO HERMOSILLA — PORTFOLIO
   Vanilla JS. Sin dependencias, sin build.
   ══════════════════════════════════════════════════════════════ */
(() => {
'use strict';

// Habilita el ocultamiento del .reveal en CSS. Va primero: si algo de abajo
// falla, el contenido ya quedo visible en vez de desaparecer.
document.documentElement.classList.add('js');

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
/* Logos del stack, en SVG inline.
   Antes esto era una hoja de estilos de 130 KB traida de un CDN de terceros
   y apuntada a @latest — bloqueaba el render y podia romperse sola si el
   paquete cambiaba de la noche a la mañana. Estos diez pesan ~4 KB juntos,
   viajan con el HTML y no dependen de nadie. */
const ICONOS = {
  html5:  '<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="#E44D26" d="M19.4 117.2 8.8 0h110.5l-10.6 117.1-44.8 12.4z"/><path fill="#F16529" d="M64 120V10h45.2l-9 101z"/><path fill="#EBEBEB" d="M64 52.4H45.9l-1.2-14H64V24.7H29.6l.3 3.7 3.4 38.1H64zm0 35.3-.1.1-15.2-4.1-1-10.9H34l1.9 21.4 28 7.8.2-.1z"/><path fill="#fff" d="M63.9 52.4v13.9h16.8l-1.6 17.7-15.2 4.1v14.5l28-7.8.2-2.3 3.2-36 .3-3.7.7-8H63.9zm0-27.7v13.7h33.1l.3-3 .6-3.7.3-3z"/></svg>',
  css3:   '<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="#1572B6" d="M18.8 117.1 8.2 0h111.6l-10.6 117.1-45.3 12.6z"/><path fill="#33A9DC" d="M64 119.9V10.2h45.6l-9.1 100.8z"/><path fill="#fff" d="M64 52.2h22.8l1.6-17.6H64V21.3h37.7l-.4 4-3.7 41.2H64z"/><path fill="#EBEBEB" d="M64.1 86.1v14.2l-.1.1-28.1-7.8-1.9-21.5h14.1l1 10.9 14.9 4z"/><path fill="#fff" d="M85.6 57.5 84 74.9l-20 5.4v14.2l28.2-7.6.2-2.3 2.4-27z"/><path fill="#EBEBEB" d="M64 21.3v13.3H27.7l-.3-3.4-.7-5.9-.4-4zm0 30.9v13.3H47.5l-.3-3.4-.7-5.9-.4-4z"/></svg>',
  react:  '<svg viewBox="0 0 128 128" aria-hidden="true"><circle cx="64" cy="64" r="11.4" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="5.5" fill="none"><ellipse cx="64" cy="64" rx="52" ry="20"/><ellipse cx="64" cy="64" rx="52" ry="20" transform="rotate(60 64 64)"/><ellipse cx="64" cy="64" rx="52" ry="20" transform="rotate(120 64 64)"/></g></svg>',
  js:     '<svg viewBox="0 0 128 128" aria-hidden="true"><rect width="128" height="128" fill="#F7DF1E"/><path d="M33.4 106.9 43.2 101c1.9 3.4 3.6 6.2 7.7 6.2 4 0 6.5-1.6 6.5-7.6V58.4h12v41.4c0 12.5-7.3 18.2-18 18.2-9.6 0-15.2-5-18-11m42.4-1.3 9.8-5.7c2.6 4.2 5.9 7.3 11.8 7.3 5 0 8.2-2.5 8.2-5.9 0-4.1-3.3-5.6-8.8-8l-3-1.3c-8.7-3.7-14.5-8.4-14.5-18.2 0-9.1 6.9-16 17.7-16 7.7 0 13.2 2.7 17.2 9.7l-9.4 6c-2.1-3.7-4.3-5.2-7.8-5.2-3.5 0-5.8 2.2-5.8 5.2 0 3.6 2.2 5.1 7.4 7.3l3 1.3c10.2 4.4 16 8.9 16 19 0 10.9-8.6 16.9-20.1 16.9-11.2 0-18.5-5.4-22-12.4"/></svg>',
  ts:     '<svg viewBox="0 0 128 128" aria-hidden="true"><rect width="128" height="128" rx="6" fill="#3178C6"/><path fill="#fff" d="M74.6 99.4v13.1c2.1 1.1 4.6 1.9 7.5 2.4 2.9.6 5.9.8 9.1.8 3.1 0 6.1-.3 8.9-.9 2.8-.6 5.3-1.6 7.4-3 2.1-1.4 3.8-3.2 5-5.4 1.2-2.2 1.9-5 1.9-8.3 0-2.4-.4-4.5-1.1-6.3-.7-1.8-1.8-3.4-3.1-4.8-1.4-1.4-3-2.7-4.9-3.8-1.9-1.1-4.1-2.2-6.5-3.2-1.8-.7-3.3-1.4-4.7-2.1-1.4-.7-2.6-1.4-3.6-2.1-1-.7-1.7-1.5-2.3-2.3-.5-.8-.8-1.7-.8-2.8 0-.9.2-1.8.7-2.5.5-.8 1.1-1.4 2-2 .9-.6 1.9-1 3.2-1.3 1.3-.3 2.7-.5 4.2-.5 1.1 0 2.3.1 3.6.3 1.3.2 2.5.4 3.8.8 1.3.3 2.5.8 3.7 1.3 1.2.5 2.3 1.1 3.3 1.8V55.3c-2-.8-4.2-1.3-6.5-1.7-2.4-.4-5.1-.6-8.2-.6-3.1 0-6.1.3-8.9 1-2.8.7-5.3 1.7-7.4 3.2-2.1 1.4-3.8 3.3-5 5.5-1.2 2.2-1.9 4.9-1.9 8 0 4 1.1 7.3 3.4 10.1 2.3 2.8 5.7 5.1 10.4 7.1 1.9.8 3.6 1.5 5.2 2.3 1.6.7 3 1.5 4.2 2.3 1.2.8 2.1 1.7 2.8 2.6.7.9 1 2 1 3.2 0 .9-.2 1.7-.6 2.5-.4.8-1.1 1.4-1.9 2-.9.6-1.9 1-3.2 1.3-1.3.3-2.8.5-4.6.5-3 0-5.9-.5-8.8-1.6-2.9-1-5.6-2.6-8.1-4.7M56.2 65.6h16.9V54.4H25.7v11.2h16.8v48.5h13.7z"/></svg>',
  node:   '<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="#83CD29" d="M64 128a11 11 0 0 1-5.5-1.5l-17.5-10.4c-2.6-1.5-1.3-2-.5-2.3 3.5-1.2 4.2-1.5 7.9-3.6.4-.2.9-.1 1.3.1l13.4 8c.5.3 1.2.3 1.6 0l52.4-30.3c.5-.3.8-.8.8-1.4V26.1c0-.6-.3-1.1-.8-1.4L64.8 -5.5c-.5-.3-1.1-.3-1.6 0L10.9 24.8c-.5.3-.8.8-.8 1.4v60.5c0 .6.3 1.1.8 1.4l14.3 8.3c7.8 3.9 12.6-.7 12.6-5.3V31.4c0-.8.7-1.5 1.5-1.5h6.6c.8 0 1.5.7 1.5 1.5v59.7c0 10.4-5.7 16.3-15.5 16.3-3 0-5.4 0-12.1-3.3L5.9 96.2A11 11 0 0 1 .4 86.7V26.1c0-3.9 2.1-7.6 5.5-9.5L58.5 -13.7a11.5 11.5 0 0 1 11 0l52.5 30.3c3.4 2 5.5 5.6 5.5 9.5v60.6c0 3.9-2.1 7.5-5.5 9.5l-52.5 30.3A11 11 0 0 1 64 128" transform="translate(0 8) scale(1 .87)"/><path fill="#83CD29" d="M104 76.3c0-11.3-7.6-14.3-23.7-16.4-16.3-2.2-17.9-3.3-17.9-7.1 0-3.2 1.4-7.4 13.4-7.4 10.7 0 14.7 2.3 16.3 9.5.1.7.8 1.2 1.5 1.2h6.8c.4 0 .8-.2 1.1-.5.3-.3.4-.7.4-1.1-1.1-12.5-9.4-18.3-26.1-18.3-14.9 0-23.7 6.3-23.7 16.8 0 11.4 8.8 14.6 23.1 16 17 1.7 18.4 4.2 18.4 7.5 0 5.9-4.7 8.4-15.8 8.4-13.9 0-17-3.5-18-10.4-.1-.7-.7-1.3-1.5-1.3h-6.8c-.8 0-1.5.7-1.5 1.5 0 8.8 4.8 19.4 27.8 19.4 16.5 0 26.2-6.6 26.2-17.8"/></svg>',
  express:'<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="currentColor" d="M126.7 88.2c-8.9 2.3-14.4-2.1-19.8-9.6l-12.7-17.6-1.8-2.5-14.8 20.1c-5.1 7-10.5 10-19.1 7.7l24.6-33-22.9-29.8c8.4-1.6 14.2-.8 19.4 6.7l14.7 20.2 14.8-20.1c5.1-7 10.6-9.6 18.9-7.5-3.3 4.3-6.4 8.5-9.6 12.7-4.3 5.5-8.4 11.1-12.8 16.5-1.6 1.9-1.4 3.2.1 5.1zM1.3 60.2c.6-3 1-6.1 1.9-9C9.5 28.7 35.3 19.3 53 33.2c10.4 8.2 13 19.7 12.5 32.6H8.4c-.9 22.8 15.6 36.6 36.5 29.6 7.4-2.5 11.7-8.2 13.9-15.4.9-3.4 2.7-4 6.1-3-1.7 8.8-5.6 16.2-13.7 20.8-12.1 6.8-29.4 4.6-38.5-4.8C7.4 87.6 4.7 80.4 3.5 72.5c-.2-1.3-.6-2.6-.9-3.9q-.15-4.2-.3-8.4m7.2 0h50.8c-.3-16.2-10.4-27.7-24.2-27.8-15.2-.2-26 11-26.6 27.8"/></svg>',
  mongo:  '<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="#4FAA41" d="M82.6 58.5c-3.6-15.8-11.5-25.9-14.8-30.4-3.4-4.7-6.2-9.2-6.7-10-.5-.8-1.2-2.4-1.5-3.1-.3.6-1 2.3-1.5 3.1-.5.8-3.3 5.3-6.7 10-3.3 4.5-11.2 14.6-14.8 30.4-3.7 16.1-.7 30 4.6 39.2 5.3 9.2 12.9 14.6 15.4 16.3.3.2.6.6.7 1l1.4 9.9c.1.6.7 1 1.3 1h.2c.6 0 1.1-.4 1.3-1l1.4-9.9c.1-.4.4-.8.7-1 2.5-1.7 10.1-7.1 15.4-16.3 5.3-9.2 8.3-23.1 4.6-39.2z"/><path fill="#3F9037" d="M60.1 116.4V15.1c-.4.7-.9 1.6-1.2 2.2-.5.8-3.3 5.3-6.7 10-3.3 4.5-11.2 14.6-14.8 30.4-3.7 16.1-.7 30 4.6 39.2 5.3 9.2 12.9 14.6 15.4 16.3.3.2.6.6.7 1z"/></svg>',
  mysql:  '<svg viewBox="0 0 24 24" fill="none" stroke="#00618A" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/><path d="M4.5 11.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6"/></svg>',
  git:    '<svg viewBox="0 0 128 128" aria-hidden="true"><path fill="#F34F29" d="M124.7 58.4 69.6 3.3a11.2 11.2 0 0 0-15.9 0L42.3 14.8l14.5 14.5a13.3 13.3 0 0 1 16.9 17l14 14a13.3 13.3 0 1 1-8 7.5L66.6 54.7v34.4a13.3 13.3 0 1 1-11-.4V54a13.3 13.3 0 0 1-7.2-17.5L34.1 22.3 3.3 53.1a11.2 11.2 0 0 0 0 15.9l55.1 55.1a11.2 11.2 0 0 0 15.9 0l50.4-50.4a11.2 11.2 0 0 0 0-15.9"/></svg>',
};

const SKILLS = [
  { name:'HTML5',      pct:96, icon:'html5',   lvl:'expert' },
  { name:'CSS3',       pct:93, icon:'css3',    lvl:'expert' },
  { name:'React',      pct:92, icon:'react',   lvl:'adv'    },
  { name:'JavaScript', pct:90, icon:'js',      lvl:'adv'    },
  { name:'TypeScript', pct:85, icon:'ts',      lvl:'adv'    },
  { name:'Node.js',    pct:82, icon:'node',    lvl:'solid'  },
  { name:'Express',    pct:80, icon:'express', lvl:'solid'  },
  { name:'MongoDB',    pct:78, icon:'mongo',   lvl:'solid'  },
  { name:'MySQL',      pct:78, icon:'mysql',   lvl:'solid'  },
  { name:'Git',        pct:76, icon:'git',     lvl:'solid'  },
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
// Oscuro por defecto, sin mirar la preferencia del sistema. Si el visitante
// tocó el toggle alguna vez, gana su elección guardada.
const savedTheme = localStorage.getItem('sh-theme') || 'dark';
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

/* Duración de la intro, en milisegundos. Es lo único que hay que tocar
   para que dure más o menos. */
const LOADER_MS = 1600;

function runLoader(){
  const loader = $('#loader'), bar = $('#loaderBar'), pct = $('#loaderPct'), wipe = $('#wipe');
  document.body.classList.add('locked');

  if (REDUCED){
    loader.remove(); document.body.classList.remove('locked'); boot();
    return;
  }

  buildLoader();

  /* El progreso sale del RELOJ, no de contar ticks.
   *
   * Antes se sumaba un poco en cada tick de setInterval. El problema es que
   * el navegador frena esos ticks a uno por segundo cuando la pestaña no
   * está a la vista, para ahorrar batería: la intro pasaba de 2 segundos a
   * casi 30. Y eso es justo lo que pasa cuando alguien abre varios enlaces
   * de golpe y los mira después.
   *
   * Midiendo el tiempo transcurrido, la intro dura LOADER_MS siempre. Si la
   * pestaña estuvo oculta más que eso, al volver ya terminó. */
  const inicio = performance.now();
  let cerrado = false;

  const pintar = () => {
    const n = Math.min(100, ((performance.now() - inicio) / LOADER_MS) * 100);
    bar.style.width = n + '%';
    pct.textContent = String(Math.floor(n)).padStart(2, '0');
    if (n >= 100) cerrar();
  };

  const cerrar = () => {
    if (cerrado) return;
    cerrado = true;
    clearInterval(tick);
    clearTimeout(corte);
    document.removeEventListener('visibilitychange', alVolver);

    // Si la pestaña está oculta no tiene sentido animar el barrido: nadie lo
    // ve y encima las animaciones CSS también se frenan. Se entra directo.
    if (document.hidden){
      loader.remove(); wipe?.remove();
      document.body.classList.remove('locked');
      boot();
      return;
    }

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
  };

  // Al volver a la pestaña se recalcula al instante: si ya pasó el tiempo,
  // el sitio aparece sin un solo fotograma de espera.
  const alVolver = () => { if (!document.hidden) pintar(); };
  document.addEventListener('visibilitychange', alVolver);

  const tick = setInterval(pintar, 16);
  // El intervalo sólo mueve la barra, y de fondo se frena a un tick por
  // segundo. Este cierre directo es el que garantiza la duración exacta:
  // un setTimeout largo sí respeta su plazo aunque la pestaña esté oculta.
  const corte = setTimeout(cerrar, LOADER_MS);
  pintar();
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
/* El stack vive escrito en el HTML, no se genera acá: los filtros de
   currículums no ejecutan JavaScript y si no, esa sección les llega vacía.
   Esto queda de respaldo por si el marcado faltara. */
function buildStack(){
  const grid = $('#stackGrid');
  if (!grid || grid.querySelector('.sk')) return;
  grid.innerHTML = SKILLS.map((s, i) => `
    <div class="sk reveal" data-cursor="card" style="transition-delay:${i * 45}ms">
      <div class="sk__top">
        <span class="sk__logo">${ICONOS[s.icon]}</span>
        <span>
          <span class="sk__name">${s.name}</span><br>
          <span class="sk__level" data-lvl="${s.lvl}">${LEVELS[s.lvl][lang]}</span>
        </span>
        <span class="sk__pct">${s.pct}%</span>
      </div>
      <div class="sk__track"><div class="sk__bar" data-pct="${s.pct}"></div></div>
    </div>
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

// Si el repo trae etiqueta propia ("Frontend" / "Backend"), se muestra al lado.
function enlaceRepo(url, etiqueta){
  const txt = etiqueta ? `${UI.repo[lang]} · ${etiqueta}` : UI.repo[lang];
  return `<a class="btn btn--ghost" href="${url}" target="_blank" rel="noopener" data-cursor="link">${txt}</a>`;
}

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

  // Aviso opcional: sirve para las demos alojadas en planes gratuitos, que
  // duermen y tardan en despertar. Mejor avisarlo que dejar creer que rompio.
  const nota = lang === 'es' ? d.noteEs : d.noteEn;
  $('#modalNote').textContent = nota || '';
  $('#modalNote').hidden = !nota;

  // Un proyecto puede tener el codigo repartido en dos repos (front y back).
  const cta = [];
  if (d.demo) cta.push(`<a class="btn btn--solid" href="${d.demo}" target="_blank" rel="noopener" data-cursor="link">${UI.demo[lang]}</a>`);
  if (d.repo) cta.push(enlaceRepo(d.repo, d.repoLabel));
  if (d.repo2) cta.push(enlaceRepo(d.repo2, d.repo2Label));
  $('#modalCta').innerHTML = cta.join('');
}

// Quien tenia el foco antes de abrir, para devolverselo al cerrar.
let focoPrevio = null;

function openModal(card){
  focoPrevio = document.activeElement;
  activeCard = card;
  renderModal(card);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.removeAttribute('inert');
  document.body.classList.add('locked');
  // El modal esta en visibility:hidden hasta que toma la clase .open, y no
  // se puede enfocar algo invisible. Leer una medida fuerza al navegador a
  // recalcular estilos ahora, y recien ahi el foco entra.
  void modal.offsetHeight;
  $('#modalClose').focus();
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  // inert saca de la navegacion todo lo de adentro. Sin esto el modal queda
  // cerrado pero su boton de cerrar se sigue pudiendo tabular.
  modal.setAttribute('inert', '');
  document.body.classList.remove('locked');
  focoPrevio?.focus?.();
  focoPrevio = null;
  activeCard = null;
}

/* Mientras el modal esta abierto el Tab no debe escaparse a la pagina de
   atras: al llegar al ultimo enfocable vuelve al primero, y al reves. */
function atraparFoco(e){
  if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
  const focos = $$('a[href], button:not([disabled])', modal).filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero){ e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo){ e.preventDefault(); primero.focus(); }
}

function initModal(){
  /* La tarjeta NO lleva role="button".
     Antes si lo llevaba, y adentro vive el boton "Probar aca" — un boton
     dentro de otro boton, que para un lector de pantalla es ambiguo. Ahora
     el elemento accesible es el boton del velo ("Ver proyecto"), que ya
     estaba ahi como texto; el clic en cualquier parte de la tarjeta sigue
     funcionando para el mouse, como comodidad y no como unica via. */
  $$('#projects .proj').forEach(card => {
    card.addEventListener('click', (e) => {
      // Los enlaces directos van a su destino; no abren el modal.
      if (e.target.closest('.proj__live, .proj__close, .proj__frame, .proj__link')) return;
      openModal(card);
    });

    const abridor = $('.proj__veil .btn', card);
    if (abridor){
      abridor.addEventListener('click', (e) => { e.stopPropagation(); openModal(card); });
    }
  });

  modal.setAttribute('inert', '');
  addEventListener('keydown', atraparFoco);
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

/* Cierra el desplegable de descarga de CV al clickear afuera o con Escape. */
document.addEventListener('click', (e) => {
  document.querySelectorAll('.cvdl[open]').forEach((d) => {
    if (!d.contains(e.target)) d.removeAttribute('open');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.cvdl[open]').forEach((d) => d.removeAttribute('open'));
});

/* ══════════════════ DEMO EN VIVO DENTRO DE LA TARJETA ═════════════════════
   El iframe se crea recién al hacer clic: cargar tres apps de entrada haría
   pesar la home por algo que quizás nadie abre. */
(() => {
  const ICONO_CERRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function cerrar(card) {
    card.classList.remove('proj--live');
    card.querySelectorAll('.proj__frame,.proj__close,.proj__loading').forEach(n => n.remove());
  }

  // En FASE DE CAPTURA a propósito: el listener que abre el modal está sobre
  // la propia tarjeta (openModal, más arriba), así que si escuchamos en
  // burbujeo el modal ya se abrió y frenarlo llega tarde.
  document.addEventListener('click', e => {
    const cerrarBtn = e.target.closest('.proj__close');
    if (cerrarBtn) {
      e.preventDefault(); e.stopPropagation();
      cerrar(cerrarBtn.closest('.proj'));
      return;
    }

    const btn = e.target.closest('.proj__live');
    if (!btn) return;
    // Sin esto, el clic sigue subiendo y abre el modal del proyecto.
    e.preventDefault(); e.stopPropagation();

    const card = btn.closest('.proj');
    const url = card?.dataset.demo;
    if (!card || !url || card.classList.contains('proj--live')) return;

    const media = card.querySelector('.proj__media');

    const cargando = document.createElement('div');
    cargando.className = 'proj__loading';
    /* Slate corre en un plan gratuito que duerme la aplicación: el primer
       acceso tarda cerca de medio minuto. Sin avisar, el visitante ve un
       recuadro vacío y asume que está roto. */
    const enIngles = document.documentElement.lang === 'en';
    cargando.textContent = card.dataset.embedEspera === '1'
      ? (enIngles ? 'Waking the server… the first load takes ~30s'
                  : 'Despertando el servidor… la primera carga tarda ~30s')
      : (enIngles ? 'Loading demo…' : 'Cargando demo…');

    const frame = document.createElement('iframe');
    frame.className = 'proj__frame';
    frame.src = url;
    frame.loading = 'lazy';
    frame.title = card.dataset.title || 'Demo';
    frame.setAttribute('allow', 'geolocation');
    frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    frame.addEventListener('load', () => {
      frame.classList.add('on');
      cargando.classList.add('off');
      setTimeout(() => cargando.remove(), 400);
    });

    const cerrarEl = document.createElement('button');
    cerrarEl.className = 'proj__close';
    cerrarEl.type = 'button';
    cerrarEl.setAttribute('aria-label', 'Cerrar demo');
    cerrarEl.innerHTML = ICONO_CERRAR;

    media.append(frame, cargando, cerrarEl);
    card.classList.add('proj--live');
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.proj--live').forEach(cerrar);
  });
})();

/* ══════════════════ PARA EL QUE ABRE LA CONSOLA ═══════════════════════════
   Casi siempre es otro dev evaluando el sitio. Bien vale saludarlo. */
(() => {
  const rosa  = 'color:#F7A8C4;font-weight:700';
  const tenue = 'color:#9BA3B8';
  console.log(
`%c
   ██╗  ██╗
   ██║  ██║   Santiago Hermosilla
   ███████║   Full Stack Developer
   ██╔══██║   Buenos Aires, AR
   ██║  ██║
   ╚═╝  ╚═╝
`, rosa);
  console.log('%cAsí que abriste la consola. 👀', 'color:#E8EBF2;font-size:13px');
  console.log('%cEste sitio es HTML, CSS y JavaScript a mano. Sin framework, sin build.', tenue);
  console.log('%cSi estás buscando a alguien: %csantiagohermosilla76@gmail.com', tenue, rosa);
  console.log('%chttps://santiagohermosilla.com', tenue);
})();
