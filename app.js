(()=>{
const $=s=>document.querySelector(s),show=id=>document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id===id));
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
// --- candado ---
const vals=Array(8).fill(0),strips=[];let k=0,done=false;
[["día",2],["mes",2],["año",4]].forEach(([lab,n])=>{
 const g=document.createElement('div'),row=document.createElement('div');g.className='grp';row.className='row';
 for(let j=0;j<n;j++){const i=k++,w=document.createElement('div');w.className='wheel';
  w.innerHTML=`<button aria-label="subir">▲</button><div class="win" aria-label="${lab}"><div class="strip">${[...Array(10).keys()].map(d=>`<b>${d}</b>`).join('')}</div></div><button aria-label="bajar">▼</button>`;
  const [up,dn]=w.querySelectorAll('button'),win=w.querySelector('.win');strips[i]=w.querySelector('.strip');
  up.onclick=()=>step(i,1);dn.onclick=()=>step(i,-1);
  let y0=null;win.onpointerdown=e=>{y0=e.clientY;win.setPointerCapture(e.pointerId)};
  win.onpointermove=e=>{if(y0==null)return;const d=e.clientY-y0;if(Math.abs(d)>16){step(i,d<0?1:-1);y0=e.clientY}};
  win.onpointerup=()=>y0=null;win.addEventListener('wheel',e=>{e.preventDefault();step(i,e.deltaY<0?1:-1)},{passive:false});
  row.append(w)}
 const s=document.createElement('small');s.textContent=lab;g.append(row,s);$('#plate').append(g)});
function step(i,d){if(done)return;vals[i]=(vals[i]+d+10)%10;strips[i].style.transform=`translateY(${-vals[i]*34}px)`;check()}
async function check(){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(vals.join('')));
 if([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')===HASH){done=true;$('#lock').classList.add('open');setTimeout(()=>{show('cover');type()},calm?200:1500)}}
function type(){const t="Los recuerdos de un loco que te amo",el=$('#title');let i=0;
 const end=()=>$('#openBook').classList.add('on');if(calm){el.textContent=t;return end()}
 const id=setInterval(()=>{el.textContent=t.slice(0,++i);if(i>=t.length){clearInterval(id);end()}},65)}
// --- libro ---
const n=M.length,fmt=d=>new Date(d+'T12:00').toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'});
const eyes='<circle cx="38" cy="52" r="3" fill="#3a1a2a"/><circle cx="62" cy="52" r="3" fill="#3a1a2a"/><path d="M44 60q6 6 12 0" stroke="#3a1a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="30" cy="60" r="4" fill="#ff7fa0" opacity=".55"/><circle cx="70" cy="60" r="4" fill="#ff7fa0" opacity=".55"/>';
const B=['<path d="M50 90C8 62 10 26 34 24c9 0 14 6 16 12 2-6 7-12 16-12 24 2 26 38-16 66z" fill="#f2708f"/>','<path d="M50 8l13 26 28 4-20 20 5 28-26-14-26 14 5-28L9 38l28-4z" fill="#ffd36e"/>','<path d="M26 76a17 17 0 0 1-1-33 24 24 0 0 1 46-5 19 19 0 0 1 4 38z" fill="#bfe3f5"/>','<g fill="#ffb3c7"><circle cx="50" cy="24" r="16"/><circle cx="76" cy="44" r="16"/><circle cx="66" cy="74" r="16"/><circle cx="34" cy="74" r="16"/><circle cx="24" cy="44" r="16"/></g><circle cx="50" cy="52" r="21" fill="#ffe08a"/>','<path d="M64 10a40 40 0 1 0 0 80 32 32 0 0 1 0-80z" fill="#ffe08a"/>'];
const S=k=>`<svg viewBox="0 0 100 100" aria-hidden="true">${B[k]}<g ${k==4?'transform="translate(-16 0)"':''}>${eyes}</g></svg>`;
let cur=0;const isV=f=>/\.mp4$/i.test(f);
function render(dir){let l,r;
 if(cur<n){const [d,f,t]=M[cur],src='media/'+f;
  l=`<figure class="polaroid">${isV(f)?`<video src="${src}" controls playsinline preload="metadata"></video>`:`<img src="${src}" alt="Recuerdo del ${fmt(d)}">`}<figcaption>${fmt(d)}</figcaption></figure>`;
  r=`<div class="sticker">${S(cur%5)}</div><p class="phrase">${t||P[cur%P.length]}</p>`}
 else{l=`<div class="sticker big">${S(0)}</div>`;r=`<p class="phrase">${END}</p>`}
 const b=$('#book');b.className='book turn-'+dir;b.innerHTML=`<section class="page left">${l}</section><section class="page right">${r}</section>`;
 $('#count').textContent=`${Math.min(cur+1,n)} / ${n}`;$('#prev').disabled=cur==0;$('#next').disabled=cur>=n;
 const x=M[cur+1];if(x&&!isV(x[1]))new Image().src='media/'+x[1]}
const go=d=>{cur=Math.max(0,Math.min(n,cur+d));render(d>0?'fw':'bw')};
$('#openBook').onclick=()=>{show('bookscreen');render('fw')};
$('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);
addEventListener('keydown',e=>{if($('#bookscreen').classList.contains('on')){if(e.key=='ArrowRight')go(1);if(e.key=='ArrowLeft')go(-1)}});
let x0=null;const bk=$('#book');bk.onpointerdown=e=>x0=e.target.tagName=='VIDEO'?null:e.clientX;
bk.onpointerup=e=>{if(x0!=null&&Math.abs(e.clientX-x0)>60)go(e.clientX<x0?1:-1);x0=null};
})();
