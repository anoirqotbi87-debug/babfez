"use client";

import { useEffect, useState } from 'react';
import { Currency } from '@/config/currencies';

interface CurrencySwitcherProps {
  theme?: 'light' | 'dark';
}

export default function CurrencySwitcher({ theme = 'dark' }: CurrencySwitcherProps) {
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('babfez_currency') as Currency;
    if (saved && ['MAD', 'EUR', 'USD'].includes(saved)) {
      setCurrency(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as Currency;
    setCurrency(newCurrency);
    localStorage.setItem('babfez_currency', newCurrency);
    window.dispatchEvent(new Event('currencyChange'));
  };

  const isDark = theme === 'dark';

  if (!mounted) {
    return (
      <select disabled className={`text-xs sm:text-sm font-bold outline-none cursor-not-allowed bg-transparent ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        <option>MAD</option>
      </select>
    );
  }

  return (
    <select 
      value={currency} 
      onChange={handleChange}
      className={`text-xs sm:text-sm font-bold outline-none cursor-pointer transition-colors bg-transparent rounded-lg px-1.5 py-1 ${
        isDark
          ? "text-slate-200 hover:text-[#C59B27] border border-[#C59B27]/40 bg-[#0B2545]/60"
          : "text-slate-600 hover:text-amber-600 border border-slate-200"
      }`}
      aria-label="Changer de devise"
    >
      <option value="MAD" className="bg-[#0B2545] text-white">MAD (د.م.)</option>
      <option value="EUR" className="bg-[#0B2545] text-white">EUR (€)</option>
      <option value="USD" className="bg-[#0B2545] text-white">USD ($)</option>
    </select>
  );
}
