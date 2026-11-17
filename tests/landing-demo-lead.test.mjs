import test from 'node:test';
import assert from 'node:assert/strict';
import {landingFor} from '../worker/landing.js';
import {freshCSS,freshJS,freshDemoCSS} from '../worker/ayneh-theme.js';
import {TRIAL_HOURS} from '../worker/trial.js';

test('the new homepage offers only a real lead request, not direct account creation', () => {
 const html=landingFor('https://ayneh-mezon.site');
 assert.match(html,/class="lead-box" id="demo-request"/);
 for(const name of ['salon','city','phone','chosen'])assert.match(html,new RegExp('name="'+name+'"'));
 assert.doesNotMatch(html,/name="name"/);
 assert.equal((html.match(/<form class="demo-form"/g)||[]).length,1);
 assert.equal((html.match(/id="demo-request"/g)||[]).length,1);
 assert.match(html,/\/api\/inquiry/);
 assert.match(html,/body\.consent=true/);
 assert.match(html,/ثبت درخواست آزمایش ۳روزه/);
 assert.match(html,/id="lead-done"/);
 for(const old of ['سه قدم تا روشن شدن صفحه','صفحهٔ مزونتان را بسازید','شروع آزمایشی رایگان','href="#start"'])assert.ok(!html.includes(old),old);
});
test('mobile conversion design preserves the same-person preview and all known device categories', () => {
 const html=landingFor('https://ayneh-mezon.site');
 assert.match(html,/id="mobile-toggle"/);
 assert.match(html,/id="mobile-menu"/);
 assert.match(html,/aria-expanded="false"/);
 assert.match(html,/id="hero-split-range"/);
 assert.match(html,/hero-film__before/);
 assert.match(html,/hero-film__after/);
 assert.match(html,/\/catalog\/dress\/demo-before\.webp/);
 assert.match(html,/\/catalog\/dress\/demo-after\.webp/);
 assert.match(html,/href="\/s\/demo">مشاهده عملکرد آینه/);
 assert.match(html,/۳ روز آزمایشی رایگان/);
 assert.match(html,/class="sticky-action"/);
 assert.match(html,/id="devices"/);
 for(const term of ['تبلت لمسی','کیوسک لمسی','گوشی هوشمند','تلویزیون هوشمند'])assert.ok(html.includes(term));
 assert.ok(html.indexOf('id="devices"')<html.indexOf('id="path"'));
 assert.match(html,/privacy-story__lines/);
 assert.match(html,/class="corporate-footer"/);
 assert.match(html,/id="faq"/);
 assert.match(html,/font-face|vazirmatn|vazirmatn-arabic/);
});
test('real trial duration and theme are connected', () => {
 assert.equal(TRIAL_HOURS,72);
 assert.match(freshCSS,/#087b44/);
 assert.match(freshCSS,/\.sticky-action/);
 assert.match(freshJS,/leadMode|function mode/);
 assert.match(freshDemoCSS,/body\.is-public-demo/);
 assert.doesNotMatch(freshDemoCSS,/body\.premium-landing/);
});
