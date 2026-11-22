import test from 'node:test';
import assert from 'node:assert/strict';
import {MIX_COLLECTION,MIX_KEYS,validMix,mixPrompt} from '../worker/bridal-mix.js';
import {customerHTML} from '../worker/customer.js';
import {api} from '../worker/server.js';

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
 assert.match(customerHTML,/if\(state.pub.mix_enabled\)tabs.push\(\['mix',3\]\)/);
 assert.match(customerHTML,/لباس انتخابی من/);
 assert.match(customerHTML,/mix_parts:state.mix/);
 assert.match(customerHTML,/state.tab==='mix'/);
});
