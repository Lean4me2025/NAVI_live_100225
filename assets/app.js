
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


// ------- Tool navigation helpers -------
const TOOL_ORDER = {
  starter: ['resume','jobs'],
  pro:     ['resume','jobs','cover','intel','filters'],
  mastery: ['resume','jobs','cover','intel','filters','roadmap','coaching']
};
function toolPath(id){ return `tools/${id}.html`; }
function nextToolId(currentId){
  const tier = getPlan();
  const order = TOOL_ORDER[tier];
  const idx = order.indexOf(currentId);
  if(idx>=0 && idx<order.length-1) return order[idx+1];
  return null;
}
function prevToolId(currentId){
  const tier = getPlan();
  const order = TOOL_ORDER[tier];
  const idx = order.indexOf(currentId);
  if(idx>0) return order[idx-1];
  return null;
}
function goNextFrom(currentId){
  const nxt = nextToolId(currentId);
  if(nxt) go(toolPath(nxt)); else go('../dashboard.html');
}
function goPrevFrom(currentId){
  const prv = prevToolId(currentId);
  if(prv) go(toolPath(prv)); else go('../dashboard.html');
}
