export interface Property {
  id: string;
  title: string;
  type: string;
  zone: string;
  guests: number;
  bedrooms: number;
  price: number;
  cleaningFee: number;
  rating: number;
  reviews: number;
  coords: [number, number];
  image: string;
  amenities: string[];
}

export const PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Riad Dar Ziryab",
    type: "Riad Entier",
    zone: "Médina",
    guests: 6,
    bedrooms: 3,
    price: 1200,
    cleaningFee: 250,
    rating: 4.98,
    reviews: 124,
    coords: [34.0592, -4.9815],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Wi-Fi Fibre", "Patio", "Climatisation", "Petit-déjeuner"]
  },
  {
    id: "p2",
    title: "Appartement Standing Atlas",
    type: "Appartement",
    zone: "Ville Nouvelle",
    guests: 4,
    bedrooms: 2,
    price: 650,
    cleaningFee: 150,
    rating: 4.92,
    reviews: 86,
    coords: [34.0335, -5.0005],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Wi-Fi Fibre", "Terrasse", "Climatisation", "Smart TV"]
  },
  {
    id: "p3",
    title: "Studio Moderne Palmier",
    type: "Studio",
    zone: "Route d'Immouzzer",
    guests: 2,
    bedrooms: 1,
    price: 450,
    cleaningFee: 100,
    rating: 4.88,
    reviews: 42,
    coords: [34.0150, -4.9850],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    amenities: ["Parking", "Cuisine", "Fiches Police", "Wi-Fi"]
  }
];

export const MOCK_CATALOG = PROPERTIES;

export const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";
