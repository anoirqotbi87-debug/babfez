export interface MarketRate {
  adr: number;           // Prix moyen nuitée courte durée (Airbnb / Booking)
  longTermRent: number;  // Loyer mensuel moyen classique (Avito / Mubawab)
}

export const FES_MARKET_DATA: Record<string, Record<string, Record<string, MarketRate>>> = {
  // 1. Médina / Riad
  medina: {
    riad: {
      studio: { adr: 550, longTermRent: 3000 },
      '1': { adr: 750, longTermRent: 4000 },
      '2': { adr: 1100, longTermRent: 5500 },
      '3': { adr: 1600, longTermRent: 7500 },
      '4': { adr: 2100, longTermRent: 9500 },
      '5': { adr: 2600, longTermRent: 12000 },
      '6+': { adr: 3400, longTermRent: 16000 },
    },
    appartement: {
      studio: { adr: 450, longTermRent: 2800 },
      '1': { adr: 600, longTermRent: 3500 },
      '2': { adr: 850, longTermRent: 4500 },
      '3': { adr: 1200, longTermRent: 6000 },
      '4': { adr: 1600, longTermRent: 7500 },
      '5': { adr: 2000, longTermRent: 9000 },
      '6+': { adr: 2500, longTermRent: 11000 },
    },
    villa: {
      studio: { adr: 600, longTermRent: 3500 },
      '1': { adr: 900, longTermRent: 5000 },
      '2': { adr: 1400, longTermRent: 7000 },
      '3': { adr: 1900, longTermRent: 9000 },
      '4': { adr: 2500, longTermRent: 12000 },
      '5': { adr: 3200, longTermRent: 15000 },
      '6+': { adr: 4200, longTermRent: 20000 },
    }
  },
  // 2. Ville Nouvelle / Atlas / Champs de Course
  ville_nouvelle: {
    appartement: {
      studio: { adr: 400, longTermRent: 3000 },
      '1': { adr: 550, longTermRent: 3800 },
      '2': { adr: 800, longTermRent: 4800 },
      '3': { adr: 1100, longTermRent: 6500 },
      '4': { adr: 1500, longTermRent: 8500 },
      '5': { adr: 1900, longTermRent: 10500 },
      '6+': { adr: 2400, longTermRent: 13000 },
    },
    riad: {
      studio: { adr: 450, longTermRent: 3200 },
      '1': { adr: 650, longTermRent: 4200 },
      '2': { adr: 950, longTermRent: 5500 },
      '3': { adr: 1300, longTermRent: 7500 },
      '4': { adr: 1800, longTermRent: 10000 },
      '5': { adr: 2300, longTermRent: 12500 },
      '6+': { adr: 2900, longTermRent: 15000 },
    },
    villa: {
      studio: { adr: 600, longTermRent: 4000 },
      '1': { adr: 900, longTermRent: 5500 },
      '2': { adr: 1350, longTermRent: 7500 },
      '3': { adr: 1800, longTermRent: 10000 },
      '4': { adr: 2400, longTermRent: 13000 },
      '5': { adr: 3000, longTermRent: 16000 },
      '6+': { adr: 3800, longTermRent: 21000 },
    }
  },
  // 3. Route d'Immouzzer
  immouzzer: {
    appartement: {
      studio: { adr: 350, longTermRent: 2800 },
      '1': { adr: 480, longTermRent: 3500 },
      '2': { adr: 700, longTermRent: 4500 },
      '3': { adr: 950, longTermRent: 5800 },
      '4': { adr: 1300, longTermRent: 7500 },
      '5': { adr: 1700, longTermRent: 9500 },
      '6+': { adr: 2200, longTermRent: 12000 },
    },
    riad: {
      studio: { adr: 400, longTermRent: 3000 },
      '1': { adr: 600, longTermRent: 4000 },
      '2': { adr: 850, longTermRent: 5000 },
      '3': { adr: 1200, longTermRent: 6800 },
      '4': { adr: 1600, longTermRent: 8800 },
      '5': { adr: 2000, longTermRent: 11000 },
      '6+': { adr: 2600, longTermRent: 14000 },
    },
    villa: {
      studio: { adr: 550, longTermRent: 3800 },
      '1': { adr: 850, longTermRent: 5200 },
      '2': { adr: 1250, longTermRent: 7200 },
      '3': { adr: 1700, longTermRent: 9500 },
      '4': { adr: 2200, longTermRent: 12500 },
      '5': { adr: 2800, longTermRent: 15500 },
      '6+': { adr: 3600, longTermRent: 20000 },
    }
  }
};
