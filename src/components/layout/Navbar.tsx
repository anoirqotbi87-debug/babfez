"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import ApkDownloadModal from "@/components/ui/ApkDownloadModal";
import { CONTACT_INFO } from "@/config/site";

interface NavbarProps {
  lang: string;
  dict: any;
  showReserveButton?: boolean;
}

export default function Navbar({ lang, dict, showReserveButton = true }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const isAr = lang === "ar";

  const closeDrawer = () => setIsDrawerOpen(false);

  // Labels multilingues garantis
  const labels = {
    home: dict.nav?.home || (isAr ? "الرئيسية" : lang === "en" ? "Home" : lang === "es" ? "Inicio" : "Accueil"),
    reserver: dict.nav?.properties || (isAr ? "حجز" : lang === "en" ? "Book" : lang === "es" ? "Reservar" : "Réserver"),
    services: dict.nav?.services || (isAr ? "العروض والأسعار" : lang === "en" ? "Plans & Pricing" : lang === "es" ? "Planes y Tarifas" : "Formules & Tarifs"),
    simulator: dict.nav?.simulator || (isAr ? "حاسبة المداخيل" : lang === "en" ? "Simulator" : lang === "es" ? "Simulador" : "Simulateur"),
    about: dict.nav?.advantages || (isAr ? "من نحن" : lang === "en" ? "About" : lang === "es" ? "Sobre nosotros" : "Atouts"),
    contact: dict.nav?.contact || (isAr ? "اتصل بنا" : lang === "en" ? "Contact" : lang === "es" ? "Contacto" : "Contact"),
    estimateBtn: dict.nav?.estimateBtn || (isAr ? "تقييم عقاري" : lang === "en" ? "Estimate My Property" : lang === "es" ? "Estimar mi propiedad" : "Estimer mon bien"),
    whatsappDirect: isAr ? "واتساب مباشر" : lang === "en" ? "WhatsApp Direct" : lang === "es" ? "WhatsApp Directo" : "WhatsApp Direct",
    ownerSpace: dict.nav?.ownerSpace || (isAr ? "فضاء المالك" : lang === "en" ? "Owner Portal" : lang === "es" ? "Área de Propietarios" : "Espace Propriétaire"),
    subtitle: dict.nav?.subtitle || "Conciergerie Privée • Fès",
    installApk: isAr ? "تحميل تطبيق أندرويد (APK)" : lang === "en" ? "Install Android App (APK)" : lang === "es" ? "Instalar App Android (APK)" : "Installer l'app Android (APK)",
  };

  const navLinks = [
    { label: labels.home, href: `/${lang}` },
    { label: labels.reserver, href: `/${lang}/reserver`, highlight: true },
    { label: labels.services, href: `/${lang}/#services` },
    { label: labels.simulator, href: `/${lang}/#simulateur` },
    { label: labels.about, href: `/${lang}/#atouts` },
    { label: labels.contact, href: `/${lang}/#contact` },
  ];

  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("navigated_to_home", "true");
    }
    closeDrawer();
  };

  const handleOpenApkModal = () => {
    closeDrawer();
    setIsApkModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B2545]/95 backdrop-blur-md border-b border-[#C59B27]/20 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
          
          {/* Logo BABFEZ Officiel Cliquable */}
          <Link 
            href={`/${lang}`} 
            onClick={handleHomeClick}
            className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
            aria-label="BABFEZ Accueil"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-[#C59B27]/40 shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/icons/logo.svg"
                alt="Logo BABFEZ"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/icon-192.png";
                }}
              />
            </div>
            <div>
              <span className={`text-xl sm:text-2xl font-black tracking-tight text-white block leading-none ${isAr ? "" : "font-serif"}`}>
                BABFEZ
              </span>
              <span className="text-[10px] text-[#C59B27] font-bold tracking-widest uppercase block mt-1">
                {labels.subtitle}
              </span>
            </div>
          </Link>

          {/* Liens de Navigation Desktop Directs */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link 
              href={`/${lang}`} 
              onClick={handleHomeClick} 
              className="text-sm font-medium text-slate-200 hover:text-[#C59B27] transition-colors"
            >
              {labels.home}
            </Link>
            {showReserveButton && (
              <Link 
                href={`/${lang}/reserver`} 
                className="text-sm font-black bg-[#C59B27] hover:bg-[#d8ab2e] text-[#0B2545] px-3.5 py-1.5 rounded-lg shadow-sm transition-all hover:scale-105"
              >
                🔑 {labels.reserver}
              </Link>
            )}
            <a href={`/${lang}/#services`} className="text-sm font-medium text-slate-200 hover:text-[#C59B27] transition-colors">
              {labels.services}
            </a>
            <a href={`/${lang}/#simulateur`} className="text-sm font-medium text-slate-200 hover:text-[#C59B27] transition-colors">
              {labels.simulator}
            </a>
            <a href={`/${lang}/#atouts`} className="text-sm font-medium text-slate-200 hover:text-[#C59B27] transition-colors">
              {labels.about}
            </a>
            <a href={`/${lang}/#contact`} className="text-sm font-medium text-slate-200 hover:text-[#C59B27] transition-colors">
              {labels.contact}
            </a>
            <Link 
              href={`/${lang}/proprietaire/login`} 
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#C59B27]/50 flex items-center gap-1.5 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>{labels.ownerSpace}</span>
            </Link>
          </nav>

          {/* Contrôles & Bouton Burger Ergonomique */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Langue & Devise */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-xl border border-white/10">
              <LanguageSwitcher currentLang={lang} theme="dark" />
              <div className="h-4 w-px bg-white/20"></div>
              <CurrencySwitcher theme="dark" />
            </div>

            {/* Bouton Réserver Direct (Tablette & Desktop compact) */}
            {showReserveButton && (
              <Link 
                href={`/${lang}/reserver`} 
                className="hidden md:inline-flex xl:hidden items-center gap-1.5 text-xs font-black bg-[#C59B27] hover:bg-[#d8ab2e] text-[#0B2545] px-3 py-2 rounded-xl transition-all shadow-sm"
              >
                <span>🔑</span>
                <span>{labels.reserver}</span>
              </Link>
            )}

            {/* Bouton Hamburger Ergonomique (Min 44x44px, 3 barres horizontales blanc & or) */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all shadow-md border border-[#C59B27]/40 focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={isDrawerOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <span className="h-[2.5px] w-6 bg-white rounded-full"></span>
                <span className="h-[2.5px] w-6 bg-[#C59B27] rounded-full"></span>
                <span className="h-[2.5px] w-6 bg-white rounded-full"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Panneau Déroulant Mobile / Drawer Élégant (Bleu Impérial #0B2545 & Or #C59B27) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn" role="dialog" aria-modal="true">
            {/* Backdrop sombre flouté */}
            <div 
              className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
              onClick={closeDrawer}
            />

            <div className={`fixed inset-y-0 ${isAr ? "left-0" : "right-0"} max-w-full flex`}>
              <div className="w-screen max-w-md bg-[#0B2545] text-white shadow-2xl flex flex-col justify-between border-l border-[#C59B27]/30 overflow-y-auto">
                
                {/* En-tête du Tiroir */}
                <div className="p-6 border-b border-[#C59B27]/20 flex items-center justify-between bg-black/20">
                  <Link 
                    href={`/${lang}`} 
                    onClick={handleHomeClick}
                    className="flex items-center gap-3 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-[#C59B27]/40 shadow-inner">
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
                      <span className={`text-xl font-black text-white block leading-none ${isAr ? "" : "font-serif"}`}>
                        BABFEZ
                      </span>
                      <span className="text-[10px] text-[#C59B27] font-bold tracking-widest uppercase block mt-1">
                        {labels.subtitle}
                      </span>
                    </div>
                  </Link>

                  {/* Bouton Fermer (Min 44x44px) */}
                  <button
                    onClick={closeDrawer}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-[#C59B27]/40 flex items-center justify-center text-white text-xl font-bold transition-colors shadow-sm focus:outline-none"
                    aria-label="Fermer le menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Contenu : Liens de Navigation Tactiles (>= 48px) */}
                <div className="px-6 py-6 space-y-2 flex-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#C59B27] block mb-3 px-1">
                    {isAr ? "التنقل السريع" : "Navigation"}
                  </span>

                  <nav className="space-y-1.5">
                    {navLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        onClick={closeDrawer}
                        className={`text-base sm:text-lg font-medium py-3.5 px-4 rounded-xl flex items-center justify-between border-b border-white/5 transition-all min-h-[48px] ${
                          link.highlight 
                            ? "bg-[#C59B27]/20 text-[#C59B27] font-bold hover:bg-[#C59B27]/30" 
                            : "text-white hover:text-[#C59B27] hover:bg-white/5"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span className="text-sm opacity-60">
                          {isAr ? "←" : "→"}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Boutons d'Action en Bas de Menu */}
                <div className="p-6 border-t border-[#C59B27]/20 bg-black/25 space-y-3">
                  {/* Bouton APK Téléchargement */}
                  <button
                    type="button"
                    onClick={handleOpenApkModal}
                    className="w-full bg-white/10 hover:bg-white/20 text-[#C59B27] border border-[#C59B27]/40 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all min-h-[44px]"
                  >
                    <span>📱</span>
                    <span>{labels.installApk}</span>
                  </button>

                  {/* 1. Bouton Principal : Estimer mon bien */}
                  <a
                    href={`/${lang}/#simulateur`}
                    onClick={closeDrawer}
                    className="w-full bg-[#C59B27] hover:bg-[#d8ab2e] text-[#0B2545] py-3.5 px-4 rounded-xl font-bold shadow-md flex items-center justify-center text-center text-base transition-all active:scale-[0.98] min-h-[48px]"
                  >
                    📊 {labels.estimateBtn}
                  </a>

                  {/* 2. Bouton Secondaire : WhatsApp Direct */}
                  <a
                    href={CONTACT_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeDrawer}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md text-base transition-all active:scale-[0.98] min-h-[48px]"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>{labels.whatsappDirect}</span>
                  </a>

                  {/* 3. Bouton Espace Propriétaire avec Cadenas */}
                  <Link
                    href={`/${lang}/proprietaire/login`}
                    onClick={closeDrawer}
                    className="w-full text-slate-300 hover:text-white py-2 text-center text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                  >
                    <svg className="w-4 h-4 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span>{labels.ownerSpace}</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modale Téléchargement APK autonome */}
      <ApkDownloadModal
        lang={lang}
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </>
  );
}
