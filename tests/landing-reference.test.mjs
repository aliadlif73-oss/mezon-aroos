import test from 'node:test';
import assert from 'node:assert/strict';
import { referenceLandingFor } from '../worker/landing-reference.js';
import app from '../worker/index.js';

test('referenceLandingFor renders all 8 mockup screens cleanly with valid JS', async () => {
  const html = referenceLandingFor('https://ayneh-mezon.site');

  // Inline script parses cleanly
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'inline script exists');
  new Function(scriptMatch[1]);

  // Header & mobile drawer (Screen 8)
  assert.match(html, /آینه/);
  assert.match(html, /\/assets\/aistudio\/photo_2026-11-17_06-02-29_bc384e6f\.jpg/);
  assert.match(html, /پرو مجازی لباس عروس با هوش مصنوعی/);
  assert.match(html, /id="menu-open"/);
  assert.match(html, /id="mobile-drawer"/);
  assert.match(html, /سوالات متداول/);
  assert.equal((html.match(/<details>/g) || []).length, 10);
  assert.match(html, /آیا مشتری فقط لباس‌های مزون خودمان را می‌بیند؟/);
  assert.match(html, /۱۵ دقیقه به‌صورت خودکار پاک می‌شوند/);
  assert.doesNotMatch(html, /هزینه اشتراک و تعرفه‌های آینه چقدر است/);

  // Hero before/after slider, CTA badge, devices (2-row order), trust banner (Screen 1)
  assert.match(html, /پیش از پرو/);
  assert.match(html, /نشان دهید/);
  assert.doesNotMatch(html, /خودت را با/);
  assert.doesNotMatch(html, /روی خودتان ببینید/);
  assert.match(html, /۳ روز نسخه آزمایشی رایگان/);
  assert.match(html, /فقط <b class="nums">۲۰<\/b> مزون/);
  assert.match(html, /id="compare-range"/);
  assert.match(html, /\/landing\/hero-before\.webp/);
  assert.match(html, /\/landing\/hero-after\.webp/);
  const devices = ['کیوسک مزون', 'تلویزیون هوشمند', 'گوشی موبایل', 'تبلت'];
  let prevIdx = -1;
  for (const d of devices) {
    const idx = html.indexOf(d);
    assert.ok(idx > prevIdx, `device present in 2-row order: ${d}`);
    prevIdx = idx;
  }
  assert.match(html, /\.devices-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html, /حفظ حریم خصوصی/);
  assert.match(html, /برای اولین بار در ایران/);
  assert.doesNotMatch(html, /مشاهده عملکرد آینه/);
  assert.doesNotMatch(html, /رضایت مزون/);

  // Framed demo video directly below "۳ روز نسخه آزمایشی رایگان" CTA and before #devices
  const trialIdx = html.lastIndexOf('۳ روز نسخه آزمایشی رایگان');
  const videoIdx = html.indexOf('id="app-demo-video"');
  const devicesIdx = html.indexOf('id="devices"');
  assert.ok(trialIdx > -1 && videoIdx > trialIdx && devicesIdx > videoIdx, 'demo video appears after trial CTA and before devices');
  assert.match(html, /<video id="app-demo-video" src="\/assets\/aistudio\/Untitled-project__3__001c1c64\.mp4/);
  assert.match(html, /id="video-play-btn"/);
  assert.match(html, /\.video-frame-shell/);

  // Benefits (Screen 2)
  assert.match(html, /چرا مزون‌ها(?:<br>|\s)*آینه را انتخاب می‌کنند؟/);
  for (const b of ['افزایش فروش', 'کاهش هزینه و زمان', 'رضایت بیشتر مشتری', 'پوشش کامل مدل‌ها']) {
    assert.ok(html.includes(b), `benefit present: ${b}`);
  }

  // How it works (Screen 3)
  assert.match(html, /آینه چطور کار می‌کند؟/);
  assert.match(html, /همه در چند ثانیه!/);

  // Removed sections per user focus-mode deletion request
  assert.doesNotMatch(html, /class="quick-props"/);
  assert.doesNotMatch(html, /id="demo"/);
  assert.doesNotMatch(html, /id="plans"/);
  assert.doesNotMatch(html, /id="request-confirm-view"/);
  assert.doesNotMatch(html, /href="\/s\/demo"/);
  assert.doesNotMatch(html, /href="#plans"/);

  // Request form (Screen 6)
  assert.match(html, /id="lead-form"/);
  for (const field of ['name="name"', 'name="salon"', 'name="phone"', 'name="city"', 'name="chosen"']) {
    assert.ok(html.includes(field), `form field present: ${field}`);
  }
  assert.match(html, /\/api\/inquiry/);
  assert.match(html, /id="form-success"/);

  // Footer keeps remaining legal, Telegram, and company contact/branch info
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /https:\/\/t\.me\/mezon_aynehbot/);
  assert.match(html, /سهروردی شمالی، کوچه شریف، پلاک ۱۴/);
  assert.match(html, /امامت ۳۱، پلاک ۱۹/);
  assert.match(html, /09105647497/);
  assert.match(html, /علی عدلی/);
  assert.match(html, /@ali_adli22/);
  assert.match(html, /www\.ayneh-mezon\.site/);

  // Root route serves the updated landing page
  const res = await app.fetch(new Request('https://test.example/'), {});
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /آینه چطور کار می‌کند؟/);
});
