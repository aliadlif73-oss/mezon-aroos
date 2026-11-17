
// Home page: a sales page for boutique owners (the buyers); brides only reach it through the owners' own links. Self-contained (inline CSS/JS, own-origin assets only).
import {baseCSS,brandImg} from './design.js';
import {freshCSS,freshJS} from './ayneh-theme.js';
export const BOT_URL='https://t.me/mezon_aynehbot';
const css=String.raw`
body{overflow-x:hidden}
.top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 0}
.top .brand{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-family:var(--display);font-size:18px;color:var(--ink)}
.top .brand img{display:block;flex:none}
.top .btn{min-height:48px}
footer a{display:inline-flex;align-items:center;min-height:44px;padding:0 8px}
section{padding:34px 0}
.eyebrow{display:inline-block;font-size:12.5px;font-weight:700;color:var(--accent-ink);background:var(--accent-soft);padding:3px 12px;border-radius:var(--pill);margin-bottom:12px}
h1.display{font-size:clamp(30px,8.4vw,52px);line-height:1.3}
h2.display{font-size:clamp(24px,6.4vw,36px);margin-bottom:6px;line-height:1.4}
.sub-l{font-size:16px;line-height:1.9;color:var(--ink-2);margin-top:8px;max-width:30em}
.ic{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
/* hero */
.hero{display:grid;gap:30px;padding-top:10px}
.hero__cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.hero__cta .btn{min-height:54px;font-size:16px;padding-inline:26px}
.hero__cta .btn--primary{flex:1 1 220px}.hero__cta .btn--ghost{flex:1 1 140px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0;padding:0;list-style:none}
.chips li{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:var(--accent-ink);background:var(--surface);padding:7px 13px;border-radius:var(--pill);box-shadow:var(--lift)}
.chips .ic{width:17px;height:17px}
.stage{position:relative;width:min(100%,430px);margin-inline:auto;padding:0 0 14px}
.dev{position:relative;background:#16191a;border-radius:22px;padding:12px;box-shadow:0 26px 50px -18px rgba(10,30,30,.55),inset 0 0 0 1.5px rgba(255,255,255,.07)}
.dev::after{content:"";position:absolute;left:50%;top:5px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#2c3335}
.dev .cmp{border-radius:12px}
.dev__stand{width:34%;height:46px;margin:-1px auto 0;background:linear-gradient(180deg,#262b2c,#141718);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.dev__base{width:62%;height:9px;margin:0 auto;border-radius:99px;background:#1b1f20;box-shadow:0 10px 20px rgba(10,30,30,.3)}
.float{position:absolute;z-index:3;display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:99px;padding:8px 14px;font-size:13px;font-weight:800;color:var(--ink);box-shadow:0 10px 24px -8px rgba(10,30,30,.35)}
.float .ic{width:18px;height:18px;color:var(--accent)}
.float--a{top:12%;inset-inline-end:-6px}.float--b{bottom:20%;inset-inline-start:-6px}
.cmp{position:relative;aspect-ratio:3/5;overflow:hidden;background:var(--glass-2);direction:ltr;touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:ew-resize;--x:50%}
.cmp img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.cmp__after{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.cmp__line{position:absolute;top:0;bottom:0;left:var(--x);width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.3);pointer-events:none}
.cmp__grip{position:absolute;top:60%;left:var(--x);width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:var(--lift);pointer-events:none;color:var(--ink)}
.cmp__grip svg{width:22px;height:22px}
.cmp__tag{position:absolute;bottom:26%;z-index:2;background:rgba(250,251,250,.94);padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:var(--ink-2);pointer-events:none}
.cmp__tag--b{right:14px}.cmp__tag--a{left:14px}
.cmp__range{position:absolute;inset:0;width:100%;height:100%;opacity:0;margin:0;cursor:ew-resize}
.cmp:focus-within{outline:3px solid var(--accent-ring);outline-offset:3px}
.cap{text-align:center;font-size:13px;color:var(--muted);margin-top:10px}
/* where it lives */
.where{display:grid;gap:12px;margin-top:20px}
.spot{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--lift);overflow:hidden}
.spot svg.art{display:block;width:100%;height:auto;background:linear-gradient(160deg,var(--accent-soft),var(--surface-2))}
.spot div{padding:14px 16px 16px}
.spot b{display:block;font-size:17px;margin-bottom:2px}
.spot span{color:var(--ink-2);font-size:14.5px}
/* feelings */
.feel{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
.feel div{padding:18px 14px;border-radius:var(--r-lg);background:var(--ink);color:#fff;text-align:center;display:grid;gap:8px;justify-items:center}
.feel div:nth-child(2),.feel div:nth-child(3){background:var(--accent)}
.feel .ic{width:34px;height:34px;color:#f3e3bd}
.feel b{font-size:19px;font-family:var(--display)}
.feel span{font-size:13.5px;color:rgba(255,255,255,.86);line-height:1.8}
/* why it pays */
.why{display:grid;gap:10px;margin-top:20px}
.why div{display:flex;gap:14px;align-items:center;padding:14px 16px;border-radius:var(--r);background:var(--surface);box-shadow:var(--lift)}
.why .ic{width:40px;height:40px;padding:9px;border-radius:12px;background:var(--accent-soft);color:var(--accent-ink);box-sizing:border-box}
.why b{display:block;font-size:16px}.why span{color:var(--ink-2);font-size:14px}
/* journey */
.path{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:22px 0 0;padding:0;list-style:none;position:relative}
.path li{display:grid;justify-items:center;gap:8px;text-align:center;font-size:13px;font-weight:700;position:relative}
.path .ic{width:52px;height:52px;padding:13px;border-radius:50%;background:var(--surface);box-shadow:var(--lift);color:var(--accent);box-sizing:border-box}
.path li:not(:last-child)::after{content:"";position:absolute;top:26px;inset-inline-end:-50%;width:100%;border-top:2px dashed var(--accent-ring);z-index:-1}
/* setup */
.set{display:grid;gap:10px;margin:20px 0 0;padding:0;list-style:none;counter-reset:s}
.set li{display:flex;gap:14px;align-items:center;padding:14px 16px;background:var(--surface);border-radius:var(--r);box-shadow:var(--lift);font-weight:600}
.set li::before{counter-increment:s;content:counter(s,persian);flex:none;width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:800}
/* trust strip */
.safe{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.safe span{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:99px;background:var(--surface-2);border:1px solid var(--line-2);font-size:14px;font-weight:600;color:var(--ink-2)}
.safe .ic{width:20px;height:20px;color:var(--accent)}
.plan{padding:24px 20px;border-radius:var(--r-lg);background:var(--surface);box-shadow:var(--lift);border:1.5px solid var(--accent)}
.plan h3{font-size:20px;margin-bottom:10px}
.plan ul{margin:0 0 16px;padding:0;list-style:none;display:grid;gap:8px}
.plan li{display:flex;gap:10px;align-items:flex-start;color:var(--ink-2);font-size:15px}
.plan li::before{content:"✓";flex:none;color:var(--accent);font-weight:800}
.plan .btn{min-height:54px;font-size:16px;width:100%}
.plan small{display:block;margin-top:10px;color:var(--muted);line-height:1.8}
details{background:var(--surface);border-radius:var(--r-sm);padding:0 16px;margin-top:10px;box-shadow:var(--lift)}
summary{cursor:pointer;min-height:52px;display:flex;align-items:center;font-weight:700;list-style:none}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";margin-inline-start:auto;font-size:22px;color:var(--accent)}
details[open] summary::after{content:"−"}
details p{padding:0 0 16px;color:var(--ink-2)}
.final{background:var(--ink);color:#fff;border-radius:var(--r-lg);padding:34px 22px;text-align:center}
.final h2{color:#fff}.final p{color:rgba(255,255,255,.86);margin:10px auto 20px;max-width:30em;line-height:1.9}
.final .btn--primary{background:#fff;color:var(--ink);min-height:54px;font-size:16px;padding-inline:30px}
.final .btn--primary:hover{background:var(--accent-soft)}
.final__alt{margin-top:14px;font-size:14px}.final__alt a{color:#fff;text-decoration:underline;display:inline-flex;align-items:center;min-height:44px}
footer{padding:28px 0 48px;color:var(--muted);font-size:13px;display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;justify-content:space-between;border-top:1px solid var(--line)}
footer a{color:var(--accent-ink);font-weight:600;text-decoration:underline}
@media(min-width:820px){
 section{padding:56px 0}
 .hero{grid-template-columns:1.05fr .95fr;align-items:center;gap:56px;padding-top:28px}
 .where{grid-template-columns:repeat(3,1fr)}
 .feel{grid-template-columns:repeat(4,1fr)}
 .why{grid-template-columns:repeat(2,1fr)}
 .plan{padding:32px;display:grid;grid-template-columns:1.2fr 1fr;gap:28px;align-items:center}
 .final{padding:56px 40px}
 .path .ic{width:64px;height:64px;padding:16px}.path li{font-size:15px}.path li:not(:last-child)::after{top:32px}
}
`;
const grip='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8 5 12l4 4M15 8l4 4-4 4"/></svg>';
const js=String.raw`(function(){var c=document.getElementById('cmp'),r=document.getElementById('cmpr');if(!c||!r)return;function set(v){c.style.setProperty('--x',v+'%')}
r.addEventListener('input',function(){set(r.value)});
var d=false;function mv(e){var b=c.getBoundingClientRect();var v=Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100));r.value=v;set(v)}
c.addEventListener('pointerdown',function(e){d=true;mv(e)});c.addEventListener('pointermove',function(e){if(d)mv(e)});
['pointerup','pointercancel','pointerleave'].forEach(function(n){c.addEventListener(n,function(){d=false})});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var t=0,i=setInterval(function(){t+=1;if(t>40||d){clearInterval(i);return}var v=50+Math.sin(t/40*Math.PI*2)*18;r.value=v;set(v)},40);r.addEventListener('input',function(){clearInterval(i)})}})();`;
const P={tv:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',tablet:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M11 18.5h2"/>',heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.4 2.7-5.5 6-5.5s6 2.1 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14.4c2.4 0 4 1.6 4 4.1"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',camera:'<path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.4"/>',dress:'<path d="M9 3l3 3 3-3 1 6-2 3 3 9H7l3-9-2-3z"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',chart:'<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',eye:'<path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',shield:'<path d="M12 3l8 3v6c0 4.6-3.2 7.8-8 9-4.8-1.2-8-4.4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14.5c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4M9 9.5h.01M15 9.5h.01"/>',wifi:'<path d="M3 9a14 14 0 0 1 18 0M6 12.5a9.5 9.5 0 0 1 12 0M9.3 16a5 5 0 0 1 5.4 0M12 19.5h.01"/>'};
const ic=n=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+P[n]+'</svg>';
const art={
 tv:'<svg class="art" viewBox="0 0 320 170" aria-hidden="true"><rect x="40" y="18" width="240" height="124" rx="10" fill="#16191a"/><rect x="48" y="26" width="224" height="108" rx="5" fill="#e9efec"/><rect x="132" y="34" width="56" height="92" rx="28" fill="#d9c9a4"/><path d="M146 126l14-44 14 44z" fill="#fff"/><rect x="146" y="142" width="28" height="10" fill="#2b3234"/><rect x="118" y="150" width="84" height="6" rx="3" fill="#2b3234"/></svg>',
 stand:'<svg class="art" viewBox="0 0 320 170" aria-hidden="true"><rect x="120" y="10" width="80" height="128" rx="9" fill="#16191a"/><rect x="126" y="17" width="68" height="114" rx="5" fill="#e9efec"/><rect x="146" y="30" width="28" height="68" rx="14" fill="#d9c9a4"/><path d="M152 100l8-26 8 26z" fill="#fff"/><rect x="154" y="138" width="12" height="16" fill="#2b3234"/><rect x="128" y="152" width="64" height="8" rx="4" fill="#2b3234"/><path d="M60 156h40M220 156h40" stroke="#c8d1ce" stroke-width="3" stroke-linecap="round"/></svg>',
 tablet:'<svg class="art" viewBox="0 0 320 170" aria-hidden="true"><rect x="30" y="118" width="260" height="36" rx="6" fill="#c8b48a"/><rect x="104" y="34" width="112" height="86" rx="9" fill="#16191a" transform="rotate(-6 160 77)"/><rect x="110" y="40" width="100" height="74" rx="4" fill="#e9efec" transform="rotate(-6 160 77)"/><rect x="144" y="50" width="26" height="56" rx="13" fill="#d9c9a4" transform="rotate(-6 160 77)"/><circle cx="244" cy="104" r="9" fill="#2b3234"/><rect x="236" y="112" width="16" height="8" fill="#2b3234"/></svg>'
};
const faq=[
 ['برای استفاده از آینه در مزون چه چیزی لازم است؟','آینه متناسب با فضای مزون و دستگاه انتخابی راه‌اندازی می‌شود. تیم آینه روش استفاده و تجهیزات مناسب را در تماس توضیح می‌دهد.'],
 ['لباس‌های مزون را چطور وارد می‌کنم؟','پس از هماهنگی و راه‌اندازی، عکس لباس‌های مزون وارد کاتالوگ اختصاصی شما می‌شود. عکس‌های واضح از جلو، پشت و جزئیات برای نتیجه بهتر توصیه می‌شوند.'],
 ['مشتری فقط لباس‌های مزون من را می‌بیند؟','بله. فقط لباس‌هایی که شما اضافه کرده‌اید نمایش داده می‌شود و مشتری روی همان‌ها خودش را می‌بیند.'],
 ['با عکس مشتری‌ها چه می‌شود؟','عکس‌هایی که برای درخواست فرستاده نمی‌شوند ۱۵ دقیقه بعد خودکار پاک می‌شوند و مشتری می‌تواند همان لحظه خودش هم پاکشان کند. عکس مشتری جایی نمایش عمومی ندارد.'],
 ['لباس در نتیجه دقیقاً همان لباس است؟','هدف همین است: لباس شما روی عکس مشتری نشانده می‌شود و چهره و اندامش حفظ می‌شود. نتیجه یک شبیه‌سازی برای تصمیم‌گیری اولیه است و رنگ، پارچه و دوخت نهایی را با پرو حضوری تأیید می‌کنید.'],
 ['اگر مشتری علاقه‌مند شد چه؟','مشتری می‌تواند درخواستش را با نام و شماره ثبت کند و در ربات تلگرام و پنل مزون به شما می‌رسد. بعد از پیگیری، وضعیتش را ثبت می‌کنید.'],
 ['آزمایش سه‌روزه چطور فعال می‌شود؟','نام مزون، شهر و شماره موبایل را ثبت کنید تا تیم آینه برای هماهنگی فعال‌سازی تماس بگیرد. بازه ۷۲ساعته از تولید اولین تصویر آغاز می‌شود.'],['چطور اطلاعات پلن‌ها را دریافت کنم؟','شماره موبایل، نام مزون و شهر را ثبت کنید تا تیم آینه پلن‌های متناسب با مزون را معرفی کند.']
];
const title='آینه هوشمند | تجربه تخصصی انتخاب لباس عروس برای مزون‌ها';
const desc='آینه هوشمند به عروس کمک می‌کند مدل‌های مزون را روی تصویر خودش ببیند، مقایسه کند و برای پرو نهایی تصمیم بگیرد.';
const ogImg='/og.jpg';
const ld=o=>'<script type="application/ld+json">'+JSON.stringify(o).replace(/</g,'\\u003c')+'</script>';
const jsonld=o=>ld({'@context':'https://schema.org','@graph':[
 {'@type':'Organization','@id':o+'/#org','name':'مزون آینه','alternateName':'Mezon Aynehe','url':o+'/','logo':o+'/icon-512.png','sameAs':[BOT_URL]},
 {'@type':'WebSite','@id':o+'/#site','url':o+'/','name':'مزون آینه','inLanguage':'fa-IR','publisher':{'@id':o+'/#org'}},
 {'@type':'SoftwareApplication','name':'مزون آینه','applicationCategory':'BusinessApplication','operatingSystem':'Web (موبایل و دسکتاپ)','inLanguage':'fa-IR','url':o+'/','description':desc,'image':o+ogImg,'publisher':{'@id':o+'/#org'}},
 {'@type':'FAQPage','inLanguage':'fa-IR','mainEntity':faq.map(([q,a])=>({'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}}))}
]});

const demoForm = `<form class="demo-form" aria-label="درخواست آزمایش یا دمو"><div class="lead-mode" role="group" aria-label="نوع درخواست"><button class="lead-mode__btn is-active" type="button" data-lead-mode="trial" aria-pressed="true">آزمایش ۳روزه</button><button class="lead-mode__btn" type="button" data-lead-mode="demo" aria-pressed="false">معرفی اختصاصی</button></div>
<label>نام مزون یا مجموعه<input name="salon" required minlength="2" maxlength="80" autocomplete="organization" placeholder="نام مزون"></label>
<label>شهر<input name="city" required minlength="2" maxlength="40" autocomplete="address-level2" placeholder="نام شهر"></label>
<label>شماره موبایل<input name="phone" required type="tel" inputmode="tel" maxlength="20" autocomplete="tel" dir="ltr" placeholder="09xxxxxxxxx"></label>
<input name="chosen" type="hidden" value="درخواست آزمایش رایگان ۳روزه"><input name="website" type="text" hidden autocomplete="off" tabindex="-1">
<p class="demo-privacy">با ثبت درخواست، با تماس تیم آینه برای هماهنگی خدمات موافقت می‌کنید. فعال‌سازی پس از هماهنگی انجام می‌شود.</p>
<button class="btn btn--primary" type="submit">ثبت درخواست آزمایش ۳روزه ←</button>
<p role="status" aria-live="polite" hidden></p>
</form><script>(function(){
 const form=document.querySelector('.demo-form'),btn=form.querySelector('button'),status=form.querySelector('[role=status]');
 form.addEventListener('submit',async function(e){e.preventDefault();btn.disabled=true;status.hidden=true;
  const body=Object.fromEntries(new FormData(form));body.consent=true;
  try{const r=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok||!j.ok)throw new Error(j.error||'درخواست ثبت نشد');form.reset();status.textContent='درخواست ثبت شد؛ تیم آینه با شما تماس می‌گیرد.';var done=document.getElementById('lead-done');if(done){form.hidden=true;done.hidden=false;}status.dataset.state='ok';}
  catch(e){status.textContent=e.message||'خطا در ارسال درخواست';status.dataset.state='error';}
  finally{status.hidden=false;btn.disabled=false;}
 });
})();</script>`;

const premiumLandingCSS=String.raw`
/* v2 editorial homepage: motion, devices, privacy, corporate identity */
.premium-landing .hero-film__video{position:absolute;z-index:1;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;background:#281e18}
.premium-landing .hero-film__caption-before,.premium-landing .hero-film__caption-after{animation-duration:8.4s}
.premium-landing .hero-film__after{animation-duration:8.4s}
@keyframes ayneh-reveal{0%,30%{opacity:0}37%,64%{opacity:1}73%,100%{opacity:0}}
@keyframes ayneh-before{0%,30%{opacity:1}37%,64%{opacity:0}73%,100%{opacity:1}}
@keyframes ayneh-after{0%,30%{opacity:0}37%,64%{opacity:1}73%,100%{opacity:0}}

.premium-landing .top{min-height:78px}
.premium-landing .top-nav{margin-inline-start:auto}
.premium-landing .hero-film{position:relative;isolation:isolate;min-height:580px;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,#836750 0%,#2e211c 65%,#1b1512);display:grid;place-items:center}
.premium-landing .hero-film__scene{position:absolute;inset:0;display:grid;place-items:center}
.premium-landing .hero-film__scene img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;filter:saturate(.94);transform:scale(1.025)}
.premium-landing .hero-film__after{animation:ayneh-reveal 12s ease-in-out infinite;opacity:0}
.premium-landing .hero-film__shade{position:absolute;z-index:1;inset:0;pointer-events:none;background:linear-gradient(0deg,rgba(20,13,10,.85),transparent 32%,transparent 70%,rgba(20,13,10,.2))}
.premium-landing .hero-film__brand{position:absolute;z-index:2;top:22px;left:24px;font:700 13px/1.3 system-ui;letter-spacing:.21em;color:#f9edd7}
.premium-landing .hero-film__brand span{display:block;font-size:9px;letter-spacing:.15em;font-weight:400;opacity:.75;margin-top:5px}
.premium-landing .hero-film__caption{position:absolute;z-index:2;bottom:76px;inset-inline:20px;text-align:center;color:#f9e9d1;font-family:var(--display);font-size:19px;font-weight:800}
.premium-landing .hero-film__caption-before{animation:ayneh-before 12s ease-in-out infinite}
.premium-landing .hero-film__caption-after{position:absolute;inset:0;opacity:0;animation:ayneh-after 12s ease-in-out infinite}
.premium-landing .hero-film__pill{position:absolute;z-index:2;bottom:24px;inset-inline:20px;max-width:max-content;margin:auto;padding:8px 14px;border:1px solid rgba(239,209,160,.48);border-radius:99px;background:rgba(29,20,15,.72);color:#eedac3;font-size:11px;text-align:center}
@keyframes ayneh-reveal{0%,34%{opacity:0}43%,82%{opacity:1}93%,100%{opacity:0}}
@keyframes ayneh-before{0%,34%{opacity:1}43%,82%{opacity:0}93%,100%{opacity:1}}
@keyframes ayneh-after{0%,34%{opacity:0}43%,82%{opacity:1}93%,100%{opacity:0}}
.premium-landing .device-section{border-top:1px solid #e1d2c0;padding-top:44px}
.premium-landing .device-heading{display:flex;gap:24px;justify-content:space-between;align-items:end}
.premium-landing .device-heading>p{max-width:34em;color:#776351;line-height:2}
.premium-landing .device-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px}
.premium-landing .device-card{background:#fefbf6;border:1px solid #e8d7c1;border-radius:22px;overflow:hidden;transition:transform .2s,box-shadow .2s}
.premium-landing .device-card:hover{transform:translateY(-4px);box-shadow:0 15px 30px -25px #362418}
.premium-landing .device-art{height:214px;position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 55% 26%,#ece0d0,#d9c9b3)}
.premium-landing .device-hardware{background:linear-gradient(130deg,#34302d,#171717);border:5px solid #272421;box-shadow:0 18px 24px -16px #362318;position:relative;display:flex;align-items:center;justify-content:center}
.premium-landing .device-screen{width:100%;height:100%;overflow:hidden;background:#4e3f37;position:relative}
.premium-landing .device-screen img{height:100%;width:100%;object-fit:cover;object-position:center 35%}
.premium-landing .device-art--tablet .device-hardware{width:144px;height:106px;border-radius:13px;transform:rotate(-7deg);padding:6px}
.premium-landing .device-art--tablet .device-screen{border-radius:4px}
.premium-landing .device-art--kiosk .device-hardware{width:91px;height:149px;border-radius:10px;padding:5px;margin-top:-30px}
.premium-landing .device-art--kiosk .device-hardware::after{content:"";position:absolute;top:100%;height:25px;width:12px;background:#282523;left:calc(50% - 6px)}
.premium-landing .device-art--kiosk .device-art{overflow:hidden}
.premium-landing .device-art--kiosk::after{content:"";position:absolute;width:76px;height:7px;border-radius:50%;background:#292523;bottom:21px}
.premium-landing .device-art--phone .device-hardware{width:75px;height:150px;border-radius:17px;padding:5px}
.premium-landing .device-art--phone .device-screen{border-radius:9px}
.premium-landing .device-art--phone .device-hardware::before{content:"";height:4px;width:23px;border-radius:5px;position:absolute;top:4px;left:calc(50% - 11.5px);z-index:1;background:#111}
.premium-landing .device-art--tv .device-hardware{width:174px;height:108px;border-radius:6px;padding:5px;margin-top:-20px}
.premium-landing .device-art--tv .device-hardware::after{content:"";position:absolute;top:100%;height:24px;width:8px;left:calc(50% - 4px);background:#302823}
.premium-landing .device-art--tv::after{content:"";position:absolute;bottom:40px;width:78px;height:6px;background:#302823;border-radius:99px}
.premium-landing .device-card__text{padding:19px 16px 22px}
.premium-landing .device-card__text>span{color:#9e7a48;font-size:11px;font-weight:800}
.premium-landing .device-card__text h3{font-family:var(--display);font-size:19px;color:#36261b;margin:6px 0}
.premium-landing .device-card__text p{font-size:13px;color:#766351;line-height:1.9}
.premium-landing .devices-note{font-size:12px;color:#816b55;line-height:2;margin-top:18px}
.premium-landing .privacy-story{background:#241a16;border:1px solid #715438;border-radius:26px;padding:clamp(22px,4vw,54px);color:#f5dfbe;overflow:hidden}
.premium-landing .privacy-story__head{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:end;border-bottom:1px solid rgba(220,179,124,.32);padding-bottom:24px}
.premium-landing .privacy-story__head .display{color:#f2d7af}
.premium-landing .privacy-story__head>p{color:#d5c1a8;line-height:2;font-size:15px}
.premium-landing .privacy-story__lines{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:35px;row-gap:0}
.premium-landing .privacy-story__line{display:grid;grid-template-columns:36px 1fr 28px;gap:13px;align-items:center;min-height:113px;border-bottom:1px solid rgba(220,179,124,.18)}
.premium-landing .privacy-story__index{color:#c49f6c;font:700 13px system-ui}
.premium-landing .privacy-story__line b{font-family:var(--display);font-size:17px;color:#f9ead4}
.premium-landing .privacy-story__line p{font-size:12px;color:#c7b9a6;line-height:1.8;margin:7px 0 0}
.premium-landing .privacy-story__line svg{color:#d0ab7b;width:24px;height:24px}
.premium-landing .corporate-footer{margin:60px 0 14px;background:linear-gradient(110deg,#201814,#35251c);padding:34px clamp(18px,3vw,42px) 18px;border-radius:24px;color:#f3e2c9;border:1px solid #6a4e34}
.premium-landing .corporate-footer__main{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:20px;padding-bottom:26px}
.premium-landing .corporate-footer__brand{display:flex;gap:12px;align-items:start}
.premium-landing .corporate-footer__brand img{flex:none}
.premium-landing .corporate-footer__brand b{font-family:var(--display);font-size:21px;color:#f2d6a8}
.premium-landing .corporate-footer__brand p{font-size:12px;line-height:1.9;color:#c7b49b}
.premium-landing .corporate-footer__detail{display:grid;align-content:start;gap:10px}
.premium-landing .corporate-footer__detail span{color:#c9a474;font-size:12px;font-weight:700}
.premium-landing .corporate-footer a{color:#f7ead7;padding:0;min-height:unset;line-height:1.8;font-size:13px;text-decoration:none}
.premium-landing .corporate-footer a:hover{text-decoration:underline}
.premium-landing .corporate-footer__bottom{display:flex;justify-content:space-between;align-items:center;gap:16px;border-top:1px solid rgba(220,179,124,.23);padding-top:16px}
.premium-landing .corporate-footer__bottom small{color:#b5a08a;font-size:12px}
@media(max-width:970px){.premium-landing .device-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.premium-landing .corporate-footer__main{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){
 .premium-landing .top{min-height:64px}
 .premium-landing .hero-film{min-height:350px;height:390px}
 .premium-landing .hero-film__scene img{object-fit:contain}
 .premium-landing .hero-film__brand{top:16px;left:16px}
 .premium-landing .hero-film__caption{bottom:72px;font-size:16px}
 .premium-landing .device-heading{display:block}
 .premium-landing .device-grid{gap:12px}
 .premium-landing .device-art{height:177px}
 .premium-landing .device-card__text{padding:14px 12px 18px}
 .premium-landing .device-card__text h3{font-size:16px}
 .premium-landing .device-card__text p{font-size:12px}
 .premium-landing .privacy-story__head{grid-template-columns:1fr;gap:0}
 .premium-landing .privacy-story__lines{grid-template-columns:1fr}
 .premium-landing .privacy-story__line{min-height:105px}
 .premium-landing .corporate-footer{margin-top:38px}
 .premium-landing .corporate-footer__main{grid-template-columns:1fr;gap:21px}
 .premium-landing .corporate-footer__bottom{align-items:start;flex-direction:column}
}
@media(max-width:380px){.premium-landing .device-grid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.premium-landing .hero-film__after{animation:none;opacity:1}.premium-landing .hero-film__caption-before{display:none}.premium-landing .hero-film__caption-after{opacity:1;animation:none}}

/* Ayneh Luxury Classic — scoped to the public marketing page only */
body.premium-landing{
 --glass:#f6efe5;--glass-2:#ecdfce;--surface:#fffaf3;--surface-2:#f8f0e5;
 --ink:#251b16;--ink-2:#655346;--muted:#796b5d;--line:#decdb8;--line-2:#eadfd1;
 --accent:#b99057;--accent-ink:#64451e;--accent-soft:#f1e2c8;--accent-ring:rgba(185,144,87,.38);
 --honey:#bd9659;--lift:0 16px 36px -28px rgba(49,29,15,.27);
 color:#251b16;background:#f6efe5;
}
.premium-landing .wrap{max-width:1300px;padding-inline:clamp(14px,3vw,34px)}
.premium-landing .top{
 position:relative;z-index:10;margin-top:16px;padding:14px 25px;
 background:linear-gradient(115deg,#17120f,#2c211b 70%,#38271c);
 border:1px solid rgba(225,190,130,.28);border-radius:20px;
 box-shadow:0 14px 40px rgba(30,19,12,.2);
}
.premium-landing .top .brand{color:#f4e2c4;letter-spacing:.01em}
.premium-landing .top .brand span{font-size:20px}
.premium-landing .top-nav{display:flex;align-items:center;gap:clamp(12px,2vw,28px)}
.premium-landing .top-nav a{font-size:13px;font-weight:600;color:#eee0cf;transition:color .2s ease}
.premium-landing .top-nav a:hover,.premium-landing .top-nav a:focus-visible{color:#e7be7d}
.premium-landing .top .btn--primary{border-radius:999px;background:linear-gradient(135deg,#f0d6a9,#c99c5c);color:#211610;box-shadow:0 8px 18px -12px #d7a669}
.premium-landing .hero.hero{
 grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr);margin-top:18px;
 min-height:550px;background:radial-gradient(circle at 26% 20%,#584332 0%,#2b201a 44%,#1a1411 100%);
 border-radius:26px;border:1px solid #71553b;overflow:hidden;
 box-shadow:0 30px 65px -38px #2b1b11;
}
.premium-landing .hero__copy{padding:clamp(28px,4.5vw,70px);position:relative;z-index:1}
.premium-landing .hero .eyebrow{background:rgba(226,181,113,.12);color:#f3d5a8;border:1px solid rgba(237,191,126,.38);padding:6px 15px}
.premium-landing .hero .display{font-size:clamp(35px,3.7vw,59px);line-height:1.37;color:#f4d6a8;text-shadow:0 3px 22px rgba(0,0,0,.18)}
.premium-landing .hero .sub-l{color:#ecdfd0;max-width:34em;font-size:16px;line-height:2}
.premium-landing .hero__cta{gap:12px;margin-top:24px}
.premium-landing .hero__cta .btn{border-radius:999px;font-weight:800}
.premium-landing .hero__cta .btn--primary{background:linear-gradient(135deg,#edd2a2,#c99c5d);color:#21160d;border-color:transparent;box-shadow:0 14px 26px -16px #d8ae74}
.premium-landing .hero__cta .btn--ghost{color:#f2dfc4;border:1px solid #bda27e;background:rgba(255,255,255,.06)}
.premium-landing .hero__cta .btn--ghost:hover{background:rgba(255,255,255,.14)}
.premium-landing .hero__photo{height:100%;width:100%;object-fit:cover;object-position:center;filter:saturate(.92) contrast(1.04)}
.premium-landing .premium-trust{display:flex;flex-wrap:wrap;gap:9px;margin-top:28px}
.premium-landing .premium-trust span{font-size:12px;font-weight:650;color:#f3e3d0;padding:7px 12px;border:1px solid rgba(224,191,147,.3);border-radius:99px;background:rgba(255,255,255,.05)}
.premium-landing main>section:not(.hero){margin-block:70px}
.premium-landing section>.eyebrow{background:#eee0c7;color:#78572b}
.premium-landing h2.display{color:#37271b;font-size:clamp(27px,3vw,39px);line-height:1.35}
.premium-landing .sub-l{color:#615145}
.premium-landing .product-layout{gap:clamp(24px,5vw,74px)}
.premium-landing .product-layout>div:first-child{max-width:530px}
.premium-landing .stage{width:min(100%,430px)}
.premium-landing .stage .dev{border:3px solid #b68b50;box-shadow:0 27px 52px -24px rgba(25,15,9,.45),0 0 0 7px rgba(195,152,85,.12)}
.premium-landing .stage .float{background:#fffaf2;color:#2f2318;border:1px solid #dfc497}
.premium-landing .why{gap:16px;margin-top:27px}
.premium-landing .why>div{padding:24px;border:1px solid #e3d3bc;border-radius:20px;background:#fffcf7;box-shadow:0 16px 40px -34px rgba(36,25,17,.35);align-items:flex-start;transition:transform .25s ease,box-shadow .25s ease}
.premium-landing .why>div:hover{transform:translateY(-3px);box-shadow:0 20px 42px -31px rgba(36,25,17,.45)}
.premium-landing .why .ic{background:#f1e1c8;color:#926531;border-radius:15px;width:48px;height:48px}
.premium-landing .why b{font-family:var(--display);font-size:17px;margin-bottom:5px;color:#332317}
.premium-landing .why span{color:#6b594a}
.premium-landing .journey{gap:16px;margin-top:28px}
.premium-landing .journey li{position:relative;min-height:145px;background:linear-gradient(160deg,#fffdf8,#f3e8da);padding:25px 18px;border:1px solid #e1ceb2;border-radius:20px;box-shadow:0 12px 28px -26px #6b4d33}
.premium-landing .journey li::before{content:"";display:block;width:32px;height:3px;background:linear-gradient(90deg,#9b6f34,#e8c894);border-radius:3px;margin-bottom:12px}
.premium-landing .journey li b{font-size:17px;color:#3d2b1e}
.premium-landing .journey li span{font-size:14px;line-height:1.9;color:#715d4e}
.premium-landing .set li{padding:20px;border:1px solid #e7d8c3;border-radius:16px}
.premium-landing .set li::before{background:#b38a54;color:#fff9ef}
.premium-landing .safe span{border:1px solid #dfcdb7;background:#fff9f0}
.premium-landing .safe .ic{color:#987142}
.premium-landing .demo-layout{background:radial-gradient(circle at 10% 0%,#53402f,#271d18 55%,#191411);border:1px solid #7d5a3c;padding:clamp(28px,5vw,60px);border-radius:28px;box-shadow:0 28px 55px -35px #2d1b0f}
.premium-landing .demo-layout .display{color:#f4d9ae}
.premium-landing .demo-layout .sub-l{color:#e4d4c2}
.premium-landing .demo-layout .btn--ghost{color:#f7e4c8;border-color:#a88659}
.premium-landing .demo-form{background:#fffaf3;border:1px solid #f1dfc1;border-radius:20px;padding:clamp(20px,3vw,34px);box-shadow:0 16px 32px rgba(0,0,0,.15)}
.premium-landing .demo-form input:not([type=checkbox]){min-height:48px;border-color:#c9b395;border-radius:12px;background:#fff}
.premium-landing .demo-form input:focus-visible{outline:3px solid rgba(190,149,87,.25);border-color:#a07940}
.premium-landing .demo-form .btn--primary{background:linear-gradient(135deg,#e8c892,#be9151);color:#241a13;border:0;font-weight:800;border-radius:12px}
.premium-landing .landing-registration .card{background:#fffdf9;border-color:#e3d1b7}
.premium-landing details{border:1px solid #e3d1b7;background:#fffcf7;border-radius:14px;margin-block:12px;box-shadow:0 14px 25px -29px #654126}
.premium-landing details summary{font-size:15px;min-height:58px}
.premium-landing footer{color:#6d5b4a;padding-block:30px 46px}
.premium-landing footer a{color:#735126}
@media (max-width:900px){.premium-landing .top-nav{gap:12px}.premium-landing .top-nav a{font-size:12px}}
@media (max-width:760px){
 .premium-landing .top{margin-top:9px;padding:10px 13px;border-radius:14px}
 .premium-landing .top .brand span{font-size:16px}
 .premium-landing .top-nav{display:none}
 .premium-landing .top .btn{font-size:12px;min-height:43px;padding:0 14px}
 .premium-landing .hero.hero{grid-template-columns:minmax(0,1fr);min-height:auto;border-radius:20px;margin-top:11px}
 .premium-landing .hero__copy{padding:30px 23px 26px}
 .premium-landing .hero .display{font-size:clamp(32px,8.2vw,45px)}
 .premium-landing .hero .sub-l{font-size:14.5px}
 .premium-landing .hero__photo{height:clamp(250px,72vw,420px);min-height:0;object-position:center 38%}
 .premium-landing .hero__cta .btn{flex:1 1 100%;min-height:50px}
 .premium-landing .premium-trust{margin-top:18px}
 .premium-landing main>section:not(.hero){margin-block:48px}
 .premium-landing .journey{grid-template-columns:repeat(2,1fr)}
 .premium-landing .journey li{min-height:150px;padding:18px 15px}
 .premium-landing .demo-layout{padding:25px 17px;border-radius:20px}
}
@media(max-width:390px){.premium-landing .journey{grid-template-columns:1fr}.premium-landing .top .brand img{width:29px;height:29px}}
@media(prefers-reduced-motion:reduce){.premium-landing .why>div{transition:none}.premium-landing *{scroll-behavior:auto}}
.premium-landing .lead-box{background:#fff8ec;color:#312216;border:1px solid #dfc391;border-radius:20px;padding:18px;margin-top:22px;scroll-margin-top:24px;box-shadow:0 18px 35px -28px #160d07}
.premium-landing .lead-box h2{font-family:var(--display);font-size:18px;color:#37251b;line-height:1.55}
.premium-landing .lead-box>p{font-size:12px;color:#695340;margin:4px 0 13px;line-height:1.8}
.premium-landing .lead-box .demo-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;background:transparent;border:0;box-shadow:none;padding:0}
.premium-landing .lead-box .demo-form label{font-size:12px;font-weight:700;display:grid;gap:4px;color:#4e3727}
.premium-landing .lead-box .demo-form label:first-child{grid-column:1/-1}
.premium-landing .lead-box .demo-form input:not([type=checkbox]){min-height:46px;font-size:14px;border-radius:10px;border:1px solid #bda98e;padding:8px 10px;background:#fff}
.premium-landing .lead-box .demo-privacy{grid-column:1/-1;font-size:11px;line-height:1.7;color:#765e45}
.premium-landing .lead-box .demo-form button{grid-column:1/-1;min-height:48px;background:linear-gradient(135deg,#efd3a3,#cda065);color:#231910;font-weight:800}
.premium-landing .lead-box [role=status]{grid-column:1/-1;font-size:12px;color:#205f35;background:#e9f6ec;padding:7px;border-radius:8px}
.premium-landing .lead-box [role=status][data-state=error]{color:#972d1f;background:#fcece8}
.premium-landing .demo-layout{grid-template-columns:1fr;text-align:center}
.premium-landing .demo-layout .sub-l{margin:8px auto 16px}
.premium-landing .demo-layout .btn--primary{background:#e7c58e;color:#261a0f;border-radius:999px}
@media(max-width:760px){.premium-landing .lead-box{padding:15px}.premium-landing .lead-box .demo-form{grid-template-columns:1fr}.premium-landing .lead-box .demo-form label:first-child{grid-column:auto}}

`;
export const landingFor=o=>'<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f9f6f2"><meta name="color-scheme" content="light"><title>'+title+'</title><meta name="description" content="'+desc+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+o+'/"><link rel="alternate" hreflang="fa" href="'+o+'/"><link rel="alternate" hreflang="x-default" href="'+o+'/"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:type" content="website"><meta property="og:url" content="'+o+'/"><meta property="og:image" content="'+o+ogImg+'"><meta property="og:image:alt" content="لوگوی مزون آینه؛ لباس عروس را روی اندام خودت ببین"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name" content="مزون آینه"><meta property="og:locale" content="fa_IR"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+desc+'"><meta name="twitter:image" content="'+o+ogImg+'">'+jsonld(o)+'<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><link rel="preload" href="/fonts/vazirmatn-arabic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/estedad-arabic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/catalog/dress/demo-after.webp" as="image"><style>'+baseCSS+css+`
body{background:#f5eee3;color:#261c16}
.wrap{max-width:1200px;margin:auto}
header.top{background:#211a16;color:#f9ebd5;padding:14px clamp(16px,4vw,40px);border-radius:0}
.top a,.hero a{color:inherit}
.hero.hero{display:grid;grid-template-columns: .85fr 1.15fr;gap:0;padding:0;background:#241c17;color:#fff4e2;border-radius:0 0 24px 24px;overflow:hidden}
.hero__copy{padding:clamp(24px,5vw,64px);align-self:center}
.hero .display{color:#f2d3a2}
.hero .sub-l,.hero .eyebrow{color:#ede0d0}
.hero__photo{width:100%;height:100%;min-height:340px;object-fit:cover;display:block}
.wrap .btn--primary{background:#e7c58e;color:#251a10;border-color:#e7c58e}
.wrap .btn--ghost{border-color:#a88659}
main>section:not(.hero){margin-block:36px}
.product-layout,.demo-layout{display:grid;grid-template-columns:1fr 1fr;gap:clamp(18px,4vw,48px);align-items:center}
.product-layout .stage{margin:0}
.demo-layout{background:#281e18;color:#fff4e2;padding:clamp(20px,4vw,44px);border-radius:22px}
.demo-layout .display,.demo-layout .sub-l{color:inherit}
.demo-form{background:#fffaf2;color:#251c17;padding:20px;border-radius:16px;display:grid;gap:12px}
.demo-form label{display:grid;gap:4px}
.demo-form label.demo-consent{display:flex;align-items:center;gap:8px}
.demo-form input:not([type=checkbox]){width:100%;padding:9px;border:1px solid #967c60;border-radius:8px;font:inherit}
.demo-form button{font:inherit}
.demo-form button:disabled{opacity:.65}
.demo-form [hidden]{display:none}
.journey{list-style:none;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.journey li{background:#fffaf2;border:1px solid #ddcbb5;border-radius:14px;padding:16px}
.journey b,.journey span{display:block}
.journey span{margin-top:7px}
@media(max-width:760px){.hero.hero,.product-layout,.demo-layout{grid-template-columns:1fr}.hero__photo{height:auto;min-height:0}.journey{grid-template-columns:repeat(2,1fr)}}
`+`
.landing-registration{max-width:580px}
.landing-registration .card{padding:clamp(16px,4vw,30px);border:1px solid #d6dfdb;border-radius:22px;background:#fff}
.landing-registration label,.landing-registration label small,.landing-registration .ferr{display:block}
.landing-registration label{margin-block:12px}
.landing-registration input:not([type=checkbox]){display:block;width:100%;padding:10px;border:1px solid #a8bbb4;border-radius:8px;font:inherit}
.landing-registration .ltr{direction:ltr;text-align:left}
.landing-registration .pw button{font:inherit}
.landing-registration .grp+.grp{border-top:1px solid #d6dfdb;padding-top:14px}
.landing-registration .draw-check{display:block;width:72px;margin:auto}
.landing-registration .msg{margin-top:12px}
.landing-registration .bad,.landing-registration .ferr{color:#952525}
.landing-registration a{overflow-wrap:anywhere}
.landing-registration [hidden]{display:none!important}
`+premiumLandingCSS+freshCSS+'</style></head><body class="premium-landing">'
+'<a class="skip" href="#main">پرش به محتوای اصلی</a>'
+'<div class="wrap"><header class="top"><a class="brand" href="/" aria-label="صفحه اصلی آینه">'+brandImg(38)+'<span>آینه</span></a><nav class="top-nav" aria-label="دسترسی سریع"><a href="#product">عملکرد آینه</a><a href="#why">مزایا</a><a href="#devices">دستگاه‌ها</a><a href="#path">مراحل استفاده</a><a href="#faq">سؤالات</a></nav><button class="mobile-toggle" id="mobile-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="بازکردن فهرست"><span></span><span></span><span></span></button></header><nav class="mobile-menu" id="mobile-menu" aria-label="فهرست موبایل" hidden><a href="#product">مشاهده عملکرد آینه</a><a href="#why">مزایای آینه</a><a href="#devices">نمایش روی دستگاه‌ها</a><a href="#path">مراحل استفاده</a><a href="#faq">سؤالات متداول</a><a class="btn btn--primary" href="#demo-request" data-lead-mode="trial">درخواست آزمایش ۳روزه</a></nav>'
+'<main id="main">'
+'<section class="hero" aria-labelledby="h1"><div class="hero__copy"><span class="eyebrow">پرو مجازی لباس عروس با هوش مصنوعی</span><h1 class="display" id="h1">قبل از پرو، لباس‌های مزون را <em>روی خود عروس</em> ببینید!</h1><p class="sub-l">عروس لباس‌های شما را روی تصویر خودش امتحان و مقایسه می‌کند؛ بعد با چند انتخاب مشخص‌تر سراغ پرو واقعی می‌رود.</p><div class="hero__cta"><a class="btn btn--primary" href="#demo-request" data-lead-mode="trial">۳ روز آزمایشی رایگان <span aria-hidden="true">←</span></a><a class="btn btn--ghost" href="/s/demo">مشاهده عملکرد آینه <span aria-hidden="true">◉</span></a></div><p class="hero-cta-note">برای هماهنگی آزمایش، مشخصات مزون را ثبت کنید؛ تیم آینه با شما تماس می‌گیرد.</p><div class="hero-proof"><span>✦ انتخاب آسان‌تر</span><span>◈ مقایسه لباس‌ها</span><span>✓ پرو هدفمندتر</span></div></div><div class="hero-film" aria-label="مقایسه تعاملی تصویر پیش و پس از پرو مجازی"><div class="hero-film__scene"><img class="hero-film__before" src="/catalog/dress/demo-before.webp" width="480" height="720" alt="عروس پیش از نمایش لباس" fetchpriority="high"><img class="hero-film__after" src="/catalog/dress/demo-after.webp" width="480" height="720" alt="همان شخص با لباس عروس شبیه‌سازی‌شده" fetchpriority="high"></div><span class="hero-film__pill">نمونه واقعی از خروجی آینه</span><span class="hero-split-line" aria-hidden="true"></span><span class="hero-split-grip" aria-hidden="true">↔</span><span class="hero-tag hero-tag--before">قبل</span><span class="hero-tag hero-tag--after">بعد</span><input class="hero-split-range" id="hero-split-range" type="range" min="0" max="100" value="50" dir="ltr" aria-label="مقایسه عکس قبل و بعد آینه"></div></section>'
+'<section id="product" class="product-layout" aria-labelledby="product-title"><div><h2 class="display" id="product-title">لباس‌های خود مزون، روی تصویر مشتری</h2><p class="sub-l">آینه لباس‌های مزون شما را روی تصویر مشتری نشان می‌دهد. خط روی عکس را جابه‌جا کنید تا نمونهٔ قبل و بعد را ببینید.</p><a class="btn btn--ghost" href="/s/demo">امتحان نمونهٔ پرو مجازی</a></div>'
+'<div class="stage"><span class="float float--a">'+ic('spark')+'چهرهٔ خودش، لباس شما</span><span class="float float--b">'+ic('heart')+'همین‌جا، بدون پرو سنگین</span><div class="dev"><div class="cmp" id="cmp"><img src="/catalog/dress/demo-before.webp" alt="عکس مشتری پیش از پرو" width="480" height="720"><div class="cmp__after"><img src="/catalog/dress/demo-after.webp" alt="همان عکس با لباس مزون" width="480" height="720" fetchpriority="high"></div><span class="cmp__line"></span><span class="cmp__grip">'+grip+'</span><span class="cmp__tag cmp__tag--b">قبل</span><span class="cmp__tag cmp__tag--a">بعد</span><input class="cmp__range" id="cmpr" type="range" min="0" max="100" value="50" dir="ltr" aria-label="مقایسهٔ قبل و بعد؛ با کلیدهای جهت خط را جابه‌جا کن"></div></div><div class="dev__stand"></div><div class="dev__base"></div><p class="cap">مقایسهٔ قبل و بعد پرو مجازی</p></div></section>'
+'<section class="benefits-section" aria-labelledby="why"><span class="eyebrow">مخصوص صاحبان مزون</span><h2 class="display" id="why">مشتری انتخاب می‌کند؛ شما بهتر راهنمایی می‌کنید</h2><p class="section-intro">به لباس‌های بیشتر فرصت دیده‌شدن بدهید و زمان پرو حضوری را صرف مدل‌هایی کنید که عروس واقعاً پسندیده است.</p><div class="why"><div>'+ic('dress')+'<p><b>پرو حضوری هدفمندتر</b><span>مشتری با چند لباس مورد علاقه سراغ پرو می‌رود.</span></p></div><div>'+ic('users')+'<p><b>همراهان هم شریک می‌شوند</b><span>خانواده روی صفحه می‌بینند و تصمیم سریع‌تر می‌شود.</span></p></div><div>'+ic('clock')+'<p><b>وقت مشاور آزاد می‌شود</b><span>هر لباس را لازم نیست از قفسه بیاورد و بپوشاند.</span></p></div><div>'+ic('chart')+'<p><b>بدانید چه چیزی دیده می‌شود</b><span>آمار نشان می‌دهد کدام لباس‌ها بیشتر امتحان می‌شوند.</span></p></div><div>'+ic('chat')+'<p><b>درخواست آماده</b><span>مشتری علاقه‌مند، اسم و شمارهٔ خودش را می‌گذارد.</span></p></div><div>'+ic('eye')+'<p><b>مزون شما دیده می‌شود</b><span>تجربه‌ای که مشتری برای دوستانش تعریف می‌کند.</span></p></div></div></section>'
+'<section id="devices" class="device-section" aria-labelledby="devices-title"><div class="device-heading"><div><span class="eyebrow">اجرای متناسب با فضای شما</span><h2 class="display" id="devices-title">آینه، روی نمایشگر مناسب مزون شما</h2></div><p>از تجربه شخصی روی گوشی تا نمایش حرفه‌ای روی نمایشگرهای بزرگ؛ تیم آینه گزینه مناسب فضای مزونتان را معرفی می‌کند.</p></div><div class="device-grid"><article class="device-card"><div class="device-art device-art--tablet" aria-hidden="true"><div class="device-hardware"><div class="device-screen"><img src="/catalog/dress/demo-after.webp" alt="" width="480" height="720" loading="lazy" decoding="async"></div></div></div><div class="device-card__text"><span>۰۱ / انعطاف‌پذیر</span><h3>تبلت لمسی</h3><p>تجربه شخصی و قابل‌جابه‌جایی کنار مشاور مزون.</p></div></article><article class="device-card"><div class="device-art device-art--kiosk" aria-hidden="true"><div class="device-hardware"><div class="device-screen"><img src="/catalog/dress/demo-after.webp" alt="" width="480" height="720" loading="lazy" decoding="async"></div></div></div><div class="device-card__text"><span>۰۲ / شاخص</span><h3>کیوسک لمسی</h3><p>ایستگاه اختصاصی پرو مجازی با حضور چشمگیر در مزون.</p></div></article><article class="device-card"><div class="device-art device-art--phone" aria-hidden="true"><div class="device-hardware"><div class="device-screen"><img src="/catalog/dress/demo-after.webp" alt="" width="480" height="720" loading="lazy" decoding="async"></div></div></div><div class="device-card__text"><span>۰۳ / در دسترس</span><h3>گوشی هوشمند</h3><p>مشاهده و انتخاب آسان از طریق موبایل مشتری.</p></div></article><article class="device-card"><div class="device-art device-art--tv" aria-hidden="true"><div class="device-hardware"><div class="device-screen"><img src="/catalog/dress/demo-after.webp" alt="" width="480" height="720" loading="lazy" decoding="async"></div></div></div><div class="device-card__text"><span>۰۴ / جمعی</span><h3>تلویزیون هوشمند</h3><p>نمایش انتخاب‌ها روی صفحه بزرگ برای همراهان عروس.</p></div></article></div><p class="devices-note">امکانات لمس و نحوه اتصال، بسته به دستگاه و پلن انتخابی متفاوت است؛ تیم آینه جزئیات را در تماس توضیح می‌دهد.</p></section>'
+'<section class="journey-section" aria-labelledby="path"><span class="eyebrow">چطور کار می‌کند؟</span><h2 class="display" id="path">از عکس تا انتخاب لباس، در چهار قدم</h2><ol class="journey"><li><b>۱. ثبت تصویر</b><span>مشتری یک عکس از خودش می‌گیرد.</span></li><li><b>۲. انتخاب مدل</b><span>لباس‌های مزون را مرور می‌کند.</span></li><li><b>۳. مشاهده و مقایسه</b><span>مدل‌ها را روی تصویر خودش می‌بیند.</span></li><li><b>۴. پرو حضوری</b><span>گزینه‌های منتخب را در مزون می‌پوشد.</span></li></ol></section>'

+'<section class="privacy-story" aria-labelledby="priv"><div class="privacy-story__head"><div><span class="eyebrow">اعتماد به تجربه آینه</span><h2 class="display" id="priv">حریم خصوصی، بخشی از طراحی آینه</h2></div><p>عکس مشتری برای نمایش عمومی نیست. مسیر تصویر، کنترل و حذف آن را شفاف توضیح می‌دهیم.</p></div><div class="privacy-story__lines"><div class="privacy-story__line"><span class="privacy-story__index">۰۱</span><div><b>حذف خودکار تصاویر موقت</b><p>عکس‌هایی که برای درخواست ارسال نشده‌اند، پس از ۱۵ دقیقه پاک می‌شوند.</p></div>'+ic('clock')+'</div><div class="privacy-story__line"><span class="privacy-story__index">۰۲</span><div><b>بدون نمایش عمومی</b><p>عکس مشتری در گالری عمومی سایت منتشر نمی‌شود.</p></div>'+ic('lock')+'</div><div class="privacy-story__line"><span class="privacy-story__index">۰۳</span><div><b>اختیار حذف در دست مشتری</b><p>مشتری می‌تواند تصویر موقت خود را همان لحظه حذف کند.</p></div>'+ic('trash')+'</div><div class="privacy-story__line"><span class="privacy-story__index">۰۴</span><div><b>پرو واقعی، تصمیم نهایی</b><p>تصویر شبیه‌سازی است؛ اندازه، پارچه و دوخت با پرو حضوری تأیید می‌شود.</p></div>'+ic('shield')+'</div></div></section>'
+'<section class="lead-box" id="demo-request" aria-labelledby="contact-title"><div class="lead-side"><span class="eyebrow">یک تجربه متفاوت برای مزون شما</span><h2 id="contact-title">سه روز آینه را در مزون خودتان تجربه کنید</h2><p>نام مجموعه، شهر و شماره موبایل را ثبت کنید تا تیم آینه برای هماهنگی آزمایش با شما تماس بگیرد.</p><div class="lead-mini-benefits"><span>✓ ثبت درخواست بدون پرداخت</span><span>✓ هماهنگی با تیم آینه</span><span>✓ معرفی راهکار متناسب با مزون</span></div></div><div class="lead-form-panel">'+demoForm+'<div class="lead-done" id="lead-done" role="status" aria-live="polite" hidden><span class="lead-done__check" aria-hidden="true">✓</span><h3>درخواست شما ثبت شد!</h3><p>تیم آینه برای هماهنگی مراحل بعدی با شماره ثبت‌شده تماس می‌گیرد.</p><a class="btn btn--ghost" href="/">بازگشت به صفحه اصلی</a></div></div></section>'

+'<section class="faq-section" aria-labelledby="faq"><span class="eyebrow">راهنمای سریع</span><h2 class="display" id="faq">سؤالات متداول مزون‌دارها</h2>'+faq.map(([q,a])=>'<details><summary>'+q+'</summary><p>'+a+'</p></details>').join('')+'</section>'
+'</main><div class="sticky-action"><a class="btn btn--primary" href="#demo-request" data-lead-mode="trial">آزمایش ۳روزه رایگان</a><a class="sticky-action__demo" href="/s/demo">مشاهده دمو</a></div><footer class="corporate-footer"><div class="corporate-footer__main"><div class="corporate-footer__brand">'+brandImg(46)+'<div><b>آینه | AYNEH</b><p>راهکار هوشمند انتخاب و پیش‌نمایش لباس عروس برای مزون‌ها</p></div></div><div class="corporate-footer__detail"><span>وب‌سایت رسمی</span><a href="/">ayneh-mezon.site</a></div><div class="corporate-footer__detail"><span>تماس با تیم آینه</span><a href="#demo-request">درخواست تماس</a></div><div class="corporate-footer__detail"><span>ارتباط از طریق پیام‌رسان</span><a href="'+BOT_URL+'" target="_blank" rel="noopener noreferrer">ربات رسمی تلگرام آینه</a></div></div><div class="corporate-footer__bottom"><small>© مزون آینه — حقوق محتوا محفوظ است</small><a href="/privacy">قوانین و حریم خصوصی</a></div></footer></div><script>'+js+freshJS+'</script></body></html>';
export const landingHTML=landingFor('');
