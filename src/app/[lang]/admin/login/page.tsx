"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { signInWithGoogle, signInWithIdentifier } from "@/lib/authService";

const dicts = { fr, en, es, ar };

function AdminLoginForm({ lang }: { lang: keyof typeof dicts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const err = searchParams?.get("error");
    if (err === "oauth_failed") {
      setError("Échec de l'authentification Google. Veuillez réessayer ou utiliser votre mot de passe.");
    } else if (err === "unauthorized" || err === "unauthorized_admin") {
      setError("Accès refusé : Ce compte ne dispose pas des privilèges administrateur BABFEZ.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithIdentifier({
        identifier: email,
        password,
        context: "admin",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("babfez_admin_logged_in", "true");
        localStorage.setItem(
          "babfez_user",
          JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            username: (result.user as any).user_metadata?.username || "Aqotbi",
            fullName: (result.user as any).user_metadata?.fullName || "Anoir Qotbi",
            role: "admin",
          })
        );
      }

      router.push(`/${lang}/admin/dashboard`);
    } catch (err: any) {
      setError(err.message || "Identifiants administrateur incorrects.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle("admin", lang);
    } catch (err: any) {
      setError(err.message || "Impossible d'initialiser la connexion avec Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-warm border border-[#D8E8E6]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#6F8E88] to-[#63968C] rounded-2xl mx-auto flex items-center justify-center text-[#A1C0BA] mb-4 shadow-lg shadow-[#6F8E88]/20 border border-[#A1C0BA]/40">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 className={`text-2xl font-black text-[#6F8E88] ${lang === "ar" ? "" : "font-serif"}`}>
          {lang === "ar" ? "لوحة الإدارة العامة" : "Espace Administrateur"}
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          {lang === "ar" ? "الإشراف والتحكم الكامل في منصة BABFEZ" : "Gestion globale et sécurisée de la plateforme BABFEZ"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 text-center leading-relaxed">
          {error}
        </div>
      )}

      {/* Bouton Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl bg-white font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-60"
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
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-3 bg-white text-slate-400 font-bold tracking-wider">
            {lang === "ar" ? "أو بواسطة الحساب" : "OU PAR IDENTIFIANT"}
          </span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {lang === "ar" ? "اسم المستخدم أو البريد الإلكتروني" : (lang === "en" ? "Username or Email" : (lang === "es" ? "Usuario o Email" : "Identifiant ou Email"))}
          </label>
          <input 
            type="text" 
            name="identifier"
            autoComplete="username"
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Aqotbi ou aqotbi@babfez.ma" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {lang === "ar" ? "كلمة المرور" : (lang === "en" ? "Password" : (lang === "es" ? "Contraseña" : "Mot de passe"))}
          </label>
          <input 
            type="password" 
            name="password"
            autoComplete="current-password"
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-amber-500 transition-colors font-medium text-slate-900" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#6F8E88] to-[#63968C] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#6F8E88]/25 transition-all shadow-md mt-4 disabled:opacity-60"
        >
          {isLoading ? (lang === "ar" ? "جارِ التحقق..." : "Connexion...") : (lang === "ar" ? "دخول الإدارة" : "Connexion Admin")}
        </button>
      </form>

      <div className="mt-6 text-center text-xs font-bold text-slate-400">
        Accès Super-Admin : <span className="text-[#6F8E88]">Aqotbi</span> / <span className="text-slate-500">Moth326sine706.</span>
      </div>
    </div>
  );
}

export default function AdminLogin({ params }: { params: { lang: string } }) {
  const lang = (params.lang as keyof typeof dicts) || "fr";

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#2D3748] flex flex-col justify-center items-center p-4 font-sans">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Link 
          href={`/${lang}`} 
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <span>{lang === "ar" ? "→" : "←"}</span>
          <span>{lang === "ar" ? "العودة للرئيسية" : (lang === "en" ? "Back to Home" : (lang === "es" ? "Volver al inicio" : "Retour à l'accueil"))}</span>
        </Link>
      </div>

      <Suspense fallback={<div className="text-slate-400 font-medium">Chargement...</div>}>
        <AdminLoginForm lang={lang} />
      </Suspense>
    </div>
  );
}
