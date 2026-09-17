"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data
const MOCK_PROPERTY = {
  id: "p1",
  name: "Riad Dar Ziryab",
  zone: "Médina",
};

const MOCK_RESERVATIONS = [
  { id: "r1", date: "02 Oct - 05 Oct", source: "Airbnb", nights: 3, gross: 3600, commission: 720, cleaning: 250, net: 2630 },
  { id: "r2", date: "08 Oct - 10 Oct", source: "Direct", nights: 2, gross: 2400, commission: 360, cleaning: 250, net: 1790 }, // Direct is 15% comm? Let's say 20% standard: 480. Wait, I'll just hardcode.
  { id: "r3", date: "15 Oct - 20 Oct", source: "Booking.com", nights: 5, gross: 6000, commission: 1200, cleaning: 250, net: 4550 },
];

export default function Dashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDates, setBlockDates] = useState({ start: "", end: "" });
  const [blockedDays, setBlockedDays] = useState<number[]>([25, 26, 27]); // Mock blocked days

  useEffect(() => {
    setIsClient(true);
    // Basic auth check for demo
    if (!localStorage.getItem("babfez_owner_logged_in")) {
      router.push("/proprietaire/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("babfez_owner_logged_in");
    router.push("/proprietaire/login");
  };

  const handleBlockDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockDates.start) {
      // Just visually block a few days around the selected date for demo
      const day = parseInt(blockDates.start.split("-")[2]);
      if (!isNaN(day)) {
        setBlockedDays([...blockedDays, day, day + 1]);
      }
    }
    setShowBlockModal(false);
  };

  if (!isClient) return null; // Avoid hydration mismatch

  // Calendar logic (mocking October 2026 for demo)
  const daysInMonth = 31;
  const firstDayOffset = 3; // Let's say month starts on Thursday
  const bookedDaysAirbnb = [2, 3, 4, 5];
  const bookedDaysDirect = [8, 9, 10];
  const bookedDaysBooking = [15, 16, 17, 18, 19, 20];

  const getDayStatus = (day: number) => {
    if (blockedDays.includes(day)) return { status: 'blocked', label: 'Bloqué' };
    if (bookedDaysAirbnb.includes(day)) return { status: 'airbnb', label: 'Airbnb' };
    if (bookedDaysDirect.includes(day)) return { status: 'direct', label: 'Direct' };
    if (bookedDaysBooking.includes(day)) return { status: 'booking', label: 'Booking' };
    return { status: 'available', label: '' };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-40 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-amber-500 hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </Link>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Bonjour, M. Bennani</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-medium">Propriété :</span>
                <select className="bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded outline-none border border-slate-700 focus:border-amber-500">
                  <option>{MOCK_PROPERTY.name} ({MOCK_PROPERTY.zone})</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg transition-colors">
            Déconnexion
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* SECTION: KPIs */}
        <section className="print:hidden">
          <h2 className="text-lg font-bold mb-4">Aperçu - Octobre 2026</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">Revenus Nets Estimés</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">14 850 <span className="text-lg text-slate-400">MAD</span></span>
              <div className="mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                +12% vs Sept
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">Taux d'Occupation</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">76%</span>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">Nuits Réservées</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">23 <span className="text-lg text-slate-400">nuits</span></span>
              <span className="text-xs text-slate-500 mt-3 font-medium">Sur 31 jours disponibles</span>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-500">Prochaine Arrivée</span>
                <span className="text-xl font-extrabold text-slate-950 mt-1 block">02 Oct (3 nuits)</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">SM</div>
                <div className="text-sm">
                  <div className="font-bold text-slate-900 leading-tight">Sarah M.</div>
                  <div className="text-xs text-slate-500 font-medium">France (Airbnb)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SECTION: CALENDRIER */}
          <section className="lg:col-span-2 print:hidden">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">Calendrier de Réservations</h2>
                <button 
                  onClick={() => setShowBlockModal(true)}
                  className="bg-slate-950 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Bloquer dates
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <button className="text-slate-400 hover:text-slate-950"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
                  <span className="font-extrabold text-lg">Octobre 2026</span>
                  <button className="text-slate-400 hover:text-slate-950"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                  <div>LUN</div><div>MAR</div><div>MER</div><div>JEU</div><div>VEN</div><div>SAM</div><div>DIM</div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-sm font-medium">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-14 rounded-lg bg-slate-50/50"></div>
                  ))}
                  
                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const { status, label } = getDayStatus(day);
                    
                    let bgClass = "bg-slate-50 hover:bg-slate-100 text-slate-700"; // available
                    if (status === 'blocked') bgClass = "bg-amber-100 text-amber-900 border border-amber-200";
                    else if (status === 'airbnb') bgClass = "bg-rose-100 text-rose-900 border border-rose-200";
                    else if (status === 'booking') bgClass = "bg-blue-100 text-blue-900 border border-blue-200";
                    else if (status === 'direct') bgClass = "bg-emerald-100 text-emerald-900 border border-emerald-200";
                    
                    return (
                      <div key={day} className={`h-14 rounded-lg flex flex-col items-center justify-center relative cursor-default transition-colors ${bgClass}`}>
                        <span className="font-bold">{day}</span>
                        {label && <span className="text-[9px] font-bold uppercase tracking-tighter mt-0.5 opacity-80">{label}</span>}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div> Disponible</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-200 border border-rose-300"></div> Airbnb</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-200 border border-blue-300"></div> Booking.com</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-300"></div> Direct</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-200 border border-amber-300"></div> Bloqué (Proprio)</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: ACTIVITÉ RÉCENTE */}
          <section className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold">Activité Récente</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Nouvelle réservation directe</p>
                    <p className="text-xs text-slate-500 mt-1">08 Oct - 10 Oct (2 nuits) • 1 790 MAD nets</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Aujourd'hui, 14:30</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Check-out imminent</p>
                    <p className="text-xs text-slate-500 mt-1">Le ménage est programmé à 11:30 demain pour Dar Ziryab.</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Hier, 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION: RELEVÉ FINANCIER */}
        <section className="print:block">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center print:border-b-2 print:border-slate-800">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">Relevé Financier - Octobre 2026</h2>
                <p className="text-sm text-slate-500 font-medium">{MOCK_PROPERTY.name} • Propriétaire: M. Bennani</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Imprimer (PDF)
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider print:bg-transparent print:border-b-2 print:border-slate-800">
                    <th className="p-4 border-b border-slate-100">Période</th>
                    <th className="p-4 border-b border-slate-100">Source</th>
                    <th className="p-4 border-b border-slate-100 text-center">Nuits</th>
                    <th className="p-4 border-b border-slate-100 text-right">Loyer Brut</th>
                    <th className="p-4 border-b border-slate-100 text-right">Frais Ménage</th>
                    <th className="p-4 border-b border-slate-100 text-right">Commission BABFEZ</th>
                    <th className="p-4 border-b border-slate-100 text-right text-slate-900">Revenu Net (MAD)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {MOCK_RESERVATIONS.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors print:border-b print:border-slate-200">
                      <td className="p-4 border-b border-slate-100 font-medium text-slate-900">{res.date}</td>
                      <td className="p-4 border-b border-slate-100">
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          res.source === 'Airbnb' ? 'bg-rose-100 text-rose-800' :
                          res.source === 'Booking.com' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {res.source}
                        </span>
                      </td>
                      <td className="p-4 border-b border-slate-100 text-center font-medium">{res.nights}</td>
                      <td className="p-4 border-b border-slate-100 text-right text-slate-600">{res.gross}</td>
                      <td className="p-4 border-b border-slate-100 text-right text-slate-600">{res.cleaning}</td>
                      <td className="p-4 border-b border-slate-100 text-right text-rose-600">-{res.commission}</td>
                      <td className="p-4 border-b border-slate-100 text-right font-extrabold text-emerald-600">{res.net}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold text-slate-900 print:bg-transparent">
                  <tr>
                    <td colSpan={3} className="p-4 text-right">TOTAL OCTOBRE 2026</td>
                    <td className="p-4 text-right">12 000</td>
                    <td className="p-4 text-right">750</td>
                    <td className="p-4 text-right text-rose-600">-2 280</td>
                    <td className="p-4 text-right text-xl text-emerald-600">8 970 MAD</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="hidden print:block p-8 text-center text-sm text-slate-500 mt-8 border-t border-slate-800">
              BABFEZ Conciergerie - Document généré automatiquement le 17/09/2026.<br/>
              Pour toute question, contactez-nous au +212 7 78 87 41 14 ou via contact@babfez.ma
            </div>
          </div>
        </section>
      </main>

      {/* MODAL BLOCAGE DATES */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-950">Bloquer des dates</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-slate-950">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6 font-medium">Sélectionnez les dates où vous souhaitez occuper vous-même le logement. Aucune réservation ne sera acceptée sur cette période.</p>
            
            <form onSubmit={handleBlockDates} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Arrivée</label>
                <input type="date" required value={blockDates.start} onChange={e => setBlockDates({...blockDates, start: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Départ</label>
                <input type="date" required value={blockDates.end} onChange={e => setBlockDates({...blockDates, end: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-medium" />
              </div>
              
              <button type="submit" className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-lg mt-4">
                Confirmer le blocage
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
