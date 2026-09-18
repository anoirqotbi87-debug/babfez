"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MOCK_LEADS = [
  { id: "l1", date: "18 Sep 2026", name: "Karim Alaoui", phone: "212611223344", zone: "Route d'Immouzzer", type: "Appartement F3", formule: "Gestion Sérénité", status: "Nouveau" },
  { id: "l2", date: "17 Sep 2026", name: "Dr. Lahlou", phone: "212699887766", zone: "Ville Nouvelle / Atlas", type: "Appartement Standing", formule: "Gestion Digitale", status: "Contacté" },
  { id: "l3", date: "15 Sep 2026", name: "M. Berrada", phone: "212644556677", zone: "Médina", type: "Riad Traditionnel", formule: "Gestion Premium", status: "Mandat signé" },
];

const MOCK_PLANNING = [
  { id: "prop1", name: "Riad Dar Ziryab", zone: "Médina", current: "Occupé (J. Dupont)", next: "Libre le 22 Sep" },
  { id: "prop2", name: "Appartement Atlas", zone: "Ville Nouvelle", current: "Libre", next: "Arrivée prévue (A. Tazi) à 15h" },
  { id: "prop3", name: "Studio Moderne Palmier", zone: "Immouzzer", current: "Bloqué par propriétaire", next: "Jusqu'au 30 Sep" },
];

const MOCK_TURNOVERS = [
  { id: "t1", date: "Aujourd'hui", property: "Riad Dar Ziryab", checkout: "11:00", checkin: "15:00", linen: "3 grands lits, 6 serviettes", status: "À faire" },
  { id: "t2", date: "Aujourd'hui", property: "Appartement Atlas", checkout: "10:00", checkin: "16:00", linen: "1 grand lit, 2 serviettes", status: "En cours" },
  { id: "t3", date: "Demain", property: "Studio Moderne", checkout: "-", checkin: "-", linen: "-", status: "Terminé & Contrôlé" },
];

const MOCK_POLICE = [
  { id: "p1", name: "Jean Dupont", nat: "France", dates: "18-22 Sep 2026", property: "Riad Dar Ziryab", idStatus: "Reçue", policeStatus: "Transmise aux autorités" },
  { id: "p2", name: "Amine Tazi", nat: "Maroc", dates: "18-20 Sep 2026", property: "Appartement Atlas", idStatus: "En attente", policeStatus: "À remplir" },
];

const MOCK_PAYOUTS = [
  { id: "po1", owner: "M. Bennani", property: "Riad Dar Ziryab", period: "Oct 2026", net: 14850, paid: false, rib: "RIB: 007 780 0000000000000000 12" },
  { id: "po2", owner: "Mme. Tazi", property: "Villa Jnan Sbil", period: "Oct 2026", net: 22400, paid: true, rib: "RIB: 011 780 0000000000000000 45" },
  { id: "po3", owner: "M. Idrissi", property: "Appartement Atlas", period: "Oct 2026", net: 6500, paid: false, rib: "RIB: 022 780 0000000000000000 89" },
];

export default function AdminDashboard({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  
  // State for interactive modules
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [turnovers, setTurnovers] = useState(MOCK_TURNOVERS);
  const [police, setPolice] = useState(MOCK_POLICE);
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Nouveau": return "bg-blue-100 text-blue-800";
      case "Contacté": return "bg-amber-100 text-amber-800";
      case "Visite fixée": return "bg-purple-100 text-purple-800";
      case "Mandat signé": return "bg-emerald-100 text-emerald-800";
      case "À faire": return "bg-rose-100 text-rose-800";
      case "En cours": return "bg-amber-100 text-amber-800";
      case "Terminé & Contrôlé": return "bg-emerald-100 text-emerald-800";
      case "Reçue": case "Transmise aux autorités": return "bg-emerald-100 text-emerald-800";
      case "En attente": case "À remplir": return "bg-amber-100 text-amber-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* HEADER SUPER ADMIN */}
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-amber-500 hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">BABFEZ</h1>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">Super Admin</span>
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Système Opérationnel • {new Date().toLocaleDateString('fr-FR')} (Fès)
              </div>
            </div>
          </div>
          <div>
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl transition-colors border border-slate-800">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TABS */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          {[
            { id: "leads", label: "1. Leads & Prospects" },
            { id: "planning", label: "2. Planning Global" },
            { id: "turnovers", label: "3. Turnovers & Ménage" },
            { id: "police", label: "4. Fiches de Police" },
            { id: "finances", label: "5. Finances & Virements" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all flex-1 ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODULE 1: LEADS */}
        {activeTab === "leads" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Demandes d'Estimation</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Prospect</th>
                    <th className="p-4">Bien & Formule</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4 text-slate-500">{lead.date}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500 font-mono">+{lead.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{lead.zone} • {lead.type}</div>
                        <div className="text-xs text-slate-500">{lead.formule}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={lead.status}
                          onChange={(e) => setLeads(leads.map(l => l.id === lead.id ? {...l, status: e.target.value} : l))}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none ${getStatusColor(lead.status)}`}
                        >
                          <option value="Nouveau">Nouveau</option>
                          <option value="Contacté">Contacté</option>
                          <option value="Visite fixée">Visite fixée</option>
                          <option value="Mandat signé">Mandat signé</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <a 
                          href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(`Bonjour ${lead.name}, je suis Anoir de la conciergerie BABFEZ. J'ai bien reçu votre demande d'estimation pour votre bien à ${lead.zone}. Seriez-vous disponible pour un court appel ?`)}`}
                          target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                          Contacter
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MODULE 2: PLANNING GLOBAL */}
        {activeTab === "planning" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Planning Multi-Propriétés</h2>
            <div className="grid gap-4">
              {MOCK_PLANNING.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{prop.name}</h3>
                    <div className="text-sm text-slate-500">{prop.zone}</div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statut Actuel</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${prop.current.includes('Occupé') ? 'bg-rose-100 text-rose-800' : prop.current === 'Libre' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{prop.current}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600">
                      <span className="text-slate-400 mr-2">Suivant:</span>{prop.next}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p className="text-sm text-blue-800 font-medium">Pour une vue Gantt complète du calendrier (jusqu'à 12 mois), connectez-vous directement sur l'interface du Channel Manager intégré.</p>
            </div>
          </section>
        )}

        {/* MODULE 3: TURNOVERS */}
        {activeTab === "turnovers" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Opérations & Ménage</h2>
            <div className="grid gap-6">
              {turnovers.map(turn => (
                <div key={turn.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 flex flex-col justify-center min-w-[200px]">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{turn.date}</div>
                    <div className="text-lg font-extrabold text-slate-900">{turn.property}</div>
                  </div>
                  <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Check-out (Départ)</div>
                      <div className="text-lg font-bold text-rose-600">{turn.checkout}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Check-in (Arrivée)</div>
                      <div className="text-lg font-bold text-emerald-600">{turn.checkin}</div>
                    </div>
                    <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Inventaire Linge Requis</div>
                      <div className="text-sm font-medium text-slate-700">{turn.linen}</div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50 min-w-[220px]">
                    <select 
                      value={turn.status}
                      onChange={(e) => setTurnovers(turnovers.map(t => t.id === turn.id ? {...t, status: e.target.value} : t))}
                      className={`text-sm font-bold px-4 py-2 rounded-xl border-none outline-none cursor-pointer appearance-none text-center ${getStatusColor(turn.status)}`}
                    >
                      <option value="À faire">Ménage À faire</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé & Contrôlé">Terminé & Contrôlé</option>
                    </select>
                    
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Mission Ménage - ${turn.property}\nCheck-out: ${turn.checkout}\nCheck-in suivant: ${turn.checkin}\nLinge à prévoir: ${turn.linen}`)}`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                      Envoyer WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MODULE 4: FICHES DE POLICE */}
        {activeTab === "police" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Registre des Fiches de Police</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Voyageur & Origine</th>
                    <th className="p-4">Séjour & Logement</th>
                    <th className="p-4">Pièce d'Identité</th>
                    <th className="p-4">Statut Fiche</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {police.map(pol => (
                    <tr key={pol.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{pol.name}</div>
                        <div className="text-xs text-slate-500">{pol.nat}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{pol.property}</div>
                        <div className="text-xs text-slate-500 font-mono">{pol.dates}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={pol.idStatus}
                          onChange={(e) => setPolice(police.map(p => p.id === pol.id ? {...p, idStatus: e.target.value} : p))}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none ${getStatusColor(pol.idStatus)}`}
                        >
                          <option value="En attente">En attente (Relancer)</option>
                          <option value="Reçue">Reçue & Conforme</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select 
                          value={pol.policeStatus}
                          onChange={(e) => setPolice(police.map(p => p.id === pol.id ? {...p, policeStatus: e.target.value} : p))}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none ${getStatusColor(pol.policeStatus)}`}
                        >
                          <option value="À remplir">À remplir</option>
                          <option value="Transmise aux autorités">Transmise (Complet)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MODULE 5: FINANCES (EXISTING) */}
        {activeTab === "finances" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Virements Propriétaires</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Propriétaire</th>
                    <th className="p-4">Bien</th>
                    <th className="p-4">Période</th>
                    <th className="p-4">Net (MAD)</th>
                    <th className="p-4">RIB</th>
                    <th className="p-4 text-center">Statut</th>
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
                            Virement Effectué
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setPayouts(payouts.map(p => p.id === po.id ? { ...p, paid: !p.paid } : p))}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${po.paid ? 'border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          {po.paid ? "Annuler" : "Payer"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
