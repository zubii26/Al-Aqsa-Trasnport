// src/config/pricingRanges.ts
// Single source of truth for the DISPLAY price ranges shown on marketing pages.
// IMPORTANT: These are for display/marketing only. The booking page calculates real-time
// exact fares using src/data/pricing.json based on specific dates and live rules.

export const PRICING_CATEGORIES = [
  {
    id: 'economy-sedan',
    label: 'Economy Sedan',
    capacityLabel: '4 Passengers',
    bagsLabel: '2-3 Bags',
    priceRangeSAR: [200, 450], // [CONFIRM] - Estimated from generic sedan rates
    examples: 'Toyota Camry, Kia K5',
    image: '/images/fleet/camry.webp',
    link: '/fleet/business-sedan',
    isPopular: false,
  },
  {
    id: 'standard-family-van',
    label: 'Standard Family Van',
    capacityLabel: '7 Passengers',
    bagsLabel: '5 Bags',
    priceRangeSAR: [300, 450], // [CONFIRM] - Estimated from Staria/Xpander rates
    examples: 'Hyundai Staria, Mitsubishi Xpander',
    image: '/images/fleet/staria.webp',
    link: '/fleet/hyundai-staria',
    isPopular: false,
  },
  {
    id: 'premium-suv',
    label: 'Premium SUV/MPV',
    capacityLabel: '7 Passengers',
    bagsLabel: '5 Bags',
    priceRangeSAR: [500, 900], // [CONFIRM] - Estimated from GMC rates
    examples: 'GMC Yukon AT4',
    image: '/images/fleet/gmc.webp',
    link: '/fleet/gmc-yukon-at4',
    isPopular: true,
  },
  {
    id: 'group-van',
    label: 'Group Van',
    capacityLabel: '12 Passengers',
    bagsLabel: '10 Bags',
    priceRangeSAR: [350, 550], // [CONFIRM] - Estimated from Hiace rates
    examples: 'Toyota Hiace',
    image: '/images/fleet/hiace.webp', // Assuming this exists or falls back safely
    link: '/fleet/toyota-hiace',
    isPopular: false,
  },
  {
    id: 'group-coaster',
    label: 'Group Coaster',
    capacityLabel: '20 Passengers',
    bagsLabel: '15 Bags',
    priceRangeSAR: [550, 900], // [CONFIRM] - Estimated from Coaster rates
    examples: 'Toyota Coaster',
    image: '/images/fleet/coaster.webp', // Assuming this exists
    link: '/fleet/toyota-coaster',
    isPopular: false,
  }
];

export const ROUTE_PRICING = [
  {
    routeId: 'jeddah-makkah',
    routeLabel: 'Jeddah Airport to Makkah',
    distanceOrDuration: '1.5 hrs',
    pricesByCategory: {
      'economy-sedan': [200, 250], // [CONFIRM] Exact ranges per route
      'standard-family-van': [280, 350],
      'premium-suv': [500, 600],
      'group-van': [350, 450],
      'group-coaster': [550, 650]
    }
  },
  {
    routeId: 'makkah-madinah',
    routeLabel: 'Makkah to Madinah',
    distanceOrDuration: '4.5 hrs',
    pricesByCategory: {
      'economy-sedan': [450, 500], // [CONFIRM] Exact ranges per route
      'standard-family-van': [450, 500],
      'premium-suv': [900, 1000],
      'group-van': [550, 650],
      'group-coaster': [900, 1100]
    }
  },
  {
    routeId: 'jeddah-madinah',
    routeLabel: 'Jeddah Airport to Madinah',
    distanceOrDuration: '4.5 hrs',
    pricesByCategory: {
      'economy-sedan': [450, 550], // [CONFIRM] Exact ranges per route
      'standard-family-van': [450, 550],
      'premium-suv': [900, 1100],
      'group-van': [550, 700],
      'group-coaster': [900, 1200]
    }
  },
  {
    routeId: 'ziyarat-makkah',
    routeLabel: 'Makkah Ziyarat Tour',
    distanceOrDuration: '3-4 hrs',
    pricesByCategory: {
      'economy-sedan': [250, 300], // [CONFIRM] Exact ranges per route
      'standard-family-van': [300, 350],
      'premium-suv': [400, 500],
      'group-van': [350, 450],
      'group-coaster': [500, 600]
    }
  }
];

export const PRICING_MULTIPLIERS = {
  ramadan: 1.5, // [CONFIRM] real multiplier for Ramadan
  hajj: 2.0,    // [CONFIRM] real multiplier for Hajj
  peak: 1.2     // [CONFIRM] standard peak season multiplier
};
