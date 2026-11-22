// Salon bot for Telegram and Bale (بله). Bale speaks the Telegram Bot API at tapi.bale.ai, so
// one code path serves both; a salon can link either or both, and gets every submission in each.
// - The owner creates a one-time link in /admin; /start <code> links that chat to the salon and
//   starts a short setup wizard that fills the salon page field by field.
// - Every customer submission arrives as a photo album plus a details message with three
//   one-tap buttons (called / booked / not possible). Untouched submissions are reminded twice.
// - A customer may follow her submission through the bot and is told when the salon acts.
// - Any photo the salon sends (outside the wizard) is published as portfolio.
// - A mobile number typed to the bot is texted the salon's page link (Melipayamak, sms.js).
// - Team: the manager adds staff with /team; each member links their own chat, gets a personal
//   referral link (/link), receives only their own customers' requests and posts their own work.
//   Requests from the salon's own customers go to the manager, who hands them to a member.
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, TELEGRAM_WEBHOOK_SECRET,
//          BALE_BOT_TOKEN, BALE_BOT_USERNAME (BALE_WEBHOOK_SECRET defaults to the Telegram one).
import {Problem,must,uid,hash,text,phone,safeLink,digits,limited} from './domain.js';
import {DRESS_SIZES,SIZE_LABEL,parseDressSizes} from './dress-sizes.js';
import {inviteReady,sendInvite} from './sms.js';
import {shareLinks,shareKeyboard} from './share.js';
import {bucketFor,putImage} from './storage.js';
import {normalizeDressPhoto} from './dress-background.js';
import {createStaff,transfer,assign,team as teamOf,SPECIALTIES} from './referral.js';
import {LINE_LABEL} from './lines.js';
import {setLeadStatus} from './dresses.js';
import {notifyOwner,linkOwner,isOwnerChat,sendDigest,setupStatus} from './alerts.js';
import {newSession} from './server.js';
import {setConsent} from './social.js';
import {creditStatus,requestRecharge,PACKS} from './credits.js';
import {supportMessage,aiCheckCommand} from './support.js';
import {sendWelcome,onbCallback,onboardingMessage,clearOnb,processDue} from './onboarding.js';
const botOnly=env=>env?.SALON_MANAGEMENT_MODE!=='legacy';
const STALE=20*60000; // an unfinished wizard or team question is dropped after 20 idle minutes

const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const all=async(db,sql,...a)=>(await db.prepare(sql).bind(...a).all()).results;
const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}});
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
const CATEGORIES=['ساده','پفی','ماهی','پوشیده','دانتل','دنباله‌دار','سنگ‌دوزی'];

export const PLATFORMS={
 telegram:{name:'telegram',label:'تلگرام',api:'https://api.telegram.org',col:'telegram_chat_id',html:true,token:e=>e?.TELEGRAM_BOT_TOKEN,user:e=>(e?.TELEGRAM_BOT_USERNAME||'').replace(/^@/,''),link:(u,c)=>'https://t.me/'+u+'?start='+c},
 bale:{name:'bale',label:'بله',api:'https://tapi.bale.ai',col:'bale_chat_id',html:false,token:e=>e?.BALE_BOT_TOKEN,user:e=>(e?.BALE_BOT_USERNAME||'').replace(/^@/,''),link:(u,c)=>'https://ble.ir/'+u+'?start='+c}
};
export const platformReady=(env,p)=>!!PLATFORMS[p].token(env);
export const botReady=env=>platformReady(env,'telegram')||platformReady(env,'bale');
export const baleSecret=env=>env?.BALE_WEBHOOK_SECRET||env?.TELEGRAM_WEBHOOK_SECRET||'';
// Platforms on which this salon can actually receive messages right now.
export const inboxes=(env,salon)=>Object.values(PLATFORMS).filter(P=>salon?.[P.col]&&P.token(env)).map(P=>P.name);
export function followLinks(env,token){const out={};for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)out[P.name]=P.link(u,'f_'+token)}return out}

// Links that open the bot already tied to a boutique: a bride sends her photo there instead of using the page.
export function customerLinks(env,slug){const out={};if(!/^[a-z0-9-]{1,62}$/.test(slug))return out;for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)out[P.name]=P.link(u,'c_'+slug)}return out}

const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const plain=s=>String(s??'').replace(/<\/?(b|blockquote)>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const local=p=>String(p||'').replace(/^\+98/,'0');
const fa=n=>Number(n).toLocaleString('fa-IR');

// One API call. Bale gets plain text (no parse_mode) and the classic reply_to_message_id.
const stripDeco=rm=>({...rm,inline_keyboard:rm.inline_keyboard.map(r=>r.map(({style,icon_custom_emoji_id,...x})=>x))});
export async function call(env,p,method,payload){
 const P=PLATFORMS[p];must(P.token(env),'ربات '+P.label+' هنوز تنظیم نشده است',503);
 let body=payload||{};
 if(!(body instanceof FormData)){
  body={...body};
  if(!P.html&&body.parse_mode){delete body.parse_mode;if(body.text)body.text=plain(body.text);if(body.caption)body.caption=plain(body.caption)}
  if(p!=='telegram'&&body.reply_parameters){body.reply_to_message_id=body.reply_parameters.message_id;delete body.reply_parameters}
 }
 const isForm=body instanceof FormData;
 const send=async b=>{const res=await fetch(P.api+'/bot'+P.token(env)+'/'+method,{method:'POST',...(isForm?{body:b}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}),signal:AbortSignal.timeout(25000)});return {res,d:await res.json().catch(()=>({}))}};
 // Button colours (style) and custom-emoji icons are Telegram-only extras: Bale never gets them, and a 400 on Telegram is retried without them.
 const decorated=!isForm&&body.reply_markup?.inline_keyboard?.some(r=>r.some(x=>x.style||x.icon_custom_emoji_id));
 if(decorated&&p!=='telegram')body={...body,reply_markup:stripDeco(body.reply_markup)};
 let {res,d}=await send(body);
 if(decorated&&p==='telegram'&&res.status===400&&(!res.ok||!d.ok)){({res,d}=await send({...body,reply_markup:stripDeco(body.reply_markup)}))}
 if(!res.ok||!d.ok)throw new Problem(502,P.label+' درخواست را نپذیرفت'+(d.description?': '+d.description:''));
 return d.result;
}
export const tg=(env,method,payload)=>call(env,'telegram',method,payload);
async function fileBytes(env,p,file_id){
 const P=PLATFORMS[p],f=await call(env,p,'getFile',{file_id});
 const res=await fetch(P.api+'/file/bot'+P.token(env)+'/'+f.file_path,{signal:AbortSignal.timeout(25000)});
 must(res.ok,'دریافت عکس از '+P.label+' ممکن نشد',502);
 return new Uint8Array(await res.arrayBuffer());
}

// One-time link the owner hands to the salon; the same code works in Telegram and Bale.
export async function newLinkCode(db,salon,env){
 const raw=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');
 await run(db,'UPDATE salons SET telegram_code_hash=?,telegram_code_expires=? WHERE id=?',await hash(raw),Date.now()+7*86400000,salon.id);
 const links={};for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)links[P.name]=P.link(u,raw)}
 return {code:raw,link:links.telegram||null,links};
}

const help=(name,sms,P)=>'<b>راهنمای مدیر مزون'+(name?' — '+esc(name):'')+'</b>\n\n'+
'<b>ثبت لباس</b>\n/newdress شروع ثبت: ۱) عکس جلو ۲) بغل راست ۳) بغل چپ ۴) پشت، هر عکس جداگانه. سپس نام مدل، انتخاب چند سایز و ثبت نهایی. /cancel لغو.\n\n'+
'<b>مدیریت</b>\n/list نمونه‌کارها\n/team اعضا\n/customers مشتری‌ها\n/requests درخواست‌ها\n/find 09121234567 جستجو\n/export خروجی\n/balance اعتبار\n/help راهنما.\n\nتنظیمات مزون فقط از ادمین آینه انجام می‌شود؛ ارسال لینک مشتری از ربات غیرفعال است.';
const ownerHelp='<b>گزارش‌های مزون آینه</b>\n\nاز این به بعد هشدارها همین‌جا می‌آید: مزون یا مزون‌داری که ربات را وصل کرد یا نکرد، صفحه‌ای که کامل یا نیمه‌کاره ماند، درخواستی که ۲۴ ساعت بی‌جواب ماند یا گیر کرد، و خطاهای ربات. هر شب ساعت ۲۱ هم خلاصهٔ روز می‌آید.\n\n/report خلاصهٔ همین الان';
async function salonByChat(db,p,chat){return one(db,'SELECT * FROM salons WHERE '+PLATFORMS[p].col+'=?',String(chat))}
// Who is writing: the salon's manager chat, or a team member's chat (manager wins if both).
export async function actorByChat(db,p,chat){
 const salon=await salonByChat(db,p,chat);if(salon)return {salon,role:'manager',staff:await one(db,'SELECT * FROM team WHERE salon_id=? AND is_manager=1 AND active=1',salon.id)};
 const staff=await one(db,'SELECT * FROM team WHERE '+PLATFORMS[p].col+'=? AND active=1',String(chat));
 if(!staff)return null;
 return {salon:await one(db,'SELECT * FROM salons WHERE id=?',staff.salon_id),staff,role:'staff'};
}
const refUrl=(origin,salon,t)=>origin+'/s/'+salon.slug+'?r='+t.ref_code;
const staffHelp=(t,salon,origin,sms)=>'<b>'+esc(t.name)+' — '+esc(salon.name)+'</b>\n/newdress ثبت چهار عکس (جلو، بغل راست، بغل چپ، پشت)، نام مدل و انتخاب سایزها\n/cancel انصراف\n/list نمونه‌کارها\n/requests درخواست‌ها\n/customers مشتری‌ها\n/help راهنما.\n\nارسال لینک مشتری غیرفعال است.';
// One-time invite for a member (same code format as the salon link, kept on the member's row).
export async function staffInvite(db,env,t){
 const raw=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');
 await run(db,'UPDATE team SET invite_hash=?,invite_expires=? WHERE id=?',await hash(raw),Date.now()+7*86400000,t.id);
 const links={};for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)links[P.name]=P.link(u,raw)}
 return links;
}

export async function webhook(req,env,exec){
 must(req.method==='POST','متد مجاز نیست',405);
 must(env.TELEGRAM_WEBHOOK_SECRET&&req.headers.get('x-telegram-bot-api-secret-token')===env.TELEGRAM_WEBHOOK_SECRET,'دسترسی مجاز نیست',403);
 return handle(req,env,'telegram',exec);
}
// Bale is authenticated by a secret in the webhook path (works whether or not Bale sends the
// secret-token header).
export async function baleWebhook(req,env,secret,exec){
 must(req.method==='POST','متد مجاز نیست',405);
 const want=baleSecret(env);must(want&&secret===want,'دسترسی مجاز نیست',403);
 return handle(req,env,'bale',exec);
}
async function handle(req,env,p,exec){
 const u=await req.json().catch(()=>({}));const db=env.DB,origin=env.APP_ORIGIN||new URL(req.url).origin;
 const ctx={env,db,p,origin,hasExec:!!exec?.waitUntil,wait:pr=>{try{exec?.waitUntil(pr)}catch{}}};
 try{
  // Telegram may deliver the same update twice; handle each once.
  if(Number.isInteger(u.update_id)){const seen=await run(db,'INSERT OR IGNORE INTO bot_seen(key,created_at) VALUES(?,?)',p+':'+u.update_id,Date.now());if(!seen.meta.changes)return J({ok:true})}
  if(u.callback_query){await onCallback(ctx,u.callback_query);return J({ok:true})}
  const m=u.message;if(!m||m.chat?.type!=='private')return J({ok:true});
  ctx.chat=String(m.chat.id);ctx.name=String(m.from?.first_name||'').replace(/\s+/g,' ').trim().slice(0,40);ctx.say=(t,extra={})=>call(env,p,'sendMessage',{chat_id:ctx.chat,text:t,...extra});
  const textIn=(m.text||'').trim();
  const owner=await isOwnerChat(db,p,ctx.chat).catch(()=>false);ctx.owner=owner;
  // The owner re-tests often: any message from the owner chat delivers overdue videos right away (never throws).
  if(owner)await processDue(env,{origin,limit:5});
  if(/^\/aicheck(@\w+)?$/i.test(textIn)){if(owner)await aiCheckCommand(ctx);return J({ok:true})}
  if(/^\/start(@\w+)?(\s|$)/.test(textIn)){await onStart(ctx,textIn.split(/\s+/)[1]||'');return J({ok:true})}
  if(/^\/(welcome|platform)(@\w+)?$/i.test(textIn)){await clearOnb(db,p,ctx.chat);await sendWelcome(ctx,{panel:await hasPanel(ctx),force:true});return J({ok:true})}
  if(!botOnly(env)&&await onboardingMessage(ctx,m,textIn))return J({ok:true});
  if(/^\/help(@\w+)?$/.test(textIn)&&owner&&!await actorByChat(db,p,ctx.chat)){await sendManagerHelp(ctx);return J({ok:true})}
  if(textIn==='/report'&&owner){await sendDigest(env,[{platform:p,chat_id:ctx.chat}]);return J({ok:true})}
  const actor=await actorByChat(db,p,ctx.chat);
  // Someone who opened the bot from a boutique's customer link is a bride, not staff.
  const bc=await one(db,'SELECT * FROM bot_customers WHERE platform=? AND chat_id=?',p,ctx.chat);
  if(bc&&!actor){await customerMessage(ctx,bc,m);return J({ok:true})}
  if(!actor){await strangerMessage(ctx,m,textIn);return J({ok:true})}
  const salon=actor.salon;ctx.salon=salon;ctx.staff=actor.staff||null;ctx.role=actor.role;
  if(actor.role==='staff'){await staffMessage(ctx,m,textIn);return J({ok:true})}
  if(textIn==='/customers'){await sendCustomers(ctx);return J({ok:true})}
  if(textIn==='/requests'){await sendRequests(ctx);return J({ok:true})}
  if(textIn==='/export'){await exportCustomers(ctx);return J({ok:true})}
  if(textIn==='/balance'){await sendBalance(ctx);return J({ok:true})}
  if(textIn.startsWith('/find ')){await findCustomer(ctx,textIn.slice(6));return J({ok:true})}
  if(textIn==='/link'&&botOnly(env)){await ctx.say('ارسال لینک مشتری غیرفعال است.');return J({ok:true})}
   if(textIn==='/link'){await managerLink(ctx);return J({ok:true})}
  if(textIn==='/team'){const draft=parse(salon.bot_state);if(draft.dressUpload){await ctx.say('ثبت لباس هنوز تمام نشده است. ابتدا ثبت را با انتخاب سایزها تکمیل کنید یا /cancel را بزنید، بعد /team را باز کنید.');return J({ok:true})}await run(db,"UPDATE salons SET bot_state='' WHERE id=?",salon.id);await sendTeam(ctx);return J({ok:true})}
  if(textIn==='/help'){await ctx.say(help(salon.name,inviteReady(env),PLATFORMS[p]),{parse_mode:'HTML'});return J({ok:true})}
  if(textIn==='/list'){await sendList(ctx);return J({ok:true})}
  if(textIn==='/share'&&botOnly(env)){await ctx.say('ارسال لینک مشتری غیرفعال است.');return J({ok:true})}
   if(textIn==='/share'){await shareInvites(ctx,[],ctx.staff);return J({ok:true})}
  if(textIn==='/setup'&&botOnly(env)){await ctx.say('تنظیمات مزون فقط در ادمین آینه انجام می‌شود.');return J({ok:true})}
   if(textIn==='/setup'){await wizardStart(ctx,0);return J({ok:true})}
  let state=parse(salon.bot_state);
   if(botOnly(env)&&['/newdress','/cancel','/stop'].includes(textIn)){if(textIn==='/newdress')await beginDress(ctx);else await cancelDress(ctx);return J({ok:true})}
   if(botOnly(env)&&state.dressUpload&&state.chat===ctx.chat&&state.p===p){if(!state.ts||Date.now()-state.ts>STALE){await expireState(env,salon,state,ctx)}else{await dressReply(ctx,state,m,textIn)}return J({ok:true})}
  const photo=photoOf(m);
  // An unfinished question older than 20 minutes no longer captures messages.
  if(state.p&&(!state.ts||Date.now()-state.ts>STALE)){await expireState(env,salon,state,ctx);state={}}
  if(state.p===p&&Number.isInteger(state.step)){
   // A captioned photo while the wizard waits for text is portfolio, not an answer.
   if(photo&&m.caption&&WIZ[state.step]?.type!=='photo'){await addPortfolio(ctx,photo,m.caption,m.media_group_id,m.message_id);return J({ok:true})}
   await wizardAnswer(ctx,state,m);return J({ok:true});
  }
  if(state.p===p&&state.dress&&!photo&&textIn&&!textIn.startsWith('/')){
   const nm=text(textIn,150);await run(db,"UPDATE salons SET bot_state='' WHERE id=?",salon.id);
   if(!nm){await ctx.say('نام مدل نمی‌تواند خالی باشد.');await run(db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({...state,ts:Date.now()}),salon.id);return J({ok:true})}
   await run(db,'UPDATE portfolio SET title=? WHERE id=? AND salon_id=?',nm,state.dress,salon.id);await ctx.say('✅ اسم لباس شد «'+esc(nm)+'».');return J({ok:true});
  }
  if(state.p===p&&state.team&&!photo){await teamAnswer(ctx,state,textIn);return J({ok:true})}
  const numbers=botOnly(env)?[]:mobilesIn(textIn);
  if(numbers.length){if(inviteReady(env))await sendInvites(env,db,salon,ctx.chat,numbers,ctx.say);else await shareInvites(ctx,numbers,ctx.staff);return J({ok:true})}
  if(photo){if(botOnly(env))await ctx.say('ابتدا /newdress را بزنید.');else await addPortfolio(ctx,photo,m.caption||'',m.media_group_id,m.message_id);return J({ok:true})}
  if(await supportMessage(ctx,m,textIn,ctx.owner?'owner':'manager'))return J({ok:true});
  await ctx.say(botOnly(env)?'برای ثبت لباس /newdress و راهنما /help را بزنید.':'برای افزودن نمونه‌کار عکس بفرستید.');
  return J({ok:true});
 }catch(e){
  // Always 200 so a bad update is not redelivered forever. The sender is told what went wrong in
  // plain words and the owner is alerted.
  console.error(p+' webhook',e?.message);
  const why=e instanceof Problem?e.message:'یک مشکل پیش آمد و کار انجام نشد';
  if(ctx.say)await ctx.say('⚠️ '+why+'. دوباره امتحان کنید؛ اگر باز نشد، به تیم مزون آینه خبر بدهید.').catch(()=>{});
  await notifyOwner(env,{salon:ctx.salon,kind:'error',level:'error',text:'خطای ربات'+(ctx.staff&&ctx.role==='staff'?' برای '+ctx.staff.name:'')+': '+String(e?.message||e).slice(0,200)});
  return J({ok:false});
 }
}
// A chat that is neither a salon nor a member: usually a customer who tapped "notify me".
async function strangerMessage(ctx,m={},textIn=''){
 const l=await one(ctx.db,'SELECT l.salon_status,l.look,s.name AS salon_name,s.profile AS salon_profile FROM leads l JOIN salons s ON s.id=l.salon_id WHERE l.follow_chat=? AND l.follow_platform=? ORDER BY l.created_at DESC LIMIT 1',ctx.chat,ctx.p);
 if(l){const tel=parse(l.salon_profile).phone;await ctx.say('این ربات فقط وضعیت درخواستت را خبر می‌دهد و پیامت را به مزون نمی‌رساند.\n\nوضعیت درخواستت در «'+l.salon_name+'»'+(l.look?' ('+l.look+')':'')+': '+STATUS[l.salon_status||'new']+'.'+(tel?'\n📞 برای صحبت با مزون: '+local(tel):''));return}
 if(await supportMessage(ctx,m,textIn))return;
 await ctx.say('این گفتگو به هیچ مزونی وصل نیست.\n• اگر مزون‌دار یا مدیر مزون هستید، لینک اتصال را از تیم مزون آینه یا مدیر مزونتان بگیرید و باز کنید.\n• اگر مشتری هستید، از صفحهٔ مزون درخواست بفرستید و بعد «خبرم کن» را بزنید.');
}
const photoOf=m=>m.photo?.length?m.photo[m.photo.length-1]:(m.document&&/^image\/(jpeg|png|webp)$/.test(m.document.mime_type||'')?m.document:null);

// Ties this chat to the salon: one chat serves one salon, so linking moves it. Shared by the one-time
// /start <code> link and the manager's phone+password sign-in (onboarding.js).
export async function linkSalonChat(ctx,salon,{wizard=true,via=''}={}){
 const {env,db,p}=ctx,P=PLATFORMS[p];
 await run(db,'UPDATE salons SET '+P.col+'=NULL WHERE '+P.col+'=? AND id<>?',ctx.chat,salon.id);
 await run(db,'UPDATE salons SET '+P.col+'=?,telegram_code_hash=NULL,telegram_code_expires=NULL WHERE id=?',ctx.chat,salon.id);
 ctx.salon={...salon,[P.col]:ctx.chat};
 const prof=parse(salon.profile),missing=['logo','cover','address','phone'].filter(k=>!prof[k]).length;
 await ctx.say('✅ این گفتگو به «'+esc(salon.name)+'» وصل شد. از این به بعد درخواست مشتری‌ها همین‌جا می‌آید.',{parse_mode:'HTML'});
 await notifyOwner(env,{salon,kind:'setup',level:'good',text:(via?via+': ':'')+'ربات را در '+P.label+' وصل کرد.'});
 // Requests that waited for the manager go out now.
 await run(db,"UPDATE leads SET waiting=0,status='retry',attempts=0 WHERE salon_id=? AND staff_id IS NULL AND waiting=1",salon.id);
 for(const l of await all(db,"SELECT * FROM leads WHERE salon_id=? AND staff_id IS NULL AND status='retry' ORDER BY created_at LIMIT 20",salon.id))await deliverLead(env,l);
 if(wizard&&missing>=2)await wizardStart(ctx,0,true);
 else await ctx.say(help('',inviteReady(env),P),{parse_mode:'HTML'});
}

async function onStart(ctx,arg){
 const {env,db,p}=ctx,P=PLATFORMS[p];
 if(/^[a-f0-9]{24}$/.test(arg)){
  const salon=await one(db,'SELECT * FROM salons WHERE telegram_code_hash=? AND telegram_code_expires>?',await hash(arg),Date.now());
  if(!salon){const t=await one(db,'SELECT * FROM team WHERE invite_hash=? AND invite_expires>? AND active=1',await hash(arg),Date.now());if(t){await linkStaff(ctx,t);return}}
  if(!salon){await ctx.say('این لینک اتصال منقضی یا قبلاً استفاده شده است. لینک تازه را از تیم مزون آینه بگیرید.');return}
  await linkSalonChat(ctx,salon,{wizard:!botOnly(env),via:'لینک اختصاصی یک‌بارمصرف ادمین'});
  return;
 }
 if(/^f_[a-f0-9]{24}$/.test(arg)){await follow(ctx,arg.slice(2));return}
 if(/^c_[a-z0-9-]{1,62}$/.test(arg)){await customerStart(ctx,arg.slice(2));return}
 if(/^o_[a-f0-9]{24}$/.test(arg)){if(await linkOwner(db,p,ctx.chat,arg.slice(2)))await ctx.say(ownerHelp,{parse_mode:'HTML'});else await ctx.say('این لینک گزارش منقضی یا قبلاً استفاده شده است. از صفحهٔ ادمین لینک تازه بسازید.');return}
 await clearOnb(db,p,ctx.chat);
 const actor=await actorByChat(db,p,ctx.chat);
 if(actor&&botOnly(env)){
  ctx.salon=actor.salon;ctx.staff=actor.staff||null;ctx.role=actor.role;
  // /start is an explicit fresh start for the salon's dress-registration wizard.
  // Discard only the unfinished draft. Never delete a published dress.
  const state=parse((await one(db,'SELECT bot_state FROM salons WHERE id=?',actor.salon.id))?.bot_state);
  if(state.dressUpload){
   if(state.chat!==ctx.chat||state.p!==p){await ctx.say('ثبت لباس دیگری توسط یکی از اعضای مزون در جریان است. ابتدا همان عضو باید ثبت را پایان دهد یا لغو کند.');return}
   if(state.dressUpload.id){
    await run(db,'DELETE FROM portfolio_imgs WHERE portfolio_id=? AND EXISTS(SELECT 1 FROM portfolio WHERE id=? AND salon_id=? AND published=0)',state.dressUpload.id,state.dressUpload.id,actor.salon.id);
    await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=? AND published=0',state.dressUpload.id,actor.salon.id);
   }
  }
  await run(db,"UPDATE salons SET bot_state='' WHERE id=?",actor.salon.id);
  await beginDress(ctx);
  return;
 }
 // Unlinked visitors receive the platform introduction, but linked owners never receive promo videos.
 await sendWelcome(ctx,{panel:await hasPanel(ctx),force:false});
}
const hasPanel=async ctx=>!!(await actorByChat(ctx.db,ctx.p,ctx.chat))||(ctx.owner??await isOwnerChat(ctx.db,ctx.p,ctx.chat).catch(()=>false));
// The manager / team / owner help for this chat. Returns false when the chat has none.
export async function sendManagerHelp(ctx,extra={}){
 const {env,db,p}=ctx,P=PLATFORMS[p],a=await actorByChat(db,p,ctx.chat);
 if(a?.role==='staff'){await ctx.say(staffHelp(a.staff,a.salon,ctx.origin,inviteReady(env)),{parse_mode:'HTML',...extra});return true}
 if(a?.salon){await ctx.say(help(a.salon.name,inviteReady(env),P),{parse_mode:'HTML',...extra});return true}
 if(await isOwnerChat(db,p,ctx.chat)){await ctx.say(ownerHelp,{parse_mode:'HTML',...extra});return true}
 return false;
}

/* ---------- setup wizard: the salon fills its own page, one question at a time ---------- */
const WIZ=[
 {k:'name',type:'text',ask:'اسم مزون چیست؟ همان اسمی که مشتری‌ها می‌شناسند. فقط اسم را بنویسید، مثلاً «مزون زیبایی ساناز».'},
 {k:'logo',type:'photo',ask:'لوگوی مزون را به‌صورت عکس بفرستید (📎 ← عکس). مربعی بهتر است.'},
 {k:'cover',type:'photo',ask:'یک عکس خوب برای بالای صفحه بفرستید: داخل مزون یا یکی از بهترین کارهایتان. عکس عمودی بهتر می‌نشیند.'},
 {k:'bio',type:'text',ask:'یکی دو خط دربارهٔ مزون بنویسید. تخصصتان چیست؟ مثلاً «تخصص ما لباس‌های ساده و دانتل است.»'},
 {k:'address',type:'text',ask:'آدرس مزون را در یک خط بنویسید، مثلاً «تهران، سعادت‌آباد، خیابان سرو، پلاک ۲۴».'},
 {k:'map',type:'location',ask:'اگر می‌خواهید مشتری بتواند مسیریابی کند، موقعیت مزون را بفرستید (📎 ← Location / موقعیت مکانی).'},
 {k:'hours',type:'text',ask:'ساعت کاری؟ مثلاً «شنبه تا پنج‌شنبه ۱۰ تا ۲۰».'},
 {k:'phone',type:'phone',ask:'شمارهٔ تماس مزون را با عدد بنویسید (موبایل یا تلفن ثابت با کد شهر)، مثلاً ۰۹۱۲۱۲۳۴۵۶۷ یا ۰۲۱۲۲۳۳۴۴۵۵.'},
 {k:'instagram',type:'insta',ask:'آیدی اینستاگرام مزون؟ مثلاً @sanaz.salon'},
 {k:'manager',type:'text',ask:'اسم مدیر یا مزون‌دار اصلی مزون را بنویسید، مثلاً «ساناز رحیمی».'},
 {k:'portrait',type:'photo',ask:'یک عکس از مدیر یا مزون‌دار بفرستید (اختیاری).'}
];
const wizKeys=(salon,step)=>{const row=[{text:'⏭ رد شو',callback_data:'wz:skip'},{text:'✅ کافی است، تمام',callback_data:'wz:done'}];return {inline_keyboard:step===0&&salon?.name?[[{text:'✔️ همین: '+salon.name.slice(0,30),callback_data:'wz:keep'}],row]:[row]}};
async function wizardStart(ctx,step,first){
 await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,step,ts:Date.now()}),ctx.salon.id);
 if(first||step===0)await ctx.say('بیایید صفحهٔ مزون را با هم کامل کنیم. '+fa(WIZ.length)+' سؤال کوتاه است.\n• هر سؤالی که الان جوابش را ندارید: «⏭ رد شو».\n• هر وقت خواستید تمامش کنید: «✅ کافی است، تمام». بعداً با /setup ادامه می‌دهید.\n• اگر ۲۰ دقیقه جوابی نیاید، خودش بسته می‌شود.');
 await wizardAsk(ctx,step);
}
async function wizardAsk(ctx,step){
 const s=WIZ[step];
 await ctx.say(fa(step+1)+' از '+fa(WIZ.length)+' — '+s.ask,{reply_markup:wizKeys(ctx.salon,step)});
}
async function wizardFinish(ctx,early){
 await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);
 const s=await one(ctx.db,'SELECT * FROM salons WHERE id=?',ctx.salon.id),st=setupStatus(s);
 await ctx.say('🎉 صفحهٔ «'+s.name+'» آماده است:\n'+ctx.origin+'/s/'+s.slug+'\n\n'+fa(st.filled.length)+' از '+fa(st.total)+' مورد پر شده.'+(st.missing.length?'\nمانده: '+st.missing.join('، ')+'. هر وقت خواستید با /setup کاملش کنید.':'')+'\n\nحالا عکس نمونه‌کارهایتان را همین‌جا بفرستید (زیر هر عکس اسم کار را بنویسید). اگر مزون‌دار دارید، با /team اضافه‌شان کنید.');
 await notifyOwner(ctx.env,{salon:s,kind:'setup',level:st.missing.length?'info':'good',text:'تنظیم صفحه را '+(early?'زودتر ':'')+'تمام کرد: '+fa(st.filled.length)+' از '+fa(st.total)+(st.missing.length?' (مانده: '+st.missing.join('، ')+')':'')+'.'});
}
async function wizardNext(ctx,step){
 const next=step+1;
 if(next>=WIZ.length){await wizardFinish(ctx,false);return}
 await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,step:next,ts:Date.now()}),ctx.salon.id);
 await wizardAsk(ctx,next);
}
async function saveProfile(ctx,patch,name){
 const cur=await one(ctx.db,'SELECT name,profile FROM salons WHERE id=?',ctx.salon.id);
 const prof={...parse(cur.profile),...patch};
 await run(ctx.db,'UPDATE salons SET name=?,profile=? WHERE id=?',name||cur.name,JSON.stringify(prof),ctx.salon.id);
 if(name)ctx.salon.name=name;
}
async function wizardAnswer(ctx,state,m){
 const step=WIZ[state.step],t=(m.text||'').trim();
 if(!step){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);return}
 if(t==='/skip'||t==='رد'){await wizardNext(ctx,state.step);return}
 if(t==='/stop'){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);await ctx.say('باشه. هر وقت خواستید با /setup ادامه بدهید.');return}
 try{
  if(step.type==='photo'){
   const ph=photoOf(m);if(!ph){await ctx.say('لطفاً یک عکس بفرستید، یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
   must((ph.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است');
   const id=await putImage(ctx.env,ctx.salon,null,await fileBytes(ctx.env,ctx.p,ph.file_id),'brand');
   await saveProfile(ctx,{[step.k]:id});
  }else if(step.type==='location'){
   const loc=m.location||m.venue?.location;
   if(loc&&Number.isFinite(loc.latitude)&&Number.isFinite(loc.longitude))await saveProfile(ctx,{map:'https://www.google.com/maps?q='+loc.latitude.toFixed(6)+','+loc.longitude.toFixed(6)});
   else if(/^https?:\/\//.test(t))await saveProfile(ctx,{map:safeLink(t)});
   else{await ctx.say('موقعیت را از 📎 ← Location بفرستید، یا لینک نقشه را بچسبانید، یا «⏭ رد شو».',{reply_markup:wizKeys(ctx.salon,state.step)});return}
  }else{
   if(!t){await ctx.say('لطفاً جواب را بنویسید، یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
   if(step.type==='phone'){const n=digits(t).replace(/[\s()-]/g,'');must(/^\+?\d{5,15}$/.test(n),'شماره درست نیست؛ فقط عدد بنویسید.');await saveProfile(ctx,{phone:n})}
   else if(step.type==='insta'){const id=t.replace(/^https?:\/\/(www\.)?instagram\.com\//,'').replace(/^@/,'').replace(/\/.*$/,'');must(/^[A-Za-z0-9._]{1,30}$/.test(id),'آیدی اینستاگرام فقط حروف انگلیسی، عدد، نقطه و _ دارد.');await saveProfile(ctx,{instagram:'https://instagram.com/'+id})}
   else if(step.k==='name'){const n=text(t,100);must(n.length>=2,'اسم کوتاه است.');await saveProfile(ctx,{},n)}
   else await saveProfile(ctx,{[step.k]:text(t,1000)});
  }
 }catch(e){await ctx.say((e instanceof Problem?e.message:'ذخیره نشد')+' دوباره بفرستید یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
 await wizardNext(ctx,state.step);
}

/* ---------- team: members, invites, referral links ---------- */
async function linkStaff(ctx,t){
 const {db,p,env}=ctx,P=PLATFORMS[p];
 if(await salonByChat(db,p,ctx.chat)){await ctx.say('این گفتگو، گفتگوی مدیر یک مزون است و نمی‌تواند عضو تیم شود. لینک دعوت را برای خود آن مزون‌دار بفرستید تا از حساب خودش باز کند. اگر خودتان هم کار می‌کنید، /link لینک اختصاصی خودتان را می‌دهد.');return}
 await run(db,'UPDATE team SET '+P.col+'=NULL WHERE '+P.col+'=? AND id<>?',ctx.chat,t.id);
 await run(db,'UPDATE team SET '+P.col+'=?,invite_hash=NULL,invite_expires=NULL WHERE id=?',ctx.chat,t.id);
 const salon=await one(db,'SELECT * FROM salons WHERE id=?',t.salon_id);
 await ctx.say('✅ '+esc(t.name)+'، به تیم «'+esc(salon.name)+'» وصل شدی.',{parse_mode:'HTML'});
 await ctx.say(staffHelp(t,salon,ctx.origin,inviteReady(env)),{parse_mode:'HTML'});
 await notifyOwner(env,{salon,kind:'team',level:'good',text:'مزون‌دار «'+t.name+'» ربات را در '+P.label+' وصل کرد.'});
 // Requests that waited for this member go out now.
 await run(db,"UPDATE leads SET waiting=0,status='retry',attempts=0 WHERE staff_id=? AND waiting=1",t.id);
 for(const l of await all(db,"SELECT * FROM leads WHERE staff_id=? AND status='retry' ORDER BY created_at LIMIT 20",t.id))await deliverLead(env,l);
 for(const q of inboxes(env,salon))await call(env,q,'sendMessage',{chat_id:salon[PLATFORMS[q].col],text:'👥 '+t.name+' ربات را وصل کرد و از این به بعد درخواست مشتری‌های خودش را می‌گیرد.'}).catch(()=>{});
}
async function staffMessage(ctx,m,textIn){
 const t=ctx.staff;
 if(textIn==='/help'){await ctx.say(staffHelp(t,ctx.salon,ctx.origin,inviteReady(ctx.env)),{parse_mode:'HTML'});return}
  if(textIn==='/link'&&!botOnly(ctx.env)){await ctx.say('لینک معرفی اختصاصی خودتان:\n'+refUrl(ctx.origin,ctx.salon,t));return}
  if(botOnly(ctx.env)&&['/link','/share','/setup'].includes(textIn)){await ctx.say('این قابلیت غیرفعال است؛ تنظیمات فقط از ادمین آینه انجام می‌شوند.');return}
  if(botOnly(ctx.env)&&['/newdress','/cancel','/stop'].includes(textIn)){if(textIn==='/newdress')await beginDress(ctx);else await cancelDress(ctx);return}
  const draft=parse(ctx.salon.bot_state);if(botOnly(ctx.env)&&draft.dressUpload&&draft.chat===ctx.chat&&draft.p===ctx.p){if(!draft.ts||Date.now()-draft.ts>STALE)await expireState(ctx.env,ctx.salon,draft,ctx);else await dressReply(ctx,draft,m,textIn);return}
 if(textIn==='/list'){await sendList(ctx);return}
 if(textIn==='/requests'){await sendRequests(ctx);return}
 if(textIn==='/customers'){await sendCustomers(ctx);return}
 const numbers=botOnly(ctx.env)?[]:mobilesIn(textIn);
 if(numbers.length){if(inviteReady(ctx.env))await sendInvites(ctx.env,ctx.db,ctx.salon,ctx.chat,numbers,ctx.say,t);else await shareInvites(ctx,numbers,t);return}
 if(textIn==='/share'&&!botOnly(ctx.env)){await shareInvites(ctx,[],t);return}
 const photo=photoOf(m);
 if(photo){if(botOnly(ctx.env))await ctx.say('ابتدا /newdress را بزن.');else await addPortfolio(ctx,photo,m.caption||'',m.media_group_id,m.message_id);return}
 if(await supportMessage(ctx,m,textIn,'staff'))return;
 await ctx.say('برای ثبت لباس /newdress را بزن.');
}
const teamLine=(t,i)=>fa(i+1)+'. <b>'+esc(t.name)+'</b>'+(t.is_manager?' (خودِ مدیر)':'')+(t.specialty&&!t.is_manager?' — '+esc(t.specialty):'')+' · '+(t.telegram_chat_id||t.bale_chat_id?'✅ وصل':'⏳ هنوز وصل نشده');
async function sendTeam(ctx){
 const list=await teamOf(ctx.db,ctx.salon.id);
 const rows=list.map(t=>[{text:'🔗 لینک‌های '+t.name.slice(0,18),callback_data:'tm:l:'+t.id},{text:'🗑 حذف',callback_data:'tm:r:'+t.id}]);
 rows.push([{text:'➕ افزودن نیرو',callback_data:'tm:add'}]);
 if(!list.some(t=>t.is_manager))rows.push([{text:'🔗 لینک اختصاصی خودم (اگر خودم هم کار می‌کنم)',callback_data:'tm:me'}]);
 await ctx.say('<b>👥 تیم «'+esc(ctx.salon.name)+'»</b>\n\n'+(list.length?list.map(teamLine).join('\n'):'هنوز نیرویی اضافه نکرده‌اید.')+'\n\nهر نیرو لینک اختصاصی خودش را می‌گیرد. هر کس با لینک او بیاید (و هر کس که او لینک را برایش بفرستد) مشتری همان نیرو می‌شود و درخواستش فقط به خود او می‌رسد. مشتری‌هایی که بدون لینک نیرو بیایند، اینجا پیش شما می‌آیند و با یک دکمه به یک نیرو می‌دهید.',{parse_mode:'HTML',reply_markup:{inline_keyboard:rows}});
}
async function showStaffLinks(ctx,t,fresh){
 const links=await staffInvite(ctx.db,ctx.env,t);
 const lines=[(fresh?'✅ «'+t.name+'» به تیم اضافه شد.':'🔗 لینک‌های «'+t.name+'»'),'',
  '۱) لینک دعوت (یک‌بار مصرف، ۷ روز) — برای خود '+t.name+' بفرستید تا ربات را وصل کند:'];
 if(links.telegram)lines.push('تلگرام: '+links.telegram);
 if(links.bale)lines.push('بله: '+links.bale);
 lines.push('','۲) لینک اختصاصی '+t.name+' برای مشتری‌ها (همیشگی):',refUrl(ctx.origin,ctx.salon,t));
 await ctx.say(lines.join('\n'));
}
const cancelKey={inline_keyboard:[[{text:'✖️ انصراف',callback_data:'tm:n'}]]};
async function teamAnswer(ctx,state,t){
 if(t==='/stop'||t==='/cancel'){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);await ctx.say('لغو شد.');return}
 if(t.startsWith('/')){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);await ctx.say('افزودن نیرو لغو شد. دستور را دوباره بفرستید.');return}
 const bad=s=>s.length<2||/\d{4,}/.test(digits(s));
 if(state.team==='name'){
  const n=text(t,60);if(bad(n)){await ctx.say('این اسم درست نیست. فقط اسم و فامیل نیرو را با حروف بنویسید، مثلاً «مریم محمدی».',{reply_markup:cancelKey});return}
  await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,team:'spec',name:n,ts:Date.now()}),ctx.salon.id);
  await ctx.say('تخصص «'+n+'» چیست؟ یکی از دکمه‌ها را بزنید یا با چند کلمه بنویسید (مثلاً «رنگ و لایت»).',{reply_markup:{inline_keyboard:[...SPECIALTIES.map((x,i)=>[{text:x,callback_data:'tm:s:'+i}]),[{text:'✖️ انصراف',callback_data:'tm:n'}]]}});
  return;
 }
 if(state.team==='spec'){const sp=text(t,40);if(bad(sp)){await ctx.say('تخصص را با چند کلمه بنویسید یا یکی از دکمه‌ها را بزنید.',{reply_markup:cancelKey});return}await finishStaff(ctx,state.name,sp);return}
}
async function finishStaff(ctx,name,specialty){
 await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);
 const t=await createStaff(ctx.db,ctx.salon,name,specialty);
 await showStaffLinks(ctx,t,true);
 await notifyOwner(ctx.env,{salon:ctx.salon,kind:'team',level:'info',text:'مزون‌دار «'+t.name+'» ('+(t.specialty||'بدون تخصص')+') را اضافه کرد.'});
}
// The manager's own member row (they fit dresses too): created on first /link, tied to this chat.
async function managerLink(ctx){
 const {db,p,salon}=ctx,P=PLATFORMS[p];
 let t=await one(db,'SELECT * FROM team WHERE salon_id=? AND is_manager=1 AND active=1',salon.id);
 if(!t){const prof=parse(salon.profile);t=await createStaff(db,salon,prof.manager||('مدیر '+salon.name),'مدیر مزون');await run(db,'UPDATE team SET is_manager=1 WHERE id=?',t.id);await notifyOwner(ctx.env,{salon,kind:'team',level:'info',text:'مدیر مزون لینک اختصاصی خودش را ساخت.'})}
 await run(db,'UPDATE team SET '+P.col+'=? WHERE id=?',ctx.chat,t.id);
 t=await one(db,'SELECT * FROM team WHERE id=?',t.id);
 await ctx.say('<b>🔗 لینک اختصاصی خودتان</b>\n'+refUrl(ctx.origin,salon,t)+'\n\nهر کس با این لینک بیاید، و هر کس که او برایش بفرستد، مشتری خودتان («'+esc(t.name)+'») حساب می‌شود و درخواستش همین‌جا می‌آید. برای مشتری‌های عمومی مزون، لینک بدون کد را بدهید:\n'+ctx.origin+'/s/'+salon.slug,{parse_mode:'HTML'});
}
async function teamCallback(ctx,data,q){
 const {db}=ctx,salon=ctx.salon;
 if(data==='tm:n'){await run(db,"UPDATE salons SET bot_state='' WHERE id=? AND bot_state LIKE '%\"team\"%'",salon.id);return 'لغو شد'}
 if(data==='tm:me'){await managerLink(ctx);return 'لینک ساخته شد'}
 if(data==='tm:add'){await run(db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,team:'name',ts:Date.now()}),salon.id);await ctx.say('اسم و فامیل نیروی تازه را بنویسید، مثلاً «مریم محمدی».\n(اگر ۲۰ دقیقه چیزی ننویسید، خودش لغو می‌شود.)',{reply_markup:cancelKey});return 'اسم را بنویسید'}
 if(data.startsWith('tm:s:')){const st=parse((await one(db,'SELECT bot_state FROM salons WHERE id=?',salon.id))?.bot_state);if(st.team!=='spec')return 'از /team شروع کنید';await finishStaff(ctx,st.name,SPECIALTIES[Number(data.slice(5))]||'');return 'اضافه شد'}
 const [,op,id,to]=data.split(':');
 const t=await one(db,'SELECT * FROM team WHERE id=? AND salon_id=? AND active=1',id,salon.id);if(!t)return 'این نیرو دیگر در تیم نیست';
 if(op==='l'){await showStaffLinks(ctx,t,false);return 'لینک تازه ساخته شد'}
 if(op==='r'){
  const others=(await teamOf(db,salon.id)).filter(x=>x.id!==t.id);
  await ctx.say('مشتری‌ها و لینک‌های «'+t.name+'» بعد از حذف به چه کسی برسند؟ (نمونه‌کارهای او از صفحه برداشته می‌شود.)',{reply_markup:{inline_keyboard:[...others.map(x=>[{text:'به '+x.name,callback_data:'tm:x:'+t.id+':'+x.id}]),[{text:'به خود مزون (مدیر)',callback_data:'tm:x:'+t.id+':0'}],[{text:'انصراف',callback_data:'tm:n'}]]}});
  return 'انتخاب کنید';
 }
 if(op==='x'){
  const heirId=to&&to!=='0'?to:null;
  const ids=await transfer(db,salon.id,t.id,heirId);
  for(const lid of ids){const l=await one(db,'SELECT * FROM leads WHERE id=?',lid);if(l)await deliverLead(ctx.env,l)}
  const heir=heirId?(await one(db,'SELECT name FROM team WHERE id=?',heirId))?.name:'خود مزون';
  await notifyOwner(ctx.env,{salon,kind:'team',level:'info',text:'مزون‌دار «'+t.name+'» را حذف کرد؛ مشتری‌هایش به «'+heir+'» رسید.'});
  try{await call(ctx.env,ctx.p,'editMessageText',{chat_id:ctx.chat,message_id:q.message.message_id,text:'«'+t.name+'» از تیم حذف شد. مشتری‌ها و لینک‌هایش از این به بعد مال «'+heir+'» است.'})}catch{}
  return 'حذف شد';
 }
 return 'انجام نشد';
}

// Manager hands a salon customer's request to a member ("la:<memberId>:<leadId>"), or settles a
// conflict ("cf:<memberId|0>:<leadId>": the customer belongs to one member but came via another).
async function handOver(ctx,lead,staffId,q,note){
 const {db,env}=ctx,salon=ctx.salon;
 const t=await one(db,'SELECT * FROM team WHERE id=? AND salon_id=? AND active=1',staffId,salon.id);if(!t)return 'این نیرو دیگر در تیم نیست';
 const prev=lead.staff_id?await one(db,'SELECT * FROM team WHERE id=?',lead.staff_id):null;
 await assign(db,env,salon,{visitor:lead.visitor,number:lead.phone},t.id);
 // Tell the previous owner it moved and take the buttons off their copy.
 if(prev){const msgs=parse(lead.messages);for(const P of Object.values(PLATFORMS)){const chat=prev[P.col];if(!chat||!msgs[P.name]||!P.token(env))continue;try{await call(env,P.name,'editMessageReplyMarkup',{chat_id:chat,message_id:msgs[P.name],reply_markup:{inline_keyboard:[]}})}catch{}try{await call(env,P.name,'sendMessage',{chat_id:chat,text:'↪️ مدیر مزون این درخواست ('+lead.name+') را به '+t.name+' داد.',reply_parameters:{message_id:msgs[P.name],allow_sending_without_reply:true}})}catch{}}}
 await run(db,"UPDATE leads SET staff_id=?,waiting=0,messages='{}',status='retry',attempts=0,reminders=0 WHERE id=?",t.id,lead.id);
 await deliverLead(env,await one(db,'SELECT * FROM leads WHERE id=?',lead.id));
 try{await call(env,ctx.p,'editMessageReplyMarkup',{chat_id:ctx.chat,message_id:q.message.message_id,reply_markup:{inline_keyboard:[[{text:'✔︎ به '+t.name+' داده شد',callback_data:'noop'}]]}})}catch{}
 return note||('به '+t.name+' داده شد');
}
async function assignCallback(ctx,data,q){
 const [kind,staffId,leadId]=data.split(':');
 if(!/^[a-f0-9-]{36}$/.test(leadId||''))return 'انجام نشد';
 const lead=await one(ctx.db,'SELECT * FROM leads WHERE id=? AND salon_id=?',leadId,ctx.salon.id);if(!lead)return 'این درخواست دیگر در سیستم نیست';
 if(kind==='cf'&&staffId==='0'){try{await call(ctx.env,ctx.p,'editMessageReplyMarkup',{chat_id:ctx.chat,message_id:q.message.message_id,reply_markup:{inline_keyboard:[[{text:'✔︎ ماند',callback_data:'noop'}]]}})}catch{}return 'همان‌جا ماند'}
 if(kind==='la'&&lead.staff_id)return 'این درخواست قبلاً به یک نیرو داده شده';
 return handOver(ctx,lead,staffId,q);
}
export async function notifyConflict(env,lead,otherId){
 const db=env.DB,salon=await one(db,'SELECT * FROM salons WHERE id=?',lead.salon_id);
 const other=await one(db,'SELECT * FROM team WHERE id=?',otherId),own=lead.staff_id?await one(db,'SELECT name FROM team WHERE id=?',lead.staff_id):null;
 if(!other)return;
 const first=String(lead.name||'').split(/\s+/)[0]||'یک مشتری';
 const msg='ℹ️ «'+first+'» مشتری '+(own?own.name:'خود مزون')+' است، ولی این بار با لینک '+other.name+' آمد. درخواستش برای '+(own?own.name:'شما')+' رفت.\nاگر می‌خواهید از این به بعد مشتری '+other.name+' باشد، دکمه را بزنید.';
 for(const p of inboxes(env,salon))await call(env,p,'sendMessage',{chat_id:salon[PLATFORMS[p].col],text:msg,reply_markup:{inline_keyboard:[[{text:'بده به '+other.name.slice(0,20),callback_data:'cf:'+other.id+':'+lead.id},{text:'بماند',callback_data:'cf:0:'+lead.id}]]}}).catch(e=>console.error('conflict',e?.message));
}

// Drops an unfinished wizard or team question. For the wizard the owner hears how far it got.
async function expireState(env,salon,state,ctx){
 await run(env.DB,"UPDATE salons SET bot_state='' WHERE id=?",salon.id);
 if(state.dressUpload){if(state.dressUpload.id){await run(env.DB,'DELETE FROM portfolio_imgs WHERE portfolio_id=?',state.dressUpload.id);await run(env.DB,'DELETE FROM portfolio WHERE id=? AND salon_id=? AND published=0',state.dressUpload.id,salon.id)}return}
  if(!Number.isInteger(state.step))return;
 const fresh=await one(env.DB,'SELECT * FROM salons WHERE id=?',salon.id),st=setupStatus(fresh);
 await notifyOwner(env,{salon:fresh,kind:'setup',level:'warn',text:'تنظیم صفحه را نیمه‌کاره رها کرد (قدم '+fa(state.step+1)+' از '+fa(WIZ.length)+'؛ پر شده '+fa(st.filled.length)+' از '+fa(st.total)+(st.missing.length?'، مانده: '+st.missing.join('، '):'')+').'});
 const msg='تنظیم صفحهٔ مزون را بستم چون مدتی جوابی نیامد. هر وقت خواستید با /setup ادامه بدهید.';
 if(ctx)await ctx.say(msg).catch(()=>{});
 else{const chat=fresh[PLATFORMS[state.p]?.col];if(chat&&platformReady(env,state.p))await call(env,state.p,'sendMessage',{chat_id:chat,text:msg}).catch(()=>{})}
}
export async function expireStates(env,now=Date.now()){
 let n=0;
 for(const s of await all(env.DB,"SELECT * FROM salons WHERE bot_state<>'' LIMIT 100")){const st=parse(s.bot_state);if(st.p&&(!st.ts||now-st.ts>STALE)){await expireState(env,s,st,null);n++}}
 return n;
}


/* ---------- a bride talking to the bot: she sends a photo, gets a personal link, gets the picture back ---------- */
async function customerStart(ctx,slug){
 // Never allow a linked salon manager or staff chat to become a bride chat.
 if(await actorByChat(ctx.db,ctx.p,ctx.chat)){await ctx.say('این حساب به مدیریت مزون متصل است. برای تجربه مشتری، از حساب تلگرام جداگانه استفاده کنید.');return}
 const salon=await one(ctx.db,'SELECT id,slug,name FROM salons WHERE slug=?',slug);
 if(!salon){await ctx.say('این مزون پیدا نشد؛ لینک را دوباره از مزون بگیرید.');return}
 await run(ctx.db,'INSERT INTO bot_customers(platform,chat_id,salon_id,name,created_at) VALUES(?,?,?,?,?) ON CONFLICT(platform,chat_id) DO UPDATE SET salon_id=excluded.salon_id,name=excluded.name,created_at=excluded.created_at',ctx.p,ctx.chat,salon.id,ctx.name,Date.now());
 await ctx.say('سلام'+(ctx.name?' '+ctx.name:'')+' 🌸\nبه «'+salon.name+'» خوش آمدی.\nیک عکس تمام‌قد از خودت بفرست (ایستاده، از سر تا پا، با نور خوب) تا لباس عروس را روی خودت ببینی.');
 await ctx.say('اگر می‌خواهی تصویرهایت را از روی سایت مزون برای خودت همین‌جا بفرستیم، شمارهٔ موبایلت را با دکمهٔ پایین به اشتراک بگذار 👇',{reply_markup:{keyboard:[[{text:'📱 اشتراک شمارهٔ من',request_contact:true}]],resize_keyboard:true,one_time_keyboard:true}});
}
async function customerMessage(ctx,bc,m){
 const {env,db,p}=ctx,photo=photoOf(m);
 if(m.contact?.phone_number&&(!m.contact.user_id||String(m.contact.user_id)===String(m.from?.id))){
  const d=String(m.contact.phone_number).replace(/\D/g,'').slice(-10);
  if(/^9\d{9}$/.test(d)){await run(db,'UPDATE bot_customers SET phone=? WHERE platform=? AND chat_id=?','0'+d,p,ctx.chat);await ctx.say('ممنون ✅ شمارهٔ '+'0'+d+' ثبت شد.\nحالا روی سایت مزون «ارسال برای خودم» را بزن تا تصویرت همین‌جا برسد.',{reply_markup:{remove_keyboard:true}});return}
 }
 if(!photo){await ctx.say('عکس تمام‌قد خودت را بفرست (📎 ← عکس) تا لباس عروس را روی خودت ببینی. 🌸');return}
 await limited(db,'botphoto:'+p+':'+ctx.chat,12,'امروز چند عکس فرستاده‌ای؛ فردا دوباره امتحان کن');
 must((photo.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است؛ آن را به‌صورت «عکس» بفرست نه «فایل»');
 const salon=await one(db,'SELECT * FROM salons WHERE id=?',bc.salon_id);
 if(!salon){await ctx.say('این مزون پیدا نشد؛ لینک را دوباره از مزون بگیرید.');return}
 const bytes=await fileBytes(env,p,photo.file_id);
 const {s,raw}=await newSession(db,salon,{platform:p,chat:ctx.chat,name:bc.name||ctx.name});
 await putImage(env,salon,s,bytes,'original');
 await ctx.say('عکست رسید ✅\nحالا مدل لباس را انتخاب کن. ساختن تصویر ۲ تا ۳ دقیقه طول می‌کشد؛ بعدش خودم همین‌جا برایت می‌فرستمش و می‌توانی برای دوستانت بفرستی.',{reply_markup:{inline_keyboard:[[{text:'👰 انتخاب مدل لباس',url:ctx.origin+'/s/'+salon.slug+'?c='+raw}]]}});
}
// Her yes/no to "may we post your picture on the boutique's social media?".
async function consentCallback(ctx,q,data){
 const {env,db,p}=ctx,chat=String(q.message?.chat?.id||''),m=/^sc:([01]):([a-f0-9-]{36})$/.exec(data);let note='انجام نشد';
 try{
  const g=m&&await one(db,"SELECT g.* FROM generations g JOIN sessions s ON s.id=g.session_id WHERE g.id=? AND s.bot_chat=? AND s.bot_platform=? AND g.state='success'",m[2],chat,p);
  if(g){const salon=await one(db,'SELECT * FROM salons WHERE id=?',g.salon_id);await setConsent(env,ctx.origin,salon,g,m[1]==='1');note=m[1]==='1'?'ممنون! ثبت شد 💛':'باشه، ثبت شد';
   try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:{inline_keyboard:[]}})}catch{}
   await call(env,p,'sendMessage',{chat_id:chat,text:m[1]==='1'?'💛 ممنون که اجازه دادی. «'+salon.name+'» تصویرت را با افتخار منتشر می‌کند.':'باشه، تصویرت فقط پیش خودت و کسانی می‌ماند که لینکش را برایشان بفرستی.'}).catch(()=>{});}
 }catch(e){console.error('consent cb',e?.message)}
 await call(env,p,'answerCallbackQuery',{callback_query_id:q.id,text:note}).catch(()=>{});
}

/* ---------- customer follow: she taps "خبرم کن" on the page and starts the bot ---------- */
const STATUS={new:'هنوز منتظر تماس مزون',called:'مزون با شما تماس گرفته',booked:'نوبت هماهنگ شد',cancelled:'درخواست بسته شد',declined:'فعلاً امکان‌پذیر نیست؛ مزون با تو در تماس است'};
async function follow(ctx,token){
 const lead=await one(ctx.db,'SELECT l.*,s.name AS salon_name FROM leads l JOIN salons s ON s.id=l.salon_id WHERE l.follow_hash=?',await hash(token));
 if(!lead){await ctx.say('این لینک پیگیری منقضی شده یا درست نیست.');return}
 await run(ctx.db,'UPDATE leads SET follow_chat=?,follow_platform=? WHERE id=?',ctx.chat,ctx.p,lead.id);
 await ctx.say('✅ هر وقت «'+lead.salon_name+'» درخواستت را بررسی کرد، همین‌جا خبرت می‌کنم.\n\nوضعیت الان: '+STATUS[lead.salon_status||'new']+'.');
}
async function notifyCustomer(env,lead,salon,textOut){
 if(!lead.follow_chat||!lead.follow_platform||!platformReady(env,lead.follow_platform))return;
 try{await call(env,lead.follow_platform,'sendMessage',{chat_id:lead.follow_chat,text:textOut})}catch(e){console.error('notify customer',e?.message)}
}
const customerText=(status,salon,origin)=>{const prof=parse(salon.profile),tel=prof.phone?'\n📞 شمارهٔ مزون: '+local(prof.phone):'';
 if(status==='called')return '📞 «'+salon.name+'» اعلام کرد که با شما تماس گرفته است. اگر تماسی نداشتید، خودتان زنگ بزنید.'+tel;
 if(status==='booked')return '✅ «'+salon.name+'» نوبت شما را هماهنگ کرد. منتظر دیدنتان هستند!';
 if(status==='cancelled')return '«'+salon.name+'» درخواستت را بست. اگر هنوز لباسی می‌خواهی، مدل دیگری را امتحان کن یا با مزون تماس بگیر'+(origin?':\n'+origin+'/s/'+salon.slug:'.')+tel;
 if(status==='declined')return '«'+salon.name+'»: درخواستت فعلاً امکان‌پذیر نیست؛ مزون با تو در تماس است. اگر خواستی می‌توانی مدل دیگری را هم امتحان کنی'+(origin?':\n'+origin+'/s/'+salon.slug:'.')+tel;
 return '⏳ «'+salon.name+'» هنوز درخواستت را جواب نداده. اگر عجله داری، مستقیم تماس بگیر.'+tel;
};

// The admin panel changes a status the same way the bot buttons do (and tells a following customer).
export async function applyLeadStatus(env,salon,lead,status,origin=''){
 const {changed}=await setLeadStatus(env.DB,lead,status);
 if(changed&&status!=='new')await notifyCustomer(env,{...lead,salon_status:status},salon,customerText(status,salon,origin));
 return changed;
}

/* ---------- salon buttons under each submission ---------- */
const LABEL={new:'🆕 جدید',called:'📞 تماس گرفته شد',booked:'✅ رزرو شد',cancelled:'🚫 لغو',declined:'🚫 بسته شد'};
export function leadKeyboard(lead,p,members=[]){
 const mark=k=>(lead.salon_status===k?'✔︎ ':'')+LABEL[k];
 const rows=[[{text:mark('called'),callback_data:'ls:called:'+lead.id},{text:mark('booked'),callback_data:'ls:booked:'+lead.id}],[{text:mark('cancelled'),callback_data:'ls:cancelled:'+lead.id},{text:mark('new'),callback_data:'ls:new:'+lead.id}]];
 // A salon customer (no member yet): the manager can hand the request to a member.
 if(!lead.staff_id&&members.length)for(let i=0;i<members.length;i+=2)rows.push(members.slice(i,i+2).map(t=>({text:'👤 بده به '+t.name.slice(0,16),callback_data:'la:'+t.id+':'+lead.id})));
 if(lead.telegram&&p==='telegram')rows.push([{text:'💬 پیام به '+lead.name.slice(0,24)+' در تلگرام',url:'https://t.me/'+lead.telegram}]);
 return {inline_keyboard:rows};
}
async function onCallback(ctx,q){
 if(String(q.data||'').startsWith('ob:')){if(botOnly(ctx.env)){const chat=String(q.message?.chat?.id||'');await call(ctx.env,ctx.p,'answerCallbackQuery',{callback_query_id:q.id,text:'فقط مدیر معرفی‌شده توسط ادمین وصل می‌شود.'}).catch(()=>{});if(chat)await call(ctx.env,ctx.p,'sendMessage',{chat_id:chat,text:'برای مدیریت مزون، لینک اختصاصی ربات را از ادمین آینه بگیرید. پنل وب مدیر مزون غیرفعال است.'}).catch(()=>{});return}await onbCallback(ctx,q);return}
 if(String(q.data||'').startsWith('sc:')){await consentCallback(ctx,q,String(q.data));return}
 const {env,db,p}=ctx,chat=String(q.message?.chat?.id||''),actor=await actorByChat(db,p,chat),salon=actor?.salon||null;ctx.chat=chat;ctx.salon=salon;ctx.staff=actor?.staff||null;
 const manager=actor?.role==='manager';ctx.role=actor?.role;
 ctx.say=(t,extra={})=>call(env,p,'sendMessage',{chat_id:chat,text:t,...extra});
 const data=String(q.data||'');let note='انجام نشد';
 try{
  if(!salon)note='این گفتگو به مزونی وصل نیست';
  else if(data==='noop')note='ثبت شده';
   else if(data==='du:new'){await beginDress(ctx);note='ثبت لباس'}
  else if(data.startsWith('cu:p:')){await sendCustomers(ctx,data.slice(5));note='فهرست مشتری‌ها'}
  else if(data.startsWith('cu:d:')){await showCustomer(ctx,data.slice(5));note='پرونده مشتری'}
  else if(data.startsWith('cr:p:')){await sendRequests(ctx,data.slice(5));note='فهرست درخواست‌ها'}
  else if(data.startsWith('cr:d:')){await showRequest(ctx,data.slice(5));note='جزئیات درخواست'}
  else if(data.startsWith('rc:')){if(!manager)note='فقط مدیر مزون';else{const amount=Number(data.slice(3));if(!PACKS.includes(amount))note='بسته نامعتبر است';else{await requestRecharge(db,env,salon,{amount});note='درخواست شارژ ثبت شد';await ctx.say('✅ درخواست شارژ '+fa(amount)+' اعتبار ثبت شد. تیم آینه آن را بررسی می‌کند.')}}}
  else if(data.startsWith('sz:')||data.startsWith('szdone:')){
   const done=data.startsWith('szdone:'),parts=data.split(':'),id=parts[1],size=parts[2];
   const okId=/^[a-f0-9-]{36}$/.test(id)||/^tg[a-zA-Z0-9]+$/.test(id);
   const dress=okId?await one(db,'SELECT id,title,sizes FROM portfolio WHERE id=? AND salon_id=?'+(manager?'':' AND staff_id=?'),id,salon.id,...(manager?[]:[ctx.staff?.id||''])):null;
   if(!dress)note='لباس پیدا نشد یا اجازه ویرایش ندارید';
   else if(!done&&!DRESS_SIZES.includes(size))note='سایز معتبر نیست';
   else{
    const chosen=parseDressSizes(dress.sizes);
    if(done&&botOnly(env)&&!chosen.length){note='حداقل یک سایز انتخاب کنید';await ctx.say('برای ثبت نهایی حداقل یک سایز را انتخاب کنید.');}
     else if(!done){
      let next=null;
      // Optimistic compare-and-swap: simultaneous button clicks must not lose size selections.
      for(let attempt=0;attempt<4;attempt++){
       const row=attempt?await one(db,'SELECT sizes FROM portfolio WHERE id=? AND salon_id=?',dress.id,salon.id):dress;
       must(row,'لباس پیدا نشد',404);
       const current=parseDressSizes(row.sizes);
       const candidate=current.includes(size)?current.filter(v=>v!==size):DRESS_SIZES.filter(v=>current.includes(v)||v===size);
       const updated=await run(db,"UPDATE portfolio SET sizes=? WHERE id=? AND salon_id=? AND COALESCE(sizes,'[]')=?",JSON.stringify(candidate),dress.id,salon.id,row.sizes||'[]');
       if(updated.meta.changes){next=candidate;break}
      }
      must(next,'ثبت هم‌زمان سایزها کامل نشد؛ دوباره روی سایز بزنید',409);
      try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:sizeKeyboard(dress.id,next)})}catch(e){await ctx.say('سایزهای فعلی «'+dress.title+'»:',{reply_markup:sizeKeyboard(dress.id,next)})}
      note='سایز '+SIZE_LABEL(size)+(next.includes(size)?' انتخاب شد':' حذف شد');
    }else{note=chosen.length?'سایزهای «'+dress.title+'»: '+chosen.map(SIZE_LABEL).join('، '):'سایزی مشخص نشده';
       const st=parse(salon.bot_state);if(st.dressUpload?.id===dress.id&&st.p===p&&st.chat===chat){await run(db,'UPDATE portfolio SET published=1 WHERE id=? AND salon_id=?',dress.id,salon.id);await run(db,"UPDATE salons SET bot_state='' WHERE id=?",salon.id)}
      await ctx.say('✅ '+note);
      try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:{inline_keyboard:[]}})}catch(e){}
    }
   }
  }
  else if(data.startsWith('rn:')){const id=data.slice(3),dress=manager&&/^[a-f0-9-]{36}$/.test(id)&&await one(db,'SELECT id,title FROM portfolio WHERE id=? AND salon_id=? AND published=1',id,salon.id);if(dress){await run(db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,dress:id,ts:Date.now()}),salon.id);await ctx.say('✏️ نام جدید «'+dress.title+'» را به‌صورت یک پیام متنی بفرست.');note='منتظر نام جدید'}else note='اجازه تغییر این لباس را ندارید'}
  else if(data.startsWith('del:')&&botOnly(env)){
   const id=data.slice(4),dress=/^[a-f0-9-]{36}$/.test(id)&&await one(db,'SELECT title FROM portfolio WHERE id=? AND salon_id=?'+(manager?'':' AND staff_id=?'),id,salon.id,...(manager?[]:[ctx.staff.id]));
   if(!dress)note='لباس پیدا نشد یا اجازه حذف ندارید';
   else{await ctx.say('حذف «'+dress.title+'» از کاتالوگ مزون؟ این کار باعث می‌شود لباس از صفحه مشتری حذف شود.',{reply_markup:{inline_keyboard:[[{text:'بله، حذف شود',callback_data:'dx:'+id},{text:'انصراف',callback_data:'noop'}]]}});note='نیازمند تأیید'}
  }
  else if(data.startsWith('dx:')){
   const id=data.slice(3);
   if(/^[a-f0-9-]{36}$/.test(id)){
    const del=manager?await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',id,salon.id):await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=? AND staff_id=?',id,salon.id,ctx.staff.id);
    note=del.meta.changes?'لباس حذف شد':'لباس پیدا نشد';try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:{inline_keyboard:[]}})}catch{}
   }
  }
  else if(data.startsWith('del:')){const id=data.slice(4);if(/^[a-f0-9-]{36}$/.test(id)){const r=manager?await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',id,salon.id):await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=? AND staff_id=?',id,salon.id,ctx.staff.id);note=r.meta.changes?'از صفحهٔ مزون حذف شد':'قبلاً حذف شده بود'}}
  else if(data.startsWith('pl:')){ctx.role=actor.role;await sendList(ctx,Math.max(0,Number(data.slice(3))||0));note='صفحهٔ بعد'}
  else if(data.startsWith('tm:')){note=manager?await teamCallback(ctx,data,q):'فقط مدیر مزون'}
  else if(data.startsWith('la:')||data.startsWith('cf:')){note=manager?await assignCallback(ctx,data,q):'فقط مدیر مزون'}
  else if(data.startsWith('ls:')){
   const [,status,id]=data.split(':');
   if(LABEL[status]&&/^[a-f0-9-]{36}$/.test(id)){
    const lead=await one(db,'SELECT * FROM leads WHERE id=? AND salon_id=?',id,salon.id);
    // Only the request's owner may act on it: its member, or the manager for salon customers.
    const mayAct=lead&&(manager&&botOnly(env)?true:(lead.staff_id?(ctx.staff&&ctx.staff.id===lead.staff_id):manager));
    if(!lead)note='این درخواست دیگر در سیستم نیست';
    else if(!mayAct)note='این درخواست مال نیروی دیگری است';
    else{
     const {changed}=await setLeadStatus(db,lead,status);
     const fresh={...lead,salon_status:status};
     try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:leadKeyboard(fresh,p,fresh.staff_id?[]:await teamOf(db,salon.id))})}catch{}
     if(changed&&status!=='new')await notifyCustomer(env,fresh,salon,customerText(status,salon,ctx.origin));
     note=lead.follow_chat?'ثبت شد و به مشتری خبر دادیم':'ثبت شد';
    }
   }
  }
  else if(data.startsWith('wz:')&&botOnly(env))note='تنظیمات فقط در ادمین آینه';
   else if(data.startsWith('wz:')&&!manager)note='فقط مدیر مزون';
  else if(data==='wz:start')await wizardStart(ctx,0,true);
  else if(data==='wz:done'){const st=parse(salon.bot_state);if(!Number.isInteger(st.step))note='تنظیمات در جریان نیست';else{await wizardFinish(ctx,true);note='تمام شد'}}
  else if(data.startsWith('wz:')){
   const state=parse(salon.bot_state);
   if(state.p!==p||!Number.isInteger(state.step))note='تنظیمات در جریان نیست؛ /setup را بزنید';
   else if(data==='wz:stop'){await run(db,"UPDATE salons SET bot_state='' WHERE id=?",salon.id);await ctx.say('باشه. هر وقت خواستید با /setup ادامه بدهید.');note='متوقف شد'}
   else{note=data==='wz:keep'?'همین ماند':'رد شد';await wizardNext(ctx,state.step)}
  }
 }catch(e){console.error('callback',e?.message);note=e instanceof Problem?e.message:'انجام نشد؛ دوباره امتحان کنید';await notifyOwner(env,{salon,kind:'error',level:'error',text:'خطای دکمهٔ ربات: '+String(e?.message||e).slice(0,200)})}
 await call(env,p,'answerCallbackQuery',{callback_query_id:q.id,text:note}).catch(()=>{});
}

// A message made only of Iranian mobile numbers (max 5, split by spaces, commas or new lines)
// means "text this customer my page link". Anything else is not a number message.
export function mobilesIn(textIn){
 const parts=String(textIn||'').split(/[\s,،;؛]+/).filter(Boolean);
 if(!parts.length||parts.length>5)return [];
 const out=[];
 for(const p of parts){let n;try{n=phone(p)}catch{return []}if(!out.includes(n))out.push(n)}
 return out;
}

// Without an SMS text that may carry a link, the stylist sends the link herself: one message per
// number with buttons for WhatsApp (straight to that number), Telegram, and the /i/ page (SMS from
// her own phone, Bale, Instagram Direct, copy). No numbers: one message with the same buttons.
async function shareInvites(ctx,numbers,member=null){
 const targets=numbers.length?numbers:[null];
 for(const n of targets){
  const L=shareLinks(ctx.origin,ctx.salon,member,n);
  const head=n?'📲 لینک برای <b>'+esc(local(n))+'</b>':'📲 لینک '+(member&&!member.is_manager?'اختصاصی تو':'«'+esc(ctx.salon.name)+'»')+' برای مشتری';
  await ctx.say(head+'\nیکی از دکمه‌ها را بزن؛ پیام آماده از '+(member&&!member.is_manager?'گوشی خودت':'گوشی خودتان')+' فرستاده می‌شود.\n\n'+esc(L.both),{parse_mode:'HTML',reply_markup:shareKeyboard(L,n),disable_web_page_preview:true});
 }
}

// Texts the salon's page link to each number. Limits keep a mistyped or abusive chat from burning
// SMS credit: 30 texts a day per salon, 3 a day per number across all salons, and the same salon
// cannot text the same number again within an hour.
async function sendInvites(env,db,salon,chat,numbers,say,member=null){
 // A member's text carries their own code, so whoever opens it becomes their customer.
 const slugArg=member?salon.slug+'?r='+member.ref_code:salon.slug;
 if(!inviteReady(env)){await say('ارسال پیامک برای مشتری هنوز فعال نشده است. از تیم مزون آینه بخواهید فعالش کند.');return}
 const lines=[];
 for(const n of numbers){
  const local=n.replace(/^\+98/,'0');
  try{
   if(await one(db,"SELECT 1 FROM invites WHERE salon_id=? AND phone=? AND status='sent' AND created_at>?",salon.id,n,Date.now()-3600000)){lines.push('↩️ '+local+' — همین الان برایش پیامک رفته بود');continue}
   await limited(db,'invite:'+salon.id,30,'سقف ۳۰ پیامک در روز برای این مزون پر شده است');
   await limited(db,'invite-phone:'+n,3,'برای این شماره امروز چند پیامک رفته است');
   const r=await sendInvite(env,n,[salon.name,slugArg]);
   await run(db,'INSERT INTO invites(id,salon_id,phone,rec_id,status,created_at) VALUES(?,?,?,?,?,?)',uid(),salon.id,n,r.recId,'sent',Date.now());
   lines.push('✅ '+local);
  }catch(e){
   const why=e instanceof Problem?e.message:'ارسال نشد';
   await run(db,'INSERT INTO invites(id,salon_id,phone,status,error,created_at) VALUES(?,?,?,?,?,?)',uid(),salon.id,n,'failed',String(why).slice(0,200),Date.now()).catch(()=>{});
   lines.push('❌ '+local+' — '+why);
  }
 }
 await say((lines.some(l=>l.startsWith('✅'))?'📲 '+(member?'لینک اختصاصی تو':'لینک «'+salon.name+'»')+' برای مشتری پیامک شد:\n':'پیامک فرستاده نشد:\n')+lines.join('\n'));
}


function sizeKeyboard(id,selected){
 const on=new Set(selected);
 const rows=[];for(let i=0;i<DRESS_SIZES.length;i+=3)rows.push(DRESS_SIZES.slice(i,i+3).map(size=>({text:(on.has(size)?'✅ ':'▫️ ')+SIZE_LABEL(size),callback_data:'sz:'+id+':'+size})));
 rows.push([{text:'✅ ثبت سایزهای انتخاب‌شده',callback_data:'szdone:'+id}]);
 return {inline_keyboard:rows};
}
async function askDressSizes(ctx,id,title){
 await ctx.say('📏 سایزهای موجود برای «'+title+'» را انتخاب کنید. می‌توانید چند گزینه را فعال کنید؛ هر انتخاب همان لحظه ذخیره می‌شود. در پایان «ثبت سایزها» را بزنید.',{reply_markup:sizeKeyboard(id,[])});
}


const DRESS_ANGLES=['جلو','بغل راست','بغل چپ','پشت'];
async function beginDress(ctx){
 const state=parse((await one(ctx.db,'SELECT bot_state FROM salons WHERE id=?',ctx.salon.id))?.bot_state);
 if(state.dressUpload&&state.chat!==ctx.chat){await ctx.say('ثبت دیگری در مزون در جریان است.');return}
 if(state.dressUpload){if(!state.ts||Date.now()-state.ts>STALE){await expireState(ctx.env,ctx.salon,state,ctx);return beginDress(ctx)}let x=state.dressUpload;await ctx.say(x.stage==='name'?'نام مدل را بفرستید.':x.stage==='sizes'?'سایزها را انتخاب کنید.':'عکس '+DRESS_ANGLES[x.images.length]+' را ارسال کنید.');if(x.stage==='sizes')await askDressSizes(ctx,x.id,x.name);return}
 if(state.team||Number.isInteger(state.step)){await ctx.say('ابتدا فرآیند قبلی را پایان دهید.');return}
 const draft={p:ctx.p,chat:ctx.chat,ts:Date.now(),dressUpload:{stage:'photos',images:[],staffId:ctx.role==='staff'?ctx.staff.id:null}};
 await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify(draft),ctx.salon.id);
 await ctx.say('📸 مرحله ۱/۴: عکس «جلو» را جداگانه بفرستید. در صورت فعال بودن پردازش تصویر، پس‌زمینه روی بک ثابت آینه قرار می‌گیرد؛ اگر این سرویس در دسترس نباشد، عکس اصلی بدون حذف شدن ثبت می‌شود. بعد بغل راست، بغل چپ و پشت را بفرستید؛ سپس نام مدل و سایزها. /cancel انصراف');
}
async function cancelDress(ctx){
 const s=parse((await one(ctx.db,'SELECT bot_state FROM salons WHERE id=?',ctx.salon.id))?.bot_state);
 if(!s.dressUpload||s.chat!==ctx.chat||s.p!==ctx.p){await ctx.say('ثبت فعالی ندارید.');return}
 if(s.dressUpload.id){await run(ctx.db,'DELETE FROM portfolio_imgs WHERE portfolio_id=?',s.dressUpload.id);await run(ctx.db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',s.dressUpload.id,ctx.salon.id)}
 await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);
 await ctx.say('ثبت لغو شد.');
}
async function dressReply(ctx,state,m,msg){
 const x=state.dressUpload;
 if(x.staffId!==(ctx.role==='staff'?ctx.staff.id:null)){await ctx.say('دسترسی این ثبت برای شما نیست.');return}
 if(x.stage==='photos'){
  const ph=photoOf(m);
  if(!ph){await ctx.say('لطفاً عکس «'+DRESS_ANGLES[x.images.length]+'» را ارسال کنید.');return}
  if(m.media_group_id){await ctx.say('عکس‌ها را جداگانه ارسال کنید؛ نه آلبوم.');return}
  must((ph.file_size||0)<=5*1024*1024,'حجم عکس بیشتر از ۵ مگابایت است');
  const raw=await fileBytes(ctx.env,ctx.p,ph.file_id);
  const normalized=await normalizeDressPhoto(ctx.env,raw);
  const media=await putImage(ctx.env,ctx.salon,null,normalized,'portfolio');
  const backgroundReady=normalized!==raw;
  if(!backgroundReady)console.warn('dress saved without background removal',ctx.salon.id,x.images.length);
  const images=[...x.images,media],stage=images.length===4?'name':'photos';
  await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({...state,ts:Date.now(),dressUpload:{...x,images,stage}}),ctx.salon.id);
  // Show the real standardized image in Telegram so the boutique can check
  // lace, veil, hem and mannequin edges before sending the next angle.
  try{
   const form=new FormData();
   form.append('chat_id',ctx.chat);
   const previewMime=normalized[0]===0xff?'image/jpeg':normalized[0]===0x89?'image/png':'image/webp';
   form.append('photo',new Blob([normalized],{type:previewMime}),'ayeneh-dress.'+(previewMime==='image/png'?'png':previewMime==='image/webp'?'webp':'jpg'));
   form.append('caption',backgroundReady?'✅ پیش‌نمایش بک ثابت آینه — زاویه «'+DRESS_ANGLES[images.length-1]+'»':'✅ عکس اصلی ثبت شد (حذف پس‌زمینه در دسترس نبود) — زاویه «'+DRESS_ANGLES[images.length-1]+'»');
   await call(ctx.env,ctx.p,'sendPhoto',form);
  }catch(err){console.error('dress preview send failed',err?.message)}
  const saved=backgroundReady?'با بک ثابت':'با تصویر اصلی (بدون حذف پس‌زمینه)';
  await ctx.say(stage==='name'?'✅ هر چهار عکس ثبت شد. حالا نام مدل را بنویسید.':'✅ عکس «'+DRESS_ANGLES[images.length-1]+'» '+saved+' ثبت شد. حالا «'+DRESS_ANGLES[images.length]+'» را بفرستید.');
  return;
 }
 if(x.stage==='name'){
  const name=text(String(msg||'').trim(),150);
  if(!name){await ctx.say('نام مدل نمی‌تواند خالی باشد.');return}
  const id=uid();
  await run(ctx.db,'INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at,staff_id,media_group,line) VALUES(?,?,?,?,?,?,?,0,1,1,?,?,?,?)',id,ctx.salon.id,name,CATEGORIES.find(z=>name.includes(z))||'','',ctx.role==='staff'?ctx.staff.name:'',JSON.stringify(x.images),Date.now(),x.staffId,null,'dress');
  for(let i=0;i<4;i++)await run(ctx.db,'INSERT OR IGNORE INTO portfolio_imgs(portfolio_id,mid,media_id) VALUES(?,?,?)',id,i+1,x.images[i]);
  await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({...state,ts:Date.now(),dressUpload:{...x,id,name,stage:'sizes'}}),ctx.salon.id);
  await askDressSizes(ctx,id,name);return;
 }
 await ctx.say('سایزها را با دکمه‌های پیام قبلی انتخاب و ثبت نهایی کنید.');
}

const ANG=['روبه‌رو','پشت','نیم‌رخ راست','نیم‌رخ چپ'];
async function addPortfolio(ctx,photo,caption,group,mid){
 const t=ctx.role==='staff'?ctx.staff:null;
 must((photo.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است؛ عکس را به‌صورت «عکس» بفرستید نه «فایل»، یا کوچک‌ترش کنید');
 group=group?String(group).slice(0,64):null;caption=String(caption||'').trim();
 const media=await putImage(ctx.env,ctx.salon,null,await fileBytes(ctx.env,ctx.p,photo.file_id),'portfolio');
 const lines=caption.split('\n').map(x=>x.trim()).filter(Boolean);
 const title=(lines[0]||'نمونه‌کار').slice(0,150),category=CATEGORIES.find(c=>caption.includes(c))||'',desc=lines.slice(1).join(' ').slice(0,500);
 // One album = one dress. The id comes from the album, so photos arriving at the same moment still land on one card.
 const id=group?'tg'+ctx.salon.id.replace(/\W/g,'').slice(0,10)+String(group).replace(/\W/g,''):uid();
 const made=await run(ctx.db,'INSERT OR IGNORE INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at,staff_id,media_group,line) VALUES(?,?,?,?,?,?,?,1,1,1,?,?,?,?)',id,ctx.salon.id,title,category,desc,t?t.name:'',"[]",Date.now(),t?t.id:null,group,'dress');
 const fresh=made.meta.changes===1;
 if(!fresh&&lines.length)await run(ctx.db,'UPDATE portfolio SET title=?,category=?,description=? WHERE id=?',title,category,desc,id);
 await run(ctx.db,'INSERT OR IGNORE INTO portfolio_imgs(portfolio_id,mid,media_id) VALUES(?,?,?)',id,Number.isInteger(mid)?mid:Date.now()*1000+Math.floor(Math.random()*1000),media);
 // Rebuild the dress's photo list from the table in message order (first four only).
 await run(ctx.db,'UPDATE portfolio SET images=(SELECT json_group_array(media_id) FROM (SELECT media_id FROM portfolio_imgs WHERE portfolio_id=? ORDER BY mid LIMIT 4)) WHERE id=?',id,id);
 const ord=(await all(ctx.db,'SELECT media_id FROM portfolio_imgs WHERE portfolio_id=? ORDER BY mid',id)).map(x=>x.media_id),pos=ord.indexOf(media);
 const row=await one(ctx.db,'SELECT title FROM portfolio WHERE id=?',id),name=row?.title||title;
 if(pos>3){await ctx.say('هر لباس حداکثر ۴ عکس دارد؛ این یکی اضافه نشد.');return}
 const named=name!=='نمونه‌کار';
 if(!group){
  await askDressSizes(ctx,id,name);
  await ctx.say('✅ «'+esc(name)+'» '+(t?'با اسم تو ':'')+'روی صفحهٔ مزون نشست (فقط ۱ عکس).\nبرای نتیجهٔ بهتر و «زوایای دیگر»، ۲ تا ۴ عکس را با هم به‌صورت آلبوم بفرست: ۱) روبه‌رو ۲) پشت ۳) نیم‌رخ راست ۴) نیم‌رخ چپ.'+(named?'':'\nاسم لباس را هم زیر عکس بنویس.'));
  if(!named&&!t)await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,dress:id,ts:Date.now()}),ctx.salon.id);
  return;
 }
 await ctx.say('📷 «'+esc(name)+'»: عکس '+fa(pos+1)+' ('+ANG[pos]+') ثبت شد.'+(ord.length===1?'\nترتیب آلبوم مهم است: ۱) روبه‌رو ۲) پشت ۳) نیم‌رخ راست ۴) نیم‌رخ چپ.':''));
 if(fresh)await askDressSizes(ctx,id,name);
 if(fresh&&!named&&!t)await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,dress:id,ts:Date.now()}),ctx.salon.id);
 if(fresh&&!named)await ctx.say('اسم این لباس چیست؟ همین‌جا فقط اسمش را بنویس (مثلاً «پرنسسی پفی دانتل»).');
}
const portfolioKeys=(id,line)=>({inline_keyboard:[].concat([[{text:'🗑 حذف از صفحه',callback_data:'del:'+id}]])});
async function sendList(ctx,offset=0){
 const own=ctx.role==='staff',PAGE=10;
 const items=own?await all(ctx.db,'SELECT id,title FROM portfolio WHERE salon_id=? AND staff_id=? AND published=1 ORDER BY created_at DESC LIMIT ? OFFSET ?',ctx.salon.id,ctx.staff.id,PAGE+1,offset):await all(ctx.db,'SELECT id,title FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT ? OFFSET ?',ctx.salon.id,PAGE+1,offset);
 if(!items.length&&!offset){await ctx.say('هنوز نمونه‌کاری '+(own?'از تو ':'')+'روی صفحه نیست. یک عکس بفرست و زیرش اسم کار را بنویس.');return}
 const rows=items.slice(0,PAGE).map(x=>own?[{text:'🗑 '+x.title.slice(0,34),callback_data:'del:'+x.id}]:[{text:'✏️ '+x.title.slice(0,28),callback_data:'rn:'+x.id},{text:'🗑 حذف',callback_data:'del:'+x.id}]);
 const nav=[];if(offset>0)nav.push({text:'→ قبلی',callback_data:'pl:'+Math.max(0,offset-PAGE)});if(items.length>PAGE)nav.push({text:'بعدی ←',callback_data:'pl:'+(offset+PAGE)});if(nav.length)rows.push(nav);
 await ctx.say((own?'نمونه‌کارهای تو':'نمونه‌کارهای روی صفحه')+(offset?' (از '+fa(offset+1)+')':'')+'. برای حذف، روی هر کدام بزن:',{reply_markup:{inline_keyboard:rows}});
}

/* ---------- bot-only CRM: scoped to the linked salon, no manager website ---------- */
const CRM_PAGE=8;
const isStaff=ctx=>ctx.role==='staff'&&!!ctx.staff;
const crmStatus={new:'جدید',called:'تماس گرفته شد',booked:'هماهنگ شد',cancelled:'بسته شد',declined:'امکان‌پذیر نیست'};
const crmDate=ts=>new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',dateStyle:'short',timeStyle:'short'}).format(ts||Date.now());
const crmOffset=x=>Math.min(10000,Math.max(0,Number.parseInt(x,10)||0));
const crmScope=(ctx,alias='l')=>isStaff(ctx)?' AND '+alias+'.staff_id=?':'';
const crmArgs=ctx=>isStaff(ctx)?[ctx.staff.id]:[];
async function crmLead(ctx,id){
 if(!/^[a-f0-9-]{36}$/.test(String(id||'')))return null;
 return one(ctx.db,'SELECT * FROM leads l WHERE l.id=? AND l.salon_id=?'+crmScope(ctx),id,ctx.salon.id,...crmArgs(ctx));
}
async function sendCustomers(ctx,offset=0){
 offset=crmOffset(offset);
 const scope=crmScope(ctx),innerScope=crmScope(ctx,'x');
 const rows=await all(ctx.db,"SELECT l.id,l.name,l.phone,l.created_at,l.salon_status, (SELECT COUNT(*) FROM leads k WHERE k.salon_id=l.salon_id AND k.phone=l.phone) AS total_requests FROM leads l WHERE l.salon_id=? AND l.phone IS NOT NULL AND l.phone<>''"+scope+" AND l.id=(SELECT x.id FROM leads x WHERE x.salon_id=l.salon_id AND x.phone=l.phone"+innerScope+" ORDER BY x.created_at DESC,x.id DESC LIMIT 1) ORDER BY l.created_at DESC,l.id DESC LIMIT ? OFFSET ?",ctx.salon.id,...crmArgs(ctx),...crmArgs(ctx),CRM_PAGE+1,offset);
 if(!rows.length){await ctx.say(offset?'مشتری دیگری در این صفحه نیست.':'هنوز مشتری شماره‌دار ثبت نشده است. شماره مشتری وقتی در فرم درخواست وارد شود به فهرست اضافه می‌شود.');return}
 const visible=rows.slice(0,CRM_PAGE);
 const detail=visible.map((x,i)=>fa(offset+i+1)+'. '+esc(x.name||'بدون نام')+'\n📱 '+esc(local(x.phone))+'  ·  '+fa(x.total_requests)+' درخواست  ·  '+esc(crmDate(x.created_at)));
 const buttons=visible.map(x=>[{text:'👤 '+(x.name||local(x.phone)).slice(0,30),callback_data:'cu:d:'+x.id}]);
 const nav=[];if(offset)nav.push({text:'قبلی',callback_data:'cu:p:'+Math.max(0,offset-CRM_PAGE)});if(rows.length>CRM_PAGE)nav.push({text:'بعدی',callback_data:'cu:p:'+(offset+CRM_PAGE)});if(nav.length)buttons.push(nav);
 await ctx.say('👥 <b>مشتری‌های '+esc(ctx.salon.name)+'</b>\n\n'+detail.join('\n\n')+'\n\nبرای دیدن درخواست‌های هر مشتری روی نام او بزن.',{parse_mode:'HTML',reply_markup:{inline_keyboard:buttons}});
}
async function showCustomer(ctx,id){
 const row=await crmLead(ctx,id);if(!row){await ctx.say('این مشتری در فهرست شما نیست.');return}
 const reqs=await all(ctx.db,"SELECT l.id,l.look,l.salon_status,l.created_at FROM leads l WHERE l.salon_id=? AND l.phone=?"+crmScope(ctx)+" ORDER BY l.created_at DESC,l.id DESC LIMIT 6",ctx.salon.id,row.phone,...crmArgs(ctx));
 const items=reqs.map((r,i)=>fa(i+1)+'. '+esc(r.look||'لباس نامشخص')+' — '+esc(crmStatus[r.salon_status]||r.salon_status||'جدید')+' ('+esc(crmDate(r.created_at))+')');
 await ctx.say('👤 <b>'+esc(row.name||'مشتری')+'</b>\n📱 <b>'+esc(local(row.phone))+'</b>\n🏬 '+esc(ctx.salon.name)+'\n\n<b>درخواست‌های اخیر:</b>\n'+items.join('\n'),{parse_mode:'HTML',reply_markup:{inline_keyboard:reqs.slice(0,5).map((r,i)=>[{text:'باز کردن درخواست '+fa(i+1),callback_data:'cr:d:'+r.id}])}});
}
async function findCustomer(ctx,number){
 let n;try{n=phone(number.trim())}catch{await ctx.say('برای جستجو شماره کامل را بنویس: /find 09121234567');return}
 const x=await one(ctx.db,"SELECT l.id FROM leads l WHERE l.salon_id=? AND l.phone=?"+crmScope(ctx)+" ORDER BY l.created_at DESC,l.id DESC LIMIT 1",ctx.salon.id,n,...crmArgs(ctx));
 if(!x){await ctx.say('این شماره در مشتری‌های '+ctx.salon.name+' ثبت نشده است.');return}
 await showCustomer(ctx,x.id);
}
async function sendRequests(ctx,offset=0){
 offset=crmOffset(offset);
 const rows=await all(ctx.db,"SELECT l.id,l.name,l.phone,l.look,l.salon_status,l.created_at FROM leads l WHERE l.salon_id=?"+crmScope(ctx)+" ORDER BY l.created_at DESC,l.id DESC LIMIT ? OFFSET ?",ctx.salon.id,...crmArgs(ctx),CRM_PAGE+1,offset);
 if(!rows.length){await ctx.say(offset?'درخواست دیگری در این صفحه نیست.':'هنوز درخواستی از مشتری‌ها ثبت نشده است.');return}
 const visible=rows.slice(0,CRM_PAGE),buttons=visible.map(x=>[{text:'🗂 '+(x.name||local(x.phone)||'مشتری').slice(0,20)+' · '+(crmStatus[x.salon_status]||'جدید'),callback_data:'cr:d:'+x.id}]);
 const nav=[];if(offset)nav.push({text:'قبلی',callback_data:'cr:p:'+Math.max(0,offset-CRM_PAGE)});if(rows.length>CRM_PAGE)nav.push({text:'بعدی',callback_data:'cr:p:'+(offset+CRM_PAGE)});if(nav.length)buttons.push(nav);
 await ctx.say('📥 <b>درخواست‌های '+esc(ctx.salon.name)+'</b>\n\n'+visible.map((x,i)=>fa(offset+i+1)+'. '+esc(x.name||'مشتری')+' · '+esc(local(x.phone||''))+'\n'+esc(x.look||'لباس نامشخص')+' — '+esc(crmStatus[x.salon_status]||'جدید')+'\n'+esc(crmDate(x.created_at))).join('\n\n')+'\n\nروی هر درخواست بزن تا وضعیتش را مدیریت کنی.',{parse_mode:'HTML',reply_markup:{inline_keyboard:buttons}});
}
async function showRequest(ctx,id){
 const x=await crmLead(ctx,id);if(!x){await ctx.say('این درخواست در فهرست شما نیست.');return}
 const buttons=leadKeyboard(x,ctx.p,ctx.role==='manager'&&!x.staff_id?await teamOf(ctx.db,ctx.salon.id):[]);
 await ctx.say('📋 <b>درخواست مشتری</b>\n👤 '+esc(x.name||'بدون نام')+'\n📞 '+esc(local(x.phone||''))+'\n👗 '+esc(x.look||'نامشخص')+'\n📊 '+esc(crmStatus[x.salon_status]||'جدید')+'\n🕒 '+esc(crmDate(x.created_at))+(x.visit_note?'\n📅 '+esc(x.visit_note):'')+(x.note?'\n📝 '+esc(x.note):'')+'\n\nبرای تماس یا هماهنگی، وضعیت را با دکمه‌های زیر تغییر بده.',{parse_mode:'HTML',reply_markup:buttons});
}
function crmCsvCell(value){let s=String(value??'').replace(/[\r\n]+/g,' ');if(/^[=+\-@\t]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
async function exportCustomers(ctx){
 if(ctx.role!=='manager'){await ctx.say('خروجی کامل مشتری‌های مزون فقط برای مدیر متصل‌شده مجاز است.');return}
 await limited(ctx.db,'bot-export:'+ctx.salon.id+':'+ctx.chat,5,'برای امروز تعداد دریافت فایل مشتری‌ها کافی است');
 const rows=await all(ctx.db,"SELECT l.name,l.phone,l.look,l.salon_status,l.created_at FROM leads l WHERE l.salon_id=? AND l.phone IS NOT NULL AND l.phone<>'' ORDER BY l.created_at DESC LIMIT 3000",ctx.salon.id);
 if(!rows.length){await ctx.say('هنوز شماره مشتری ثبت نشده است.');return}
 const csv='\ufeff'+[['نام','موبایل','لباس','وضعیت','تاریخ']].concat(rows.map(x=>[x.name,local(x.phone),x.look,crmStatus[x.salon_status]||'جدید',new Date(x.created_at).toISOString()])).map(row=>row.map(crmCsvCell).join(',')).join('\r\n');
 const fd=new FormData();fd.append('chat_id',ctx.chat);fd.append('document',new Blob([csv],{type:'text/csv;charset=utf-8'}),'customers-'+ctx.salon.slug+'.csv');fd.append('caption','مشتری‌ها و درخواست‌های '+ctx.salon.name+' — فقط برای استفاده داخلی و با رعایت حریم خصوصی.');
 await call(ctx.env,ctx.p,'sendDocument',fd);
}
async function sendBalance(ctx){
 if(ctx.role!=='manager'){await ctx.say('اعتبار مزون فقط برای مدیر قابل مشاهده است.');return}
 const c=await creditStatus(ctx.db,ctx.salon);
 await ctx.say('💳 <b>اعتبار «'+esc(ctx.salon.name)+'»</b>\nمانده: '+fa(c.left)+' از '+fa(c.limit)+' اعتبار\nمصرف: '+fa(c.used)+' اعتبار\n\nبرای درخواست افزایش اعتبار، یکی از بسته‌ها را انتخاب کن.',{parse_mode:'HTML',reply_markup:{inline_keyboard:PACKS.map(n=>[{text:'درخواست '+fa(n)+' اعتبار',callback_data:'rc:'+n}])}});
}

/* ---------- delivery ---------- */
// A clean photo album in a fixed order (before, after, reference), then one details message
// replying to it with the three status buttons. Albums get no per-photo captions on purpose:
// when several photos carry captions, Telegram hides them all.
export function leadText(lead,salon,photos,member=null){
 const when=new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',dateStyle:'medium',timeStyle:'short'}).format(lead.created_at||Date.now());
 const names={original:'قبل: عکس خود مشتری',preview:'بعد: شبیه‌سازی لباس',reference:'عکس لباسی که مشتری انتخاب کرده'};
 const want=lead.intent==='want';
 const head=want?'💍 <b>«این لباس را می‌خواهم»</b> — '+esc(lead.look||'لباس انتخابی'):member?'👰 <b>درخواست تازه برای تو — مشتری «'+esc(salon.name)+'»</b>':'👰 <b>درخواست تازه برای '+esc(salon.name)+'</b>';
 const lines=[head+(want&&member?' (مشتری «'+esc(salon.name)+'»)':''),...(lead.staff_id||member?[]:['(مشتری خود مزون؛ می‌توانید با دکمه‌های پایین به یک نیرو بدهید)']),'',
  '👤 <b>'+(want?'عروس':'نام')+':</b> '+esc(lead.name),
  '📞 <b>موبایل:</b> '+esc(local(lead.phone))+' ('+esc(lead.phone)+')',
  '👆 برای تماس، روی شماره بزنید',...(lead.visit_note?['🗓 <b>روز/ساعت دلخواه:</b> '+esc(lead.visit_note)]:[]),
  '✈️ <b>تلگرام:</b> '+(lead.telegram?'@'+esc(lead.telegram):'ثبت نکرده'),'',
  '🧩 <b>خدمت:</b> '+(LINE_LABEL[lead.line]||LINE_LABEL.dress),
  '👰 <b>لباس انتخابی:</b> '+(lead.look?esc(lead.look):'مشخص نکرده'),
  '📝 <b>توضیح مشتری:</b> '+(lead.note?esc(lead.note):'ندارد'),''];
 if(photos.length)lines.push('🖼 <b>عکس‌های بالا به ترتیب:</b>',...photos.map((p,i)=>'  '+fa(i+1)+'. '+names[p]));
 if(!photos.includes('preview'))lines.push('  (شبیه‌سازی تصویری برای این درخواست ساخته نشده)');
 lines.push('','🕒 '+esc(when),'','بعد از تماس، یکی از دکمه‌های زیر را بزنید'+(lead.follow_chat?' تا مشتری هم خبردار شود':'')+'.');
 return lines.join('\n');
}
async function sendTo(env,p,salon,lead,files,target,member,members){
 const chat=target[PLATFORMS[p].col],kinds=files.map(f=>f.kind);let album=null;
 if(files.length>1){
  const form=new FormData();form.append('chat_id',chat);files.forEach((f,i)=>form.append('p'+i,new Blob([f.bytes],{type:f.mime}),'p'+i+'.jpg'));
  form.append('media',JSON.stringify(files.map((f,i)=>({type:'photo',media:'attach://p'+i}))));
  try{const r=await call(env,p,'sendMediaGroup',form);album=r?.[0]?.message_id||null}
  catch(e){for(const f of files){try{const g=new FormData();g.append('chat_id',chat);g.append('photo',new Blob([f.bytes],{type:f.mime}),'p.jpg');const r=await call(env,p,'sendPhoto',g);album=album||r?.message_id||null}catch(err){console.error('photo',err?.message)}}}
 }else if(files.length===1){try{const g=new FormData();g.append('chat_id',chat);g.append('photo',new Blob([files[0].bytes],{type:files[0].mime}),'p.jpg');const r=await call(env,p,'sendPhoto',g);album=r?.message_id||null}catch(err){console.error('photo',err?.message)}}
 // The details go out even if no photo could be sent, so the salon still has the customer.
 const d=await call(env,p,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:leadText(lead,salon,kinds,member),reply_markup:leadKeyboard(lead,p,members),...(album?{reply_parameters:{message_id:album,allow_sending_without_reply:true}}:{})});
 return d?.message_id||album;
}
// A member's request goes only to that member; if they have not linked the bot yet it waits
// (the manager only hears that it is waiting). A salon customer's request goes to the manager.
export async function deliverLead(env,lead){
 const db=env.DB,salon=await one(db,'SELECT * FROM salons WHERE id=?',lead.salon_id);
 const member=lead.staff_id?await one(db,'SELECT * FROM team WHERE id=?',lead.staff_id):null;
 const target=member||salon,members=member?[]:await teamOf(db,salon.id);
 const targets=inboxes(env,target);
 if(member&&!targets.length){
  const mark=await run(db,'UPDATE leads SET waiting=1 WHERE id=? AND waiting=0',lead.id);
  if(mark.meta.changes){
   for(const q of inboxes(env,salon))await call(env,q,'sendMessage',{chat_id:salon[PLATFORMS[q].col],text:'⏳ یک مشتری '+member.name+' درخواست فرستاد، ولی '+member.name+' هنوز ربات را وصل نکرده. درخواست منتظر می‌ماند و به محض وصل شدن برایش می‌رود. لینک دعوتش را از /team دوباره بفرستید.'}).catch(()=>{});
   await notifyOwner(env,{salon,kind:'stuck',level:'warn',text:'یک درخواست منتظر مزون‌دار «'+member.name+'» است که هنوز ربات را وصل نکرده.'});
  }
  return false;
 }
 if(!targets.length){
  // A salon customer but the manager has not linked the bot: keep it until they do.
  const mark=await run(db,'UPDATE leads SET waiting=1 WHERE id=? AND waiting=0',lead.id);
  if(mark.meta.changes)await notifyOwner(env,{salon,kind:'stuck',level:'warn',text:'یک درخواست منتظر مدیر مزون است که ربات را وصل نکرده.'});
  return false;
 }
 const lock=await run(db,"UPDATE leads SET status='sending',attempts=attempts+1 WHERE id=? AND status IN('queued','retry')",lead.id);
 if(!lock.meta.changes)return false;
 const files=[];
 for(const [id,kind] of [[lead.original_id,'original'],[lead.preview_id,'preview'],[lead.reference_id,'reference']]){if(!id)continue;const m=await one(db,'SELECT * FROM media WHERE id=? AND salon_id=?',id,salon.id);if(!m)continue;const o=await bucketFor(env).get(m.object_key);if(!o)continue;files.push({kind,mime:m.mime,bytes:await o.arrayBuffer()})}
 const messages=parse(lead.messages),errors=[];
 for(const p of targets){if(messages[p])continue;try{messages[p]=await sendTo(env,p,salon,lead,files,target,member,members)}catch(e){errors.push(String(e?.message||e))}}
 const ok=Object.keys(messages).length>0;
 const status=ok?'sent':(lead.attempts+1>=3?'failed':'retry');
 await run(db,"UPDATE leads SET status=?,messages=?,last_error=? WHERE id=?",status,JSON.stringify(messages),errors.join(' | ').slice(0,300)||null,lead.id);
 if(status==='failed')await notifyOwner(env,{salon,kind:'stuck',level:'error',text:'یک درخواست بعد از ۳ تلاش به '+(member?'«'+member.name+'»':'مدیر')+' نرسید: '+errors.join(' | ').slice(0,150)});
 return ok;
}

// Scheduler: retry undelivered submissions, then remind salons about untouched ones (after 2 hours
// and after 24 hours, only between 9:00 and 21:00 Tehran time). After 24 hours a following
// customer is told the salon has not answered yet, with the salon's number.
const tehranHour=t=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tehran',hour:'2-digit',hour12:false}).format(t))%24;
export async function deliverPending(env,origin=''){
 if(!botReady(env)||!env.DB)return 0;let n=0;
 for(const l of await all(env.DB,"SELECT * FROM leads WHERE status IN('queued','retry') AND attempts<3 AND waiting=0 ORDER BY created_at LIMIT 20"))if(await deliverLead(env,l))n++;
 await run(env.DB,"UPDATE leads SET status='retry' WHERE status='sending' AND created_at<?",Date.now()-5*60000);
 await remind(env,origin);
 return n;
}
export async function remind(env,origin,now=Date.now()){
 const h=tehranHour(now);if(h<9||h>=21)return 0;let n=0;
 const due=await all(env.DB,"SELECT * FROM leads WHERE status='sent' AND salon_status='new' AND ((reminders=0 AND created_at<?) OR (reminders=1 AND created_at<?)) ORDER BY created_at LIMIT 20",now-2*3600000,now-24*3600000);
 for(const lead of due){
  const salon=await one(env.DB,'SELECT * FROM salons WHERE id=?',lead.salon_id);if(!salon)continue;
  const member=lead.staff_id?await one(env.DB,'SELECT * FROM team WHERE id=?',lead.staff_id):null,target=member||salon;
  const claim=await run(env.DB,'UPDATE leads SET reminders=reminders+1 WHERE id=? AND reminders=?',lead.id,lead.reminders);if(!claim.meta.changes)continue;
  const messages=parse(lead.messages);
  const members=member?[]:await teamOf(env.DB,salon.id);
  for(const p of inboxes(env,target)){try{await call(env,p,'sendMessage',{chat_id:target[PLATFORMS[p].col],parse_mode:'HTML',text:'⏰ <b>یادآوری'+(lead.reminders?' دوم':'')+':</b> '+esc(lead.name)+' هنوز منتظر تماس شماست.\n📞 '+esc(local(lead.phone))+(lead.look?'\n✂️ '+esc(lead.look):'')+'\n\nبعد از تماس یکی از دکمه‌ها را بزنید.',reply_markup:leadKeyboard(lead,p,members),...(messages[p]?{reply_parameters:{message_id:messages[p],allow_sending_without_reply:true}}:{})})}catch(e){console.error('remind',e?.message)}}
  if(lead.reminders===1)await notifyCustomer(env,lead,salon,customerText('new',salon,origin));
  n++;
 }
 return n;
}

export const BOT_COMMANDS=[{command:'start',description:'شروع آینه'},{command:'newdress',description:'ثبت لباس و چهار زاویه'},{command:'cancel',description:'انصراف از ثبت لباس'},{command:'help',description:'راهنما'}];
export const BOT_DESCRIPTION='پلتفرم آینه، پرو مجازی لباس عروس برای مزون‌ها. عروس لباس‌های واقعی مزون را در حدود یک دقیقه روی عکس خودش می‌بیند و نتیجه را برای مزون می‌فرستد. برای شروع /start را بزنید.';
export const BOT_SHORT_DESCRIPTION='پرو مجازی لباس عروس برای مزون‌ها';
// Safe to repeat: every call just sets the same values. One failure never blocks the others (Bale may lack some methods).
export async function setBotProfile(env,b){
 const steps=[['setMyCommands',{commands:BOT_COMMANDS}],['setMyDescription',{description:BOT_DESCRIPTION}],['setMyShortDescription',{short_description:BOT_SHORT_DESCRIPTION}],['setChatMenuButton',{menu_button:{type:'commands'}}]];
 for(const [m,x] of steps)await call(env,b,m,x).catch(e=>console.error(m,e?.message));
}
export async function setWebhook(env,origin){
 const out={ok:true,bots:{}};
 if(platformReady(env,'telegram')){
  must(env.TELEGRAM_WEBHOOK_SECRET,'TELEGRAM_WEBHOOK_SECRET تنظیم نشده است',503);
  await call(env,'telegram','setWebhook',{url:origin+'/api/telegram/webhook',secret_token:env.TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message','callback_query'],drop_pending_updates:false});
  out.bots.telegram=(await call(env,'telegram','getMe',{})).username;out.bot=out.bots.telegram;
 }
 if(platformReady(env,'bale')){
  must(baleSecret(env),'TELEGRAM_WEBHOOK_SECRET تنظیم نشده است',503);
  await call(env,'bale','setWebhook',{url:origin+'/api/bale/webhook/'+baleSecret(env)});
  out.bots.bale=(await call(env,'bale','getMe',{})).username;out.bot=out.bot||out.bots.bale;
 }
 for(const b of Object.keys(out.bots))await setBotProfile(env,b);
 must(Object.keys(out.bots).length,'هیچ رباتی تنظیم نشده است',503);
 return out;
}
