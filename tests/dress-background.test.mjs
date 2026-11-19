import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDressPhoto,DRESS_STUDIO_BG} from '../worker/dress-background.js';

const original=Uint8Array.from([255,216,255,...Array(160).fill(1)]);
const jpeg=Uint8Array.from([255,216,255,...Array(150).fill(2)]);

test('bridal studio transform segments the dress and fills with the same greige for all angles',async()=>{
 let spec,output,inputs=0;
 const env={IMAGES:{input(stream){
  inputs++;assert(stream&&typeof stream.getReader==='function');
  return {transform(p){spec=p;return this},output(p){output=p;return {response:async()=>new Response(jpeg,{headers:{'Content-Type':'image/jpeg'}})}}};
 }}};
 for(let i=0;i<4;i++)assert.deepEqual(await normalizeDressPhoto(env,original),jpeg);
 assert.equal(inputs,4);
 assert.deepEqual(spec,{segment:'foreground',background:DRESS_STUDIO_BG});
 assert.equal(DRESS_STUDIO_BG,'#77716D');
 assert.equal(output.format,'image/jpeg');
});

test('missing Images binding fails closed rather than publishing an unprocessed original',async()=>{
 await assert.rejects(normalizeDressPhoto({},original),/سرویس یکسان‌سازی/);
});

test('bad transformations fail closed, preserving the current angle in the wizard',async()=>{
 const bad={IMAGES:{input(){return {transform(){return this},output(){return {response:async()=>new Response('error',{status:503})}}}}}};
 await assert.rejects(normalizeDressPhoto(bad,original),/حذف پس‌زمینه/);
});
