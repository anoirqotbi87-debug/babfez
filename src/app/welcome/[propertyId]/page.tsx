"use client";

import { useState } from "react";
import Link from "next/link";

export default function WelcomeBook({ params }: { params: { propertyId: string } }) {
  const { propertyId } = params;
  
  const [copied, setCopied] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [nationality, setNationality] = useState("");
  const [passportNum, setPassportNum] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText("BABFEZ_GUEST_2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePassportUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('propertyId', propertyId);
      
      const res = await fetch('/api/upload-passport', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (err) {
      alert("Erreur de connexion.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="bg-[#0B2545] text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#C59B27]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-widest uppercase">BABFEZ</h1>
              <p className="text-[10px] text-[#C59B27] font-bold tracking-widest uppercase">Conciergerie Privée</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Bienvenue !</h2>
          <p className="text-slate-300 font-medium">Logement : {propertyId.replace(/-/g, ' ').toUpperCase()}</p>
        </div>
      </header>

      <main className="px-4 -mt-4 relative z-20 space-y-4 max-w-lg mx-auto">
        
        {/* WI-FI CARD */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[#134074]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
            <h3 className="font-bold text-lg">Réseau Wi-Fi</h3>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SSID (Réseau)</div>
            <div className="font-extrabold text-[#0B2545]">BABFEZ_GUEST</div>
          </div>
          <button 
            onClick={handleCopyWifi}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-[#0B2545] text-white hover:bg-[#134074]'}`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                Mot de passe copié !
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                Copier le mot de passe
              </>
            )}
          </button>
        </div>

        {/* ACCESS & RULES */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-[#134074] text-lg border-b border-slate-100 pb-2">Informations Pratiques</h3>
          
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0B2545]">Check-out & Clés</div>
              <div className="text-sm text-slate-500">Le départ se fait avant 11h00. Veuillez remettre les clés dans la boîte sécurisée.</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0B2545]">Climatisation Réversible</div>
              <div className="text-sm text-slate-500">Mode Froid (Flocon) à 23°C / Mode Chaud (Soleil) à 22°C. Merci d'éteindre en sortant.</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0B2545]">Règles de Vie</div>
              <div className="text-sm text-slate-500">Logement non-fumeur. Calme exigé après 22h00. Fêtes strictement interdites.</div>
            </div>
          </div>
        </div>

        {/* DGSN FORM */}
        <div className="bg-[#0B2545] p-5 rounded-2xl shadow-lg border border-[#134074] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C59B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Fiche de Police (Obligatoire)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 font-medium leading-relaxed">
            Conformément à la législation marocaine, merci de remplir ce formulaire et d'importer une photo de votre pièce d'identité avant votre arrivée.
          </p>

          {uploadSuccess ? (
            <div className="bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] p-4 rounded-xl text-sm font-bold flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Document transmis avec succès aux autorités.
            </div>
          ) : (
            <form onSubmit={handlePassportUpload} className="space-y-3">
              <input type="text" required placeholder="Nom complet" value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#C59B27]" />
              <div className="flex gap-3">
                <input type="text" required placeholder="Nationalité" value={nationality} onChange={e => setNationality(e.target.value)} className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#C59B27]" />
                <input type="text" required placeholder="N° Passeport/CIN" value={passportNum} onChange={e => setPassportNum(e.target.value)} className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#C59B27]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#C59B27] mb-1">Photo Passeport / CIN</label>
                <input type="file" required accept="image/*,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#C59B27] file:text-white hover:file:bg-[#B38920]" />
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-[#C59B27] text-white font-bold py-3 rounded-xl mt-2 hover:bg-[#B38920] disabled:opacity-50">
                {isUploading ? "Transmission en cours..." : "Transmettre"}
              </button>
            </form>
          )}
        </div>

        {/* LOCAL GUIDE */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-[#134074] text-lg border-b border-slate-100 pb-2">Guide Local : Fès</h3>
          
          <div>
            <h4 className="font-bold text-sm text-[#0B2545] mb-1 flex items-center gap-2">🚕 Se déplacer</h4>
            <p className="text-sm text-slate-500">Privilégiez les petits taxis rouges. Exigez systématiquement le compteur : <strong>"L'compteur, 3afak"</strong>. Le tarif minimum de jour est d'environ 7 à 8 MAD.</p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#0B2545] mb-1 flex items-center gap-2">🍽 Gastronomie</h4>
            <ul className="text-sm text-slate-500 space-y-1 ml-4 list-disc marker:text-[#C59B27]">
              <li><strong>The Ruined Garden</strong> (Médina) : Magique, dans les ruines.</li>
              <li><strong>L'Amandier</strong> (Palais Faraj) : Pour la vue panoramique.</li>
              <li>Street food à <strong>Bab Boujloud</strong> : Authentique et vivant.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#0B2545] mb-1 flex items-center gap-2">📍 À Visiter</h4>
            <p className="text-sm text-slate-500">Porte Bab Boujloud, Médersa Bou Inania, Tanneries Chouara, Palais Royal (extérieur).</p>
          </div>
        </div>

        {/* SERVICES EXCLUSIFS UPSELL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="font-bold text-[#134074] text-lg">Nos Services Exclusifs à Fès</h3>
              <p className="text-[11px] text-slate-400">Commandez directement vos prestations par WhatsApp</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "🚖 Transfert VIP Aéroport Fès-Saïss",
                desc: "Accueil personnalisé avec pancarte à l'arrivée (200 MAD)"
              },
              {
                title: "🏛️ Visite Guidée Privée de la Médina",
                desc: "Guide officiel bilingue 3h à 4h (350 MAD)"
              },
              {
                title: "☕ Petit-déjeuner Traditionnel Fassi",
                desc: "Msemen, Baghrir, miel & thé livré (80 MAD / pers / jour)"
              },
              {
                title: "⛰️ Excursion Chefchaouen ou Meknès",
                desc: "Chauffeur privé dédié pour la journée (600 MAD)"
              }
            ].map((srv, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">{srv.title}</div>
                  <div className="text-[11px] text-slate-500">{srv.desc}</div>
                </div>
                <a
                  href={`https://wa.me/212778874114?text=${encodeURIComponent(`Bonjour BABFEZ, je séjourne au ${propertyId} et je souhaite réserver : ${srv.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Commander
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ASSISTANCE */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-center">
          <h3 className="font-bold text-[#134074] text-lg mb-2">Assistance & Urgences</h3>
          <a href="https://wa.me/212778874114?text=Bonjour,%20je%20suis%20actuellement%20dans%20le%20logement..." target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3.5 rounded-xl font-bold hover:bg-[#1DA851] transition-colors shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
            Contacter BABFEZ Conciergerie
          </a>
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-[#0B2545] font-black text-xl">19</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Police</div>
            </div>
            <div className="text-center">
              <div className="text-[#0B2545] font-black text-xl">15</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Pompiers</div>
            </div>
            <div className="text-center">
              <div className="text-[#0B2545] font-black text-xl">141</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">SAMU</div>
            </div>
          </div>
        </div>

        <div className="text-center pb-8 pt-4">
          <p className="text-xs text-slate-400 font-medium">Powering premium stays in Fes.</p>
        </div>
      </main>
    </div>
  );
}
