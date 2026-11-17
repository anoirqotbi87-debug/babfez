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

// Mode Preview / Pré-lancement : Aucun bien fictif codé en dur.
// Les biens réels s'alimentent dynamiquement depuis la base de données Supabase.
export const PROPERTIES: Property[] = [];

export const MOCK_CATALOG: Property[] = PROPERTIES;

export const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";
