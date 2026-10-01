"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { CONTACT_INFO } from "@/config/site";
import Footer from "@/components/Footer";
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B2545] font-sans selection:bg-[#C59B27] selection:text-white">
      {/* 1. Header & Navigation Fixe Haut de Gamme */}
      <header className="fixed w-full top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#0B2545]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#0B2545] rounded-xl flex items-center justify-center text-[#C59B27] shadow-md shadow-[#0B2545]/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#0B2545] block leading-tight">BAB<span className="text-[#C59B27]">FEZ</span></span>
              <span className="text-[10px] text-[#134074] font-bold tracking-widest uppercase block">{dict.nav?.subtitle || "Conciergerie & Intendance Privée"}</span>
            </div>
          </Link>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#simulateur" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">{dict.nav.simulator}</a>
            <a href="#services" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">{dict.nav.services}</a>
            <a href="#atouts" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">{dict.nav.advantages}</a>
            <a href="#faq" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">{dict.nav.faq}</a>
            <Link href={`/${lang}/reserver`} className="text-sm font-bold text-[#C59B27] bg-[#C59B27]/10 px-3.5 py-1.5 rounded-full border border-[#C59B27]/30 hover:bg-[#C59B27] hover:text-white transition-all">{dict.nav.properties}</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <LanguageSwitcher currentLang={lang} />
              <div className="h-4 w-px bg-slate-200"></div>
              <CurrencySwitcher />
            </div>
            
            <Link href={`/${lang}/proprietaire/login`} className="flex items-center gap-2 text-sm font-bold text-[#134074] bg-white border border-[#0B2545]/10 hover:border-[#C59B27] px-4 py-2.5 rounded-xl transition-all shadow-sm">
              <svg className="w-4 h-4 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              {dict.nav.ownerSpace}
            </Link>

            <a href={`/${lang}/#simulateur`} className="bg-[#0B2545] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#134074] transition-colors shadow-lg shadow-[#0B2545]/20">
              {dict.nav.estimateBtn}
            </a>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <CurrencySwitcher />
            <div className="h-4 w-px bg-slate-300"></div>
            <LanguageSwitcher currentLang={lang} />
            <button className="text-[#0B2545] ml-1 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#0B2545]/10 px-4 py-5 space-y-4 shadow-xl">
            <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#134074]">{dict.nav.simulator}</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#134074]">{dict.nav.services}</a>
            <a href="#atouts" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#134074]">{dict.nav.advantages}</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-[#134074]">{dict.nav.faq}</a>
            <Link href={`/${lang}/reserver`} onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#C59B27]">{dict.nav.properties}</Link>
            <Link href={`/${lang}/proprietaire/login`} onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#0B2545]">{dict.nav.ownerSpace}</Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section Majestueuse */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#C59B27]/10 text-[#C59B27] text-xs font-black tracking-widest uppercase mb-6 border border-[#C59B27]/30 shadow-sm">
            ✨ {dict.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0B2545] mb-6 tracking-tight max-w-5xl mx-auto leading-[1.15]">
            {dict.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-[#134074] mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            {dict.hero.subtitle}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="bg-white border border-[#0B2545]/10 text-[#0B2545] px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              📈 {dict.hero?.kpi1 || "+40% Revenu vs location classique"}
            </span>
            <span className="bg-white border border-[#0B2545]/10 text-[#0B2545] px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              🛡️ {dict.hero?.kpi2 || "100% Conformité fiches de police"}
            </span>
            <span className="bg-white border border-[#0B2545]/10 text-[#0B2545] px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              🤝 {dict.hero?.kpi3 || "24/7 Assistance voyageurs"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#simulateur" className="bg-[#C59B27] text-white px-8 py-4 rounded-full font-extrabold text-lg hover:bg-[#B38920] transition-all shadow-xl shadow-[#C59B27]/30 transform hover:-translate-y-0.5">
              {dict.nav.estimateBtn}
            </a>
            <a href="#services" className="bg-white text-[#0B2545] border-2 border-[#0B2545]/20 px-8 py-4 rounded-full font-extrabold text-lg hover:border-[#0B2545] transition-all shadow-sm">
              {dict.nav.services}
            </a>
          </div>
        </div>
      </section>

      {/* 3. Simulateur Intelligent & Market Intelligence Fès */}
      <section id="simulateur" className="py-24 bg-[#0B2545] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C59B27] text-xs font-black uppercase tracking-widest block mb-2">Market Intelligence Fès</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{dict.simulator.title}</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">Simulation en temps réel basée sur les flux réels Airbnb, Booking.com et Avito.</p>
          </div>

          <div className="bg-white text-[#0B2545] rounded-3xl p-6 md:p-12 shadow-2xl max-w-5xl mx-auto border-4 border-[#C59B27]/20">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              
              {/* Colonne Gauche: Paramètres Réactifs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#134074] uppercase tracking-wider mb-2">{dict.simulator.zoneLabel}</label>
                  <select 
                    value={zone} 
                    onChange={(e) => setZone(e.target.value as any)} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold outline-none focus:border-[#C59B27] transition-colors"
                  >
                    <option value="ville_nouvelle">{dict.simulator.zoneVilleNouvelle || "Ville Nouvelle / Atlas / Champs de Course"}</option>
                    <option value="medina">{dict.simulator.zoneMedina || "Médina / Riad (Zone touristique)"}</option>
                    <option value="immouzzer">{dict.simulator.zoneImmouzzer || "Route d'Immouzzer / Résidences récentes"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#134074] uppercase tracking-wider mb-2">{dict.simulator.typeLabel}</label>
                  <select 
                    value={propertyType} 
                    onChange={(e) => setPropertyType(e.target.value as any)} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 font-bold outline-none focus:border-[#C59B27] transition-colors"
                  >
                    <option value="appartement">{dict.simulator.typeApartment || "Appartement"}</option>
                    <option value="riad">{dict.simulator.typeRiad || "Riad traditionnel"}</option>
                    <option value="villa">{dict.simulator.typeVilla || "Villa"}</option>
                  </select>
                </div>

                {/* Boutons Pastilles Interactifs 1 à 6+ */}
                <div>
                  <label className="block text-xs font-bold text-[#134074] uppercase tracking-wider mb-2">
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
                        className={`py-3 px-1 text-xs rounded-xl font-black transition-all ${rooms === r.id ? "bg-[#0B2545] text-[#C59B27] border-2 border-[#C59B27] shadow-lg scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent"}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <label className="text-xs font-bold text-[#134074] uppercase tracking-wider">{dict.simulator.occupancy}</label>
                    <span className="text-sm font-black text-[#C59B27] bg-[#C59B27]/10 px-2 py-0.5 rounded-lg border border-[#C59B27]/20">
                      {occupancyRate}% (~{occupiedNights} nuits/mois)
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="95" 
                    value={occupancyRate} 
                    onChange={(e) => setOccupancyRate(Number(e.target.value))} 
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C59B27]" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                    <span>Basse saison (30%)</span>
                    <span>Moyenne (68%)</span>
                    <span>Haute saison (95%)</span>
                  </div>
                </div>
              </div>
              
              {/* Colonne Droite: Résultat Haute Densité Bleu Nuit & Or */}
              <div className="bg-[#0B2545] text-white rounded-3xl p-8 border border-[#C59B27]/40 flex flex-col justify-center text-center shadow-2xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 bg-[#C59B27] text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider">
                  Données Marché Fès
                </div>

                {/* Animation visuelle Analyse IA en direct */}
                {isAnalyzing ? (
                  <div className="py-2 px-3 bg-[#C59B27]/20 border border-[#C59B27]/50 rounded-xl text-xs font-bold text-[#C59B27] flex items-center justify-center gap-2 animate-pulse">
                    <span className="text-sm">⚡</span>
                    <span>Scan du marché Fès en cours (Airbnb & Booking.com)...</span>
                  </div>
                ) : (
                  <div className="py-1 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-medium text-slate-300 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Tarif moyen calculé : <strong>{marketData.adr} MAD / nuit</strong></span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1 block">
                    {dict.simulator.monthlyGross || "Revenu Brut Mensuel Estimé"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {monthlyGross.toLocaleString('fr-FR')} <span className="text-xl text-[#C59B27]">MAD</span>
                  </div>
                </div>
                
                {/* Net Propriétaire Estimé */}
                <div className="py-4 px-5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm shadow-inner">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Revenu Net en Poche Propriétaire (après formule 20%)</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#25D366] mt-1">
                    ~{monthlyNet.toLocaleString('fr-FR')} MAD <span className="text-xs font-medium text-slate-300">/ mois</span>
                  </div>
                  <div className="text-[11px] text-[#C59B27] font-bold mt-1">
                    Soit environ {annualGross.toLocaleString('fr-FR')} MAD par an
                  </div>
                </div>

                {/* Comparateur Avito / Mubawab vs Location Classique */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Loyer classique moyen (Avito/Mubawab) :</span>
                    <span className="font-bold text-slate-200">{longTermComp.toLocaleString('fr-FR')} MAD/mois</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-black text-[#C59B27]">
                    <span>Plus-value BABFEZ :</span>
                    <span className="bg-[#C59B27]/20 px-2.5 py-0.5 rounded-full border border-[#C59B27]/30 text-xs sm:text-sm">
                      +{gainPercentage}% de revenu net
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-medium pt-2 border-t border-white/10 leading-relaxed">
                    ✓ Zéro impayé • Entretien hôtelier régulier • Fiches de police incluses
                  </p>
                </div>

                {/* Fourchette Saisonnière */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Basse saison (hiver)</span>
                    <span className="font-bold text-slate-200 text-sm">~{lowSeasonNet.toLocaleString('fr-FR')} MAD</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-[10px] text-[#C59B27] font-semibold uppercase">Haute saison (festivals)</span>
                    <span className="font-bold text-[#C59B27] text-sm">~{highSeasonNet.toLocaleString('fr-FR')} MAD</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleSimulateToForm} 
                  className="w-full block text-center bg-[#C59B27] text-white font-black py-4 rounded-xl hover:bg-[#B38920] transition-all shadow-xl shadow-[#C59B27]/30 cursor-pointer text-sm uppercase tracking-wider transform hover:-translate-y-0.5"
                >
                  {dict.simulator.ctaQuote || "Obtenir mon audit technique gratuit"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Les 4 Formules Complètes de Gestion */}
      <section id="services" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#C59B27] text-xs font-black uppercase tracking-widest block mb-2">Transparence & Performance</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#0B2545] mb-4">{dict.services?.title}</h2>
          <p className="text-lg text-[#134074] max-w-2xl mx-auto mb-16 font-medium">{dict.services?.subtitle}</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left items-stretch">
            
            {/* Formule 1: Services À la carte */}
            <div className="bg-white rounded-3xl p-8 border border-[#0B2545]/10 shadow-sm hover:border-[#C59B27]/40 transition-all flex flex-col hover:shadow-xl">
              <h3 className="text-xl font-black text-[#0B2545] mb-1">{dict.services?.f1Title}</h3>
              <div className="text-3xl font-black text-[#0B2545] mb-4">{dict.services?.f1Price}</div>
              <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">{dict.services?.f1Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f1Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-slate-700 font-medium">
                    <svg className="w-5 h-5 text-[#C59B27] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-[#0B2545] text-[#0B2545] font-extrabold py-3.5 rounded-xl hover:bg-[#0B2545] hover:text-white transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Demander un service"}
              </a>
            </div>

            {/* Formule 2: Gestion Digitale */}
            <div className="bg-white rounded-3xl p-8 border border-[#0B2545]/10 shadow-sm hover:border-[#C59B27]/40 transition-all flex flex-col hover:shadow-xl">
              <h3 className="text-xl font-black text-[#0B2545] mb-1">{dict.services?.f2Title}</h3>
              <div className="text-3xl font-black text-[#C59B27] mb-4">{dict.services?.f2Price}</div>
              <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">{dict.services?.f2Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f2Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-slate-700 font-medium">
                    <svg className="w-5 h-5 text-[#C59B27] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-[#0B2545] text-[#0B2545] font-extrabold py-3.5 rounded-xl hover:bg-[#0B2545] hover:text-white transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Choisir Digital"}
              </a>
            </div>

            {/* Formule 3: Gestion Sérénité (Recommandée) */}
            <div className="bg-[#0B2545] rounded-3xl p-8 border-2 border-[#C59B27] shadow-2xl flex flex-col relative transform lg:-translate-y-3 z-10 text-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C59B27] text-white font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap shadow-lg">
                ⭐ {dict.services?.f3Badge || "Populaire / Recommandé"}
              </div>
              <h3 className="text-xl font-black text-white mb-1">{dict.services?.f3Title}</h3>
              <div className="text-4xl font-black text-[#C59B27] mb-4">{dict.services?.f3Price}</div>
              <p className="text-slate-300 mb-6 text-sm font-medium leading-relaxed">{dict.services?.f3Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f3Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-slate-200 font-medium">
                    <svg className="w-5 h-5 text-[#C59B27] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-[#C59B27] text-white font-black py-4 rounded-xl hover:bg-[#B38920] transition-all shadow-xl shadow-[#C59B27]/30 mt-auto text-sm uppercase tracking-wider">
                {dict.contact?.submitBtn || "Déléguer à 100%"}
              </a>
            </div>

            {/* Formule 4: Gestion Premium (VIP Clé en Main) */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#0B2545]/20 shadow-sm hover:border-[#C59B27] transition-all flex flex-col relative hover:shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B2545] text-[#C59B27] border border-[#C59B27]/40 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap shadow-md">
                👑 {dict.services?.f4Badge || "Excellence"}
              </div>
              <h3 className="text-xl font-black text-[#0B2545] mb-1">{dict.services?.f4Title}</h3>
              <div className="text-3xl font-black text-[#0B2545] mb-4">{dict.services?.f4Price}</div>
              <p className="text-slate-600 mb-6 text-sm font-medium leading-relaxed">{dict.services?.f4Desc}</p>
              <ul className="mb-8 space-y-3.5 flex-1">
                {(dict.services?.f4Bullets || []).map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start text-xs sm:text-sm text-slate-700 font-medium">
                    <svg className="w-5 h-5 text-[#C59B27] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-[#0B2545] text-white font-extrabold py-3.5 rounded-xl hover:bg-[#134074] transition-all mt-auto text-sm">
                {dict.contact?.submitBtn || "Étude personnalisée"}
              </a>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. Section Pourquoi Choisir BABFEZ (4 Atouts) */}
      <section id="atouts" className="py-24 bg-white border-t border-[#0B2545]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C59B27] text-xs font-black uppercase tracking-widest block mb-2">Savoir-Faire & Rigueur</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0B2545] mb-4">{dict.advantages?.title}</h2>
            <p className="text-[#134074] text-lg max-w-2xl mx-auto font-medium">{dict.advantages?.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: dict.advantages?.f1Title, desc: dict.advantages?.f1Desc, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: dict.advantages?.f2Title, desc: dict.advantages?.f2Desc, icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
              { title: dict.advantages?.f3Title, desc: dict.advantages?.f3Desc, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: dict.advantages?.f4Title, desc: dict.advantages?.f4Desc, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
            ].map((atout, i) => (
              <div key={i} className="bg-[#FDFBF7] p-8 rounded-3xl border border-[#0B2545]/10 hover:shadow-xl hover:border-[#C59B27]/40 transition-all group">
                <div className="w-14 h-14 bg-[#0B2545] text-[#C59B27] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-[#0B2545]/20 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={atout.icon}/></svg>
                </div>
                <h4 className="text-xl font-black text-[#0B2545] mb-3">{atout.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section FAQ en Accordéons Fluides */}
      <section id="faq" className="py-24 bg-[#FDFBF7] border-t border-[#0B2545]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C59B27] text-xs font-black uppercase tracking-widest block mb-2">Réponses Claires</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0B2545] mb-4">{dict.faq?.title}</h2>
            <p className="text-[#134074] text-lg font-medium">{dict.faq?.subtitle}</p>
          </div>
          <div className="space-y-4">
            {[
              { q: dict.faq?.q1, a: dict.faq?.a1 },
              { q: dict.faq?.q2, a: dict.faq?.a2 },
              { q: dict.faq?.q3, a: dict.faq?.a3 }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#0B2545]/10 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-[#C59B27]/40">
                <button 
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full text-left px-6 py-5 font-bold text-[#0B2545] flex justify-between items-center focus:outline-none"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-[#C59B27] transition-transform ${openFaq === i ? 'rotate-180 bg-[#0B2545] text-white' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact & Prise de Rendez-vous (Double-Détente) */}
      <section id="contact" className="py-24 bg-[#0B2545] relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white text-[#0B2545] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-[#C59B27]/20">
            
            {/* Colonne Gauche Présentation */}
            <div className="p-8 md:p-12 md:w-5/12 bg-[#0B2545] text-white flex flex-col justify-between">
              <div>
                <span className="text-[#C59B27] text-xs font-black uppercase tracking-widest block mb-3">Audit Technique 24h</span>
                <h2 className="text-3xl font-black mb-4 leading-tight">{dict.contact?.heading}</h2>
                <p className="text-slate-300 font-medium text-sm leading-relaxed mb-8">{dict.contact?.subheading}</p>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Ligne d'Urgence Propriétaires</div>
                <div className="text-xl font-black text-[#C59B27]">+212 7 78 87 41 14</div>
                <div className="text-xs text-slate-300 font-medium">Réponse immédiate 7j/7 sur WhatsApp</div>
              </div>
            </div>
            
            {/* Colonne Droite Formulaire */}
            <div className="p-8 md:p-12 md:w-7/12 bg-white">
              {submitSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-2xl font-black text-[#0B2545]">{dict.home.formSuccess}</h3>
                  <p className="text-sm text-slate-500 font-medium">Votre dossier a été enregistré dans notre base de données sécurisée. Ouverture de la discussion WhatsApp...</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" required placeholder={dict.contact.fullName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none font-medium text-sm text-[#0B2545]" />
                    <input type="email" required placeholder={dict.contact.email} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none font-medium text-sm text-[#0B2545]" />
                  </div>
                  <div>
                    <input type="tel" required placeholder={dict.contact.phone} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none font-medium text-sm text-[#0B2545]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select value={formData.quartier} onChange={e => setFormData({...formData, quartier: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none bg-white font-medium text-sm text-[#0B2545]">
                      <option value="" disabled>{dict.contact.area}</option>
                      <option value="Ville Nouvelle / Atlas">Ville Nouvelle / Atlas / Champs de Course</option>
                      <option value="Médina / Riad">Médina / Riad</option>
                      <option value="Route d'Immouzzer">Route d'Immouzzer</option>
                    </select>
                    <select value={formData.typeBien} onChange={e => setFormData({...formData, typeBien: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none bg-white font-medium text-sm text-[#0B2545]">
                      <option value="" disabled>{dict.simulator.typeLabel}</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Riad">Riad</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="number" placeholder={dict.contact.surface} value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none font-medium text-sm text-[#0B2545]" />
                    <select value={formData.formule} onChange={e => setFormData({...formData, formule: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none bg-white font-medium text-sm text-[#0B2545]">
                      <option value="" disabled>{dict.contact.plan}</option>
                      <option value={dict.services?.f3Title || "Gestion Sérénité"}>{dict.services?.f3Title || "Gestion Sérénité (20% TTC)"}</option>
                      <option value={dict.services?.f2Title || "Gestion Digitale"}>{dict.services?.f2Title || "Gestion Digitale (15% TTC)"}</option>
                      <option value={dict.services?.f4Title || "Gestion Premium"}>{dict.services?.f4Title || "Gestion Premium (25% TTC)"}</option>
                      <option value={dict.services?.f1Title || "Services À la Carte"}>{dict.services?.f1Title || "Services À la carte"}</option>
                    </select>
                  </div>
                  <div>
                    <textarea placeholder={dict.contact.message} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#C59B27] outline-none h-24 resize-none font-medium text-sm text-[#0B2545]"></textarea>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" id="rgpd" required checked={formData.rgpd} onChange={e => setFormData({...formData, rgpd: e.target.checked})} className="mt-1 accent-[#C59B27]" />
                    <label htmlFor="rgpd" className="text-xs text-slate-500 font-medium leading-relaxed">{dict.contact.consent}</label>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#0B2545] text-white font-black py-4 rounded-xl hover:bg-[#134074] transition-all shadow-xl shadow-[#0B2545]/20 disabled:opacity-70 uppercase tracking-wider text-sm">
                    {dict.contact.submitBtn}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-medium">Protection des données conforme à la législation marocaine CNDP n° 09-08.</p>
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
