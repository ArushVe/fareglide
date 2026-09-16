export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
export type FareTripType = 'one_way' | 'round_trip';
export type MaximumStops = 0 | 1 | 2;
export type WatchStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'throttled'
  | 'booked_monitoring'
  | 'expired'
  | 'archived';

export type TravelWindow =
  | {
      mode: 'exact';
      departureDate: string;
      returnDate?: string;
    }
  | {
      mode: 'month';
      month: string;
    }
  | {
      mode: 'window';
      startDate: string;
      endDate: string;
    }
  | {
      mode: 'horizon';
      monthsAhead: 3 | 6 | 12;
      startsOn: string;
    };

export interface UserPreferences {
  homeAirportIata: string;
  nearbyAirportIata: string[];
  currency: string;
  timezone: string;
  defaultCabin: CabinClass;
  defaultPassengerCount: number;
  defaultMaximumStops: MaximumStops;
  defaultStayLengthNights: {
    minimum: number;
    maximum: number;
  };
  dailyReportTime: string;
}

export interface TripWatch {
  id: string;
  name: string;
  originAirports: string[];
  destinationAirports: string[];
  travelWindow: TravelWindow;
  tripTypes: FareTripType[];
  stayLengthNights: {
    minimum: number;
    maximum: number;
  };
  cabin: CabinClass;
  passengerCount: number;
  maximumStops: MaximumStops;
  currency: string;
  status: WatchStatus;
  createdAt: string;
  nextRefreshAt: string | null;
  bookedAt: string | null;
  paidAmount: number | null;
  postBookingEligible: boolean;
}

export interface FareSearchRequest {
  origin: string;
  destination: string;
  travelWindow: TravelWindow;
  tripType: FareTripType;
  stayLengthNights?: {
    minimum: number;
    maximum: number;
  };
  cabin: CabinClass;
  passengerCount: number;
  maximumStops: MaximumStops;
  currency: string;
  market: string;
}

export interface NormalizedSearchKey {
  hash: string;
  serialized: string;
  request: FareSearchRequest;
}
