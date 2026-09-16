import type { FareSearchRequest } from '../domain/types.ts';

export type ProviderHealthStatus = 'available' | 'degraded' | 'disabled';

export interface ProviderHealth {
  status: ProviderHealthStatus;
  checkedAt: string;
  message?: string;
}

export interface FareOffer {
  id: string;
  totalAmount: number;
  currency: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  stops: number;
  carrierCodes: string[];
  durationMinutes: number;
  bookingUrl?: string;
}

export interface FareSearchResult {
  provider: string;
  observedAt: string;
  request: FareSearchRequest;
  offers: FareOffer[];
  sourceFreshness: 'live' | 'cached' | 'simulated';
}

export interface FareProvider {
  readonly id: string;
  search(
    request: FareSearchRequest,
    signal: AbortSignal,
    observedAt?: Date,
  ): Promise<FareSearchResult>;
  health(observedAt?: Date): Promise<ProviderHealth>;
}
