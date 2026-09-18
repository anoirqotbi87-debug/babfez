"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";

const dicts = { fr, en, es };

export default function AdminLogin({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@babfez.ma" && password === "admin123") {
      localStorage.setItem("babfez_admin_logged_in", "true");
      router.push(`/${lang}/admin/dashboard`);
    } else {
      setError("Identifiants administrateur incorrects.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans text-slate-900">
      <Link href={`/${lang}`} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        {dict.login.backHome}
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl mx-auto flex items-center justify-center text-amber-500 mb-4 shadow-lg shadow-slate-900/20">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950">Espace Administrateur</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Gestion globale de la plateforme BABFEZ</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{dict.login.emailLabel}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@babfez.ma" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{dict.login.passwordLabel}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" />
          </div>

          <button type="submit" className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg mt-4">
            Connexion Admin
          </button>
        </form>
      </div>
      <div className="mt-8 text-center text-xs font-bold text-slate-400">
        Demo Credentials: admin@babfez.ma / admin123
      </div>
    </div>
  );
}
