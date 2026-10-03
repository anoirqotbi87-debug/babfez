"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const MOCK_LEADS = [
  { id: "l1", date: "18 Sep 2026", name: "Karim Alaoui", phone: "212611223344", zone: "Route d'Immouzzer", type: "Appartement F3", formule: "Gestion Sérénité", status: "Nouveau" },
  { id: "l2", date: "17 Sep 2026", name: "Dr. Lahlou", phone: "212699887766", zone: "Ville Nouvelle / Atlas", type: "Appartement Standing", formule: "Gestion Digitale", status: "Contacté" },
  { id: "l3", date: "15 Sep 2026", name: "M. Berrada", phone: "212644556677", zone: "Médina", type: "Riad Traditionnel", formule: "Gestion Premium", status: "Mandat signé" },
];

const MOCK_PLANNING = [
  { 
    id: "p1", 
    name: "Riad Dar Ziryab", 
    zone: "Médina, Fès", 
    address: "12 Derb El Miter, Fès El Bali", 
    current: "Occupé (J. Dupont)", 
    next: "Libre le 22 Sep",
    wifiName: "Riad_Ziryab_5G",
    wifiPassword: "Fes2026!Ziryab"
  },
  { 
    id: "p2", 
    name: "Appartement Standing Atlas", 
    zone: "Ville Nouvelle, Fès", 
    address: "Résidence Les Iris, Quartier Atlas, Fès", 
    current: "Libre", 
    next: "Arrivée prévue (A. Tazi) à 15h",
    wifiName: "Atlas_Fiber",
    wifiPassword: "AtlasFiber123@"
  },
  { 
    id: "p3", 
    name: "Studio Moderne Palmier", 
    zone: "Route d'Immouzzer, Fès", 
    address: "Immeuble Palmier, Route d'Immouzzer, Fès", 
    current: "Bloqué par propriétaire", 
    next: "Jusqu'au 30 Sep",
    wifiName: "Studio_Palmier",
    wifiPassword: "PalmierFes2026"
  },
];

const MOCK_TURNOVERS = [
  { id: "t1", date: "Aujourd'hui", property: "Riad Dar Ziryab", checkout: "11:00", checkin: "15:00", linen: "3 grands lits, 6 serviettes", status: "À faire" },
  { id: "t2", date: "Aujourd'hui", property: "Appartement Atlas", checkout: "10:00", checkin: "16:00", linen: "1 grand lit, 2 serviettes", status: "En cours" },
  { id: "t3", date: "Demain", property: "Studio Moderne", checkout: "-", checkin: "-", linen: "-", status: "Terminé & Contrôlé" },
];

const MOCK_POLICE = [
  { 
    id: "pol-101", 
    name: "Dupont Jean-Luc", 
    birthDate: "14/05/1984",
    birthPlace: "Paris (France)",
    nat: "Française", 
    passport: "24AA89412",
    issueDate: "12/03/2021",
    profession: "Ingénieur Consultant",
    address: "24 Rue de Rivoli, 75004 Paris",
    country: "France",
    arrivalDate: "18/09/2026",
    departureDate: "22/09/2026",
    dates: "18-22 Sep 2026", 
    property: "Riad Dar Ziryab",
    propertyAddress: "12 Derb El Miter, Médina de Fès",
    idStatus: "Reçue", 
    policeStatus: "Transmise aux autorités" 
  },
  { 
    id: "pol-102", 
    name: "Tazi Amine", 
    birthDate: "03/11/1990",
    birthPlace: "Casablanca (Maroc)",
    nat: "Marocaine", 
    passport: "CNI BE548921",
    issueDate: "18/07/2022",
    profession: "Directeur Financier",
    address: "Boulevard d'Anfa, Casablanca",
    country: "Maroc",
    arrivalDate: "18/09/2026",
    departureDate: "20/09/2026",
    dates: "18-20 Sep 2026", 
    property: "Appartement Standing Atlas",
    propertyAddress: "Résidence Les Iris, Quartier Atlas, Fès",
    idStatus: "En attente", 
    policeStatus: "À remplir" 
  },
  { 
    id: "pol-103", 
    name: "Rossi Elena", 
    birthDate: "22/08/1992",
    birthPlace: "Rome (Italie)",
    nat: "Italienne", 
    passport: "YA4490182",
    issueDate: "05/09/2023",
    profession: "Architecte d'Intérieur",
    address: "Via del Corso 15, Rome",
    country: "Italie",
    arrivalDate: "23/09/2026",
    departureDate: "28/09/2026",
    dates: "23-28 Sep 2026", 
    property: "Studio Moderne Palmier",
    propertyAddress: "Immeuble Palmier, Route d'Immouzzer, Fès",
    idStatus: "Reçue", 
    policeStatus: "À remplir" 
  }
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

  // Modals for Automatisation 1 (Chevalet A5) & Automatisation 2 (Fiche Police A4)
  const [selectedChevalet, setSelectedChevalet] = useState<typeof MOCK_PLANNING[0] | null>(null);
  const [selectedPolice, setSelectedPolice] = useState<typeof MOCK_POLICE[0] | null>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const checkAdmin = async () => {
      let isAuth = false;
      let currentUser: any = null;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase();
          const role = session.user.user_metadata?.role;
          if (
            userEmail === "aqotbi@babfez.ma" ||
            userEmail === "anoirqotbi87@gmail.com" ||
            userEmail === "admin@babfez.com" ||
            role === "admin"
          ) {
            isAuth = true;
            currentUser = session.user;
          }
        }
      } catch {
        // En cas d'erreur de connexion à Supabase
      }

      if (!isAuth && typeof document !== "undefined") {
        const matchRole = document.cookie.match(/babfez-auth-role=([^;]+)/);
        const role = matchRole ? matchRole[1] : null;
        if (role === 'admin') {
          isAuth = true;
          const matchUser = document.cookie.match(/babfez-auth-user=([^;]+)/);
          currentUser = matchUser ? JSON.parse(decodeURIComponent(matchUser[1])) : {
            email: "aqotbi@babfez.ma",
            username: "Aqotbi",
            fullName: "Anoir Qotbi",
            role: "admin",
          };
          localStorage.setItem("babfez_admin_logged_in", "true");
          localStorage.setItem("babfez_user", JSON.stringify(currentUser));
        }
      }

      if (!isAuth && typeof window !== "undefined") {
        const localLoggedIn = localStorage.getItem("babfez_admin_logged_in") === "true";
        if (localLoggedIn) {
          isAuth = true;
          const savedUser = localStorage.getItem("babfez_user");
          currentUser = savedUser ? JSON.parse(savedUser) : {
            email: "aqotbi@babfez.ma",
            username: "Aqotbi",
            fullName: "Anoir Qotbi",
            role: "admin",
          };
        }
      }

      if (!isAuth) {
        router.push(`/${lang}/admin/login`);
      } else {
        setUser(currentUser);
        fetchData();
      }
    };
    checkAdmin();
  }, [router, lang]);

  const fetchData = async () => {
    try {
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadsData && leadsData.length > 0) setLeads(leadsData.map((l: any) => ({
        id: l.id,
        date: new Date(l.created_at).toLocaleDateString('fr-FR'),
        name: l.name,
        phone: l.phone,
        zone: l.zone,
        type: l.property_type,
        formule: l.formula,
        status: l.status
      })));
    } catch {}
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setLeads(leads.map(l => l.id === id ? {...l, status: newStatus} : l));
    try {
      await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("babfez_admin_logged_in");
      localStorage.removeItem("babfez_user");
    }
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
      <header className="bg-slate-950 text-white py-4 px-6 sticky top-0 z-40 shadow-md no-print">
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
                <span>Connecté : <strong className="text-slate-200">{user?.user_metadata?.fullName || user?.user_metadata?.username || user?.email || "Anoir Qotbi (Aqotbi)"}</strong></span>
                <span>• {new Date().toLocaleDateString('fr-FR')} (Fès)</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 no-print">
        {/* TABS */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          {[
            { id: "leads", label: "1. Leads & Prospects" },
            { id: "planning", label: "2. Planning & Chevalets" },
            { id: "turnovers", label: "3. Turnovers & Ménage" },
            { id: "police", label: "4. Fiches de Police (DGSN)" },
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
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
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
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
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

        {/* MODULE 2: PLANNING GLOBAL & CHEVALETS D'ACCUEIL */}
        {activeTab === "planning" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Planning & Logements</h2>
                <p className="text-sm text-slate-500">Gérez l'occupation et imprimez les chevalets QR Code A5 officiels pour chaque logement.</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {MOCK_PLANNING.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-slate-900">{prop.name}</h3>
                      <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">{prop.id.toUpperCase()}</span>
                    </div>
                    <div className="text-sm text-slate-600">{prop.zone} • <span className="text-xs text-slate-400">{prop.address}</span></div>
                    <div className="text-xs text-slate-500 font-mono pt-1">
                      Wi-Fi: <strong className="text-slate-800">{prop.wifiName}</strong> • Pass: <strong className="text-slate-800">{prop.wifiPassword}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${prop.current.includes('Occupé') ? 'bg-rose-100 text-rose-800' : prop.current === 'Libre' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{prop.current}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        <span className="text-slate-400 mr-1.5">Suivant:</span>{prop.next}
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedChevalet(prop)}
                      className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-white bg-[#B85D36] hover:bg-[#A04E2B] px-4 py-3 rounded-xl transition-all shadow-md shadow-[#B85D36]/20"
                      title="Imprimer le chevalet de bienvenue format A5"
                    >
                      <span>🖨️</span>
                      <span>Imprimer le Chevalet d'Accueil (A5)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
              <span className="text-xl">💡</span>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                <strong>Conseil Opérationnel BABFEZ :</strong> Placez le chevalet d'accueil A5 sous cadre en bois ou plexiglas transparent sur la table d'entrée ou la table de chevet de chaque chambre. Les voyageurs scannent instantanément pour accéder aux codes Wi-Fi, règles et recommandations.
              </p>
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
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
                      Envoyer WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MODULE 4: FICHES DE POLICE OFFICIELLES (DGSN) */}
        {activeTab === "police" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Registre des Fiches de Police (DGSN)</h2>
                <p className="text-sm text-slate-500">Conforme aux obligations de déclaration auprès de la Police Touristique et de la DGSN de Fès.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Voyageur & Origine</th>
                    <th className="p-4">Séjour & Logement</th>
                    <th className="p-4">Pièce d'Identité</th>
                    <th className="p-4">Statut Fiche</th>
                    <th className="p-4 text-right">Action Légale</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {police.map(pol => (
                    <tr key={pol.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{pol.name}</div>
                        <div className="text-xs text-slate-500">{pol.nat} • {pol.country}</div>
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
                          <option value="Transmise aux autorités">Transmise aux autorités</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedPolice(pol)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white px-3.5 py-2 rounded-xl border border-slate-300 transition-all shadow-sm"
                        >
                          <span>📄</span>
                          <span>Générer Fiche de Police (A4)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MODULE 5: FINANCES & VIREMENTS */}
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

      {/* ========================================================== */}
      {/* MODALE 1 : CHEVALET D'ACCUEIL QR CODE FORMAT A5           */}
      {/* ========================================================== */}
      {selectedChevalet && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            {/* Top action bar (hidden in print) */}
            <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Aperçu Chevalet d'Accueil (A5)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 bg-[#B85D36] hover:bg-[#A04E2B] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  🖨️ Imprimer en A5
                </button>
                <button
                  onClick={() => setSelectedChevalet(null)}
                  className="text-slate-500 hover:text-slate-800 text-sm font-bold px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>

            {/* Printable A5 Easel Content */}
            <div className="printable-area p-6 sm:p-8 text-center bg-[#FBF9F5] border-[5px] border-[#C59B27]/40 rounded-2xl m-2 sm:m-4 shadow-inner relative">
              <div className="border border-[#C59B27]/30 p-5 rounded-xl bg-white/95">
                {/* Logo & En-tête */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img
                    src="https://babfez.com/wp-content/uploads/2022/06/logo.png"
                    alt="BABFEZ"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-2xl font-serif font-black tracking-tight text-[#1C1917]">
                    BAB<span className="text-[#B85D36]">FEZ</span>
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#C59B27] font-black mb-1">
                  Conciergerie Privée d'Excellence
                </div>
                <div className="text-xs font-serif italic text-stone-600 mb-4">
                  ✨ Bienvenue à Fès • Welcome to Fez
                </div>

                {/* Logement */}
                <div className="mb-4 pb-3 border-b border-stone-200">
                  <h2 className="text-xl font-serif font-bold text-[#1C1917] leading-tight">
                    {selectedChevalet.name}
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">{selectedChevalet.address}</p>
                </div>

                {/* QR Code Grand Format */}
                <div className="my-4 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#C59B27]/40 shadow-sm inline-block">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://babfez.vercel.app/fr/guide/${selectedChevalet.id}`)}`}
                      alt="QR Code Livret d'Accueil"
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-[#B85D36] mt-2 tracking-wide uppercase">
                    📱 Scannez pour ouvrir votre Guide Digital
                  </p>
                </div>

                {/* Encart Wi-Fi Très Lisible */}
                <div className="my-4 p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E7DDD3] text-left">
                  <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <span>📶</span>
                    <span>Accès Wi-Fi Haute Vitesse</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500 font-semibold">Réseau (SSID) :</span>
                      <span className="font-mono font-bold text-sm text-[#1C1917]">{selectedChevalet.wifiName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500 font-semibold">Mot de passe :</span>
                      <span className="font-mono font-black text-sm text-[#B85D36]">{selectedChevalet.wifiPassword}</span>
                    </div>
                  </div>
                </div>

                {/* Assistance 24/7 */}
                <div className="pt-3 border-t border-stone-200 text-[10px] text-stone-600 space-y-0.5">
                  <p className="font-medium">
                    Scannez pour accéder au guide digital, conseils de visite et assistance WhatsApp 24/7 au <strong>+212 7 78 87 41 14</strong>
                  </p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider pt-0.5">
                    Check-in : 15h00 • Check-out : 11h00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALE 2 : FICHE DE POLICE OFFICIELLE FORMAT A4 (DGSN)    */}
      {/* ========================================================== */}
      {selectedPolice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200">
            {/* Top action bar (hidden in print) */}
            <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Aperçu Fiche de Police Officielle (Format A4)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  🖨️ Imprimer en A4 / PDF
                </button>
                <button
                  onClick={() => setSelectedPolice(null)}
                  className="text-slate-500 hover:text-slate-800 text-sm font-bold px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>

            {/* Printable A4 Form Content */}
            <div className="printable-area p-8 sm:p-12 text-[#1C1917] bg-white font-sans text-xs">
              {/* Official Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 mb-6 space-y-1">
                <div className="flex justify-between items-start text-[10px] font-bold text-slate-600 uppercase">
                  <span>Royaume du Maroc<br />Ministère de l'Intérieur</span>
                  <span className="text-right" dir="rtl">المملكة المغربية<br />وزارة الداخلية</span>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-900 pt-1">
                  DIRECTION GÉNÉRALE DE LA SÛRETÉ NATIONALE (DGSN)
                </h2>
                <div className="text-xs font-bold uppercase text-slate-700">
                  FICHE INDIVIDUELLE DE POLICE POUR ÉTABLISSEMENT TOURISTIQUE
                </div>
                <div className="text-[11px] text-slate-600" dir="rtl">
                  استمارة الشرطة الفردية للمؤسسات السياحية والإيواء المؤقت
                </div>
                <div className="text-[9px] text-slate-400 italic">
                  Conforme aux dispositions du Dahir n° 1-02-297 du 25 Rejeb 1423 (loi n° 61-00)
                </div>
              </div>

              {/* Établissement Header */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-5">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Établissement Déclarant :</span>
                  <span className="font-extrabold text-sm text-slate-900">BABFEZ Conciergerie Privée</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block">Logement & Adresse à Fès :</span>
                  <span className="font-bold text-xs text-slate-800">{selectedPolice.property} — {selectedPolice.propertyAddress}</span>
                </div>
              </div>

              {/* SECTION 1: ÉTAT CIVIL */}
              <div className="mb-5">
                <div className="bg-slate-900 text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-t">
                  1. État Civil du Voyageur / الحالة المدنية
                </div>
                <div className="border border-t-0 border-slate-300 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Nom de famille / Prénom (Surname & Given Name) :</span>
                      <span className="font-bold text-sm text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Nationalité (Nationality) :</span>
                      <span className="font-bold text-sm text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.nat}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Date et Lieu de naissance (Date & Place of birth) :</span>
                      <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.birthDate} à {selectedPolice.birthPlace}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Profession (Occupation) :</span>
                      <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.profession}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Adresse habituelle (Permanent Address) :</span>
                      <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.address}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Pays de résidence (Country of residence) :</span>
                      <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: TITRE D'IDENTITÉ */}
              <div className="mb-5">
                <div className="bg-slate-900 text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-t">
                  2. Pièce d'Identité / Passeport / وثيقة التعريف
                </div>
                <div className="border border-t-0 border-slate-300 p-4 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">N° Passeport ou CNI :</span>
                    <span className="font-mono font-bold text-sm text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.passport}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Date de délivrance (Date of issue) :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Délivré par (Issued by) :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">Autorités compétentes</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SÉJOUR */}
              <div className="mb-6">
                <div className="bg-slate-900 text-white font-bold px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-t">
                  3. Renseignements relatifs au séjour / بيانات الإقامة
                </div>
                <div className="border border-t-0 border-slate-300 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Date d'arrivée :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.arrivalDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Date de départ prévue :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.departureDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Venant de (From) :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">{selectedPolice.country}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Se rendant à (To) :</span>
                    <span className="font-bold text-xs text-slate-900 border-b border-dotted border-slate-400 block pb-0.5">Maroc / Retour</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SIGNATURES */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="border border-slate-300 rounded-lg p-4 h-32 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">
                    Signature du Voyageur (Guest Signature) :
                  </span>
                  <div className="text-[9px] text-slate-400 italic">
                    "Je certifie sur l'honneur l'exactitude des renseignements ci-dessus."
                  </div>
                </div>
                <div className="border border-slate-300 rounded-lg p-4 h-32 flex flex-col justify-between bg-slate-50/50">
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">
                    Cachet & Visa de la Conciergerie BABFEZ :
                  </span>
                  <div className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider">
                    Enregistré pour transmission DGSN Fès
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
