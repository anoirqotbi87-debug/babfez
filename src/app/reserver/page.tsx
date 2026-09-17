"use client";

import { useState } from "react";
import Link from "next/link";

export default function Reserver() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for properties
  const properties = [
    {
      id: 1,
      title: "Riad Authentique Médina",
      type: "Riad Entier",
      guests: 6,
      bedrooms: 3,
      price: "1 200",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop",
      rating: 4.9,
    },
    {
      id: 2,
      title: "Appartement Moderne Ville Nouvelle",
      type: "Appartement",
      guests: 4,
      bedrooms: 2,
      price: "650",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
      rating: 4.8,
    },
    {
      id: 3,
      title: "Studio Chic & Cosy",
      type: "Studio",
      guests: 2,
      bedrooms: 1,
      price: "450",
      image: "https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=1000&auto=format&fit=crop",
      rating: 4.95,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V10a8 8 0 0 1 16 0v11"/>
                <path d="M9 21v-7a3 3 0 0 1 6 0v7"/>
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">Séjours & Expériences</span>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/reserver" className="text-sm font-extrabold text-amber-600 border-b-2 border-amber-600 pb-1">Nos Logements</Link>
            <a href="#experiences" className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors">Expériences locales</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Espace Propriétaire
            </Link>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <Link href="/reserver" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-amber-600">Nos Logements</Link>
            <a href="#experiences" onClick={() => setIsMobileMenuOpen(false)} className="block font-semibold text-slate-600">Expériences locales</a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/" className="text-center bg-slate-100 text-slate-900 px-4 py-2.5 rounded-lg font-semibold">Espace Propriétaire</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Search */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1548041926-e10f4dc79496?q=80&w=2000&auto=format&fit=crop" alt="Fès Medina" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Vivez l'expérience Fès <span className="text-amber-500">comme un local.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Séjournez dans nos Riads et appartements d'exception. En réservant en direct, vous bénéficiez du meilleur tarif garanti et d'un accueil premium.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
            <div className="flex-1 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Arrivée - Départ</label>
              <input type="text" placeholder="Ajouter des dates" className="w-full bg-transparent text-slate-950 font-semibold focus:outline-none placeholder-slate-300" />
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Voyageurs</label>
              <select className="w-full bg-transparent text-slate-950 font-semibold focus:outline-none appearance-none cursor-pointer">
                <option>2 Voyageurs</option>
                <option>3 Voyageurs</option>
                <option>4+ Voyageurs</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-amber-600 text-white px-8 py-4 rounded-xl md:rounded-full font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-slate-950 mb-10">Nos logements à la une</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(prop => (
            <div key={prop.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="relative h-64 overflow-hidden">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                  {prop.type}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {prop.rating}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-950 leading-tight">{prop.title}</h3>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                  Jusqu'à {prop.guests} voyageurs • {prop.bedrooms} chambre{prop.bedrooms > 1 ? 's' : ''}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-950">{prop.price}</span>
                    <span className="text-slate-500 text-sm font-medium"> MAD / nuit</span>
                  </div>
                  <button className="bg-slate-950 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-amber-600 transition-colors">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Elements */}
      <section className="bg-amber-50 py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h4 className="font-bold text-slate-950 mb-2">Meilleur Prix Garanti</h4>
            <p className="text-sm text-slate-600">Économisez jusqu'à 15% de frais de plateforme en réservant en direct avec nous.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514M11 4v.01M12 4v.01"/></svg>
            </div>
            <h4 className="font-bold text-slate-950 mb-2">Accueil Premium</h4>
            <p className="text-sm text-slate-600">Notre équipe locale vous accueille physiquement et reste disponible 24/7.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h4 className="font-bold text-slate-950 mb-2">Paiement Sécurisé</h4>
            <p className="text-sm text-slate-600">Réservez en toute confiance avec notre système de paiement crypté.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V10a8 8 0 0 1 16 0v11"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">BAB<span className="text-amber-600">FEZ</span></span>
              </div>
            </div>
            <div className="flex gap-6 text-slate-400 font-semibold text-sm">
              <Link href="/reserver" className="hover:text-amber-500 transition-colors">Nos Logements</Link>
              <Link href="/" className="hover:text-amber-500 transition-colors">Devenir Hôte</Link>
              <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">
            &copy; 2026 BABFEZ Séjours. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
