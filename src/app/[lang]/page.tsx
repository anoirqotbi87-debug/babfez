"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { CONTACT_INFO } from "@/config/site";
import { supabase } from "@/lib/supabaseClient";
import Footer from "@/components/Footer";

const dicts = { fr, en, es, ar };

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const baseDict = dicts[lang as keyof typeof dicts] || dicts.fr;
  const dict: any = { ...dicts.fr, ...baseDict };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simulator State
  const [zone, setZone] = useState("Atlas");
  const [propType, setPropType] = useState("Appartement F2");
  const [rooms, setRooms] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Estimation logic
  const getEstimation = () => {
    let baseLoyer = 4000;
    if (zone === "Médina (Riad de charme)") baseLoyer = 8000;
    else if (zone === "Médina (Bab Boujloud / Batha)") baseLoyer = 5000;
    else if (zone === "Route d'Immouzzer") baseLoyer = 6000;

    if (propType === "Studio / F1") baseLoyer *= 0.8;
    if (propType === "Appartement F3/F4") baseLoyer *= 1.4;
    if (propType === "Riad Traditionnel") baseLoyer *= 1.8;

    baseLoyer += (rooms - 1) * 500;

    const brutSaisonnier = baseLoyer * 2.1; // Saisonnier est plus rentable
    const commission = brutSaisonnier * 0.20;
    const net = brutSaisonnier - commission;

    return { baseLoyer, brutSaisonnier, commission, net };
  };

  const { baseLoyer, brutSaisonnier, commission, net } = getEstimation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          zone: zone,
          property_type: propType,
          formula: "Formule Unique 20%",
          message: `Simulation: Brut ${brutSaisonnier} MAD / Net ${net} MAD (Chambres: ${rooms})`
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        window.open(data.waLink, '_blank');
        setFormData({ name: "", phone: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Erreur lors de l'envoi.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B2545] font-sans selection:bg-[#C59B27] selection:text-white">
      
      {/* NAVBAR */}
      <header className="fixed w-full top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#0B2545]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={`/${lang}`} className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-widest text-[#0B2545] uppercase leading-none">BABFEZ</span>
            <span className="text-[10px] text-[#C59B27] font-bold tracking-widest uppercase mt-1">Conciergerie Privée • Fès</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#services" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">Services</a>
            <a href="#quartiers" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">Quartiers</a>
            <a href="#simulateur" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">Simulateur</a>
            <a href="#tarifs" className="text-sm font-semibold text-[#134074] hover:text-[#C59B27] transition-colors">Tarifs</a>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link href={`/${lang}/proprietaire/login`} className="text-sm font-bold text-[#0B2545] hover:text-[#C59B27] transition-colors">
              Espace Propriétaire
            </Link>
            <a href="https://wa.me/212778874114?text=Bonjour%20BABFEZ,%20je%20souhaite%20des%20informations%20pour%20mon%20bien%20à%20Fès" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1DA851] transition-colors shadow-lg shadow-[#25D366]/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
              WhatsApp
            </a>
          </div>

          <button className="lg:hidden text-[#0B2545]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-4">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#0B2545]">Services</a>
            <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-[#0B2545]">Simulateur</a>
            <Link href={`/${lang}/proprietaire/login`} className="block font-bold text-[#C59B27]">Espace Propriétaire</Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0B2545]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight max-w-5xl mx-auto leading-tight">
            Maximisez les revenus de votre bien à Fès. <span className="text-[#C59B27]">Zéro charge mentale.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            Gestion locative saisonnière complète pour propriétaires et résidents à l'étranger (MRE). Commercialisation multicanale, intendance hôtelière 24/7 et conformité fiches de police garantie.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">✨ +35% à +50% de revenus nets vs location classique</span>
            <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">🏆 100% au succès : 0 MAD de frais fixe</span>
            <span className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">🔐 Remise des clés & fiches DGSN conformes</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#simulateur" className="bg-[#C59B27] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#B38920] transition-all shadow-xl shadow-[#C59B27]/30 transform hover:-translate-y-1">
              Simuler mes revenus à Fès
            </a>
            <a href="https://wa.me/212778874114?text=Bonjour%20BABFEZ,%20je%20souhaite%20réserver%20mon%20audit%20technique" target="_blank" rel="noreferrer" className="bg-white text-[#0B2545] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all border border-transparent hover:border-[#0B2545]/10">
              Réserver mon audit gratuit sous 24h
            </a>
          </div>
        </div>
      </section>

      {/* 4 PILIERS (SERVICES) */}
      <section id="services" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] mb-4">L'Excellence de l'Intendance</h2>
            <p className="text-[#134074] text-lg max-w-2xl mx-auto font-medium">Nos 4 piliers pour une gestion premium et sans soucis.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-[#C59B27]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#0B2545] text-[#C59B27] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mb-3">Commercialisation Multicanale & Tarification Dynamique</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Optimisation continue des prix nuitée sur Airbnb, Booking et réservations directes pour maximiser le taux d'occupation selon la saisonnalité fassie.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-[#C59B27]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#0B2545] text-[#C59B27] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mb-3">Accueil Personnalisé & Fiches DGSN</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Prise en charge des formalités légales marocaines, vérification rigoureuse des passeports et accueil chaleureux physique ou par boîte à clés sécurisée.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-[#C59B27]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#0B2545] text-[#C59B27] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mb-3">Ménage Hôtelier & Blanchisserie Pro</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Rotation avec 3 jeux de draps professionnels, nettoyage en profondeur désinfecté et contrôle qualité transmis via WhatsApp avec 5 photos avant chaque check-in.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-[#C59B27]/50 transition-colors group">
              <div className="w-14 h-14 bg-[#0B2545] text-[#C59B27] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0B2545] mb-3">Maintenance & Intendance 24/7</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Réactivité locale immédiate. Intervention sous 2h en cas d'urgence (plomberie, climatisation réversible, perte de clés ou coupure fibre optique).</p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMULATEUR DE RENTABILITÉ */}
      <section id="simulateur" className="py-24 bg-[#0B2545] text-white relative">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Simulateur de Rentabilité</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">Découvrez combien votre bien à Fès peut vous rapporter en courte durée.</p>
          </div>

          <div className="bg-white text-[#0B2545] rounded-3xl p-6 md:p-12 shadow-2xl max-w-6xl mx-auto border-4 border-[#C59B27]/20 flex flex-col lg:flex-row gap-12">
            
            {/* Colonne Gauche: Inputs */}
            <div className="flex-1 space-y-8">
              <div>
                <label className="block text-sm font-bold text-[#134074] uppercase tracking-wider mb-3">1. Quartier du bien</label>
                <select value={zone} onChange={e => setZone(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-lg outline-none focus:border-[#C59B27] transition-colors">
                  <option value="Atlas">Atlas</option>
                  <option value="Champs de Course">Champs de Course</option>
                  <option value="Route d'Immouzzer">Route d'Immouzzer</option>
                  <option value="Médina (Bab Boujloud / Batha)">Médina (Bab Boujloud / Batha)</option>
                  <option value="Médina (Riad de charme)">Médina (Riad de charme)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134074] uppercase tracking-wider mb-3">2. Type de bien</label>
                <select value={propType} onChange={e => setPropType(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-bold text-lg outline-none focus:border-[#C59B27] transition-colors">
                  <option value="Studio / F1">Studio / F1</option>
                  <option value="Appartement F2">Appartement F2</option>
                  <option value="Appartement F3/F4">Appartement F3/F4</option>
                  <option value="Riad Traditionnel">Riad Traditionnel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134074] uppercase tracking-wider mb-3">3. Nombre de chambres</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button 
                      key={num} 
                      onClick={() => setRooms(num)}
                      className={`w-14 h-14 rounded-2xl font-extrabold text-xl transition-all ${rooms === num ? 'bg-[#0B2545] text-[#C59B27] shadow-lg scale-105 border-2 border-[#C59B27]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-2 border-transparent'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne Droite: Résultats & Lead */}
            <div className="flex-1 bg-[#FDFBF7] rounded-3xl p-8 border border-[#C59B27]/30 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#C59B27] text-white px-4 py-1 rounded-bl-2xl font-black text-sm tracking-widest shadow-md">
                +35% à +55% NET
              </div>
              
              <div className="space-y-6 mb-8 flex-1">
                <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-sm font-bold text-slate-500">Loyer classique (Longue durée)</div>
                    <div className="text-xl font-bold text-slate-400">~{baseLoyer.toLocaleString('fr-FR')} MAD / mois</div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-sm font-bold text-slate-500">Revenu saisonnier brut estimé</div>
                    <div className="text-2xl font-extrabold text-[#0B2545]">{brutSaisonnier.toLocaleString('fr-FR')} MAD</div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-sm font-bold text-rose-500">Commission BABFEZ (20%)</div>
                    <div className="text-xl font-bold text-rose-500">-{commission.toLocaleString('fr-FR')} MAD</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-sm font-black uppercase text-[#134074] tracking-wider mb-1">Revenu Net Propriétaire (Dans votre poche)</div>
                  <div className="text-5xl font-black text-[#25D366] drop-shadow-sm">{net.toLocaleString('fr-FR')} MAD<span className="text-lg text-slate-500 font-bold ml-2">/ mois</span></div>
                </div>
              </div>

              {/* Formulaire Lead */}
              {submitSuccess ? (
                <div className="bg-[#25D366]/10 text-[#1DA851] p-6 rounded-2xl text-center font-bold border border-[#25D366]/20">
                  Demande envoyée avec succès ! Redirection WhatsApp en cours...
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input type="text" required placeholder="Nom & Prénom" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#C59B27] outline-none font-medium" />
                  <input type="tel" required placeholder="Numéro de Téléphone (WhatsApp)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#C59B27] outline-none font-medium" />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#0B2545] text-white font-extrabold py-4 rounded-xl hover:bg-[#134074] transition-colors shadow-xl disabled:opacity-50">
                    Valider et recevoir l'audit technique
                  </button>
                  <p className="text-xs text-center text-slate-400 font-medium">Vos données sont protégées selon la Loi 09-08 (CNDP).</p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* TARIFICATION & FOOTER */}
      <footer id="tarifs" className="bg-[#0B2545] text-white pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-[#C59B27] to-[#B38920] rounded-3xl p-10 md:p-16 text-center mb-20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10 mix-blend-overlay"></div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-md">Une formule unique à 20% TTC.</h2>
            <p className="text-xl md:text-2xl font-bold text-white/90 drop-shadow-sm">Aucun abonnement, aucun engagement, aucune avance de frais.</p>
            <p className="mt-4 font-medium text-white/80">Nous gagnons de l'argent uniquement quand vous en gagnez.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16 border-b border-white/10 pb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#C59B27]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
                </div>
                <div>
                  <span className="text-2xl font-extrabold tracking-widest text-white uppercase leading-none block">BABFEZ</span>
                  <span className="text-[10px] text-[#C59B27] font-bold tracking-widest uppercase">Conciergerie Privée</span>
                </div>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                Le partenaire d'excellence pour la gestion de votre bien immobilier à Fès.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contact Direct</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Fès, Maroc (Médina & Ville Nouvelle)
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  +212 7 78 87 41 14 (WhatsApp 24/7)
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Légal & CNDP</h4>
              <p className="text-slate-400 font-medium text-sm leading-relaxed mb-4">
                BABFEZ traite vos données personnelles conformément à la Loi marocaine 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.
              </p>
              <div className="flex gap-4 text-xs font-bold text-[#C59B27]">
                <Link href={`/${lang}/mentions-legales`} className="hover:text-white transition-colors">Mentions Légales</Link>
                <Link href={`/${lang}/confidentialite`} className="hover:text-white transition-colors">Confidentialité</Link>
              </div>
            </div>
          </div>
          
          <div className="text-center text-slate-500 text-sm font-bold">
            © {new Date().getFullYear()} BABFEZ. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
