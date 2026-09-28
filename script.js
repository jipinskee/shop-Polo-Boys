use strict';

const CHECKOUT_LINKS = {
  'mens-black-gold':'https://square.link/u/tZnNjcBh?src=sheet',
  'mens-gray-black':'https://square.link/u/dXkf2kYc?src=sheet',
  'mens-white-gold':'https://square.link/u/gWhD6j90?src=sheet',
  'mens-powder-blue':'https://square.link/u/Uofu7j06?src=sheet',
  'mens-purple-essentials':'https://square.link/u/5Nl3jC8d?src=sheet',
  'mens-deep-red':'https://square.link/u/UsnzmyAR?src=sheet',
  'mens-orange-white':'https://square.link/u/pRvIfUf4?src=sheet',
  'mens-navy-blue':'https://square.link/u/e5cim05z?src=sheet',
  'mens-rare-green':'https://square.link/u/V0oIrCfS?src=sheet',
  'womens-black-gold':'https://square.link/u/CQhCizI8?src=sheet',
  'womens-white-pink':'https://square.link/u/UTFDJSVf?src=sheet',
  'womens-powder-blue':'https://square.link/u/CEDAWvRS?src=sheet',
  'womens-olive-champagne':'https://square.link/u/hzduZPzy?src=sheet',
  'womens-lavender-white':'https://square.link/u/musKHUNK?src=sheet',
  'womens-deep-purple':'https://square.link/u/hLUYylOH?src=sheet',
  'womens-pink-red':'https://square.link/u/psgX1D2q?src=sheet',
  'womens-cream-chocolate':'https://square.link/u/azKqeCuk?src=sheet'
};

const products = [
  ['mens-black-gold',125,"Men's Set",'South Central Black & Gold','assets/products/mens-black-gold.jpg','Black matching hoodie and sweatpants set with gold Polo Boys and South Central detailing.',['mens']],
  ['mens-gray-black',125,"Men's Set",'South Central Gray & Black','assets/products/mens-gray-black.jpg','Gray matching hoodie and sweatpants set with bold contrast graphics.',['mens']],
  ['mens-white-gold',125,"Men's Set",'South Central White & Gold','assets/products/mens-white-gold.jpg','White matching set with premium gold graphics.',['mens']],
  ['mens-powder-blue',125,"Men's Set",'South Central Powder Blue','assets/products/mens-powder-blue.jpg','Powder blue matching set with signature Polo Boys graphics.',['mens']],
  ['mens-purple-essentials',125,"Men's Set",'Purple Essentials','assets/products/mens-purple-essentials.jpg','Deep purple matching set with Polo Boys detailing.',['mens']],
  ['mens-deep-red',125,"Men's Set",'South Central Deep Red','assets/products/mens-deep-red.jpg','Deep red matching set with dimensional graphics.',['mens']],
  ['mens-orange-white',125,"Men's Set",'South Central Orange & White','assets/products/mens-orange-white.jpg','Orange matching set with bright white graphics.',['mens']],
  ['mens-navy-blue',125,"Men's Set",'South Central Navy Blue','assets/products/mens-navy-blue.jpg','Navy blue matching set with crisp Polo Boys graphics and South Central detailing.',['mens']],
  ['mens-rare-green',200,"Rare Men's Set",'Rare Green Splatter','assets/products/mens-rare-green.jpg','Limited green splatter matching set with cream-and-gold graphics and distressed detailing.',['mens','rare']],
  ['womens-black-gold',125,"Women's Set","Women's Black & Gold",'assets/products/womens-black-gold.jpg','Black women’s set with gold detailing.',['womens']],
  ['womens-white-pink',125,"Women's Set","Women's White & Pink",'assets/products/womens-white-pink.jpg','White women’s set with pink detailing.',['womens']],
  ['womens-powder-blue',125,"Women's Set","Women's Powder Blue",'assets/products/womens-powder-blue.jpg','Powder blue women’s set with clean contrast graphics.',['womens']],
  ['womens-olive-champagne',125,"Women's Set","Women's Olive & Champagne",'assets/products/womens-olive-champagne.jpg','Olive women’s set with champagne detailing.',['womens']],
  ['womens-lavender-white',125,"Women's Set","Women's Lavender & White",'assets/products/womens-lavender-white.jpg','Lavender women’s set with white detailing.',['womens']],
  ['womens-deep-purple',125,"Women's Set","Women's Deep Purple & Silver",'assets/products/womens-deep-purple.jpg','Deep purple women’s set with silver detailing.',['womens']],
  ['womens-pink-red',125,"Women's Set","Women's Pink & Red",'assets/products/womens-pink-red.jpg','Pink women’s set with rich red detailing.',['womens']],
  ['womens-cream-chocolate',125,"Women's Set","Women's Cream & Chocolate",'assets/products/womens-cream-chocolate.jpg','Cream women’s set with chocolate-brown detailing.',['womens']]
].map(([id,price,category,name,image,description,tags])=>({id,price,category,name,image,description,tags}));

const $ = id => document.getElementById(id);
let activeProduct = null;
let bag = JSON.parse(localStorage.getItem('polo_boys_bag') || '[]');

function money(n){ return `$${Number(n).toFixed(0)}`; }

function product(id){ return products.find(p=>p.id===id); }

function renderProducts(filter='all'){
  const grid=$('productGrid');
  const list=products.filter(p=>filter==='all'||p.tags.includes(filter));
  grid.innerHTML=list.map(p=>`
    <article class="product-card reveal">
      <button class="product-image" data-view="${p.id}" aria-label="View ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tags.includes('rare')?'<span class="rare-badge">RARE</span>':''}
      </button>
      <div class="product-info">
        <div><span>${p.category}</span><h3>${p.name}</h3></div>
        <strong>${money(p.price)}</strong>
      </div>
      <div class="card-actions">
        <button class="quick-view" data-view="${p.id}">VIEW</button>
        <a href="${CHECKOUT_LINKS[p.id]||'#'}" target="_blank" rel="noreferrer">BUY ↗</a>
      </div>
    </article>
  `).join('');
  observeReveals();
}

function openProduct(id){
  activeProduct=product(id);
  if(!activeProduct)return;
  $('dialogImage').src=activeProduct.image;
  $('dialogImage').alt=activeProduct.name;
  $('dialogTag').textContent=activeProduct.category.toUpperCase();
  $('dialogName').textContent=activeProduct.name;
  $('dialogPrice').textContent=money(activeProduct.price);
  $('dialogDescription').textContent=activeProduct.description;
  $('buyNow').href=CHECKOUT_LINKS[id]||'#';
  $('dialogAdd').disabled=!CHECKOUT_LINKS[id];
  $('productDialog').showModal();
}

function renderBag(){
  $('bagCount').textContent=bag.length;
  $('bagItems').innerHTML=bag.length ? bag.map(id=>{
    const p=product(id);
    return `<div class="bag-item"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><span>${money(p.price)}</span></div><button data-remove="${p.id}">×</button></div>`;
  }).join('') : '<div class="bag-empty"><strong>Your bag is empty.</strong><span>Add a set to keep it here while you browse.</span></div>';
  $('bagItems').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{bag=bag.filter(x=>x!==b.dataset.remove);saveBag();});
}

function saveBag(){localStorage.setItem('polo_boys_bag',JSON.stringify(bag));renderBag();}

function observeReveals(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
  },{threshold:.08});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>io.observe(el));
}

function enterSite(){
  $('enterScreen').classList.add('exit');
  document.body.classList.remove('locked');
  setTimeout(()=>$('enterScreen').style.display='none',900);
}

$('enterButton').onclick=enterSite;
$('productClose').onclick=()=>$('productDialog').close();
$('dialogAdd').onclick=()=>{
  if(!activeProduct)return;
  if(!bag.includes(activeProduct.id))bag.push(activeProduct.id);
  saveBag();
  $('productDialog').close();
  openBag();
};

document.addEventListener('click',e=>{
  const view=e.target.closest('[data-view]');
  if(view)openProduct(view.dataset.view);
});

$('filters').addEventListener('click',e=>{
  const b=e.target.closest('[data-filter]');
  if(!b)return;
  $('filters').querySelectorAll('button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  renderProducts(b.dataset.filter);
});

function openBag(){ $('bagDrawer').classList.add('open'); $('bagBackdrop').classList.add('open'); }
function closeBag(){ $('bagDrawer').classList.remove('open'); $('bagBackdrop').classList.remove('open'); }
$('bagButton').onclick=openBag;
$('bagClose').onclick=closeBag;
$('bagBackdrop').onclick=closeBag;
$('bagShop').onclick=closeBag;

$('menuButton').onclick=()=>{
  $('mobileMenu').hidden=!$('mobileMenu').hidden;
};
document.querySelectorAll('#mobileMenu a').forEach(a=>a.onclick=()=>{$('mobileMenu').hidden=true;});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
  if(a.closest('#mobileMenu'))$('mobileMenu').hidden=true;
}));

$('year').textContent=new Date().getFullYear();
renderProducts();
renderBag();
observeReveals();
document.body.classList.add('locked');
