"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    if (!pathname) return;
    
    // Replace the current language in the path with the new one
    // pathname is like /fr/reserver or /en/reserver
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={currentLang}
        onChange={handleLanguageChange}
        className="bg-transparent text-slate-700 font-bold text-sm cursor-pointer outline-none border border-slate-200 rounded-lg px-2 py-1 hover:border-amber-500 transition-colors"
      >
        <option value="fr">🇲🇦/🇫🇷 Français</option>
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>
  );
}
