'use client';

import { useState, useEffect, useCallback } from 'react';

interface ApkDownloadModalProps {
  lang?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const content = {
  fr: {
    badge: 'Application Officielle BABFEZ',
    title: "Téléchargez l'application BABFEZ pour Android",
    subtitle: 'Fichier APK officiel signé • 1.05 Mo • Installation directe & sécurisée',
    downloadBtn: "Télécharger l'APK (1.05 Mo)",
    guideTitle: "Guide d'installation rapide en 3 étapes :",
    step1: "1. Si Android affiche « Fichier potentiellement dangereux », cliquez sans crainte sur « Télécharger quand même » (notre application est vérifiée).",
    step2: "2. Une fois le téléchargement terminé, ouvrez le fichier babfez.apk depuis vos notifications ou votre dossier Téléchargements.",
    step3: "3. Si demandé, autorisez l'installation d'applications depuis votre navigateur.",
    closeBtn: 'Fermer',
  },
  en: {
    badge: 'Official BABFEZ Application',
    title: 'Download BABFEZ Android App',
    subtitle: 'Official signed APK package • 1.05 MB • Direct & secure installation',
    downloadBtn: 'Download APK (1.05 MB)',
    guideTitle: 'Quick 3-step installation guide:',
    step1: "1. If your browser displays 'File might be harmful', click 'Download anyway' with confidence.",
    step2: '2. Once downloaded, open babfez.apk from your notifications or Downloads folder.',
    step3: '3. Allow app installation from this browser if prompted by Android.',
    closeBtn: 'Close',
  },
  es: {
    badge: 'Aplicación Oficial BABFEZ',
    title: 'Descargue la aplicación BABFEZ para Android',
    subtitle: 'Paquete APK oficial firmado • 1.05 MB • Instalación directa y segura',
    downloadBtn: 'Descargar APK (1.05 MB)',
    guideTitle: 'Guía rápida de instalación en 3 pasos:',
    step1: "1. Si Android muestra 'Es posible que el archivo sea dañino', pulse 'Descargar de todos modos'.",
    step2: '2. Abra babfez.apk desde sus notificaciones o carpeta de descargas.',
    step3: '3. Autorice la instalación de aplicaciones desde este navegador si se le solicita.',
    closeBtn: 'Cerrar',
  },
  ar: {
    badge: 'التطبيق الرسمي لباب فاس',
    title: 'تحميل تطبيق BABFEZ لنظام أندرويد',
    subtitle: 'ملف APK رسمي وموقع • 1.05 ميغابايت • تثبيت مباشر وآمن',
    downloadBtn: 'تحميل ملف APK (1.05 ميغابايت)',
    guideTitle: 'دليل التثبيت السريع في 3 خطوات:',
    step1: '1. إذا ظهر تنبيه أندرويد «قد يكون الملف ضاراً»، اضغط بكل ثقة على «تنزيل على أي حال».',
    step2: '2. بمجرد اكتمال التنزيل، افتح ملف babfez.apk من الإشعارات أو مجلد التنزيلات.',
    step3: '3. اسمح بتثبيت التطبيقات من هذا المتصفح إذا طلب منك النظام ذلك.',
    closeBtn: 'إغلاق',
  },
};

export default function ApkDownloadModal({
  lang = 'fr',
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: ApkDownloadModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isAr = lang === 'ar';
  const t = content[lang as keyof typeof content] || content.fr;

  const isControlled = controlledIsOpen !== undefined;
  const isVisible = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
      try {
        localStorage.setItem('babfez_apk_modal_dismissed', 'true');
      } catch {}
    }
  }, [isControlled, controlledOnClose]);

  useEffect(() => {
    // 1. Ne rien faire si on est déjà en mode PWA/TWA standalone
    const isStandalone =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        (navigator as any).standalone === true ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=apk') ||
        sessionStorage.getItem('babfez_is_installed_app') === 'true');

    if (isStandalone) {
      sessionStorage.setItem('babfez_is_installed_app', 'true');
      return;
    }

    // 2. Écouter l'événement global pour déclenchement manuel
    const handleOpenEvent = () => setInternalIsOpen(true);
    window.addEventListener('babfez:open-apk-modal', handleOpenEvent);

    // 3. Détection automatique : uniquement sur mobile/Android et si jamais fermé
    if (!isControlled) {
      try {
        const isDismissed = localStorage.getItem('babfez_apk_modal_dismissed');
        if (!isDismissed) {
          const ua = navigator.userAgent || '';
          const isMobileOrAndroid =
            /android/i.test(ua) ||
            /iPhone|iPad|iPod|Mobile/i.test(ua) ||
            window.innerWidth < 768;

          if (isMobileOrAndroid) {
            const timer = setTimeout(() => {
              setInternalIsOpen(true);
            }, 1800);
            return () => {
              clearTimeout(timer);
              window.removeEventListener('babfez:open-apk-modal', handleOpenEvent);
            };
          }
        }
      } catch {}
    }

    return () => {
      window.removeEventListener('babfez:open-apk-modal', handleOpenEvent);
    };
  }, [isControlled]);

  // Fermer sur appui de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-lg bg-[#0B2545] text-white rounded-2xl border border-[#C59B27]/40 shadow-2xl p-6 sm:p-8 flex flex-col gap-5 overflow-hidden transition-all ${
          isAr ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lueur d'ambiance dorée */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Bouton de Fermeture ergonomique (>= 44x44px) */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:text-[#C59B27] transition-all focus:outline-none focus:ring-2 focus:ring-[#C59B27]"
          aria-label={t.closeBtn}
        >
          <span className="text-xl font-bold leading-none">✕</span>
        </button>

        {/* En-tête : Badge or & Logo */}
        <div className="flex items-center gap-3 pr-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-[#C59B27]/40 flex-shrink-0 shadow-inner">
            <img
              src="/icons/logo.svg"
              alt="BABFEZ"
              width={38}
              height={38}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/icon-192.png';
              }}
            />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C59B27]/20 text-[#C59B27] border border-[#C59B27]/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              {t.badge}
            </span>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              BABFEZ Conciergerie • Fès
            </p>
          </div>
        </div>

        {/* Titre & Sous-titre */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {t.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Bouton Principal de Téléchargement */}
        <a
          href="/downloads/babfez.apk"
          download="babfez.apk"
          onClick={handleClose}
          className="w-full bg-[#C59B27] hover:bg-[#d8ab2e] text-[#0B2545] font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-base group"
        >
          <span className="text-xl group-hover:translate-y-0.5 transition-transform">📥</span>
          <span>{t.downloadBtn}</span>
        </a>

        {/* Guide succinct en 3 points */}
        <div className="bg-black/25 rounded-xl p-4 border border-white/5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
            {t.guideTitle}
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
