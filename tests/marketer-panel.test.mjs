import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';
import app from '../worker/index.js';
import {salesHTML} from '../worker/sales-ui.js';
import {appHTML} from '../worker/ui.js';

const origin='https://sales-test.example';
const owner={'origin':origin,'oai-authenticated-user-id':'owner-a','oai-authenticated-user-email':'owner@test'};
const migrations=readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort();
function fixture(){
 const DB=database();for(const f of migrations)DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 return {DB,BUCKET:memoryBucket(),OWNER_EMAIL:'owner@test',TRUST_PLATFORM_IDENTITY:'true',APP_ORIGIN:origin,TELEGRAM_BOT_TOKEN:'bot:test',TELEGRAM_BOT_USERNAME:'ayneh_bot',TELEGRAM_WEBHOOK_SECRET:'secret'};
}
async function call(env,path,body,headers={}){
 const init={method:body===undefined?'GET':'POST',headers:{origin,...headers}};
 if(body!==undefined){if(body instanceof Uint8Array)init.body=body;else{init.headers['content-type']='application/json';init.body=JSON.stringify(body)}}
 const res=await app.fetch(new Request(origin+path,init),env);
 return {status:res.status,data:await res.json().catch(()=>null),cookie:res.headers.get('set-cookie')?.split(';')[0]};
}
async function rep(env,username,name='کارشناس فروش'){
 const c=await call(env,'/api/sales/admin/create',{name,username,password:'TestSecret12345!'},owner);
 assert.equal(c.status,200,JSON.stringify(c));return c.data.id;
}
async function login(env,username){const r=await call(env,'/api/sales/login',{username,password:'TestSecret12345!'});assert.equal(r.status,200,JSON.stringify(r));return {'cookie':r.cookie}}

test('sales panel renders and both embedded scripts parse',()=>{
 assert.match(salesHTML,/پنل بازاریاب/);assert.match(appHTML,/marketersCard/);
 const scripts=[...salesHTML.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,2);new Function(scripts[1][1]);
});
test('only owner can provision marketers and passwords are hashed',async()=>{
 const e=fixture();
 assert.equal((await call(e,'/api/sales/admin')).status,401);
 assert.equal((await call(e,'/api/sales/admin/create',{name:'Test',username:'repone',password:'TestSecret12345!'})).status,401);
 const id=await rep(e,'repone');const row=e.DB.sql.prepare('SELECT password_hash,password_salt FROM marketers WHERE id=?').get(id);
 assert.notEqual(row.password_hash,'TestSecret12345!');assert.equal(row.password_salt.length,32);
 assert.equal((await call(e,'/api/sales/login',{username:'repone',password:'incorrect'})).status,401);
 assert.equal((await call(e,'/api/sales/me')).data.loggedIn,false);
});
test('marketers only see own salons; creation activates AI with preset credit but no owner permissions',async()=>{
 const e=fixture();await rep(e,'repone');await rep(e,'reptwo');
 const one=await login(e,'repone'),two=await login(e,'reptwo');
 const made=await call(e,'/api/sales/salons/create',{name:'مزون اول',slug:'bridal-one',contact_name:'خانم تست',contact_phone:'09121234567',profile:{city:'تهران'}},one);
 assert.equal(made.status,200,JSON.stringify(made));
 const row=e.DB.sql.prepare('SELECT approved,credit_limit,settings,owner_id FROM salons WHERE slug=?').get('bridal-one');
 assert.equal(row.approved,1);assert.equal(row.credit_limit,10);assert.equal(JSON.parse(row.settings).generation_enabled,true);
 assert.equal(e.DB.sql.prepare('SELECT amount FROM credit_ledger WHERE salon_id=(SELECT id FROM salons WHERE slug=?)').get('bridal-one').amount,10);
 assert.match(row.owner_id,/^sales:/);
 assert.equal((await call(e,'/api/owner',undefined,one)).status,401);
 assert.equal((await call(e,'/api/s/bridal-one/owner',undefined,one)).status,401);
 assert.equal((await call(e,'/api/sales/salons',undefined,two)).data.salons.length,0);
 assert.equal((await call(e,'/api/sales/salons/bridal-one',undefined,two)).status,404);
 const own=await call(e,'/api/sales/salons/bridal-one',undefined,one);assert.equal(own.status,200,JSON.stringify(own));assert.equal(own.data.metrics.visitors,0);assert.equal(own.data.metrics.profile_total,6);
 assert.equal((await call(e,'/api/sales/salons/update',{slug:'bridal-one',note:'malicious'},two)).status,404);
 assert.equal((await call(e,'/api/sales/salons/bot-link',{slug:'bridal-one'},one)).status,403);
 const edit=await call(e,'/api/sales/salons/update',{slug:'bridal-one',profile:{address:'میدان انقلاب',phone:'02122334455'},stage:'visited',note:'جلسه خوب بود',next_followup_at:Date.now()+86400000},one);
 assert.equal(edit.status,200,JSON.stringify(edit));
 assert.equal((await call(e,'/api/sales/dashboard',undefined,one)).data.stages.visited,1);
 const publicPage=await call(e,'/api/s/bridal-one/public');assert.equal(publicPage.data.salon.profile.city,'تهران');
 assert.equal(publicPage.data.salon.profile.address,'میدان انقلاب');
 assert.equal((await call(e,'/api/sales/salons/create',{name:'نام',slug:'bridal-one'},two)).status,409);
});
test('uploads are scoped, portfolio publishing works, admin approval enables bot link',async()=>{
 const e=fixture();await rep(e,'repone');await rep(e,'reptwo');
 const one=await login(e,'repone'),two=await login(e,'reptwo');
 await call(e,'/api/sales/salons/create',{name:'مزون دوم',slug:'bridal-two'},one);
 const png=new Uint8Array(160);png.set([137,80,78,71,13,10,26,10]);
 const upload=await call(e,'/api/sales/salons/upload',png,{...one,'x-salon-slug':'bridal-two','x-upload-kind':'logo'});
 assert.equal(upload.status,200,JSON.stringify(upload));
 const row=e.DB.sql.prepare('SELECT profile FROM salons WHERE slug=?').get('bridal-two');assert.equal(JSON.parse(row.profile).logo,upload.data.id);
 assert.equal((await call(e,'/api/sales/salons/upload',png,{...two,'x-salon-slug':'bridal-two','x-upload-kind':'logo'})).status,404);
 const dress=await call(e,'/api/sales/salons/upload',png,{...one,'x-salon-slug':'bridal-two','x-upload-kind':'portfolio'});
 assert.equal(dress.status,200,JSON.stringify(dress));
 const saved=await call(e,'/api/sales/salons/portfolio',{slug:'bridal-two',title:'لباس پرنسسی',media_ids:[dress.data.id],sizes:['38','40']},one);
 assert.equal(saved.status,200,JSON.stringify(saved));
 assert.equal((await call(e,'/api/s/bridal-two/public')).data.portfolio.length,1);
 assert.equal((await call(e,'/api/sales/salons/bot-link',{slug:'bridal-two'},one)).status,403,'AI activation is not bot authorization');
 const approve=await call(e,'/api/sales/admin/bot-approve',{slug:'bridal-two',approved:true},owner);
 assert.equal(approve.status,200,JSON.stringify(approve));
 const link=await call(e,'/api/sales/salons/bot-link',{slug:'bridal-two'},one);
 assert.equal(link.status,200,JSON.stringify(link));assert.match(link.data.links.telegram,/^https:\/\/t\.me\//);
});
test('disabling a rep revokes sessions and CSRF is checked',async()=>{
 const e=fixture();const id=await rep(e,'repone');const one=await login(e,'repone');
 assert.equal((await call(e,'/api/sales/salons',undefined,one)).status,200);
 const noOrigin=await app.fetch(new Request(origin+'/api/sales/salons/create',{method:'POST',headers:{cookie:one.cookie,'content-type':'application/json'},body:JSON.stringify({name:'x',slug:'new-salon'})}),e);
 assert.equal(noOrigin.status,403);
 assert.equal((await call(e,'/api/sales/admin/status',{id,active:false},owner)).status,200);
 assert.equal((await call(e,'/api/sales/salons',undefined,one)).status,401);
 assert.equal((await call(e,'/api/sales/login',{username:'repone',password:'TestSecret12345!'})).status,401);
});

test('owner sets next-salon credits by marketer; sales limits cannot be bypassed by global test mode',async()=>{
 const e=fixture(),id=await rep(e,'repone');
 const caps=await call(e,'/api/sales/admin/credits',{id,initial_credits:37},owner);
 assert.equal(caps.status,200,JSON.stringify(caps));
 assert.equal((await call(e,'/api/sales/admin/credits',{id,initial_credits:2000},owner)).status,400);
 const who=await login(e,'repone');e.LIMITS_OFF='1';
 const make=await call(e,'/api/sales/salons/create',{slug:'credit-verified',name:'مزون اعتباری'},who);
 assert.equal(make.status,200,JSON.stringify(make));assert.equal(make.data.credits,37);
 const row=e.DB.sql.prepare('SELECT approved,credit_limit,settings FROM salons WHERE slug=?').get('credit-verified');
 assert.equal(row.approved,1);assert.equal(row.credit_limit,37);
 assert.equal(JSON.parse(row.settings).daily_limit,37);
 const guest=await call(e,'/api/s/credit-verified/session',{});assert.equal(guest.status,200);
 const session=await call(e,'/api/s/credit-verified/session',undefined,{'cookie':guest.cookie});
 assert.equal(session.status,200,JSON.stringify(session));assert.ok(session.data.quota,'sales credit cap must survive LIMITS_OFF=1');
});
test('marketer can only GET customers of own salon, with full phone and name but no edit route',async()=>{
 const e=fixture();await rep(e,'repone');await rep(e,'reptwo');
 const one=await login(e,'repone'),two=await login(e,'reptwo');
 for(const [slug,cookie] of [['one-data',one],['two-data',two]]){
  assert.equal((await call(e,'/api/sales/salons/create',{slug,name:'مزون '+slug},cookie)).status,200);
  const id=e.DB.sql.prepare('SELECT id FROM salons WHERE slug=?').get(slug).id;
  const sess=crypto.randomUUID(),now=Date.now();
  e.DB.sql.prepare('INSERT INTO sessions(id,salon_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?)').run(sess,id,crypto.randomUUID().replaceAll('-',''),now+600000,now);
  e.DB.sql.prepare('INSERT INTO leads(id,salon_id,session_id,name,phone,original_id,idem,created_at,status,salon_status) VALUES(?,?,?,?,?,?,?,?,?,?)').run(crypto.randomUUID(),id,sess,slug+' عروس','+989121234567',crypto.randomUUID(),crypto.randomUUID(),now,'sent','new');
 }
 const own=await call(e,'/api/sales/salons/customers?slug=one-data',undefined,one);
 assert.equal(own.status,200,JSON.stringify(own));assert.equal(own.data.customers.length,1);
 assert.equal(own.data.customers[0].name,'one-data عروس');assert.equal(own.data.customers[0].phone,'+989121234567');
 assert(!('original_id' in own.data.customers[0]),'no customer private media IDs in sales CRM');
 assert.equal((await call(e,'/api/sales/salons/customers?slug=two-data',undefined,one)).status,404);
 assert.equal((await call(e,'/api/sales/salons/customers?slug=one-data',undefined,two)).status,404);
 assert.equal((await call(e,'/api/sales/salons/customers?slug=one-data',{status:'deleted'},one)).status,404);
});
test('pricing remains readonly to marketer, and campaign expires back to base rates',async()=>{
 const e=fixture();await rep(e,'repone');
 const one=await login(e,'repone');
 const p=await call(e,'/api/sales/pricing',undefined,one);assert.equal(p.status,200,JSON.stringify(p));
 assert.equal(p.data.plans.length,3);
 assert.equal((await call(e,'/api/sales/admin/pricing',undefined,one)).status,401);
 assert.equal((await call(e,'/api/sales/admin/pricing',{plans:[]},one)).status,401);
 const cfg=await call(e,'/api/sales/admin/pricing',undefined,owner);assert.equal(cfg.status,200);
 const edited={...cfg.data.pricing,campaign:'ویژه',campaign_end:Date.now()+3600000};
 edited.plans[0].base=25000000;edited.plans[0].promo=13000000;
 assert.equal((await call(e,'/api/sales/admin/pricing',edited,owner)).status,200);
 const active=await call(e,'/api/sales/pricing',undefined,one);assert.equal(active.data.plans[0].price,13000000);
 edited.campaign_end=Date.now()-1000;
 assert.equal((await call(e,'/api/sales/admin/pricing',edited,owner)).status,200);
 const expired=await call(e,'/api/sales/pricing',undefined,one);assert.equal(expired.data.plans[0].price,25000000);
});
test('owner approves bot only for assigned salon, and cannot be rotated after linking',async()=>{
 const e=fixture();await rep(e,'repone');const one=await login(e,'repone');
 await call(e,'/api/sales/salons/create',{slug:'bot-check',name:'مزون ربات'},one);
 assert.equal((await call(e,'/api/sales/admin/bot-approve',{slug:'bogus',approved:true},owner)).status,404);
 const list=await call(e,'/api/sales/admin/pending-bots',undefined,owner);
 assert.equal(list.status,200);assert.equal(list.data.salons[0].bot_link_approved,0);
 assert.equal((await call(e,'/api/sales/admin/bot-approve',{slug:'bot-check',approved:true},one)).status,401);
 assert.equal((await call(e,'/api/sales/admin/bot-approve',{slug:'bot-check',approved:true},owner)).status,200);
 assert.equal((await call(e,'/api/sales/salons/bot-link',{slug:'bot-check'},one)).status,200);
 e.DB.sql.prepare('UPDATE salons SET telegram_chat_id=? WHERE slug=?').run('12345','bot-check');
 assert.equal((await call(e,'/api/sales/salons/bot-link',{slug:'bot-check'},one)).status,403);
});
