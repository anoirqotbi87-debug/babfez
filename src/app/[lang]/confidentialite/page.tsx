"use client";

import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";

const dicts = { fr, en, es };

export default function PolitiqueConfidentialite({ params }: { params: { lang: string } }) {
  const lang = params.lang as keyof typeof dicts;
  const dict = dicts[lang] || dicts.fr;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-950 text-white py-6 px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center relative">
          <Link href={`/${lang}`} className="absolute left-0 flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold w-full text-center">Politique de Confidentialité</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <p className="text-slate-500 font-medium mb-8">
            Conforme à la loi marocaine n° 09-08 (CNDP) relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et aux standards internationaux (RGPD).
          </p>
          
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">1. Données collectées</h2>
              <p className="text-slate-600 leading-relaxed mb-2">
                Dans le cadre de l'utilisation de nos services, nous pouvons être amenés à collecter les données suivantes :
              </p>
              <ul className="text-slate-600 leading-relaxed list-disc list-inside">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone et/ou WhatsApp</li>
                <li>Données relatives aux réservations (dates de séjour, logement choisi)</li>
                <li><strong>Pièces d'identité (Passeport / CNI) :</strong> Exclusivement destinées à l'établissement des fiches individuelles de police, obligatoires selon la législation du Royaume du Maroc.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">2. Finalité du traitement</h2>
              <p className="text-slate-600 leading-relaxed">
                Les informations recueillies sont nécessaires pour :
              </p>
              <ul className="text-slate-600 leading-relaxed list-disc list-inside mt-2">
                <li>Le traitement des demandes d'estimation de revenus locatifs.</li>
                <li>La gestion administrative, logistique et de facturation de vos réservations.</li>
                <li>La communication directe avec nos clients avant, pendant et après leur séjour.</li>
                <li>La stricte conformité à la réglementation locale marocaine (déclaration aux autorités).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">3. Sécurité & Conservation</h2>
              <p className="text-slate-600 leading-relaxed">
                BABFEZ s'engage fermement à <strong>ne procéder à aucune revente ni monétisation</strong> de vos données personnelles à des tiers. Les informations sont stockées sur des serveurs sécurisés et conservées uniquement pendant la durée légale nécessaire à l'exécution des finalités décrites ci-dessus.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-950 mb-2">4. Vos droits (Accès, Rectification, Suppression)</h2>
              <p className="text-slate-600 leading-relaxed">
                Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression des données vous concernant. 
                <br/><br/>
                Pour exercer ce droit, veuillez nous adresser votre demande par e-mail à : <strong><a href="mailto:contact@babfez.ma" className="text-amber-600 hover:underline">contact@babfez.ma</a></strong>. Nous traiterons votre demande dans les plus brefs délais.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
