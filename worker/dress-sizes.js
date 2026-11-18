// Available physical dress sizes, not the AI body's estimated size.
export const DRESS_SIZES=['34','36','38','40','42','44','46','48','50','52','54','56','F'];
export const SIZE_LABEL=s=>s==='F'?'فری‌سایز':String(s);
export function normalizeDressSizes(value){
 const source=Array.isArray(value)?value:typeof value==='string'?value.split(/[,،\s]+/):[];
 const seen=new Set;
 for(const entry of source){const s=String(entry||'').trim().replace(/[۰-۹]/g,x=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x))).replace(/[٠-٩]/g,x=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(x)));if(DRESS_SIZES.includes(s))seen.add(s)}
 return DRESS_SIZES.filter(s=>seen.has(s));
}
export const parseDressSizes=value=>{try{return normalizeDressSizes(JSON.parse(value||'[]'))}catch{return []}};
export const SIZE_OPTIONS=DRESS_SIZES.map(value=>({value,label:SIZE_LABEL(value)}));
