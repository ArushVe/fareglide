import { normalizeSearchRequest } from './normalization.ts';
import type { NormalizedSearchKey, TripWatch } from './types.ts';

export function planSearches(watch: TripWatch): NormalizedSearchKey[] {
  const searches: NormalizedSearchKey[] = [];

  for (const origin of watch.originAirports) {
    for (const destination of watch.destinationAirports) {
      for (const tripType of watch.tripTypes) {
        searches.push(
          normalizeSearchRequest({
            origin,
            destination,
            travelWindow: watch.travelWindow,
            tripType,
            ...(tripType === 'round_trip'
              ? { stayLengthNights: watch.stayLengthNights }
              : {}),
            cabin: watch.cabin,
            passengerCount: watch.passengerCount,
            maximumStops: watch.maximumStops,
            currency: watch.currency,
            market: 'US',
          }),
        );
      }
    }
  }

  return searches;
}
