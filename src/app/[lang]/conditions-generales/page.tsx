"use client";

import Link from "next/link";
import fr from "@/dictionaries/fr.json";
import en from "@/dictionaries/en.json";
import es from "@/dictionaries/es.json";

const dicts = { fr, en, es };

export default function ConditionsGenerales({ params }: { params: { lang: string } }) {
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
          <h1 className="text-xl md:text-2xl font-extrabold w-full text-center">Conditions Générales</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h2 className="text-xl font-extrabold text-slate-950 mb-8 border-b pb-4">Conditions Générales d'Utilisation & de Séjour</h2>
          
          <section className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm">1</span>
                Réservations directes
              </h3>
              <p className="text-slate-600 leading-relaxed ml-10">
                Les réservations effectuées en direct via notre plateforme sont soumises à une confirmation finale de nos équipes via WhatsApp ou E-mail. Un acompte peut être exigé selon la durée du séjour et la politique tarifaire de la saison. La réservation n'est considérée comme définitive qu'après réception de la confirmation écrite par BABFEZ.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm">2</span>
                Arrivée & Départ (Check-in / Check-out)
              </h3>
              <ul className="text-slate-600 leading-relaxed list-disc list-inside ml-10 space-y-1">
                <li><strong>Check-in :</strong> À partir de <strong>15h00</strong>. L'accueil s'effectue soit physiquement par l'un de nos concierges, soit via une boîte à clés sécurisée (self check-in).</li>
                <li><strong>Check-out :</strong> Au plus tard à <strong>11h00</strong>. Un supplément peut s'appliquer en cas de départ tardif non autorisé afin de ne pas pénaliser l'équipe de ménage.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm">3</span>
                Formalité Obligatoire (Loi Marocaine)
              </h3>
              <p className="text-slate-600 leading-relaxed ml-10">
                Afin de nous conformer aux lois en vigueur, <strong>la présentation d'une pièce d'identité en cours de validité</strong> (Passeport international ou Carte Nationale d'Identité pour les résidents) est strictement exigée pour chaque adulte séjournant dans le bien, dès l'arrivée, afin de remplir la fiche de police. Sans ce document, l'accès au logement pourra être refusé sans remboursement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm">4</span>
                Règles de maison
              </h3>
              <ul className="text-slate-600 leading-relaxed list-disc list-inside ml-10 space-y-1">
                <li>Les logements sont <strong>strictement non-fumeurs</strong> à l'intérieur.</li>
                <li>Le respect du voisinage est primordial. L'organisation de fêtes, soirées bruyantes ou toutes nuisances nocturnes après <strong>22h00</strong> est formellement interdite.</li>
                <li>Les animaux de compagnie ne sont pas admis sauf accord exceptionnel écrit.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm">5</span>
                Annulation & Cautions
              </h3>
              <p className="text-slate-600 leading-relaxed ml-10">
                Les conditions d'annulation varient selon le délai de prévenance avant l'arrivée (voir les détails lors du devis WhatsApp). Une caution ou dépôt de garantie peut être bloqué par empreinte bancaire ou espèce. En cas de dégradations constatées au départ (mobilier, linge taché irrémédiablement, odeur de tabac), le montant des réparations ou du nettoyage exceptionnel sera déduit de la caution ou facturé au voyageur.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
