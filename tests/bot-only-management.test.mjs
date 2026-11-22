import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';
import app from '../worker/index.js';

const origin='https://test.example';
const owner={'origin':origin,'oai-authenticated-user-id':'owner-a','oai-authenticated-user-email':'owner@test'};
const migrations=readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort();
function fixture(){
 const DB=database();for(const f of migrations)DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
 return {DB,BUCKET:memoryBucket(),OWNER_EMAIL:'owner@test',TRUST_PLATFORM_IDENTITY:'true',APP_ORIGIN:origin,TELEGRAM_BOT_TOKEN:'123:abc',TELEGRAM_BOT_USERNAME:'ayneh_bot',TELEGRAM_WEBHOOK_SECRET:'hook-secret'};
}
async function req(env,path,body,auth=false){
 const method=body===undefined?'GET':'POST';
 const r=await app.fetch(new Request(origin+path,{method,headers:{origin,...(auth?owner:{}),...(body===undefined?{}:{'content-type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})}),env);
 return {status:r.status,data:await r.json().catch(()=>null),location:r.headers.get('location')};
}
function captureBot(){
 const old=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,init)=>{
  if(!String(url).startsWith('https://api.telegram.org/'))return old(url,init);
  const method=String(url).split('/').pop();
  const body=init?.body instanceof FormData?Object.fromEntries(init.body.entries()):JSON.parse(init?.body||'{}');
  calls.push({method,body});
  return Response.json({ok:true,result:{message_id:calls.length}});
 };
 return {calls,restore(){globalThis.fetch=old}};
}
async function hook(env,chat,text){
 return app.fetch(new Request(origin+'/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':'hook-secret'},body:JSON.stringify({message:{chat:{id:chat,type:'private'},from:{id:chat,first_name:'مدیر'},text}})}),env);
}
async function button(env,chat,data){
 return app.fetch(new Request(origin+'/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':'hook-secret'},body:JSON.stringify({callback_query:{id:'cb-'+Math.random(),data,message:{chat:{id:chat,type:'private'},message_id:78}}})}),env);
}
async function make(env,slug){
 const r=await req(env,'/api/salons',{slug,name:'مزون '+slug},true);
 assert.equal(r.status,200,JSON.stringify(r));return r.data.id;
}
function lead(env,sid,name,phone){
 const id=crypto.randomUUID(),session=crypto.randomUUID(),now=Date.now();
 env.DB.sql.prepare('INSERT INTO sessions(id,salon_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?)').run(session,sid,crypto.randomUUID().replaceAll('-',''),now+3600000,now);
 env.DB.sql.prepare('INSERT INTO leads(id,salon_id,session_id,name,phone,original_id,idem,status,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(id,sid,session,name,phone,crypto.randomUUID(),crypto.randomUUID(),'sent',now);
 return id;
}
test('bot-only default: owner is sole manager and public signup and legacy manager panels are closed',async()=>{
 const env=fixture();
 assert.equal((await req(env,'/register')).status,302);
 assert.equal((await req(env,'/api/trial',{name:'owner'})).status,403);
 assert.equal((await req(env,'/api/owner/accounts')).status,401);
 const sid=await make(env,'royal-test');
 assert.equal((await req(env,'/api/s/royal-test/owner')).status,401);
 assert.equal((await req(env,'/api/s/royal-test/owner',undefined,true)).status,200);
 assert.equal((await req(env,'/api/s/royal-test/manager/login',{username:'manager',password:'secret'})).status,403);
 assert.equal((await req(env,'/api/owner/manager',{slug:'royal-test',username:'x',password:'secret123'},true)).status,403);
 const token=env.DB.sql.prepare('SELECT manage_token FROM salons WHERE id=?').get(sid).manage_token;
 assert.equal((await req(env,'/api/m/'+token)).status,403);
 const page=await app.fetch(new Request(origin+'/m/'+token),env);assert.equal(page.status,404);
 const approved=await req(env,'/api/owner/account',{slug:'royal-test',approved:true,subdomain:'royaltest'},true);
 assert.equal(approved.status,200,JSON.stringify(approved));
 const mgr=await app.fetch(new Request('https://royaltest.test.example/manager'),env);assert.equal(mgr.status,404);
 const publicSalon=await app.fetch(new Request('https://royaltest.test.example/'),env);assert.equal(publicSalon.status,200);
});
test('single-use admin invite links exactly one Telegram manager chat and CRM never leaks another salon',async()=>{
 const env=fixture(),bot=captureBot();
 try{
  const sid=await make(env,'royal-one'),other=await make(env,'royal-two');
  const invite=await req(env,'/api/s/royal-one/owner/telegram-link',{},true);
  assert.equal(invite.status,200,JSON.stringify(invite));
  const link=invite.data.links.telegram;assert.match(link,/^https:\/\/t\.me\/ayneh_bot\?start=[a-f0-9]{24}$/);
  assert.equal((await hook(env,101,'/start '+link.split('start=')[1])).status,200);
  assert.equal(env.DB.sql.prepare('SELECT telegram_chat_id AS chat FROM salons WHERE id=?').get(sid).chat,'101');
  await hook(env,202,'/start '+link.split('start=')[1]);
  assert.equal(env.DB.sql.prepare('SELECT telegram_chat_id AS chat FROM salons WHERE id=?').get(sid).chat,'101','invite is consumed');
  const own=lead(env,sid,'سارا','+989121234567'),foreign=lead(env,other,'شخص مزون دیگر','+989355556677');
  bot.calls.length=0;await hook(env,101,'/customers');
  const cust=bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text;
  assert.match(cust,/09121234567/);assert.doesNotMatch(cust,/09355556677/);
  bot.calls.length=0;await hook(env,101,'/requests');
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/سارا/);
  bot.calls.length=0;await hook(env,101,'/find 09121234567');
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/09121234567/);
  bot.calls.length=0;await button(env,101,'cr:d:'+foreign);
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/نیست/);
  bot.calls.length=0;await button(env,101,'cu:d:'+own);
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/09121234567/);
  bot.calls.length=0;await hook(env,101,'/export');
  const document=bot.calls.find(x=>x.method==='sendDocument')?.body?.document;
  assert.ok(document,'manager receives CSV');
  const csv=await document.text();assert.match(csv,/09121234567/);assert.doesNotMatch(csv,/09355556677/);
  bot.calls.length=0;await hook(env,101,'/balance');
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/اعتبار/);
  bot.calls.length=0;await button(env,202,'cu:d:'+own);
  assert.equal(bot.calls.some(x=>x.method==='sendMessage'&&String(x.body.text).includes('09121234567')),false,'unlinked chat cannot read customers');
 }finally{bot.restore()}
});

test('bot roles never collide with past bride links, and /team preserves unfinished dress uploads',async()=>{
 const env=fixture(),bot=captureBot();
 try{
  const sid=await make(env,'safe-roles');
  // This chat was once a customer, then legally became a salon manager.
  await hook(env,303,'/start c_safe-roles');
  assert.equal(env.DB.sql.prepare('SELECT COUNT(*) n FROM bot_customers WHERE chat_id=?').get('303').n,1);
  const invite=await req(env,'/api/s/safe-roles/owner/telegram-link',{},true);
  await hook(env,303,'/start '+invite.data.links.telegram.split('start=')[1]);
  bot.calls.length=0;await hook(env,303,'/help');
  const guide=bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text;
  assert.match(guide,/راهنمای مدیر مزون/,'manager commands take priority over stale bride context');
  bot.calls.length=0;await hook(env,303,'/start c_safe-roles');
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/به مدیریت مزون متصل/);
  await hook(env,303,'/newdress');
  let draft=JSON.parse(env.DB.sql.prepare('SELECT bot_state FROM salons WHERE id=?').get(sid).bot_state);
  assert.equal(draft.dressUpload.stage,'photos');
  bot.calls.length=0;await hook(env,303,'/team');
  assert.match(bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text,/ثبت لباس هنوز تمام نشده/);
  draft=JSON.parse(env.DB.sql.prepare('SELECT bot_state FROM salons WHERE id=?').get(sid).bot_state);
  assert.equal(draft.dressUpload.stage,'photos','the /team command must not orphan the draft');
  await hook(env,303,'/cancel');
  assert.equal(env.DB.sql.prepare('SELECT bot_state FROM salons WHERE id=?').get(sid).bot_state,'');
 }finally{bot.restore()}
});
test('staff member cannot use legacy customer referral link in bot-only mode',async()=>{
 const env=fixture(),bot=captureBot();
 try{
  await make(env,'team-lock');
  const resp=await req(env,'/api/s/team-lock/owner/team',{name:'کارشناس لباس',specialty:'فروش'},true);
  assert.equal(resp.status,200,JSON.stringify(resp));
  const code=resp.data.links.telegram.split('start=')[1];
  await hook(env,404,'/start '+code);
  bot.calls.length=0;await hook(env,404,'/link');
  const reply=bot.calls.filter(x=>x.method==='sendMessage').at(-1).body.text;
  assert.match(reply,/غیرفعال/);
  assert.doesNotMatch(reply,/\?r=/);
 }finally{bot.restore()}
});

test('size buttons apply to the same published dress and respect salon scope',async()=>{
 const env=fixture(),bot=captureBot();
 try{
  const id=await make(env,'size-sync'),foreign=await make(env,'size-other');
  const invite=await req(env,'/api/s/size-sync/owner/telegram-link',{},true);
  await hook(env,515,'/start '+invite.data.links.telegram.split('start=')[1]);
  const dress=crypto.randomUUID(),otherDress=crypto.randomUUID(),now=Date.now();
  const insert=(pid,salon)=>env.DB.sql.prepare("INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at,line,sizes) VALUES(?,?,?,'','','','[]',1,1,1,?,'dress','[]')").run(pid,salon,'لباس عروس نمونه',now);
  insert(dress,id);insert(otherDress,foreign);
  await button(env,515,'sz:'+dress+':38');
  await button(env,515,'sz:'+dress+':40');
  const row=env.DB.sql.prepare('SELECT sizes FROM portfolio WHERE id=?').get(dress);
  assert.deepEqual(JSON.parse(row.sizes),['38','40']);
  // Reopening an unfinished size step must show already selected sizes, not an empty keyboard.
  env.DB.sql.prepare('UPDATE salons SET bot_state=? WHERE id=?').run(JSON.stringify({p:'telegram',chat:'515',ts:Date.now(),dressUpload:{stage:'sizes',id:dress,name:'لباس عروس نمونه',images:[],staffId:null}}),id);
  bot.calls.length=0;
  await hook(env,515,'/newdress');
  const keyboard=bot.calls.filter(x=>x.method==='sendMessage'&&x.body.reply_markup?.inline_keyboard).at(-1)?.body.reply_markup.inline_keyboard.flat().map(x=>x.text)||[];
  assert(keyboard.filter(x=>x.startsWith('✅ ')).length>=3,'saved 38/40 selections and confirm button are visible');
  await button(env,515,'sz:'+otherDress+':42');
  assert.equal(env.DB.sql.prepare('SELECT sizes FROM portfolio WHERE id=?').get(otherDress).sizes,'[]');
 }finally{bot.restore()}
});
