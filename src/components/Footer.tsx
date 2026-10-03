import Link from 'next/link';
import { CONTACT_INFO } from "@/config/site";

export default function Footer({ lang, dict }: { lang: string, dict: any }) {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-[#2D3748] pt-20 pb-8 border-t border-stone-800 text-stone-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-6">
            <Link 
              href={`/${lang}`} 
              onClick={() => {
                if (typeof window !== "undefined") sessionStorage.setItem("navigated_to_home", "true");
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0B2545] p-1 flex items-center justify-center border border-[#C59B27]/40 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/icons/logo.svg"
                  alt="Logo BABFEZ"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.src = "/icon-192.png"; }}
                />
              </div>
              <div>
                <span className={`text-xl font-extrabold tracking-tight text-white group-hover:text-[#C59B27] transition-colors block leading-tight ${isAr ? '' : 'font-serif'}`}>BABFEZ</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">{dict.footer?.slogan}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#292524] text-xs font-bold text-stone-300 border border-stone-800">
              📍 {dict.footer?.badge || 'Fès, Maroc'}
            </div>
          </div>

          {/* Colonne 2 : Services */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.servicesTitle}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={`/${lang}/#services`} className="hover:text-[#A1C0BA] transition-colors">{dict.services?.f3Title}</a></li>
              <li><a href={`/${lang}/#services`} className="hover:text-[#A1C0BA] transition-colors">{dict.services?.f2Title}</a></li>
              <li><a href={`/${lang}/#services`} className="hover:text-[#A1C0BA] transition-colors">{dict.services?.f1Title}</a></li>
              <li><a href={`/${lang}/#simulateur`} className="hover:text-[#A1C0BA] transition-colors text-[#6F8E88] font-bold">{dict.nav?.estimateBtn}</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.navTitle}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${lang}`} className="hover:text-[#A1C0BA] transition-colors">{dict.nav?.home || 'Accueil'}</Link></li>
              <li><Link href={`/${lang}/reserver`} className="hover:text-[#A1C0BA] transition-colors">{dict.nav?.properties}</Link></li>
              <li><Link href={`/${lang}/proprietaire/login`} className="hover:text-[#A1C0BA] transition-colors">{dict.nav?.ownerSpace}</Link></li>
              <li><a href={`/${lang}/#faq`} className="hover:text-[#A1C0BA] transition-colors">{dict.nav?.faq || 'FAQ'}</a></li>
              <li className="android-app-only-hide">
                <a 
                  href="/downloads/babfez.apk" 
                  download="babfez.apk" 
                  className="inline-flex items-center gap-1.5 font-bold text-[#6F8E88] hover:text-[#A1C0BA] transition-colors"
                >
                  <span>📱</span>
                  <span>
                    {lang === 'ar' 
                      ? 'تحميل تطبيق أندرويد (APK)' 
                      : lang === 'es' 
                      ? 'Descargar App Android (APK)' 
                      : lang === 'en' 
                      ? 'Download Android App (APK)' 
                      : "Télécharger l'App Android (APK)"}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.contactTitle}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#6F8E88] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{dict.footer?.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#6F8E88] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#6F8E88] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#6F8E88] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{dict.footer?.availability}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 border-t border-stone-800 pt-8 pb-12 md:pb-0">
          <div className="flex gap-4">
            <Link href={`/${lang}/admin/login`} className="opacity-40 hover:opacity-100 hover:text-[#A1C0BA] transition-all font-bold" title="Administration">{dict.footer?.admin || '🔒 Admin'}</Link>
            <Link href={`/${lang}/mentions-legales`} className="hover:text-[#A1C0BA] transition-colors">{dict.footer?.legal}</Link>
            <Link href={`/${lang}/confidentialite`} className="hover:text-[#A1C0BA] transition-colors">{dict.footer?.privacy}</Link>
            <Link href={`/${lang}/conditions-generales`} className="hover:text-[#A1C0BA] transition-colors">{dict.footer?.tos}</Link>
          </div>
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} BABFEZ. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
