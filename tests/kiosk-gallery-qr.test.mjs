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
 assert.match(html,/api\('pair\/check\?code='/);
 assert.match(html,/if\(d\.state==='received'&&d\.media_id\)\{stop\(\);closeSheet\(\);acceptPhoto\(d\.media_id\)/);
 assert.match(html,/panel\.isConnected&&pairDialog\.open/);
 assert.match(html,/QR را با گوشی مشتری اسکن کنید/);
 assert.match(html,/عکس خودکار روی همین نمایشگر مزون ظاهر می‌شود/);
 assert.match(html,/function acceptPhoto\(id\)/);
 assert.match(PHOTO_CHECK_JS,/function checkPhoto\(img\)/);
});


test('finish fitting is available for every screen size and advances to a fresh customer',()=>{
 const html=customerHTML;
 assert.match(html,/finishFittingControl\(\);\s*if\(KIOSK\)kioskBoot\(\)/);
 assert.match(html,/function finishFittingControl\(\)/);
 assert.match(html,/text:'پایان پرو'/);
 assert.match(html,/text:'پایان پرو و مشتری بعدی'/);
 assert.match(html,/api\('finish',\{v:VISITOR\}\)/);
 assert.match(html,/location\.replace\(location\.pathname\+'\?next=1'/);
 assert.doesNotMatch(html,/location\.replace\(location\.pathname\+'\?kiosk=1&next=1'/);
 assert.match(html,/if\(!nextCustomerFlow\(\)\)welcomeFlow\(\{kiosk:true\}\)/);
 assert.match(html,/else if\(!nextCustomerFlow\(\)&&DESK/);
 assert.match(html,/openOtp\(function\(\)\{go\(1\)\}\)/);
});
