// Independent field-sales workspace. No administrator cookie or owner endpoints are used here.
import {Problem,must,uid,token,hash,text,digits,safeLink,limited} from './domain.js';
import {same} from './auth.js';
import {owner} from './server.js';
import {putImage,maxUpload} from './storage.js';
import {newLinkCode} from './telegram.js';
import {normalizeDressSizes} from './dress-sizes.js';
import {normalizeDressPhoto} from './dress-background.js';
import {PLAN_MONTHS,addPlanMonths,subscriptionState} from './subscriptions.js';

const enc=new TextEncoder();
const J=(v,status=200,headers={})=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const first=(db,sql,...args)=>db.prepare(sql).bind(...args).first();
const exec=(db,sql,...args)=>db.prepare(sql).bind(...args).run();
const many=async(db,sql,...args)=>(await db.prepare(sql).bind(...args).all()).results;
const clean=(v,n)=>text(String(v??''),n);
const allowedStages=['new','visited','demo','negotiation','won','lost'];
const DEFAULT_PLANS={
 campaign:'بلک فرایدی',campaign_end:Date.parse('2026-11-24T20:29:59Z'),
 plans:[
  {id:'one',name:'پلن ۱ ماهه',base:25000000,promo:15000000,gift:null,features:['دسترسی به آینه','صفحه اختصاصی مزون','ثبت و مدیریت مدل‌های لباس','پرو مجازی روی عکس مشتری','پشتیبانی آنلاین','آموزش اولیه']},
  {id:'three',name:'پلن ۳ ماهه',base:60000000,promo:30000000,gift:100,features:['تمام امکانات پلن ۱ ماهه','پشتیبانی سه‌ماهه','مدیریت نمونه‌کار و سایزبندی','آموزش راه‌اندازی']},
  {id:'six',name:'پلن ۶ ماهه',base:80000000,promo:40000000,gift:200,features:['تمام امکانات پلن ۳ ماهه','پشتیبانی اولویت‌دار','گزارش استفاده ماهانه','امکان شخصی‌سازی برند مزون','آموزش تکمیلی تیم مزون']}
 ]
};
async function priceConfig(db){
 const row=await first(db,'SELECT value FROM app_settings WHERE key=?','sales_plans');
 return row?parse(row.value):DEFAULT_PLANS;
}
function displayPricing(data){
 const now=Date.now(),campaignActive=Boolean(data.campaign)&&Number(data.campaign_end)>now;
 return {campaign:campaignActive?data.campaign:'',campaign_end:campaignActive?data.campaign_end:null,plans:data.plans.map(p=>({...p,features:['three','six'].includes(p.id)&&!(p.features||[]).some(x=>String(x).includes('طراحی ترکیبی'))?[...(p.features||[]),'طراحی ترکیبی لباس عروس (لباس انتخابی من)']:p.features,price:campaignActive&&p.promo!==null?p.promo:p.base,discount_active:campaignActive&&p.promo!==null}))};
}
function validatePricing(b){
 must(b&&Array.isArray(b.plans)&&b.plans.length===3,'سه پلن قیمت‌گذاری لازم است');
 const ids=['one','three','six'],plans=b.plans.map((p,i)=>{
  must(p.id===ids[i],'شناسه و ترتیب پلن نادرست است');
  const name=clean(p.name,65);
  const base=Number(p.base),promo=p.promo===null||p.promo===''?null:Number(p.promo);
  const gift=p.gift===null||p.gift===''?null:Number(p.gift);
  must(name.length>=3&&Number.isInteger(base)&&base>0&&base<=1000000000,'قیمت پایه معتبر نیست');
  must(promo===null||(Number.isInteger(promo)&&promo>0&&promo<=base),'قیمت کمپین معتبر نیست');
  must(gift===null||(Number.isInteger(gift)&&gift>=0&&gift<=100000),'تعداد عکس هدیه معتبر نیست');
  must(Array.isArray(p.features)&&p.features.length>0&&p.features.length<=12,'حداقل یک و حداکثر ۱۲ ویژگی برای هر پلن');
  const features=p.features.map(f=>clean(f,110)).filter(Boolean);
  must(features.length>0,'ویژگی پلن خالی است');
  return {id:p.id,name,base,promo,gift,features};
 });
 const campaign=clean(b.campaign||'',60);
 const end=b.campaign_end===null||b.campaign_end===''?null:Number(b.campaign_end);
 must(end===null||(Number.isInteger(end)&&end>0&&end<4102444800000),'زمان پایان کمپین معتبر نیست');
 return {campaign,campaign_end:end,plans};
}
const salt=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
const bytes=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
async function passHash(password,s){
 const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);
 const buf=await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(s),iterations:120000,hash:'SHA-256'},key,256);
 return Array.from(new Uint8Array(buf),b=>b.toString(16).padStart(2,'0')).join('');
}
const secure=u=>u.protocol==='https:';
const salesCookie=(raw,u)=>'ayneh_sales='+raw+'; HttpOnly; SameSite=Strict; Path=/api/sales; Max-Age=43200'+(secure(u)?'; Secure':'');
const clearCookie=u=>'ayneh_sales=; HttpOnly; SameSite=Strict; Path=/api/sales; Max-Age=0'+(secure(u)?'; Secure':'');
const ip=req=>req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
async function actor(req,env){
 const raw=(req.headers.get('cookie')||'').match(/(?:^|;\s*)ayneh_sales=([a-f0-9]{64})(?:;|$)/)?.[1];
 if(!raw)return null;
 return first(env.DB,'SELECT m.id,m.name,m.username FROM marketer_sessions s JOIN marketers m ON m.id=s.marketer_id WHERE s.token_hash=? AND s.expires_at>? AND m.active=1',await hash(raw),Date.now());
}
const requireActor=async(req,env)=>{const a=await actor(req,env);must(a,'برای ادامه وارد پنل بازاریاب شوید',401);return a};
const validSlug=v=>{
 const x=String(v||'').trim().toLowerCase().replace(/[\s_]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
 must(/^[a-z][a-z0-9-]{2,45}$/.test(x),'شناسه انگلیسی صفحه باید ۳ تا ۴۶ نویسه و با حرف شروع شود');
 must(x!=='demo','شناسه صفحه رزرو شده است');
 return x;
};
function normalizePhone(v){
 const x=digits(String(v||'')).replace(/[\s()-]/g,'');
 must(!x||/^\+?\d{7,15}$/.test(x),'شماره تماس معتبر نیست');
 return x;
}
const publicFields=['bio','address','hours','manager','city','phone'];
const linkFields=['instagram','website','telegram','map'];
function updatedProfile(old,input){
 const next={...old};
 if(!input||typeof input!=='object'||Array.isArray(input))return next;
 for(const k of publicFields)if(Object.hasOwn(input,k))next[k]=k==='phone'?normalizePhone(input[k]):clean(input[k],k==='bio'?800:250);
 for(const k of linkFields)if(Object.hasOwn(input,k))next[k]=safeLink(String(input[k]||''));
 return next;
}
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
async function ownSalon(db,rep,slug){
 const row=await first(db,'SELECT s.*,ms.stage,ms.bot_link_approved,ms.contact_name,ms.contact_phone,ms.note,ms.next_followup_at,ms.updated_at AS sales_updated_at FROM marketer_salons ms JOIN salons s ON s.id=ms.salon_id WHERE ms.marketer_id=? AND s.slug=?',rep.id,slug);
 must(row,'این مزون در فهرست شما نیست',404);
 return row;
}
const showSalon=s=>({id:s.id,slug:s.slug,name:s.name,profile:parse(s.profile),stage:s.stage,approved:!!s.approved,bot_link_approved:!!s.bot_link_approved,contact_name:s.contact_name,contact_phone:s.contact_phone,note:s.note,next_followup_at:s.next_followup_at,updated_at:s.sales_updated_at,created_at:s.created_at,telegram:!!s.telegram_chat_id,bale:!!s.bale_chat_id});
const links=(env,slug)=>(env.APP_ORIGIN||'https://ayneh-mezon.site')+'/s/'+slug;

export async function salesApi(req,env){
 must(env.DB,'پایگاه داده هنوز آماده نیست',503);
 const db=env.DB,u=new URL(req.url),p=u.pathname,post=req.method==='POST';
 must(req.method==='GET'||post,'متد مجاز نیست',405);
 if(post){
  must(req.headers.get('origin')===u.origin,'نشانی درخواست مجاز نیست',403);
  must(Number(req.headers.get('content-length')||0)<6000000,'فایل یا درخواست بزرگ‌تر از حد مجاز است',413);
 }
 const body=async()=>req.json().catch(()=>({}));
 if(p==='/api/sales/admin'&&req.method==='GET'){
  await owner(req,env);
  return J({users:await many(db,'SELECT m.id,m.name,m.username,m.active,m.created_at,m.updated_at,m.initial_credits,COUNT(ms.salon_id) AS salons, SUM(CASE WHEN ms.stage=\'won\' THEN 1 ELSE 0 END) AS won, SUM(CASE WHEN ms.stage=\'demo\' THEN 1 ELSE 0 END) AS demos, SUM(CASE WHEN ms.stage=\'negotiation\' THEN 1 ELSE 0 END) AS negotiating FROM marketers m LEFT JOIN marketer_salons ms ON ms.marketer_id=m.id GROUP BY m.id ORDER BY m.created_at DESC')});
 }
 if(p==='/api/sales/admin/create'&&post){
  await owner(req,env);
  const b=await body(),username=String(b.username||'').trim().toLowerCase(),name=clean(b.name,80);
  must(name.length>=2,'نام بازاریاب را بنویسید');
  must(/^[a-z][a-z0-9._-]{3,39}$/.test(username),'نام کاربری باید انگلیسی و حداقل ۴ نویسه باشد');
  must(!await first(db,'SELECT 1 FROM marketers WHERE username=?',username),'این نام کاربری تکراری است',409);
  const password=String(b.password||'')||token().slice(0,20);
  must(password.length>=12&&password.length<=128,'رمز حداقل ۱۲ نویسه است');
  const id=uid(),s=salt(),now=Date.now();
  await exec(db,'INSERT INTO marketers(id,name,username,password_salt,password_hash,active,created_at,updated_at) VALUES(?,?,?,?,?,1,?,?)',id,name,username,s,await passHash(password,s),now,now);
  return J({ok:true,id,username,password,initial_credits:10}); // Shown only once after creation, never persisted as plaintext.
 }
 if(p==='/api/sales/admin/credits'&&post){
  await owner(req,env);
  const b=await body(),id=String(b.id||''),credits=Number(b.initial_credits);
  must(Number.isInteger(credits)&&credits>=1&&credits<=500,'اعتبار اولیه باید بین ۱ تا ۵۰۰ تصویر باشد');
  const exists=await first(db,'SELECT id FROM marketers WHERE id=?',id);
  must(exists,'بازاریاب پیدا نشد',404);
  await exec(db,'UPDATE marketers SET initial_credits=?,updated_at=? WHERE id=?',credits,Date.now(),id);
  return J({ok:true,initial_credits:credits});
 }
 if(p==='/api/sales/admin/pending-bots'&&req.method==='GET'){
  await owner(req,env);
  return J({salons:await many(db,"SELECT s.slug,s.name,s.approved,s.telegram_chat_id IS NOT NULL AS telegram,s.bale_chat_id IS NOT NULL AS bale,ms.bot_link_approved,m.name AS marketer FROM marketer_salons ms JOIN salons s ON s.id=ms.salon_id JOIN marketers m ON m.id=ms.marketer_id ORDER BY ms.bot_link_approved ASC,ms.created_at DESC LIMIT 300")});
 }
 if(p==='/api/sales/admin/bot-approve'&&post){
  await owner(req,env);
  const b=await body(),slug=String(b.slug||''),approved=b.approved===true?1:0;
  const row=await first(db,'SELECT ms.salon_id FROM marketer_salons ms JOIN salons s ON s.id=ms.salon_id WHERE s.slug=?',slug);
  must(row,'مزون بازاریابی پیدا نشد',404);
  await exec(db,'UPDATE marketer_salons SET bot_link_approved=?,updated_at=? WHERE salon_id=?',approved,Date.now(),row.salon_id);
  return J({ok:true,approved:!!approved});
 }
 if(p==='/api/sales/admin/pricing'){
  await owner(req,env);
  if(req.method==='GET')return J({pricing:await priceConfig(db)});
  const cfg=validatePricing(await body());
  await exec(db,'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at','sales_plans',JSON.stringify(cfg),Date.now());
  return J({ok:true,pricing:cfg});
 }
 if(p==='/api/sales/admin/subscription'&&post){
  await owner(req,env);
  const b=await body(),slug=validSlug(b.slug),planId=String(b.plan_id||''),months=PLAN_MONTHS[planId];
  must(months,'پلن انتخاب‌شده معتبر نیست',400);
  // Explicit platform-admin action, not a sales-stage update or a payment claim.
  const salon=await first(db,'SELECT id,slug,settings,credit_limit,approved FROM salons WHERE slug=?',slug);
  must(salon,'مزون موردنظر پیدا نشد',404);
  must(salon.approved===1,'برای این مزون ابتدا باید تأیید فعالیت انجام شود',403);
  const settings=parse(salon.settings),current=subscriptionState(settings);
  must(!current.active,'اشتراک این مزون هنوز فعال است؛ تمدید یا تغییر پلن نیازمند تسویه و فرآیند مستقل است',409);
  const options=displayPricing(await priceConfig(db)).plans;
  const plan=options.find(p=>p.id===planId);
  must(plan,'پلن در تعرفه فروش وجود ندارد',409);
  const gift=Number(plan.gift);
  must(Number.isSafeInteger(gift)&&gift>=0,'اعتبار هدیه این پلن در ادمین تعرفه‌ها تعیین نشده است',409);
  const now=Date.now(),subscription={status:'active',plan_id:planId,starts_at:now,expires_at:addPlanMonths(now,months),images_granted:gift,price_paid:plan.price,plan_name:plan.name};
  const before=Number(salon.credit_limit)||0,newLimit=before+gift;
  // Store entitlement, credit and an audit ledger in a single D1 transaction.
  await db.batch([
   db.prepare('UPDATE salons SET settings=?,credit_limit=? WHERE id=?').bind(JSON.stringify({...settings,subscription}),newLimit,salon.id),
   db.prepare('INSERT INTO credit_ledger(id,salon_id,amount,method,ref,by_who,limit_after,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid(),salon.id,gift,'subscription',planId,'platform-admin',newLimit,now)
  ]);
  return J({ok:true,slug,subscription,credit_limit:newLimit});
 }
 if(p==='/api/sales/admin/status'&&post){
  await owner(req,env);const b=await body();
  const active=b.active===true?1:0,who=await first(db,'SELECT id FROM marketers WHERE id=?',String(b.id||''));
  must(who,'بازاریاب پیدا نشد',404);
  await exec(db,'UPDATE marketers SET active=?,updated_at=? WHERE id=?',active,Date.now(),who.id);
  if(!active)await exec(db,'DELETE FROM marketer_sessions WHERE marketer_id=?',who.id);
  return J({ok:true});
 }
 if(p==='/api/sales/admin/reset'&&post){
  await owner(req,env);const b=await body(),id=String(b.id||'');
  must(await first(db,'SELECT 1 FROM marketers WHERE id=?',id),'بازاریاب پیدا نشد',404);
  const password=String(b.password||'')||token().slice(0,20);
  must(password.length>=12&&password.length<=128,'رمز حداقل ۱۲ نویسه است');
  const s=salt();
  await exec(db,'UPDATE marketers SET password_salt=?,password_hash=?,updated_at=? WHERE id=?',s,await passHash(password,s),Date.now(),id);
  await exec(db,'DELETE FROM marketer_sessions WHERE marketer_id=?',id);
  return J({ok:true,password}); // One-time display only.
 }
 if(p==='/api/sales/login'&&post){
  const b=await body(),username=String(b.username||'').toLowerCase().trim(),password=String(b.password||'');
  must(username.length<=40&&password.length<=128,'ورودی ورود معتبر نیست',400);
  // Shared office/cellular IPs should not lock everyone out after a few mistakes.
  await limited(db,'sales:login:ip:'+ip(req),100,'تلاش ورود بیش از حد مجاز است');
  await limited(db,'sales:login:user:'+ip(req)+':'+username,15,'برای این حساب تلاش‌های ناموفق زیادی ثبت شده است');
  const user=await first(db,'SELECT * FROM marketers WHERE username=? AND active=1',username);
  // Uniform-looking error for inactive, unknown and incorrect passwords.
  const dummy='0'.repeat(32),candidate=await passHash(password,(user?.password_salt)||dummy);
  must(user&&same(candidate,user.password_hash),'نام کاربری یا رمز عبور درست نیست',401);
  const raw=token(),now=Date.now();
  await exec(db,'INSERT INTO marketer_sessions(token_hash,marketer_id,expires_at,created_at) VALUES(?,?,?,?)',await hash(raw),user.id,now+43200000,now);
  return J({ok:true},200,{'Set-Cookie':salesCookie(raw,u)});
 }
 if(p==='/api/sales/logout'&&post){
  const raw=(req.headers.get('cookie')||'').match(/(?:^|;\s*)ayneh_sales=([a-f0-9]{64})(?:;|$)/)?.[1];
  if(raw)await exec(db,'DELETE FROM marketer_sessions WHERE token_hash=?',await hash(raw));
  return J({ok:true},200,{'Set-Cookie':clearCookie(u)});
 }
 if(p==='/api/sales/me'&&req.method==='GET'){
  const rep=await actor(req,env);
  return J({loggedIn:!!rep,rep:rep||null});
 }
 const rep=await requireActor(req,env);
 if(p==='/api/sales/pricing'&&req.method==='GET'){
  return J(displayPricing(await priceConfig(db)));
 }
 if(p==='/api/sales/dashboard'&&req.method==='GET'){
  const rows=await many(db,'SELECT ms.stage,COUNT(*) AS n FROM marketer_salons ms WHERE ms.marketer_id=? GROUP BY ms.stage',rep.id);
  const overdue=await first(db,"SELECT COUNT(*) AS n FROM marketer_salons WHERE marketer_id=? AND next_followup_at IS NOT NULL AND next_followup_at<? AND stage NOT IN ('won','lost')",rep.id,Date.now());
  return J({stages:Object.fromEntries(rows.map(r=>[r.stage,Number(r.n)])),followups:Number(overdue?.n||0)});
 }
 if(p==='/api/sales/salons'&&req.method==='GET'){
  const rows=await many(db,'SELECT s.id,s.slug,s.name,s.profile,s.approved,s.created_at,s.telegram_chat_id,s.bale_chat_id,ms.stage,ms.bot_link_approved,ms.contact_name,ms.contact_phone,ms.note,ms.next_followup_at,ms.updated_at AS sales_updated_at FROM marketer_salons ms JOIN salons s ON ms.salon_id=s.id WHERE ms.marketer_id=? ORDER BY ms.updated_at DESC LIMIT 200',rep.id);
  return J({salons:rows.map(showSalon)});
 }
 if(p==='/api/sales/salons/create'&&post){
  await limited(db,'sales:create:'+rep.id,100,'سقف ثبت امروز پر شده است',429);
  const b=await body(),slug=validSlug(b.slug),name=clean(b.name,100);
  must(name.length>=2,'نام مزون را وارد کنید');
  must(!await first(db,'SELECT 1 FROM salons WHERE slug=?',slug),'این شناسه قبلاً ثبت شده است',409);
  const id=uid(),now=Date.now(),profile=updatedProfile({},b.profile||{});
  const initial=Number((await first(db,'SELECT initial_credits FROM marketers WHERE id=?',rep.id))?.initial_credits);
  must(Number.isInteger(initial)&&initial>=1&&initial<=500,'اعتبار اولیه بازاریاب معتبر نیست',403);
  const contact=clean(b.contact_name||'',90),contactPhone=normalizePhone(b.contact_phone);
  const settings={generation_enabled:true,reference_verified:true,catalog:false,allow_own_dress:false,daily_limit:initial,quota_per_line:4};
  await db.batch([
   db.prepare("INSERT INTO salons(id,slug,owner_id,name,profile,settings,created_at,approved,credit_limit,manage_token) VALUES(?,?,?,?,?,?,?,1,?,NULL)").bind(id,slug,'sales:'+rep.id,name,JSON.stringify(profile),JSON.stringify(settings),now,initial),
   db.prepare("INSERT INTO marketer_salons(salon_id,marketer_id,stage,contact_name,contact_phone,created_at,updated_at) VALUES(?,?, 'new',?,?,?,?)").bind(id,rep.id,contact,contactPhone,now,now),
   db.prepare('INSERT INTO credit_ledger(id,salon_id,amount,method,ref,by_who,limit_after,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid(),id,initial,'opening','field-sales',rep.username,initial,now)
  ]);
  return J({ok:true,slug,url:links(env,slug),status:'active',credits:initial,bot_link_approved:false});
 }
 const view=p.match(/^\/api\/sales\/salons\/(?!customers$)([a-z0-9-]{3,46})$/);
 if(view&&req.method==='GET'){
  const salon=await ownSalon(db,rep,view[1]);
  const portfolio=await many(db,'SELECT id,title,images,created_at,sizes FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 40',salon.id);
  // Operational engagement only: visitor identities and customer phones stay hidden.
  const since=Date.now()-30*86400000;
  const [v,g,l]=await Promise.all([
   first(db,"SELECT COUNT(DISTINCT visitor) AS n FROM events_log WHERE salon_id=? AND kind='view' AND created_at>=? AND visitor<>''",salon.id,since),
   first(db,"SELECT COUNT(*) AS n FROM generations WHERE salon_id=? AND state='success' AND created_at>=?",salon.id,since),
   first(db,"SELECT COUNT(*) AS n FROM leads WHERE salon_id=? AND created_at>=?",salon.id,since)
  ]);
  const pf=parse(salon.profile),needed=['logo','cover','address','phone','instagram','city'];
  const metrics={visitors:Number(v?.n||0),tryons:Number(g?.n||0),requests:Number(l?.n||0),dresses:portfolio.length,profile_done:needed.filter(k=>!!pf[k]).length,profile_total:needed.length};
  return J({salon:{...showSalon(salon),subscription:subscriptionState(parse(salon.settings))},portfolio,metrics,url:links(env,salon.slug)});
 }
 if(p==='/api/sales/salons/customers'&&req.method==='GET'){
  const salon=await ownSalon(db,rep,String(u.searchParams.get('slug')||''));
  const offset=Math.min(10000,Math.max(0,Number(u.searchParams.get('offset'))||0));
  const q=String(u.searchParams.get('q')||'').trim().slice(0,80).replace(/[\\%_]/g,'');
  const filter=q?' AND (l.name LIKE ? OR l.phone LIKE ? OR l.look LIKE ?)':'';
  const args=q?[salon.id,'%'+q+'%','%'+q+'%','%'+q+'%']:[salon.id];
  const rows=await many(db,"SELECT l.id,l.name,l.phone,l.telegram,l.look,l.intent,l.note,l.visit_note,l.salon_status,l.status,l.created_at,t.name AS staff FROM leads l LEFT JOIN team t ON t.id=l.staff_id WHERE l.salon_id=?"+filter+' ORDER BY l.created_at DESC,l.id DESC LIMIT 51 OFFSET ?',...args,offset);
  return J({customers:rows.slice(0,50),more:rows.length>50,offset:offset+50,slug:salon.slug});
 }
 if(p==='/api/sales/salons/update'&&post){
  const b=await body(),salon=await ownSalon(db,rep,String(b.slug||'')),name=b.name===undefined?salon.name:clean(b.name,100);
  must(name.length>=2,'نام مزون را بنویسید');
  const profile=updatedProfile(parse(salon.profile),b.profile);
  const stage=b.stage===undefined?salon.stage:String(b.stage);
  must(allowedStages.includes(stage),'وضعیت فروش معتبر نیست');
  const contact=b.contact_name===undefined?salon.contact_name:clean(b.contact_name,90);
  const contactPhone=b.contact_phone===undefined?salon.contact_phone:normalizePhone(b.contact_phone);
  const note=b.note===undefined?salon.note:clean(b.note,2000);
  const next=b.next_followup_at===undefined?salon.next_followup_at:(b.next_followup_at===null||b.next_followup_at===''?null:Number(b.next_followup_at));
  must(next===null||(Number.isInteger(next)&&next>0&&next<4102444800000),'زمان پیگیری معتبر نیست');
  await db.batch([
   db.prepare('UPDATE salons SET name=?,profile=? WHERE id=?').bind(name,JSON.stringify(profile),salon.id),
   db.prepare('UPDATE marketer_salons SET stage=?,contact_name=?,contact_phone=?,note=?,next_followup_at=?,updated_at=? WHERE salon_id=? AND marketer_id=?').bind(stage,contact,contactPhone,note,next,Date.now(),salon.id,rep.id)
  ]);
  return J({ok:true});
 }
 if(p==='/api/sales/salons/upload'&&post){
  const slug=String(req.headers.get('x-salon-slug')||''),kind=String(req.headers.get('x-upload-kind')||'');
  const salon=await ownSalon(db,rep,slug);
  must(['logo','cover','portrait','portfolio'].includes(kind),'نوع تصویر نامعتبر است');
  const ab=await req.arrayBuffer(),bytes=new Uint8Array(ab);
  must(bytes.length<=maxUpload(env),'حجم عکس زیاد است',413);
  const id=await putImage(env,salon,null,kind==='portfolio'?await normalizeDressPhoto(env,bytes):bytes,kind==='portfolio'?'portfolio':'brand');
  if(kind!=='portfolio'){
   const profile={...parse(salon.profile),[kind]:id};
   await exec(db,'UPDATE salons SET profile=? WHERE id=?',JSON.stringify(profile),salon.id);
  }
  return J({ok:true,id,url:'/api/s/'+salon.slug+'/media/'+id});
 }
 if(p==='/api/sales/salons/portfolio'&&post){
  const b=await body(),salon=await ownSalon(db,rep,String(b.slug||'')),ids=[...new Set((Array.isArray(b.media_ids)?b.media_ids:[]).map(String))].slice(0,4);
  must(ids.length>=1,'حداقل یک عکس لباس لازم است');
  for(const id of ids)must(await first(db,"SELECT 1 FROM media WHERE id=? AND salon_id=? AND kind='portfolio'",id,salon.id),'عکس متعلق به این مزون نیست',403);
  const title=clean(b.title,150);must(title.length>=2,'نام لباس را بنویسید');
  const id=uid();
  await exec(db,"INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at,staff_id,media_group,line,look,sizes) VALUES(?,?,?,?,?,?,?,1,1,1,?,NULL,NULL,'dress','',?)",
   id,salon.id,title,'','','',JSON.stringify(ids),Date.now(),JSON.stringify(normalizeDressSizes(b.sizes)));
  return J({ok:true,id});
 }
 if(p==='/api/sales/salons/bot-link'&&post){
  const b=await body(),salon=await ownSalon(db,rep,String(b.slug||''));
  must(salon.approved===1&&salon.bot_link_approved===1,'برای ساخت لینک ربات، تأیید ادمین آینه لازم است',403);
  must(!salon.telegram_chat_id&&!salon.bale_chat_id,'ربات این مزون از قبل وصل است؛ تغییر مدیر فقط با ادمین انجام می‌شود',403);
  return J(await newLinkCode(db,salon,env));
 }
 throw new Problem(404,'مسیر پیدا نشد');
}
