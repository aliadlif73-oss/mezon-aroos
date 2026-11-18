import test from 'node:test';
import assert from 'node:assert/strict';
import {customerHTML} from '../worker/customer.js';
import {PHOTO_CHECK_JS} from '../worker/pairing.js';

test('kiosk gallery button opens phone QR pairing while the camera remains available',()=>{
  const html=customerHTML;
  assert.match(html,/function pickNow\(\)\{if\(DESK\)\{openPhonePair\(\);return\}/);
  assert.match(html,/onclick:pickNow,html:ICO\.gallery/);
  assert.match(html,/انتخاب از گالری گوشی \(QR\)/);
  assert.match(html,/onclick:openCamera,html:ICO\.camera/);
  assert.match(html,/function kioskCamera\(\)/);
  assert.match(html,/var DESK=KIOSK\|\|isTablet\(\)/);
});
test('QR upload is delivered to the same kiosk visitor session and polling stops on close',()=>{
  const html=customerHTML;
  assert.match(html,/api\('pair',\{v:VISITOR\}\)/);
  assert.match(html,/api\('pair\/check\?seen='/);
  assert.match(html,/if\(d\.state==='received'\)\{stop\(\);closeSheet\(\);acceptPhoto\(d\.media_id\)/);
  assert.match(html,/pairDialog\.addEventListener\('close',stop,\{once:true\}\)/);
  assert.match(html,/QR را با گوشی مشتری اسکن کنید/);
  assert.match(html,/عکس خودکار روی همین نمایشگر مزون ظاهر می‌شود/);
});
test('mobile QR page supports selecting a photograph from gallery',()=>{
  const html=PHOTO_CHECK_JS;
  assert.match(html,/function checkPhoto\(img\)/);
});
