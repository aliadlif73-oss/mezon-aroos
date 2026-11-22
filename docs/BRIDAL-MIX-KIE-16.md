# آینه | راهنمای تولید ۱۶ تصویر مرجع با KIE

## هدف و استاندارد مشترک
چهار تصویر مستقل برای هر یک از چهار دسته «بالاتنه»، «دامن»، «آستین» و «یقه» در بخش «لباس انتخابی من».

- مدل API: `nano-banana-pro`
- رزولوشن: `2K`
- ابعاد نسبی: `4:5`
- قالب تولید: PNG؛ فایل سایت: WebP کیفیت ۹۰
- کادر: فقط عضو انتخابی لباس؛ سایر اجزا بیرون قاب یا کم‌اهمیت
- صحنه: آتلیه روشن گرم با بک‌گراند عاجی بدون شلوغی، نور نرم یکسان، جزئیات پارچه واقعی
- تطابق: نام، شرح خیاطی و تصویر هر کارت باید دقیقاً مطابق باشند

## پرامپت مشترک
> Ultra photorealistic premium bridal design catalog photograph, editorial e-commerce style, luxury bridal atelier, anonymous adult bridal model, neutral warm ivory studio plaster backdrop, diffuse bright softbox lighting, realistic high quality ivory-white fabrics, exact tailoring geometry, balanced centered 4:5 vertical portrait composition, 85mm editorial lens, exceptional macro clothing detail, beautiful subtle shadows, physically possible sewing, clean timeless quiet luxury, 2K detail. Same studio light, camera treatment, ivory tone and background in ALL 16 images. Depict exactly ONE garment design only. No text, logos, watermarks, collage, jewelry distractions, people in background, distorted limbs or dress elements unrelated to selected category. Distinct and recognizable style.

## ۱. بالاتنه (فقط از سینه تا بالای باسن)
1. **کرست دانتل گلدار**: Ivory fitted boned corset, visible vertical boning channels, dimensional hand-appliqued ivory floral lace.
2. **بالاتنه ساتن ساده**: Minimalist ivory duchess-satin structured corset, smooth princess seams, absolutely no embroidery or lace.
3. **بالاتنه مرواریدی**: Precisely fitted ivory corset covered with delicate luminous tiny pearl and microcrystal hand beading, no floral lace.
4. **بالاتنه پلیسه**: Sculptural ivory corset, diagonal satin pleated folds across the torso and clean cinched waist, no pearls.

## ۲. دامن (فقط از کمر تا زمین، فرم کامل قابل تشخیص)
1. **دامن پرنسسی**: Extremely voluminous pure ivory multilayer ball gown, graceful bell silhouette, light tulle, no lace.
2. **دامن ماهی**: Fitted satin mermaid skirt tight from waist through knees, dramatic flair from the knees to floor.
3. **دامن A-Line**: Minimalist matte crepe A-line skirt, soft natural waist to hem triangle silhouette, smooth, no tiers.
4. **دامن طبقه‌ای**: Four distinctly separate flowing layers of bridal organza and tulle, tiered waterfall silhouette.

## ۳. آستین (فقط شانه تا مچ؛ بدون تصویر صورت)
1. **آستین دانتل بلند**: Fitted full-length translucent illusion-tulle sleeve with detailed ivory floral embroidery.
2. **آستین پفی تور**: Airy sheer tulle sleeve with obvious balloon volume at shoulder and gathered fitted wrist.
3. **بدون آستین**: Fully bare shoulder and upper arm with clean bridal armhole, no sleeves, no shoulder ruffles.
4. **آستین کلوش**: Slim upper arm and elbow, widening into dramatic light chiffon bell cuff at wrist, not puffy at shoulder.

## ۴. یقه (فقط استخوان ترقوه تا میانه سینه)
1. **یقه دلبری**: Sweetheart neckline with two visibly curved lobes and central heart notch.
2. **یقه مربعی**: Architectural neckline, straight top edge, 90-degree corners, two moderate straps.
3. **یقه هفت**: Two clear straight diagonal edges meeting as a modest V.
4. **یقه قایقی**: Wide shallow bateau neckline sweeping from shoulder to shoulder, horizontal gentle curve, neither V nor square.

## نحوه اجرا
پرامپت‌های کامل، جزئیات زاویه دوربین و محدودیت‌های بصری هر تصویر در `scripts/generate-bridal-catalog.mjs` هستند. از محیط امن GitHub Actions، کلید `KIE_API_KEY` خوانده شده و **۱۶ تسک مستقل KIE** ارسال می‌شود. هر خروجی از نظر سلامت تصویر و حداقل اندازه بررسی و پس از تبدیل به WebP با نام `public/bridal-mix/<category>-<index>.webp` ثبت می‌شود.

**نکته مهم:** بدون وجود کلید `KIE_API_KEY` در Repository secrets، اجرا متوقف می‌شود و تصویری تولید یا منتشر نخواهد شد. رمز را در کد یا چت قرار ندهید. مسیر امن: GitHub repository → Settings → Secrets and variables → Actions → New repository secret؛ نام باید دقیقاً `KIE_API_KEY` باشد. پس از آن اجرای دستی workflow **Generate bridal mix reference photos via KIE** از تب Actions مجاز است. پس از تولید ۱۶ فایل و بازبینی، PR مربوطه در main ادغام و سایت اصلی deploy خواهد شد.

## شرط انتشار
تا وقتی `manifest.json` حاوی ۱۶ تصویر معتبر نباشد و تصاویر برچسب و کادرشان تأیید نشوند، کد گالری به سایت اصلی منتقل نمی‌شود تا هیچ عکس ناقصی جایگزین نمونه‌های فعلی نشود.
