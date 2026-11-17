"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function GuideIndex({ params }: { params: { lang: string } }) {
  const lang = params.lang || "fr";
  const router = useRouter();

  useEffect(() => {
    const resolveGuide = async () => {
      try {
        const { data: props } = await supabase.from('properties').select('id').limit(1);
        if (props && props.length > 0) {
          router.replace(`/${lang}/guide/${props[0].id}`);
          return;
        }
      } catch {}
      router.replace(`/${lang}/guide/preview`);
    };
    resolveGuide();
  }, [lang, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-slate-900">
      <div className="w-16 h-16 border-4 border-[#C59B27] border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-xl font-bold font-serif text-[#0B2545]">Ouverture du Livret d'Accueil...</h1>
      <Link href={`/${lang}`} className="mt-8 text-stone-500 hover:text-stone-900 underline text-sm">
        Retourner à l'accueil
      </Link>
    </div>
  );
}
