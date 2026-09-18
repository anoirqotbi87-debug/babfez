"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_INFO } from "@/config/site";

// Mock Data for the Guide
const GUIDE_DATA: Record<string, any> = {
  p1: {
    id: "p1",
    name: "Riad Dar Ziryab",
    location: "Médina, Fès",
    address: "12 Derb El Miter, Fès El Bali",
    mapLink: "https://maps.google.com/?q=Fes+El+Bali",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80",
    wifi: { ssid: "Riad_Ziryab_5G", pass: "Fes2026!Ziryab" },
    boxLocation: "Boîte noire située sur la porte en bois massif du Riad.",
    boxCode: "1482",
    acManual: "La télécommande est au mur. Appuyez sur 'Mode' jusqu'à l'icône Flocon (Été 23°C) ou Soleil (Hiver 22°C). Merci d'éteindre en quittant le Riad.",
    waterManual: "Le chauffe-eau est électrique et fonctionne en continu. Laissez couler 2 minutes pour avoir de l'eau très chaude.",
    trashManual: "Déposez vos sacs poubelles bien fermés dans les bacs verts situés à l'entrée de la ruelle principale (Talaa Kebira).",
  },
  p2: {
    id: "p2",
    name: "Appartement Standing Atlas",
    location: "Ville Nouvelle, Fès",
    address: "Résidence Les Iris, Quartier Atlas, Fès",
    mapLink: "https://maps.google.com/?q=Avenue+Hassan+II+Fes",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    wifi: { ssid: "Atlas_Fiber", pass: "AtlasFiber123@" },
    boxLocation: "Boîte à clés sécurisée attachée à la grille du compteur d'eau (Palier 3ème étage).",
    boxCode: "7539",
    acManual: "Climatisation centralisée. Utilisez l'écran tactile du salon pour régler la température de l'ensemble de l'appartement.",
    waterManual: "Chauffe-eau au gaz avec sécurité automatique. Ne modifiez pas les réglages sur l'appareil.",
    trashManual: "Le local poubelle se trouve au sous-sol (niveau -1) accessible par l'ascenseur.",
  },
  p3: {
    id: "p3",
    name: "Studio Moderne Palmier",
    location: "Route d'Immouzzer, Fès",
    address: "Immeuble Palmier, Route d'Immouzzer, Fès",
    mapLink: "https://maps.google.com/?q=Route+d+Immouzzer+Fes",
    image: "https://images.unsplash.com/photo-1502672260266-1c1de2d936b4?auto=format&fit=crop&w=1200&q=80",
    wifi: { ssid: "Studio_Palmier", pass: "PalmierFes2026" },
    boxLocation: "Pas de boîte à clés, le code de la serrure électronique (porte d'entrée) vous est envoyé par message.",
    boxCode: "Entrez 4598 puis la touche '#'",
    acManual: "Télécommande sur la table de nuit. Température idéale : 23°C. Mode éco recommandé.",
    waterManual: "Chauffe-eau électrique (ballon de 50L). Idéal pour 2 douches consécutives.",
    trashManual: "Bacs à ordures situés sur le trottoir à 20 mètres à droite en sortant de la résidence.",
  }
};

export default function WelcomeBook({ params }: { params: { lang: string, propertyId: string } }) {
  const lang = params.lang;
  const propertyId = params.propertyId;
  const property = GUIDE_DATA[propertyId] || GUIDE_DATA["p1"];
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ac");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(property.wifi.pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-28">
      {/* HEADER & IMAGE */}
      <div className="relative w-full h-72 sm:h-96">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
        <Link href={`/${lang}/reserver`} className="absolute top-6 left-6 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </Link>
        <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
          BABFEZ Guest Guide
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="text-amber-400 font-bold text-sm tracking-wide mb-1 uppercase">{property.location}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">{property.name}</h1>
          <p className="text-slate-300 text-sm flex items-center gap-1.5 line-clamp-1">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {property.address}
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 relative z-10 space-y-6">
        
        {/* ACTION BUTTONS (MAPS & CHECKIN) */}
        <div className="grid grid-cols-2 gap-3">
          <a href={property.mapLink} target="_blank" rel="noreferrer" className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            <span className="text-xs font-bold uppercase tracking-wider text-center">Ouvrir Maps / Waze</span>
          </a>
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horaires</div>
            <div className="text-sm font-extrabold text-slate-800">In <span className="text-emerald-600">15h</span> • Out <span className="text-rose-600">11h</span></div>
          </div>
        </div>

        {/* WIFI CARD */}
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-6 shadow-xl text-white overflow-hidden relative">
          <svg className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-800/30 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
                </div>
                <h2 className="text-lg font-bold">Wi-Fi Haute Vitesse</h2>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-indigo-300 uppercase tracking-widest font-semibold">Réseau (SSID)</div>
                <div className="text-lg font-mono font-bold tracking-tight">{property.wifi.ssid}</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 min-w-[200px]">
              <div className="text-xs text-indigo-300 uppercase tracking-widest font-semibold mb-1">Mot de passe</div>
              <div className="text-lg font-mono font-bold tracking-tight mb-3">{property.wifi.pass}</div>
              <button onClick={copyToClipboard} className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'}`}>
                {copied ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Copié !</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Copier le mot de passe</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ACCES & BOITE A CLES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-xl shadow-inner">🔑</div>
            <h2 className="text-xl font-extrabold text-slate-900">Accès & Clés</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 mt-0.5">1</div>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Localisation :</strong> {property.boxLocation}</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 mt-0.5">2</div>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Code :</strong> Utilisez le code <strong>{property.boxCode}</strong>. Baissez le loquet pour ouvrir. Repoussez les chiffres pour refermer et brouillez le code.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 mt-0.5">3</div>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Départ :</strong> Veuillez obligatoirement remettre les clés dans cette même boîte lors de votre départ à 11h00.</p>
            </div>
          </div>
          <div className="mt-6 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-800 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p className="font-medium">Rappel de sécurité : Toujours fermer la porte à double tour lors de vos sorties pour garantir la sécurité de vos biens.</p>
          </div>
        </div>

        {/* MODE D'EMPLOI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 text-xl shadow-inner">🛋️</div>
            <h2 className="text-xl font-extrabold text-slate-900">Mode d'Emploi</h2>
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab("ac")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "ac" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Climatisation</button>
            <button onClick={() => setActiveTab("water")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "water" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Eau Chaude</button>
            <button onClick={() => setActiveTab("trash")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "trash" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Poubelles</button>
          </div>
          <div className="min-h-[100px] text-slate-600 text-sm leading-relaxed animate-in fade-in duration-300">
            {activeTab === "ac" && <p>{property.acManual}</p>}
            {activeTab === "water" && <p>{property.waterManual}</p>}
            {activeTab === "trash" && <p>{property.trashManual}</p>}
          </div>
        </div>

        {/* GUIDE FES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-xl shadow-inner">🗺️</div>
            <h2 className="text-xl font-extrabold text-slate-900">Guide Pratique de Fès</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <span className="text-lg">🚕</span> Se déplacer (Petits Taxis)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">Les petits taxis rouges sont très pratiques. <strong>Exigez toujours l'activation du compteur</strong> (Tarif minimum de jour : ~7-8 MAD, de nuit : majoration 50%). S'ils refusent, prenez le suivant.</p>
            </div>
            <div className="h-px w-full bg-slate-100"></div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="text-lg">🍽️</span> Recommandations BABFEZ
              </h3>
              <ul className="space-y-3">
                <li className="text-sm">
                  <div className="font-bold text-amber-700">The Ruined Garden (Médina)</div>
                  <div className="text-slate-600">Cuisine marocaine revisitée dans un jardin historique magnifique. Idéal pour le déjeuner.</div>
                </li>
                <li className="text-sm">
                  <div className="font-bold text-amber-700">L'Amandier - Palais Faraj</div>
                  <div className="text-slate-600">Vue panoramique d'exception sur la Médina au coucher du soleil. (Réservation conseillée).</div>
                </li>
              </ul>
            </div>
            <div className="h-px w-full bg-slate-100"></div>
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <span className="text-lg">📸</span> Incontournables
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">Bab Boujloud (Porte Bleue), la Médersa Bou Inania (Architecture fascinante) et bien sûr les Tanneries Chouara (à voir depuis les terrasses gratuites des vendeurs de cuir).</p>
            </div>
          </div>
        </div>

        {/* REGLES ET NUMEROS */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl font-extrabold mb-6">Règles & Urgences</h2>
          <ul className="space-y-3 text-sm text-slate-300 mb-8 list-disc list-inside">
            <li>Logement <strong>strictement non-fumeur</strong> à l'intérieur.</li>
            <li>Calme absolu demandé après 22h00 pour le voisinage.</li>
            <li>Les fêtes et rassemblements sont formellement interdits.</li>
          </ul>
          
          <h3 className="font-bold text-amber-500 mb-3 text-sm uppercase tracking-wider">Urgences au Maroc</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-black text-white">19</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Police</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-black text-rose-400">15</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Pompiers</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <div className="text-xl font-black text-emerald-400">141</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">SAMU</div>
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING WHATSAPP ASSISTANCE BUTTON */}
      <a 
        href={`${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(`Bonjour BABFEZ, je séjourne actuellement au ${property.name} et j'ai une question : `)}`}
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 left-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-3 font-bold max-w-2xl mx-auto"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.824-3.113 6.938-6.938 6.943z"/></svg>
        Assistance BABFEZ (24/7)
      </a>
    </div>
  );
}
