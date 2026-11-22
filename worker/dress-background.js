// Standardize the boutique's mannequin photographs without generating a new dress.
// Cloudflare Images segments the subject and fills the removed area with warm greige.
// Never silently substitute an unprocessed photo: dress detail and safety matter more
// than completing the wizard when the image processor is unavailable.
export const DRESS_STUDIO_BG='#77716D';
// Return the original valid image if optional background segmentation is unavailable.
// The registration flow must never lose a dress just because image processing fails.
export async function normalizeDressPhoto(env,originalBytes){
 if(!(originalBytes instanceof Uint8Array)||originalBytes.length<100)
  throw new Error('عکس ارسالی معتبر نیست.');
 // Preserve JPEG/PNG/WebP bytes unchanged if the Cloudflare Images binding is absent.
 const validJPEG=originalBytes[0]===0xff&&originalBytes[1]===0xd8&&originalBytes[2]===0xff;
 const validPNG=originalBytes[0]===0x89&&originalBytes[1]===0x50&&originalBytes[2]===0x4e&&originalBytes[3]===0x47;
 const validWebP=String.fromCharCode(...originalBytes.slice(0,4))==='RIFF'&&String.fromCharCode(...originalBytes.slice(8,12))==='WEBP';
 if(!validJPEG&&!validPNG&&!validWebP)throw new Error('فرمت عکس ارسالی معتبر نیست.');
 if(!env.IMAGES||typeof env.IMAGES.input!=='function'){
  console.warn('dress background normalization skipped: IMAGES binding unavailable');
  return originalBytes;
 }
 try{
  const mime=validPNG?'image/png':validWebP?'image/webp':'image/jpeg';
  const source=new Response(originalBytes,{headers:{'Content-Type':mime}}).body;
  const result=await env.IMAGES.input(source)
   .transform({segment:'foreground',background:DRESS_STUDIO_BG})
   .output({format:'image/jpeg',quality:95})
   .response();
  if(!result.ok)throw new Error('Images '+result.status);
  const bytes=new Uint8Array(await result.arrayBuffer());
  if(bytes.length<100||bytes[0]!==0xff||bytes[1]!==0xd8||bytes[2]!==0xff)
   throw new Error('Unexpected output format');
  return bytes;
 }catch(err){
  console.error('dress background normalization failed; original photo retained',String(err?.message||err).slice(0,160));
  return originalBytes;
 }
}
