/* ============================================================
   HORN HUB — ЛОГИКА ПРИЛОЖЕНИЯ
   Этот файл редактировать не нужно.
   Товары  -> catalog.js     Настройки -> config.js
   ============================================================ */

/* telegram */
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
function haptic(type){ try{
  if(!tg) return;
  if(type==='sel') tg.HapticFeedback.selectionChanged();
  else if(type==='ok') tg.HapticFeedback.notificationOccurred('success');
  else if(type==='error') tg.HapticFeedback.notificationOccurred('error');
  else tg.HapticFeedback.impactOccurred(type||'light');
}catch(e){} }

/* ── строим товары из CATALOG (catalog.js) ── */
const slug = n => n.replace(/[^a-zA-Z0-9]/g, '_');
const brandMeta = {};
const products = [];
let __pid = 1;
CATALOG.forEach(b => {
  brandMeta[b.key] = { label: b.label, cat: b.category };
  (b.flavors || []).forEach(f => {
    const isObj   = typeof f === 'object' && f !== null;
    const flavor  = isObj ? (f.flavor || f.name) : f;
    const matchKey= isObj ? f.name : f;                       // что ищем в soldOut
    const name    = isObj ? f.name : `${b.label} – ${f}`;
    const imgFile = isObj && f.image ? f.image : slug(flavor);
    products.push({
      id: __pid++,
      name,
      flavor,
      brand: b.key,
      category: b.category,
      img: `images/${b.imageFolder}/${imgFile}.png`,
      price: b.price,
      newPrice: b.salePrice,
      outOfStock: (b.soldOut || []).includes(matchKey),
    });
  });
});
const discountPct = p => (p.price > p.newPrice ? Math.round((1 - p.newPrice / p.price) * 100) : 0);


/* state */
let lang=localStorage.getItem('lang')||'ru';
let currency=localStorage.getItem('currency')||'PLN';
let cart=JSON.parse(localStorage.getItem('cart')||'[]');
let favorites=JSON.parse(localStorage.getItem('favorites')||'[]');
let orders=JSON.parse(localStorage.getItem('orders')||'[]');
let tgUser=null, lastOrder=null;
let currentCategory='all', currentBrand=null, currentSort='default', searchQuery='', showingFavorites=false, inStockOnly=false, lastOrderText='';
const sortCycle=['default','priceAsc','priceDesc','name'];

const $=id=>document.getElementById(id);
const T=k=>(i18n[lang][k]??k);
const fmt=pln=>Math.round(pln*currencyRates[currency])+' '+currencySymbols[currency];
const getQty=id=>{const it=cart.find(p=>p.id===id);return it?it.qty:0;};

const ICON_HEART='<svg class="ic" viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z"/></svg>';
const ICON_HEART_F='<svg class="ic fill" viewBox="0 0 24 24"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z"/></svg>';
const ICON_PLUS='<svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_MINUS='<svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>';
const ICON_BAG='<svg class="ic" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-12L5 3H2"/></svg>';
const ICON_TRASH='<svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"/></svg>';
const ICON_REFRESH='<svg class="ic" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16m0 5v-5h5"/></svg>';
const CAT_ICONS={
  all:'<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>',
  disposable:'<svg class="ic" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="3.4"/><path d="M10 6h4M12 9v3.5"/><path d="M11 12.5h2l-.5 3h-1l-.5-3Z" class="fill" stroke="none"/></svg>',
  liquid:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3Z"/></svg>',
  cartridge:'<svg class="ic" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2.4"/><path d="M9 3v3h6V3M10 11h4"/></svg>',
};

/* i18n apply */
function applyI18n(){
  document.documentElement.lang=lang;
  $('sortLabel').textContent=T(currentSort==='default'?'sortShort':currentSort);
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=T(el.dataset.i18n));
  renderChips();
  renderTicker();
}
const TICKER_GAP=34;
let tickerX=0, tickerHalf=0, tickerRAF=null, tickerLast=0;
function renderTicker(){
  const track=$('ticker'); if(!track) return;
  const cont=track.parentElement;
  const phrases=(i18n[lang]&&i18n[lang].ticker)||[];
  if(!phrases.length){track.innerHTML='';return;}
  const oneSet=phrases.map(t=>`<span>${t}</span>`).join('');
  track.style.transform='translateX(0)';
  track.innerHTML=oneSet;
  const setW=track.scrollWidth||1;
  const need=(cont.clientWidth||360)+80;
  const reps=Math.max(1,Math.ceil(need/setW));
  const half=oneSet.repeat(reps);
  track.innerHTML=half+half;
  tickerHalf=(track.scrollWidth+TICKER_GAP)/2;
  tickerX=0;
  startTicker();
}
function startTicker(){
  if(tickerRAF){cancelAnimationFrame(tickerRAF);tickerRAF=null;}
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(reduce){const t=$('ticker');if(t)t.style.transform='translateX(0)';return;}
  tickerLast=performance.now();
  const step=now=>{
    const dt=Math.min(now-tickerLast,60);tickerLast=now;
    tickerX-=0.55*dt/16.67;
    if(tickerHalf>0&&-tickerX>=tickerHalf)tickerX+=tickerHalf;
    const t=$('ticker');if(t)t.style.transform='translateX('+tickerX+'px)';
    tickerRAF=requestAnimationFrame(step);
  };
  tickerRAF=requestAnimationFrame(step);
}
function catCount(c){return c==='all'?products.length:products.filter(p=>p.category===c).length;}
function renderChips(){
  const cats=[['all','allProducts'],['disposable','disposable'],['liquid','liquid'],['cartridge','cartridge']];
  $('chips').innerHTML=cats.map(([c,k])=>`<button class="fbtn ${currentCategory===c&&!showingFavorites?'on':''}" onclick="setCategory('${c}')"><span class="fi">${CAT_ICONS[c]}</span>${T(k)}<i class="fcount">${catCount(c)}</i></button>`).join('');
  renderBrandChips();
}
function renderBrandChips(){
  const box=$('brandchips');
  if(currentCategory==='all'||currentCategory==='cartridge'){box.classList.remove('show');box.innerHTML='';return;}
  const list=Object.entries(brandMeta).filter(([k,m])=>m.cat===currentCategory);
  box.innerHTML=list.map(([k,m])=>`<button class="bchip ${currentBrand===k?'on':''}" onclick="setBrand('${k}')">${m.label}</button>`).join('');
  box.classList.add('show');
}

/* list */
function computeList(){
  let list=products.slice();
  if(showingFavorites) list=list.filter(p=>favorites.includes(p.id));
  if(currentCategory!=='all') list=list.filter(p=>p.category===currentCategory);
  if(currentBrand) list=list.filter(p=>p.brand===currentBrand);
  if(inStockOnly) list=list.filter(p=>!p.outOfStock);
  if(searchQuery){const q=searchQuery.toLowerCase();list=list.filter(p=>p.name.toLowerCase().includes(q)||(brandMeta[p.brand]?.label||'').toLowerCase().includes(q));}
  if(currentSort==='priceAsc') list.sort((a,b)=>a.newPrice-b.newPrice);
  else if(currentSort==='priceDesc') list.sort((a,b)=>b.newPrice-a.newPrice);
  else if(currentSort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  list.sort((a,b)=>(a.outOfStock?1:0)-(b.outOfStock?1:0));
  return list;
}

function addControlHTML(p){
  if(p.outOfStock) return `<button class="add off" disabled>${T('outNow')}</button>`;
  const q=getQty(p.id);
  if(q<=0) return `<button class="add" onclick="event.stopPropagation();addToCart(${p.id},this)">${ICON_PLUS}${T('add')}</button>`;
  return `<div class="cstep"><button onclick="event.stopPropagation();decQty(${p.id})">${ICON_MINUS}</button><b>${q}</b><button onclick="event.stopPropagation();incQty(${p.id})">${ICON_PLUS}</button></div>`;
}

let io=null;
function renderProducts(){
  const list=computeList();
  $('cnt2').innerHTML=`${T('found')} <b>${list.length}</b> ${T('items')}`;
  const box=$('grid');
  if(!list.length){
    box.innerHTML=`<div class="empty"><svg class="ic ei" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><h5>${T('emptyProducts')}</h5><p>${T('emptyProductsSub')}</p></div>`;
    return;
  }
  box.innerHTML=list.map((p,idx)=>{
    const fav=favorites.includes(p.id);
    const hasSale=p.price>p.newPrice;
    const pct=discountPct(p);
    return `<article class="card ${p.outOfStock?'oos':''}" style="transition-delay:${Math.min(idx,8)*35}ms">
      <div class="thumb" onclick="openLb('${p.img}')">
        <div class="badges">
          ${hasSale&&!p.outOfStock?`<span class="bdg sale">−${pct}%</span>`:''}
          ${!p.outOfStock&&p.category==='disposable'?`<span class="bdg hit">${T('hit')}</span>`:''}
        </div>
        ${p.outOfStock?`<div class="oosveil"><span>${T('outNow')}</span></div>`:''}
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.opacity=.15">
        <button class="heart ${fav?'on':''}" id="heart-${p.id}" onclick="event.stopPropagation();toggleFav(${p.id})">${fav?ICON_HEART_F:ICON_HEART}</button>
      </div>
      <div class="cbody">
        <div class="cbrand">${brandMeta[p.brand]?.label||p.brand}</div>
        <h4>${p.flavor||p.name}</h4>
        <div class="prow"><span class="pnew">${fmt(p.newPrice)}</span>${hasSale?`<span class="pold">${fmt(p.price)}</span>`:''}</div>
        <div class="addarea" id="add-${p.id}">${addControlHTML(p)}</div>
      </div>
    </article>`;
  }).join('');
  setupReveal();
}
function setupReveal(){
  const cards=document.querySelectorAll('.card');
  if(!('IntersectionObserver' in window)){cards.forEach(c=>c.classList.add('in'));return;}
  if(io) io.disconnect();
  io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -40px 0px'});
  cards.forEach(c=>io.observe(c));
}
function refreshCard(id){
  const p=products.find(x=>x.id===id);
  const a=$('add-'+id); if(a) a.innerHTML=addControlHTML(p);
  const h=$('heart-'+id); if(h){const f=favorites.includes(id);h.className='heart '+(f?'on':'');h.innerHTML=f?ICON_HEART_F:ICON_HEART;}
}

/* filters */
function syncFavBtn(){$('favBtn').classList.toggle('active',showingFavorites);}
function setCategory(c){showingFavorites=false;currentCategory=c;currentBrand=null;syncFavBtn();renderChips();renderProducts();haptic('sel');}
function setBrand(b){currentBrand=currentBrand===b?null:b;renderBrandChips();renderProducts();haptic('sel');}
function cycleSort(){currentSort=sortCycle[(sortCycle.indexOf(currentSort)+1)%sortCycle.length];$('sortLabel').textContent=T(currentSort==='default'?'sortShort':currentSort);renderProducts();haptic('sel');}
function toggleStock(){inStockOnly=!inStockOnly;$('stockToggle').classList.toggle('on',inStockOnly);renderProducts();haptic('sel');}

/* favorites */
function toggleFav(id){
  const i=favorites.indexOf(id);
  if(i>-1){favorites.splice(i,1);showToast('favRem');}else{favorites.push(id);showToast('favAdd');haptic('light');}
  localStorage.setItem('favorites',JSON.stringify(favorites));
  updateBadges();
  if(showingFavorites) renderProducts(); else refreshCard(id);
}
function toggleFavView(){
  showingFavorites=!showingFavorites;
  if(showingFavorites){currentCategory='all';currentBrand=null;searchQuery='';}
  syncFavBtn();
  renderChips();
  renderProducts();scrollToShop();haptic('sel');
}

/* cart */
function addToCart(id,btn){
  const base=products.find(p=>p.id===id);
  if(!base||base.outOfStock) return;
  const ex=cart.find(p=>p.id===id);
  if(ex) ex.qty++; else cart.push({id:base.id,name:base.name,img:base.img,price:base.newPrice,qty:1});
  persist();updateBadges();refreshCard(id);if($('cartSheet').classList.contains('show'))renderCart();
  showToast('added');haptic('light');
  const img=btn?.closest('.card')?.querySelector('.thumb img'); if(img) flyToCart(img);
}
function incQty(id){const it=cart.find(p=>p.id===id);if(it)it.qty++;else addToCart(id);commitCart(id);haptic('light');}
function decQty(id){const idx=cart.findIndex(p=>p.id===id);if(idx<0)return;cart[idx].qty--;if(cart[idx].qty<=0)cart.splice(idx,1);commitCart(id);haptic('light');}
function commitCart(id){persist();updateBadges();refreshCard(id);if($('cartSheet').classList.contains('show'))renderCart();}
function removeItem(i){const id=cart[i].id;cart.splice(i,1);persist();updateBadges();renderCart();refreshCard(id);showToast('removed');haptic('light');}
function persist(){localStorage.setItem('cart',JSON.stringify(cart));}

function renderCart(){
  const box=$('cartItems');
  const qty=cart.reduce((s,p)=>s+p.qty,0);
  $('cartPill').textContent=qty;
  $('checkoutBtn').disabled=!cart.length;
  if(!cart.length){
    box.innerHTML=`<div class="sheet-empty">${ICON_BAG}<h5>${T('emptyCart')}</h5><p>${T('emptyCartSub')}</p></div>`;
    $('cartTotal').textContent=fmt(0);return;
  }
  let total=0;
  box.innerHTML=cart.map((p,i)=>{total+=p.price*p.qty;return `<div class="citem">
    <img src="${p.img}" onerror="this.style.opacity=.2">
    <div class="cinfo"><div class="cn">${p.name}</div><div class="ce">${fmt(p.price)}</div>
      <div class="cfoot">
        <div class="step"><button onclick="changeCartQty(${i},-1)">${ICON_MINUS}</button><b>${p.qty}</b><button onclick="changeCartQty(${i},1)">${ICON_PLUS}</button></div>
        <span class="cline">${fmt(p.price*p.qty)}</span>
        <button class="cdel" onclick="removeItem(${i})">${ICON_TRASH}</button>
      </div></div></div>`;}).join('');
  $('cartTotal').textContent=fmt(total);
}
function changeCartQty(i,d){const id=cart[i].id;cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);persist();updateBadges();renderCart();refreshCard(id);haptic('light');}

function updateBadges(){
  const q=cart.reduce((s,p)=>s+p.qty,0);
  const fc=$('favCnt');fc.textContent=favorites.length;fc.classList.toggle('show',favorites.length>0);
  $('fabQty').textContent=q;
  $('fabLbl').textContent=T('cart');
  $('fabTotal').textContent=fmt(cart.reduce((s,p)=>s+p.price*p.qty,0));
  const showFab=q>0&&!anySheetOpen();
  $('fab').classList.toggle('show',showFab);
  $('fabScrim').classList.toggle('show',showFab);
}

/* sheets */
function anySheetOpen(){return $('cartSheet').classList.contains('show')||$('orderSheet').classList.contains('show')||$('profSheet').classList.contains('show');}
function openCart(){renderCart();$('cartScrim').classList.add('show');$('cartSheet').classList.add('show');$('fab').classList.remove('show');syncBack();haptic('light');}
function closeCart(){$('cartScrim').classList.remove('show');$('cartSheet').classList.remove('show');updateBadges();syncBack();}
function checkout(){
  if(!cart.length)return;
  const id=Date.now().toString().slice(-6);
  const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
  const lines=cart.map(p=>`• ${p.name} × ${p.qty} — ${fmt(p.price*p.qty)}`).join('\n');
  let head=`${T('orderNumber')}: #${id}\n${T('consultant')}: @${ADMIN_NICK}`;
  if(tgUser){
    const nm=[tgUser.first_name,tgUser.last_name].filter(Boolean).join(' ');
    const un=tgUser.username?'@'+tgUser.username:'';
    const buyer=[nm,un].filter(Boolean).join(' ');
    if(buyer) head+=`\n${T('buyer')}: ${buyer}`;
  }
  lastOrderText=`${head}\n\n${lines}\n\n${T('total')}: ${fmt(total)}`;
  lastOrder={id,ts:Date.now(),items:cart.map(p=>({name:p.name,qty:p.qty,price:p.price})),total};
  $('orderText').value=lastOrderText;
  $('orderMeta').innerHTML=`${T('orderNumber')}: <b>#${id}</b>`;
  closeCart();
  $('orderScrim').classList.add('show');$('orderSheet').classList.add('show');syncBack();haptic('ok');
}
function closeOrder(){$('orderScrim').classList.remove('show');$('orderSheet').classList.remove('show');updateBadges();syncBack();}
async function copyAndOpenTelegram(){
  try{await navigator.clipboard.writeText(lastOrderText);showToast('copied');}catch{showToast('copyErr');}
  if(lastOrder&&!orders.some(o=>o.id===lastOrder.id)){orders.unshift(lastOrder);localStorage.setItem('orders',JSON.stringify(orders));}
  if(tg&&tg.openTelegramLink) tg.openTelegramLink(ADMIN_URL); else window.open(ADMIN_URL,'_blank');
}

/* profile + order history */
function openProfile(){renderProfile();$('profScrim').classList.add('show');$('profSheet').classList.add('show');$('fab').classList.remove('show');$('fabScrim').classList.remove('show');syncBack();haptic('light');}
function closeProfile(){$('profScrim').classList.remove('show');$('profSheet').classList.remove('show');updateBadges();syncBack();}
function renderProfile(){
  const name=tgUser?[tgUser.first_name,tgUser.last_name].filter(Boolean).join(' '):T('guest');
  const uname=tgUser&&tgUser.username?'@'+tgUser.username:'';
  const photo=tgUser&&tgUser.photo_url?tgUser.photo_url:'';
  const initials=((name||'HH').trim()[0]||'H').toUpperCase();
  const spent=orders.reduce((s,o)=>s+o.total,0);
  let html=`<div class="prof-top">
    <div class="prof-av" style="${photo?`background-image:url('${photo}')`:''}">${photo?'':initials}</div>
    <div class="prof-id"><div class="prof-name">${name}</div>
    ${uname?`<div class="prof-user">${uname}</div>`:`<div class="prof-hint">${T('connectTg')}</div>`}</div></div>
    <div class="prof-stats">
      <div class="stat"><div class="sv">${orders.length}</div><div class="sl">${T('ordersCount')}</div></div>
      <div class="stat"><div class="sv">${favorites.length}</div><div class="sl">${T('favCount')}</div></div>
      <div class="stat"><div class="sv">${fmt(spent)}</div><div class="sl">${T('spent')}</div></div>
    </div>
    <div class="prof-h">${T('orderHistory')}</div>`;
  if(!orders.length){html+=`<div class="prof-hint">${T('noOrders')}</div>`;}
  else html+=orders.map((o,idx)=>{
    const items=o.items.map(it=>`${it.name} ×${it.qty}`).join(', ');
    const ds=new Date(o.ts).toLocaleDateString();
    return `<div class="ord">
      <div class="ord-top"><span class="ord-id">#${o.id}</span><span class="ord-date">${ds}</span></div>
      <div class="ord-items">${items}</div>
      <div class="ord-foot"><span class="ord-total">${fmt(o.total)}</span>
        <button class="ord-re" onclick="reorder(${idx})">${ICON_REFRESH}${T('reorder')}</button></div>
    </div>`;}).join('');
  $('profBody').innerHTML=html;
}
function reorder(idx){
  const o=orders[idx];if(!o)return;
  let skipped=0;
  o.items.forEach(it=>{
    const p=products.find(x=>x.name===it.name);
    if(p&&!p.outOfStock){const ex=cart.find(c=>c.id===p.id);if(ex)ex.qty+=it.qty;else cart.push({id:p.id,name:p.name,img:p.img,price:p.newPrice,qty:it.qty});}
    else skipped++;
  });
  persist();updateBadges();renderProducts();
  showToast(skipped?'reorderSome':'added');
  closeProfile();openCart();haptic('ok');
}

/* lightbox */
function openLb(src){$('lbImg').src=src;$('lb').classList.add('show');syncBack();}
function closeLb(){$('lb').classList.remove('show');syncBack();}

/* back button */
function syncBack(){
  const open=anySheetOpen()||$('lb').classList.contains('show');
  if(!tg||!tg.BackButton)return;
  try{ open?tg.BackButton.show():tg.BackButton.hide(); }catch(e){}
}
function closeTop(){
  if($('lb').classList.contains('show'))return closeLb();
  if($('profSheet').classList.contains('show'))return closeProfile();
  if($('orderSheet').classList.contains('show'))return closeOrder();
  if($('cartSheet').classList.contains('show'))return closeCart();
}

/* fly */
function flyToCart(img){
  const target=$('fab').classList.contains('show')?$('fab'):$('favCnt');
  const a=img.getBoundingClientRect();
  let bx=window.innerWidth/2, by=window.innerHeight-40;
  if(target){const b=target.getBoundingClientRect();bx=b.left+b.width/2;by=b.top+b.height/2;}
  const clone=document.createElement('img');
  clone.src=img.src;clone.className='fly';
  clone.style.left=a.left+'px';clone.style.top=a.top+'px';clone.style.width=a.width+'px';clone.style.height=a.height+'px';
  document.body.appendChild(clone);
  requestAnimationFrame(()=>{clone.style.transform=`translate(${bx-a.left-a.width/2}px,${by-a.top-a.height/2}px) scale(.1)`;clone.style.opacity='0';});
  setTimeout(()=>clone.remove(),640);
}

/* toast */
let toastTimer;
function showToast(key){const t=$('toast');t.textContent=T(key);t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1700);}

/* lang/currency */
function setLang(l){lang=l;localStorage.setItem('lang',l);$('langSelect').value=l;applyI18n();renderProducts();if($('cartSheet').classList.contains('show'))renderCart();updateBadges();}
function setCurrency(c){currency=c;localStorage.setItem('currency',c);$('curSelect').value=c;renderProducts();if($('cartSheet').classList.contains('show'))renderCart();updateBadges();}

/* nav */
function goHome(){showingFavorites=false;currentCategory='all';currentBrand=null;searchQuery='';syncFavBtn();renderChips();renderProducts();window.scrollTo({top:0,behavior:'smooth'});}
function scrollToShop(){$('controls').scrollIntoView({behavior:'smooth',block:'start'});}

/* age */
function confirmAge(){localStorage.setItem('age_ok','1');$('age').classList.remove('show');haptic('ok');}
function denyAge(){$('ageDeny').style.display='block';haptic('error');setTimeout(()=>{if(tg&&tg.close)tg.close();else location.href='https://www.google.com';},1500);}

/* global */
function setHeadH(){const h=$('header').offsetHeight;document.documentElement.style.setProperty('--head-h',h+'px');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeTop();});
window.addEventListener('scroll',()=>{$('header').classList.toggle('stuck',window.scrollY>8);},{passive:true});
window.addEventListener('resize',()=>{setHeadH();renderTicker();});

window.addEventListener('load',()=>{
  if(tg){
    try{tg.ready();tg.expand();tg.setHeaderColor('#0a0a0d');tg.setBackgroundColor('#0a0a0d');tg.BackButton.onClick(closeTop);}catch(e){}
    try{
      const u=tg.initDataUnsafe&&tg.initDataUnsafe.user;
      if(u){
        tgUser=u;
        if(!localStorage.getItem('lang')&&u.language_code){const lc=(''+u.language_code).slice(0,2);lang=lc==='ru'?'ru':lc==='uk'?'ua':'en';}
        const av=$('acctAvatar');
        if(u.photo_url){av.style.backgroundImage=`url('${u.photo_url}')`;av.textContent='';}
        else av.textContent=((u.first_name||'?').trim()[0]||'?').toUpperCase();
        $('acctBtn').hidden=false;
      }
    }catch(e){}
  }
  $('langSelect').value=lang;$('curSelect').value=currency;
  setHeadH();
  applyI18n();renderProducts();updateBadges();renderCart();
  if(localStorage.getItem('age_ok')!=='1')$('age').classList.add('show');
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(renderTicker);
});
