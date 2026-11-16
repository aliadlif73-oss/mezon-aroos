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
