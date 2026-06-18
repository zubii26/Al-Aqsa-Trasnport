const fs = require('fs');

const makkahHotels = [
  'Swissotel Makkah', 'Fairmont Makkah Clock Royal Tower', 'Pullman ZamZam Makkah', 'Raffles Makkah Palace', 
  'Hilton Suites Makkah', 'Conrad Makkah', 'Makkah Clock Royal Tower', 'Hyatt Regency Makkah',
  'Jabal Omar Marriott Hotel Makkah', 'Movenpick Hotel Hajar Tower Makkah', 'Sheraton Makkah Jabal Omar',
  'InterContinental Dar Al Tawhid', 'Le Meridien Makkah', 'Makarem Ajyad Makkah', 'Shaza Makkah',
  'Al Safwah Royale Orchid', 'Elaf Kinda Hotel', 'Dar Al Eiman Royal', 'Al Marwa Rayhaan by Rotana',
  'Anjum Hotel Makkah', 'Novotel Makkah Thakher City', 'DoubleTree by Hilton Makkah Jabal Omar',
  'Retaj Al Rayyan Makkah', 'Infinity Hotel Makkah', 'Makkah Towers', 'Al Ghufran Safwah Hotel',
  'Emaar Grand Hotel', 'Millennium Makkah Al Naseem', 'Copthorne Makkah Al Naseem', 'Park Inn by Radisson Makkah',
  'Holiday Inn Makkah Al Aziziyah', 'Radisson Blu Hotel Makkah', 'Ibis Styles Makkah',
  'Al Kiswah Towers Hotel', 'Makkah Marriott Hotel', 'Olayan Plaza Hotel', 'Snood Al Aziziya Hotel',
  'Violet Hotel', 'Drnef Hotel Makkah', 'Mido Hotel', 'Makkah Hotel', 'Al Massa Hotel',
  'Nawazi Watheer Hotel', 'Nada Al Deafah Hotel', 'Hibatullah Hotel', 'Elaf Al Mashaer',
  'Al Reyadah Grand Hotel', 'Al Jaad Mahbas Hotel', 'Rawdat Al Bait Guest House', 'Mina Concorde Hotel'
];

const madinahHotels = [
  'The Oberoi Madinah', 'Anwar Al Madinah Movenpick', 'Madinah Hilton', 'Dar Al Taqwa Hotel',
  'Pullman Zamzam Madina', 'Shaza Al Madina', 'Crowne Plaza Madinah', 'InterContinental Dar Al Hijra',
  'Madinah Marriott Hotel', 'Shahd Al Madina', 'Dallah Taibah Hotel', 'Al Haram Hotel',
  'Rua Al Hijrah Hotel', 'Elaf Taiba Hotel', 'Frontel Al Harithia Hotel', 'Al Aqeeq Madinah Hotel',
  'Leader Al Muna Kareem', 'Ruve Al Madinah', 'Nozol Royal Inn', 'Odyssey Hotel Madinah',
  'Saja Al Madinah', 'Emaar Royal Hotel', 'Artal Taiba Hotel', 'Taiba Front Hotel', 'Nusk Al Madinah',
  'Zowar International Hotel', 'Golden Tulip Al Mektan', 'Al Eiman Royal Hotel', 'Al Mukhtara International',
  'Mysk Touch Al Balad', 'Sofitel Shahd Al Madinah', 'Mellennium Madinah Airport', 'Le Bosphorus Al Madinah',
  'New Madinah Hotel', 'Taiba Suites', 'Elaf Al Taqwa Hotel', 'Bosphorus Hotel', 'Durrat Al Eiman',
  'Al Eiman Taiba', 'Odst Al Madinah Hotel', 'Province Al Sham', 'Al Madinah Harmony',
  'Gloria Al Madinah', 'Hayah Plaza Hotel', 'Al Eiman Ohud', 'Diyar Al Salam Silver',
  'Al Khozama Hotel', 'Al Ansar Golden Tulip', 'Elaf Meshal Hotel', 'Al Eiman Al Qibla Hotel'
];

const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

const generateHotels = (list, city) => {
  return list.map((name, index) => {
    return {
      id: city.toLowerCase() + '-' + (index + 1),
      slug: slugify(name),
      name: name,
      city: city,
      starRating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      distanceFromHaram: Math.floor(Math.random() * 500) + 50 + 'm'
    };
  });
};

const allHotels = [...generateHotels(makkahHotels, 'Makkah'), ...generateHotels(madinahHotels, 'Madinah')];

const content = `export interface Hotel {
  id: string;
  slug: string;
  name: string;
  city: 'Makkah' | 'Madinah';
  starRating: number;
  distanceFromHaram: string;
}

export const topHotels: Hotel[] = ${JSON.stringify(allHotels, null, 2)};
`;

fs.writeFileSync('src/data/hotels.ts', content);
console.log('Created src/data/hotels.ts with ' + allHotels.length + ' hotels.');
