import test from 'node:test';
import assert from 'node:assert/strict';
import {customerHTML} from '../worker/customer.js';
import {DRESS_SIZES,SIZE_OPTIONS} from '../worker/dress-sizes.js';

test('site dress-size picker matches Telegram options without replacing body measurements',()=>{
 assert.deepEqual(DRESS_SIZES,['34','36','38','40','42','44','46','48','50','52','54','56','F']);
 assert.equal(SIZE_OPTIONS.at(-1).label,'فری‌سایز');
 assert(customerHTML.includes('سایز لباس من (اختیاری)'));
 assert(customerHTML.includes('اندازه‌های بدنم (اختیاری)'));
 assert(customerHTML.includes('dress_size:state.dressSize||undefined'));
 assert(customerHTML.includes('var DRESS_SIZE_OPTIONS='+JSON.stringify(SIZE_OPTIONS)));
 assert(!customerHTML.includes('__DRESS_SIZES__'));
});
