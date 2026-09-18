"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Currency, formatPrice, convertFromMAD } from "@/config/currencies";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import { CONTACT_INFO } from "@/config/site";

const dicts = { fr, en, es };

const MOCK_CATALOG = [
  {
    id: "p1",
    title: "Riad Dar Ziryab",
    type: "Riad Entier",
    zone: "Médina",
    guests: 6,
    bedrooms: 3,
    price: 1200,
    cleaningFee: 250,
    rating: 4.98,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop",
    amenities: ["Wi-Fi Fibre", "Patio", "Climatisation", "Petit-déjeuner"]
  },
  {
    id: "p2",
    title: "Appartement Standing Atlas",
    type: "Appartement",
    zone: "Ville Nouvelle",
    guests: 4,
    bedrooms: 2,
    price: 650,
    cleaningFee: 150,
    rating: 4.92,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
    amenities: ["Wi-Fi Fibre", "Terrasse", "Climatisation", "Smart TV"]
  },
  {
    id: "p3",
    title: "Studio Moderne Palmier",
    type: "Studio",
    zone: "Route d'Immouzzer",
    guests: 2,
    bedrooms: 1,
    price: 450,
    cleaningFee: 100,
    rating: 4.88,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    amenities: ["Parking", "Cuisine", "Fiches Police", "Wi-Fi"]
  }
];

export default function Reserver({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [searchZone, setSearchZone] = useState("Tous");
  
  const [activeCurrency, setActiveCurrency] = useState<Currency>('MAD');
  
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
  const totalAmountMAD = selectedProperty ? (nights * selectedProperty.price) + selectedProperty.cleaningFee : 0;
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

    const text = `Bonjour BABFEZ, je souhaite réserver ${selectedProperty.title} du ${formatDate(bookingDetails.startDate)} au ${formatDate(bookingDetails.endDate)} pour ${bookingDetails.adults} Adulte(s) et ${bookingDetails.children} Enfant(s).\nNom: ${bookingDetails.name}\nEmail: ${bookingDetails.email}\nArrivée: ${bookingDetails.arrival}\nDemandes: ${bookingDetails.requests || 'Aucune'}\nTotal devis: ${totalText}.`;
    window.open(`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(text)}`, '_blank');
    setSelectedProperty(null);
  };

  const filteredCatalog = searchZone === "Tous" ? MOCK_CATALOG : MOCK_CATALOG.filter(p => p.zone.includes(searchZone));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="fixed w-full top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">{dict.reserver.tagline}</span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link 
              href={`/${lang}/reserver`} 
              className={`text-sm transition-colors pb-1 ${activeHash !== '#experiences' ? 'font-extrabold text-amber-600 border-b-2 border-amber-600' : 'font-semibold text-slate-600 hover:text-amber-600'}`}
              onClick={() => setActiveHash('')}
            >
              {dict.nav.book}
            </Link>
            <a 
              href="#experiences" 
              className={`text-sm transition-colors pb-1 ${activeHash === '#experiences' ? 'font-extrabold text-amber-600 border-b-2 border-amber-600' : 'font-semibold text-slate-600 hover:text-amber-600'}`}
              onClick={() => setActiveHash('#experiences')}
            >
              {dict.nav.experiences}
            </a>
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



            <a href={`/${lang}/#simulateur`} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg">
              {dict.nav.estimate}
            </a>
          </div>

          <div className="flex items-center lg:hidden gap-2">
            <CurrencySwitcher />
            <div className="h-4 w-px bg-slate-300"></div>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1548041926-e10f4dc79496?q=80&w=2000&auto=format&fit=crop" alt="Fès" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {dict.reserver.heroTitle} <span className="text-amber-500">{dict.reserver.heroTitleHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            {dict.reserver.heroSubtitle}
          </p>

          <div className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto text-slate-900">
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.reserver.searchArrival}</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.reserver.searchDeparture}</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{dict.reserver.searchGuests}</label>
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

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">{dict.reserver.catalogTitle}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalog.map(prop => (
            <div key={prop.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
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
                  <button onClick={() => setSelectedProperty(prop)} className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 shadow-md">
                    {dict.reserver.btnReserve}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

      <footer className="bg-slate-950 pt-20 pb-8 border-t border-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.col2Title || "Nos Services"}</h4>
              <ul className="space-y-3 text-sm">
                <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{dict.home?.formula1Title || "Gestion Sérénité"}</a></li>
                <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{dict.home?.formula2Title || "Gestion Digitale"}</a></li>
                <li><a href={`/${lang}/#services`} className="hover:text-amber-500 transition-colors">{dict.home?.formula3Title || "À la carte"}</a></li>
                <li><a href={`/${lang}/#simulateur`} className="hover:text-amber-500 transition-colors text-amber-600 font-medium">Estimation gratuite</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer?.col3Title || "Navigation"}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href={`/${lang}`} className="hover:text-amber-500 transition-colors">Accueil</Link></li>
                <li><Link href={`/${lang}/reserver`} className="hover:text-amber-500 transition-colors">Nos Logements</Link></li>
                <li><Link href={`/${lang}/proprietaire/login`} className="hover:text-amber-500 transition-colors">Espace Propriétaire</Link></li>
                <li><a href={`/${lang}/#faq`} className="hover:text-amber-500 transition-colors">FAQ</a></li>
              </ul>
            </div>

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
            <div>
              &copy; 2026 BABFEZ Conciergerie.
            </div>
          </div>
        </div>
      </footer>

      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row">
            <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col">
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-extrabold">{selectedProperty.title}</h3>
                <button onClick={() => setSelectedProperty(null)} className="md:hidden"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <img src={selectedProperty.image} className="w-full h-40 object-cover rounded-2xl mb-6 shadow-sm" />
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span>{dict.reserver.modalPrice}</span>
                  <span className="font-bold">{formatPrice(convertFromMAD(selectedProperty.price, activeCurrency), activeCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{dict.reserver.modalCleaning}</span>
                  <span className="font-bold">{formatPrice(convertFromMAD(selectedProperty.cleaningFee, activeCurrency), activeCurrency)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm mb-4">
                  <div className="flex justify-between font-extrabold text-base mb-1">
                    <span>{dict.reserver.modalTotal}</span>
                    <div className="flex flex-col items-end">
                      <span>{formatPrice(totalAmountConverted, activeCurrency)}</span>
                      {activeCurrency !== 'MAD' && (
                        <span className="text-xs font-medium text-amber-700 opacity-80 mt-1">~{totalAmountMAD} MAD</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs">{dict.reserver.modalNotice.replace('{nights}', nights.toString())}</span>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium">{dict.reserver.modalDisclaimer}</p>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 relative">
              <button onClick={() => setSelectedProperty(null)} className="hidden md:block absolute top-6 right-6 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              <h4 className="text-xl font-extrabold text-slate-950 mb-6">{dict.reserver.modalFormTitle}</h4>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.searchArrival}</label>
                    <input type="date" required value={bookingDetails.startDate} onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.searchDeparture}</label>
                    <input type="date" required value={bookingDetails.endDate} onChange={e => setBookingDetails({...bookingDetails, endDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.modal.adults}</label>
                    <select value={bookingDetails.adults} onChange={e => setBookingDetails({...bookingDetails, adults: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.modal.children}</label>
                    <select value={bookingDetails.children} onChange={e => setBookingDetails({...bookingDetails, children: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" placeholder={dict.reserver.formName} required value={bookingDetails.name} onChange={e => setBookingDetails({...bookingDetails, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <input type="email" placeholder={dict.modal.email} required value={bookingDetails.email} onChange={e => setBookingDetails({...bookingDetails, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
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
                  <textarea placeholder={dict.modal.requests} value={bookingDetails.requests} onChange={e => setBookingDetails({...bookingDetails, requests: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm h-16 resize-none"></textarea>
                </div>

                <div className="pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2 items-start mb-4 text-xs text-slate-500">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{dict.modal.reassurance}</span>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700">Confirmer ma demande via WhatsApp</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
