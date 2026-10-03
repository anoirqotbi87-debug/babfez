"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Currency, formatPrice, convertFromMAD } from "@/config/currencies";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { CONTACT_INFO } from "@/config/site";
import dynamic from 'next/dynamic';
import Footer from "@/components/Footer";
import Navbar from "@/components/layout/Navbar";
import { PROPERTIES, DEFAULT_FALLBACK_IMAGE } from "@/data/properties";

const PropertiesMap = dynamic(() => import('@/components/PropertiesMap'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold rounded-2xl md:rounded-l-none">Chargement de la carte...</div>
});

const dicts = { fr, en, es, ar };

const MOCK_CATALOG = PROPERTIES;

const UPSELL_SERVICES = [
  {
    id: "airport",
    icon: "🚖",
    title: "Transfert VIP Aéroport Fès-Saïss",
    titleEn: "VIP Fès-Saïss Airport Transfer",
    titleEs: "Traslado VIP Aeropuerto Fez-Saïss",
    titleAr: "توصيل VIP من/إلى مطار فاس سايس",
    priceMAD: 200,
    pricingType: "flat" as const,
    badge: "+200 MAD"
  },
  {
    id: "guide",
    icon: "🏛️",
    title: "Visite Guidée Privée de la Médina",
    titleEn: "Private Medina Guided Tour",
    titleEs: "Visita Guiada Privada por la Medina",
    titleAr: "جولة خاصة مع مرشد في المدينة القديمة",
    priceMAD: 350,
    pricingType: "flat" as const,
    badge: "+350 MAD"
  },
  {
    id: "breakfast",
    icon: "☕",
    title: "Petit-déjeuner Traditionnel Fassi",
    titleEn: "Traditional Fassi Breakfast",
    titleEs: "Desayuno Tradicional Fassi",
    titleAr: "فطور فاسي تقليدي فاخر",
    priceMAD: 80,
    pricingType: "per_person_per_day" as const,
    badge: "+80 MAD / pers / jour"
  },
  {
    id: "excursion",
    icon: "⛰️",
    title: "Excursion Journée Chefchaouen ou Meknès/Volubilis",
    titleEn: "Day Trip to Chefchaouen or Meknes/Volubilis",
    titleEs: "Excursión de un día a Chefchaouen o Meknes/Volubilis",
    titleAr: "رحلة يوم كامل إلى شفشاون أو مكناس/وليلى",
    priceMAD: 600,
    pricingType: "flat" as const,
    badge: "+600 MAD"
  }
];

export default function Reserver({ params }: { params: { lang: string } }) {
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
  const [activeHash, setActiveHash] = useState("");
  const [searchZone, setSearchZone] = useState("Tous");
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  
  const [activeCurrency, setActiveCurrency] = useState<Currency>('MAD');
  
  // Upsells State
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  
  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial currency load
    const saved = localStorage.getItem('babfez_currency') as Currency;
    if (saved && ['MAD', 'EUR', 'USD'].includes(saved)) {
      setActiveCurrency(saved);
    }

    // Listen to changes from CurrencySwitcher
    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('babfez_currency') as Currency;
      if (updated && ['MAD', 'EUR', 'USD'].includes(updated)) {
        setActiveCurrency(updated);
      }
    };
    window.addEventListener('currencyChange', handleCurrencyChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);
  
  const [selectedProperty, setSelectedProperty] = useState<typeof MOCK_CATALOG[0] | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    adults: "2",
    children: "0",
    name: "",
    email: "",
    phone: "",
    arrival: "14h-16h",
    requests: ""
  });

  const getDaysDiff = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffDays = Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = getDaysDiff(bookingDetails.startDate, bookingDetails.endDate);

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculateUpsellMAD = (upsellId: string) => {
    const s = UPSELL_SERVICES.find(u => u.id === upsellId);
    if (!s) return 0;
    if (s.pricingType === "per_person_per_day") {
      const numAdults = Number(bookingDetails.adults) || 1;
      const stayDays = nights > 0 ? nights : 1;
      return s.priceMAD * numAdults * stayDays;
    }
    return s.priceMAD;
  };

  const totalUpsellsMAD = selectedUpsells.reduce((acc, id) => acc + calculateUpsellMAD(id), 0);
  const baseStayMAD = selectedProperty ? (nights * selectedProperty.price) : 0;
  const cleaningMAD = selectedProperty ? selectedProperty.cleaningFee : 0;
  const totalAmountMAD = selectedProperty ? (baseStayMAD + cleaningMAD + totalUpsellsMAD) : 0;
  const totalAmountConverted = convertFromMAD(totalAmountMAD, activeCurrency);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || nights <= 0) return;
    
    let totalText = `${totalAmountMAD} MAD`;
    if (activeCurrency !== 'MAD') {
      totalText = `${formatPrice(totalAmountConverted, activeCurrency)} (~${totalAmountMAD} MAD)`;
    }

    const optionsList = selectedUpsells.map(id => {
      const u = UPSELL_SERVICES.find(x => x.id === id);
      const title = lang === 'ar' ? u?.titleAr : lang === 'en' ? u?.titleEn : lang === 'es' ? u?.titleEs : u?.title;
      return `${u?.icon} ${title} (+${calculateUpsellMAD(id)} MAD)`;
    }).join(', ');

    const optionsText = optionsList ? `\nOptions choisies : ${optionsList}` : '';

    const text = `Bonjour BABFEZ, je souhaite réserver ${selectedProperty.title} du ${formatDate(bookingDetails.startDate)} au ${formatDate(bookingDetails.endDate)} pour ${bookingDetails.adults} Adulte(s) et ${bookingDetails.children} Enfant(s).${optionsText}\nNom: ${bookingDetails.name}\nEmail: ${bookingDetails.email}\nArrivée: ${bookingDetails.arrival}\nDemandes: ${bookingDetails.requests || 'Aucune'}\nTotal devis avec options: ${totalText}.`;
    window.open(`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(text)}`, '_blank');
    setSelectedProperty(null);
    setSelectedUpsells([]);
  };

  const filteredCatalog = searchZone === "Tous" ? MOCK_CATALOG : MOCK_CATALOG.filter(p => p.zone.includes(searchZone));

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#2D3748] font-sans">
      <Navbar lang={lang} dict={dict} showReserveButton={false} />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1548041926-e10f4dc79496?q=80&w=2000&auto=format&fit=crop" alt="Fès" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {dict.booking.searchTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            {dict.reserver.heroSubtitle}
          </p>

          <div className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto text-slate-900">
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.booking.checkIn}</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.booking.checkOut}</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.booking.guests}</label>
              <select className="w-full bg-transparent text-slate-950 font-bold focus:outline-none cursor-pointer">
                <option>2 {dict.reserver.searchGuestPlural}</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-amber-500 text-white p-4 rounded-2xl md:rounded-full font-bold hover:bg-amber-600 transition-colors shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full max-w-[1920px] mx-auto border-t border-slate-200">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* CATALOGUE (Left side) */}
          <div className={`w-full lg:w-[60%] p-4 sm:p-6 lg:p-10 overflow-y-auto ${!showMapOnMobile ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">{dict.reserver.catalogTitle}</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {filteredCatalog.map(prop => (
                <div key={prop.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img src={prop.image} alt={prop.title} onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE; }} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-extrabold text-xl text-slate-950 mb-1">{prop.title}</h3>
                      <p className="text-slate-500 text-sm font-medium">
                        {prop.guests} {dict.reserver.guests} • {prop.bedrooms} {prop.bedrooms > 1 ? dict.reserver.bedroomsPlural : dict.reserver.bedrooms}
                      </p>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-50">
                      <div>
                        <span className="text-2xl font-extrabold text-slate-950">{formatPrice(convertFromMAD(prop.price, activeCurrency), activeCurrency)}</span>
                        <span className="text-slate-500 text-sm font-medium"> {dict.reserver.pricePerNight}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedProperty(prop);
                          setSelectedUpsells([]);
                        }} 
                        className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 shadow-md"
                      >
                        {dict.reserver.btnReserve}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAP (Right side fixed) */}
          <div className={`w-full lg:w-[40%] lg:sticky lg:top-0 lg:h-screen z-10 ${showMapOnMobile ? 'block h-[calc(100vh-80px)]' : 'hidden lg:block'}`}>
            <PropertiesMap 
              properties={filteredCatalog} 
              activeCurrency={activeCurrency} 
              formatPrice={formatPrice} 
              convertFromMAD={convertFromMAD} 
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
                setSelectedUpsells([]);
              }} 
            />
          </div>
        </div>

        {/* MOBILE MAP TOGGLE */}
        <button 
          onClick={() => setShowMapOnMobile(!showMapOnMobile)}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border border-white/20"
        >
          {showMapOnMobile ? 'Voir la liste 📋' : 'Voir la carte 🗺️'}
        </button>
      </section>

      {/* SECTION EXPERIENCES LOCALES */}
      <section id="experiences" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-950 mb-4">{dict.reserver.expTitle}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              {dict.reserver.expSubtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6 text-3xl shadow-inner">🏺</div>
              <h3 className="font-extrabold text-xl text-slate-950 mb-3">{dict.reserver.exp1Title}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{dict.reserver.exp1Desc}</p>
              <a href={`${CONTACT_INFO.whatsappLink}?text=Bonjour%20BABFEZ,%20je%20souhaite%20réserver%20une%20expérience`} target="_blank" rel="noreferrer" className="mt-auto text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 text-3xl shadow-inner">🐪</div>
              <h3 className="font-extrabold text-xl text-slate-950 mb-3">{dict.reserver.exp2Title}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{dict.reserver.exp2Desc}</p>
              <a href={`${CONTACT_INFO.whatsappLink}?text=Bonjour%20BABFEZ,%20je%20souhaite%20réserver%20une%20expérience`} target="_blank" rel="noreferrer" className="mt-auto text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6 text-3xl shadow-inner">🥘</div>
              <h3 className="font-extrabold text-xl text-slate-950 mb-3">{dict.reserver.exp3Title}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{dict.reserver.exp3Desc}</p>
              <a href={`${CONTACT_INFO.whatsappLink}?text=Bonjour%20BABFEZ,%20je%20souhaite%20réserver%20une%20expérience`} target="_blank" rel="noreferrer" className="mt-auto text-rose-600 font-bold hover:text-rose-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} dict={dict} />

      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row my-8 max-h-[90vh] overflow-hidden">
            
            {/* Colonne Gauche Résumé & Tarification */}
            <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-extrabold text-slate-900">{selectedProperty.title}</h3>
                <button onClick={() => setSelectedProperty(null)} className="md:hidden text-slate-400 hover:text-slate-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <img src={selectedProperty.image} alt={selectedProperty.title} onError={(e) => { e.currentTarget.src = DEFAULT_FALLBACK_IMAGE; }} className="w-full h-40 object-cover rounded-2xl mb-6 shadow-sm shrink-0" />
              
              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>{dict.booking.perNight} ({nights > 0 ? nights : 1} {nights > 1 ? 'nuits' : 'nuit'})</span>
                  <span className="font-bold text-slate-900">{formatPrice(convertFromMAD(baseStayMAD, activeCurrency), activeCurrency)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{dict.booking.cleaningFee}</span>
                  <span className="font-bold text-slate-900">{formatPrice(convertFromMAD(selectedProperty.cleaningFee, activeCurrency), activeCurrency)}</span>
                </div>

                {/* Subtotal Options Additionnelles */}
                {selectedUpsells.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[#B85D36] font-bold">
                    <span>Options choisies ({selectedUpsells.length}) :</span>
                    <span>+{formatPrice(convertFromMAD(totalUpsellsMAD, activeCurrency), activeCurrency)}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm mb-4 shadow-sm">
                  <div className="flex justify-between items-baseline font-extrabold text-base mb-1">
                    <span>{dict.booking.totalStay}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-xl text-[#B85D36]">{formatPrice(totalAmountConverted, activeCurrency)}</span>
                      {activeCurrency !== 'MAD' && (
                        <span className="text-xs font-semibold text-amber-700 opacity-80">~{totalAmountMAD} MAD</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-amber-800">{dict.reserver.modalNotice.replace('{nights}', (nights > 0 ? nights : 1).toString())}</span>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium mb-3">{dict.reserver.modalDisclaimer}</p>
                <Link 
                  href={`/${lang}/guide/${selectedProperty.id}`} 
                  target="_blank"
                  className="block w-full text-center text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 py-2.5 rounded-xl transition-colors"
                >
                  Voir le Livret d'Accueil (Test)
                </Link>
              </div>
            </div>

            {/* Colonne Droite Formulaire & Upsells */}
            <div className="w-full md:w-7/12 p-6 md:p-8 relative overflow-y-auto">
              <button onClick={() => setSelectedProperty(null)} className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              <h4 className="text-xl font-extrabold text-slate-950 mb-5">{dict.reserver.modalFormTitle}</h4>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.booking.checkIn}</label>
                    <input type="date" required value={bookingDetails.startDate} onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.booking.checkOut}</label>
                    <input type="date" required value={bookingDetails.endDate} onChange={e => setBookingDetails({...bookingDetails, endDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.booking.adults}</label>
                    <select value={bookingDetails.adults} onChange={e => setBookingDetails({...bookingDetails, adults: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.booking.children}</label>
                    <select value={bookingDetails.children} onChange={e => setBookingDetails({...bookingDetails, children: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm">
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* MODULE UPSELLS : SERVICES & EXPÉRIENCES À FÈS (OPTIONNEL) */}
                <div className="pt-2 pb-1 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>
                        {lang === 'ar' 
                          ? 'خدمات وتجارب إضافية في فاس (اختياري)' 
                          : lang === 'en' 
                          ? 'Services & Experiences in Fez (Optional)' 
                          : lang === 'es' 
                          ? 'Servicios y Experiencias en Fez (Opcional)' 
                          : 'Services & Expériences à Fès (Optionnel)'}
                      </span>
                    </span>
                    {selectedUpsells.length > 0 && (
                      <span className="text-[11px] font-bold text-[#B85D36] bg-[#B85D36]/10 px-2 py-0.5 rounded-full">
                        +{formatPrice(convertFromMAD(totalUpsellsMAD, activeCurrency), activeCurrency)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {UPSELL_SERVICES.map(service => {
                      const isChecked = selectedUpsells.includes(service.id);
                      const serviceCostMAD = calculateUpsellMAD(service.id);
                      const serviceCostConverted = convertFromMAD(serviceCostMAD, activeCurrency);
                      const title = lang === 'ar' ? service.titleAr : lang === 'en' ? service.titleEn : lang === 'es' ? service.titleEs : service.title;

                      return (
                        <label
                          key={service.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#B85D36]/5 border-[#B85D36] shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleUpsell(service.id)}
                              className="w-4 h-4 rounded text-[#B85D36] focus:ring-[#B85D36] accent-[#B85D36]"
                            />
                            <span className="text-base shrink-0">{service.icon}</span>
                            <div className="truncate">
                              <span className={`text-xs block truncate ${isChecked ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {title}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {service.pricingType === 'per_person_per_day'
                                  ? `(${bookingDetails.adults} pers. × ${nights > 0 ? nights : 1} j.)`
                                  : 'Tarif fixe'}
                              </span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold whitespace-nowrap ml-2 ${isChecked ? 'text-[#B85D36]' : 'text-slate-500'}`}>
                            +{formatPrice(serviceCostConverted, activeCurrency)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" placeholder={dict.contact.fullName} required value={bookingDetails.name} onChange={e => setBookingDetails({...bookingDetails, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <input type="email" placeholder={dict.contact.email} required value={bookingDetails.email} onChange={e => setBookingDetails({...bookingDetails, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="tel" placeholder="+212 6..." required value={bookingDetails.phone} onChange={e => setBookingDetails({...bookingDetails, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <select value={bookingDetails.arrival} onChange={e => setBookingDetails({...bookingDetails, arrival: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
                      <option value="14h-16h">{dict.modal.time1}</option>
                      <option value="16h-18h">{dict.modal.time2}</option>
                      <option value="18h-20h">{dict.modal.time3}</option>
                      <option value="20h-23h">{dict.modal.time4}</option>
                      <option value="Après 23h">{dict.modal.time5}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <textarea placeholder={dict.booking.specialRequests} value={bookingDetails.requests} onChange={e => setBookingDetails({...bookingDetails, requests: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm h-16 resize-none"></textarea>
                </div>

                <div className="pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start mb-4 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{dict.booking.badgeHotelStandard}</span>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-colors text-sm uppercase tracking-wider">
                    {dict.booking.confirmWhatsapp}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
