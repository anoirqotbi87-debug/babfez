"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";

const dicts = { fr, en, es, ar };

const MOCK_PROPERTY = { id: "p1", name: "Riad Dar Ziryab", zone: "Médina" };
const MOCK_RESERVATIONS = [
  { id: "r1", date: "02 Oct - 05 Oct", source: "Airbnb", nights: 3, gross: 3600, commission: 720, cleaning: 250, net: 2630 },
  { id: "r2", date: "08 Oct - 10 Oct", source: "Direct", nights: 2, gross: 2400, commission: 360, cleaning: 250, net: 1790 },
  { id: "r3", date: "15 Oct - 20 Oct", source: "Booking.com", nights: 5, gross: 6000, commission: 1200, cleaning: 250, net: 4550 },
];

export default function Dashboard({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDates, setBlockDates] = useState({ start: "", end: "" });
  const [blockedDays, setBlockedDays] = useState<number[]>([25, 26, 27]);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem("babfez_owner_logged_in")) {
      router.push(`/${lang}/proprietaire/login`);
    }
  }, [router, lang]);

  const handleLogout = () => {
    localStorage.removeItem("babfez_owner_logged_in");
    router.push(`/${lang}/proprietaire/login`);
  };

  const handleBlockDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (blockDates.start) {
      const day = parseInt(blockDates.start.split("-")[2]);
      if (!isNaN(day)) setBlockedDays([...blockedDays, day, day + 1]);
    }
    setShowBlockModal(false);
  };

  if (!isClient) return null;

  const getDayStatus = (day: number) => {
    if (blockedDays.includes(day)) return { status: 'blocked', label: dict.proprietaire.blocked };
    if ([2, 3, 4, 5].includes(day)) return { status: 'airbnb', label: 'Airbnb' };
    if ([8, 9, 10].includes(day)) return { status: 'direct', label: 'Direct' };
    if ([15, 16, 17, 18, 19, 20].includes(day)) return { status: 'booking', label: 'Booking' };
    return { status: 'available', label: '' };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-40 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-amber-500 hover:bg-white/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </Link>
            <div>
              <h1 className="text-xl font-extrabold">{dict.proprietaire.dashboardHello}, M. Bennani</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-medium">{dict.proprietaire.property}</span>
                <select className="bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded outline-none border border-slate-700">
                  <option>{MOCK_PROPERTY.name} ({MOCK_PROPERTY.zone})</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
              {dict.proprietaire.btnLogout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <section className="print:hidden">
          <h2 className="text-lg font-bold mb-4">{dict.proprietaire.overview} - Oct 2026</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">{dict.proprietaire.netRevenue}</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">14 850 <span className="text-lg text-slate-400">MAD</span></span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">{dict.proprietaire.occupancy}</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">76%</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-sm font-bold text-slate-500">{dict.proprietaire.nightsBooked}</span>
              <span className="text-3xl font-extrabold text-slate-950 mt-1">23</span>
              <span className="text-xs text-slate-500 mt-3 font-medium">{dict.proprietaire.outOf.replace('{days}', '31')}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-500">{dict.proprietaire.nextArrival}</span>
                <span className="text-xl font-extrabold mt-1 block">02 Oct (3 {dict.proprietaire.nights})</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 print:hidden">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">{dict.proprietaire.calendarTitle}</h2>
                <button onClick={() => setShowBlockModal(true)} className="bg-slate-950 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  {dict.proprietaire.btnBlock}
                </button>
              </div>
              <div className="p-6">
                <div className="text-center font-extrabold text-lg mb-6">Oct 2026</div>
                <div className="grid grid-cols-7 gap-2 text-sm font-medium">
                  {Array.from({ length: 3 }).map((_, i) => <div key={`e-${i}`} className="h-14 rounded-lg bg-slate-50/50"></div>)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const { status, label } = getDayStatus(day);
                    let bgClass = "bg-slate-50 hover:bg-slate-100";
                    if (status === 'blocked') bgClass = "bg-amber-100 text-amber-900 border border-amber-200";
                    else if (status === 'airbnb') bgClass = "bg-rose-100 text-rose-900 border border-rose-200";
                    else if (status === 'booking') bgClass = "bg-blue-100 text-blue-900 border border-blue-200";
                    else if (status === 'direct') bgClass = "bg-emerald-100 text-emerald-900 border border-emerald-200";
                    return (
                      <div key={day} className={`h-14 rounded-lg flex flex-col items-center justify-center ${bgClass}`}>
                        <span className="font-bold">{day}</span>
                        {label && <span className="text-[9px] font-bold uppercase truncate w-full text-center">{label}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="print:block">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold">{dict.proprietaire.financeTitle} - Oct 2026</h2>
                <p className="text-sm text-slate-500">{MOCK_PROPERTY.name} • {dict.proprietaire.owner} M. Bennani</p>
              </div>
              <button onClick={() => window.print()} className="bg-white border text-slate-700 px-4 py-2 rounded-lg font-bold print:hidden">
                {dict.proprietaire.btnPrint}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                    <th className="p-4">{dict.proprietaire.period}</th>
                    <th className="p-4">{dict.proprietaire.source}</th>
                    <th className="p-4">{dict.proprietaire.nights}</th>
                    <th className="p-4">{dict.proprietaire.grossRent}</th>
                    <th className="p-4">{dict.proprietaire.cleaningFee}</th>
                    <th className="p-4 text-rose-600">{dict.proprietaire.commission}</th>
                    <th className="p-4 text-emerald-600">{dict.proprietaire.netRevenueTable}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {MOCK_RESERVATIONS.map(res => (
                    <tr key={res.id} className="border-b border-slate-100">
                      <td className="p-4 font-medium">{res.date}</td>
                      <td className="p-4">{res.source}</td>
                      <td className="p-4">{res.nights}</td>
                      <td className="p-4 text-slate-600">{res.gross}</td>
                      <td className="p-4 text-slate-600">{res.cleaning}</td>
                      <td className="p-4 text-rose-600">-{res.commission}</td>
                      <td className="p-4 font-extrabold text-emerald-600">{res.net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="hidden print:block p-8 text-center text-sm text-slate-500 mt-8 border-t">
              {dict.proprietaire.footerPrint}
            </div>
          </div>
        </section>

        {/* SECTION SYNCHRONISATION ICAL */}
        <section className="print:hidden">
          <h2 className="text-xl font-extrabold mb-4">Synchronisation Airbnb & Booking.com</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Exporter le calendrier BABFEZ</h3>
              <p className="text-sm text-slate-500 mb-4">Copiez ce lien et collez-le dans les paramètres d'importation de vos annonces Airbnb et Booking.com.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={isClient ? `${window.location.origin}/api/ical/${MOCK_PROPERTY.id}` : ''}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 outline-none" 
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/api/ical/${MOCK_PROPERTY.id}`);
                    alert("Lien copié dans le presse-papier !");
                  }}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800"
                >
                  Copier le lien
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Importer des calendriers externes</h3>
              <p className="text-sm text-slate-500 mb-4">Collez ici les liens d'exportation iCal fournis par Airbnb et Booking.com.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const airbnb = formData.get('airbnb') as string;
                const booking = formData.get('booking') as string;
                const btn = document.getElementById('syncBtn') as HTMLButtonElement;
                if(btn) btn.disabled = true;
                
                try {
                  const res = await fetch('/api/ical/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId: MOCK_PROPERTY.id, airbnbUrl: airbnb, bookingUrl: booking })
                  });
                  const data = await res.json();
                  if(data.success) {
                    alert(data.message);
                  } else {
                    alert("Erreur lors de la synchronisation.");
                  }
                } catch(e) {
                  alert("Erreur réseau lors de la synchronisation.");
                }
                
                if(btn) btn.disabled = false;
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Lien iCal Airbnb</label>
                  <input name="airbnb" type="url" placeholder="https://www.airbnb.com/calendar/ical/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Lien iCal Booking.com</label>
                  <input name="booking" type="url" placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500" />
                </div>
                <button id="syncBtn" type="submit" className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 disabled:opacity-50">
                  Enregistrer et Synchroniser maintenant
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold">{dict.proprietaire.modalBlockTitle}</h3>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">{dict.proprietaire.modalBlockDesc}</p>
            <form onSubmit={handleBlockDates} className="space-y-4">
              <input type="date" required value={blockDates.start} onChange={e => setBlockDates({...blockDates, start: e.target.value})} className="w-full px-4 py-3 rounded-xl border" />
              <input type="date" required value={blockDates.end} onChange={e => setBlockDates({...blockDates, end: e.target.value})} className="w-full px-4 py-3 rounded-xl border" />
              <button type="submit" className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl">{dict.proprietaire.btnConfirmBlock}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
