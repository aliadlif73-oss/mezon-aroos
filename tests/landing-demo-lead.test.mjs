import test from 'node:test';
import assert from 'node:assert/strict';
import {landingFor} from '../worker/landing.js';

test('public homepage offers demo leads instead of self-service signup', () => {
  const html = landingFor('https://ayneh-mezon.site');
  assert.match(html, /class="lead-box" id="demo-request"/);
  assert.match(html, /name="salon"/);
  assert.match(html, /name="city"/);
  assert.match(html, /name="phone"/);
  assert.doesNotMatch(html, /name="name"/);
  assert.equal((html.match(/<form class="demo-form"/g)||[]).length,1);
  assert.equal((html.match(/id="demo-request"/g)||[]).length,1);
  assert.match(html, /\/api\/inquiry/);
  assert.match(html, /body\.consent=true/);
  for (const removed of ['سه قدم تا روشن شدن صفحه','صفحهٔ مزونتان را بسازید','شروع آزمایشی رایگان','href="#start"']) assert.doesNotMatch(html,new RegExp(removed));
});

test('review annotations: CTA, media, devices, privacy and corporate footer', () => {
  const html = landingFor('https://ayneh-mezon.site');
  const head = html.match(/<header class="top">[\s\S]*?<\/header>/)?.[0] || '';
  assert.ok(head);
  assert.doesNotMatch(head, /درخواست دموی اختصاصی/);
  assert.match(html, /href="#demo-request" data-lead-mode="trial">۳ روز آزمایشی رایگان/);
  assert.match(html, /href="\/s\/demo">مشاهده عملکرد آینه/);
  assert.match(html, /<video class="hero-film__video" autoplay muted playsinline loop/);
  assert.match(html, /\/demo\/hero-tryon\.mp4/);
  assert.match(html, /\/catalog\/dress\/demo-before\.webp/);
  assert.match(html, /\/catalog\/dress\/demo-after\.webp/);
  assert.match(html, /id="devices"/);
  for (const term of ['تبلت لمسی', 'کیوسک لمسی', 'گوشی هوشمند', 'تلویزیون هوشمند']) assert.match(html, new RegExp(term));
  assert.ok(html.indexOf('id="devices"') < html.indexOf('id="path"'));
  assert.match(html, /privacy-story__lines/);
  assert.doesNotMatch(html, /class="safe"/);
  assert.match(html, /class="corporate-footer"/);
  assert.match(html, /ayneh-mezon\.site/);
  assert.match(html, /name="chosen" type="hidden"/);
  assert.match(html, /data-lead-mode/);
});
