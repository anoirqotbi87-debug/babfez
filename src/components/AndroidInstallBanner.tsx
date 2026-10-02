'use client';

import { useState, useEffect } from 'react';

interface AndroidInstallBannerProps {
  lang?: string;
}

export default function AndroidInstallBanner({ lang = 'fr' }: AndroidInstallBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('babfez_android_banner_dismissed');
    if (isDismissed === 'true') {
      return;
    }

    // Detect Android or mobile user agent
    const ua = navigator.userAgent || '';
    const isAndroid = /android/i.test(ua);
    setIsAndroidDevice(isAndroid);

    // Show banner on Android by default, or on any mobile screen
    const isMobile = isAndroid || /iPhone|iPad|iPod|Mobile/i.test(ua) || window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('babfez_android_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  const content = {
    fr: {
      title: "Installez l'application Android BABFEZ",
      subtitle: "APK officiel signé • 1.05 Mo • Accès direct plein écran",
      btn: "Télécharger l'APK",
      helpBtn: "Conseil d'installation",
      modalTitle: "Installation sécurisée de l'application BABFEZ",
      modalIntro: "Fichier officiel BABFEZ vérifié et signé cryptographiquement.",
      modalStep1: "1. Si Android affiche l'alerte « Fichier potentiellement dangereux », cliquez en toute confiance sur « Télécharger quand même ».",
      modalStep2: "2. Une fois le fichier babfez.apk téléchargé, ouvrez-le depuis vos notifications ou votre dossier Téléchargements.",
      modalStep3: "3. Si demandé, autorisez l'installation d'applications depuis votre navigateur Chrome / Samsung Internet.",
      modalClose: "J'ai compris"
    },
    en: {
      title: "Install BABFEZ Android App",
      subtitle: "Official signed APK • 1.05 MB • Fast full-screen access",
      btn: "Download APK",
      helpBtn: "Install guide",
      modalTitle: "Safe installation of BABFEZ App",
      modalIntro: "Official cryptographically signed BABFEZ package.",
      modalStep1: "1. If your browser displays 'File might be harmful', click 'Download anyway'.",
      modalStep2: "2. Open babfez.apk from your notifications or Downloads folder.",
      modalStep3: "3. Allow installation from unknown sources for this browser if prompted.",
      modalClose: "Got it"
    },
    es: {
      title: "Instala la app Android BABFEZ",
      subtitle: "APK oficial firmado • 1.05 MB • Acceso rápido",
      btn: "Descargar APK",
      helpBtn: "Guía de instalación",
      modalTitle: "Instalación segura de la app BABFEZ",
      modalIntro: "Archivo oficial firmado criptográficamente por BABFEZ.",
      modalStep1: "1. Si Android muestra 'Es posible que el archivo sea dañino', pulse 'Descargar de todos modos'.",
      modalStep2: "2. Abra babfez.apk desde descargas.",
      modalStep3: "3. Autorice la instalación desde este navegador si se le solicita.",
      modalClose: "Entendido"
    },
    ar: {
      title: "تثبيت تطبيق أندرويد باب فاس",
      subtitle: "تطبيق رسمي موقع • 1.05 ميغابايت • تجربة سريعة وكاملة",
      btn: "تحميل APK",
      helpBtn: "إرشادات التثبيت",
      modalTitle: "تثبيت آمن لتطبيق باب فاس",
      modalIntro: "ملف رسمي أصلي وموقع رقمياً لحماية بياناتك.",
      modalStep1: "1. إذا ظهر تنبيه «قد يكون الملف ضاراً»، اضغط بكل ثقة على «تنزيل على أي حال».",
      modalStep2: "2. بعد اكتمال التنزيل، افتح الملف babfez.apk من التنزيلات.",
      modalStep3: "3. قم بتفعيل إذن التثبيت من هذا المصدر في إعدادات الهاتف.",
      modalClose: "فهمت ذلك"
    }
  };

  const t = content[lang as keyof typeof content] || content.fr;
  const isRtl = lang === 'ar';

  return (
    <>
      {/* Top Smart Banner */}
      <aside 
        aria-label="Application Android BABFEZ"
        dir={isRtl ? 'rtl' : 'ltr'} 
        className="relative z-40 bg-[#0B2545] text-white border-b-2 border-[#C59B27]/40 shadow-lg px-3 py-2.5 sm:px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo / Android Icon & Text */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-[#C59B27]/40 flex items-center justify-center shrink-0 text-[#C59B27] shadow-inner">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Android robot icon */}
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1523-.5676.416.416 0 00-.5676.1523l-2.0223 3.503C15.5902 8.4126 13.8533 8.0818 12 8.0818s-3.5902.3308-5.1366.8682L4.841 5.447a.416.416 0 00-.5677-.1523.416.416 0 00-.1522.5676l1.9972 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
              </svg>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-white truncate block">
                  {t.title}
                </span>
                <span className="bg-[#C59B27] text-[#0B2545] font-black text-[9px] uppercase px-1.5 py-0.2 rounded font-mono">
                  APK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Actions: Download + Info + Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white underline decoration-dotted py-1 px-1.5 transition-colors"
              title={t.helpBtn}
            >
              <svg className="w-3.5 h-3.5 text-[#C59B27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.helpBtn}</span>
            </button>

            <a
              href="/downloads/babfez.apk"
              download="babfez.apk"
              onClick={() => {
                // Show help modal on download click if mobile Android
                if (isAndroidDevice) {
                  setTimeout(() => setShowHelpModal(true), 800);
                }
              }}
              className="inline-flex items-center gap-1.5 bg-[#C59B27] hover:bg-[#B38920] text-white text-xs sm:text-sm font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md shadow-[#C59B27]/30 transform active:scale-95"
            >
              <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{t.btn}</span>
            </a>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Fermer"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Installation Guide Modal */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-[#0B2545] shadow-2xl border-2 border-[#C59B27]/30 relative animate-scaleUp">
            
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0B2545] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-[#C59B27] flex items-center justify-center mb-4 shadow-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h3 className="text-lg font-black text-[#0B2545] mb-2">
              {t.modalTitle}
            </h3>
            
            <p className="text-xs text-slate-600 font-medium mb-4">
              {t.modalIntro}
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-xs text-slate-700 font-medium leading-relaxed">
              <p>{t.modalStep1}</p>
              <p>{t.modalStep2}</p>
              <p>{t.modalStep3}</p>
            </div>

            <div className="flex gap-2">
              <a
                href="/downloads/babfez.apk"
                download="babfez.apk"
                onClick={() => setShowHelpModal(false)}
                className="flex-1 text-center bg-[#C59B27] text-white font-black py-3 rounded-xl hover:bg-[#B38920] transition-all text-xs uppercase tracking-wider shadow-md"
              >
                {t.btn}
              </a>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {t.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
