const fs = require('fs');

let pagePath = 'src/app/[lang]/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');

const servicesSectionStart = page.indexOf('<section id="services"');
const atoutsSectionStart = page.indexOf('<section id="atouts"');
const servicesSectionEnd = atoutsSectionStart;

const newServicesSection = `<section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 mb-4">{dict.services?.title}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">{dict.services?.subtitle}</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Formule 1: À la carte */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.services?.f1Title}</h3>
              <div className="text-3xl font-extrabold text-slate-950 mb-6">{dict.services?.f1Price}</div>
              <p className="text-slate-600 mb-6 font-medium">{dict.services?.f1Desc}</p>
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
              <p className="text-slate-600 mb-6 font-medium">{dict.services?.f2Desc}</p>
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
              <p className="text-slate-300 mb-6 font-medium">{dict.services?.f3Desc}</p>
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
              <p className="text-slate-600 mb-6 font-medium">{dict.services?.f4Desc}</p>
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

      {/* 5. Atouts (Pourquoi BABFEZ) */}`;

page = page.substring(0, servicesSectionStart) + newServicesSection + page.substring(atoutsSectionStart + 35); // +35 to remove the exact `{/* 5. Atouts ...` string to avoid duplication, wait I'll just substring from atoutsSectionStart and let it keep its comment if I replace it carefully. Let's just use replace on the string.
