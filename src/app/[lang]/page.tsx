"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import { CONTACT_INFO } from "@/config/site";

const dicts = { fr, en, es };

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simulator State
  const [zone, setZone] = useState<"medina" | "nouvelle" | "immouzzer">("medina");
  const [propType, setPropType] = useState<"appart" | "riad" | "villa">("appart");
  const [rooms, setRooms] = useState<"studio" | "1" | "2" | "3" | "4">("1");
  const [occupancy, setOccupancy] = useState(65);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quartier: "",
    typeBien: "",
    surface: "",
    formule: dict.home.formula2Title,
    message: "",
    rgpd: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getAdr = () => {
    if (zone === "medina") {
      if (rooms === "studio" || rooms === "1") return 500;
      if (rooms === "2") return 850;
      if (rooms === "3") return 1400;
      if (rooms === "4") return 2200;
    }
    if (zone === "nouvelle") {
      if (rooms === "studio") return 350;
      if (rooms === "1") return 450;
      if (rooms === "2") return 650;
      if (rooms === "3") return 950;
      if (rooms === "4") return 1300;
    }
    if (zone === "immouzzer") {
      if (rooms === "studio") return 300;
      if (rooms === "1") return 400;
      if (rooms === "2") return 600;
      if (rooms === "3") return 850;
      if (rooms === "4") return 1200;
    }
    return 500;
  };

  const currentAdr = getAdr();
  const monthlyRevenue = Math.round((30 * (occupancy / 100)) * currentAdr);
  const yearlyRevenue = monthlyRevenue * 12;

  const handleSimulateToForm = () => {
    setFormData({
      ...formData,
      quartier: zone === "medina" ? dict.form.quartierMedina : zone === "nouvelle" ? dict.form.quartierVN : dict.form.quartierRoute,
      typeBien: propType === "appart" ? dict.form.propAppart : propType === "riad" ? dict.form.propRiad : dict.form.propVilla,
      message: `Estimation simulée : ${monthlyRevenue.toLocaleString('fr-FR')} MAD/mois.`
    });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const text = `Bonjour BABFEZ, je suis ${formData.name}. Je souhaite une estimation pour mon bien :
- Quartier: ${formData.quartier}
- Type: ${formData.typeBien}
- Surface: ${formData.surface ? formData.surface + ' m²' : 'Non spécifié'}
- Formule: ${formData.formule}
- Email: ${formData.email}
${formData.message ? `\nMessage: ${formData.message}` : ''}`;
    
    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      window.open(`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(text)}`, '_blank');
      setFormData({ name: "", email: "", phone: "", quartier: "", typeBien: "", surface: "", formule: dict.home.formula2Title, message: "", rgpd: false });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 800);
  };

  return (
    <div className="min-h-screen">
      {/* 1. Header & Navigation Fixe */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">Conciergerie & Intendance Privée</span>
            </div>
          </div>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#simulateur" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">{dict.nav.simulator}</a>
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">{dict.nav.services}</a>
            <a href="#atouts" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">{dict.nav.atouts}</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">{dict.nav.faq}</a>
            <Link href={`/${lang}/reserver`} className="text-sm font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">{dict.nav.book}</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <LanguageSwitcher currentLang={lang} />
              <div className="h-4 w-px bg-slate-300"></div>
              <CurrencySwitcher />
            </div>
            
            <Link href={`/${lang}/proprietaire/login`} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              {dict.nav.ownerSpace}
            </Link>



            <a href="/#simulateur" className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg">
              {dict.nav.estimate}
            </a>
          </div>

          <div className="flex items-center md:hidden gap-2">
            <CurrencySwitcher />
            <div className="h-4 w-px bg-slate-300"></div>
            <LanguageSwitcher currentLang={lang} />
            <button className="text-slate-600 ml-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">{dict.nav.simulator}</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">{dict.nav.services}</a>
            <Link href={`/${lang}/reserver`} onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-amber-600">{dict.nav.book}</Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-6 border border-amber-200">
            {dict.home.heroTag}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-950 mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
            {dict.home.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {dict.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#simulateur" className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-600 transition-colors shadow-xl shadow-amber-500/20">
              {dict.home.btnEstimate}
            </a>
            <a href="#services" className="bg-white text-slate-950 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:border-slate-300 transition-colors">
              {dict.home.btnServices}
            </a>
          </div>
        </div>
      </section>

      {/* 3. Simulateur de Revenus */}
      <section id="simulateur" className="py-20 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">{dict.home.simTitle}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{dict.home.simSubtitle}</p>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl max-w-4xl mx-auto border border-slate-200">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.home.simZone}</label>
                  <select value={zone} onChange={(e) => setZone(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-amber-500 transition-colors">
                    <option value="medina">{dict.form.quartierMedina}</option>
                    <option value="nouvelle">{dict.form.quartierVN}</option>
                    <option value="immouzzer">{dict.form.quartierRoute}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.sim.propType}</label>
                  <select value={propType} onChange={(e) => setPropType(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-amber-500 transition-colors">
                    <option value="appart">{dict.sim.propTypeAppart}</option>
                    <option value="riad">{dict.sim.propTypeRiad}</option>
                    <option value="villa">{dict.sim.propTypeVilla}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.home.simRooms}</label>
                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    {[
                      { id: "studio", label: dict.sim.roomStudio }, 
                      { id: "1", label: dict.sim.room1 }, 
                      { id: "2", label: dict.sim.room2 }, 
                      { id: "3", label: dict.sim.room3 }, 
                      { id: "4", label: dict.sim.room4 }
                    ].map((r) => (
                      <button key={r.id} onClick={() => setRooms(r.id as any)} className={`flex-1 py-2 px-2 text-xs rounded-xl font-bold transition-all ${rooms === r.id ? "bg-slate-950 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{r.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700">{dict.home.simOccupancy}</label>
                    <span className="text-sm font-extrabold text-amber-600">{occupancy}%</span>
                  </div>
                  <input type="range" min="30" max="95" value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col justify-center text-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block">{dict.home.simRevMonth}</span>
                <div className="text-5xl font-extrabold text-slate-950 mb-2">
                  {monthlyRevenue.toLocaleString('fr-FR')} <span className="text-2xl text-slate-400">MAD</span>
                </div>
                <div className="text-emerald-600 font-bold mb-6">Soit {yearlyRevenue.toLocaleString('fr-FR')} MAD {dict.home.simRevYear.split(' ')[1]}</div>
                <p className="text-xs text-slate-400 mb-6">{dict.home.simDisclaimer}</p>
                <button onClick={handleSimulateToForm} className="w-full block text-center bg-slate-950 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg cursor-pointer">
                  {dict.home.simContact}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Formules */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-950 mb-4">{dict.home.servicesTitle}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">{dict.home.servicesSubtitle}</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Formule 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.home.formula1Title}</h3>
              <div className="text-3xl font-extrabold text-amber-600 mb-6">{dict.home.formula1Price} <span className="text-sm text-slate-500 font-medium">TTC</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                {dict.home.formula1Features.map((feat, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 
                    {feat}
                  </li>
                ))}
                <li className="flex gap-3 text-slate-400 opacity-70">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg> 
                  <s>{dict.home.formula1Excluded}</s>
                </li>
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors">
                {dict.home.formula1Btn}
              </a>
            </div>

            {/* Formule 2 - Recommandée */}
            <div className="bg-slate-950 rounded-3xl p-8 border border-amber-600 shadow-2xl flex flex-col relative transform lg:-translate-y-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white font-bold px-4 py-1 rounded-full text-xs whitespace-nowrap">
                {dict.home.formula2Tag}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">{dict.home.formula2Title}</h3>
              <div className="text-3xl font-extrabold text-amber-500 mb-6">{dict.home.formula2Price} <span className="text-sm text-slate-400 font-medium">TTC</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                {dict.home.formula2Features.map((feat, idx) => (
                  <li key={idx} className="flex gap-3 text-white">
                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 
                    {idx === 0 ? <strong>{feat}</strong> : feat}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors shadow-lg">
                {dict.home.formula2Btn}
              </a>
            </div>

            {/* Formule Premium (NEW) */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-950 shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-950 text-white font-extrabold px-3 py-1 text-xs rounded-bl-xl">VIP</div>
              <h3 className="text-xl font-extrabold text-slate-950 mb-2">{dict.home.formulaPremiumTitle}</h3>
              <div className="text-3xl font-extrabold text-slate-950 mb-6">{dict.home.formulaPremiumPrice}</div>
              <ul className="space-y-4 mb-8 flex-1 text-sm">
                {dict.home.formulaPremiumFeatures.map((feat, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-slate-950 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 
                    {feat}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-950 text-slate-950 font-bold py-3 rounded-xl hover:bg-slate-950 hover:text-white transition-colors mt-auto">
                {dict.home.formulaPremiumBtn}
              </a>
            </div>

            {/* Formule 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-extrabold text-slate-950 mb-2">{dict.home.formula3Title}</h3>
              <div className="text-4xl font-extrabold text-slate-950 mb-6">{dict.home.formula3Price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {dict.home.formula3Features.map((feat, idx) => {
                  const parts = feat.split(' : ');
                  return (
                    <li key={idx} className="flex justify-between text-slate-600 border-b border-slate-50 pb-2">
                      <span>{parts[0]}</span> 
                      <strong>{parts[1] || ''}</strong>
                    </li>
                  );
                })}
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors mt-auto">
                {dict.home.formula3Btn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Atouts (Pourquoi BABFEZ) */}
      <section id="atouts" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 mb-4">{dict.home.atoutsTitle}</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">{dict.home.atoutsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: dict.home.atout1Title, desc: dict.home.atout1Desc, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: dict.home.atout2Title, desc: dict.home.atout2Desc, icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
              { title: dict.home.atout3Title, desc: dict.home.atout3Desc, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: dict.home.atout4Title, desc: dict.home.atout4Desc, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
            ].map((atout, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={atout.icon}/></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-3">{atout.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-4">{dict.home.faqTitle}</h2>
            <p className="text-slate-600 text-lg">{dict.home.faqSubtitle}</p>
          </div>
          <div className="space-y-4">
            {[
              { q: dict.home.faqQ1, a: dict.home.faqA1 },
              { q: dict.home.faqQ2, a: dict.home.faqA2 },
              { q: dict.home.faqQ3, a: dict.home.faqA3 }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full text-left px-6 py-5 font-bold text-slate-900 flex justify-between items-center focus:outline-none"
                >
                  {faq.q}
                  <svg className={`w-5 h-5 text-amber-600 transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact / Lead Gen */}
      <section id="contact" className="py-20 bg-amber-500 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold text-slate-950 mb-4 leading-tight">{dict.home.contactTitle}</h2>
              <p className="text-slate-600 font-medium mb-8">{dict.home.contactSubtitle}</p>
            </div>
            
            <div className="bg-slate-50 p-8 md:p-12 md:w-1/2">
              {submitSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{dict.home.formSuccess}</h3>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder={dict.home.formName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                    <input type="email" required placeholder={dict.form.email} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <input type="tel" required placeholder="+212 6..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.quartier} onChange={e => setFormData({...formData, quartier: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white">
                      <option value="" disabled>{dict.home.formZone}</option>
                      <option value={dict.form.quartierMedina}>{dict.form.quartierMedina}</option>
                      <option value={dict.form.quartierVN}>{dict.form.quartierVN}</option>
                      <option value={dict.form.quartierCC}>{dict.form.quartierCC}</option>
                      <option value={dict.form.quartierRoute}>{dict.form.quartierRoute}</option>
                      <option value={dict.form.quartierOther}>{dict.form.quartierOther}</option>
                    </select>
                    <select value={formData.typeBien} onChange={e => setFormData({...formData, typeBien: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white">
                      <option value="" disabled>{dict.form.type}</option>
                      <option value={dict.form.propAppart}>{dict.form.propAppart}</option>
                      <option value={dict.form.propRiad}>{dict.form.propRiad}</option>
                      <option value={dict.form.propVilla}>{dict.form.propVilla}</option>
                      <option value={dict.form.propBuilding}>{dict.form.propBuilding}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder={dict.form.surface} value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
                    <select value={formData.formule} onChange={e => setFormData({...formData, formule: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white">
                      <option value={dict.home.formula1Title}>{dict.home.formula1Title}</option>
                      <option value={dict.home.formula2Title}>{dict.home.formula2Title}</option>
                      <option value={dict.home.formulaPremiumTitle}>{dict.home.formulaPremiumTitle}</option>
                      <option value={dict.home.formula3Title}>{dict.home.formula3Title}</option>
                    </select>
                  </div>
                  <div>
                    <textarea placeholder={dict.home.formMsg} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none h-24 resize-none"></textarea>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="rgpd" required checked={formData.rgpd} onChange={e => setFormData({...formData, rgpd: e.target.checked})} className="mt-1" />
                    <label htmlFor="rgpd" className="text-xs text-slate-500">{dict.form.rgpd}</label>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70">
                    Demander mon audit gratuit sous 24h
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <p className="text-sm leading-relaxed">{dict.footer?.col1Desc || "Votre partenaire d'excellence pour la gestion locative courte durée et la conciergerie privée."}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-bold text-slate-300">
                {dict.footer?.col1Badge || "📍 Fès, Maroc"}
              </div>
            </div>

            {/* Colonne 2 : Services */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.col2Title || "Nos Services"}</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#services" className="hover:text-amber-500 transition-colors">{dict.home.formula1Title}</a></li>
                <li><a href="#services" className="hover:text-amber-500 transition-colors">{dict.home.formula2Title}</a></li>
                <li><a href="#services" className="hover:text-amber-500 transition-colors">{dict.home.formula3Title}</a></li>
                <li><a href="#simulateur" className="hover:text-amber-500 transition-colors text-amber-600 font-medium">Estimation gratuite</a></li>
              </ul>
            </div>

            {/* Colonne 3 : Navigation */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.col3Title || "Navigation"}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href={`/${lang}`} className="hover:text-amber-500 transition-colors">Accueil</Link></li>
                <li><Link href={`/${lang}/reserver`} className="hover:text-amber-500 transition-colors">Nos Logements</Link></li>
                <li><Link href={`/${lang}/proprietaire/login`} className="hover:text-amber-500 transition-colors">Espace Propriétaire</Link></li>
                <li><a href="#faq" className="hover:text-amber-500 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Colonne 4 : Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.col4Title || "Contact & Permanence"}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>{dict.footer?.address || "Fès, Maroc (Médina & Ville Nouvelle)"}</span>
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
                  <span>{dict.footer?.availability || "7j/7 — 24h/24 pour les urgences"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 border-t border-slate-800 pt-8 pb-12 md:pb-0">
            <div className="flex gap-4">
              <Link href={`/${lang}/admin/login`} className="opacity-40 hover:opacity-100 hover:text-amber-500 transition-all font-bold" title="Administration">🔒 Admin</Link>
              <Link href={`/${lang}/mentions-legales`} className="hover:text-amber-500 transition-colors">{dict.footer?.legal || "Mentions légales"}</Link>
              <Link href={`/${lang}/confidentialite`} className="hover:text-amber-500 transition-colors">{dict.footer?.privacy || "Politique de confidentialité"}</Link>
              <Link href={`/${lang}/conditions-generales`} className="hover:text-amber-500 transition-colors">{dict.footer?.tos || "Conditions Générales"}</Link>
            </div>
            <div className="flex items-center gap-2">
              &copy; 2026 BABFEZ Conciergerie.
            </div>
          </div>
        </div>
      </footer>

      {/* Bouton WhatsApp Flottant */}
      <a 
        href={`${CONTACT_INFO.whatsappLink}?text=Bonjour%20BABFEZ,%20je%20souhaite...`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 transition-all group"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
      </a>
    </div>
  );
}
