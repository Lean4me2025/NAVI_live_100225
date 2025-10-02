
// NAVI Shared App Utilities + Plan/Tool nav
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const params=new URLSearchParams(location.search);

function getPlan(){
  let p=params.get('plan')||localStorage.getItem('naviPlan')||'starter';
  p=p.toLowerCase(); if(!['starter','pro','mastery'].includes(p)) p='starter';
  localStorage.setItem('naviPlan',p); return p;
}
function setPlan(p){ localStorage.setItem('naviPlan',p); document.dispatchEvent(new CustomEvent('planchange',{detail:p})); }
function planName(p){ return p==='mastery'?'Mastery':(p==='pro'?'Pro':'Starter'); }

// NOVA results handshake
function getNova(){ try{ const raw=localStorage.getItem('novaResults'); if(!raw) return null; return JSON.parse(raw);}catch(e){return null;} }
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k,f){ try{ return JSON.parse(localStorage.getItem(k)) ?? f; }catch(e){ return f; } }

function renderPlanBadge(){ const el=qs('#plan-badge'); if(!el) return; el.textContent='Plan: '+planName(getPlan()); el.className='badge plan-badge'; }
document.addEventListener('DOMContentLoaded', renderPlanBadge);

// Tool ordering for Prev/Next
const TOOL_ORDER={
  starter:['resume','jobs'],
  pro:['resume','jobs','cover','intel','filters'],
  mastery:['resume','jobs','cover','intel','filters','roadmap','coaching']
};
function toolPath(id){ return `tools/${id}.html`; }
function nextToolId(cur){ const order=TOOL_ORDER[getPlan()]; const i=order.indexOf(cur); return (i>=0 && i<order.length-1)?order[i+1]:null; }
function prevToolId(cur){ const order=TOOL_ORDER[getPlan()]; const i=order.indexOf(cur); return (i>0)?order[i-1]:null; }
function go(href){ location.href=href; }
function goNextFrom(id){ const n=nextToolId(id); if(n) go(toolPath(n)); else go('../dashboard.html'); }
function goPrevFrom(id){ const p=prevToolId(id); if(p) go(toolPath(p)); else go('../dashboard.html'); }
