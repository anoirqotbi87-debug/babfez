"use client";

import { useState } from "react";
import Link from "next/link";

// Mock Data
const CATALOG = [
  {
    id: "p1",
    title: "Riad Dar Ziryab",
    type: "Riad Entier",
    zone: "Cœur Médina (Batha)",
    guests: 6,
    bedrooms: 3,
    price: 1200,
    cleaningFee: 250,
    rating: 4.98,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop",
    amenities: ["Wi-Fi Fibre", "Patio traditionnel", "Climatisation", "Petit-déjeuner inclus"]
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
    amenities: ["Wi-Fi Fibre", "Terrasse vue dégagée", "Climatisation", "Smart TV"]
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
    amenities: ["Parking sécurisé", "Cuisine équipée", "Fiches de police incluses", "Wi-Fi Haut Débit"]
  }
];

export default function Reserver() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [searchZone, setSearchZone] = useState("Tous");
  
  // Modal State
  const [selectedProperty, setSelectedProperty] = useState<typeof CATALOG[0] | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    guests: "2",
    name: "",
    phone: "",
    arrival: "14:00",
    nationality: ""
  });

  // Dynamic price calculation
  const getDaysDiff = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = getDaysDiff(bookingDetails.startDate, bookingDetails.endDate);
  const totalRent = selectedProperty ? nights * selectedProperty.price : 0;
  const totalAmount = selectedProperty ? totalRent + selectedProperty.cleaningFee : 0;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || nights <= 0) {
      alert("Veuillez sélectionner des dates valides.");
      return;
    }
    
    const text = `Bonjour BABFEZ, je souhaite réserver ${selectedProperty.title} du ${bookingDetails.startDate} au ${bookingDetails.endDate} pour ${bookingDetails.guests} personnes.\n\nNom: ${bookingDetails.name}\nNationalité: ${bookingDetails.nationality}\nHeure d'arrivée: ${bookingDetails.arrival}\n\nTotal estimé : ${totalAmount} MAD.\nMerci de me confirmer la disponibilité.`;
    
    window.open(`https://wa.me/212778874114?text=${encodeURIComponent(text)}`, '_blank');
    setSelectedProperty(null);
  };

  const filteredCatalog = searchZone === "Tous" ? CATALOG : CATALOG.filter(p => p.zone.includes(searchZone));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="fixed w-full top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">Séjours & Expériences</span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/reserver" className="text-sm font-extrabold text-amber-600 border-b-2 border-amber-600 pb-1">Nos Logements</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/proprietaire/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-lg">
              Espace Propriétaire
            </Link>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <Link href="/reserver" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-amber-600">Nos Logements</Link>
            <div className="pt-4 border-t border-slate-100">
              <Link href="/proprietaire/login" className="block text-center bg-slate-100 text-slate-900 px-4 py-2.5 rounded-lg font-bold">Espace Propriétaire</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero & Search */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1548041926-e10f4dc79496?q=80&w=2000&auto=format&fit=crop" alt="Fès" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Vivez Fès <span className="text-amber-500">comme un local.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            Réservez en direct. Évitez les frais de plateforme. Profitez d'un accueil premium.
          </p>

          {/* Advanced Search Bar */}
          <div className="bg-white p-2 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto text-slate-900">
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Arrivée</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Départ</label>
              <input type="date" className="w-full bg-transparent text-slate-950 font-bold focus:outline-none" />
            </div>
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Quartier</label>
              <select 
                value={searchZone} 
                onChange={(e) => setSearchZone(e.target.value)}
                className="w-full bg-transparent text-slate-950 font-bold focus:outline-none cursor-pointer"
              >
                <option>Tous</option>
                <option>Médina</option>
                <option>Ville Nouvelle</option>
                <option>Route d'Immouzzer</option>
              </select>
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Voyageurs</label>
              <select className="w-full bg-transparent text-slate-950 font-bold focus:outline-none cursor-pointer">
                <option>1 Voyageur</option>
                <option>2 Voyageurs</option>
                <option>3 Voyageurs</option>
                <option>4+ Voyageurs</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-amber-500 text-white p-4 rounded-2xl md:rounded-full font-bold hover:bg-amber-600 transition-colors flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Nos Logements Exclusifs</h2>
          <span className="text-sm font-bold text-slate-500">{filteredCatalog.length} résultat(s)</span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCatalog.map(prop => (
            <div key={prop.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-extrabold text-slate-950 shadow-sm">
                  {prop.zone}
                </div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1.5 rounded-lg text-xs font-extrabold text-slate-950 shadow-sm flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {prop.rating} <span className="text-slate-500 font-medium">({prop.reviews})</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-extrabold text-xl text-slate-950 leading-tight mb-1">{prop.title}</h3>
                  <p className="text-slate-500 text-sm font-medium">
                    {prop.type} • {prop.guests} voyageurs • {prop.bedrooms} chambre{prop.bedrooms > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {prop.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-slate-100">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-950">{prop.price}</span>
                    <span className="text-slate-500 text-sm font-medium"> MAD / nuit</span>
                  </div>
                  <button 
                    onClick={() => setSelectedProperty(prop)}
                    className="bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2026 BABFEZ Conciergerie. Tous droits réservés.</p>
      </footer>

      {/* MODAL DE RÉSERVATION */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left side: Property Summary */}
            <div className="w-full md:w-5/12 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-950">{selectedProperty.title}</h3>
                  <button onClick={() => setSelectedProperty(null)} className="md:hidden text-slate-400 bg-white p-2 rounded-full shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <img src={selectedProperty.image} alt="Preview" className="w-full h-40 object-cover rounded-2xl mb-6 shadow-sm" />
                
                <div className="space-y-4 text-sm font-medium text-slate-700">
                  <div className="flex justify-between">
                    <span>Prix par nuit</span>
                    <span className="font-bold">{selectedProperty.price} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de ménage (unique)</span>
                    <span className="font-bold">{selectedProperty.cleaningFee} MAD</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-sm mb-4">
                  <div className="flex justify-between font-extrabold text-base mb-1">
                    <span>Total Estimé</span>
                    <span>{totalAmount} MAD</span>
                  </div>
                  <span className="text-xs">Pour {nights} nuit(s) (Paiement sur place)</span>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium">Vous ne serez pas débité maintenant. Ceci est une demande de réservation directe sans frais de plateforme.</p>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full md:w-7/12 p-8 bg-white relative">
              <button onClick={() => setSelectedProperty(null)} className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <h4 className="text-xl font-extrabold text-slate-950 mb-6">Complétez votre demande</h4>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Arrivée</label>
                    <input type="date" required value={bookingDetails.startDate} onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Départ</label>
                    <input type="date" required value={bookingDetails.endDate} onChange={e => setBookingDetails({...bookingDetails, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nom & Prénom</label>
                    <input type="text" required value={bookingDetails.name} onChange={e => setBookingDetails({...bookingDetails, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium" placeholder="Ex: Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Téléphone (WhatsApp)</label>
                    <input type="tel" required value={bookingDetails.phone} onChange={e => setBookingDetails({...bookingDetails, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium" placeholder="+33 6..." />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nationalité</label>
                    <input type="text" required value={bookingDetails.nationality} onChange={e => setBookingDetails({...bookingDetails, nationality: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium" placeholder="Requis (Fiche police)" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Voyageurs</label>
                    <select value={bookingDetails.guests} onChange={e => setBookingDetails({...bookingDetails, guests: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium bg-white">
                      <option value="1">1 Personne</option>
                      <option value="2">2 Personnes</option>
                      <option value="3">3 Personnes</option>
                      <option value="4">4 Personnes</option>
                      <option value="5">5 Personnes</option>
                      <option value="6">6 Personnes</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg flex justify-center items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                    Confirmer via WhatsApp
                  </button>
                  <p className="text-center text-xs text-slate-500 font-medium mt-3">Une confirmation vous sera envoyée très rapidement par notre équipe.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
