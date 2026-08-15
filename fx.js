/* ============================================================================
   Efectos que se activan a pedido.
   Nada de esto corre ni se descarga hasta que el visitante lo pide o hasta que
   la sección aparece en pantalla: el sitio tiene que seguir cargando liviano.
   ========================================================================== */

/* ══════════════════════════ MODO CAOS ══════════════════════════════════════
   Las tarjetas del stack se sueltan y caen con física real, y se pueden
   agarrar y tirar con el mouse. Es un modo, no el estado por defecto: en la
   grilla las tarjetas informan nivel y porcentaje, y eso no se toca.
   Matter.js se descarga recién al primer clic.                              */
(() => {
  // Vendorizado a propósito: son 83 KB que se bajan recién al primer clic, y
  // así el efecto no depende de que un CDN de terceros esté vivo.
  const MATTER = 'vendor/matter.min.js';
  let cargando = null, activo = false, mundo = null;

  const cargarMatter = () => {
    if (window.Matter) return Promise.resolve();
    if (cargando) return cargando;
    cargando = new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = MATTER; s.async = true;
      s.onload = ok; s.onerror = mal;
      document.head.appendChild(s);
    });
    return cargando;
  };

  function armarBoton() {
    const head = document.querySelector('#stack .sec__head');
    if (!head) return null;
    const b = document.createElement('button');
    b.className = 'caos-btn';
    b.type = 'button';
    b.innerHTML = `<span class="caos-ico" aria-hidden="true"></span>
      <span data-en="Chaos mode" data-es="Modo caos">Modo caos</span>`;
    head.appendChild(b);
    return b;
  }

  function activar(zona, tarjetas, medidas, r) {
    const { Engine, Bodies, Composite, Mouse, MouseConstraint } = window.Matter;
    const W = r.width, H = r.height;

    const engine = Engine.create();
    engine.gravity.y = 1.1;

    // Cada tarjeta arranca exactamente donde estaba en la grilla: así la
    // transición no se siente como un corte.
    const cuerpos = tarjetas.map((el, i) => {
      const b = medidas[i];
      const x = b.left - r.left + b.width / 2;
      const y = b.top - r.top + b.height / 2;
      el.style.width = b.width + 'px';
      el.style.height = b.height + 'px';
      const body = Bodies.rectangle(x, y, b.width, b.height, {
        restitution: .42, friction: .35, frictionAir: .012,
        chamfer: { radius: 4 }
      });
      body.__el = el;
      return body;
    });

    const grosor = 200;
    const muros = [
      Bodies.rectangle(W / 2, H + grosor / 2 - 2, W * 3, grosor, { isStatic: true }),
      Bodies.rectangle(-grosor / 2, H / 2, grosor, H * 3, { isStatic: true }),
      Bodies.rectangle(W + grosor / 2, H / 2, grosor, H * 3, { isStatic: true }),
      Bodies.rectangle(W / 2, -grosor / 2 - 400, W * 3, grosor, { isStatic: true })
    ];

    const raton = Mouse.create(zona);
    const arrastre = MouseConstraint.create(engine, {
      mouse: raton,
      constraint: { stiffness: .18, render: { visible: false } }
    });
    // Sin esto el scroll de la página se traba sobre la zona de juego.
    raton.element.removeEventListener('wheel', raton.mousewheel);

    Composite.add(engine.world, [...cuerpos, ...muros, arrastre]);

    // Medio ancho y medio alto: el transform posiciona desde la esquina, y
    // Matter razona desde el centro.
    cuerpos.forEach(b => {
      b.__w2 = b.bounds.max.x - b.position.x;
      b.__h2 = b.bounds.max.y - b.position.y;
    });

    // El motor lo avanzamos desde este mismo loop en vez de usar Runner: un
    // solo rAF para simular y pintar, con paso fijo y tope por si la pestaña
    // estuvo en segundo plano y devuelve un delta enorme.
    let raf, previo = performance.now();
    (function pintar(ahora = performance.now()) {
      const dt = Math.min(ahora - previo, 34);
      previo = ahora;
      Engine.update(engine, dt || 16.666);

      for (const b of cuerpos) {
        const el = b.__el;
        el.style.transform =
          `translate(${b.position.x - b.__w2}px, ${b.position.y - b.__h2}px) rotate(${b.angle}rad)`;
      }
      raf = requestAnimationFrame(pintar);
    })();

    return {
      parar() {
        cancelAnimationFrame(raf);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }

  function iniciar() {
    const btn = armarBoton();
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const zona = document.getElementById('stackGrid');
      const tarjetas = [...zona.querySelectorAll('.sk')];
      if (!tarjetas.length) return;

      if (activo) {
        mundo?.parar(); mundo = null; activo = false;
        zona.classList.remove('caos');
        tarjetas.forEach(el => { el.style.cssText = ''; });
        btn.classList.remove('on');
        return;
      }

      btn.disabled = true;
      btn.classList.add('cargando');
      try { await cargarMatter(); }
      catch { btn.disabled = false; btn.classList.remove('cargando'); return; }
      btn.disabled = false;
      btn.classList.remove('cargando');

      // Las posiciones se toman ANTES de agregar .caos: esa clase pasa las
      // tarjetas a position:absolute y las colapsa todas al origen, así que
      // medirlas después las dejaría a todas superpuestas en la esquina.
      const medidas = tarjetas.map(el => {
        const b = el.getBoundingClientRect();
        return { left: b.left, top: b.top, width: b.width, height: b.height };
      });
      const caja = zona.getBoundingClientRect();
      zona.style.height = caja.height + 'px';
      zona.classList.add('caos');
      mundo = activar(zona, tarjetas, medidas, caja);
      activo = true;
      btn.classList.add('on');
    });
  }

  /* Las tarjetas del stack las genera buildStack(), que corre recién cuando
     termina el loader. Si el botón se creara antes, un clic temprano no
     encontraría nada que soltar. Se espera a que aparezcan. */
  function cuandoHayaTarjetas(fn) {
    const zona = document.getElementById('stackGrid');
    if (!zona) return;
    if (zona.querySelector('.sk')) return fn();
    const obs = new MutationObserver(() => {
      if (zona.querySelector('.sk')) { obs.disconnect(); fn(); }
    });
    obs.observe(zona, { childList: true });
  }

  const arrancar = () => cuandoHayaTarjetas(iniciar);
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

/* ══════════════════════ DISTORSIÓN LÍQUIDA ═════════════════════════════════
   Las capturas de los proyectos se ondulan al pasar el mouse. Está escrito en
   WebGL a mano y no con three.js: la librería son ~600 KB para dibujar un
   rectángulo con un shader, y este sitio se vende como rápido.
   Si no hay WebGL o el dispositivo es táctil, la <img> se queda como está.  */
(() => {
  const finoPuntero = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!finoPuntero || sinMovimiento) return;

  const VERT = `
    attribute vec2 p;
    varying vec2 uv;
    void main(){ uv = p * .5 + .5; uv.y = 1. - uv.y; gl_Position = vec4(p, 0., 1.); }`;

  /* La onda nace en el puntero y se atenúa con la distancia, así el efecto
     sigue la mano en vez de agitar la imagen entera. */
  const FRAG = `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;
    uniform vec2  raton;
    uniform float t;
    uniform float fuerza;
    uniform float rel;

    void main(){
      vec2 d = uv - raton;
      d.x *= rel;
      float dist = length(d);
      float caida = smoothstep(.55, 0., dist);

      float onda = sin(dist * 26. - t * 3.4) * .014
                 + sin(dist * 12. - t * 2.1) * .010;

      vec2 dir = dist > .0001 ? normalize(uv - raton) : vec2(0.);
      vec2 off = dir * onda * caida * fuerza;

      // Aberración cromática mínima: le da el brillo de vidrio mojado.
      float a = .0016 * caida * fuerza;
      float r = texture2D(tex, uv + off + vec2(a, 0.)).r;
      float g = texture2D(tex, uv + off).g;
      float b = texture2D(tex, uv + off - vec2(a, 0.)).b;
      gl_FragColor = vec4(r, g, b, 1.);
    }`;

  function compilar(gl, tipo, src) {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('shader:', gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }

  function montar(media) {
    const img = media.querySelector('img');
    if (!img) return;

    const cv = document.createElement('canvas');
    cv.className = 'fx-liquid';
    const gl = cv.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRaton  = gl.getUniformLocation(prog, 'raton');
    const uT      = gl.getUniformLocation(prog, 't');
    const uFuerza = gl.getUniformLocation(prog, 'fuerza');
    const uRel    = gl.getUniformLocation(prog, 'rel');

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    let listo = false;
    const subir = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      listo = true;
    };
    if (img.complete && img.naturalWidth) subir();
    else img.addEventListener('load', subir, { once: true });

    function medir() {
      const r = media.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform1f(uRel, r.width / Math.max(1, r.height));
    }
    medir();
    new ResizeObserver(medir).observe(media);

    media.appendChild(cv);

    let mx = .5, my = .5, fuerza = 0, objetivo = 0, raf = null, t0 = performance.now();

    function frame() {
      // La fuerza sube y baja suave: si no, el efecto entra y sale de golpe.
      fuerza += (objetivo - fuerza) * .09;
      if (listo) {
        gl.uniform2f(uRaton, mx, my);
        gl.uniform1f(uT, (performance.now() - t0) / 1000);
        gl.uniform1f(uFuerza, fuerza);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (fuerza < .004 && objetivo === 0) { raf = null; media.classList.remove('fx-on'); return; }
      raf = requestAnimationFrame(frame);
    }
    const arrancar = () => { if (!raf) { media.classList.add('fx-on'); raf = requestAnimationFrame(frame); } };

    media.addEventListener('pointerenter', () => { objetivo = 1; arrancar(); });
    media.addEventListener('pointerleave', () => { objetivo = 0; arrancar(); });
    media.addEventListener('pointermove', e => {
      const r = media.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    });
  }

  const iniciar = () => document.querySelectorAll('#projects .proj__media').forEach(montar);
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
