// Pixel-faithful UI/UX implementation matching the Ayneh (آینه) screenshots across mobile & desktop.
// Scoped to "/" via worker/index.js; all API routes, /s/*, /admin, and other modules remain intact.
export const referenceLandingFor = (origin) => {
  const cleanOrigin = String(origin || '').replace(/\/$/, '');
  const title = 'آینه | پرو مجازی لباس عروس با هوش مصنوعی ویژه مزون‌ها';
  const description = 'پلتفرم هوشمند پرو مجازی لباس عروس ویژه مزون‌ها؛ پیش از پرو حضوری، لباس‌های مزون را به‌صورت واقعی روی تصویر عروس نشان دهید تا سریع‌تر مقایسه کند و مطمئن‌تر سفارش بدهد.';

  const brandLogoSrc = '/assets/aistudio/photo_2026-11-17_06-02-29_bc384e6f.jpg';

  const page = String.raw`<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#faf7f2">
<meta name="color-scheme" content="light">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${cleanOrigin}/">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${cleanOrigin}/">
<meta property="og:image" content="${cleanOrigin}/og.jpg">
<meta property="og:site_name" content="آینه">
<meta property="og:locale" content="fa_IR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${cleanOrigin}/og.jpg">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/fonts/vazirmatn-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/estedad-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/landing/hero-before.webp" as="image">
<link rel="preload" href="/landing/hero-after.webp" as="image">
<style>
@font-face{font-family:"Vazirmatn";src:url("/fonts/vazirmatn-arabic.woff2") format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+204F,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:"Vazirmatn";src:url("/fonts/vazirmatn-latin.woff2") format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-200B,U+2012-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:"Estedad";src:url("/fonts/estedad-arabic.woff2") format("woff2");font-weight:100 900;font-display:swap;unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC}

:root{
  --cream:#faf7f2;
  --cream-2:#f5efe5;
  --cream-warm:#f3ead7;
  --paper:#ffffff;
  --green:#0f7a34;
  --green-bright:#1c9442;
  --green-dark:#0b5e27;
  --green-soft:#e4f2e1;
  --green-mint:#eef7ec;
  --ink:#1b281f;
  --ink-2:#394a3e;
  --muted:#5c6b60;
  --line:#e6dfd3;
  --gold-pill:#efe1b8;
  --shadow-sm:0 6px 18px -10px rgba(24,54,32,.12);
  --shadow:0 14px 36px -16px rgba(24,54,32,.14);
  --shadow-btn:0 12px 26px -10px rgba(11,94,39,.52);
  --ease:cubic-bezier(.16,1,.3,1);
}

*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;scroll-padding-top:82px}
body{
  margin:0;
  font-family:"Vazirmatn",system-ui,-apple-system,sans-serif;
  background:var(--cream);
  color:var(--ink);
  line-height:1.75;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3,h4{margin:0;font-family:"Estedad","Vazirmatn",sans-serif;line-height:1.32;font-weight:800;text-wrap:balance}
p{margin:0}
button,input,select{font:inherit;color:inherit}
button{cursor:pointer}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:3px solid #2b9c52;outline-offset:3px}
.nums{font-variant-numeric:tabular-nums}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.skip{position:absolute;inset-inline-start:-999px;top:10px;z-index:200;background:#fff;padding:10px 16px;border-radius:12px;border:1px solid var(--green)}
.skip:focus{inset-inline-start:12px}

.container{width:min(1140px,calc(100% - 32px));margin-inline:auto}

.page-shell{
  position:relative;
  background:linear-gradient(180deg,#fcfaf6 0%,#faf7f2 60%,#f7f3eb 100%);
}

/* Soft bottom organic sage wave decoration shared across sections */
.section-wave{
  position:relative;overflow:hidden;
}
.wave-deco{
  position:absolute;inset-inline:0;bottom:-2px;height:86px;width:100%;
  pointer-events:none;z-index:0;opacity:.92;
}
.section-wave>.container{position:relative;z-index:1}

/* Header */
.site-header{
  position:sticky;top:0;z-index:60;
  background:rgba(252,250,246,.92);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(226,219,207,.65);
}
.header-inner{
  height:74px;
  display:flex;align-items:center;justify-content:space-between;gap:20px;
}
.header-spacer{display:none}
.brand-lockup{display:inline-flex;flex-direction:column;align-items:center;gap:1px;flex-shrink:0}
.brand-row{display:inline-flex;align-items:center;gap:7px}
.brand-wordmark{font-family:"Estedad","Vazirmatn",sans-serif;font-size:28px;font-weight:900;color:var(--ink);letter-spacing:-.02em;line-height:1}
.brandmark{
  width:40px;height:40px;flex-shrink:0;
  border-radius:11px;object-fit:cover;object-position:center;
  border:1.5px solid rgba(196,154,69,.6);
  box-shadow:0 4px 12px -4px rgba(11,71,62,.35);
  background:#09443d;display:block;
}
.brand-sub{font-size:10.5px;font-weight:700;color:var(--ink-2);line-height:1.2;white-space:nowrap}

.desktop-nav{display:flex;align-items:center;gap:24px}
.desktop-nav a{
  font-size:14px;font-weight:700;color:var(--ink-2);
  white-space:nowrap;flex-shrink:0;
  padding:6px 2px;position:relative;
  transition:color .16s var(--ease);
}
.desktop-nav a::after{
  content:"";position:absolute;inset-inline:0;bottom:0;height:2px;border-radius:2px;
  background:var(--green);transform:scaleX(0);transform-origin:center;
  transition:transform .18s var(--ease);
}
.desktop-nav a:hover{color:var(--green)}
.desktop-nav a:hover::after{transform:scaleX(1)}

.header-cta{
  display:inline-flex;align-items:center;gap:8px;
  min-height:42px;padding:0 18px;border-radius:999px;
  background:linear-gradient(180deg,#1e9543 0%,#0b6629 100%);
  color:#fff;font-size:13.5px;font-weight:800;
  white-space:nowrap;flex-shrink:0;
  box-shadow:0 8px 20px -8px rgba(11,102,41,.5);
  transition:transform .16s var(--ease),filter .16s var(--ease);
}
.header-cta:hover{transform:translateY(-1px);filter:brightness(1.04)}

.hamburger-btn{
  display:none;width:44px;height:44px;border-radius:12px;
  border:0;background:transparent;color:var(--ink);
  align-items:center;justify-content:center;padding:0;flex-shrink:0;
}
.hamburger-btn:hover{background:rgba(15,122,52,.08)}

/* Mobile Drawer (منوی موبایل) */
.drawer-backdrop[hidden]{display:none!important}
.drawer-backdrop{
  position:fixed;inset:0;z-index:120;
  background:rgba(18,32,22,.42);
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
  display:flex;justify-content:flex-start;
  animation:fadeIn .18s var(--ease);
}
.drawer-panel{
  width:min(84vw,330px);height:100%;
  background:#fcfaf6;
  border-radius:28px 0 0 28px;
  box-shadow:-16px 0 48px rgba(15,35,20,.18);
  padding:22px 20px calc(24px + env(safe-area-inset-bottom,0px));
  display:flex;flex-direction:column;gap:8px;
  overflow-y:auto;
  animation:slideInRTL .22s var(--ease);
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInRTL{from{transform:translateX(28px);opacity:.7}to{transform:none;opacity:1}}
.drawer-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid #ece6da;margin-bottom:8px}
.drawer-close{
  width:42px;height:42px;border-radius:12px;border:0;background:transparent;
  color:var(--ink);display:grid;place-items:center;
}
.drawer-close:hover{background:#eff5ef}
.drawer-links{display:grid;gap:4px}
.drawer-link{
  display:flex;align-items:center;gap:13px;
  min-height:48px;padding:10px 14px;border-radius:14px;
  font-size:15.5px;font-weight:700;color:var(--ink);
  transition:background-color .15s var(--ease),color .15s var(--ease);
}
.drawer-link svg{width:21px;height:21px;color:var(--ink-2);flex-shrink:0}
.drawer-link:hover,.drawer-link.is-active{background:#e4f1e4;color:var(--green-dark)}
.drawer-link.is-active svg,.drawer-link:hover svg{color:var(--green)}
.drawer-cta{
  margin-top:auto;
  display:flex;align-items:center;justify-content:center;gap:10px;
  min-height:52px;padding:12px 18px;border-radius:999px;
  background:linear-gradient(180deg,#1e9543 0%,#0b6629 100%);
  color:#fff;font-size:15px;font-weight:800;
  box-shadow:var(--shadow-btn);
}

/* =========================================================
   SCREEN 1: صفحه اصلی (Hero, Props, 4 Devices, Trust Bar)
========================================================= */
.hero-wrap{
  position:relative;padding:22px 0 34px;overflow:hidden;
  background:
    radial-gradient(ellipse 65% 45% at 8% 72%, rgba(206,229,205,.55) 0%, transparent 70%),
    radial-gradient(ellipse 55% 45% at 92% 68%, rgba(214,233,212,.52) 0%, transparent 70%);
}
.hero-wave-band{
  position:absolute;inset-inline:0;top:40%;height:180px;pointer-events:none;z-index:0;opacity:.85;
}
.hero-wrap>.container{position:relative;z-index:1}

.hero-grid{
  display:grid;
  grid-template-columns:minmax(0,.94fr) minmax(0,1.06fr);
  gap:36px;align-items:center;
}
.hero-copy{display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.hero-title{
  font-size:clamp(30px,4.1vw,52px);
  font-weight:900;
  line-height:1.28;
  color:var(--ink);
  letter-spacing:-.02em;
}
.hero-title__accent{
  display:inline-block;position:relative;color:#117d35;
  padding-bottom:9px;
}
.hero-title__swoosh{
  position:absolute;inset-inline:0;bottom:0;width:100%;height:12px;pointer-events:none;
}
.hero-desc{
  font-size:15.5px;line-height:1.88;color:var(--ink-2);max-width:44ch;
}
.hero-actions{
  display:flex;flex-direction:column;gap:12px;width:100%;max-width:440px;margin-top:12px;
}
.btn-hero-primary{
  position:relative;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  min-height:56px;padding:8px 20px;border-radius:999px;border:0;
  background:linear-gradient(180deg,#28a74c 0%,#0f7831 55%,#095b23 100%);
  color:#fff;font-size:clamp(15px,4vw,18px);font-weight:900;
  box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 14px 28px -10px rgba(9,91,35,.55);
  transition:transform .16s var(--ease),filter .16s var(--ease);
}
.btn-hero-primary:hover{transform:translateY(-2px);filter:brightness(1.04)}
.btn-hero-primary__label{flex:1;text-align:center;white-space:nowrap}
.hero-limit-badge{
  position:absolute;top:-13px;inset-inline-end:20px;z-index:2;
  display:inline-flex;align-items:center;gap:6px;
  padding:2.5px 11px;border-radius:999px;
  background:linear-gradient(135deg,#fff7da 0%,#f5d167 100%);
  border:1.5px solid #fff;
  color:#0b4a20;font-size:11.5px;font-weight:900;line-height:1.4;
  white-space:nowrap;
  box-shadow:0 6px 14px -4px rgba(11,74,32,.36);
}
.hero-limit-badge__dot{
  width:7px;height:7px;border-radius:50%;flex-shrink:0;
  background:#117a34;
  box-shadow:0 0 0 3px rgba(17,122,52,.22);
}
.btn-hero-primary__sparkles{
  display:inline-flex;align-items:center;gap:6px;
  padding-inline-start:12px;border-inline-start:1px solid rgba(255,255,255,.35);
}

/* Before/After Comparison Card blending softly on cream */
.hero-visual{position:relative}
.compare-card{
  position:relative;
  aspect-ratio:4/4.7;
  max-height:530px;
  width:100%;
  border-radius:24px;
  overflow:hidden;
  background:#e9dfd2;
  box-shadow:0 22px 46px -22px rgba(24,45,28,.22);
  border:3px solid rgba(255,255,255,.85);
  direction:ltr;
  user-select:none;-webkit-user-select:none;
  touch-action:pan-y;
  --split:48%;
}
.compare-card img{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;object-position:50% 18%;pointer-events:none;
}
.compare-card__after{
  clip-path:inset(0 0 0 var(--split));
}
.compare-card__line{
  position:absolute;top:0;bottom:0;left:var(--split);
  width:2.5px;margin-left:-1.25px;background:rgba(255,255,255,.95);
  box-shadow:0 0 10px rgba(0,0,0,.3);pointer-events:none;z-index:3;
}
.compare-card__grip{
  position:absolute;left:var(--split);top:50%;transform:translate(-50%,-50%);
  width:40px;height:40px;border-radius:50%;
  background:rgba(255,255,255,.96);color:var(--ink);
  display:grid;place-items:center;
  box-shadow:0 6px 18px rgba(0,0,0,.22);pointer-events:none;z-index:4;
  border:1.5px solid rgba(15,122,52,.18);
}
.compare-tag{
  position:absolute;bottom:14px;z-index:4;
  min-width:56px;padding:3px 14px;border-radius:999px;
  font-size:13px;font-weight:800;text-align:center;pointer-events:none;
  box-shadow:0 4px 12px rgba(0,0,0,.14);
}
.compare-tag--before{left:14px;background:var(--gold-pill);color:#362d1b}
.compare-tag--after{right:14px;background:var(--green);color:#fff}
.compare-range{
  position:absolute;inset:0;width:100%;height:100%;
  opacity:0;margin:0;cursor:ew-resize;z-index:5;
}
.compare-card:focus-within{outline:3px solid var(--green);outline-offset:3px}

/* Devices Showcase Card */
.devices-panel{
  margin-top:24px;
  background:#fff;
  border:1px solid #ece5d9;
  border-radius:22px;
  padding:20px 22px 22px;
  box-shadow:var(--shadow-sm);
}
.devices-panel__head{
  display:flex;align-items:center;gap:14px;justify-content:center;
  margin-bottom:18px;color:var(--ink);
  font-family:"Estedad","Vazirmatn",sans-serif;font-size:15px;font-weight:800;
  text-align:center;
}
.devices-panel__head::before,.devices-panel__head::after{
  content:"";height:1.5px;flex:1;max-width:130px;background:#cde0cb;
}
.devices-grid{
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 18px;
  max-width:720px;margin-inline:auto;
  align-items:end;
}
.device-tile{
  display:flex;flex-direction:column;align-items:center;gap:10px;
  padding:6px 4px 2px;
  transition:transform .18s var(--ease);
}
.device-tile:hover{transform:translateY(-3px)}
.device-stage{
  height:112px;width:100%;display:flex;align-items:flex-end;justify-content:center;position:relative;
}
.hw-phone{
  width:50px;height:96px;border-radius:11px;padding:3.5px;
  background:linear-gradient(145deg,#2d3630,#141a16);
  box-shadow:0 12px 20px -10px rgba(0,0,0,.38);position:relative;
}
.hw-phone::before{content:"";position:absolute;top:5px;left:50%;transform:translateX(-50%);width:14px;height:2.5px;border-radius:3px;background:#3a443e;z-index:2}
.hw-tablet-wrap{position:relative;display:flex;align-items:flex-end}
.hw-tablet-kick{
  position:absolute;right:-7px;bottom:3px;width:16px;height:44px;
  background:#151b17;border-radius:3px;transform:skewY(-14deg);z-index:0;
}
.hw-tablet{
  position:relative;z-index:1;
  width:98px;height:74px;border-radius:9px;padding:4px;
  background:linear-gradient(145deg,#2a322d,#151b17);
  transform:perspective(420px) rotateY(-12deg);
  box-shadow:0 14px 24px -12px rgba(0,0,0,.38);
}
.hw-kiosk-wrap{display:flex;flex-direction:column;align-items:center}
.hw-kiosk{
  width:58px;height:82px;border-radius:7px;padding:4px;
  background:linear-gradient(145deg,#2b332e,#141a16);
  transform:perspective(360px) rotateY(14deg) rotateX(8deg);
  box-shadow:0 12px 22px -10px rgba(0,0,0,.38);
}
.hw-kiosk-stand{width:10px;height:14px;background:#222a25;margin-top:-2px}
.hw-kiosk-base{width:42px;height:6px;border-radius:99px;background:#181f1b;box-shadow:0 4px 10px -2px rgba(0,0,0,.3)}
.hw-tv-wrap{display:flex;flex-direction:column;align-items:center}
.hw-tv{
  width:136px;height:82px;border-radius:5px;padding:3.5px;
  background:#151b17;box-shadow:0 14px 24px -12px rgba(0,0,0,.38);
}
.hw-tv-legs{
  width:90px;display:flex;justify-content:space-between;padding-top:1px;
}
.hw-tv-legs span{
  display:block;width:3px;height:10px;background:#1c231f;border-radius:2px;
}
.hw-tv-legs span:first-child{transform:rotate(18deg)}
.hw-tv-legs span:last-child{transform:rotate(-18deg)}
.hw-screen{width:100%;height:100%;border-radius:4px;overflow:hidden;background:#f4efe6}
.hw-screen img{width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.device-label{
  display:inline-flex;align-items:center;gap:5px;
  font-size:12.5px;font-weight:800;color:var(--ink);white-space:nowrap;
}
.device-label svg{width:15px;height:15px;color:var(--green)}

/* Bottom Green Trust Strip */
.trust-banner{
  margin-top:20px;
  border-radius:18px;
  background:linear-gradient(135deg,#1d883f 0%,#0b5c26 100%);
  color:#fff;
  padding:16px 14px;
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  box-shadow:0 16px 34px -18px rgba(11,92,38,.55);
}
.trust-item{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;gap:3px;padding:2px 10px;
  position:relative;
}
.trust-item:not(:last-child)::after{
  content:"";position:absolute;inset-inline-end:0;top:10%;bottom:10%;
  width:1px;background:rgba(255,255,255,.24);
}
.trust-item svg{width:26px;height:26px;color:#fff;margin-bottom:3px}
.trust-item b{font-family:"Estedad","Vazirmatn",sans-serif;font-size:14px;font-weight:800}
.trust-item span{font-size:11.5px;color:rgba(255,255,255,.9)}

/* Shared Section Typography */
.section{padding:54px 0;position:relative}
.section--soft{
  background:linear-gradient(180deg,#fcfaf6 0%,#f7f3eb 100%);
}
.section-head{text-align:center;max-width:620px;margin:0 auto 28px}
.section-head h2{font-size:clamp(24px,3.2vw,34px);color:var(--ink);font-weight:900}
.section-head p{margin-top:6px;color:var(--muted);font-size:14.5px}

/* =========================================================
   SCREEN 2: امکانات و مزایا (Matches image_b12ff199.png)
========================================================= */
.benefits-head{
  text-align:center;max-width:920px;margin:0 auto 26px;
}
.benefits-head h2{font-size:clamp(24px,3.4vw,34px);color:var(--ink);font-weight:900;line-height:1.35}
.benefits-grid{
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;
  max-width:920px;margin-inline:auto;
}
.benefit-card{
  display:flex;align-items:center;gap:14px;
  padding:14px 16px;border-radius:22px;
  background:#fff;border:1px solid #ece5d8;
  box-shadow:0 8px 22px -14px rgba(24,54,32,.14);
  transition:transform .18s var(--ease),box-shadow .18s var(--ease);
}
.benefit-card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.benefit-card--warm{background:linear-gradient(90deg,#ffffff 0%,#f9ebe6 100%)}
.benefit-card--ivory{background:linear-gradient(90deg,#ffffff 0%,#f9f5eb 100%)}
.benefit-card--mint{background:linear-gradient(90deg,#ffffff 0%,#f5faf4 100%)}
.benefit-card--sage{background:linear-gradient(90deg,#ffffff 0%,#f3f9f2 100%)}
.benefit-card__ico{
  width:60px;height:60px;border-radius:50%;flex-shrink:0;
  display:grid;place-items:center;
}
.benefit-card--warm .benefit-card__ico{background:#dff0cf;color:#0e7a34}
.benefit-card--ivory .benefit-card__ico{background:#f3ede0;color:#27342b}
.benefit-card--mint .benefit-card__ico{background:#e2f1de;color:#117a34}
.benefit-card--sage .benefit-card__ico{background:#e2f1de;color:#117a34}
.benefit-card__ico svg{width:30px;height:30px}
.benefit-card__body{min-width:0;text-align:start}
.benefit-card__body h3{font-size:18px;font-weight:900;color:var(--ink);margin-bottom:2px}
.benefit-card__body p{font-size:13.5px;color:var(--muted);line-height:1.65}

/* =========================================================
   SCREEN 3: نحوه استفاده (Matches image_219ae48c.png)
========================================================= */
.steps-grid{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;
  max-width:1040px;margin-inline:auto;
}
.step-card{
  position:relative;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:#fff;border:1px solid #eae3d7;border-radius:20px;
  padding:14px 16px;
  box-shadow:0 10px 24px -16px rgba(24,54,32,.14);
}
.step-badge{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  background:var(--green);color:#fff;
  display:grid;place-items:center;
  font-family:"Estedad","Vazirmatn",sans-serif;font-size:15.5px;font-weight:900;
  box-shadow:0 6px 14px -6px rgba(15,122,52,.55);
}
.step-text{flex:1;min-width:0;text-align:start}
.step-text h3{font-size:16.5px;font-weight:900;color:var(--ink);line-height:1.48}
.step-thumb{
  width:78px;height:96px;border-radius:14px;overflow:hidden;flex-shrink:0;
  background:#f4efe6;border:2.5px solid #1b241d;
  box-shadow:0 8px 18px -10px rgba(0,0,0,.28);
}
.step-thumb img{width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.step-trio{
  display:grid;grid-template-columns:repeat(3,1fr);gap:4px;
  width:118px;height:96px;flex-shrink:0;
  padding:5px;border-radius:14px;background:#f8f6f2;border:1px solid #e6dfd3;
  box-shadow:0 6px 16px -12px rgba(0,0,0,.18);
}
.step-trio img{width:100%;height:100%;object-fit:cover;border-radius:6px;background:#fff}
.steps-cta-wrap{text-align:center;margin-top:26px}
.btn-speed-pill{
  display:inline-flex;align-items:center;justify-content:center;gap:12px;
  min-height:52px;min-width:290px;padding:10px 32px;border-radius:999px;
  background:linear-gradient(180deg,#28a74c 0%,#0f7831 55%,#095b23 100%);
  color:#fff;font-size:16.5px;font-weight:900;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.3),var(--shadow-btn);
  transition:transform .16s var(--ease);
}
.btn-speed-pill:hover{transform:translateY(-2px)}

/* =========================================================
   SCREENS 6 & 7: ثبت درخواست & تایید درخواست
   Matches image_e41c6827.png & image_b6b473da.png
========================================================= */
.request-wrap{
  max-width:560px;margin-inline:auto;
}
.request-head{
  display:flex;align-items:center;justify-content:space-between;gap:14px;
  margin-bottom:10px;
}
.request-head__text h2{
  font-size:clamp(24px,4vw,30px);font-weight:900;color:var(--ink);line-height:1.35;
}
.request-head__text h2 span{
  display:block;color:#117d35;
}
.request-desc{
  font-size:14px;color:var(--muted);line-height:1.85;margin-bottom:18px;
}
.request-plan-note{
  display:inline-block;margin-bottom:14px;font-size:12.5px;font-weight:800;color:var(--green);
}
.calendar-illo{
  width:92px;height:92px;flex-shrink:0;
}

.lead-form{display:grid;gap:12px}
.input-row{
  position:relative;display:flex;align-items:center;
  background:#fff;border:1px solid #e6dfd3;border-radius:16px;
  min-height:54px;padding-inline:16px;gap:11px;
  box-shadow:0 6px 16px -12px rgba(24,54,32,.14);
  transition:border-color .16s var(--ease),box-shadow .16s var(--ease);
}
.input-row:focus-within{
  border-color:var(--green);
  box-shadow:0 0 0 3px rgba(15,122,52,.14);
}
.input-row svg{width:20px;height:20px;color:var(--ink);flex-shrink:0}
.input-row input,.input-row select{
  width:100%;min-height:50px;border:0;background:transparent;
  outline:none;font-size:14.5px;font-weight:600;color:var(--ink);
}
.input-row input::placeholder{color:#5e6a61;font-weight:600}
.input-row select{
  cursor:pointer;appearance:none;-webkit-appearance:none;
  padding-inline-end:26px;font-weight:600;
}
.input-row__chev{
  position:absolute;inset-inline-end:16px;pointer-events:none;
  width:18px;height:18px;color:var(--ink-2);
}
.btn-submit{
  margin-top:8px;position:relative;
  display:flex;align-items:center;justify-content:center;gap:10px;
  min-height:56px;border-radius:999px;border:0;
  background:linear-gradient(180deg,#28a74c 0%,#0f7831 55%,#095b23 100%);
  color:#fff;font-size:17px;font-weight:900;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.32),var(--shadow-btn);
  transition:transform .16s var(--ease),opacity .16s var(--ease);
}
.btn-submit:hover{transform:translateY(-1px)}
.btn-submit:disabled{opacity:.65;cursor:not-allowed;transform:none}
.btn-submit__ghost-ico{
  position:absolute;inset-inline-end:22px;opacity:.55;pointer-events:none;
}
.form-error{
  margin:2px 0 0;padding:10px 14px;border-radius:12px;
  background:#fdf0ef;color:#9c2623;font-size:13px;font-weight:700;
}
.form-success{
  margin:2px 0 0;padding:12px 16px;border-radius:12px;
  background:#e7f4e4;color:var(--green-dark);font-size:13.5px;font-weight:800;
  text-align:center;
}

/* FAQ Section */
.faq-list{max-width:740px;margin-inline:auto;display:grid;gap:10px}
.faq-list details{
  background:#fff;border:1px solid #e6dfd3;border-radius:16px;padding:4px 18px;
  box-shadow:var(--shadow-sm);
}
.faq-list details summary{
  list-style:none;cursor:pointer;min-height:54px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  font-weight:800;font-size:15px;color:var(--ink);
}
.faq-list details summary::-webkit-details-marker{display:none}
.faq-list details summary::after{
  content:"+";font-size:22px;font-weight:700;color:var(--green);flex-shrink:0;
}
.faq-list details[open] summary::after{content:"−"}
.faq-list details p{padding:0 0 16px;font-size:14px;color:var(--muted);line-height:1.85}

/* Footer */
.site-footer{
  background:linear-gradient(135deg,#0d602a 0%,#08421c 100%);
  color:#eaf5ec;padding:34px 0 26px;
}
.footer-inner{
  display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;
}
.footer-brand b{font-family:"Estedad","Vazirmatn",sans-serif;font-size:20px;color:#fff;display:block}
.footer-brand small{font-size:12.5px;color:rgba(234,245,236,.82)}
.footer-links{display:flex;flex-wrap:wrap;gap:18px;font-size:13.5px;font-weight:700}
.footer-links a{padding:4px 0;color:#eaf5ec}
.footer-links a:hover{text-decoration:underline}
.footer-contact-grid{
  margin-top:22px;
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;
}
.footer-card{
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.15);
  border-radius:16px;
  padding:16px 18px;
  display:grid;gap:11px;
}
.footer-card__title{
  font-family:"Estedad","Vazirmatn",sans-serif;
  font-size:14px;font-weight:800;color:#f7df87;
  margin-bottom:2px;
}
.footer-row{
  display:flex;align-items:flex-start;gap:10px;
  font-size:13.5px;line-height:1.65;color:#eaf5ec;
}
.footer-row svg{
  width:18px;height:18px;flex-shrink:0;margin-top:3px;
  color:#a8e5b7;
}
.footer-row a{
  color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:3px;
  text-decoration-color:rgba(255,255,255,.35);
}
.footer-row a:hover{color:#f7df87;text-decoration-color:#f7df87}
.footer-bottom{
  margin-top:20px;padding-top:14px;border-top:1px solid rgba(255,255,255,.16);
  display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;
  font-size:12px;color:rgba(234,245,236,.76);
}

/* Desktop card frame around Request section so it feels balanced on wide screens */
@media (min-width: 761px){
  .hero-actions-mobile{display:none}
  .request-wrap{
    background:#fff;border:1px solid #eae2d5;border-radius:26px;
    padding:30px 28px;box-shadow:var(--shadow);
  }
}

/* Tablet & Mobile Responsive */
@media (max-width: 960px){
  .desktop-nav,.header-cta{display:none}
  .hamburger-btn{display:inline-flex}
  .header-spacer{display:block;width:44px;flex-shrink:0}
  .header-inner{height:72px}
  .steps-grid{grid-template-columns:1fr;max-width:500px}
}

@media (max-width: 760px){
  .container{width:min(540px,calc(100% - 26px))}
  .hero-wrap{padding:12px 0 24px}
  .hero-grid{
    grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);
    gap:10px;align-items:center;
  }
  .hero-title{font-size:clamp(22px,6.2vw,30px);line-height:1.24}
  .hero-desc{font-size:12.5px;line-height:1.75}
  .hero-copy{gap:8px}
  .hero-actions{display:none}
  .hero-actions-mobile{display:flex;flex-direction:column;gap:10px;margin-top:20px}
  .compare-card{
    aspect-ratio:3/4.15;border-width:2px;border-radius:18px;
    box-shadow:0 16px 34px -16px rgba(24,45,28,.22);
  }
  .compare-card__grip{width:34px;height:34px}
  .compare-tag{bottom:10px;min-width:46px;padding:2px 10px;font-size:11.5px}
  .compare-tag--before{left:8px}.compare-tag--after{right:8px}
  .btn-hero-primary{min-height:52px;font-size:clamp(14.5px,4vw,16.5px);padding:8px 16px}

  .devices-panel{padding:18px 14px 18px;border-radius:20px;margin-top:18px}
  .devices-panel__head{font-size:13px;gap:8px;margin-bottom:14px}
  .devices-grid{gap:18px 12px}
  .device-stage{height:96px}
  .hw-phone{width:44px;height:84px;border-radius:10px;padding:3px}
  .hw-tablet{width:86px;height:64px;border-radius:8px;padding:3.5px}
  .hw-tablet-kick{right:-6px;width:14px;height:36px}
  .hw-kiosk{width:50px;height:72px;border-radius:6px;padding:3.5px}
  .hw-kiosk-stand{width:8px;height:12px}.hw-kiosk-base{width:34px;height:5px}
  .hw-tv{width:112px;height:68px;border-radius:5px;padding:3px}
  .hw-tv-legs{width:72px}.hw-tv-legs span{height:9px}
  .device-label{font-size:12px;gap:5px}
  .device-label svg{width:14px;height:14px}

  .trust-banner{padding:13px 6px;border-radius:16px}
  .trust-item{padding:2px 5px}
  .trust-item svg{width:21px;height:21px}
  .trust-item b{font-size:11.5px}
  .trust-item span{font-size:9.5px;line-height:1.4}

  .section{padding:38px 0}
  .section-head{margin-bottom:20px}
  /* Screen 2 mobile exact alignment */
  .benefits-head{text-align:start;margin-bottom:18px}
  .benefits-grid{grid-template-columns:1fr;gap:12px}
  .benefit-card{padding:12px 14px;border-radius:20px}
  .benefit-card__ico{width:56px;height:56px}
  .benefit-card__body h3{font-size:16.5px}
  .benefit-card__body p{font-size:12.5px}

  /* Screen 3 mobile exact proportions */
  .step-card{padding:12px 14px;border-radius:18px}
  .step-text h3{font-size:15px}
  .step-thumb{width:70px;height:86px;border-radius:12px}
  .step-trio{width:104px;height:86px;border-radius:12px}

  .calendar-illo{width:82px;height:82px}
  .footer-contact-grid{grid-template-columns:1fr;gap:12px}
  .footer-card{padding:14px 15px}
}

@media (max-width: 350px){
  .hero-grid{grid-template-columns:1fr}
  .devices-grid{grid-template-columns:repeat(2,1fr)}
}

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}
}
</style>
</head>
<body class="page-shell">
<a class="skip" href="#main">پرش به محتوای اصلی</a>

<header class="site-header">
  <div class="container header-inner">
    <div class="header-spacer" aria-hidden="true"></div>

    <a class="brand-lockup" href="#top" aria-label="آینه؛ صفحه اصلی">
      <span class="brand-row">
        <span class="brand-wordmark">آینه</span>
        <img class="brandmark" src="${brandLogoSrc}" width="40" height="40" alt="مزون آینه" decoding="async">
      </span>
      <span class="brand-sub">پرو مجازی لباس عروس با هوش مصنوعی</span>
    </a>

    <nav class="desktop-nav" aria-label="منوی اصلی">
      <a href="#top">صفحه اصلی</a>
      <a href="#benefits">امکانات و مزایا</a>
      <a href="#steps">نحوه استفاده</a>
      <a href="#faq">سوالات متداول</a>
    </nav>

    <a class="header-cta" href="#request" data-select-trial>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
      <span>۳ روز آزمایشی رایگان</span>
    </a>

    <button class="hamburger-btn" id="menu-open" type="button" aria-label="باز کردن منو" aria-controls="mobile-drawer" aria-expanded="false">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
</header>

<main id="main">
  <!-- Screen 1: صفحه اصلی -->
  <section id="top" class="hero-wrap">
    <svg class="hero-wave-band" viewBox="0 0 1200 180" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 110C220 40 420 155 690 95C940 40 1070 110 1200 70V180H0V110Z" fill="#d9ebd7" fill-opacity=".45"/>
      <path d="M0 140C280 85 520 175 820 115C1020 75 1120 125 1200 105V180H0V140Z" fill="#c7e2c5" fill-opacity=".35"/>
    </svg>

    <div class="container">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="hero-title">
            پیش از پرو،<br>
            لباس‌های مزون را<br>
            روی تن عروس<br>
            <span class="hero-title__accent">
              نشان دهید
              <svg class="hero-title__swoosh" viewBox="0 0 220 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 10C72 2.5 152 2.2 216 7.5" stroke="#137d35" stroke-width="4.5" stroke-linecap="round"/>
              </svg>
            </span>
          </h1>
          <p class="hero-desc">
            با آینه، لباس‌های مزون شما قبل از پرو حضوری به‌صورت واقعی روی چهره و اندام عروس نمایش داده می‌شوند تا سریع‌تر مقایسه کند و با اطمینان سفارش بدهد.
          </p>

          <div class="hero-actions">
            <a class="btn-hero-primary" href="#request" data-select-trial>
              <span class="hero-limit-badge"><span class="hero-limit-badge__dot" aria-hidden="true"></span><span>فقط <b class="nums">۲۰</b> مزون</span></span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              <span class="btn-hero-primary__label">۳ روز نسخه آزمایشی رایگان</span>
              <span class="btn-hero-primary__sparkles" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#f7df87"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm7 12l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/></svg>
              </span>
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="compare-card" id="hero-compare">
            <img src="/landing/hero-before.webp" width="480" height="640" alt="تصویر اولیه عروس پیش از پرو در مزون" fetchpriority="high">
            <img class="compare-card__after" src="/landing/hero-after.webp" width="480" height="640" alt="نمایش واقعی لباس عروس مزون پس از پرو مجازی" fetchpriority="high">
            <div class="compare-card__line" aria-hidden="true"></div>
            <div class="compare-card__grip" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17l-5-5 5-5M15 7l5 5-5 5"/></svg>
            </div>
            <span class="compare-tag compare-tag--before">قبل</span>
            <span class="compare-tag compare-tag--after">بعد</span>
            <input class="compare-range" id="compare-range" type="range" min="0" max="100" value="48" dir="ltr" aria-label="تغییر خط مقایسه قبل و بعد">
          </div>
        </div>
      </div>

      <!-- Mobile Hero CTA directly below split -->
      <div class="hero-actions-mobile">
        <a class="btn-hero-primary" href="#request" data-select-trial>
          <span class="hero-limit-badge"><span class="hero-limit-badge__dot" aria-hidden="true"></span><span>فقط <b class="nums">۲۰</b> مزون</span></span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          <span class="btn-hero-primary__label">۳ روز نسخه آزمایشی رایگان</span>
          <span class="btn-hero-primary__sparkles" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f7df87"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zm7 12l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z"/></svg>
          </span>
        </a>
      </div>

      <!-- Devices Showcase -->
      <div class="devices-panel" id="devices">
        <div class="devices-panel__head">در مزون شما روی هر دستگاهی در دسترس است</div>
        <div class="devices-grid">
          <div class="device-tile">
            <div class="device-stage" aria-hidden="true">
              <div class="hw-kiosk-wrap">
                <div class="hw-kiosk"><div class="hw-screen"><img src="/landing/hero-after.webp" alt="" loading="lazy"></div></div>
                <div class="hw-kiosk-stand"></div>
                <div class="hw-kiosk-base"></div>
              </div>
            </div>
            <div class="device-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="2" width="12" height="15" rx="2"/><path d="M12 17v4M8 21h8"/></svg>
              <span>کیوسک مزون</span>
            </div>
          </div>

          <div class="device-tile">
            <div class="device-stage" aria-hidden="true">
              <div class="hw-tv-wrap">
                <div class="hw-tv"><div class="hw-screen"><img src="/landing/hero-after.webp" alt="" loading="lazy"></div></div>
                <div class="hw-tv-legs"><span></span><span></span></div>
              </div>
            </div>
            <div class="device-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              <span>تلویزیون هوشمند</span>
            </div>
          </div>

          <div class="device-tile">
            <div class="device-stage" aria-hidden="true">
              <div class="hw-phone"><div class="hw-screen"><img src="/landing/hero-after.webp" alt="" loading="lazy"></div></div>
            </div>
            <div class="device-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18.5h2"/></svg>
              <span>گوشی موبایل</span>
            </div>
          </div>

          <div class="device-tile">
            <div class="device-stage" aria-hidden="true">
              <div class="hw-tablet-wrap">
                <div class="hw-tablet"><div class="hw-screen"><img src="/landing/hero-after.webp" alt="" loading="lazy"></div></div>
                <div class="hw-tablet-kick"></div>
              </div>
            </div>
            <div class="device-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M18 11v2"/></svg>
              <span>تبلت</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Green Trust Strip -->
      <div class="trust-banner" aria-label="اعتماد و حریم خصوصی">
        <div class="trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l8 3.5v6c0 5-3.4 8.8-8 10.5-4.6-1.7-8-5.5-8-10.5v-6L12 2z"/><rect x="9.5" y="11" width="5" height="4" rx="1"/><path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11"/></svg>
          <b>حفظ حریم خصوصی</b>
          <span>تصاویر مزون و مشتریان محرمانه می‌ماند</span>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M12 6.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 8.3l2-.3z"/><path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5"/></svg>
          <b>مورد اعتماد مزون‌ها</b>
          <span>همکاری با مزون‌های معتبر</span>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.1 5.9L20 10l-5.9 2.1L12 18l-2.1-5.9L4 10l5.9-2.1L12 2z"/><path d="M19 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/></svg>
          <b>برای اولین بار در ایران</b>
          <span>پرو مجازی تخصصی لباس عروس</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Screen 2: امکانات و مزایا (image_b12ff199.png) -->
  <section id="benefits" class="section section--soft section-wave">
    <div class="container">
      <div class="benefits-head">
        <h2>چرا مزون‌ها<br>آینه را انتخاب می‌کنند؟</h2>
      </div>
      <div class="benefits-grid">
        <article class="benefit-card benefit-card--warm">
          <div class="benefit-card__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M6 16v-3M11 16V9M16 16V5M5 11l6-5 4 2 4-4M16 4h3v3"/></svg>
          </div>
          <div class="benefit-card__body">
            <h3>افزایش فروش</h3>
            <p>نمایش سریع مدل‌های متنوع مزون و تبدیل سریع‌تر بازدید به سفارش</p>
          </div>
        </article>

        <article class="benefit-card benefit-card--ivory">
          <div class="benefit-card__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>
          </div>
          <div class="benefit-card__body">
            <h3>کاهش هزینه و زمان</h3>
            <p>کاهش پروهای متعدد، اتوکشی و استهلاک لباس‌های مزون</p>
          </div>
        </article>

        <article class="benefit-card benefit-card--mint">
          <div class="benefit-card__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-7.5-10.3A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.8c0 5.6-7.5 10.3-7.5 10.3z"/></svg>
          </div>
          <div class="benefit-card__body">
            <h3>رضایت بیشتر مشتری</h3>
            <p>انتخاب آگاهانه عروس و کاهش تردید در لحظه تصمیم</p>
          </div>
        </article>

        <article class="benefit-card benefit-card--sage">
          <div class="benefit-card__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 3.5L12 6l3.5-2.5L16.5 9l-2 3.5 3.5 8.5H6l3.5-8.5-2-3.5z"/></svg>
          </div>
          <div class="benefit-card__body">
            <h3>پوشش کامل مدل‌ها</h3>
            <p>امکان نمایش تمامی کالکشن و لباس‌های مزون شما روی مشتری</p>
          </div>
        </article>
      </div>
    </div>
    <svg class="wave-deco" viewBox="0 0 1200 86" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 44C260 10 540 76 840 36C1010 14 1120 34 1200 22V86H0V44Z" fill="#dcecd9" fill-opacity=".6"/>
      <path d="M0 64C340 30 620 84 960 44C1080 30 1150 48 1200 42V86H0V64Z" fill="#c7e1c4" fill-opacity=".5"/>
    </svg>
  </section>

  <!-- Screen 3: نحوه استفاده (image_219ae48c.png) -->
  <section id="steps" class="section section-wave">
    <div class="container">
      <div class="section-head">
        <h2>آینه چطور کار می‌کند؟</h2>
      </div>
      <div class="steps-grid">
        <article class="step-card">
          <span class="step-badge nums">۱</span>
          <div class="step-text">
            <h3>تصویر عروس را<br>ثبت یا بارگذاری کنید</h3>
          </div>
          <div class="step-thumb">
            <img src="/landing/hero-before.webp" alt="تصویر اولیه عروس" loading="lazy">
          </div>
        </article>

        <article class="step-card">
          <span class="step-badge nums">۲</span>
          <div class="step-text">
            <h3>لباس‌های مزون را<br>انتخاب کنید</h3>
          </div>
          <div class="step-trio" aria-hidden="true">
            <img src="/catalog/dress/01.webp" alt="" loading="lazy">
            <img src="/catalog/dress/02.webp" alt="" loading="lazy">
            <img src="/catalog/dress/06.webp" alt="" loading="lazy">
          </div>
        </article>

        <article class="step-card">
          <span class="step-badge nums">۳</span>
          <div class="step-text">
            <h3>نتیجه واقعی را<br>به مشتری نشان دهید</h3>
          </div>
          <div class="step-thumb">
            <img src="/landing/hero-after.webp" alt="نتیجه پرو مجازی لباس مزون روی تصویر عروس" loading="lazy">
          </div>
        </article>
      </div>

      <div class="steps-cta-wrap">
        <a class="btn-speed-pill" href="#request">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f7df87" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>
          <span>همه در چند ثانیه!</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f7df87" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>
        </a>
      </div>
    </div>
    <svg class="wave-deco" viewBox="0 0 1200 86" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 54C300 20 620 80 940 34C1080 15 1150 38 1200 28V86H0V54Z" fill="#dcecd9" fill-opacity=".55"/>
    </svg>
  </section>

  <!-- Screens 6 & 7: ثبت درخواست & تایید درخواست (image_e41c6827.png & image_b6b473da.png) -->
  <section id="request" class="section section--soft section-wave">
    <span id="demo-request"></span>
    <div class="container">
      <div class="request-wrap">
        <div id="request-form-view">
          <div class="request-head">
            <div class="request-head__text">
              <h2>درخواست<span>آزمایش ۳ روزه رایگان</span></h2>
            </div>

            <!-- Calendar + Gift Illustration matching image_e41c6827.png -->
            <svg class="calendar-illo" viewBox="0 0 110 110" fill="none" aria-hidden="true">
              <circle cx="52" cy="54" r="46" fill="#dcefd5" fill-opacity=".55"/>
              <g transform="rotate(-7 46 54)">
                <rect x="14" y="22" width="60" height="62" rx="11" fill="#fcfaf2" stroke="#223626" stroke-width="2.6"/>
                <path d="M14 37C14 28 19 22 25 22H63C69 22 74 28 74 37H14Z" fill="#177835" stroke="#223626" stroke-width="2.2"/>
                <rect x="25" y="13" width="6" height="14" rx="3" fill="#f7f2e5" stroke="#223626" stroke-width="2"/>
                <rect x="57" y="13" width="6" height="14" rx="3" fill="#f7f2e5" stroke="#223626" stroke-width="2"/>
                <text x="44" y="56" text-anchor="middle" font-family="Estedad,Vazirmatn,sans-serif" font-size="14" font-weight="900" fill="#1b281f">۳ روز</text>
                <text x="44" y="72" text-anchor="middle" font-family="Vazirmatn,sans-serif" font-size="11" font-weight="800" fill="#117a34">رایگان</text>
              </g>
              <g transform="translate(58 50)">
                <rect x="2" y="10" width="32" height="28" rx="6" fill="#f7b924" stroke="#185427" stroke-width="2"/>
                <rect x="0" y="6" width="36" height="8" rx="3" fill="#ffd046" stroke="#185427" stroke-width="2"/>
                <path d="M18 6v32" stroke="#167c35" stroke-width="4.5"/>
                <path d="M18 6c-4-6-11-5-10 0s10 0 10 0zm0 0c4-6 11-5 10 0s-10 0-10 0z" fill="#28a74c" stroke="#185427" stroke-width="1.6"/>
              </g>
            </svg>
          </div>

          <p class="request-desc">مشخصات مزون خود را وارد کنید تا کارشناسان آینه در کوتاه‌ترین زمان برای فعال‌سازی نسخه آزمایشی با شما تماس بگیرند.</p>
          <span class="request-plan-note" id="selected-plan-label" hidden>انتخاب فعلی: آزمایش رایگان ۳ روزه</span>

          <form id="lead-form" class="lead-form" novalidate>
            <label class="sr-only" for="field-name">نام و نام خانوادگی</label>
            <div class="input-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5"/></svg>
              <input id="field-name" name="name" type="text" required minlength="2" maxlength="60" autocomplete="name" placeholder="نام و نام خانوادگی">
            </div>

            <label class="sr-only" for="field-salon">نام مزون / مجموعه</label>
            <div class="input-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/></svg>
              <input id="field-salon" name="salon" type="text" required minlength="2" maxlength="80" autocomplete="organization" placeholder="نام مزون / مجموعه">
            </div>

            <label class="sr-only" for="field-phone">شماره تماس</label>
            <div class="input-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <input id="field-phone" name="phone" type="tel" inputmode="tel" dir="rtl" required maxlength="20" autocomplete="tel" placeholder="شماره تماس">
            </div>

            <label class="sr-only" for="field-city">شهر</label>
            <div class="input-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.7-6-10.5a6 6 0 1 1 12 0C18 15.3 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg>
              <select id="field-city" name="city" required>
                <option value="" disabled selected>شهر</option>
                <option value="تهران">تهران</option>
                <option value="مشهد">مشهد</option>
                <option value="اصفهان">اصفهان</option>
                <option value="شیراز">شیراز</option>
                <option value="تبریز">تبریز</option>
                <option value="کرج">کرج</option>
                <option value="اهواز">اهواز</option>
                <option value="رشت">رشت</option>
                <option value="ساری">ساری</option>
                <option value="قم">قم</option>
                <option value="کرمان">کرمان</option>
                <option value="یزد">یزد</option>
                <option value="سایر شهرها">سایر شهرها</option>
              </select>
              <svg class="input-row__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </div>

            <input name="chosen" id="field-chosen" type="hidden" value="درخواست آزمایش رایگان ۳روزه">
            <input name="website" type="text" tabindex="-1" autocomplete="off" hidden>

            <p id="form-error" class="form-error" role="alert" hidden></p>
            <p id="form-success" class="form-success" role="status" aria-live="polite" hidden></p>

            <button class="btn-submit" id="lead-submit" type="submit">
              <span>ثبت درخواست</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              <svg class="btn-submit__ghost-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
    <svg class="wave-deco" viewBox="0 0 1200 86" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 44C300 82 620 14 940 50C1060 64 1140 34 1200 22V86H0V44Z" fill="#cde5ca" fill-opacity=".6"/>
      <path d="M0 62C360 88 700 26 1020 58C1110 66 1160 46 1200 38V86H0V62Z" fill="#b4d9b1" fill-opacity=".5"/>
    </svg>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="section">
    <div class="container">
      <div class="section-head">
        <h2>سوالات متداول</h2>
      </div>
      <div class="faq-list">
        <details>
          <summary>آیا مشتری فقط لباس‌های مزون خودمان را می‌بیند؟</summary>
          <p>بله، هر مزون صفحه، لینک و QR اختصاصی خودش را دارد و مشتری فقط مدل‌های ثبت‌شده همان مزون را مشاهده و امتحان می‌کند.</p>
        </details>
        <details>
          <summary>برای استفاده در مزون چه تجهیزاتی نیاز داریم و آیا نصب پیچیده‌ای دارد؟</summary>
          <p>نیاز به نصب هیچ نرم‌افزاری نیست؛ آینه به‌سادگی از طریق مرورگر روی گوشی موبایل، تبلت، کیوسک ایستاده داخل مزون یا تلویزیون هوشمند اجرا می‌شود.</p>
        </details>
        <details>
          <summary>چهره، سایز و اندام عروس در خروجی تغییر می‌کند یا جایگزین پرو حضوری می‌شود؟</summary>
          <p>خیر، چهره، مو و فرم بدن عروس حفظ می‌شود و فقط لباس مزون شما روی تصویر او قرار می‌گیرد. آینه جایگزین پرو حضوری نیست و تایید نهایی پارچه و دوخت همچنان در مزون انجام می‌شود تا پروهای غیرضروری به حداقل برسد.</p>
        </details>
        <details>
          <summary>هر عکس چقدر زمان می‌برد تا آماده شود؟</summary>
          <p>نتیجه پرو مجازی معمولاً در کمتر از یک دقیقه آماده و روی صفحه نمایش داده می‌شود.</p>
        </details>
        <details>
          <summary>برای وارد کردن لباس‌ها حتماً باید عکس استودیویی یا مدل زنده داشته باشیم؟</summary>
          <p>عکس لباس روی مدل یا مانکن مناسب است و در زمان راه‌اندازی، تیم آینه راهنمای استاندارد عکاسی از لباس‌ها را برای بهترین نتیجه در اختیار شما می‌گذارد.</p>
        </details>
        <details>
          <summary>استفاده از آینه فقط داخل مزون است یا به‌صورت آنلاین هم قابل استفاده است؟</summary>
          <p>تمرکز اصلی روی استفاده داخل مزون هنگام مشاوره حضوری (روی کیوسک، تبلت یا تلویزیون هوشمند) است و در صورت نیاز به استفاده آنلاین، نحوه تنظیم آن در تماس هماهنگ می‌شود.</p>
        </details>
        <details>
          <summary>نسخه آزمایشی ۳ روزه چطور فعال می‌شود و زمان آن از چه لحظه‌ای محاسبه می‌شود؟</summary>
          <p>کافی است فرم درخواست را با نام مزون ثبت کنید تا کارشناسان آینه در کمتر از ۲۴ ساعت دسترسی آزمایشی اختصاصی مزون شما را فعال کنند. بازه ۷۲ ساعته از زمان ساخت اولین تصویر آزمایشی شروع می‌شود، نه از لحظه ثبت درخواست.</p>
        </details>
        <details>
          <summary>امنیت عکس‌های عروس‌ها و مدل‌های اختصاصی مزون چطور است؟</summary>
          <p>تصاویری که برای مزون ارسال نشوند پس از ۱۵ دقیقه به‌صورت خودکار پاک می‌شوند، در هیچ جایی منتشر نمی‌شوند، برای آموزش هوش مصنوعی استفاده نخواهند شد و مدل‌های اختصاصی مزون شما کاملاً محرمانه می‌مانند.</p>
        </details>
        <details>
          <summary>پشتیبانی و راه‌اندازی اولیه برای پرسنل مزون چطور انجام می‌شود؟</summary>
          <p>پشتیبانی تلفنی و آنلاین در تمام ساعات کاری همراه مزون شماست و راه‌اندازی اولیه به همراه راهنمای کامل کار با سیستم توسط تیم فنی ما انجام می‌شود.</p>
        </details>
        <details>
          <summary>چند مدل لباس می‌توانیم در کاتالوگ مزون ثبت کنیم و برای شعب بیشتر چطور است؟</summary>
          <p>بسته به نیاز مزون شما، ظرفیت ثبت مدل‌ها و دسترسی شعبه‌های بیشتر در تماس راه‌اندازی تنظیم و برای مجموعه شما فعال می‌شود.</p>
        </details>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <b>آینه | پرو مجازی لباس عروس</b>
        <small>راهکار هوشمند پرو مجازی و افزایش فروش ویژه مزون‌های عروس</small>
      </div>
      <div class="footer-links">
        <a href="/privacy">حریم خصوصی و قوانین</a>
        <a href="https://t.me/mezon_aynehbot" target="_blank" rel="noopener noreferrer">ربات تلگرام آینه</a>
      </div>
    </div>

    <div class="footer-contact-grid">
      <div class="footer-card">
        <div class="footer-card__title">ارتباط مستقیم و مشاوره</div>
        <div class="footer-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <div>مشاور مجموعه (آقای علی عدلی): <a href="tel:+989105647497" dir="ltr" class="nums">09105647497</a></div>
        </div>
        <div class="footer-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          <div>آیدی تلگرام: <a href="https://t.me/ali_adli22" target="_blank" rel="noopener noreferrer" dir="ltr">@ali_adli22</a></div>
        </div>
        <div class="footer-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <div>آدرس سایت: <a href="/" dir="ltr">www.ayneh-mezon.site</a></div>
        </div>
      </div>

      <div class="footer-card">
        <div class="footer-card__title">نشانی شعب شرکت</div>
        <div class="footer-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.7-6-10.5a6 6 0 1 1 12 0C18 15.3 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg>
          <div><b>شعبه یک (تهران):</b> سهروردی شمالی، کوچه شریف، پلاک ۱۴</div>
        </div>
        <div class="footer-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.7-6-10.5a6 6 0 1 1 12 0C18 15.3 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></svg>
          <div><b>شعبه دو (مشهد):</b> امامت ۳۱، پلاک ۱۹</div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© مزون آینه — تمامی حقوق محفوظ است.</span>
      <span>پرو مجازی لباس عروس با هوش مصنوعی ویژه مزون‌ها</span>
    </div>
  </div>
</footer>

<!-- Screen 8: منوی موبایل -->
<div class="drawer-backdrop" id="mobile-drawer" hidden>
  <nav class="drawer-panel" role="dialog" aria-modal="true" aria-label="منوی موبایل">
    <div class="drawer-top">
      <span class="brand-row">
        <span class="brand-wordmark" style="font-size:24px">آینه</span>
        <img class="brandmark" src="${brandLogoSrc}" width="34" height="34" alt="" decoding="async" style="width:34px;height:34px;border-radius:9px">
      </span>
      <button class="drawer-close" id="menu-close" type="button" aria-label="بستن منو">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="drawer-links">
      <a class="drawer-link is-active" href="#top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>
        <span>صفحه اصلی</span>
      </a>
      <a class="drawer-link" href="#benefits">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>
        <span>امکانات و مزایا</span>
      </a>
      <a class="drawer-link" href="#steps">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5v-7z"/></svg>
        <span>نحوه استفاده</span>
      </a>
      <a class="drawer-link" href="#faq">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.9c0 1.6-2.3 2.1-2.3 3.6"/><circle cx="12" cy="17.2" r=".8" fill="currentColor"/></svg>
        <span>سوالات متداول</span>
      </a>
    </div>

    <a class="drawer-cta" href="#request" data-select-trial>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
      <span>۳ روز آزمایشی رایگان</span>
    </a>
  </nav>
</div>

<script>
(function () {
  // 1. Hero Before/After Interactive Split Slider
  const compare = document.getElementById('hero-compare');
  const range = document.getElementById('compare-range');
  if (compare && range) {
    const paint = (val) => compare.style.setProperty('--split', val + '%');
    range.addEventListener('input', () => paint(range.value));
    let dragging = false;
    const move = (e) => {
      const rect = compare.getBoundingClientRect();
      const pct = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
      range.value = String(Math.round(pct));
      paint(pct);
    };
    compare.addEventListener('pointerdown', (e) => { dragging = true; move(e); });
    window.addEventListener('pointermove', (e) => { if (dragging) move(e); });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointercancel', () => { dragging = false; });
  }

  // 2. Mobile Navigation Drawer
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  const drawerLinks = drawer ? drawer.querySelectorAll('.drawer-link') : [];
  let prevFocus = null;

  function setDrawer(show) {
    if (!drawer || !openBtn) return;
    drawer.hidden = !show;
    openBtn.setAttribute('aria-expanded', String(show));
    document.body.style.overflow = show ? 'hidden' : '';
    if (show) {
      prevFocus = document.activeElement;
      if (closeBtn) closeBtn.focus();
    } else if (prevFocus) {
      prevFocus.focus();
    }
  }

  if (openBtn) openBtn.addEventListener('click', () => setDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (e.target === drawer) setDrawer(false);
      if (link) {
        drawerLinks.forEach((x) => x.classList.toggle('is-active', x === link));
        setDrawer(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) setDrawer(false);
    });
  }

  // 3. Lead Form Submission
  const form = document.getElementById('lead-form');
  const submitBtn = document.getElementById('lead-submit');
  const errBox = document.getElementById('form-error');
  const okBox = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errBox) { errBox.hidden = true; errBox.textContent = ''; }
      if (okBox) { okBox.hidden = true; okBox.textContent = ''; }

      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const salon = String(fd.get('salon') || '').trim();
      const phoneVal = String(fd.get('phone') || '').trim();
      const city = String(fd.get('city') || '').trim();

      if (name.length < 2) {
        if (errBox) { errBox.textContent = 'لطفاً نام و نام خانوادگی خود را وارد کنید.'; errBox.hidden = false; }
        form.elements.name.focus();
        return;
      }
      if (salon.length < 2) {
        if (errBox) { errBox.textContent = 'لطفاً نام مزون یا مجموعه را وارد کنید.'; errBox.hidden = false; }
        form.elements.salon.focus();
        return;
      }
      if (!phoneVal) {
        if (errBox) { errBox.textContent = 'لطفاً شماره تماس معتبر وارد کنید.'; errBox.hidden = false; }
        form.elements.phone.focus();
        return;
      }
      if (!city) {
        if (errBox) { errBox.textContent = 'لطفاً شهر خود را انتخاب کنید.'; errBox.hidden = false; }
        form.elements.city.focus();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const payload = {
          name,
          salon,
          phone: phoneVal,
          city,
          chosen: String(fd.get('chosen') || 'درخواست آزمایش رایگان ۳روزه'),
          website: String(fd.get('website') || ''),
          consent: true
        };
        const res = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'ارسال درخواست با خطا مواجه شد؛ لطفاً شماره تماس را بررسی کنید.');
        }
        form.reset();
        if (okBox) {
          okBox.textContent = 'درخواست شما ثبت شد! کارشناسان آینه به‌زودی با شما تماس می‌گیرند.';
          okBox.hidden = false;
        }
      } catch (err) {
        if (errBox) {
          errBox.textContent = err && err.message ? err.message : 'خطا در برقراری ارتباط با سرور';
          errBox.hidden = false;
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
</script>
</body>
</html>`;

  return page;
};