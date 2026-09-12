export interface Vehicle {
  id: string;
  name: string;
  price: string;
  passengers: number | string;
  luggage: number;
  features: string[];
  image: string;
}