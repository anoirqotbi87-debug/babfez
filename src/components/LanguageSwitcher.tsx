"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' }
];

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    if (!pathname) return;
    
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
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            style={lang.code === 'ar' ? { fontFamily: "var(--font-cairo), 'Segoe UI', Tahoma, Arial, sans-serif" } : undefined}
          >
            {lang.label} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}
