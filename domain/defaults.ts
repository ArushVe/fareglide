import type { TripWatch, UserPreferences } from './types.ts';

export const DEFAULT_USER_PREFERENCES: Readonly<UserPreferences> = {
  homeAirportIata: 'SEA',
  nearbyAirportIata: [],
  currency: 'USD',
  timezone: 'America/Los_Angeles',
  defaultCabin: 'economy',
  defaultPassengerCount: 1,
  defaultMaximumStops: 1,
  defaultStayLengthNights: {
    minimum: 7,
    maximum: 14,
  },
  dailyReportTime: '08:00',
};

export function createFlexibleTripWatch(
  destinationIata: string,
  preferences: UserPreferences = DEFAULT_USER_PREFERENCES,
  now = new Date(),
): TripWatch {
  const destination = destinationIata.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(destination)) {
    throw new Error('Destination must be a three-letter IATA airport code.');
  }

  return {
    id: `watch_${now.getTime()}`,
    name: `${preferences.homeAirportIata} to ${destination}`,
    originAirports: [preferences.homeAirportIata],
    destinationAirports: [destination],
    travelWindow: {
      mode: 'horizon',
      monthsAhead: 6,
      startsOn: now.toISOString().slice(0, 10),
    },
    tripTypes: ['round_trip', 'one_way'],
    stayLengthNights: { ...preferences.defaultStayLengthNights },
    cabin: preferences.defaultCabin,
    passengerCount: preferences.defaultPassengerCount,
    maximumStops: preferences.defaultMaximumStops,
    currency: preferences.currency,
    status: 'draft',
    createdAt: now.toISOString(),
    nextRefreshAt: null,
    bookedAt: null,
    paidAmount: null,
    postBookingEligible: false,
  };
}
