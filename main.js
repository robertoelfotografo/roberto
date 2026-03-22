/* ────────────── UTILS ────────────── */
function $fmt(n) { return '$' + n.toLocaleString('es-MX'); }
const fmt = $fmt; // unified alias

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
let wType = null;
let wVideo = null;
let mode = 'all';

/* ────────────── FAQ ACCORDION ────────────── */
function toggleFaq(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  const answer = btn.nextElementSibling;
  answer.classList.toggle('open', !expanded);
  answer.setAttribute('aria-hidden', String(expanded));
}

/* ────────────── NAVBAR HAMBURGER ────────────── */
function closeNavMenu() {
  const links = document.getElementById('navbar-links');
  const btn = document.getElementById('navbar-hamburger');
  if (links) links.classList.remove('open');
  if (btn) {
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Abrir menú');
  }
}
function toggleNavMenu() {
  const btn   = document.getElementById('navbar-hamburger');
  const links = document.getElementById('navbar-links');
  const open  = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  btn.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  links.classList.toggle('open', !open);
}
// Strategic mobile polish: close the drawer after navigation and allow Escape.
document.querySelectorAll('.navbar-link, .navbar-wa').forEach(el => {
  el.addEventListener('click', closeNavMenu);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNavMenu();
});

/* ────────────── THEME TOGGLE ────────────── */
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-mode');
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

/* ────────────── WIZARD FLOW ────────────── */
function startWizard() { show('s-step1'); hide('s-menu'); mode = 'wizard'; }
function nextStep() {
  const sel = document.querySelector('input[name="svcType"]:checked');
  if (!sel) { return alert('Por favor selecciona una opción.'); }
  wType = sel.value;
  if (wType === 'bigEvent') { hide('s-step1'); show('s-step2'); }
  else { if (wType === 'negocio') mode = 'negocio'; displayResults(); }
}
function showResults() {
  const sel = document.querySelector('input[name="wantVideo"]:checked');
  if (!sel) { return alert('Por favor selecciona una opción.'); }
  wVideo = sel.value;
  displayResults();
}
function goBack() { hide('s-step2'); show('s-step1'); }
function quickShow(m) { mode = m; if (m === 'negocio') wType = 'negocio'; displayResults(); }
function resetWizard() {
  mode = 'all'; wType = null; wVideo = null;
  document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
  document.getElementById('wizard').style.display = 'block';
  document.getElementById('results').style.display = 'none';
  document.getElementById('reset-area').style.display = 'none';
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  show('s-menu');
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

/* ────────────── DISPLAY ────────────── */
function displayResults() {
  document.getElementById('wizard').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  document.getElementById('reset-area').style.display = 'block';
  const sEvt   = document.getElementById('sec-eventos');
  const sCont  = document.getElementById('sec-contenido');
  const sSes   = document.getElementById('sec-sesiones');
  const sMat   = document.getElementById('sec-maternidad');
  const sCarta = document.getElementById('sec-carta');
  const sBiz   = document.getElementById('sec-negocios');
  [sEvt,sCont,sSes,sMat,sCarta,sBiz].forEach(s => { if(s) s.style.display = 'block'; });
  document.querySelectorAll('.filterable').forEach(c => c.style.display = 'block');
  if (mode === 'session') {
    [sEvt,sCont,sMat,sCarta,sBiz].forEach(s => { if(s) s.style.display = 'none'; });
  } else if (mode === 'maternity') {
    [sEvt,sCont,sSes,sCarta,sBiz].forEach(s => { if(s) s.style.display = 'none'; });
  } else if (mode === 'carta') {
    [sEvt,sCont,sSes,sMat,sBiz].forEach(s => { if(s) s.style.display = 'none'; });
  } else if (mode === 'negocio') {
    [sEvt,sCont,sSes,sMat,sCarta].forEach(s => { if(s) s.style.display = 'none'; });
  } else if (mode === 'wizard') {
    [sSes,sMat,sBiz].forEach(s => { if(s) s.style.display = 'none'; });
    if (wType === 'smallEvent') {
      [sCont,sCarta].forEach(s => { if(s) s.style.display = 'none'; });
      document.querySelectorAll('.filterable').forEach(c => { if (c.dataset.type !== 'smallEvent') c.style.display = 'none'; });
    } else if (wType === 'bigEvent') {
      document.querySelectorAll('.filterable').forEach(c => {
        const ct = c.dataset.type, cv = c.dataset.video;
        if (ct === 'smallEvent') { c.style.display = 'none'; return; }
        if (wVideo === 'no') { if (cv !== 'no') c.style.display = 'none'; }
        else if (wVideo === 'yes') { if (cv !== 'yes') c.style.display = 'none'; }
        else if (wVideo === 'social') { if (cv !== 'social' && cv !== 'yes') c.style.display = 'none'; }
        else if (wVideo === 'video-only') { sEvt.style.display = 'none'; }
        else if (wVideo === 'creator') { if (cv !== 'creator') c.style.display = 'none'; }
      });
      if (wVideo === 'video-only' || wVideo === 'creator') { sCont.style.display = 'block'; }
    }
  }
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  initReveal();
}

function show(id) { document.getElementById(id).classList.add('active'); }
function hide(id) { document.getElementById(id).classList.remove('active'); }

/* ────────────── QUOTE FORM ────────────── */
const WA_NUMBER = '527331065420';
function getExtras() { return Array.from(document.querySelectorAll('.pkg-chip:checked')).map(c => c.value); }
function formatDate(raw) {
  if (!raw) return null;
  const [y, m, d] = raw.split('-');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}`;
}
function validateForm() {
  let ok = true;
  const name  = document.getElementById('q-name');
  const phone = document.getElementById('q-phone');
  const svc   = document.getElementById('q-service');
  const errN  = document.getElementById('err-name');
  const errP  = document.getElementById('err-phone');
  const errS  = document.getElementById('err-service');
  [name, phone, svc].forEach(el => el && el.classList.remove('error'));
  [errN, errP, errS].forEach(el => el && el.classList.remove('visible'));
  if (!name.value.trim()) { name.classList.add('error'); errN.classList.add('visible'); ok = false; }
  if (phone && phone.value.trim()) {
    const digits = phone.value.replace(/\D/g,'');
    if (digits.length < 10) { phone.classList.add('error'); errP.classList.add('visible'); ok = false; }
  }
  if (!svc.value) { svc.classList.add('error'); errS.classList.add('visible'); ok = false; }
  return ok;
}
function buildMessage() {
  const name     = document.getElementById('q-name').value.trim();
  const phone    = document.getElementById('q-phone')?.value.trim() || '';
  const service  = document.getElementById('q-service').value;
  const occasion = document.getElementById('q-occasion').value;
  const place    = document.getElementById('q-place').value.trim();
  const dateRaw  = document.getElementById('q-date').value;
  const notes    = document.getElementById('q-notes').value.trim();
  const extras   = getExtras();
  const dateStr  = formatDate(dateRaw);
  let msg = `\u00a1Hola Roberto! \uD83D\uDCF8 Te escribo porque vi tu cat\u00e1logo y me interesa cotizar.\n`;
  msg += `\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
  msg += `\uD83D\uDC64 *Nombre:* ${name}\n`;
  if (phone) msg += `\uD83D\uDCDE *Tel\u00e9fono:* ${phone}\n`;
  msg += `\uD83C\uDFAF *Servicio de inter\u00e9s:* ${service}\n`;
  if (occasion) msg += `\uD83C\uDF8A *Ocasi\u00f3n:* ${occasion}\n`;
  if (dateStr)  msg += `\uD83D\uDCC5 *Fecha tentativa:* ${dateStr}\n`;
  if (place)    msg += `\uD83D\uDCCD *Lugar / Ciudad:* ${place}\n`;
  if (extras.length > 0) msg += `\u2728 *Complementos de inter\u00e9s:* ${extras.join(', ')}\n`;
  if (notes) msg += `\n\uD83D\uDCAC *Detalles adicionales:*\n${notes}\n`;
  msg += `\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`;
  msg += `Quedo pendiente de tu respuesta. \u00a1Gracias! \uD83D\uDE4F`;
  return msg;
}
function previewMessage() {
  if (!validateForm()) return;
  const msg = buildMessage();
  document.getElementById('msgText').textContent = msg;
  const preview = document.getElementById('msgPreview');
  preview.classList.add('visible');
  preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function sendToWhatsApp() {
  if (!validateForm()) return;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`, '_blank');
  clearFormStorage();
  showConfirmModal();
}

const _updatePreview = debounce(() => {
  if (document.getElementById('msgPreview').classList.contains('visible')) {
    if (document.getElementById('q-name').value.trim() && document.getElementById('q-service').value) {
      document.getElementById('msgText').textContent = buildMessage();
    }
  }
}, 300);

['q-name','q-date','q-service','q-occasion','q-place','q-notes','q-phone'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => { _updatePreview(); saveFormToStorage(); });
});
document.querySelectorAll('.pkg-chip').forEach(ch => {
  ch.addEventListener('change', _updatePreview);
});

/* ────────────── PACKAGE CONFIGURATOR ────────────── */
const PRICES = { horaBase:1200, horaExtra:900, video:3500, impresionUnit:8, sesionPrevia:2500, drone:1500, foto2:2500, nextday:1500, creator:3500, marco:1500 };
const configState = { horas:0, video:false, impresiones:0, sesionPrevia:false, drone:false, foto2:false, nextday:false, creator:false, marcos:0 };
function calcHorasPrice(h) { if (h === 0) return 0; return PRICES.horaBase + Math.max(0, h-1) * PRICES.horaExtra; }
function updateConfigurator() {
  const horas = parseInt(document.getElementById('slider-horas').value);
  configState.horas        = horas;
  configState.video        = document.getElementById('toggle-video').checked;
  configState.sesionPrevia = document.getElementById('toggle-sesion-previa').checked;
  configState.drone        = document.getElementById('toggle-drone').checked;
  configState.foto2        = document.getElementById('toggle-foto2').checked;
  configState.nextday      = document.getElementById('toggle-nextday').checked;
  configState.creator      = document.getElementById('toggle-creator').checked;
  document.getElementById('val-horas').textContent = horas;
  const pHoras = calcHorasPrice(horas);
  const pVideo = configState.video        ? PRICES.video        : 0;
  const pImpr  = configState.impresiones  * PRICES.impresionUnit;
  const pSPrev = configState.sesionPrevia ? PRICES.sesionPrevia : 0;
  const pDrone = configState.drone        ? PRICES.drone        : 0;
  const pFoto2 = configState.foto2        ? PRICES.foto2        : 0;
  const pNDay  = configState.nextday      ? PRICES.nextday      : 0;
  const pCreat = configState.creator      ? PRICES.creator      : 0;
  const pMarco = configState.marcos       * PRICES.marco;
  document.getElementById('price-horas').textContent         = pHoras  ? fmt(pHoras)  : '$0';
  document.getElementById('price-video').textContent         = pVideo  ? fmt(pVideo)  : '$0';
  document.getElementById('price-impresiones').textContent   = pImpr   ? fmt(pImpr)   : '$0';
  document.getElementById('price-sesion-previa').textContent = pSPrev  ? fmt(pSPrev)  : '$0';
  document.getElementById('price-drone').textContent         = pDrone  ? fmt(pDrone)  : '$0';
  document.getElementById('price-foto2').textContent         = pFoto2  ? fmt(pFoto2)  : '$0';
  document.getElementById('price-redes').textContent         = (pNDay+pCreat) ? fmt(pNDay+pCreat) : '$0';
  document.getElementById('price-marco').textContent         = pMarco  ? fmt(pMarco)  : '$0';
  const total = pHoras+pVideo+pImpr+pSPrev+pDrone+pFoto2+pNDay+pCreat+pMarco;
  document.getElementById('config-grand-total').textContent = fmt(total);
  const lines = getConfigQuoteLines();
  const linesEl = document.getElementById('config-lines');
  if (lines.length === 0) {
    linesEl.innerHTML = '<div class="config-empty">A\u00fan no has seleccionado nada.<br>Usa los controles para armar tu paquete.</div>';
  } else {
    linesEl.innerHTML = lines.map(l => `<div class="config-line"><span class="config-line-name">${l.n}</span><span class="config-line-val">${l.v}</span></div>`).join('')
      + `<div class="config-line" style="border-top:1px solid rgba(200,169,110,.2);padding-top:10px;margin-top:4px;"><span class="config-line-name" style="color:var(--parchment);font-weight:500;">Total</span><span class="config-line-val" style="font-size:1rem;">${fmt(total)}</span></div>`;
  }
  const waBtn = document.getElementById('config-wa-btn');
  if (total > 0) { waBtn.style.opacity='1'; waBtn.style.pointerEvents='auto'; waBtn.style.cursor='pointer'; }
  else           { waBtn.style.opacity='.4'; waBtn.style.pointerEvents='none'; waBtn.style.cursor='not-allowed'; }
  updateComparator(total, lines);
}
function changeQty(field, delta) {
  const minVals = { impresiones:0, marcos:0 };
  const maxVals = { impresiones:500, marcos:5 };
  configState[field] = Math.min(maxVals[field], Math.max(minVals[field], configState[field]+delta));
  if (field === 'impresiones') document.getElementById('val-impresiones').textContent = configState.impresiones;
  if (field === 'marcos')      document.getElementById('val-marcos').textContent      = configState.marcos;
  updateConfigurator();
}
function updateComparator(total, lines) {
  const compareEl = document.getElementById('config-compare');
  const compareText = document.getElementById('config-compare-text');
  if (total === 0) { compareEl.style.display='none'; return; }
  const catalog = [
    { name:'Paquete Instantes', price:1500 }, { name:'Paquete Esencial', price:3500 },
    { name:'Paquete Recuerdos', price:6500 }, { name:'Paquete Retrato', price:7000 },
    { name:'Paquete Signature', price:8000 }, { name:'Paquete Deluxe', price:9000 },
    { name:'Paquete Celebrity', price:12500 },
  ];
  const closest = catalog.reduce((prev, curr) => Math.abs(curr.price-total) < Math.abs(prev.price-total) ? curr : prev);
  const diff = total - closest.price;
  const msg = diff === 0
    ? `Tu selecci\u00f3n coincide con el <strong style="color:var(--gold)">${closest.name}</strong>. Si prefieres resolverlo r\u00e1pido, ese paquete ya cubre una experiencia muy parecida.`
    : diff > 0
      ? `Tu selecci\u00f3n supera por <strong style="color:var(--gold)">${fmt(Math.abs(diff))}</strong> al <strong style="color:var(--gold)">${closest.name}</strong>. Tiene sentido si buscas m\u00e1s flexibilidad que un paquete fijo.`
      : `Tu selecci\u00f3n queda cerca del <strong style="color:var(--gold)">${closest.name}</strong> y podr\u00edas ahorrar <strong style="color:var(--gold)">${fmt(Math.abs(diff))}</strong> si ese paquete ya resuelve lo que necesitas.`;
  compareText.innerHTML = msg;
  compareEl.style.display = 'block';
}
function resetConfigurator() {
  document.getElementById('slider-horas').value = 0;
  ['video','sesion-previa','drone','foto2','nextday','creator'].forEach(id => { document.getElementById('toggle-'+id).checked = false; });
  configState.impresiones = 0; configState.marcos = 0;
  document.getElementById('val-impresiones').textContent = '0';
  document.getElementById('val-marcos').textContent = '0';
  updateConfigurator();
}
function getConfigQuoteLines() {
  const lines = [];
  const pHoras = calcHorasPrice(configState.horas);
  const pVideo = configState.video ? PRICES.video : 0;
  const pImpr = configState.impresiones * PRICES.impresionUnit;
  const pSPrev = configState.sesionPrevia ? PRICES.sesionPrevia : 0;
  const pDrone = configState.drone ? PRICES.drone : 0;
  const pFoto2 = configState.foto2 ? PRICES.foto2 : 0;
  const pNDay = configState.nextday ? PRICES.nextday : 0;
  const pCreat = configState.creator ? PRICES.creator : 0;
  const pMarco = configState.marcos * PRICES.marco;
  if (pHoras)  lines.push({ n: `Cobertura ${configState.horas}h`, v: fmt(pHoras) });
  if (pVideo)  lines.push({ n: 'Video editado', v: fmt(pVideo) });
  if (pImpr)   lines.push({ n: `${configState.impresiones} fotos impresas`, v: fmt(pImpr) });
  if (pSPrev)  lines.push({ n: 'Sesi\u00f3n previa + cuadro', v: fmt(pSPrev) });
  if (pDrone)  lines.push({ n: 'Tomas con drone', v: fmt(pDrone) });
  if (pFoto2)  lines.push({ n: 'Fotógrafo adicional', v: fmt(pFoto2) });
  if (pNDay)   lines.push({ n: 'Next-Day 15 fotos', v: fmt(pNDay) });
  if (pCreat)  lines.push({ n: 'Content Creator VIP', v: fmt(pCreat) });
  if (pMarco)  lines.push({ n: `${configState.marcos} ampliaci\u00f3n(es) enmarcada(s)`, v: fmt(pMarco) });
  return lines;
}
function getConfigSnapshot() {
  return {
    horas: configState.horas,
    video: configState.video,
    impresiones: configState.impresiones,
    sesionPrevia: configState.sesionPrevia,
    drone: configState.drone,
    foto2: configState.foto2,
    nextday: configState.nextday,
    creator: configState.creator,
    marcos: configState.marcos,
  };
}
function applyConfigSnapshot(snapshot) {
  if (!snapshot) return;
  document.getElementById('slider-horas').value = snapshot.horas ?? 0;
  document.getElementById('toggle-video').checked = Boolean(snapshot.video);
  document.getElementById('toggle-sesion-previa').checked = Boolean(snapshot.sesionPrevia);
  document.getElementById('toggle-drone').checked = Boolean(snapshot.drone);
  document.getElementById('toggle-foto2').checked = Boolean(snapshot.foto2);
  document.getElementById('toggle-nextday').checked = Boolean(snapshot.nextday);
  document.getElementById('toggle-creator').checked = Boolean(snapshot.creator);
  configState.impresiones = snapshot.impresiones ?? 0;
  configState.marcos = snapshot.marcos ?? 0;
  document.getElementById('val-impresiones').textContent = String(configState.impresiones);
  document.getElementById('val-marcos').textContent = String(configState.marcos);
  updateConfigurator();
}
function sameConfigSnapshot(a, b) {
  return JSON.stringify(a || null) === JSON.stringify(b || null);
}

function sendConfigToWhatsApp() {
  const nombre = prompt('\u00bfC\u00f3mo te llamas? (Para que Roberto pueda identificarte)');
  if (nombre === null) return;
  const nombreFinal = nombre.trim() || 'Cliente';
  const horas = configState.horas;
  const total = parseInt(document.getElementById('config-grand-total').textContent.replace(/[$,]/g,''));
  saveQuoteToHistory(getConfigQuoteLines(), total, getConfigSnapshot());
  let msg = `\u00a1Hola Roberto! \uD83D\uDCF8 Arm\u00e9 mi paquete personalizado en tu cat\u00e1logo y quisiera cotizarlo.\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDC64 *Nombre:* ${nombreFinal}\n\n\uD83D\uDEE0\uFE0F *Mi configuraci\u00f3n:*\n`;
  if (horas > 0)                 msg += `\uD83D\uDD50 Cobertura: ${horas} hora(s)\n`;
  if (configState.video)         msg += '\uD83C\uDFAC Video editado: S\u00ed\n';
  if (configState.impresiones>0) msg += `\uD83D\uDDBC\uFE0F Fotos impresas: ${configState.impresiones} fotos\n`;
  if (configState.sesionPrevia)  msg += '\u2728 Sesi\u00f3n previa + cuadro: S\u00ed\n';
  if (configState.drone)         msg += '\uD83D\uDE81 Tomas con drone: S\u00ed\n';
  if (configState.foto2)         msg += '\uD83D\uDCF7 Fot\u00f3grafo adicional: S\u00ed\n';
  if (configState.nextday)       msg += '\uD83D\uDCF2 Next-Day (15 fotos 48h): S\u00ed\n';
  if (configState.creator)       msg += '\u2B50 Content Creator VIP: S\u00ed\n';
  if (configState.marcos > 0)    msg += `\uD83D\uDDBC Ampliaciones enmarcadas: ${configState.marcos} pieza(s)\n`;
  msg += `\n\uD83D\uDCB0 *Total estimado: ${total.toLocaleString()} MXN + IVA*\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\nQuedo pendiente de tu confirmaci\u00f3n y disponibilidad. \u00a1Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}
function scrollToConfigurator() {
  mode = 'all'; wType = null; wVideo = null;
  document.getElementById('wizard').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  document.getElementById('reset-area').style.display = 'block';
  document.querySelectorAll('[id^="sec-"]').forEach(s => s.style.display = 'block');
  document.querySelectorAll('.filterable').forEach(c => c.style.display = 'block');
  setTimeout(() => { document.getElementById('sec-configurador').scrollIntoView({ behavior:'smooth', block:'start' }); }, 100);
  initReveal();
}
function scrollToSection(id) {
  mode = 'all'; wType = null; wVideo = null;
  document.getElementById('wizard').style.display = 'none';
  document.getElementById('results').style.display = 'block';
  document.getElementById('reset-area').style.display = 'block';
  document.querySelectorAll('[id^="sec-"]').forEach(s => s.style.display = 'block');
  document.querySelectorAll('.filterable').forEach(c => c.style.display = 'block');
  setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); }, 100);
  initReveal();
  if (id === 'sec-configuradores') buildCompareGrid();
}

/* ─── SHOW/HIDE sub-configurator panels ─── */
function showCconfig(name) {
  document.getElementById('configs-menu').style.display = 'none';
  document.querySelectorAll('.cconfig-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('cconfig-'+name).classList.add('active');
  if (name === 'sesion')     calcSesion();
  if (name === 'boda')       calcBoda();
  if (name === 'b2b')        calcB2b();
  if (name === 'comparador') buildCompareGrid();
  document.getElementById('sec-configuradores').scrollIntoView({ behavior:'smooth', block:'start' });
}
function hideCconfig() {
  document.querySelectorAll('.cconfig-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('configs-menu').style.display = 'grid';
}
function waBtn(id, total) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (total > 0) { btn.style.opacity='1'; btn.style.pointerEvents='auto'; }
  else           { btn.style.opacity='.4'; btn.style.pointerEvents='none'; }
}
function renderLines(containerId, lines) {
  const el = document.getElementById(containerId);
  if (!lines.length) { el.innerHTML='<div class="cresult-empty">Ajusta las opciones para ver una propuesta clara.</div>'; return; }
  el.innerHTML = lines.map(([n,v]) => `<div class="cresult-line"><span>${n}</span><span>${$fmt(v)}</span></div>`).join('')
    + `<div class="cresult-line" style="border-top:1px solid rgba(200,169,110,.2);margin-top:4px;padding-top:6px;"><span style="color:var(--parchment);font-weight:500;">Total</span><span style="font-size:1rem;">${$fmt(lines.reduce((s,[,v])=>s+v,0))}</span></div>`;
}

/* ═══ SESIÓN A LA MEDIDA ═══ */
const spState = { horas:1, loc:0, ropa:1, fotos:10, imp:0, marco:false };
function spQty(field, delta) {
  const limits = { ropa:[1,6,1], fotos:[10,60,5], imp:[0,100,5] };
  const [mn,mx] = limits[field];
  spState[field] = Math.min(mx, Math.max(mn, spState[field]+delta));
  document.getElementById('sp-'+field+'-val').textContent = spState[field];
  calcSesion();
}
function calcSesion() {
  spState.horas = +document.getElementById('sp-horas').value;
  const locSel  = document.querySelector('input[name="sp-loc"]:checked');
  spState.loc   = locSel ? +locSel.value : 0;
  spState.marco = document.getElementById('sp-marco').checked;
  document.getElementById('sp-horas-val').textContent = spState.horas;
  const pHoras = 600 + (spState.horas-1)*450;
  const pLoc   = spState.loc;
  const pRopa  = Math.max(0,(spState.ropa-1))*150;
  const pFotos = Math.max(0,(spState.fotos-10))*30;
  const pImp   = spState.imp*8;
  const pMarco = spState.marco ? 1500 : 0;
  const total  = pHoras+pLoc+pRopa+pFotos+pImp+pMarco;
  document.getElementById('sp-horas-price').textContent = $fmt(pHoras);
  document.getElementById('sp-loc-price').textContent   = pLoc ? $fmt(pLoc) : 'Incluida';
  document.getElementById('sp-ropa-price').textContent  = pRopa ? $fmt(pRopa) : '$0';
  document.getElementById('sp-fotos-price').textContent = pFotos ? $fmt(pFotos) : 'Incluidas';
  document.getElementById('sp-imp-price').textContent   = pImp ? $fmt(pImp) : '$0';
  document.getElementById('sp-marco-price').textContent = pMarco ? $fmt(pMarco) : '$0';
  document.getElementById('sp-total').textContent       = $fmt(total);
  const lines = [];
  lines.push([`${spState.horas} hora(s) de sesi\u00f3n`, pHoras]);
  if(pLoc)   lines.push(['Locaci\u00f3n especial', pLoc]);
  if(pRopa)  lines.push([`${spState.ropa-1} cambio(s) adicional(es)`, pRopa]);
  if(pFotos) lines.push([`${spState.fotos-10} fotos extra`, pFotos]);
  if(pImp)   lines.push([`${spState.imp} fotos impresas`, pImp]);
  if(pMarco) lines.push(['Ampliaci\u00f3n enmarcada 16\u00d720"', pMarco]);
  renderLines('sp-lines', lines);
  const suggest = document.getElementById('sp-suggest');
  const pkgs = [{n:'Mini Sesi\u00f3n',p:750},{n:'Sesi\u00f3n Cl\u00e1sica',p:1500},{n:'Sesi\u00f3n Premium',p:2500},{n:'Sesi\u00f3n de Compromiso',p:2800}];
  const closest = pkgs.reduce((a,b) => Math.abs(b.p-total)<Math.abs(a.p-total)?b:a);
  const diff = total-closest.p;
  if(Math.abs(diff)<800 && total>0){
    suggest.style.display='block';
    suggest.innerHTML=`<strong>\uD83D\uDCA1 Referencia cercana: ${closest.n} (${$fmt(closest.p)})</strong>${diff>0?`Tu sesi\u00f3n queda ${$fmt(diff)} arriba porque est\u00e1s pidiendo una experiencia m\u00e1s amplia.`:`Si ese paquete ya cubre lo que buscas, podr\u00edas ahorrar ${$fmt(Math.abs(diff))}.`}`;
  } else { suggest.style.display='none'; }
  waBtn('sp-wa', total);
}
function sendSesionWA() {
  const nombre = prompt('\u00bfC\u00f3mo te llamas?');
  if(nombre===null) return;
  const total = 600+(spState.horas-1)*450+spState.loc+Math.max(0,(spState.ropa-1))*150+Math.max(0,(spState.fotos-10))*30+spState.imp*8+(spState.marco?1500:0);
  const locNames = {0:'Estudio o exterior',500:'Domicilio / locaci\u00f3n especial'};
  let msg=`\u00a1Hola Roberto! \uD83D\uDCF8 Arm\u00e9 mi sesi\u00f3n fotogr\u00e1fica a la medida.\n\n\uD83D\uDC64 *Nombre:* ${nombre||'Cliente'}\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\u23F1 *Duraci\u00f3n:* ${spState.horas} hora(s)\n\uD83D\uDCCD *Locaci\u00f3n:* ${locNames[spState.loc]||'Especial'}\n\uD83D\uDC57 *Cambios de ropa:* ${spState.ropa}\n\uD83D\uDCC1 *Fotos digitales:* ${spState.fotos}\n`;
  if(spState.imp) msg+=`\uD83D\uDDA8\uFE0F *Fotos impresas:* ${spState.imp}\n`;
  if(spState.marco) msg+=`\uD83D\uDDBC *Ampliaci\u00f3n enmarcada:* S\u00ed\n`;
  msg+=`\n\uD83D\uDCB0 *Total estimado: ${$fmt(total)} MXN + IVA*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\nQuedo pendiente. \u00a1Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

/* ═══ CALCULADORA DE BODA ═══ */
const bwState = { imp:100 };
function bwQty(field, delta) {
  const limits = { imp:[100,300,25] };
  const [mn,mx] = limits[field];
  bwState[field] = Math.min(mx, Math.max(mn, bwState[field]+delta));
  document.getElementById('bw-'+field+'-val').textContent = bwState[field];
  calcBoda();
}
function calcBoda() {
  const horas    = +document.getElementById('bw-horas').value;
  const foto2    = document.getElementById('bw-foto2').checked;
  const videoVal = +document.querySelector('input[name="bw-video"]:checked').value;
  const sesion   = document.getElementById('bw-sesion').checked;
  const drone    = document.getElementById('bw-drone').checked;
  const redesVal = +document.querySelector('input[name="bw-redes"]:checked').value;
  document.getElementById('bw-horas-val').textContent = horas;
  const pHoras  = 3500 + Math.max(0,horas-4)*900;
  const pFoto2  = foto2 ? 2500 : 0;
  const pVideo  = videoVal;
  const pSesion = sesion ? 2500 : 0;
  const pDrone  = drone ? 1500 : 0;
  const pImp    = bwState.imp*8;
  const pRedes  = redesVal;
  const total   = pHoras+pFoto2+pVideo+pSesion+pDrone+pImp+pRedes;
  document.getElementById('bw-horas-price').textContent  = $fmt(pHoras);
  document.getElementById('bw-foto2-price').textContent  = pFoto2 ? $fmt(pFoto2) : '$0';
  document.getElementById('bw-video-price').textContent  = pVideo ? $fmt(pVideo) : '$0';
  document.getElementById('bw-sesion-price').textContent = pSesion ? $fmt(pSesion) : '$0';
  document.getElementById('bw-drone-price').textContent  = pDrone ? $fmt(pDrone) : '$0';
  document.getElementById('bw-imp-price').textContent    = $fmt(pImp);
  document.getElementById('bw-redes-price').textContent  = pRedes ? $fmt(pRedes) : '$0';
  document.getElementById('bw-total').textContent        = $fmt(total);
  const videoLabel = {0:'',3500:'Video cl\u00e1sico',4500:'Video art\u00edstico'};
  const redesLabel = {0:'',1500:'Next-Day 15 fotos',3500:'Creator VIP en vivo'};
  const lines = [[`Cobertura ${horas} hrs`, pHoras]];
  if(pFoto2)  lines.push(['Fot\u00f3grafo adicional', pFoto2]);
  if(pVideo)  lines.push([videoLabel[videoVal], pVideo]);
  if(pSesion) lines.push(['Sesi\u00f3n previa + cuadro', pSesion]);
  if(pDrone)  lines.push(['Drone', pDrone]);
  lines.push([`${bwState.imp} fotos impresas`, pImp]);
  if(pRedes)  lines.push([redesLabel[redesVal], pRedes]);
  renderLines('bw-lines', lines);
  const pkgs = [{n:'Paquete Recuerdos',p:6500},{n:'Paquete Retrato',p:7000},{n:'Paquete Signature',p:8000},{n:'Paquete Deluxe',p:9000},{n:'Paquete Celebrity',p:12500}];
  const sug = document.getElementById('bw-suggest');
  const closest = pkgs.reduce((a,b) => Math.abs(b.p-total)<Math.abs(a.p-total)?b:a);
  const diff = total-closest.p;
  sug.style.display='block';
  sug.innerHTML=`<strong>\uD83D\uDCA1 Referencia cercana: ${closest.n} (${$fmt(closest.p)})</strong>${diff===0?'Tu configuraci\u00f3n coincide con ese paquete.':diff>0?`Tu cobertura queda ${$fmt(diff)} arriba porque est\u00e1s sumando extras y mayor amplitud.`:`Si ese paquete ya cubre tu evento, podr\u00edas ahorrar ${$fmt(Math.abs(diff))}.`}`;
}
function sendBodaWA() {
  const nombre = prompt('\u00bfC\u00f3mo te llamas?');
  if(nombre===null) return;
  const horas    = +document.getElementById('bw-horas').value;
  const videoVal = +document.querySelector('input[name="bw-video"]:checked').value;
  const redesVal = +document.querySelector('input[name="bw-redes"]:checked').value;
  const videoLabel = {0:'No',3500:'Video cl\u00e1sico',4500:'Video art\u00edstico (Signature)'};
  const redesLabel = {0:'No',1500:'Next-Day 15 fotos',3500:'Creator VIP en vivo'};
  const total = 3500+Math.max(0,horas-4)*900+(document.getElementById('bw-foto2').checked?2500:0)+videoVal+(document.getElementById('bw-sesion').checked?2500:0)+(document.getElementById('bw-drone').checked?1500:0)+bwState.imp*8+redesVal;
  let msg=`\u00a1Hola Roberto! \uD83D\uDC8D Arm\u00e9 la cobertura de mi boda/evento.\n\n\uD83D\uDC64 *Nombre:* ${nombre||'Cliente'}\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDD50 *Horas:* ${horas}\n\uD83D\uDCF7 *Fot\u00f3grafo adicional:* ${document.getElementById('bw-foto2').checked?'S\u00ed':'No'}\n\uD83C\uDFAC *Video:* ${videoLabel[videoVal]}\n\u2728 *Sesi\u00f3n previa:* ${document.getElementById('bw-sesion').checked?'S\u00ed':'No'}\n\uD83D\uDE81 *Drone:* ${document.getElementById('bw-drone').checked?'S\u00ed':'No'}\n\uD83D\uDDA8\uFE0F *Fotos impresas:* ${bwState.imp}\n\uD83D\uDCF2 *Redes sociales:* ${redesLabel[redesVal]}\n\n\uD83D\uDCB0 *Total estimado: ${$fmt(total)} MXN + IVA*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\nQuedo pendiente. \u00a1Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

/* ═══ CONFIGURADOR B2B ═══ */
const b2State = { items:10 };
function b2Qty(field, delta) {
  const limits = { items:[5,100,5] };
  const [mn,mx] = limits[field];
  b2State[field] = Math.min(mx, Math.max(mn, b2State[field]+delta));
  document.getElementById('b2-'+field+'-val').textContent = b2State[field];
  calcB2b();
}
function calcB2b() {
  const tipo    = document.querySelector('input[name="b2-tipo"]:checked').value;
  const freq    = document.querySelector('input[name="b2-freq"]:checked').value;
  const fmtVal  = document.querySelector('input[name="b2-fmt"]:checked').value;
  const retrato = document.getElementById('b2-retrato').checked;
  const baseByTipo = { foto:1800, video:2500, hibrido:2900 };
  const base = baseByTipo[tipo];
  const pItems   = Math.max(0,(b2State.items-10))*120;
  const pRetrato = retrato ? 1800 : 0;
  const pFmt     = fmtVal==='ambos' ? 300 : 0;
  const totalUnica   = base+pItems+pRetrato+pFmt;
  const totalMensual = 2500;
  const isMonthly    = freq==='mensual';
  const total        = isMonthly ? totalMensual : totalUnica;
  const saving       = isMonthly ? Math.max(0,totalUnica-totalMensual) : 0;
  const tipoLabel = { foto:'Fotograf\u00eda de producto', video:'Video corporativo', hibrido:'Contenido H\u00edbrido' };
  document.getElementById('b2-tipo-price').textContent    = $fmt(base);
  document.getElementById('b2-items-price').textContent   = pItems ? $fmt(pItems) : 'Incluidos';
  document.getElementById('b2-retrato-price').textContent = pRetrato ? $fmt(pRetrato) : '$0';
  document.getElementById('b2-fmt-price').textContent     = pFmt ? '+$300' : 'Incluido';
  document.getElementById('b2-total').textContent         = $fmt(total);
  document.getElementById('b2-recurrence').textContent    = isMonthly ? 'MXN/mes + IVA' : 'MXN + IVA';
  const lines = isMonthly ? [['Membres\u00eda Iguala Visual', 2500]] : [
    [tipoLabel[tipo], base],
    ...(pItems   ? [[`${b2State.items-10} items extra`, pItems]]   : []),
    ...(pRetrato ? [['Retrato corporativo equipo', pRetrato]]       : []),
    ...(pFmt     ? [['Ambos formatos', pFmt]]                       : []),
  ];
  renderLines('b2-lines', lines);
  const sug = document.getElementById('b2-suggest');
  if(isMonthly && saving>0){
    sug.style.display='block';
    sug.innerHTML=`<strong>\uD83D\uDCA1 Con la membres\u00eda ahorras ${$fmt(saving)}/mes</strong>vs contratar estas sesiones por separado. Precio bloqueado por 12 meses.`;
  } else if(!isMonthly && totalUnica>=2400){
    sug.style.display='block';
    sug.innerHTML=`<strong>\uD83D\uDCA1 \u00bfNecesitar\u00e1s contenido mensual?</strong>La membres\u00eda Iguala Visual (${(2500).toLocaleString()}/mes) incluye 4 visitas mensuales y puede ser m\u00e1s econ\u00f3mica si tu volumen es constante.`;
  } else { sug.style.display='none'; }
}
function sendB2bWA() {
  const nombre = prompt('\u00bfC\u00f3mo te llamas? / \u00bfNombre de tu negocio?');
  if(nombre===null) return;
  const tipo    = document.querySelector('input[name="b2-tipo"]:checked').value;
  const freq    = document.querySelector('input[name="b2-freq"]:checked').value;
  const fmtVal  = document.querySelector('input[name="b2-fmt"]:checked').value;
  const tipoLabel = { foto:'Fotograf\u00eda de producto', video:'Video corporativo', hibrido:'Foto + Video H\u00edbrido' };
  const fmtLabel  = { web:'Solo web (horizontal)', social:'Solo redes (vertical)', ambos:'Ambos formatos' };
  const total = freq==='mensual' ? 2500 : ({foto:1800,video:2500,hibrido:2900}[tipo]+Math.max(0,(b2State.items-10))*120+(document.getElementById('b2-retrato').checked?1800:0)+(fmtVal==='ambos'?300:0));
  let msg=`\u00a1Hola Roberto! \uD83C\uDFE2 Configur\u00e9 el contenido para mi negocio.\n\n\uD83D\uDC64 *Nombre / Negocio:* ${nombre||'Cliente'}\n\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDCE6 *Tipo:* ${tipoLabel[tipo]}\n\uD83D\uDCC5 *Modalidad:* ${freq==='mensual'?'Membres\u00eda mensual':'Sesi\u00f3n \u00fanica'}\n\uD83D\uDCCB *Items a fotografiar:* ${b2State.items}\n\uD83D\uDC54 *Retrato corporativo:* ${document.getElementById('b2-retrato').checked?'S\u00ed':'No'}\n\uD83D\uDCD0 *Formatos:* ${fmtLabel[fmtVal]}\n\n\uD83D\uDCB0 *Total: ${$fmt(total)} MXN${freq==='mensual'?'/mes':''} + IVA*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\nQuedo pendiente. \u00a1Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

/* ═══ COMPARADOR DE PAQUETES ═══ */
const COMPARE_PKGS = [
  { id:'instantes', name:'Instantes', price:1500,  horas:'2',       foto2:false, video:false, sesion:false, impresiones:'\u2014',   marco:false, book:false, redes:false, entrega:'3\u20135 d\u00edas' },
  { id:'esencial',  name:'Esencial',  price:3500,  horas:'Evento',  foto2:false, video:false, sesion:false, impresiones:'100', marco:false, book:false, redes:false, entrega:'7\u201310 d\u00edas' },
  { id:'recuerdos', name:'Recuerdos', price:6500,  horas:'Evento',  foto2:false, video:true,  sesion:false, impresiones:'100', marco:false, book:false, redes:false, entrega:'15\u201320 d\u00edas' },
  { id:'retrato',   name:'Retrato',   price:7000,  horas:'Evento',  foto2:false, video:false, sesion:true,  impresiones:'100', marco:true,  book:false, redes:false, entrega:'10\u201315 d\u00edas' },
  { id:'signature', name:'Signature', price:8000,  horas:'Evento',  foto2:false, video:true,  sesion:true,  impresiones:'120', marco:true,  book:false, redes:false, entrega:'15\u201320 d\u00edas' },
  { id:'deluxe',    name:'Deluxe',    price:9000,  horas:'Evento',  foto2:false, video:true,  sesion:true,  impresiones:'100', marco:true,  book:false, redes:true,  entrega:'15\u201320 d\u00edas' },
  { id:'celebrity', name:'Celebrity', price:12500, horas:'10 hrs',  foto2:true,  video:true,  sesion:true,  impresiones:'200', marco:true,  book:true,  redes:true,  entrega:'7 d\u00edas' },
];
const COMPARE_FEATURES = [
  { key:'price',       label:'Precio MXN' },
  { key:'horas',       label:'Horas / cobertura' },
  { key:'foto2',       label:'2\u00b0 Fot\u00f3grafo' },
  { key:'video',       label:'Video editado' },
  { key:'sesion',      label:'Sesi\u00f3n previa' },
  { key:'impresiones', label:'Fotos impresas' },
  { key:'marco',       label:'Ampliaci\u00f3n enmarcada' },
  { key:'book',        label:'Book impreso premium' },
  { key:'redes',       label:'Contenido para redes' },
  { key:'entrega',     label:'Tiempo de entrega' },
];
function buildCompareGrid() {
  const grid = document.getElementById('compare-select-grid');
  if (!grid) return;
  grid.innerHTML = COMPARE_PKGS.map(p =>
    `<div><input type="checkbox" class="compare-pkg-check" id="cpkg-${p.id}" value="${p.id}" onchange="renderComparatorTable()"><label for="cpkg-${p.id}" class="compare-pkg-label"><div class="cpkg-name">${p.name}</div><div class="cpkg-price">${$fmt(p.price)}</div></label></div>`
  ).join('');
}
function renderComparatorTable() {
  const selected = COMPARE_PKGS.filter(p => { const el = document.getElementById('cpkg-'+p.id); return el && el.checked; });
  const wrap    = document.getElementById('compare-table-wrap');
  const actions = document.getElementById('compare-actions');
  if (selected.length < 2) { wrap.style.display='none'; actions.style.display='none'; return; }
  wrap.style.display='block';
  const thead = `<thead><tr><th class="feature-col">Caracter\u00edstica</th>${selected.map(p=>`<th>${p.name}<br><span style="font-size:.8rem;color:var(--mist)">${$fmt(p.price)}</span></th>`).join('')}</tr></thead>`;
  const tbody = COMPARE_FEATURES.map(f => {
    const cells = selected.map(p => {
      const v = p[f.key];
      if(typeof v==='boolean') return `<td>${v?'<span class="compare-yes">\u2713</span>':'<span class="compare-no">\u2014</span>'}</td>`;
      if(f.key==='price') return `<td><span class="compare-val">${$fmt(v)}</span></td>`;
      return `<td><span class="compare-val">${v}</span></td>`;
    }).join('');
    return `<tr><td class="feature-col">${f.label}</td>${cells}</tr>`;
  }).join('');
  document.getElementById('compare-table').innerHTML = thead+`<tbody>${tbody}</tbody>`;
  actions.style.display='flex';
  actions.innerHTML=`<a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`\u00a1Hola Roberto! Vi el comparador de paquetes y me interesa cotizar. Estoy evaluando: ${selected.map(p=>p.name).join(' vs ')}. \u00bfMe puedes orientar?`)}" target="_blank" class="btn btn-gold">\uD83D\uDCAC Pedir orientaci\u00f3n por WhatsApp</a><span style="font-size:.78rem;color:var(--mist);align-self:center;">Comparando: ${selected.map(p=>p.name).join(' \u00b7 ')}</span>`;
}

/* ────────────── SAVINGS CALCULATOR ────────────── */
function calcSaving() {
  const visits = parseInt(document.getElementById('calc-visits')?.value || 4);
  const type   = document.getElementById('calc-type')?.value || 'restaurante';
  const pricePerSession = { restaurante:900, salon:900, tienda:900, profesionista:1800 };
  const label = { restaurante:'sesiones de producto', salon:'sesiones de servicio', tienda:'sesiones de producto', profesionista:'sesiones de retrato' };
  const unitPrice = pricePerSession[type];
  const totalSeparate = visits * unitPrice;
  const membership = 2500;
  const saving = totalSeparate - membership;
  const valEl = document.getElementById('calc-saving-val');
  const detEl = document.getElementById('calc-detail');
  if (valEl) valEl.textContent = saving > 0 ? `${saving.toLocaleString()}` : '$0';
  if (detEl) detEl.textContent = `${visits} ${label[type]} \u00d7 ${unitPrice.toLocaleString()} = ${totalSeparate.toLocaleString()} \u00b7 Membres\u00eda = ${membership.toLocaleString()}`;
}

/* ────────────── SHARE REFERRAL ────────────── */
function shareReferral() {
  const url  = window.location.href;
  const text = `\uD83D\uDCF8 \u00a1Mira el cat\u00e1logo de Roberto, fot\u00f3grafo en Iguala! Tiene paquetes para XV a\u00f1os, bodas, sesiones y m\u00e1s. Muy buena calidad y precio justo. Si contratas dile que te recomend\u00e9 yo \uD83D\uDE0A\n\n${url}`;
  if (navigator.share) {
    navigator.share({ title:'El Fot\u00f3grafo \u00b7 Roberto Guadarrama', text, url }).catch(() => fallbackShare(text));
  } else { fallbackShare(text); }
}
function fallbackShare(text) { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }

/* ────────────── COUNTDOWN TIMER ────────────── */
(function() {
  const target = new Date('2026-05-10T00:00:00');
  function updateCountdown() {
    const now  = new Date();
    const diff = target - now;
    if (diff <= 0) { const banner = document.getElementById('seasonal-banner'); if (banner) banner.style.display='none'; return; }
    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const mins  = Math.floor((diff % (1000*60*60)) / (1000*60));
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    if (dEl) dEl.textContent = String(days).padStart(2,'0');
    if (hEl) hEl.textContent = String(hours).padStart(2,'0');
    if (mEl) mEl.textContent = String(mins).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);
})();

/* ────────────── DYNAMIC SCARCITY ────────────── */
(function() {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now = new Date();
  document.querySelectorAll('.scarcity-badge').forEach((el, i) => {
    if (i === 0) el.textContent = `Cobertura premium disponible en ${months[now.getMonth()]}`;
    if (i === 1) el.textContent = 'Paquete VIP sujeto a agenda confirmada';
  });
})();

/* ────────────── SCROLL REVEAL ────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ────────────── DOM READY ────────────── */
document.addEventListener('DOMContentLoaded', () => {
  calcSaving();
  initReveal();
  loadFormFromStorage();
  initLazyImages();
  renderQuoteHistory();

  // Restaurar tema guardado
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light-mode');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = '🌙';
  }

  // Navbar scroll visibility
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) { navbar.classList.add('visible'); }
    else { navbar.classList.remove('visible'); }
    if (window.scrollY > 400) { backTop.classList.add('visible'); }
    else { backTop.classList.remove('visible'); }
  }, { passive: true });
});

/* ────────────── FORM PERSISTENCE ────────────── */
const FORM_FIELDS = ['q-name','q-phone','q-date','q-service','q-occasion','q-place','q-notes'];
function saveFormToStorage() {
  const data = {};
  FORM_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });
  try { localStorage.setItem('quoteForm', JSON.stringify(data)); } catch(e) {}
}
function loadFormFromStorage() {
  try {
    const raw = localStorage.getItem('quoteForm');
    if (!raw) return;
    const data = JSON.parse(raw);
    FORM_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && data[id]) el.value = data[id];
    });
  } catch(e) {}
}
function clearFormStorage() {
  try { localStorage.removeItem('quoteForm'); } catch(e) {}
}

/* ────────────── CONFIRM MODAL ────────────── */
function showConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeConfirmModal() {
  const modal = document.getElementById('confirm-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
// Cerrar modal al hacer click fuera
document.addEventListener('click', e => {
  const modal = document.getElementById('confirm-modal');
  if (modal && e.target === modal) closeConfirmModal();
});

/* ────────────── GALLERY FILTER ────────────── */
function filterGallery(btn, cat) {
  document.querySelectorAll('.gal-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gal-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

/* ────────────── LAZY LOADING IMAGES ────────────── */
function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        imgObs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
}

/* ────────────── SPLASH SCREEN ────────────── */
(function() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const splash = document.getElementById('splash');
      if (splash) splash.classList.add('hidden');
    }, 1100);
  });
})();

/* ────────────── CUSTOM CURSOR ────────────── */
(function() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx+'px';
    ring.style.top  = ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
})();

/* ────────────── TOAST ────────────── */
let _toastTimer = null;
const ENABLE_AUTOMATED_TOASTS = false;
function showToast(icon, title, msg, duration = 5000) {
  document.getElementById('toast-icon').textContent  = icon;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent   = msg;
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(hideToast, duration);
}
function hideToast() {
  document.getElementById('toast').classList.remove('show');
}
// Social proof toasts — se muestran en secuencia
const TOASTS = [
  { icon:'🎉', title:'Alguien de Iguala', msg:'cotizó el Paquete Deluxe hace 2 horas.' },
  { icon:'📸', title:'Nueva reserva', msg:'XV Años · Paquete Signature · esta semana.' },
  { icon:'🏢', title:'Negocio local', msg:'activó la Membresía Iguala Visual ayer.' },
  { icon:'💍', title:'Pareja de Taxco', msg:'reservó cobertura de boda para junio.' },
];
(function() {
  let idx = 0;
  function nextToast() {
    const t = TOASTS[idx % TOASTS.length];
    showToast(t.icon, t.title, t.msg, 5000);
    idx++;
    setTimeout(nextToast, 18000);
  }
  if (ENABLE_AUTOMATED_TOASTS) setTimeout(nextToast, 8000);
})();

/* ────────────── EXIT POPUP ────────────── */
let _exitShown = false;
function showExitPopup() {
  if (_exitShown) return;
  _exitShown = true;
  document.getElementById('exit-popup').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeExitPopup() {
  document.getElementById('exit-popup').classList.remove('show');
  document.body.style.overflow = '';
}
document.addEventListener('mouseleave', e => {
  if (e.clientY < 10 && !_exitShown) showExitPopup();
});
// Mobile: mostrar al 80% de scroll
window.addEventListener('scroll', () => {
  if (_exitShown) return;
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (pct > 0.8) showExitPopup();
}, { passive: true });

/* ────────────── AVAILABILITY BAR ────────────── */
(function() {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now = new Date();
  const mes = months[now.getMonth()];
  const el = document.getElementById('avail-month');
  const cnt = document.getElementById('avail-count');
  const fill = document.getElementById('avail-fill');
  if (!el) return;
  el.textContent = mes;
  if (cnt) {
    cnt.textContent = 'Disponibilidad confirmada al momento de cotizar';
    cnt.style.color = 'var(--gold)';
  }
  if (fill) {
    fill.style.width = '0%';
    fill.style.opacity = '.35';
    fill.classList.remove('urgent');
  }
})();

/* ────────────── COUNTER ANIMATION ────────────── */
function animateCounters() {
  document.querySelectorAll('.trust-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '+';
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = prefix + start + (start >= target ? suffix : '');
      if (start >= target) clearInterval(timer);
    }, 30);
  });
}
// Trigger when trust bar enters viewport
(function() {
  const bar = document.querySelector('.trust-bar');
  if (!bar || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(bar);
})();

/* ────────────── LIGHTBOX ────────────── */
const GALLERY_ITEMS = [
  { src:'https://picsum.photos/seed/xv01/800/600',   alt:'XV Años · Cobertura completa',        cat:'eventos'  },
  { src:'https://picsum.photos/seed/ses01/800/600',  alt:'Sesión Premium · Estudio',             cat:'sesiones' },
  { src:'https://picsum.photos/seed/boda01/800/600', alt:'Boda · Paquete Deluxe',                cat:'eventos'  },
  { src:'https://picsum.photos/seed/biz01/800/600',  alt:'Contenido B2B · Membresía',            cat:'negocios' },
  { src:'https://picsum.photos/seed/mat01/800/600',  alt:'Maternidad Esencia · Estudio',         cat:'sesiones' },
  { src:'https://picsum.photos/seed/grad01/800/600', alt:'Graduación · Paquete Graduación',      cat:'eventos'  },
  { src:'https://picsum.photos/seed/prod01/800/600', alt:'Fotografía de Producto · Restaurante', cat:'negocios' },
  { src:'https://picsum.photos/seed/fam01/800/600',  alt:'Sesión Familiar · Exterior',           cat:'sesiones' },
  { src:'https://picsum.photos/seed/baut01/800/600', alt:'Bautizo · Paquete Instantes',          cat:'eventos'  },
  { src:'https://picsum.photos/seed/corp01/800/600', alt:'Retrato Corporativo · Equipo',         cat:'negocios' },
  { src:'https://picsum.photos/seed/par01/800/600',  alt:'Sesión de Pareja · Engagement',        cat:'sesiones' },
  { src:'https://picsum.photos/seed/xv02/800/600',   alt:'XV Años · Paquete Celebrity',          cat:'eventos'  },
];
let _lbIndex = 0;
function openLightbox(idx) {
  _lbIndex = idx;
  renderLightbox();
  document.getElementById('lightbox').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}
function lightboxNav(dir) {
  _lbIndex = (_lbIndex + dir + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  renderLightbox();
}
function renderLightbox() {
  const item = GALLERY_ITEMS[_lbIndex];
  const content = document.getElementById('lightbox-content');
  const counter = document.getElementById('lightbox-counter');
  content.innerHTML = `<img src="${item.src}" alt="${item.alt}" class="lightbox-img">`;
  counter.textContent = `${_lbIndex + 1} / ${GALLERY_ITEMS.length}`;
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});
document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

/* ────────────── COMPARE FLOAT ────────────── */
const _compareSelected = new Map();
function toggleCompareFloat(checkbox) {
  const pkg   = checkbox.dataset.pkg;
  const price = checkbox.dataset.price;
  if (checkbox.checked) {
    if (_compareSelected.size >= 3) { checkbox.checked = false; showToast('⚠️','Máximo 3 paquetes','Desmarca uno para agregar otro.', 3000); return; }
    _compareSelected.set(pkg, price);
  } else {
    _compareSelected.delete(pkg);
  }
  updateCompareFloat();
}
function updateCompareFloat() {
  const floatEl = document.getElementById('compare-float');
  const tagsEl  = document.getElementById('compare-float-pkgs');
  if (_compareSelected.size === 0) { floatEl.classList.remove('show'); return; }
  tagsEl.innerHTML = Array.from(_compareSelected.entries()).map(([name]) =>
    `<span class="compare-float-tag">${name}<button onclick="removeCompareItem('${name}')" aria-label="Quitar ${name}">✕</button></span>`
  ).join('');
  floatEl.classList.add('show');
}
function removeCompareItem(name) {
  _compareSelected.delete(name);
  const cb = document.querySelector(`.pkg-compare-check[data-pkg="${name}"]`);
  if (cb) cb.checked = false;
  updateCompareFloat();
}
function goToComparator() {
  scrollToSection('sec-configuradores');
  setTimeout(() => {
    showCconfig('comparador');
    _compareSelected.forEach((_, name) => {
      const id = 'cpkg-' + name.toLowerCase();
      const el = document.getElementById(id);
      if (el) { el.checked = true; }
    });
    renderComparatorTable();
  }, 600);
}

/* ────────────── QUOTE HISTORY ────────────── */
const MAX_HISTORY = 3;
function saveQuoteToHistory(lines, total, snapshot = getConfigSnapshot()) {
  if (total === 0) return;
  try {
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    const entry = {
      total,
      summary: lines.slice(0,2).map(l => l.n || l[0]).join(' + '),
      snapshot,
      ts: Date.now(),
    };
    const deduped = history.filter(item => !sameConfigSnapshot(item.snapshot, snapshot));
    deduped.unshift(entry);
    localStorage.setItem('quoteHistory', JSON.stringify(deduped.slice(0, MAX_HISTORY)));
    renderQuoteHistory();
  } catch(e) {}
}
function renderQuoteHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    const wrap = document.getElementById('quote-history-wrap');
    const list = document.getElementById('quote-history-list');
    if (!wrap || !list || !history.length) { if(wrap) wrap.style.display='none'; return; }
    wrap.style.display = 'block';
    list.innerHTML = history.map((h, i) =>
      `<div class="quote-history-item" onclick="restoreQuoteHistoryReal(${i})">
        <span class="quote-history-name">${h.summary || 'Configuración guardada'}</span>
        <span class="quote-history-price">${$fmt(h.total)}</span>
      </div>`
    ).join('');
  } catch(e) {}
}
function restoreQuoteHistoryReal(idx) {
  try {
    const history = JSON.parse(localStorage.getItem('quoteHistory') || '[]');
    const entry = history[idx];
    if (!entry || !entry.snapshot) return;
    scrollToConfigurator();
    setTimeout(() => {
      applyConfigSnapshot(entry.snapshot);
      showToast('🕐','Cotización restaurada','Se cargó tu configuración reciente.', 3500);
    }, 150);
  } catch(e) {}
}
function restoreQuoteHistory(idx) {
  return restoreQuoteHistoryReal(idx);
  showToast('🕐','Historial','Abre el configurador para ver tu cotización anterior.', 4000);
}

/* ────────────── COPY REFERRAL LINK ────────────── */
function copyReferralLink(btn) {
  const url = window.location.href.split('?')[0];
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✅ ¡Copiado!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ ¡Copiado!';
    setTimeout(() => { btn.textContent = '🔗 Copiar link'; }, 2000);
  }
}

/* ────────────── SERVICE WORKER ────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
