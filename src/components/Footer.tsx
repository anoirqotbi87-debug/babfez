import Link from 'next/link';
import { CONTACT_INFO } from "@/config/site";

export default function Footer({ lang, dict }: { lang: string, dict: any }) {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-slate-950 pt-20 pb-8 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Colonne 1 : Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{isAr ? "شريككم المتميز لإدارة الكراء القصير الأمد والكونسيرج الخاص." : "Votre partenaire d'excellence pour la gestion locative courte durée et la conciergerie privée."}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300">
              📍 {isAr ? "فاس، المغرب" : "Fès, Maroc"}
            </div>
          </div>

          {/* Colonne 2 : Services */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{isAr ? "خدماتنا" : "Nos Services"}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{isAr ? "الإدارة الشاملة" : "Gestion Sérénité"}</a></li>
              <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{isAr ? "الإدارة الرقمية" : "Gestion Digitale"}</a></li>
              <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{isAr ? "خدمات حسب الطلب" : "Services à la carte"}</a></li>
              <li><a href={`/${lang}/#simulateur`} className="hover:text-amber-500 transition-colors text-amber-600 font-medium">{isAr ? "تقييم مجاني" : "Estimation gratuite"}</a></li>
            </ul>
          </div>

          {/* Colonne 3 : Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{isAr ? "روابط سريعة" : "Navigation"}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${lang}`} className="hover:text-amber-500 transition-colors">{isAr ? "الرئيسية" : "Accueil"}</Link></li>
              <li><Link href={`/${lang}/reserver`} className="hover:text-amber-500 transition-colors">{isAr ? "عقاراتنا" : "Nos Logements"}</Link></li>
              <li><Link href={`/${lang}/proprietaire/login`} className="hover:text-amber-500 transition-colors">{isAr ? "فضاء المالك" : "Espace Propriétaire"}</Link></li>
              <li><a href={`/${lang}/#faq`} className="hover:text-amber-500 transition-colors">{isAr ? "الأسئلة الشائعة" : "FAQ"}</a></li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{isAr ? "التواصل والمداومة" : "Contact & Permanence"}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{isAr ? "فاس، المغرب (المدينة القديمة والجديدة)" : "Fès, Maroc (Médina & Ville Nouvelle)"}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{isAr ? "7 أيام / 7 — 24 ساعة للطوارئ" : "7j/7 — 24h/24 pour les urgences"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 border-t border-slate-800 pt-8 pb-12 md:pb-0">
          <div className="flex gap-4">
            <Link href={`/${lang}/admin/login`} className="opacity-40 hover:opacity-100 hover:text-amber-500 transition-all font-bold" title="Administration">{isAr ? "إدارة النظام 🔒" : "🔒 Admin"}</Link>
            <Link href={`/${lang}/mentions-legales`} className="hover:text-amber-500 transition-colors">{isAr ? "الشروط القانونية" : "Mentions légales"}</Link>
            <Link href={`/${lang}/confidentialite`} className="hover:text-amber-500 transition-colors">{isAr ? "سياسة الخصوصية" : "Politique de confidentialité"}</Link>
            <Link href={`/${lang}/conditions-generales`} className="hover:text-amber-500 transition-colors">{isAr ? "الشروط العامة" : "Conditions Générales"}</Link>
          </div>
          <div className="flex items-center gap-2">
            {isAr ? "© 2026 باب فاس للكونسيرج. جميع الحقوق محفوظة." : "© 2026 BABFEZ Conciergerie. Tous droits réservés."}
          </div>
        </div>
      </div>
    </footer>
  );
}
