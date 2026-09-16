import type {
  FareSearchRequest,
  NormalizedSearchKey,
  TravelWindow,
} from './types.ts';

function normalizeIata(value: string, field: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) {
    throw new Error(`${field} must be a three-letter IATA airport code.`);
  }
  return normalized;
}

function normalizeDate(value: string, field: string): string {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(`${value}T00:00:00Z`))
  ) {
    throw new Error(`${field} must use YYYY-MM-DD.`);
  }
  return value;
}

function normalizeWindow(window: TravelWindow): TravelWindow {
  switch (window.mode) {
    case 'exact':
      return {
        mode: 'exact',
        departureDate: normalizeDate(window.departureDate, 'departureDate'),
        ...(window.returnDate
          ? { returnDate: normalizeDate(window.returnDate, 'returnDate') }
          : {}),
      };
    case 'month':
      if (!/^\d{4}-\d{2}$/.test(window.month)) {
        throw new Error('month must use YYYY-MM.');
      }
      return { mode: 'month', month: window.month };
    case 'window': {
      const startDate = normalizeDate(window.startDate, 'startDate');
      const endDate = normalizeDate(window.endDate, 'endDate');
      if (endDate < startDate) {
        throw new Error('endDate cannot be before startDate.');
      }
      return { mode: 'window', startDate, endDate };
    }
    case 'horizon':
      return {
        mode: 'horizon',
        monthsAhead: window.monthsAhead,
        startsOn: normalizeDate(window.startsOn, 'startsOn'),
      };
  }
}

export function hashSearchKey(serialized: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function normalizeSearchRequest(
  input: FareSearchRequest,
): NormalizedSearchKey {
  if (input.passengerCount < 1 || !Number.isInteger(input.passengerCount)) {
    throw new Error('passengerCount must be a positive integer.');
  }

  const request: FareSearchRequest = {
    origin: normalizeIata(input.origin, 'origin'),
    destination: normalizeIata(input.destination, 'destination'),
    travelWindow: normalizeWindow(input.travelWindow),
    tripType: input.tripType,
    ...(input.tripType === 'round_trip' && input.stayLengthNights
      ? {
          stayLengthNights: {
            minimum: input.stayLengthNights.minimum,
            maximum: input.stayLengthNights.maximum,
          },
        }
      : {}),
    cabin: input.cabin,
    passengerCount: input.passengerCount,
    maximumStops: input.maximumStops,
    currency: input.currency.trim().toUpperCase(),
    market: input.market.trim().toUpperCase(),
  };

  if (
    request.stayLengthNights &&
    (request.stayLengthNights.minimum < 1 ||
      request.stayLengthNights.maximum < request.stayLengthNights.minimum)
  ) {
    throw new Error('stayLengthNights must be a valid positive range.');
  }

  const serialized = JSON.stringify(request);
  return {
    hash: hashSearchKey(serialized),
    serialized,
    request,
  };
}
