import test from 'node:test';
import assert from 'node:assert/strict';
import {customerHTML} from '../worker/customer.js';
test('all salons share a compact horizontal banner containing cover logo and salon name only',()=>{
 const html=customerHTML,start=html.indexOf('function renderHead(){'),end=html.indexOf('function fitName(',start),header=html.slice(start,end);
 assert.ok(start>0&&end>start);
 assert.match(header,/p\.cover\?media\(p\.cover\)/);
 assert.match(header,/p\.logo\?el\('img'/);
 assert.match(header,/class:'salon-brand__name',text:s\.name/);
 assert.match(header,/class:'salon-brand__cover'/);
 assert.match(header,/class:'salon-brand__logo'/);
 assert.doesNotMatch(header,/hero__cta|hd__logo|رزرو|نوبت|آدرس|واتساپ/);
 assert.match(html,/\.salon-brand__cover\{[^}]*height:clamp/);
 assert.match(html,/class="salon-brand__name skel"/);
});
