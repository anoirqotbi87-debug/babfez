"use client";

import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simulator State
  const [zone, setZone] = useState<"medina" | "nouvelle" | "immouzzer">("medina");
  const [rooms, setRooms] = useState<"1" | "2" | "3">("1");
  const [occupancy, setOccupancy] = useState(65);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    quartier: "",
    formule: "Sérénité",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const adrMatrix = {
    medina: { "1": 500, "2": 850, "3": 1400 },
    nouvelle: { "1": 450, "2": 650, "3": 950 },
    immouzzer: { "1": 400, "2": 600, "3": 850 },
  };

  const currentAdr = adrMatrix[zone][rooms];
  const monthlyRevenue = Math.round((30 * (occupancy / 100)) * currentAdr);
  const yearlyRevenue = monthlyRevenue * 12;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const text = `Bonjour BABFEZ, je suis ${formData.name}. Je souhaite une estimation pour mon bien situé à ${formData.quartier} (Formule ${formData.formule}). ${formData.message ? `Détails: ${formData.message}` : ''}`;
    
    // Simulate network delay for better UX
    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      window.open(`https://wa.me/212778874114?text=${encodeURIComponent(text)}`, '_blank');
      setFormData({ name: "", phone: "", quartier: "", formule: "Sérénité", message: "" });
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
              {/* Arche marocaine / Porte fassie SVG */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V10a8 8 0 0 1 16 0v11"/>
                <path d="M9 21v-7a3 3 0 0 1 6 0v7"/>
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">Conciergerie & Intendance Privée</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#simulateur" className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors">Simulateur</a>
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors">Services</a>
            <a href="#atouts" className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors">Atouts</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors">FAQ</a>
            <a href="/reserver" className="bg-amber-100 text-amber-800 px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-200 transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Réserver un séjour
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="https://wa.me/212778874114?text=Bonjour%20BABFEZ,%20je%20souhaite%20une%20estimation%20pour%20mon%20bien%20à%20Fès" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
              WhatsApp
            </a>
            <a href="#simulateur" className="bg-slate-950 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              Estimer mon bien
            </a>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <a href="/reserver" onClick={() => setIsMobileMenuOpen(false)} className="block bg-amber-100 text-amber-800 text-center px-4 py-2.5 rounded-lg font-bold shadow-sm">
              ✈️ Réserver un séjour
            </a>
            <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">Simulateur</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">Services</a>
            <a href="#atouts" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">Atouts</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">FAQ</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <a href="https://wa.me/212778874114" className="flex justify-center items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold">WhatsApp Direct</a>
              <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-slate-950 text-white px-4 py-2.5 rounded-lg font-semibold">Estimer mon bien</a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-950 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548041926-e10f4dc79496?q=80&w=2000&auto=format&fit=crop" 
            alt="Architecture Fès Riad" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-bold mb-8 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            BABFEZ • Gestion locative courte durée à Fès
          </div>
          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Ouvrez grand les portes de vos <span className="text-amber-500 drop-shadow-md">revenus locatifs.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 font-medium">
            Confiez-nous l'intendance complète de votre appartement ou Riad à Fès. Accueil personnalisé, ménage hôtelier, fiches de police et tarification dynamique.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a href="#simulateur" className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200">
              Estimer mes revenus en 1 clic
            </a>
            <a href="#services" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
              Découvrir nos formules
            </a>
          </div>

          {/* 3 KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-y border-slate-800/60 py-8 bg-slate-900/30 backdrop-blur-sm rounded-3xl">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white mb-2">+40%</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Revenu moyen vs location nue</span>
            </div>
            <div className="flex flex-col items-center md:border-x border-slate-800/60">
              <span className="text-4xl font-extrabold text-white mb-2">100%</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Fiches de police & Conformité</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white mb-2">24/7</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Assistance voyageurs multilingue</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Simulateur Section */}
      <section id="simulateur" className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Combien pourriez-vous gagner ?</h2>
            <p className="text-slate-400 text-lg">Simulez vos revenus locatifs avec la méthode BABFEZ.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contrôles */}
            <div className="space-y-8 bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Quartier du bien</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "medina", label: "Médina / Riad" },
                    { id: "nouvelle", label: "Ville Nouvelle" },
                    { id: "immouzzer", label: "Route d'Immouzzer" }
                  ].map(z => (
                    <button
                      key={z.id}
                      onClick={() => setZone(z.id as any)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${zone === z.id ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Typologie du bien</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "1", label: "1 Ch / Studio" },
                    { id: "2", label: "2 Chambres" },
                    { id: "3", label: "3 Ch / Riad" }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRooms(r.id as any)}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${rooms === r.id ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Taux d'occupation estimé</label>
                  <span className="text-amber-500 font-bold">{occupancy}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="85" 
                  value={occupancy} 
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Pessimiste (40%)</span>
                  <span>Optimiste (85%)</span>
                </div>
              </div>
            </div>

            {/* Résultat */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <span className="text-amber-100 font-bold uppercase tracking-widest text-sm mb-4 block">Revenu Mensuel Estimé</span>
                <div className="text-5xl md:text-7xl font-extrabold text-white mb-2 drop-shadow-md">
                  {monthlyRevenue.toLocaleString('fr-FR')} <span className="text-3xl md:text-4xl text-amber-200">MAD</span>
                </div>
                <div className="text-amber-100 font-medium text-lg mt-6 bg-white/10 inline-block px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  Projection Annuelle : <strong>{yearlyRevenue.toLocaleString('fr-FR')} MAD</strong>
                </div>
                
                <p className="text-amber-100/80 text-sm mt-8 mb-8">
                  *Estimation basée sur la moyenne du marché local (prix moyen par nuit: {currentAdr} MAD).
                </p>

                <a href="#contact" className="inline-block w-full bg-slate-950 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-slate-900 transition-colors shadow-xl">
                  Recevoir mon audit personnalisé
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grille Tarifaire */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 mb-4">Nos Formules de Gestion</h2>
            <p className="text-slate-600 text-lg">Transparentes et alignées sur vos intérêts.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Formule 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-extrabold text-slate-950 mb-2">Gestion Digitale</h3>
              <div className="text-4xl font-extrabold text-amber-600 mb-6">15% <span className="text-base text-slate-500 font-medium">TTC</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-slate-600"><svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Gestion des annonces (AirBnb, Booking)</li>
                <li className="flex gap-3 text-slate-600"><svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Yield management (optimisation des prix)</li>
                <li className="flex gap-3 text-slate-600"><svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Communication voyageurs 24/7</li>
                <li className="flex gap-3 text-slate-400 opacity-70"><svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg> <s>Accueil physique et ménage</s></li>
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors">Choisir Digital</a>
            </div>

            {/* Formule 2 - Recommandée */}
            <div className="bg-slate-950 rounded-3xl p-8 border border-amber-600 shadow-2xl flex flex-col relative transform lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white font-bold px-4 py-1 rounded-full text-sm">
                ⭐ Recommandé
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Gestion Sérénité</h3>
              <div className="text-4xl font-extrabold text-amber-500 mb-6">20-25% <span className="text-base text-slate-400 font-medium">TTC</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-300">
                <li className="flex gap-3 text-white"><svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> <strong>100% de la Gestion Digitale</strong></li>
                <li className="flex gap-3"><svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Accueil physique & fiches de police</li>
                <li className="flex gap-3"><svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Ménage hôtelier & blanchisserie</li>
                <li className="flex gap-3"><svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Maintenance et gestion des artisans</li>
              </ul>
              <a href="#contact" className="block text-center bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition-colors shadow-lg">Déléguer à 100%</a>
            </div>

            {/* Formule 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-extrabold text-slate-950 mb-2">Services à la carte</h3>
              <div className="text-4xl font-extrabold text-slate-950 mb-6">Tarif fixe</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex justify-between text-slate-600"><span>Check-in (Accueil)</span> <strong>150 MAD</strong></li>
                <li className="flex justify-between text-slate-600"><span>Check-out</span> <strong>100 MAD</strong></li>
                <li className="flex justify-between text-slate-600"><span>Audit & Photos Pro</span> <strong>Sur devis</strong></li>
                <li className="flex justify-between text-slate-600"><span>Intervention urgence</span> <strong>Sur devis</strong></li>
              </ul>
              <a href="#contact" className="block text-center border-2 border-slate-200 text-slate-950 font-bold py-3 rounded-xl hover:border-slate-950 transition-colors">Demander un service</a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Atouts (Pourquoi BABFEZ) */}
      <section id="atouts" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 mb-4">L'excellence opérationnelle</h2>
            <p className="text-slate-600 text-lg">Ce qui fait la différence pour vos voyageurs et vos revenus.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Conformité légale", desc: "Nous gérons rigoureusement les fiches de police et les obligations légales au Maroc pour votre tranquillité d'esprit.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Yield Management", desc: "Ajustement quotidien de vos prix selon la demande, les événements locaux et la saisonnalité pour maximiser la rentabilité.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { title: "Standard Hôtelier", desc: "Ménage professionnel, linge de maison de qualité, kits d'accueil et propreté irréprochable avant chaque arrivée.", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
              { title: "Artisans Réactifs", desc: "Un réseau local de confiance à Fès pour intervenir immédiatement sur la plomberie, l'électricité ou la climatisation.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" }
            ].map((atout, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={atout.icon}/></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-3">{atout.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm">{atout.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-4">Questions Fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Comment s'effectue le versement des loyers ?", a: "Nous mettons à votre disposition un tableau de bord en ligne détaillé. Les versements sont effectués mensuellement sur votre compte bancaire, accompagnés d'un compte-rendu transparent de toutes les réservations et des frais." },
              { q: "Puis-je occuper mon bien quand je le souhaite ?", a: "Absolument. Il s'agit de votre propriété. Il vous suffit de bloquer les dates souhaitées sur le calendrier à l'avance pour profiter de votre appartement ou Riad." },
              { q: "Comment êtes-vous protégés contre les dégradations ?", a: "Nous exigeons une caution pour chaque réservation et nous nous appuyons sur les programmes de protection des plateformes (comme AirCover d'Airbnb). Un état des lieux strict est réalisé après chaque départ par nos équipes de ménage." }
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
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Formulaire de Contact */}
      <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-5/12 bg-amber-600 p-10 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-extrabold mb-4">Prêt à déléguer ?</h3>
                <p className="text-amber-100 mb-8">Remplissez ce formulaire pour recevoir un audit gratuit de votre bien à Fès.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <span>contact@babfez.ma</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>Fès, Maroc</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-7/12 p-10 bg-white">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nom & Prénom</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Téléphone / WhatsApp</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="+212 6..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Quartier</label>
                    <input required type="text" value={formData.quartier} onChange={e => setFormData({...formData, quartier: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="Ex: Médina" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Formule</label>
                    <select value={formData.formule} onChange={e => setFormData({...formData, formule: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white">
                      <option>Sérénité (100%)</option>
                      <option>Digitale (15%)</option>
                      <option>À la carte</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Détails de votre bien</label>
                  <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none" placeholder="Nombre de chambres, équipements..."></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 ${isSubmitting ? 'bg-slate-600 text-slate-300 cursor-not-allowed' : submitSuccess ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      Demande envoyée !
                    </>
                  ) : (
                    <>
                      Demander mon audit
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
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
            <div className="flex gap-6 text-slate-400 font-semibold text-sm">
              <a href="#simulateur" className="hover:text-amber-500 transition-colors">Simulateur</a>
              <a href="#services" className="hover:text-amber-500 transition-colors">Services</a>
              <a href="#faq" className="hover:text-amber-500 transition-colors">FAQ</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">
            &copy; 2026 BABFEZ Conciergerie Fès. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Bouton WhatsApp Flottant */}
      <a 
        href="https://wa.me/212778874114?text=Bonjour%20BABFEZ,%20je%20souhaite%20une%20estimation%20pour%20mon%20bien%20à%20Fès" 
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
