"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";

const dicts = { fr, en, es, ar };

export default function ProprietaireLogin({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("babfez_owner_logged_in", "true");
        router.push(`/${lang}/proprietaire/dashboard`);
      } else {
        setError("Veuillez remplir tous les champs.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <Link href={`/${lang}`} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Retour à l'accueil
      </Link>
      <div className="absolute top-8 right-8"><LanguageSwitcher currentLang={lang} /></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={`/${lang}`} className="flex justify-center items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/></svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-950">BAB<span className="text-amber-600">FEZ</span></span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-950">
          {dict.proprietaire.loginTitle}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {dict.proprietaire.loginSubtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            {dict.proprietaire.demoWarning}
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{dict.proprietaire.email}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">{dict.proprietaire.password}</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" />
            </div>
            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-600">{dict.login?.remember || "Se souvenir de moi"}</label>
              </div>
              <a href="#" className="text-sm font-bold text-amber-600 hover:text-amber-700">{dict.login?.forgot || "Mot de passe oublié ?"}</a>
            </div>
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            <button type="submit" disabled={isLoading} className="w-full py-3 border rounded-xl font-bold text-white bg-slate-950 hover:bg-slate-800 disabled:opacity-70">
              {isLoading ? dict.proprietaire.btnLoading : dict.proprietaire.btnLogin}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500 font-medium">{dict.proprietaire.orContinue}</span></div>
            </div>
            <button onClick={handleLogin} className="mt-6 w-full flex justify-center items-center gap-3 py-3 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 hover:bg-slate-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            
            <div className="mt-8 bg-amber-50 p-4 rounded-xl border border-amber-100 text-center text-sm">
              <p className="text-amber-900 font-medium mb-2">{dict.login?.helpText || "Vous êtes propriétaire d'un bien à Fès et souhaitez nous confier sa gestion ?"}</p>
              <Link href={`/${lang}/#simulateur`} className="text-amber-700 font-extrabold hover:underline">
                {dict.login?.helpLink || "Demander une étude gratuite"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
