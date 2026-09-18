"use client";

import { useEffect, useState } from 'react';
import { Currency } from '@/config/currencies';

export default function CurrencySwitcher() {
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
    // Dispatch custom event to let other components know the currency changed
    window.dispatchEvent(new Event('currencyChange'));
  };

  if (!mounted) {
    return (
      <select disabled className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-not-allowed">
        <option>MAD</option>
      </select>
    );
  }

  return (
    <select 
      value={currency} 
      onChange={handleChange}
      className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer hover:text-amber-600 transition-colors"
    >
      <option value="MAD">MAD (د.م.)</option>
      <option value="EUR">EUR (€)</option>
      <option value="USD">USD ($)</option>
    </select>
  );
}
