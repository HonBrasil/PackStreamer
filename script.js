const items = window.CATALOG_ITEMS || [];
const config = window.STORE_CONFIG || {};
const state = {kind: 'all', query: '', category: 'all', selected: 'basic'};
const brl = v => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(Number(v || 0));
const cards = document.getElementById('cards');
const modal = document.getElementById('modal');
const styleSelect = document.getElementById('styleSelect');
const colorSelect = document.getElementById('colorSelect');
const alertSelect = document.getElementById('alertSelect');
const alertChoice = document.getElementById('alertChoice');
const alertError = document.getElementById('alertError');
const basicModels = items.filter(p => p.kind === 'basic');
const alertPacks = items.filter(p => p.kind === 'premium');
const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escapeHtml = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

function totalFor(plan) {
  return Number(config.obsSetup ?? 50) + Number(plan === 'basic' ? config.basicAddOn : config.completeAddOn);
}
function render() {
  const list = items.filter(p => {
    if (state.kind !== 'all' && p.kind !== state.kind) return false;
    if (state.category !== 'all' && p.group !== state.category) return false;
    return norm([p.name,p.group,p.colors,p.includes,p.kind].join(' ')).includes(norm(state.query));
  });
  document.getElementById('count').textContent = `${list.length} estilos encontrados`;
  cards.innerHTML = list.map(p => {
    const premium = p.kind === 'premium';
    const plan = premium ? 'complete' : 'basic';
    const tag = premium ? 'ESCOLHA 1 PACK DE ALERTAS • COMPLETO' : 'ESCOLHA 1 MODELO • BASIC OU COMPLETO';
    const buttonText = premium ? 'Escolher este pack de alertas' : 'Escolher este modelo';
    return `<article class="card">
      <div class="thumb">
        <img loading="lazy" decoding="async" draggable="false" src="${escapeHtml(p.preview)}" alt="Montagem com frames reais do pack ${escapeHtml(p.name)}"/>
        <div class="flags"><span class="flag ${premium ? 'premium' : ''}">${tag}</span><span class="flag">${p.animated ? 'ANIMADO' : 'ESTÁTICO'}</span></div>
      </div>
      <div class="card-body">
        <div class="card-head"><h3>${escapeHtml(p.name)}</h3><span class="card-cat">${escapeHtml(p.group)}</span></div>
        <p>${escapeHtml(p.includes)}</p>
        <div class="meta">VARIAÇÕES: ${escapeHtml(p.colors)}</div>
        <button class="btn btn-outline" data-select="${plan}" data-slug="${escapeHtml(p.slug)}">${buttonText}</button>
      </div>
    </article>`;
  }).join('') || '<div class="empty">Nenhum estilo encontrado com esses filtros.</div>';
}

document.querySelectorAll('[data-kind]').forEach(b => b.addEventListener('click', () => {
  state.kind = b.dataset.kind;
  document.querySelectorAll('[data-kind]').forEach(x => x.classList.toggle('active', x === b));
  render();
}));
document.getElementById('search').addEventListener('input', e => { state.query = e.target.value; render(); });
document.getElementById('category').addEventListener('change', e => { state.category = e.target.value; render(); });

function fillStyleOptions() {
  // Os modelos são opções distintas. O Basic NÃO dá acesso à biblioteca inteira.
  styleSelect.innerHTML = `<option value="">Selecione 1 modelo</option>` +
    basicModels.map(p => `<option value="${escapeHtml(p.slug)}">${escapeHtml(p.name)} (${escapeHtml(p.group)})</option>`).join('');
}
function updateColors() {
  const item = basicModels.find(p => p.slug === styleSelect.value);
  const colors = item ? item.colors.split('•').map(x => x.trim()).filter(Boolean) : [];
  colorSelect.innerHTML = `<option value="">Padrão / sem preferência</option>`;
  const choices = [...new Set(colors)].filter(x => norm(x) !== 'padrao' && norm(x) !== 'padrão');
  choices.forEach(color => { const opt = document.createElement('option'); opt.value = color; opt.textContent = color; colorSelect.appendChild(opt); });
  document.getElementById('styleError').hidden = true;
}
function fillAlertOptions() {
  alertSelect.innerHTML = '<option value="">Selecione 1 pack de alertas</option>' +
    alertPacks.map(p => `<option value="${escapeHtml(p.slug)}">${escapeHtml(p.name)} — 11 alertas</option>`).join('');
}
function openModal(plan, slug = '') {
  state.selected = plan === 'complete' ? 'complete' : 'basic';
  const clicked = items.find(x => x.slug === slug);
  const isBasic = state.selected === 'basic';
  fillStyleOptions();
  fillAlertOptions();
  styleSelect.value = clicked?.kind === 'basic' ? clicked.slug : '';
  alertSelect.value = !isBasic && clicked?.kind === 'premium' ? clicked.slug : '';
  updateColors();
  alertChoice.hidden = isBasic;
  alertError.hidden = true;
  document.getElementById('modalTitle').textContent = isBasic
    ? 'Escolha 1 modelo para instalar' : 'Escolha 1 modelo + 1 pack de alertas';
  document.getElementById('selected').textContent = isBasic
    ? 'No Basic você escolhe e recebe apenas 1 modelo; sem alertas.'
    : 'No Completo você escolhe e recebe 1 modelo e 1 pack de alertas premium. Os dois serão instalados no OBS.';
  document.getElementById('obsPrice').textContent = brl(config.obsSetup);
  document.getElementById('addOnLabel').textContent = isBasic ? 'Basic' : 'Completo';
  document.getElementById('addOnPrice').textContent = brl(isBasic ? config.basicAddOn : config.completeAddOn);
  document.getElementById('totalPrice').textContent = brl(totalFor(state.selected));
  document.getElementById('modalScope').textContent = isBasic
    ? 'Entrega e instalação somente do modelo selecionado. Os outros packs e alertas não estão incluídos.'
    : 'Entrega e instalação de 1 modelo selecionado e 1 pack de alertas premium selecionado. Os outros packs não estão incluídos.';
  document.getElementById('styleError').hidden = true;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  if (!styleSelect.value) styleSelect.focus();
  else if (!isBasic && !alertSelect.value) alertSelect.focus();
}
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
function buildMessage() {
  const chosenModel = basicModels.find(x => x.slug === styleSelect.value);
  if (!chosenModel) return null;
  const isBasic = state.selected === 'basic';
  const chosenAlerts = isBasic ? null : alertPacks.find(x => x.slug === alertSelect.value);
  if (!isBasic && !chosenAlerts) return null;
  const planName = isBasic ? 'Pack Basic' : 'Pack Completo';
  const addon = isBasic ? config.basicAddOn : config.completeAddOn;
  return [
    `Olá! Quero contratar a configuração do OBS Studio com o ${planName}.`,
    `Modelo escolhido: ${chosenModel.name}.`,
    colorSelect.value ? `Cor desejada: ${colorSelect.value} (sujeita à disponibilidade).` : '',
    !isBasic ? `Pack de alertas escolhido: ${chosenAlerts.name} (11 tipos).` : '',
    `Configuração OBS: ${brl(config.obsSetup)}. Adicional ${planName}: ${brl(addon)}. Total: ${brl(totalFor(state.selected))}.`,
    isBasic
      ? 'Confirmo que receberei apenas 1 modelo escolhido, instalado no OBS, sem alertas.'
      : 'Confirmo que receberei 1 modelo e 1 pack de alertas escolhidos, ambos instalados no OBS; não receberei todos os packs do catálogo.',
    'Como podemos agendar?'
  ].filter(Boolean).join('\n');
}
function validatedMessage() {
  const modelValid = basicModels.some(x => x.slug === styleSelect.value);
  const alertsValid = state.selected === 'basic' || alertPacks.some(x => x.slug === alertSelect.value);
  document.getElementById('styleError').hidden = modelValid;
  alertError.hidden = alertsValid;
  if (!modelValid) { styleSelect.focus(); return null; }
  if (!alertsValid) { alertSelect.focus(); return null; }
  return buildMessage();
}
async function copyMessage() {
  const msg = validatedMessage(); if (!msg) return;
  try {
    await navigator.clipboard.writeText(msg);
    alert('Pedido copiado. Agora cole no WhatsApp do vendedor.');
  } catch (e) { window.prompt('Copie seu pedido:', msg); }
}
cards.addEventListener('click', e => {
  const b = e.target.closest('[data-select]');
  if (b) openModal(b.dataset.select, b.dataset.slug || '');
});
document.querySelectorAll('.buy').forEach(b => b.addEventListener('click', () => openModal(b.dataset.plan)));
styleSelect.addEventListener('change', updateColors);
alertSelect.addEventListener('change', () => { alertError.hidden = true; });
document.getElementById('close').addEventListener('click', closeModal);
modal.addEventListener('click', e => {if(e.target === modal) closeModal();});
document.addEventListener('keydown', e => {if(e.key === 'Escape') closeModal();});
document.getElementById('copy').addEventListener('click', copyMessage);
document.getElementById('send').addEventListener('click', () => {
  const msg = validatedMessage(); if(!msg) return;
  const num = String(config.whatsappNumber || '').replace(/\D/g, '');
  if(num.length >= 12) {
    window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  } else { copyMessage(); }
});
render();
