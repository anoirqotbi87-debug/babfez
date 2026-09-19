const fs = require('fs');

let pagePath = 'src/app/[lang]/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');

// Replace services section entirely
const servicesSectionStart = page.indexOf('<section id="services"');
const atoutsSectionStart = page.indexOf('<section id="atouts"');
if (servicesSectionStart > -1 && atoutsSectionStart > -1) {
  const originalServices = page.substring(servicesSectionStart, atoutsSectionStart);

  const newServicesSection = `<section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 mb-4">{dict.services?.title}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">{dict.services?.subtitle}</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Formule 1: À la carte */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.services?.f1Title}</h3>
              <div className="text-3xl font-extrabold text-slate-950 mb-6">{dict.services?.f1Price}</div>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">{dict.services?.f1Desc}</p>
              <ul className="mb-8 space-y-3 flex-1">
                {(dict.services?.f1Bullets || []).map((bullet, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <svg className="w-5 h-5 text-amber-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors mt-auto">
                {dict.contact?.submitBtn}
              </a>
            </div>

            {/* Formule 2: Digitale */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.services?.f2Title}</h3>
              <div className="text-3xl font-extrabold text-amber-600 mb-6">{dict.services?.f2Price}</div>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">{dict.services?.f2Desc}</p>
              <ul className="mb-8 space-y-3 flex-1">
                {(dict.services?.f2Bullets || []).map((bullet, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <svg className="w-5 h-5 text-amber-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors mt-auto">
                {dict.contact?.submitBtn}
              </a>
            </div>

            {/* Formule 3: Sérénité */}
            <div className="bg-slate-950 rounded-3xl p-8 border border-amber-600 shadow-2xl flex flex-col relative transform lg:-translate-y-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white font-bold px-4 py-1 rounded-full text-xs whitespace-nowrap">
                {dict.services?.f3Badge}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{dict.services?.f3Title}</h3>
              <div className="text-3xl font-extrabold text-amber-500 mb-6">{dict.services?.f3Price}</div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed">{dict.services?.f3Desc}</p>
              <ul className="mb-8 space-y-3 flex-1">
                {(dict.services?.f3Bullets || []).map((bullet, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-300">
                    <svg className="w-5 h-5 text-amber-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors shadow-lg mt-auto">
                {dict.contact?.submitBtn}
              </a>
            </div>

            {/* Formule 4: Premium */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 text-white font-bold px-4 py-1 rounded-full text-xs whitespace-nowrap">
                {dict.services?.f4Badge}
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.services?.f4Title}</h3>
              <div className="text-3xl font-extrabold text-slate-950 mb-6">{dict.services?.f4Price}</div>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">{dict.services?.f4Desc}</p>
              <ul className="mb-8 space-y-3 flex-1">
                {(dict.services?.f4Bullets || []).map((bullet, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <svg className="w-5 h-5 text-amber-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors mt-auto">
                {dict.contact?.submitBtn}
              </a>
            </div>
            
          </div>
        </div>
      </section>

      `;
  page = page.replace(originalServices, newServicesSection);
}

// Remove `lang === 'ar'` in page.tsx
page = page.replace(/\{lang === 'ar' \? "[^"]+" : "[^"]+"}/g, match => {
  if (match.includes('جاهزون لمضاعفة')) return '{dict.contact?.heading}';
  if (match.includes('اتركوا لنا بياناتكم')) return '{dict.contact?.subheading}';
  if (match.includes('هذا التقدير مبني')) return '{dict.simulator?.note || dict.home?.simDisclaimer}';
  if (match.includes('لماذا تختارون')) return '{dict.advantages?.title}';
  if (match.includes('خبرة محلية')) return '{dict.advantages?.subtitle}';
  if (match.includes('استمارات الشرطة')) return '{dict.advantages?.f1Title}';
  if (match.includes('نتكفل كلياً')) return '{dict.advantages?.f1Desc}';
  if (match.includes('نظافة فندقية احترافية')) return '{dict.advantages?.f2Title}';
  if (match.includes('فريق نظافة محترف')) return '{dict.advantages?.f2Desc}';
  if (match.includes('تسعير يومي ذكي')) return '{dict.advantages?.f3Title}';
  if (match.includes('خوارزمياتنا تعدل')) return '{dict.advantages?.f3Desc}';
  if (match.includes('استقبال شخصي مباشر')) return '{dict.advantages?.f4Title}';
  if (match.includes('لا نعتمد على الصناديق الباردة')) return '{dict.advantages?.f4Desc}';
  if (match.includes('الأسئلة الشائعة')) return '{dict.faq?.title}';
  if (match.includes('كل ما تحتاجون معرفته')) return '{dict.faq?.subtitle}';
  if (match.includes('هل يمكنني حجز شقتي')) return '{dict.faq?.q1}';
  if (match.includes('نعم، بكل تأكيد')) return '{dict.faq?.a1}';
  if (match.includes('من يتحمل مصاريف')) return '{dict.faq?.q2}';
  if (match.includes('يتحملها المسافر مباشرة')) return '{dict.faq?.a2}';
  if (match.includes('كيف يمكنني متابعة')) return '{dict.faq?.q3}';
  if (match.includes('عبر لوحة تحكم')) return '{dict.faq?.a3}';
  
  return match;
});

// For array properties like atouts map
page = page.replace(
  /\{ title: lang === 'ar' \? "[^"]+" : "[^"]+", desc: lang === 'ar' \? "[^"]+" : "[^"]+", icon: "M9[^}]+}/,
  '{ title: dict.advantages?.f1Title, desc: dict.advantages?.f1Desc, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }'
);
page = page.replace(
  /\{ title: lang === 'ar' \? "[^"]+" : "[^"]+", desc: lang === 'ar' \? "[^"]+" : "[^"]+", icon: "M5 3v4M3[^}]+}/,
  '{ title: dict.advantages?.f2Title, desc: dict.advantages?.f2Desc, icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" }'
);
page = page.replace(
  /\{ title: lang === 'ar' \? "[^"]+" : "[^"]+", desc: lang === 'ar' \? "[^"]+" : "[^"]+", icon: "M13[^}]+}/,
  '{ title: dict.advantages?.f3Title, desc: dict.advantages?.f3Desc, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }'
);
page = page.replace(
  /\{ title: lang === 'ar' \? "[^"]+" : "[^"]+", desc: lang === 'ar' \? "[^"]+" : "[^"]+", icon: "M10\.325[^}]+}/,
  '{ title: dict.advantages?.f4Title, desc: dict.advantages?.f4Desc, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }'
);

page = page.replace(
  /\{ q: lang === 'ar' \? "[^"]+" : "[^"]+", a: lang === 'ar' \? "[^"]+" : "[^"]+" \},/,
  '{ q: dict.faq?.q1, a: dict.faq?.a1 },'
);
page = page.replace(
  /\{ q: lang === 'ar' \? "[^"]+" : "[^"]+", a: lang === 'ar' \? "[^"]+" : "[^"]+" \},/,
  '{ q: dict.faq?.q2, a: dict.faq?.a2 },'
);
page = page.replace(
  /\{ q: lang === 'ar' \? "[^"]+" : "[^"]+", a: lang === 'ar' \? "[^"]+" : "[^"]+" \}/,
  '{ q: dict.faq?.q3, a: dict.faq?.a3 }'
);

fs.writeFileSync(pagePath, page);

// Update Footer.tsx
let footerPath = 'src/components/Footer.tsx';
let footer = fs.readFileSync(footerPath, 'utf8');

footer = footer.replace(
  /\{isAr \? "شريككم المتميز[^"]+" : "Votre partenaire[^"]+"\}/g,
  "{dict.footer?.slogan}"
);
footer = footer.replace(
  /\{isAr \? "فاس، المغرب" : "Fès, Maroc"\}/g,
  "{dict.footer?.badge || 'Fès, Maroc'}"
);
footer = footer.replace(
  /\{isAr \? "خدماتنا" : "Nos Services"\}/g,
  "{dict.footer?.servicesTitle}"
);
footer = footer.replace(
  /\{isAr \? "روابط سريعة" : "Navigation"\}/g,
  "{dict.footer?.navTitle}"
);
footer = footer.replace(
  /\{isAr \? "التواصل والمداومة" : "Contact \& Permanence"\}/g,
  "{dict.footer?.contactTitle}"
);
footer = footer.replace(
  /\{isAr \? "الإدارة الشاملة" : "Gestion Sérénité"\}/g,
  "{dict.services?.f3Title}"
);
footer = footer.replace(
  /\{isAr \? "الإدارة الرقمية" : "Gestion Digitale"\}/g,
  "{dict.services?.f2Title}"
);
footer = footer.replace(
  /\{isAr \? "خدمات حسب الطلب" : "Services à la carte"\}/g,
  "{dict.services?.f1Title}"
);
footer = footer.replace(
  /\{isAr \? "تقييم مجاني" : "Estimation gratuite"\}/g,
  "{dict.nav?.estimateBtn}"
);
footer = footer.replace(
  /\{isAr \? "الرئيسية" : "Accueil"\}/g,
  "{dict.nav?.home || 'Accueil'}"
);
footer = footer.replace(
  /\{isAr \? "عقاراتنا" : "Nos Logements"\}/g,
  "{dict.nav?.properties}"
);
footer = footer.replace(
  /\{isAr \? "فضاء المالك" : "Espace Propriétaire"\}/g,
  "{dict.nav?.ownerSpace}"
);
footer = footer.replace(
  /\{isAr \? "الأسئلة الشائعة" : "FAQ"\}/g,
  "{dict.nav?.faq || 'FAQ'}"
);
footer = footer.replace(
  /\{isAr \? "فاس، المغرب \(المدينة القديمة والجديدة\)" : "Fès, Maroc \(Médina & Ville Nouvelle\)"\}/g,
  "{dict.footer?.address}"
);
footer = footer.replace(
  /\{isAr \? "7 أيام \/ 7 — 24 ساعة للطوارئ" : "7j\/7 — 24h\/24 pour les urgences"\}/g,
  "{dict.footer?.availability}"
);
footer = footer.replace(
  /\{isAr \? "إدارة النظام 🔒" : "🔒 Admin"\}/g,
  "{dict.footer?.admin || '🔒 Admin'}"
);
footer = footer.replace(
  /\{isAr \? "الشروط القانونية" : "Mentions légales"\}/g,
  "{dict.footer?.legal}"
);
footer = footer.replace(
  /\{isAr \? "سياسة الخصوصية" : "Politique de confidentialité"\}/g,
  "{dict.footer?.privacy}"
);
footer = footer.replace(
  /\{isAr \? "الشروط العامة" : "Conditions Générales"\}/g,
  "{dict.footer?.tos}"
);
footer = footer.replace(
  /\{isAr \? "© 2026 باب فاس للكونسيرج. جميع الحقوق محفوظة." : "© 2026 BABFEZ Conciergerie. Tous droits réservés."\}/g,
  "{dict.footer?.copyright}"
);

fs.writeFileSync(footerPath, footer);

// I should also ensure 'home' is added to 'nav' and 'admin' is added to 'footer' in JSON
// But 'Accueil' and 'FAQ' already have fallback in code above.
