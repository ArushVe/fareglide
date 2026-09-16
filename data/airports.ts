export type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
};

// A small local catalog keeps autocomplete instant and avoids spending a
// flight-search request before a watch is created.
export const POPULAR_AIRPORTS: readonly Airport[] = [
  {
    iata: 'SEA',
    name: 'Seattle-Tacoma International',
    city: 'Seattle',
    country: 'United States',
  },
  {
    iata: 'HKG',
    name: 'Hong Kong International',
    city: 'Hong Kong',
    country: 'Hong Kong',
  },
  {
    iata: 'SFO',
    name: 'San Francisco International',
    city: 'San Francisco',
    country: 'United States',
  },
  {
    iata: 'LAX',
    name: 'Los Angeles International',
    city: 'Los Angeles',
    country: 'United States',
  },
  {
    iata: 'JFK',
    name: 'John F. Kennedy International',
    city: 'New York',
    country: 'United States',
  },
  {
    iata: 'EWR',
    name: 'Newark Liberty International',
    city: 'New York',
    country: 'United States',
  },
  {
    iata: 'ORD',
    name: "O'Hare International",
    city: 'Chicago',
    country: 'United States',
  },
  {
    iata: 'ATL',
    name: 'Hartsfield-Jackson Atlanta International',
    city: 'Atlanta',
    country: 'United States',
  },
  {
    iata: 'DFW',
    name: 'Dallas Fort Worth International',
    city: 'Dallas',
    country: 'United States',
  },
  {
    iata: 'DEN',
    name: 'Denver International',
    city: 'Denver',
    country: 'United States',
  },
  {
    iata: 'MIA',
    name: 'Miami International',
    city: 'Miami',
    country: 'United States',
  },
  {
    iata: 'BOS',
    name: 'Logan International',
    city: 'Boston',
    country: 'United States',
  },
  {
    iata: 'YVR',
    name: 'Vancouver International',
    city: 'Vancouver',
    country: 'Canada',
  },
  {
    iata: 'YYZ',
    name: 'Toronto Pearson International',
    city: 'Toronto',
    country: 'Canada',
  },
  {
    iata: 'MEX',
    name: 'Mexico City International',
    city: 'Mexico City',
    country: 'Mexico',
  },
  { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'United Kingdom' },
  { iata: 'LGW', name: 'Gatwick', city: 'London', country: 'United Kingdom' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  {
    iata: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
  },
  {
    iata: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
  },
  {
    iata: 'MAD',
    name: 'Adolfo Suárez Madrid-Barajas',
    city: 'Madrid',
    country: 'Spain',
  },
  {
    iata: 'FCO',
    name: 'Leonardo da Vinci-Fiumicino',
    city: 'Rome',
    country: 'Italy',
  },
  {
    iata: 'IST',
    name: 'Istanbul Airport',
    city: 'Istanbul',
    country: 'Türkiye',
  },
  {
    iata: 'DXB',
    name: 'Dubai International',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  {
    iata: 'DEL',
    name: 'Indira Gandhi International',
    city: 'Delhi',
    country: 'India',
  },
  {
    iata: 'SIN',
    name: 'Singapore Changi',
    city: 'Singapore',
    country: 'Singapore',
  },
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand' },
  {
    iata: 'NRT',
    name: 'Narita International',
    city: 'Tokyo',
    country: 'Japan',
  },
  { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  {
    iata: 'ICN',
    name: 'Incheon International',
    city: 'Seoul',
    country: 'South Korea',
  },
  {
    iata: 'TPE',
    name: 'Taiwan Taoyuan International',
    city: 'Taipei',
    country: 'Taiwan',
  },
  {
    iata: 'SYD',
    name: 'Sydney Kingsford Smith',
    city: 'Sydney',
    country: 'Australia',
  },
  {
    iata: 'MEL',
    name: 'Melbourne Airport',
    city: 'Melbourne',
    country: 'Australia',
  },
] as const;

export function airportLabel(airport: Airport): string {
  return `${airport.city} (${airport.iata})`;
}

export function airportMatches(airport: Airport, query: string): boolean {
  const search = query.trim().toLocaleLowerCase();

  if (!search) return true;

  return [airport.iata, airport.city, airport.name, airport.country].some(
    (field) => field.toLocaleLowerCase().includes(search),
  );
}

export function findAirport(iata: string): Airport | undefined {
  return POPULAR_AIRPORTS.find((airport) => airport.iata === iata);
}
