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
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-bold">Ouverture du Livret d'Accueil...</h1>
      <Link href={`/${lang}`} className="mt-8 text-slate-500 hover:text-slate-900 underline">Retourner à l'accueil</Link>
    </div>
  );
}
