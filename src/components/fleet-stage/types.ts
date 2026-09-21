export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceFrom: number | null; // null => "Contact for pricing"
  currency: 'SAR';
  passengers: number;
  bags: number;
  amenities: string[];
  imageSrc: string;
  imageAlt: string;
  relativeScale: number; // 1 = baseline (sedan-sized), up to ~1.6 for the coach
}
