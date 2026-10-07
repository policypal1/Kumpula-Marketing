const header=document.getElementById('navbar');
const menuButton=document.querySelector('.hamburger');
const mobileMenu=document.querySelector('.mobile-menu');

function updateHeader(){if(header)header.classList.toggle('scrolled',window.scrollY>20)}
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

if(menuButton&&mobileMenu){
  menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.classList.toggle('active',open);menuButton.setAttribute('aria-expanded',String(open))});
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuButton.classList.remove('active');menuButton.setAttribute('aria-expanded','false')}));
}

const items=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}}),{threshold:.08});
  items.forEach(item=>observer.observe(item));
}else{items.forEach(item=>item.classList.add('visible'))}

const form=document.getElementById('leadForm');
const status=document.getElementById('formStatus');
const endpoint='https://script.google.com/macros/s/AKfycbxspFvSuybmxFstfic3UUuv-tEsEEpHz383NtCse7B4TQIKEjksaNx-MHmmNb-3pO2hSg/exec';
function showStatus(message,type){if(!status)return;status.textContent=message;status.className=`form-status show ${type}`}

if(form){form.addEventListener('submit',async e=>{
  e.preventDefault();
  const button=form.querySelector('button[type="submit"]');
  const data=Object.fromEntries(new FormData(form).entries());
  const payload={
    name:data.name||'',business:data.business||'',email:data.email||'',phone:data.phone||'',
    businessType:data.service||'',growthGoal:'Get more customers',websiteScope:'',package:'Kumpula Marketing Lead',
    goals:data.service||'',notes:`[Simplified Website Lead] Wants more customers for: ${data.service||'Not provided'}`,
    source:'simplified-kumpula-marketing-homepage',timestamp:new Date().toISOString()
  };
  button.disabled=true;button.textContent='Sending...';showStatus('Sending your request...','success');
  try{
    await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    form.reset();showStatus('Sent. I’ll reach out directly.','success');button.textContent='Request sent ✓';
    setTimeout(()=>{button.disabled=false;button.innerHTML='Send request <span>→</span>'},2500);
  }catch(err){showStatus('Something went wrong. Please text (503) 569-4291.','error');button.disabled=false;button.innerHTML='Try again <span>→</span>'}
})}
