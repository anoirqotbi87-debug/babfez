"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";

const dicts = { fr, en, es, ar };

export default function GuideIndex({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers p1 par défaut si aucun ID n'est fourni
    router.replace(`/${lang}/guide/p1`);
  }, [lang, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-slate-900">
      <div className="w-16 h-16 rounded-2xl bg-[#0B2545] p-2 flex items-center justify-center border border-[#C59B27]/40 shadow-md mb-6">
        <img
          src="/icons/logo.svg"
          alt="Logo BABFEZ"
          width={48}
          height={48}
          className="w-full h-full object-contain"
          onError={(e) => { e.currentTarget.src = "/icon-192.png"; }}
        />
      </div>
      <div className="w-10 h-10 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-bold text-[#0B2545]">Ouverture du Livret d'Accueil...</h1>
      <Link href={`/${lang}`} className="mt-8 text-slate-500 hover:text-slate-900 underline text-sm">Retourner à l'accueil</Link>
    </div>
  );
}
