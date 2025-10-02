
// Nova v8.2 App JS
const STORAGE_KEYS = {
  CATEGORIES: 'nova.categories.selected',
  TRAITS: 'nova.traits.selected',
  FAMILY: 'nova.family.pass'
};

const FAMILY_PINS = ['FAMILY2025','NOVA-FAMILY','DREW-CLARA'];

function saveSelectedCategories(ids){ localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(ids)); }
function loadSelectedCategories(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || []; } catch(e){ return []; } }

function saveSelectedTraits(ids){ localStorage.setItem(STORAGE_KEYS.TRAITS, JSON.stringify(ids)); }
function loadSelectedTraits(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRAITS)) || []; } catch(e){ return []; } }

function setFamilyPass(pin){
  if(FAMILY_PINS.includes(pin.trim())){
    localStorage.setItem(STORAGE_KEYS.FAMILY, '1');
    return true;
  }
  return false;
}
function hasFamilyPass(){ return localStorage.getItem(STORAGE_KEYS.FAMILY) === '1'; }

async function fetchJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Failed to load '+path);
  return await res.json();
}

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return [...document.querySelectorAll(sel)]; }

function navigate(url){ window.location.href = url; }

// Page initializers
async function initWelcome(){
  const startBtn = qs('#start');
  if(!startBtn) return;
  startBtn.addEventListener('click', () => navigate('categories.html'));
}

async function initCategories(){
  const container = qs('#category-grid');
  const nextBtn = qs('#to-traits');
  const resetBtn = qs('#reset');
  const cats = await fetchJSON('assets/data/categories.json');
  const selected = new Set(loadSelectedCategories());

  cats.forEach(c => {
    const el = document.createElement('button');
    el.className = 'pill'+(selected.has(c.id)?' selected':'');
    el.innerHTML = `<input type="checkbox" ${selected.has(c.id)?'checked':''} data-id="${c.id}"><span>${c.name}</span>`;
    el.addEventListener('click', (e) => {
      const id = c.id;
      if(selected.has(id)) selected.delete(id); else selected.add(id);
      el.classList.toggle('selected');
      saveSelectedCategories([...selected]);
    });
    container.appendChild(el);
  });

  nextBtn.addEventListener('click', () => {
    if(selected.size === 0){
      alert('Please select at least one category to continue.');
      return;
    }
    navigate('traits.html');
  });

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRAITS);
    qsa('.pill.selected').forEach(p=>p.classList.remove('selected'));
  });
}

async function initTraits(){
  const list = qs('#trait-grid');
  const nextBtn = qs('#to-plan');
  const limit = 12;
  const selectedCats = new Set(loadSelectedCategories());
  if(selectedCats.size === 0){ navigate('categories.html'); return; }

  const allTraits = await fetchJSON('assets/data/traits.json');
  const traits = allTraits.filter(t => t.categories.some(c=>selectedCats.has(c)));

  const selected = new Set(loadSelectedTraits());

  traits.forEach(t => {
    const el = document.createElement('button');
    el.className = 'pill'+(selected.has(t.id)?' selected':'');
    el.innerHTML = `<input type="checkbox" ${selected.has(t.id)?'checked':''} data-id="${t.id}"><span>${t.label}</span>`;
    el.addEventListener('click', () => {
      if(!selected.has(t.id) && selected.size >= limit){
        alert(`You can choose up to ${limit} traits for your profile.`);
        return;
      }
      if(selected.has(t.id)) selected.delete(t.id); else selected.add(t.id);
      el.classList.toggle('selected');
      saveSelectedTraits([...selected]);
      qs('#trait-count').textContent = selected.size;
    });
    list.appendChild(el);
  });

  qs('#trait-count').textContent = selected.size;

  nextBtn.addEventListener('click', () => {
    if(selected.size < 6){
      if(!confirm('Fewer than 6 traits selected. Continue anyway?')) return;
    }
    navigate('plan.html');
  });
}

async function initPlan(){
  const plansWrap = qs('#plans');
  const badge = qs('#family-badge');
  const pinForm = qs('#pin-form');
  const pinInput = qs('#pin');
  const pinBtn = qs('#pin-btn');

  if(hasFamilyPass()){
    badge.classList.remove('hidden');
  }

  pinBtn.addEventListener('click', () => {
    const ok = setFamilyPass(pinInput.value || '');
    if(ok){
      badge.classList.remove('hidden');
      alert('Family access granted. You can proceed without payment.');
    }else{
      alert('PIN not recognized.');
    }
  });

  const plans = await fetchJSON('assets/data/plans.json');

  plans.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    const feats = p.features.map(f=>`<li>${f}</li>`).join('');
    const payhipButton = p.payhip ? `<a href="https://payhip.com/b/${p.payhip}" class="payhip-buy-button" data-theme="green" data-product="${p.payhip}">Buy Now</a>` : '';
    const proceed = `<button class="btn primary" data-plan="${p.id}">Start ${p.name}${hasFamilyPass()?' (Family Pass)':''}</button>`;

    card.innerHTML = `
      <div class="title">${p.name} <span class="small">— ${p.price}</span></div>
      <ul class="list">${feats}</ul>
      <div style="display:flex; gap:12px; align-items:center; margin-top:12px;">
        ${payhipButton}
        ${proceed}
      </div>
    `;
    plansWrap.appendChild(card);
  });

  plansWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-plan]');
    if(!btn) return;
    const planId = btn.getAttribute('data-plan');
    if(hasFamilyPass()){
      alert(`Proceeding to Navi with ${planId} via Family Pass.`);
      // In production this would deep-link to Navi subdomain
      window.location.href = 'https://navi.meetnovanow.com/'; // placeholder link to subdomain
    }else{
      alert('Please complete the Payhip purchase to proceed, or enter family PIN.');
    }
  });

  // Load Payhip script
  const s = document.createElement('script');
  s.setAttribute('src', 'https://payhip.com/payhip.js');
  s.setAttribute('type', 'text/javascript');
  document.body.appendChild(s);
}

// Router by filename
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.getAttribute('data-page') || '';
  if(page==='welcome') initWelcome();
  if(page==='categories') initCategories();
  if(page==='traits') initTraits();
  if(page==='plan') initPlan();
});
