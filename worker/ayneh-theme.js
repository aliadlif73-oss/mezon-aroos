export const freshCSS=String.raw`
/* Ayneh Fresh — neutral canvas, emerald actions, gentle coral and violet accents */
body.premium-landing{--ink:#21352b;--ink-2:#617469;--muted:#79857d;--glass:#faf8f5;--glass-2:#f1ece5;--surface:#fff;--surface-2:#f7f4ef;--line:#e8e6df;--line-2:#e8e7df;--accent:#087b44;--accent-ink:#0a663e;--accent-soft:#e6f4e9;--accent-ring:rgba(7,126,69,.28);--lift:0 17px 40px -35px rgba(32,54,38,.35);background:linear-gradient(150deg,#fffdfa,#f8f6f2 48%,#fffdfa);color:#24362b;overflow-x:hidden}
.premium-landing .wrap{max-width:1240px;padding-inline:clamp(13px,3vw,30px)}
.premium-landing .top{min-height:74px;margin:12px 0 17px;background:rgba(255,255,255,.97);border:1px solid #ece9e2;border-radius:21px;box-shadow:0 12px 33px -28px #244d32;display:flex;align-items:center;padding:12px 23px;gap:22px}
.premium-landing .top .brand{color:#155b37;display:flex;align-items:center;gap:8px}
.premium-landing .top .brand span{font-size:25px;font-weight:900}
.premium-landing .top-nav{display:flex;align-items:center;gap:clamp(12px,2vw,27px);margin-inline-start:auto}
.premium-landing .top-nav a{color:#355441;font-size:14px;font-weight:650}
.premium-landing .top-nav a:hover{color:#0b8a4e}
.premium-landing .mobile-toggle{display:none;width:46px;height:45px;align-items:center;justify-content:center;flex-direction:column;gap:5px;background:#eff8f0;border:1px solid #dceadf;border-radius:12px;cursor:pointer}
.premium-landing .mobile-toggle span{width:21px;height:2px;background:#246142;border-radius:99px}
.premium-landing .mobile-menu[hidden]{display:none!important}
.premium-landing .mobile-menu{display:grid;position:relative;z-index:20;margin:-9px 0 14px;padding:10px;background:#fff;border:1px solid #dce8dc;border-radius:18px;box-shadow:0 16px 28px -24px #214b31}
.premium-landing .mobile-menu a{padding:12px 14px;color:#254a33;border-radius:10px;font-weight:700;text-decoration:none}
.premium-landing .mobile-menu a:hover{background:#f1f7f1}
.premium-landing .mobile-menu .btn{background:#11834b;color:#fff;text-align:center}
.premium-landing .hero.hero{display:grid;grid-template-columns:1fr .95fr;align-items:stretch;min-height:560px;padding:19px;margin-top:7px;gap:0;background:radial-gradient(circle at 92% 11%,#fff 0,transparent 60%),linear-gradient(145deg,#fffaf5,#f7f1ed);border:1px solid #ede6e0;border-radius:29px;color:#263b2e;box-shadow:0 30px 50px -46px #473b33;overflow:hidden}
.premium-landing .hero__copy{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:clamp(21px,4.5vw,60px)}
.premium-landing .hero .eyebrow{background:#e7f3e8;border:1px solid #d2e8d8;color:#0b6e42;padding:8px 15px;font-weight:800;font-size:12px}
.premium-landing .hero .display{font-size:clamp(33px,3.7vw,55px);line-height:1.47;letter-spacing:-.025em;color:#23362b;text-shadow:none;font-weight:900}
.premium-landing .hero .display em{font-style:normal;color:#087941}
.premium-landing .hero .sub-l{max-width:34em;margin-top:14px;font-size:15px;line-height:2.1;color:#5a6c60}
.premium-landing .hero__cta{display:grid;grid-template-columns:1fr;gap:10px;width:100%;margin-top:22px}
.premium-landing .hero__cta .btn{display:flex;align-items:center;justify-content:center;gap:12px;min-height:55px;border-radius:15px;font-size:15.5px;font-weight:850;line-height:1.5}
.premium-landing .wrap .btn--primary,.premium-landing .hero__cta .btn--primary{background:linear-gradient(135deg,#13a357,#087744);border:1px solid #087a41;color:white;box-shadow:0 14px 24px -20px #11643d}
.premium-landing .wrap .btn--primary:hover{background:#086d3f}
.premium-landing .hero__cta .btn--ghost{background:#fff;border:1px solid #acd0b9;color:#11623a;box-shadow:none}
.premium-landing .hero-cta-note{font-size:11.5px;color:#7b867d;line-height:1.85;margin-top:11px}
.premium-landing .hero-proof{display:flex;flex-wrap:wrap;gap:7px;margin-top:19px}
.premium-landing .hero-proof span{background:#fff;border:1px solid #e4ebe3;padding:7px 9px;border-radius:11px;color:#47705a;font-size:12px}
.premium-landing .hero-film{position:relative;align-self:stretch;min-height:490px;border-radius:23px;overflow:hidden;background:#e8d9cf;--split:50%;box-shadow:0 25px 45px -35px #473c35}
.premium-landing .hero-film__scene{position:absolute;inset:0}
.premium-landing .hero-film__scene img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%;transform:none;filter:none}
.premium-landing .hero-film__scene .hero-film__before{clip-path:inset(0 calc(100% - var(--split)) 0 0)}
.premium-landing .hero-film__scene .hero-film__after{animation:none!important;opacity:1;clip-path:inset(0 0 0 var(--split))}
.premium-landing .hero-film__video,.premium-landing .hero-film__shade,.premium-landing .hero-film__brand,.premium-landing .hero-film__caption{display:none}
.premium-landing .hero-film__pill{z-index:3;bottom:16px;inset-inline:unset;right:50%;transform:translateX(50%);background:rgba(255,255,255,.94);color:#1d5734;border:1px solid #e4ede4;border-radius:99px;font-size:11px;padding:8px 14px;white-space:nowrap}
.premium-landing .hero-split-line{position:absolute;left:var(--split);top:0;bottom:0;width:2px;background:#fff;z-index:3}
.premium-landing .hero-split-grip{position:absolute;left:var(--split);top:46%;transform:translate(-50%,-50%);z-index:4;width:52px;height:52px;border-radius:50%;background:#0d834b;color:white;box-shadow:0 12px 25px -19px #193d27;border:3px solid #fff;display:grid;place-items:center;font-size:22px}
.premium-landing .hero-tag{position:absolute;z-index:4;bottom:62px;padding:6px 16px;background:#fff;color:#2a4534;border-radius:99px;font-size:13px;font-weight:800}
.premium-landing .hero-tag--before{left:18px}.premium-landing .hero-tag--after{right:18px;background:#0d7543;color:#fff}
.premium-landing .hero-split-range{position:absolute;z-index:5;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;touch-action:pan-y}
.premium-landing .hero-film:focus-within{outline:3px solid #7fb792;outline-offset:2px}
.premium-landing main>section:not(.hero){margin-block:clamp(42px,6vw,76px)}
.premium-landing section>.eyebrow{background:#e8f4eb;border:1px solid #d9eadd;color:#1b7248}
.premium-landing h2.display{color:#294333;font-size:clamp(24px,3vw,38px);line-height:1.45}
.premium-landing .sub-l,.premium-landing .section-intro{color:#63746a;line-height:2}
.premium-landing .section-intro{max-width:650px;font-size:15px;margin:9px 0 20px}
.premium-landing .product-layout{background:#fff;border:1px solid #eee9e3;border-radius:27px;padding:clamp(24px,4vw,46px);gap:clamp(20px,4vw,65px);box-shadow:0 25px 50px -46px #293a2e}
.premium-landing .product-layout .btn--ghost{display:inline-flex;align-items:center;justify-content:center;margin-top:19px;padding:13px 22px;background:#eff8f0;border:1px solid #c6e1cf;color:#1a6d44;border-radius:13px}
.premium-landing .stage .dev{background:#1b2820;border:4px solid #283c2d;border-radius:23px;box-shadow:0 23px 35px -28px #244533}
.premium-landing .stage .float{background:#fff;color:#286342;border:1px solid #e5ede4}
.premium-landing .stage .float .ic{color:#0e8c4a}
.premium-landing .stage .cmp__grip{color:#10854a}
.premium-landing .why{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin-top:24px}
.premium-landing .why>div{display:flex;gap:12px;align-items:start;background:#fff;border:1px solid #ebe9e2;border-radius:19px;padding:20px;box-shadow:0 12px 28px -28px #2b3a30}
.premium-landing .why .ic{flex:none;background:#e7f6eb;color:#147a49;width:46px;height:46px;border-radius:13px;padding:10px}
.premium-landing .why>div:nth-child(3n+2) .ic{background:#fff1e9;color:#c47a54}
.premium-landing .why>div:nth-child(3n) .ic{background:#f2eef9;color:#8776b2}
.premium-landing .why b{font-size:16px;color:#254331;line-height:1.5;margin-bottom:6px}
.premium-landing .why span{font-size:13px;color:#6e7b71;line-height:1.9}
.premium-landing .device-section{border-top:1px solid #e9ece5;padding-top:41px}
.premium-landing .device-heading>p{color:#69776c}
.premium-landing .device-grid{gap:13px}
.premium-landing .device-card{border:1px solid #e8e9e3;background:#fff;border-radius:21px;box-shadow:0 17px 32px -32px #263a2e}
.premium-landing .device-art{background:radial-gradient(circle at 50% 10%,#fffaf7,#e7e8e4)}
.premium-landing .device-card:nth-child(2) .device-art{background:linear-gradient(135deg,#e7f4e9,#f8faf6)}
.premium-landing .device-card:nth-child(3) .device-art{background:linear-gradient(135deg,#fff0e6,#fbf9f5)}
.premium-landing .device-card:nth-child(4) .device-art{background:linear-gradient(135deg,#f0edf9,#fdfbf9)}
.premium-landing .device-card__text>span{color:#16754a}.premium-landing .device-card__text h3{color:#254735}.premium-landing .device-card__text p,.premium-landing .devices-note{color:#6e776e}
.premium-landing .journey-section{padding:34px 28px;border:1px solid #e1ebe1;background:linear-gradient(135deg,#edf7ee,#fbfdf8);border-radius:27px}
.premium-landing .journey{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.premium-landing .journey li{background:#fff;border:1px solid #e3ebe1;border-radius:17px;padding:19px 15px;min-height:156px;box-shadow:0 12px 23px -26px #2b583b}
.premium-landing .journey li::before{width:33px;height:33px;border-radius:50%;background:#168249;margin-bottom:12px}
.premium-landing .journey li:nth-child(2)::before{background:#d18b67}
.premium-landing .journey li:nth-child(3)::before{background:#9980be}
.premium-landing .journey li:nth-child(4)::before{background:#d2b167}
.premium-landing .journey li b{color:#245a37;font-size:15px}.premium-landing .journey li span{color:#6f7e70;font-size:13px}
.premium-landing .privacy-story{background:#fff;color:#253e30;border:1px solid #e5e9e1;border-radius:26px;padding:clamp(22px,4vw,48px);box-shadow:0 17px 39px -40px #2c4d34}
.premium-landing .privacy-story__head{border-bottom:1px solid #e3ece2}
.premium-landing .privacy-story__head .display{color:#28513a}.premium-landing .privacy-story__head>p{color:#637467}
.premium-landing .privacy-story__line{border-bottom:1px solid #e9eeea}.premium-landing .privacy-story__index,.premium-landing .privacy-story__line svg{color:#13884c}
.premium-landing .privacy-story__line b{color:#2b4933}.premium-landing .privacy-story__line p{color:#6b7d70}
.premium-landing .lead-box{display:grid;grid-template-columns:.9fr 1.1fr;align-items:center;gap:clamp(20px,4vw,55px);padding:clamp(22px,4vw,54px);background:linear-gradient(140deg,#eaf6ea,#fafbf6 70%,#fffdf9);border:1px solid #dceadd;border-radius:28px;scroll-margin-top:22px;box-shadow:0 25px 47px -43px #27603e}
.premium-landing .lead-side h2{font:850 clamp(25px,3.2vw,39px)/1.5 var(--display);color:#194e30}
.premium-landing .lead-side>p{color:#607364;font-size:15px;line-height:2.1;margin:14px 0 20px}
.premium-landing .lead-mini-benefits{display:grid;gap:10px}.premium-landing .lead-mini-benefits span{font-size:13px;color:#3c7752}
.premium-landing .lead-form-panel{background:#fff;border:1px solid #e1ece0;border-radius:22px;padding:clamp(18px,2.6vw,30px);box-shadow:0 18px 30px -30px #2b4e38}
.premium-landing .lead-form-panel .demo-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;background:none;border:0;box-shadow:none;padding:0;color:#2c4d36}
.premium-landing .demo-form .lead-mode{grid-column:1/-1;display:flex;gap:6px;background:#edf5ee;border:1px solid #e1ece3;border-radius:12px;padding:5px}
.premium-landing .lead-mode__btn{flex:1;font:700 13px var(--display);padding:10px 4px;border:0;background:transparent;color:#60776a;cursor:pointer;border-radius:9px}
.premium-landing .lead-mode__btn.is-active{background:white;color:#0f7845;box-shadow:0 9px 15px -14px #2a513a}
.premium-landing .lead-form-panel label{display:grid;gap:7px;font-size:13px;font-weight:700;color:#2e5c3d}
.premium-landing .lead-form-panel label:first-of-type{grid-column:1/-1}
.premium-landing .lead-form-panel input:not([type=checkbox]){min-height:50px;width:100%;padding:11px;border:1px solid #d3ded2;border-radius:12px;background:#fefefe;font-size:14px}
.premium-landing .lead-form-panel input:focus-visible{border-color:#11864b;outline:3px solid #d9eedf}
.premium-landing .lead-form-panel .demo-privacy{grid-column:1/-1;color:#738477;font-size:11px;line-height:1.85;margin:0}
.premium-landing .lead-form-panel .demo-form button[type=submit]{grid-column:1/-1;min-height:52px;border-radius:13px;font-weight:850;color:white}
.premium-landing .lead-form-panel .demo-form [role=status]{grid-column:1/-1}
.premium-landing .lead-form-panel .demo-form[hidden],.premium-landing .lead-done[hidden]{display:none!important}
.premium-landing .lead-done{text-align:center;padding:22px;color:#2a4a33}
.premium-landing .lead-done__check{display:grid;place-items:center;margin:0 auto 14px;width:73px;height:73px;border-radius:50%;background:#10844a;color:white;font-size:38px}
.premium-landing .lead-done h3{font-size:24px;font-family:var(--display)}.premium-landing .lead-done p{line-height:2;margin:14px 0;color:#6a7b6c}
.premium-landing .lead-done a.btn--ghost{background:#f2faf3;border:1px solid #8bc29e;color:#14633b;border-radius:13px;min-height:45px;padding:10px 19px}
.premium-landing .faq-section{max-width:920px;margin-inline:auto}
.premium-landing details{border-radius:15px;background:#fff;border:1px solid #e6eae2;box-shadow:none;padding:0 20px}
.premium-landing details summary{color:#284b34;min-height:64px;font-size:15px}.premium-landing details summary::after{color:#138b50}
.premium-landing details p{font-size:14px;line-height:2.1;color:#6c796c}
.premium-landing .corporate-footer{background:linear-gradient(145deg,#22523a,#143c28);color:#eaf4ea;border:0;box-shadow:0 28px 43px -39px #15422a;border-radius:26px}
.premium-landing .corporate-footer__brand b{color:white}.premium-landing .corporate-footer__brand p{color:#cfe2d2}
.premium-landing .corporate-footer__detail span{color:#b4dfc2}.premium-landing .corporate-footer a{color:#ecf9ee}.premium-landing .corporate-footer__bottom small{color:#bad2be}
.premium-landing .sticky-action{display:none}
@media(max-width:950px){.premium-landing .top-nav{display:none}.premium-landing .mobile-toggle{display:flex}}
@media(max-width:760px){
body.premium-landing{padding-bottom:74px}
.premium-landing .wrap{padding-inline:12px}
.premium-landing .top{min-height:64px;margin:9px 0 12px;padding:9px 14px;border-radius:15px}.premium-landing .top .brand span{font-size:22px}
.premium-landing .hero.hero{display:flex;flex-direction:column;min-height:unset;padding:12px;border-radius:22px}
.premium-landing .hero-film{order:0;height:clamp(285px,79vw,390px);min-height:0;border-radius:17px}
.premium-landing .hero__copy{order:1;align-items:stretch;padding:21px 9px 11px}
.premium-landing .hero .eyebrow{align-self:start;font-size:11px}
.premium-landing .hero .display{font-size:clamp(27px,7.2vw,38px);line-height:1.45}
.premium-landing .hero .sub-l{font-size:13.5px;line-height:2;margin-top:9px}
.premium-landing .hero__cta{gap:9px;margin-top:18px}.premium-landing .hero__cta .btn{min-height:53px;font-size:15px}
.premium-landing .hero-proof{margin-top:14px}.premium-landing .hero-proof span{font-size:11px;padding:6px 8px}
.premium-landing main>section:not(.hero){margin-block:40px}
.premium-landing .product-layout{grid-template-columns:1fr;padding:23px 18px;border-radius:21px}
.premium-landing .why{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.premium-landing .why>div{display:block;padding:15px 12px;border-radius:16px}
.premium-landing .why .ic{width:41px;height:41px;margin-bottom:10px;padding:10px}
.premium-landing .why b{font-size:14px}.premium-landing .why span{font-size:12px}
.premium-landing .device-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.premium-landing .device-art{height:165px}.premium-landing .device-card{border-radius:17px}
.premium-landing .device-card__text{padding:12px}.premium-landing .device-card__text h3{font-size:15px}.premium-landing .device-card__text p{font-size:11.5px}
.premium-landing .journey-section{padding:24px 15px;border-radius:22px}
.premium-landing .journey{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.premium-landing .journey li{min-height:137px;padding:14px 11px}.premium-landing .journey li b{font-size:14px}.premium-landing .journey li span{font-size:12px}
.premium-landing .privacy-story{padding:23px 17px;border-radius:20px}.premium-landing .privacy-story__head{grid-template-columns:1fr}.premium-landing .privacy-story__lines{grid-template-columns:1fr}
.premium-landing .lead-box{grid-template-columns:1fr;gap:18px;padding:22px 15px;border-radius:22px}
.premium-landing .lead-side h2{font-size:26px}.premium-landing .lead-form-panel{padding:16px 13px}
.premium-landing .lead-form-panel .demo-form{grid-template-columns:1fr}.premium-landing .lead-form-panel label:first-of-type{grid-column:auto}
.premium-landing .corporate-footer{margin-top:35px;padding:27px 20px}
.premium-landing .sticky-action{position:fixed;z-index:30;bottom:0;inset-inline:0;display:flex;align-items:center;gap:9px;padding:10px 13px calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid #dce8df;box-shadow:0 -12px 25px -25px #15462e}
.premium-landing .sticky-action .btn{flex:1;min-height:49px;border-radius:12px;font-size:14px}
.premium-landing .sticky-action__demo{display:flex;align-items:center;justify-content:center;min-height:49px;min-width:99px;padding:8px;background:#fff;border:1px solid #9ccbac;border-radius:12px;color:#0e6a3b;text-decoration:none;font-size:13px;font-weight:700}
body.premium-landing.form-focusing .sticky-action{display:none}
}
@media(max-width:350px){.premium-landing .why{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.premium-landing .why>div{transition:none}.premium-landing .hero-film__after{animation:none}}
`;
export const freshJS=String.raw`(function(){
var toggle=document.getElementById('mobile-toggle'),menu=document.getElementById('mobile-menu');
if(toggle&&menu){toggle.addEventListener('click',function(){var open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.hidden=open});menu.addEventListener('click',function(e){if(e.target.closest('a')){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}})}
var compare=document.querySelector('.hero-film'),range=document.getElementById('hero-split-range');if(compare&&range){var paint=function(){compare.style.setProperty('--split',range.value+'%')};range.addEventListener('input',paint);paint()}
var form=document.querySelector('.demo-form'),heading=document.getElementById('contact-title');if(!form)return;
function mode(which){var trial=which!=='demo';if(form.elements.chosen)form.elements.chosen.value=trial?'درخواست آزمایش رایگان ۳روزه':'درخواست معرفی اختصاصی';if(heading)heading.textContent=trial?'سه روز آینه را در مزون خودتان تجربه کنید':'دموی اختصاصی آینه برای مزون شما';var intro=document.querySelector('.lead-side>p');if(intro)intro.textContent=trial?'نام مجموعه، شهر و شماره موبایل را ثبت کنید تا تیم آینه برای هماهنگی آزمایش با شما تماس بگیرد.':'برای آشنایی با عملکرد و شرایط آینه، اطلاعات مزون را وارد کنید تا با شما تماس بگیریم.';var submit=form.querySelector('button[type=submit]');if(submit)submit.textContent=trial?'ثبت درخواست آزمایش ۳روزه ←':'ثبت درخواست معرفی اختصاصی ←';form.querySelectorAll('.lead-mode__btn').forEach(function(b){var yes=b.dataset.leadMode===(trial?'trial':'demo');b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes))})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-lead-mode]');if(b)mode(b.dataset.leadMode)});
if(new URLSearchParams(location.search).get('intent')==='trial')mode('trial');
document.addEventListener('focusin',function(e){if(e.target.closest('.demo-form'))document.body.classList.add('form-focusing')});
document.addEventListener('focusout',function(e){if(e.target.closest('.demo-form'))document.body.classList.remove('form-focusing')});
})();`;
