"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' }
];

interface LanguageSwitcherProps {
  currentLang: string;
  theme?: 'light' | 'dark';
}

export default function LanguageSwitcher({ currentLang, theme = 'dark' }: LanguageSwitcherProps) {
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

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center">
      <select 
        value={currentLang}
        onChange={handleLanguageChange}
        className={`font-bold text-xs sm:text-sm cursor-pointer outline-none rounded-lg px-2 py-1 transition-colors ${
          isDark
            ? "bg-[#0B2545]/60 text-white border border-[#C59B27]/40 hover:border-[#C59B27]"
            : "bg-transparent text-slate-700 border border-slate-200 hover:border-amber-500"
        }`}
        aria-label="Changer de langue"
      >
        {languages.map((lang) => (
          <option 
            key={lang.code} 
            value={lang.code}
            className="bg-[#0B2545] text-white"
            style={lang.code === 'ar' ? { fontFamily: "var(--font-cairo), 'Segoe UI', Tahoma, Arial, sans-serif" } : undefined}
          >
            {lang.label} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}
