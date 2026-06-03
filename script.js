/* ── PROJECT DATA ── */
const PROJECTS = [
  {
    tag: 'JavaScript · API',
    title: { en: 'Weather Dashboard', es: 'Panel del Tiempo' },
    desc: { en: 'Real-time weather application connected to OpenWeatherMap API. Features cinematic animated backgrounds that change per weather condition (rain, storm, snow, fog, clear day/night), 30-minute interpolated hourly forecasts, multi-language support in 30 languages, animated weather scenes drawn on canvas, and full responsive design.', es: 'Aplicación de clima en tiempo real conectada a la API de OpenWeatherMap. Incluye fondos cinematográficos animados que cambian según la condición climática, pronóstico horario interpolado cada 30 minutos, soporte multilenguaje en 30 idiomas, escenas animadas dibujadas en canvas y diseño completamente responsivo.' },
    techs: ['JavaScript', 'CSS3', 'HTML5', 'OpenWeather API', 'Canvas API'],
    img: './images/weather.png',
    live: 'https://weather-app-santiago.vercel.app/',
    code: 'https://github.com/santiagohdev',
  },
  {
    tag: 'React · LocalStorage',
    title: { en: 'Task Tracker', es: 'Gestor de Tareas' },
    desc: { en: 'Full-featured task management app built with React. Implements complete CRUD operations, drag-and-drop reordering using the HTML Drag & Drop API, task priority system (high/medium/low), inline editing with keyboard shortcuts, filter tabs (All/Active/Done), progress bar, light and dark mode toggle, and full localStorage persistence so tasks survive page reloads.', es: 'App de gestión de tareas completa en React. Implementa CRUD completo, reordenamiento drag & drop con la HTML Drag & Drop API, sistema de prioridades, edición inline con atajos de teclado, filtros, barra de progreso, modo claro/oscuro y persistencia total con localStorage.' },
    techs: ['React', 'CSS3', 'LocalStorage', 'Drag & Drop API'],
    img: './images/task.png',
    live: 'https://task-tracker-santiago.vercel.app/',
    code: 'https://github.com/santiagohdev',
  }
];

/* ── CURSOR ── */
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => { cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px'; });
document.querySelectorAll('a,button,.proj-card,.tech-card,.cert-card,.c-link,.social-pill,.proj-overlay-btn,.cert-pdf-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

/* ── INTRO ── */
function buildWord(word,container,delay){
  [...word].forEach((ch,i)=>{
    const s=document.createElement('span');s.className='iletter';s.textContent=ch;
    container.appendChild(s);setTimeout(()=>s.classList.add('in'),delay+i*58);
  });
}
buildWord('Santiago',document.getElementById('il1'),220);
buildWord('Hermosilla',document.getElementById('il2'),530);
setTimeout(()=>document.getElementById('isub').classList.add('in'),1000);
setTimeout(()=>{
  document.getElementById('iwipe').classList.add('go');
  setTimeout(()=>{
    document.getElementById('intro').style.display='none';
    document.getElementById('main').classList.add('show');
    startTypewriter();
  },900);
},2050);

/* ── TYPEWRITER ── */
const rolesEN=['Frontend Developer.','React Enthusiast.','UI Builder.','JavaScript Dev.'];
const rolesES=['Desarrollador Frontend.','Entusiasta de React.','Constructor de UI.','Dev de JavaScript.'];
let lang='en',ri=0,ci=0,del=false,ttimer;
const typeEl=document.getElementById('typeEl');
function getRoles(){return lang==='en'?rolesEN:rolesES;}
function type(){
  const r=getRoles(),cur2=r[ri%r.length];
  if(!del){typeEl.textContent=cur2.slice(0,++ci);if(ci===cur2.length){del=true;ttimer=setTimeout(type,1900);return;}ttimer=setTimeout(type,68);}
  else{typeEl.textContent=cur2.slice(0,--ci);if(ci===0){del=false;ri=(ri+1)%r.length;ttimer=setTimeout(type,360);return;}ttimer=setTimeout(type,36);}
}
function startTypewriter(){ttimer=setTimeout(type,400);}

/* ── LANGUAGE ── */
function setLang(l){
  lang=l;
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));
  document.documentElement.lang=l;
  document.querySelectorAll('[data-en]').forEach(el=>{const v=el.dataset[l];if(v!==undefined)el.innerHTML=v;});
  clearTimeout(ttimer);ci=0;del=false;ri=0;typeEl.textContent='';ttimer=setTimeout(type,300);
}
document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));

/* ── NAV SCROLL ── */
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',scrollY>60));

/* ── SCROLL REVEAL ── */
const panels=document.querySelectorAll('.panel-inner');
const panelObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.remove('hidden');e.target.classList.add('visible');}
    else{const rect=e.target.getBoundingClientRect();if(rect.top<0){e.target.classList.remove('visible');e.target.classList.add('hidden');}else{e.target.classList.remove('visible','hidden');}}
  });
},{threshold:0.12,rootMargin:'0px 0px -60px 0px'});
panels.forEach(p=>panelObs.observe(p));

/* ── TECH BARS ── */
const techObs=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting){
    document.querySelectorAll('.tech-card').forEach((c,i)=>setTimeout(()=>c.classList.add('bar-go'),i*100));
    techObs.disconnect();
  }
},{threshold:0.15});
const tg=document.getElementById('techGrid');
if(tg)techObs.observe(tg);

/* ── PROJECT MODAL ── */
const overlay=document.getElementById('modalOverlay');
const modalContent=document.getElementById('modalContent');
const modalClose=document.getElementById('modalClose');

function openModal(idx){
  const p=PROJECTS[idx];
  const l=lang;
  modalContent.innerHTML=`
    ${p.img
      ? `<img class="modal-img" src="${p.img}" alt="${p.title[l]}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : ''
    }
    <div class="modal-img-placeholder" style="${p.img?'display:none':''}">
      <span style="font-family:'Playfair Display',serif;font-size:80px;font-weight:900;color:transparent;-webkit-text-stroke:1px rgba(168,85,247,.2)">${p.title.en.split(' ').map(w=>w[0]).join('')}</span>
    </div>
    <div class="modal-body">
      <span class="modal-tag">${p.tag}</span>
      <div class="modal-title">${p.title[l]}</div>
      <p class="modal-desc">${p.desc[l]}</p>
      <div class="modal-techs">${p.techs.map(t=>`<span class="modal-tech">${t}</span>`).join('')}</div>
      <div class="modal-actions">
        <a href="${p.live}" class="modal-btn-primary" target="_blank">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          ${l==='es'?'Ver en vivo':'Live demo'}
        </a>
        <a href="${p.code}" class="modal-btn-ghost" target="_blank">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          ${l==='es'?'Ver código':'View code'}
        </a>
      </div>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal(){
  overlay.classList.remove('open');
  document.body.style.overflow='';
}

document.querySelectorAll('.proj-card').forEach((card,idx)=>{
  card.addEventListener('click',()=>openModal(idx));
});
modalClose.addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ── PDF FALLBACK ── */
const pdfFallback=document.getElementById('pdfFallback');
if(pdfFallback)pdfFallback.style.display='flex';

/* ── CONTACT FORM ── */
document.getElementById('formSubmit').addEventListener('click',()=>{
  const n=document.getElementById('fname').value.trim();
  const e=document.getElementById('femail').value.trim();
  const m=document.getElementById('fmessage').value.trim();
  if(!n||!e||!m)return;
  const succ=document.getElementById('formSuccess');
  succ.textContent=lang==='es'?'✓ ¡Mensaje enviado! Te respondo pronto.':"✓ Message sent! I'll be in touch soon.";
  succ.classList.add('show');
  setTimeout(()=>succ.classList.remove('show'),4000);
  document.getElementById('fname').value='';
  document.getElementById('femail').value='';
  document.getElementById('fsubject').value='';
  document.getElementById('fmessage').value='';
});

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});