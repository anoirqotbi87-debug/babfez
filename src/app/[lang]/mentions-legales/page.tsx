"use client";

import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";
import ar from "@/dictionaries/ar.json";
import { CONTACT_INFO } from "@/config/site";

const dicts = { fr, en, es, ar };

export default function MentionsLegales({ params }: { params: { lang: string } }) {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-950 text-white py-6 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center relative">
          <Link href={`/${lang}`} className="absolute left-0 flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span className="hidden sm:inline">{dict.nav.backHome}</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold w-full text-center">Mentions Légales</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">1. Éditeur du site</h2>
              <p className="text-slate-600 leading-relaxed">
                Le présent site est édité par la société <strong>BABFEZ Conciergerie Privée</strong>, représentée légalement par <strong>M. Anoir Qotbi</strong>.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">2. Siège social & Exploitation</h2>
              <p className="text-slate-600 leading-relaxed">
                Le siège social et les activités d'exploitation sont situés à :<br/>
                <strong>Fès, Région Fès-Meknès, Royaume du Maroc.</strong>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">3. Contact</h2>
              <ul className="text-slate-600 leading-relaxed list-disc list-inside">
                <li><strong>Adresse e-mail :</strong> <a href="mailto:contact@babfez.ma" className="text-amber-600 hover:underline">contact@babfez.ma</a></li>
                <li><strong>Téléphone / WhatsApp :</strong> <a href={CONTACT_INFO.whatsappLink} className="text-amber-600 hover:underline">{CONTACT_INFO.phoneDisplay}</a></li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">4. Activité de l'entreprise</h2>
              <p className="text-slate-600 leading-relaxed">
                BABFEZ exerce une activité de <strong>conciergerie privée</strong>, d'intendance de résidences et de gestion locative saisonnière meublée (Courte durée, de type Airbnb/Booking.com).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">5. Hébergement web</h2>
              <p className="text-slate-600 leading-relaxed">
                L'infrastructure informatique et l'hébergement du site internet sont fournis par :<br/>
                <strong>Vercel Inc.</strong><br/>
                340 S Lemon Ave #1142, Walnut, CA 91789, États-Unis.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">6. Propriété intellectuelle</h2>
              <p className="text-slate-600 leading-relaxed">
                L'ensemble de ce site relève de la législation marocaine et internationale sur le droit d'auteur et la propriété intellectuelle. La protection des éléments de marque BABFEZ, du logo, de la charte graphique, ainsi que des textes et visuels est stricte. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
