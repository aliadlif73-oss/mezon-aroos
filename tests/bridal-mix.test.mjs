import test from 'node:test';
import assert from 'node:assert/strict';
import {MIX_COLLECTION,MIX_KEYS,validMix,mixPrompt} from '../worker/bridal-mix.js';
import {customerHTML} from '../worker/customer.js';
import {api} from '../worker/server.js';
import {dressKeyOf,dressName,cleanDressKey} from '../worker/dresses.js';
import {mixAllowed,subscriptionState,addPlanMonths} from '../worker/subscriptions.js';

test('all four bridal component groups offer three starter options',()=>{
 assert.deepEqual(MIX_KEYS,['bodice','skirt','sleeves','neckline']);
 for(const key of MIX_KEYS){assert.equal(MIX_COLLECTION[key].length,3);for(const it of MIX_COLLECTION[key])assert(it[0]&&it[1]);}
 const selection={bodice:0,skirt:1,sleeves:2,neckline:0};
 assert(validMix(selection));
 assert(!validMix({bodice:2}));
 assert(!validMix({...selection,skirt:100}));
 const prompt=mixPrompt(selection);
 assert.match(prompt,/preserve|Keep the exact person's face/i);
 assert.match(prompt,/mermaid skirt/i);
 assert.match(prompt,/sleeveless construction/i);
 assert.match(prompt,/sweetheart neckline/i);
});

test('the existing photo and regular salon/catalog tabs remain alongside the new opt-in tab',()=>{
 assert.match(customerHTML,/if\(state.step===1\)root.append\(stepPhoto\(\)\)/);
 assert.match(customerHTML,/if\(state.pub.catalog\)tabs.push\(\['catalog',1\]\)/);
 assert.match(customerHTML,/if\(state.pub.own_dress\)tabs.push\(\['upload',2\]\)/);
 assert.match(customerHTML,/tabs.push\(\['mix',3\]\)/);
 assert.match(customerHTML,/state.tab==='mix'\?!!state.pub.mix_enabled/);
 assert.match(customerHTML,/لباس انتخابی من/);
 assert.match(customerHTML,/mix_parts:state.mix/);
 assert.match(customerHTML,/state.tab==='mix'/);
});

test('custom bridal mixes have unique stable keys for CRM and conversion reporting',()=>{
 const a={transfer:'mix',opts:JSON.stringify({mix_parts:{bodice:0,skirt:1,sleeves:2,neckline:0}})};
 const key=dressKeyOf(a,{byMedia:new Map()});
 assert.equal(key,'m:0120');
 assert.equal(cleanDressKey(key),key);
 assert.match(dressName(key),/طرح ترکیبی/);
 assert.equal(dressKeyOf({...a,opts:'{}'},{byMedia:new Map()}),'');
});

test('only unexpired 3/6-month subscriptions enable bridal composition',()=>{
 const now=Date.UTC(2026,10,23);
 const subscription=(plan_id,expires_at=now+86400000)=>({subscription:{status:'active',plan_id,starts_at:now-1000,expires_at}});
 assert(mixAllowed(subscription('three'),now));
 assert(mixAllowed(subscription('six'),now));
 assert(!mixAllowed(subscription('one'),now));
 assert(!mixAllowed(subscription('three',now-1),now));
 assert(!mixAllowed({},now),'old editable flag is never payment authority');
 assert(addPlanMonths(Date.UTC(2026,0,31),1)===Date.UTC(2026,1,28),'calendar month clamp');
});
