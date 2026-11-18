import test from 'node:test';
import assert from 'node:assert/strict';
import {customerHTML} from '../worker/customer.js';
import {PHOTO_CHECK_JS} from '../worker/pairing.js';

test('the salon gallery entry ALWAYS shows QR pairing on mobile, tablet and kiosk',()=>{
 const html=customerHTML;
 assert.match(html,/function pickNow\(\)\{openPhonePair\(\)\}/);
 assert.match(html,/onclick:pickNow,html:ICO\.gallery\+'<span>انتخاب از گالری گوشی \(QR\)<\/span>'/);
 assert.doesNotMatch(html,/function pickNow\(\)\{if\(DESK\)/);
 assert.doesNotMatch(html,/id:'pick',class:'sr-only'/);
 assert.doesNotMatch(html,/for:'pick'/);
 assert.doesNotMatch(html,/var pick=\$\('#pick'\)/);
 assert.doesNotMatch(html,/drop\.addEventListener\('drop'/);
});

test('the salon camera remains available and does not fall back to the old gallery picker',()=>{
 const html=customerHTML;
 assert.match(html,/onclick:openCamera,html:ICO\.camera/);
 assert.match(html,/function kioskCamera\(\)/);
 assert.match(html,/var DESK=KIOSK\|\|isTablet\(\)/);
 assert.match(html,/capture:'environment'/);
 assert.match(html,/if\(!navigator\.mediaDevices\|\|!navigator\.mediaDevices\.getUserMedia\)\{openCamera\(\);return\}/);
 assert.match(html,/handleFile\(cam\.files&&cam\.files\[0\],'original'\)/);
});

test('QR upload lands in this visitor session, photo is checked, polling stops on close',()=>{
 const html=customerHTML;
 assert.match(html,/api\('pair',\{v:VISITOR\}\)/);
 assert.match(html,/api\('pair\/check\?seen='/);
 assert.match(html,/if\(d\.state==='received'\)\{stop\(\);closeSheet\(\);acceptPhoto\(d\.media_id\)/);
 assert.match(html,/pairDialog\.addEventListener\('close',stop,\{once:true\}\)/);
 assert.match(html,/QR را با گوشی مشتری اسکن کنید/);
 assert.match(html,/عکس خودکار روی همین نمایشگر مزون ظاهر می‌شود/);
 assert.match(html,/function acceptPhoto\(id\)/);
 assert.match(PHOTO_CHECK_JS,/function checkPhoto\(img\)/);
});
