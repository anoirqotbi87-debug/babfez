"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";

const dicts = { fr, en, es };

const MOCK_PAYOUTS = [
  { id: "po1", owner: "M. Bennani", property: "Riad Dar Ziryab", period: "Oct 2026", net: 14850, paid: false, rib: "RIB: 007 780 0000000000000000 12" },
  { id: "po2", owner: "Mme. Tazi", property: "Villa Jnan Sbil", period: "Oct 2026", net: 22400, paid: true, rib: "RIB: 011 780 0000000000000000 45" },
  { id: "po3", owner: "M. Idrissi", property: "Appartement Atlas", period: "Oct 2026", net: 6500, paid: false, rib: "RIB: 022 780 0000000000000000 89" },
];

export default function AdminDashboard({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem("babfez_admin_logged_in")) {
      router.push(`/${lang}/admin/login`);
    }
  }, [router, lang]);

  const handleLogout = () => {
    localStorage.removeItem("babfez_admin_logged_in");
    router.push(`/${lang}/admin/login`);
  };

  const togglePaid = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, paid: !p.paid } : p));
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-amber-500 hover:bg-white/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </Link>
            <div>
              <h1 className="text-xl font-extrabold">Console d'Administration</h1>
              <div className="text-xs text-slate-400 font-medium mt-1">Super Admin BABFEZ</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Virements Propriétaires</h2>
              <p className="text-sm text-slate-500">Gérez les clôtures mensuelles et marquez les paiements comme effectués.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <th className="p-4">Propriétaire</th>
                  <th className="p-4">Bien</th>
                  <th className="p-4">Période</th>
                  <th className="p-4">Montant Net (MAD)</th>
                  <th className="p-4">Coordonnées (RIB)</th>
                  <th className="p-4 text-center">Statut Virement</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payouts.map(po => (
                  <tr key={po.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{po.owner}</td>
                    <td className="p-4 text-slate-600 font-medium">{po.property}</td>
                    <td className="p-4 text-slate-600">{po.period}</td>
                    <td className="p-4 font-extrabold text-emerald-600">{po.net.toLocaleString('fr-FR')} MAD</td>
                    <td className="p-4 text-xs font-mono text-slate-500">{po.rib}</td>
                    <td className="p-4 text-center">
                      {po.paid ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                          Virement Effectué
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => togglePaid(po.id)}
                        className={\`text-xs font-bold px-3 py-1.5 rounded-lg border \${po.paid ? 'border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}\`}
                      >
                        {po.paid ? "Annuler le paiement" : "Marquer comme payé"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
