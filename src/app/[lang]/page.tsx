"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { CONTACT_INFO } from "@/config/site";
import Footer from "@/components/Footer";
import AndroidInstallBanner from "@/components/AndroidInstallBanner";
import { FES_MARKET_DATA } from "@/config/market-pricing";

const dicts = { fr, en, es, ar };

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const baseDict = dicts[lang as keyof typeof dicts] || dicts.fr;
  const dict: any = {
    ...dicts.fr,
    ...baseDict,
    nav: { ...dicts.fr.nav, ...(baseDict as any).nav },
    hero: { ...(dicts.fr as any).hero, ...(baseDict as any).hero },
    simulator: { ...(dicts.fr as any).simulator, ...(baseDict as any).simulator },
    services: { ...(dicts.fr as any).services, ...(baseDict as any).services },
    contact: { ...(dicts.fr as any).contact, ...(baseDict as any).contact },
    booking: { ...(dicts.fr as any).booking, ...(baseDict as any).booking },
    modal: { ...(dicts.fr as any).modal, ...(baseDict as any).modal },
    home: { ...(dicts.fr as any).home, ...(baseDict as any).home },
    reserver: { ...(dicts.fr as any).reserver, ...(baseDict as any).reserver },
    proprietaire: { ...(dicts.fr as any).proprietaire, ...(baseDict as any).proprietaire },
    footer: { ...(dicts.fr as any).footer, ...(baseDict as any).footer },
    sim: { ...(dicts.fr as any).sim, ...(baseDict as any).sim },
    form: { ...(dicts.fr as any).form, ...(baseDict as any).form },
    login: { ...(dicts.fr as any).login, ...(baseDict as any).login }
  };

  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Routage direct de l'APK vers l'Espace Propriétaire (Login)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search || "";
      const isApkSource = search.includes("source=apk");
      const isAndroidApp = document.referrer.includes("android-app://");
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
      const hasExplicitlyNavigatedHome = sessionStorage.getItem("navigated_to_home") === "true";

      if ((isApkSource || isAndroidApp || isStandalone) && !hasExplicitlyNavigatedHome) {
        router.replace(`/${lang}/proprietaire/login?source=apk`);
      }
    }
  }, [lang, router]);
  
  // Simulator State - 100% Réactif & Intelligence de Marché Fès
  const [zone, setZone] = useState<"ville_nouvelle" | "medina" | "immouzzer">("ville_nouvelle");
  const [propertyType, setPropertyType] = useState<"appartement" | "riad" | "villa">("appartement");
  const [rooms, setRooms] = useState<"studio" | "1" | "2" | "3" | "4" | "5" | "6+">("2");
  const [occupancyRate, setOccupancyRate] = useState<number>(68);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Animation visuelle d'analyse IA en direct (600 ms)
  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [zone, propertyType, rooms, occupancyRate]);

  // Récupération des données réelles du marché de Fès
  const marketData = FES_MARKET_DATA[zone]?.[propertyType]?.[rooms] || FES_MARKET_DATA["ville_nouvelle"]["appartement"]["2"];
  const occupiedNights = Math.round(30 * (occupancyRate / 100));
  const monthlyGross = Math.round(occupiedNights * marketData.adr);
  const monthlyNet = Math.round(monthlyGross * 0.80); // après déduction de la commission de gestion BABFEZ de 20%
  const annualGross = monthlyGross * 12;
  const longTermComp = marketData.longTermRent;
  const gainPercentage = Math.round(((monthlyNet - longTermComp) / longTermComp) * 100);
  const lowSeasonNet = Math.round(monthlyNet * 0.75);
  const highSeasonNet = Math.round(monthlyNet * 1.35);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quartier: "Ville Nouvelle / Atlas",
    typeBien: "Appartement",
    surface: "",
    formule: dict.services?.f3Title || "Gestion Sérénité",
    message: "",
    rgpd: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSimulateToForm = () => {
    const zoneLabel = zone === "medina" ? "Médina / Riad" : zone === "ville_nouvelle" ? "Ville Nouvelle / Atlas" : "Route d'Immouzzer";
    const typeLabel = propertyType === "appartement" ? "Appartement" : propertyType === "riad" ? "Riad" : "Villa";
    
    setFormData({
      ...formData,
      quartier: zoneLabel,
      typeBien: typeLabel,
      message: `Simulation personnalisée : ${monthlyGross.toLocaleString('fr-FR')} MAD/mois brut (~${monthlyNet.toLocaleString('fr-FR')} MAD net) pour ${rooms === 'studio' ? 'un studio' : rooms + ' chambres'} à ${zoneLabel} (vs loyer classique ${longTermComp.toLocaleString('fr-FR')} MAD).`
    });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const text = `Bonjour BABFEZ, je suis ${formData.name}. Je souhaite un audit technique et financier pour mon bien :
- Quartier: ${formData.quartier}
- Type: ${formData.typeBien}
- Surface: ${formData.surface ? formData.surface + ' m²' : 'Non spécifié'}
- Formule: ${formData.formule}
- Email: ${formData.email}
${formData.message ? `\nMessage: ${formData.message}` : ''}`;
    
    try {
      // 1. Sauvegarde asynchrone sécurisée dans la table Supabase `leads`
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          zone: formData.quartier,
          property_type: formData.typeBien,
          formula: formData.formule,
          message: formData.message,
        })
      });
      
      // 2. Retour visuel de succès
      setSubmitSuccess(true);
      
      // 3. Redirection WhatsApp direct avec message prérempli
      window.open(`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(text)}`, '_blank');
      
      // 4. Réinitialisation
      setFormData({ name: "", email: "", phone: "", quartier: "", typeBien: "", surface: "", formule: dict.services?.f3Title || "Gestion Sérénité", message: "", rgpd: false });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Une erreur est survenue lors de l'envoi de la demande. Veuillez réessayer ou nous contacter sur WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] font-sans selection:bg-[#B85D36] selection:text-white">
      {/* 1. Header & Navigation Fixe Haut de Gamme */}
      <header className="fixed w-full top-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7DDD3] transition-all">
        <AndroidInstallBanner lang={lang} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#B85D36] to-[#A04E2B] rounded-xl flex items-center justify-center text-[#D4AF37] shadow-md shadow-[#B85D36]/25 group-hover:scale-105 transition-transform border border-[#C59B27]/40">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <span className={`text-2xl font-black tracking-tight text-[#1C1917] block leading-tight ${isAr ? '' : 'font-serif'}`}>BAB<span className="text-[#B85D36]">FEZ</span></span>
              <span className="text-[10px] text-[#78716C] font-bold tracking-widest uppercase block">{dict.nav?.subtitle || "Conciergerie & Intendance Privée"}</span>
            </div>
          </Link>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#simulateur" className="text-sm font-semibold text-[#44403C] hover:text-[#B85D36] transition-colors">{dict.nav.simulator}</a>
            <a href="#services" className="text-sm font-semibold text-[#44403C] hover:text-[#B85D36] transition-colors">{dict.nav.services}</a>
            <a href="#atouts" className="text-sm font-semibold text-[#44403C] hover:text-[#B85D36] transition-colors">{dict.nav.advantages}</a>
            <a href="#faq" className="text-sm font-semibold text-[#44403C] hover:text-[#B85D36] transition-colors">{dict.nav.faq}</a>
            <Link href={`/${lang}/reserver`} className="text-sm font-bold text-[#B85D36] bg-[#B85D36]/10 px-3.5 py-1.5 rounded-full border border-[#B85D36]/30 hover:bg-[#B85D36] hover:text-white transition-all">{dict.nav.properties}</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <LanguageSwitcher currentLang={lang} />
              <div className="h-4 w-px bg-[#E7DDD3]"></div>
              <CurrencySwitcher />
            </div>

            <a 
              href="/downloads/babfez.apk" 
              download="babfez.apk" 
              className="android-app-only-hide hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-[#B85D36] bg-[#B85D36]/10 hover:bg-[#B85D36] hover:text-white px-3 py-2 rounded-xl border border-[#B85D36]/30 transition-all shadow-sm"
              title="Télécharger l'application Android BABFEZ (APK)"
            >
              <span>📱</span>
              <span>App Android</span>
            </a>
            
            <Link href={`/${lang}/proprietaire/login`} className="flex items-center gap-2 text-sm font-bold text-[#44403C] bg-white border border-[#E7DDD3] hover:border-[#B85D36] hover:text-[#B85D36] px-4 py-2.5 rounded-xl transition-all shadow-warm">
              <svg className="w-4 h-4 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              {dict.nav.ownerSpace}
            </Link>

            <a href={`/${lang}/#simulateur`} className="bg-gradient-to-r from-[#B85D36] to-[#A04E2B] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#B85D36]/20 hover:brightness-105 transition-all">
              {dict.nav.estimateBtn}
            </a>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <CurrencySwitcher />
            <div className="h-4 w-px bg-[#E7DDD3]"></div>
            <LanguageSwitcher currentLang={lang} />
            <button className="text-[#1C1917] ml-1 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu Mobile">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E7DDD3] px-4 py-5 space-y-4 shadow-xl">
            <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#44403C] hover:text-[#B85D36]">{dict.nav.simulator}</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#44403C] hover:text-[#B85D36]">{dict.nav.services}</a>
            <a href="#atouts" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#44403C] hover:text-[#B85D36]">{dict.nav.advantages}</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#44403C] hover:text-[#B85D36]">{dict.nav.faq}</a>
            <Link href={`/${lang}/reserver`} onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#B85D36]">{dict.nav.properties}</Link>
            <Link href={`/${lang}/proprietaire/login`} onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#1C1917]">{dict.nav.ownerSpace}</Link>
            
            <a 
              href="/downloads/babfez.apk" 
              download="babfez.apk" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="android-app-only-hide flex items-center justify-between font-bold text-[#B85D36] py-2.5 px-3 bg-[#B85D36]/10 rounded-xl border border-[#B85D36]/30 transition-all hover:bg-[#B85D36] hover:text-white"
            >
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>{lang === 'ar' ? 'تحميل تطبيق أندرويد (APK)' : "Télécharger l'App Android (APK)"}</span>
              </div>
              <span className="text-[10px] bg-[#1C1917] text-white font-mono px-2 py-0.5 rounded">1.05 Mo</span>
            </a>
          </div>
        )}
      </header>

      {/* 2. Hero Section Majestueuse Split-Screen & Visuel Traditionnel */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-[#FBF9F5]">
        {/* Motif traditionnel subtil */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#B85D36_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Colonne Gauche (60% Desktop) */}
            <div className={`lg:col-span-7 ${isAr ? 'text-right' : 'text-left'}`}>
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#B85D36]/10 text-[#B85D36] text-xs font-black tracking-widest uppercase mb-6 border border-[#B85D36]/30 shadow-sm">
                ✨ {dict.hero.badge}
              </span>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] mb-6 tracking-tight leading-[1.15] ${isAr ? 'font-black' : 'font-serif font-bold'}`}>
                {dict.hero.title}
              </h1>

              <p className="text-lg sm:text-xl text-[#44403C] mb-8 font-normal leading-relaxed max-w-2xl">
                {dict.hero.subtitle}
              </p>

              {/* Boutons d'Appel à l'Action */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a 
                  href="#simulateur" 
                  className="inline-flex justify-center items-center bg-gradient-to-r from-[#B85D36] to-[#A04E2B] text-white px-8 py-4 rounded-xl font-extrabold text-base hover:shadow-xl hover:shadow-[#B85D36]/30 transition-all transform hover:-translate-y-0.5"
                >
                  {dict.nav.estimateBtn}
                </a>
                <a 
                  href="#services" 
                  className="inline-flex justify-center items-center bg-white text-[#1C1917] border border-[#E7DDD3] hover:border-[#B85D36] hover:text-[#B85D36] px-8 py-4 rounded-xl font-bold text-base transition-all shadow-warm"
                >
                  {dict.nav.services}
                </a>
              </div>

              {/* Les 3 KPI de Confiance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E7DDD3]">
                <div className="bg-white border border-[#E7DDD3] p-3.5 rounded-2xl shadow-warm flex items-center gap-3">
                  <span className="text-xl">📈</span>
                  <div className="text-xs font-bold text-[#1C1917]">
                    {dict.hero?.kpi1 || "+40% Revenu vs location classique"}
                  </div>
                </div>
                <div className="bg-white border border-[#E7DDD3] p-3.5 rounded-2xl shadow-warm flex items-center gap-3">
                  <span className="text-xl">🛡️</span>
                  <div className="text-xs font-bold text-[#1C1917]">
                    {dict.hero?.kpi2 || "100% Conformité fiches de police"}
                  </div>
                </div>
                <div className="bg-white border border-[#E7DDD3] p-3.5 rounded-2xl shadow-warm flex items-center gap-3">
                  <span className="text-xl">🤝</span>
                  <div className="text-xs font-bold text-[#1C1917]">
                    {dict.hero?.kpi3 || "24/7 Assistance voyageurs"}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite (40% Desktop) : Cadre Photo Hospitalité Marocaine Authentique */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Cadre arrière décoratif doré */}
                <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-[#B85D36]/20 via-[#C59B27]/30 to-[#B85D36]/10 transform rotate-1 blur-sm"></div>

                {/* Cadre principal avec liseré doré */}
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-[#C59B27]/40 shadow-2xl bg-white group aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                  <img 
                    src="https://babfez.com/wp-content/uploads/2022/09/bab-fes-mobile.png"
                    alt="Hospitalité et Conciergerie BABFEZ"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dégradé doux inférieur pour lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Badge flottant bas d'image */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E7DDD3] shadow-xl text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B85D36] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                        ★
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
                          Conciergerie Privée d'Excellence
                        </div>
                        <div className="text-[11px] text-[#44403C] font-medium">
                          Intendance hôtelière 5★ & gestion à Fès
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Simulateur Intelligent & Market Intelligence Fès */}
      <section id="simulateur" className="py-24 bg-[#FBF9F5] border-t border-[#E7DDD3] text-[#1C1917] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#B85D36] text-xs font-black uppercase tracking-widest block mb-2">Market Intelligence Fès</span>
            <h2 className={`text-3xl md:text-5xl font-black mb-4 text-[#1C1917] ${isAr ? '' : 'font-serif'}`}>{dict.simulator.title}</h2>
            <p className="text-[#44403C] text-lg max-w-2xl mx-auto font-medium">Simulation en temps réel basée sur les flux réels Airbnb, Booking.com et Avito.</p>
          </div>

          <div className="bg-white text-[#1C1917] rounded-3xl p-6 md:p-12 shadow-warm max-w-5xl mx-auto border border-[#E7DDD3]">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              
              {/* Colonne Gauche: Paramètres Réactifs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">{dict.simulator.zoneLabel}</label>
                  <select 
                    value={zone} 
                    onChange={(e) => setZone(e.target.value as any)} 
                    className="w-full bg-[#FBF9F5] border border-[#E7DDD3] rounded-xl px-4 py-3.5 font-bold outline-none focus:border-[#B85D36] transition-colors text-[#1C1917]"
                  >
                    <option value="ville_nouvelle">{dict.simulator.zoneVilleNouvelle || "Ville Nouvelle / Atlas / Champs de Course"}</option>
                    <option value="medina">{dict.simulator.zoneMedina || "Médina / Riad (Zone touristique)"}</option>
                    <option value="immouzzer">{dict.simulator.zoneImmouzzer || "Route d'Immouzzer / Résidences récentes"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">{dict.simulator.typeLabel}</label>
                  <select 
                    value={propertyType} 
                    onChange={(e) => setPropertyType(e.target.value as any)} 
                    className="w-full bg-[#FBF9F5] border border-[#E7DDD3] rounded-xl px-4 py-3.5 font-bold outline-none focus:border-[#B85D36] transition-colors text-[#1C1917]"
                  >
                    <option value="appartement">{dict.simulator.typeApartment || "Appartement"}</option>
                    <option value="riad">{dict.simulator.typeRiad || "Riad traditionnel"}</option>
                    <option value="villa">{dict.simulator.typeVilla || "Villa"}</option>
                  </select>
                </div>

                {/* Boutons Pastilles Interactifs 1 à 6+ */}
                <div>
                  <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">
                    {dict.simulator.simRooms || "Nombre de chambres"}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[
                      { id: "studio", label: "Studio" }, 
                      { id: "1", label: "1 ch" }, 
                      { id: "2", label: "2 ch" }, 
                      { id: "3", label: "3 ch" }, 
                      { id: "4", label: "4 ch" },
                      { id: "5", label: "5 ch" },
                      { id: "6+", label: "6+ ch" }
                    ].map((r) => (
                      <button 
                        key={r.id} 
                        type="button"
                        onClick={() => setRooms(r.id as any)} 
                        className={`py-3 px-1 text-xs rounded-xl font-black transition-all ${rooms === r.id ? "bg-[#B85D36]/10 text-[#B85D36] border-2 border-[#B85D36] shadow-sm scale-105" : "bg-[#FBF9F5] text-[#44403C] hover:bg-[#F5F0E8] border-2 border-transparent"}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <label className="text-xs font-bold text-[#44403C] uppercase tracking-wider">{dict.simulator.occupancy}</label>
                    <span className="text-sm font-black text-[#B85D36] bg-[#B85D36]/10 px-2.5 py-0.5 rounded-lg border border-[#B85D36]/20">
                      {occupancyRate}% (~{occupiedNights} nuits/mois)
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="95" 
                    value={occupancyRate} 
                    onChange={(e) => setOccupancyRate(Number(e.target.value))} 
                    className="w-full h-2.5 bg-[#E7DDD3] rounded-lg appearance-none cursor-pointer accent-[#B85D36]" 
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-bold mt-1">
                    <span>Basse saison (30%)</span>
                    <span>Moyenne (68%)</span>
                    <span>Haute saison (95%)</span>
                  </div>
                </div>
              </div>
              
              {/* Colonne Droite: Résultat Haute Densité Noir Charbon & Or */}
              <div className="bg-[#1C1917] text-white rounded-3xl p-8 border border-[#C59B27]/40 flex flex-col justify-center text-center shadow-2xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 bg-[#C59B27] text-[#1C1917] px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider">
                  Données Marché Fès
                </div>

                {/* Animation visuelle Analyse IA en direct */}
                {isAnalyzing ? (
                  <div className="py-2 px-3 bg-[#B85D36]/20 border border-[#B85D36]/50 rounded-xl text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-2 animate-pulse">
                    <span className="text-sm">⚡</span>
                    <span>Scan du marché Fès en cours (Airbnb & Booking.com)...</span>
                  </div>
                ) : (
                  <div className="py-1 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-medium text-stone-300 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Tarif moyen calculé : <strong>{marketData.adr} MAD / nuit</strong></span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-1 block">
                    {dict.simulator.monthlyGross || "Revenu Brut Mensuel Estimé"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {monthlyGross.toLocaleString('fr-FR')} <span className="text-xl text-[#D4AF37]">MAD</span>
                  </div>
                </div>
                
                {/* Net Propriétaire Estimé */}
                <div className="py-4 px-5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm shadow-inner">
                  <div className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">Revenu Net en Poche Propriétaire (après formule 20%)</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#25D366] mt-1">
                    ~{monthlyNet.toLocaleString('fr-FR')} MAD <span className="text-xs font-medium text-stone-300">/ mois</span>
                  </div>
                  <div className="text-[11px] text-[#D4AF37] font-bold mt-1">
                    Soit environ {annualGross.toLocaleString('fr-FR')} MAD par an
                  </div>
                </div>

                {/* Comparateur Avito / Mubawab vs Location Classique */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-300 font-medium">Loyer classique moyen (Avito/Mubawab) :</span>
                    <span className="font-bold text-stone-200">{longTermComp.toLocaleString('fr-FR')} MAD/mois</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-black text-[#D4AF37]">
                    <span>Plus-value BABFEZ :</span>
                    <span className="bg-[#B85D36]/20 px-2.5 py-0.5 rounded-full border border-[#B85D36]/30 text-xs sm:text-sm text-[#D4AF37]">
                      +{gainPercentage}% de revenu net
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-stone-400 font-medium pt-2 border-t border-white/10 leading-relaxed">
                    ✓ Zéro impayé • Entretien hôtelier régulier • Fiches de police incluses
                  </p>
                </div>

                {/* Fourchette Saisonnière */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-[10px] text-stone-400 font-semibold uppercase">Basse saison (hiver)</span>
                    <span className="font-bold text-stone-200 text-sm">~{lowSeasonNet.toLocaleString('fr-FR')} MAD</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-[10px] text-[#D4AF37] font-semibold uppercase">Haute saison (festivals)</span>
                    <span className="font-bold text-[#D4AF37] text-sm">~{highSeasonNet.toLocaleString('fr-FR')} MAD</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleSimulateToForm} 
                  className="w-full block text-center bg-gradient-to-r from-[#B85D36] to-[#A04E2B] text-white font-black py-4 rounded-xl hover:shadow-xl hover:shadow-[#B85D36]/30 transition-all cursor-pointer text-sm uppercase tracking-wider transform hover:-translate-y-0.5"
                >
                  {dict.simulator.ctaQuote || "Obtenir mon audit technique gratuit"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Les 4 Formules Complètes de Gestion */}
      <section id="services" className="py-24 bg-[#FBF9F5] border-t border-[#E7DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#B85D36] text-xs font-black uppercase tracking-widest block mb-2">Transparence & Performance</span>
          <h2 className={`text-3xl md:text-5xl font-black text-[#1C1917] mb-4 ${isAr ? '' : 'font-serif'}`}>{dict.services?.title}</h2>
          <p className="text-lg text-[#44403C] max-w-2xl mx-auto mb-16 font-medium">{dict.services?.subtitle}</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left items-stretch">
            
            {/* Formule 1: Services À la carte */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7DDD3] shadow-warm hover:border-[#B85D36]/40 transition-all flex flex-col hover:shadow-warm-lg">
              <h3 className="text-xl font-black text-[#1C1917] mb-1">{dict.services?.f1Title}</h3>
              <div className="text-3xl font-black text-[#1C1917] mb-4">{dict.services?.f1Price}</div>
              <p className="text-[#44403C] mb-6 text-sm font-medium leading-relaxed">{dict.services?.f1Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f1Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-[#44403C] font-medium">
                    <svg className="w-5 h-5 text-[#B85D36] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-[#1C1917] text-[#1C1917] font-extrabold py-3.5 rounded-xl hover:bg-[#1C1917] hover:text-white transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Demander un service"}
              </a>
            </div>

            {/* Formule 2: Gestion Digitale */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7DDD3] shadow-warm hover:border-[#B85D36]/40 transition-all flex flex-col hover:shadow-warm-lg">
              <h3 className="text-xl font-black text-[#1C1917] mb-1">{dict.services?.f2Title}</h3>
              <div className="text-3xl font-black text-[#B85D36] mb-4">{dict.services?.f2Price}</div>
              <p className="text-[#44403C] mb-6 text-sm font-medium leading-relaxed">{dict.services?.f2Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f2Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-[#44403C] font-medium">
                    <svg className="w-5 h-5 text-[#B85D36] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-[#B85D36] text-[#B85D36] font-extrabold py-3.5 rounded-xl hover:bg-[#B85D36] hover:text-white transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Choisir Digital"}
              </a>
            </div>

            {/* Formule 3: Gestion Sérénité (Recommandée) */}
            <div className="bg-[#1C1917] rounded-3xl p-8 border-2 border-[#C59B27] shadow-2xl flex flex-col relative transform lg:-translate-y-3 z-10 text-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B85D36] text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap shadow-lg">
                ⭐ {dict.services?.f3Badge || "Populaire / Recommandé"}
              </div>
              <h3 className="text-xl font-black text-white mb-1">{dict.services?.f3Title}</h3>
              <div className="text-4xl font-black text-[#D4AF37] mb-4">{dict.services?.f3Price}</div>
              <p className="text-stone-300 mb-6 text-sm font-medium leading-relaxed">{dict.services?.f3Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f3Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-stone-200 font-medium">
                    <svg className="w-5 h-5 text-[#D4AF37] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-gradient-to-r from-[#B85D36] to-[#A04E2B] text-white font-black py-4 rounded-xl hover:shadow-xl hover:shadow-[#B85D36]/30 transition-all shadow-lg mt-auto text-sm uppercase tracking-wider">
                {dict.contact?.submitBtn || "Déléguer à 100%"}
              </a>
            </div>

            {/* Formule 4: Gestion Premium (VIP Clé en Main) */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7DDD3] shadow-warm hover:border-[#C59B27] transition-all flex flex-col relative hover:shadow-warm-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1C1917] text-[#D4AF37] border border-[#C59B27]/40 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap shadow-md">
                👑 {dict.services?.f4Badge || "Excellence"}
              </div>
              <h3 className="text-xl font-black text-[#1C1917] mb-1">{dict.services?.f4Title}</h3>
              <div className="text-3xl font-black text-[#1C1917] mb-4">{dict.services?.f4Price}</div>
              <p className="text-[#44403C] mb-6 text-sm font-medium leading-relaxed">{dict.services?.f4Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f4Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-[#44403C] font-medium">
                    <svg className="w-5 h-5 text-[#C59B27] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-[#1C1917] text-white font-extrabold py-3.5 rounded-xl hover:bg-[#292524] transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Étude personnalisée"}
              </a>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. Section Pourquoi Choisir BABFEZ (4 Atouts) */}
      <section id="atouts" className="py-24 bg-white border-t border-[#E7DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#B85D36] text-xs font-black uppercase tracking-widest block mb-2">Savoir-Faire & Rigueur</span>
            <h2 className={`text-3xl md:text-5xl font-black text-[#1C1917] mb-4 ${isAr ? '' : 'font-serif'}`}>{dict.advantages?.title}</h2>
            <p className="text-[#44403C] text-lg max-w-2xl mx-auto font-medium">{dict.advantages?.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: dict.advantages?.f1Title, desc: dict.advantages?.f1Desc, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: dict.advantages?.f2Title, desc: dict.advantages?.f2Desc, icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
              { title: dict.advantages?.f3Title, desc: dict.advantages?.f3Desc, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: dict.advantages?.f4Title, desc: dict.advantages?.f4Desc, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
            ].map((atout, i) => (
              <div key={i} className="bg-[#FBF9F5] p-8 rounded-3xl border border-[#E7DDD3] hover:shadow-warm hover:border-[#B85D36]/40 transition-all group">
                <div className="w-14 h-14 bg-[#1C1917] text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-[#1C1917]/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={atout.icon}/></svg>
                </div>
                <h4 className="text-xl font-black text-[#1C1917] mb-3">{atout.title}</h4>
                <p className="text-[#44403C] leading-relaxed text-sm font-medium">{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section FAQ en Accordéons Fluides */}
      <section id="faq" className="py-24 bg-[#FBF9F5] border-t border-[#E7DDD3]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#B85D36] text-xs font-black uppercase tracking-widest block mb-2">Réponses Claires</span>
            <h2 className={`text-3xl md:text-5xl font-black text-[#1C1917] mb-4 ${isAr ? '' : 'font-serif'}`}>{dict.faq?.title}</h2>
            <p className="text-[#44403C] text-lg font-medium">{dict.faq?.subtitle}</p>
          </div>
          <div className="space-y-4">
            {[
              { q: dict.faq?.q1, a: dict.faq?.a1 },
              { q: dict.faq?.q2, a: dict.faq?.a2 },
              { q: dict.faq?.q3, a: dict.faq?.a3 }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#E7DDD3] rounded-2xl overflow-hidden shadow-warm transition-all hover:border-[#B85D36]/40">
                <button 
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full text-left px-6 py-5 font-bold text-[#1C1917] flex justify-between items-center focus:outline-none"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#FBF9F5] text-[#B85D36] transition-transform ${openFaq === i ? 'rotate-180 bg-[#1C1917] text-[#D4AF37]' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-[#44403C] text-sm leading-relaxed border-t border-[#E7DDD3] pt-4 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact & Prise de Rendez-vous (Double-Détente) */}
      <section id="contact" className="py-24 bg-[#1C1917] relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white text-[#1C1917] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-[#C59B27]/20">
            
            {/* Colonne Gauche Présentation */}
            <div className="p-8 md:p-12 md:w-5/12 bg-[#1C1917] text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-800">
              <div>
                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-widest block mb-3">Audit Technique 24h</span>
                <h2 className={`text-3xl font-black mb-4 leading-tight ${isAr ? '' : 'font-serif'}`}>{dict.contact?.heading}</h2>
                <p className="text-stone-300 font-medium text-sm leading-relaxed mb-8">{dict.contact?.subheading}</p>
              </div>

              <div className="pt-6 border-t border-stone-800 space-y-3">
                <div className="text-xs text-stone-400 uppercase font-bold tracking-wider">Ligne d'Urgence Propriétaires</div>
                <div className="text-xl font-black text-[#D4AF37]">+212 7 78 87 41 14</div>
                <div className="text-xs text-stone-300 font-medium">Réponse immédiate 7j/7 sur WhatsApp</div>
              </div>
            </div>
            
            {/* Colonne Droite Formulaire */}
            <div className="p-8 md:p-12 md:w-7/12 bg-white">
              {submitSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#1C1917]">{dict.home.formSuccess}</h3>
                  <p className="text-sm text-stone-500 font-medium">Votre dossier a été enregistré dans notre base de données sécurisée. Ouverture de la discussion WhatsApp...</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" required placeholder={dict.contact.fullName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none font-medium text-sm text-[#1C1917]" />
                    <input type="email" required placeholder={dict.contact.email} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none font-medium text-sm text-[#1C1917]" />
                  </div>
                  <div>
                    <input type="tel" required placeholder={dict.contact.phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none font-medium text-sm text-[#1C1917]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select value={formData.quartier} onChange={e => setFormData({...formData, quartier: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none bg-white font-medium text-sm text-[#1C1917]">
                      <option value="" disabled>{dict.contact.area}</option>
                      <option value="Ville Nouvelle / Atlas">Ville Nouvelle / Atlas / Champs de Course</option>
                      <option value="Médina / Riad">Médina / Riad</option>
                      <option value="Route d'Immouzzer">Route d'Immouzzer</option>
                    </select>
                    <select value={formData.typeBien} onChange={e => setFormData({...formData, typeBien: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none bg-white font-medium text-sm text-[#1C1917]">
                      <option value="" disabled>{dict.simulator.typeLabel}</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Riad">Riad</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="number" placeholder={dict.contact.surface} value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none font-medium text-sm text-[#1C1917]" />
                    <select value={formData.formule} onChange={e => setFormData({...formData, formule: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none bg-white font-medium text-sm text-[#1C1917]">
                      <option value="" disabled>{dict.contact.plan}</option>
                      <option value={dict.services?.f3Title || "Gestion Sérénité"}>{dict.services?.f3Title || "Gestion Sérénité (20% TTC)"}</option>
                      <option value={dict.services?.f2Title || "Gestion Digitale"}>{dict.services?.f2Title || "Gestion Digitale (15% TTC)"}</option>
                      <option value={dict.services?.f4Title || "Gestion Premium"}>{dict.services?.f4Title || "Gestion Premium (25% TTC)"}</option>
                      <option value={dict.services?.f1Title || "Services À la Carte"}>{dict.services?.f1Title || "Services À la carte"}</option>
                    </select>
                  </div>
                  <div>
                    <textarea placeholder={dict.contact.message} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-[#E7DDD3] focus:border-[#B85D36] outline-none h-24 resize-none font-medium text-sm text-[#1C1917]"></textarea>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" id="rgpd" required checked={formData.rgpd} onChange={e => setFormData({...formData, rgpd: e.target.checked})} className="mt-1 accent-[#B85D36]" />
                    <label htmlFor="rgpd" className="text-xs text-stone-500 font-medium leading-relaxed">{dict.contact.consent}</label>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#B85D36] to-[#A04E2B] text-white font-black py-4 rounded-xl hover:shadow-xl hover:shadow-[#B85D36]/30 transition-all uppercase tracking-wider text-sm shadow-md shadow-[#B85D36]/20 disabled:opacity-70">
                    {dict.contact.submitBtn}
                  </button>
                  <p className="text-[11px] text-center text-stone-400 font-medium">Protection des données conforme à la législation marocaine CNDP n° 09-08.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer lang={lang} dict={dict} />

      {/* Bouton WhatsApp Flottant */}
      <a 
        href={`${CONTACT_INFO.whatsappLink}?text=Bonjour%20BABFEZ,%20je%20souhaite%20des%20informations%20pour%20mon%20bien%20à%20Fès`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1DA851] hover:scale-110 transition-all group"
        aria-label="Contacter sur WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
        </span>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
      </a>
    </div>
  );
}
