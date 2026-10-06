// Cambia aquí los textos y la firma para personalizar el regalo.
const letters = [
  {
    "title": "Holaaaaaaaa,",
    "paragraphs": [
      "Gracias al tonto on call esta vez nos toca celebrar a la distancia, te hice un pequeño lugar donde dejarte mis palabras.",
      "Este libro no tiene muchas páginas, pero sí un montón de cariño. Y todas son para ti."
    ]
  },
  {
    "title": "Qué suerte coincidir contigo,",
    "paragraphs": [
      "desde que te obligue a sentarte conmigo y ser amiga sabía que son de esos momentos de los que no te arrepientes.",
      "Hay personas que hacen los días más ligeros, las risas más largas y los recuerdos más bonitos. Tú eres una de ellas."
    ]
  },
  {
    "title": "",
    "paragraphs": [
      "Gracias por las conversaciones que se alargan sin darnos cuenta, por escucharme, por odiar a los hombres conmigo y por ser tú, con todo lo que te hace tan especial, aunque a veces nos desaparecemos pero es lo normal en la amistad.",
      "Aunque no nos veamos tanto como quisiera, me encanta saber que nuestra amistad sigue aquí, cerquita."
    ]
  },
  {
    "title": "",
    "paragraphs": [
      "Que este año te traiga momentos que quieras guardar para siempre. Que encuentres motivos para reír incluso en los días raros, y que nunca te falten personas que te quieran bonito (somos muchas).",
      "Ojalá te atrevas a eso que tienes pendiente, te sorprendas con lugares nuevos y te acuerdes de celebrar también las pequeñas cosas y recuerdes que tienes muchas personas dispuestas a ayudarte con todo.",
      "Te mereces un año lleno de calma, aventuras y mucho amor."
    ]
  },
  {
    "title": "Feliz cumpleaños, Raquel",
    "paragraphs": [
      "Tenemos una celebración pendiente, un regalito que darte y muchas cosas que contarnos y más recuerdos por hacer",
      "Disfruta muchísimo tu día. Qué bonito que existas."
    ],
    "signature": "Ivette♡",
    "postscript": "¿Así esta bien o quieres una versiónn más amigable? AHHH VERDAD. No no la hice con ChatGPT la escribi yo solita."
  }
];
// Fotos del álbum, antes de la última página de la carta.
const memories = [
  { image: 'photos/cumpleanos.jpg', alt: 'Raquel cortando un pastel de cumpleaños', caption: 'Por más cumpleaños para celebrar ♡' },
  { image: 'photos/juntas.jpg', alt: 'Las dos juntas en una foto frente al espejo', caption: 'Qué suerte coincidir contigo.' },
  { image: 'photos/selfie.jpg', alt: 'Una selfie de las dos juntas', caption: 'Y todos los recuerdos que nos faltan.' }
];
const bookPages = [...letters.slice(0, -1), ...memories, letters[letters.length - 1]];
const page = document.querySelector('#page');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const soundButton = document.querySelector('#sound');
let current = 0;
let busy = false;
let soundEnabled = true;
let audioContext;
const flower = `<svg class="flower" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M60 97V58M60 80C40 80 35 69 35 69c16-2 25 5 25 11ZM60 88c19-1 26-14 26-14-16-1-26 6-26 14Z"/><g transform="translate(60 40)"><ellipse ry="18" rx="7" cy="-15"/><ellipse ry="18" rx="7" cy="-15" transform="rotate(60)"/><ellipse ry="18" rx="7" cy="-15" transform="rotate(120)"/><ellipse ry="18" rx="7" cy="-15" transform="rotate(180)"/><ellipse ry="18" rx="7" cy="-15" transform="rotate(240)"/><ellipse ry="18" rx="7" cy="-15" transform="rotate(300)"/><circle r="7" fill="#ced37f"/></g><path d="M45 103h30"/></svg>`;
function render() {
  page.classList.toggle('cover', current === 0);
  page.classList.toggle('photo-page', Boolean(bookPages[current - 1]?.image));
  if (current === 0) {
    page.innerHTML = `<span class="cover-kicker">UN PEQUEÑO LIBRO PARA</span>${flower}<h2>Raquel</h2><p class="dedication">en su cumpleaños</p><button class="open" type="button">Abrir</button><p class="cover-bottom">CON CARIÑO</p>`;
    page.querySelector('.open').addEventListener('click', () => turn(1));
  } else {
    const letter = bookPages[current - 1];
    if (letter.image) {
      page.innerHTML = `<span class="letter-kicker">RECUERDOS PARA GUARDAR</span><figure class="memory"><img src="${letter.image}" alt="${letter.alt}" width="900" height="1600"><figcaption>${letter.caption}</figcaption></figure><span class="page-number">${current}</span>`;
    } else {
    page.innerHTML = `<span class="letter-kicker">PARA RAQUEL · CON CARIÑO</span>${letter.title ? `<h2>${letter.title}</h2>` : ''}<div class="letter-text">${letter.paragraphs.map(p => `<p>${p}</p>`).join('')}</div>${letter.signature ? `<div class="signature">${letter.signature}</div>` : ''}${letter.postscript ? `<p class="postscript">${letter.postscript}</p>` : ''}<span class="page-number">${current}</span>`;
    }
  }
  previous.disabled = busy || current === 0;
  next.disabled = busy || current === bookPages.length;
  document.querySelector('#position').textContent = current === 0 ? 'LA PORTADA' : `${current} DE ${bookPages.length}`;
  document.querySelector('#hint').textContent = current === 0 ? 'Abre el libro. Hay algo bonito esperando.' : current === bookPages.length ? 'Puedes volver a leerla siempre que quieras.' : 'Una página más, un poquito más cerca.';
}
function rustle() {
  if (!soundEnabled) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume().catch(() => {});
    const duration = .32;
    const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * duration), audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 1400; filter.Q.value = .6;
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.13, now + .07);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    source.connect(filter).connect(gain).connect(audioContext.destination);
    source.start(); source.stop(now + duration);
  } catch { /* La carta sigue funcionando si el navegador no admite audio. */ }
}
function turn(direction) {
  if (busy || current + direction < 0 || current + direction > bookPages.length) return;
  busy = true;
  previous.disabled = next.disabled = true;
  rustle();
  page.classList.add('turn-out');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    const focusedInside = page.contains(document.activeElement);
    current += direction;
    page.classList.remove('turn-out');
    render();
    page.classList.add('turn-in');
    setTimeout(() => {
      page.classList.remove('turn-in');
      busy = false;
      render();
      if (focusedInside) (current === bookPages.length ? previous : next).focus({ preventScroll: true });
    }, reducedMotion ? 0 : 280);
  }, reducedMotion ? 0 : 220);
}
previous.addEventListener('click', () => turn(-1));
next.addEventListener('click', () => turn(1));
soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  soundButton.innerHTML = `${soundEnabled ? 'Sonido activado' : 'Sonido desactivado'} <span aria-hidden="true">${soundEnabled ? '♫' : '♪'}</span>`;
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    turn(event.key === 'ArrowRight' ? 1 : -1);
  }
});
render();
