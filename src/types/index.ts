export interface UserProfile {
  uid: string;
  email: string;
  role: 'owner' | 'admin';
  fullName: string;
  phone: string;
  propertyIds: string[];
}

export interface Property {
  id: string;
  title: string;
  zone: 'medina' | 'ville_nouvelle' | 'immouzzer';
  address: string;
  bedrooms: number;
  maxGuests: number;
  pricePerNight: number; // en MAD
  cleaningFee: number;   // en MAD
  rating: number;
  reviewsCount: number;
  images: string[];
  amenities: string[];
  ownerId: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  nights: number;
  guestName: string;
  guestPhone: string;
  source: 'airbnb' | 'booking' | 'direct' | 'owner';
  grossAmount: number;
  commissionRate: number; // ex: 0.20
  commissionAmount: number;
  cleaningFee: number;
  netOwnerAmount: number;
  status: 'confirmed' | 'owner_stay' | 'pending';
}
