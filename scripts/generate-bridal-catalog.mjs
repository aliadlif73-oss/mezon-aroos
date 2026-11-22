import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import sharp from 'sharp';
import {MIX_COLLECTION,MIX_KEYS} from '../worker/bridal-mix.js';

const apiKey=process.env.KIE_API_KEY;
if(!apiKey)throw Error('KIE_API_KEY missing from GitHub Actions secrets');
const out='public/bridal-mix',base='https://api.kie.ai';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const specs={
 bodice:[
  'ONLY the torso corset, chest to upper hips: ivory fitted boned corset with hand-appliqued 3D floral lace over visible corset structure; floral lace is the unmistakable hero.',
  'ONLY the torso corset, chest to upper hips: minimalist unembellished ivory duchess satin corset with clean tailored princess seams and smooth structured panels, zero lace.',
  'ONLY the torso corset, chest to upper hips: richly luminous fine small pearls and microcrystal embroidery covering shaped ivory fitted corset; no flowers.',
  'ONLY the torso corset, chest to upper hips: sculptural ruched ivory satin boned corset with elegant diagonal pleated folds and cinched waist; no lace or pearls.'
 ],
 skirt:[
  'ONLY the skirt, waist to floor: extremely full princess ballgown skirt, enormous bell-shaped volume made of multiple soft plain ivory tulle layers, no lace.',
  'ONLY the skirt, waist to floor: fitted ivory satin mermaid silhouette clinging to hips and thighs and flaring unmistakably and dramatically from knees; full shape must be visible.',
  'ONLY the skirt, waist to floor: pure ivory matte crepe A-line skirt widening gently from natural waist to hem in a smooth restrained triangle, no tiers.',
  'ONLY the skirt, waist to floor: four distinctly separate ivory organza tulle waterfall tiers cascading from waist to hem, romantic layered flounces.'
 ],
 sleeves:[
  'ONLY shoulder and arm, shoulder to wrist: elegant long fitted sheer illusion tulle sleeve with white floral lace embroidery across arm and refined narrow wrist cuff.',
  'ONLY shoulder and arm, shoulder to wrist: large puffy sheer tulle sleeve with very full puffed shoulder and delicate gathered fitted wrist; unembellished airy net.',
  'ONLY shoulder and upper arm: unmistakably bare sleeveless ivory bridal bodice armhole, no sleeve at all, natural skin shoulders and bare upper arm visible. This must look visibly different from long sleeves.',
  'ONLY shoulder and arm, shoulder to wrist: long ivory chiffon bell sleeve fitted at upper arm, spreading dramatically at elbow into free-flowing flared cuffs at wrist; NOT puffed at shoulder.'
 ],
 neckline:[
  'ONLY the front neckline, collarbones to mid bust: sweetheart neckline with clear symmetrical double curved lobes and gently dipped central heart notch.',
  'ONLY the front neckline, collarbones to mid bust: precise square neckline with straight horizontal neckline edge and sharp right-angle corners to medium-width straps.',
  'ONLY the front neckline, collarbones to mid bust: elegant V neckline with two perfectly straight diagonal edges converging at one central point, modest V depth.',
  'ONLY the front neckline, collarbones to mid bust: wide shallow boat/bateau neckline spanning shoulder to shoulder over collarbones, high continuous gently curved horizontal neckline, NO V or square shape.'
 ]};
const framing={
 bodice:'Close-up fashion photo of only the bridal CORSET and waist; cut off head and skirt; background neutral. Show boning seams, fabric texture and fitted bust.',
 skirt:'Vertical fashion reference photo of only the SKIRT from natural waist to floor, enough framing to make the silhouette obvious; NO head, no arms and no corset.',
 sleeves:'Close-up fashion photo of only the LEFT ARM and shoulder down to cuff, arm bent slightly, sleeve design is 85% of composition; crop out face and skirt.',
 neckline:'Front-facing close-up fashion photo focused ONLY on the NECKLINE at the collarbones and upper chest; face cropped above chin, no arms or skirt.'
};
const shared='Ultra photorealistic premium bridal design catalog photograph, editorial e-commerce style, luxury bridal atelier, anonymous adult bridal model, neutral warm ivory studio plaster backdrop, diffuse bright softbox lighting, realistic high quality ivory-white fabrics, exact tailoring geometry, balanced centered 4:5 vertical portrait composition, 85mm editorial lens, exceptional macro clothing detail, beautiful subtle shadows, physically possible sewing, clean timeless quiet luxury, 2K detail. Same studio light, camera treatment, ivory tone and background in ALL 16 images. Depict exactly ONE garment design only. No text, logos, watermarks, collage, jewelry distractions, people in background, distorted limbs or dress elements unrelated to selected category. Distinct and recognizable style.';
const items=MIX_KEYS.flatMap(kind=>MIX_COLLECTION[kind].map((item,i)=>({kind,i,label:item[0],description:item[1],detail:specs[kind][i]})));
if(items.length!==16||items.some(i=>!i.detail))throw Error('Expected exactly 16 unique component prompts');
await mkdir(out,{recursive:true});
async function kie(url,body){
 const r=await fetch(base+url,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+apiKey,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000)});
 const j=await r.json().catch(()=>({}));if(!r.ok||j.code!==200)throw Error('KIE HTTP '+r.status+' code '+j.code+': '+String(j.msg||'unknown').slice(0,130));
 return j.data||{};
}
async function generate(item){
 const prompt=shared+'\n\nCROP REQUIREMENT: '+framing[item.kind]+'\n\nTARGET DESIGN: '+item.detail+'\n\nDetailed construction to match: '+item.description+'. Maintain strict body-part composition. Only this specific option.';
 const create=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input:{prompt,image_input:[],aspect_ratio:'4:5',resolution:'2K',output_format:'png'}});
 if(!create.taskId)throw Error('KIE returned no task ID');
 console.log('KIE started '+item.kind+'-'+item.i);
 let result;
 for(let n=0;n<110;n++){
  await new Promise(r=>setTimeout(r,Math.min(13000,5000+n*200)));
  const state=await kie('/api/v1/jobs/recordInfo?taskId='+encodeURIComponent(create.taskId));
  if(state.state==='fail')throw Error('KIE generation failed: '+String(state.failMsg||'unknown').slice(0,120));
  if(state.state==='success'){result=typeof state.resultJson==='string'?JSON.parse(state.resultJson):state.response;break}
 }
 if(!result)throw Error('Timed out, task ID '+create.taskId);
 const url=result.resultUrls?.[0];
 if(typeof url!=='string'||!url.startsWith('https://'))throw Error('KIE result image URL invalid');
 const res=await fetch(url,{signal:AbortSignal.timeout(60000)});
 if(!res.ok)throw Error('Cannot download KIE output '+res.status);
 const input=Buffer.from(await res.arrayBuffer());
 if(input.length<25000||input.length>25000000)throw Error('Invalid image byte length');
 const img=sharp(input,{failOn:'error'});const meta=await img.metadata();
 if(!['png','jpeg','webp'].includes(meta.format)||meta.width<1100||meta.height<1300)throw Error('Image resolution not acceptable '+meta.width+'x'+meta.height);
 const file=out+'/'+item.kind+'-'+item.i+'.webp';
 const data=await img.rotate().webp({quality:90,effort:5}).toBuffer();await writeFile(file,data);
 console.log('Saved '+file+' '+meta.width+'x'+meta.height+' '+data.length+' bytes');
 return {kind:item.kind,index:item.i,label:item.label,file,width:meta.width,height:meta.height};
}
let n=0,completed=[],errors=[];
async function work(){while(n<items.length){const item=items[n++],file=out+'/'+item.kind+'-'+item.i+'.webp';try{
 if(existsSync(file)){const meta=await sharp(file).metadata();if(meta.width>=1100&&meta.height>=1300){completed.push({kind:item.kind,index:item.i,label:item.label,file,width:meta.width,height:meta.height});continue}}
 completed.push(await generate(item));
 }catch(e){console.error(item.kind+'-'+item.i+': '+e.message);errors.push(item.kind+'-'+item.i+': '+e.message)}}}
await Promise.all([work(),work(),work()]);
completed.sort((a,b)=>MIX_KEYS.indexOf(a.kind)-MIX_KEYS.indexOf(b.kind)||a.index-b.index);
await writeFile(out+'/manifest.json',JSON.stringify({model:'nano-banana-pro',resolution:'2K',aspect_ratio:'4:5',generated_at:new Date().toISOString(),items:completed},null,2)+'\n');
if(errors.length){console.error('Failed '+errors.length+' of 16: '+errors.join('; '));process.exitCode=1}
else console.log('Success: 16 KIE-generated images saved to '+out);
