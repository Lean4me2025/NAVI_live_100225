
// NAVI Shared App Utilities
const qs = (sel,root=document)=>root.querySelector(sel);
const qsa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
const params = new URLSearchParams(location.search);

// Plan handling: 'starter' | 'pro' | 'mastery'
function getPlan(){
  let p = params.get('plan') || localStorage.getItem('naviPlan') || 'starter';
  p = p.toLowerCase();
  if(!['starter','pro','mastery'].includes(p)) p='starter';
  localStorage.setItem('naviPlan', p);
  return p;
}
function setPlan(p){
  localStorage.setItem('naviPlan', p);
  document.dispatchEvent(new CustomEvent('planchange',{detail:p}));
}
function planName(p){ return p==='mastery'?'Mastery':(p==='pro'?'Pro':'Starter'); }

// Nova results handshake
// Expect localStorage.novaResults = JSON.stringify({traits:[], categories:[], roles:[], reflection:"", name:""})
function getNova(){
  try{
    const raw = localStorage.getItem('novaResults');
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}

// Simple storage helpers
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k, fallback){ try{ return JSON.parse(localStorage.getItem(k)) ?? fallback; }catch(e){ return fallback; } }

// Render plan badge globally if element #plan-badge exists
function renderPlanBadge(){
  const el = qs('#plan-badge');
  if(!el) return;
  const p = getPlan();
  el.textContent = 'Plan: ' + planName(p);
  el.className = 'badge';
}

// Navigation helpers
function go(href){ location.href = href; }

document.addEventListener('DOMContentLoaded', renderPlanBadge);
