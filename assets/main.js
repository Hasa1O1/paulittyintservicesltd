const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('.nav'),mb=$('.menu');
mb&&mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
const gal=$('.gallery');
if(gal){
  const dlg=$('dialog'),big=$('img',dlg);
  $$('.filters button').forEach(b=>b.addEventListener('click',()=>{
    $$('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    $$('figure',gal).forEach(f=>f.hidden=b.dataset.f!=='all'&&f.dataset.cat!==b.dataset.f);
  }));
  gal.addEventListener('click',e=>{const i=e.target.closest('button img');if(i){big.src=i.src;big.alt=i.alt;dlg.showModal()}});
  dlg.addEventListener('click',()=>dlg.close());
}
const form=$('#quote');
if(form){form.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form),m=`Hello Paulitty, my name is ${d.get('name')}.\nI need: ${d.get('need')}.\n${d.get('msg')}\nMy phone: ${d.get('phone')}`;
  if(e.submitter.value==='email')location.href=`mailto:Paulitty.inter@gmail.com?subject=${encodeURIComponent('Quote request: '+d.get('need'))}&body=${encodeURIComponent(m)}`;
  else window.open(`https://wa.me/260977133018?text=${encodeURIComponent(m)}`,'_blank','noopener');
})}
