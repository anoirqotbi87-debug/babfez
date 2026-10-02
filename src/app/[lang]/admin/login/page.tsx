"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { supabase } from "@/lib/supabaseClient";

const dicts = { fr, en, es, ar };

export default function AdminLogin({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const baseDict = dicts[lang as keyof typeof dicts] || dicts.fr;
  const dict: any = {
    ...dicts.fr,
    ...baseDict,
    nav: { ...dicts.fr.nav, ...(baseDict as any).nav },
    hero: { ...(dicts.fr as any).hero, ...(baseDict as any).hero },
    simulator: { ...(dicts.fr as any).simulator, ...(baseDict as any).simulator },
    services: { ...(dicts.fr as any).services, ...(baseDict as any).services },
    contact: { ...(dicts.fr as any).contact, ...(baseDict as any).contact },
    booking: { ...(dicts.fr as any).booking, ...(baseDict as any).booking },
    modal: { ...(dicts.fr as any).modal, ...(baseDict as any).modal },
    home: { ...(dicts.fr as any).home, ...(baseDict as any).home },
    reserver: { ...(dicts.fr as any).reserver, ...(baseDict as any).reserver },
    proprietaire: { ...(dicts.fr as any).proprietaire, ...(baseDict as any).proprietaire },
    footer: { ...(dicts.fr as any).footer, ...(baseDict as any).footer },
    sim: { ...(dicts.fr as any).sim, ...(baseDict as any).sim },
    form: { ...(dicts.fr as any).form, ...(baseDict as any).form },
    login: { ...(dicts.fr as any).login, ...(baseDict as any).login }
  };
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Identifiants administrateur incorrects.");
      setIsLoading(false);
      return;
    }

    if (data.user?.email !== "admin@babfez.com") {
      setError("Accès refusé. Compte non administrateur.");
      await supabase.auth.signOut();
      setIsLoading(false);
      return;
    }

    router.push(`/${lang}/admin/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#2D3748] flex flex-col justify-center items-center p-4 font-sans">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Link 
          href={`/${lang}`} 
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <span>{lang === 'ar' ? "→" : "←"}</span>
          <span>{lang === 'ar' ? "العودة للرئيسية" : (lang === 'en' ? "Back to Home" : (lang === 'es' ? "Volver al inicio" : "Retour à l'accueil"))}</span>
        </Link>
      </div>




      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-warm border border-[#D8E8E6]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#6F8E88] to-[#63968C] rounded-2xl mx-auto flex items-center justify-center text-[#A1C0BA] mb-4 shadow-lg shadow-[#6F8E88]/20 border border-[#A1C0BA]/40">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className={`text-2xl font-black text-[#6F8E88] ${lang === 'ar' ? '' : 'font-serif'}`}>Espace Administrateur</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Gestion globale de la plateforme BABFEZ</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Adresse Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@babfez.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-[#6F8E88] to-[#63968C] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#6F8E88]/25 transition-all shadow-md mt-4">
            {isLoading ? "Connexion..." : "Connexion Admin"}
          </button>
        </form>
      </div>
      <div className="mt-8 text-center text-xs font-bold text-slate-400">
        Demo Credentials: admin@babfez.com / admin123 (Veuillez créer ce compte sur Supabase)
      </div>
    </div>
  );
}
