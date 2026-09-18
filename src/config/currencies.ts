export const EXCHANGE_RATES = {
  MAD: 1.00,
  EUR: 10.80, // 1 EUR = 10.80 MAD
  USD: 9.90,  // 1 USD = 9.90 MAD
};

export type Currency = keyof typeof EXCHANGE_RATES;

export const convertFromMAD = (amountInMAD: number, targetCurrency: Currency): number => {
  return amountInMAD / EXCHANGE_RATES[targetCurrency];
};

export const formatPrice = (amount: number, currency: Currency): string => {
  if (currency === 'MAD') {
    return `${Math.round(amount).toLocaleString('fr-FR')} MAD`;
  }
  if (currency === 'EUR') {
    return `${Math.round(amount).toLocaleString('fr-FR')} €`;
  }
  if (currency === 'USD') {
    return `$${Math.round(amount).toLocaleString('en-US')}`;
  }
  return `${amount} ${currency}`;
};
