"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { signInWithGoogle, signInWithIdentifier } from "@/lib/authService";

const dicts = { fr, en, es, ar };

function ProprietaireLoginForm({ lang }: { lang: keyof typeof dicts }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const baseDict = dicts[lang] || dicts.fr;
  const dict: any = {
    ...dicts.fr,
    ...baseDict,
    proprietaire: { ...(dicts.fr as any).proprietaire, ...(baseDict as any).proprietaire },
    login: { ...(dicts.fr as any).login, ...(baseDict as any).login },
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const err = searchParams?.get("error");
    if (err === "unauthorized") {
      setError("Connexion impossible ou session expirée. Veuillez réessayer.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Veuillez renseigner votre identifiant et votre mot de passe.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signInWithIdentifier({
        identifier: email,
        password,
        context: "proprietaire",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("babfez_owner_logged_in", "true");
        localStorage.setItem(
          "babfez_owner_user",
          JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            username: (result.user as any).user_metadata?.username || "Aqotbi",
            fullName: (result.user as any).user_metadata?.fullName || "M. Anoir Qotbi",
            role: "owner",
          })
        );
      }

      router.push(`/${lang}/proprietaire/dashboard`);
    } catch (err: any) {
      setError(err.message || "Identifiants incorrects ou compte inexistant.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle("proprietaire", lang);
    } catch (err: any) {
      setError(err.message || "Impossible d'initialiser la connexion avec Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow-warm sm:rounded-2xl sm:px-10 border border-[#D8E8E6]">
      {/* Bouton Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-60 mb-6"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>
          {lang === "ar"
            ? "المتابعة باستخدام Google"
            : (lang === "en" ? "Continue with Google" : (lang === "es" ? "Continuar con Google" : "Continuer avec Google"))}
        </span>
      </button>

      {/* Séparateur */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-3 bg-white text-slate-400 font-bold tracking-wider">
            {dict.proprietaire?.orContinue || "OU PAR IDENTIFIANT"}
          </span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {lang === "ar" ? "اسم المستخدم أو البرide الإلكتروني" : (lang === "en" ? "Username or Email" : (lang === "es" ? "Usuario o Email" : "Identifiant ou Email"))}
          </label>
          <input 
            type="text" 
            name="identifier"
            autoComplete="username"
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Aqotbi ou aqotbi.owner@babfez.ma" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {dict.proprietaire?.password || "Mot de passe"}
          </label>
          <input 
            type="password" 
            name="password"
            autoComplete="current-password"
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900" 
          />
        </div>
        
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            <label htmlFor="remember" className="text-sm font-medium text-slate-600">
              {dict.login?.remember || "Se souvenir de moi"}
            </label>
          </div>
          <a href="#" className="text-sm font-bold text-amber-600 hover:text-amber-700">
            {dict.login?.forgot || "Mot de passe oublié ?"}
          </a>
        </div>

        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#6F8E88] to-[#63968C] hover:shadow-lg hover:shadow-[#6F8E88]/25 transition-all disabled:opacity-70 shadow-md"
        >
          {isLoading ? (dict.proprietaire?.btnLoading || "Connexion...") : (dict.proprietaire?.btnLogin || "Se connecter")}
        </button>
      </form>

      <div className="mt-4 text-center text-xs font-bold text-slate-400">
        Accès Propriétaire : <span className="text-[#6F8E88]">Aqotbi</span> / <span className="text-slate-500">Moth326sine706.</span>
      </div>

      <div className="mt-8 bg-amber-50 p-4 rounded-xl border border-amber-100 text-center text-sm">
        <p className="text-amber-900 font-medium mb-2">
          {dict.login?.helpText || "Vous êtes propriétaire d'un bien à Fès et souhaitez nous confier sa gestion ?"}
        </p>
        <Link href={`/${lang}/#simulateur`} className="text-amber-700 font-extrabold hover:underline">
          {dict.login?.helpLink || "Demander une étude gratuite"}
        </Link>
      </div>
    </div>
  );
}

export default function ProprietaireLogin({ params }: { params: { lang: string } }) {
  const lang = (params.lang as keyof typeof dicts) || "fr";
  const baseDict = dicts[lang] || dicts.fr;
  const dict: any = {
    ...dicts.fr,
    ...baseDict,
    proprietaire: { ...(dicts.fr as any).proprietaire, ...(baseDict as any).proprietaire },
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#2D3748] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative pt-24 sm:pt-16">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Link 
          href={`/${lang}`} 
          onClick={() => {
            if (typeof window !== "undefined") sessionStorage.setItem("navigated_to_home", "true");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-200 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>{lang === "ar" ? "العودة للرئيسية" : "Revenir au site vitrine"}</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
        <LanguageSwitcher currentLang={lang} />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          href={`/${lang}`} 
          onClick={() => {
            if (typeof window !== "undefined") sessionStorage.setItem("navigated_to_home", "true");
          }}
          className="flex justify-center items-center gap-3 mb-6 group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0B2545] p-1.5 flex items-center justify-center border border-[#C59B27]/40 shadow-sm group-hover:scale-105 transition-transform">
            <img
              src="/icons/logo.svg"
              alt="Logo BABFEZ"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.src = "/icon-192.png"; }}
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0B2545]">BABFEZ</span>
        </Link>
        <h2 className={`text-center text-3xl font-black text-[#0B2545] ${lang === "ar" ? "" : "font-serif"}`}>
          {dict.proprietaire?.loginTitle || "Espace Propriétaire"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {dict.proprietaire?.loginSubtitle || "Suivez les performances de votre logement à Fès"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center text-slate-400 py-6">Chargement...</div>}>
          <ProprietaireLoginForm lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}
