// Standardize the boutique's mannequin photographs without generating a new dress.
// Cloudflare Images segments the subject and fills the removed area with warm greige.
// Never silently substitute an unprocessed photo: dress detail and safety matter more
// than completing the wizard when the image processor is unavailable.
export const DRESS_STUDIO_BG='#77716D';
export async function normalizeDressPhoto(env,originalBytes){
 if(!env.IMAGES||typeof env.IMAGES.input!=='function')
  throw new Error('سرویس یکسان‌سازی پس‌زمینه فعال نیست؛ تیم آینه باید تنظیمات Cloudflare Images را بررسی کند.');
 if(!(originalBytes instanceof Uint8Array)||originalBytes.length<100)
  throw new Error('عکس ارسالی معتبر نیست.');
 try{
  const source=new Response(originalBytes,{headers:{'Content-Type':'image/jpeg'}}).body;
  const result=await env.IMAGES.input(source)
   .transform({segment:'foreground',background:DRESS_STUDIO_BG})
   .output({format:'image/webp',quality:94})
   .response();
  if(!result.ok)throw new Error('Images '+result.status);
  const bytes=new Uint8Array(await result.arrayBuffer());
  if(bytes.length<100||bytes[0]!==0x52||bytes[1]!==0x49||bytes[2]!==0x46||bytes[3]!==0x46)
   throw new Error('Unexpected output format');
  return bytes;
 }catch(err){
  console.error('dress background normalization failed',String(err?.message||err).slice(0,160));
  throw new Error('حذف پس‌زمینهٔ عکس انجام نشد؛ لطفاً همین زاویه را دوباره ارسال کنید یا به پشتیبانی آینه خبر دهید.');
 }
}
