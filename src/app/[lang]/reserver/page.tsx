"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";

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
    image: "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=1000&auto=format&fit=crop",
    amenities: ["Parking", "Cuisine", "Fiches Police", "Wi-Fi"]
  }
];

export default function Reserver({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [searchZone, setSearchZone] = useState("Tous");
  
  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const [selectedProperty, setSelectedProperty] = useState<typeof MOCK_CATALOG[0] | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    guests: "2",
    name: "",
    phone: "",
    arrival: "14:00",
    nationality: ""
  });

  const getDaysDiff = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffDays = Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = getDaysDiff(bookingDetails.startDate, bookingDetails.endDate);
  const totalAmount = selectedProperty ? (nights * selectedProperty.price) + selectedProperty.cleaningFee : 0;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || nights <= 0) return;
    
    const text = `Bonjour BABFEZ, je souhaite réserver ${selectedProperty.title} du ${bookingDetails.startDate} au ${bookingDetails.endDate} pour ${bookingDetails.guests} personnes.\nNom: ${bookingDetails.name}\nTotal estimé: ${totalAmount} MAD.`;
    window.open(`https://wa.me/212778874114?text=${encodeURIComponent(text)}`, '_blank');
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

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <Link href={`/${lang}/proprietaire/login`} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-lg">
              {dict.nav.ownerSpace}
            </Link>
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
                    <span className="text-2xl font-extrabold text-slate-950">{prop.price}</span>
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
              <a href="https://wa.me/212778874114" target="_blank" rel="noreferrer" className="mt-auto text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 text-3xl shadow-inner">🐪</div>
              <h3 className="font-extrabold text-xl text-slate-950 mb-3">{dict.reserver.exp2Title}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{dict.reserver.exp2Desc}</p>
              <a href="https://wa.me/212778874114" target="_blank" rel="noreferrer" className="mt-auto text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6 text-3xl shadow-inner">🥘</div>
              <h3 className="font-extrabold text-xl text-slate-950 mb-3">{dict.reserver.exp3Title}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">{dict.reserver.exp3Desc}</p>
              <a href="https://wa.me/212778874114" target="_blank" rel="noreferrer" className="mt-auto text-rose-600 font-bold hover:text-rose-700 flex items-center gap-1">
                {dict.reserver.btnReserve} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm">{dict.home.footerText}</p>
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
                <div className="flex justify-between"><span>{dict.reserver.modalPrice}</span><span className="font-bold">{selectedProperty.price} MAD</span></div>
                <div className="flex justify-between"><span>{dict.reserver.modalCleaning}</span><span className="font-bold">{selectedProperty.cleaningFee} MAD</span></div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm mb-4">
                  <div className="flex justify-between font-extrabold text-base mb-1">
                    <span>{dict.reserver.modalTotal}</span>
                    <span>{totalAmount} MAD</span>
                  </div>
                  <span className="text-xs">{dict.reserver.modalNotice.replace('{nights}', nights.toString())}</span>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium">{dict.reserver.modalDisclaimer}</p>
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 relative">
              <button onClick={() => setSelectedProperty(null)} className="hidden md:block absolute top-6 right-6 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              <h4 className="text-xl font-extrabold text-slate-950 mb-6">{dict.reserver.modalFormTitle}</h4>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.searchArrival}</label>
                    <input type="date" required value={bookingDetails.startDate} onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.searchDeparture}</label>
                    <input type="date" required value={bookingDetails.endDate} onChange={e => setBookingDetails({...bookingDetails, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.formName}</label>
                    <input type="text" required value={bookingDetails.name} onChange={e => setBookingDetails({...bookingDetails, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{dict.reserver.formPhone}</label>
                    <input type="tel" required value={bookingDetails.phone} onChange={e => setBookingDetails({...bookingDetails, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700">{dict.reserver.btnWhatsapp}</button>
                  <p className="text-center text-xs text-slate-500 font-medium mt-3">{dict.reserver.confirmNotice}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
