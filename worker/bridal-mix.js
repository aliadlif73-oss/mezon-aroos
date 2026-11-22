// Bridal dress composition starter collection. Each element has an exact, independent
// tailoring description, not a claim that the boutique physically stocks the result.
export const MIX_COLLECTION={
 bodice:[
  ['کرست دانتل گلدار','fitted bridal corset bodice in ivory, with delicate dimensional floral lace appliques and visible internal boning, opaque lining'],
  ['بالاتنه ساتن ساده','structured ivory duchess-satin boned bodice, smooth uninterrupted panels, clean and minimalist tailoring'],
  ['بالاتنه مرواریدی','fitted ivory wedding bodice with dense tiny pearl and crystal hand embroidery, delicate luminous texture']
 ],
 skirt:[
  ['دامن پرنسسی','very full ivory ball-gown skirt with multiple layers of finely gathered tulle from the waist to the floor, no separate embroidery'],
  ['دامن ماهی','fitted ivory mermaid skirt hugging the hips and thighs, flaring dramatically from the knees, smooth satin'],
  ['دامن آ‌لاین','flowing ivory A-line skirt in matte crepe, softly expanding from natural waist to floor, subtle movement']
 ],
 sleeves:[
  ['آستین دانتل بلند','two fitted full-length illusion-tulle sleeves with ivory floral lace motifs, reaching the wrists'],
  ['آستین پفی تور','two airy transparent tulle puff sleeves gathered at the upper arms and tapering at the wrists'],
  ['بدون آستین','sleeveless construction; shoulders and upper arms visible, no sleeve fabric']
 ],
 neckline:[
  ['یقه دلبری','structured sweetheart neckline with a gently curved heart-shaped top edge'],
  ['یقه مربعی','elegant moderately open square neckline with crisp geometrical corners'],
  ['یقه هفت','refined V-shaped neckline with opaque supportive construction, moderate depth']
 ]
};
export const MIX_KEYS=Object.keys(MIX_COLLECTION);
export function validMix(parts){
 return !!parts&&typeof parts==='object'&&!Array.isArray(parts)&&MIX_KEYS.every(k=>Number.isInteger(parts[k])&&parts[k]>=0&&parts[k]<MIX_COLLECTION[k].length);
}
export function mixPrompt(parts){
 if(!validMix(parts))throw new Error('Invalid dress composition');
 const detail=MIX_KEYS.map(k=>k.toUpperCase()+': '+MIX_COLLECTION[k][parts[k]][1]).join('\n');
 return `Create ONE photorealistic full-body bridal gown try-on photograph using the uploaded photograph of the customer as the ONLY person reference.
This is a bespoke CONCEPT VISUALIZATION created by combining FOUR specific selected dress design elements, not a photograph of an existing finished garment.
\nDESIGN COMPONENTS (must all appear, harmonized into one manufacturable outfit):\n${detail}
\nCRITICAL: Keep the exact person's face, recognizable facial structure, skin tone, hairstyle, head proportions, body shape, height, natural posture, hands and fingers. Do not beautify, slim, alter anatomy, change age or replace the person. Keep consistent camera angle, perspective and realistic shadows; depict the entire dress and feet inside the frame. Match waist seams, fabric transitions, sleeve attachment and neckline construction naturally. Preserve the specific silhouette of selected skirt and neckline. No extra person, no mannequin, no text, no watermark. Make the mixed gown ivory. The result is an illustrative design proposal: do not promise physical fit, availability or tailoring feasibility.`;
}
