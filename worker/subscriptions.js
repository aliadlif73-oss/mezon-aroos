// Single subscription contract shared by customer, owner and marketer APIs.
// A sales opportunity marked "won" is not proof of payment: only the platform
// administrator can explicitly activate a subscription and grant photo credits.
export const PLAN_MONTHS={one:1,three:3,six:6};
export function addPlanMonths(timestamp,months){
 const dt=new Date(timestamp),day=dt.getUTCDate();
 dt.setUTCDate(1);dt.setUTCMonth(dt.getUTCMonth()+months);
 const last=new Date(Date.UTC(dt.getUTCFullYear(),dt.getUTCMonth()+1,0)).getUTCDate();
 dt.setUTCDate(Math.min(day,last));return dt.getTime();
}
export function subscriptionState(settings,now=Date.now()){
 const x=settings?.subscription;
 if(!x||!PLAN_MONTHS[x.plan_id]||!Number.isFinite(x.starts_at)||!Number.isFinite(x.expires_at))return {active:false,plan_id:null,expires_at:null,mix_enabled:false};
 const active=x.starts_at<=now&&now<x.expires_at&&x.status==='active';
 return {active,plan_id:x.plan_id,starts_at:x.starts_at,expires_at:x.expires_at,mix_enabled:active&&(x.plan_id==='three'||x.plan_id==='six')};
}
export function mixAllowed(settings,now=Date.now()){return subscriptionState(settings,now).mix_enabled}
