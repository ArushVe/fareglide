import {
  hashSearchKey,
  normalizeSearchRequest,
} from '../domain/normalization.ts';
import type { FareSearchRequest } from '../domain/types.ts';
import type {
  FareOffer,
  FareProvider,
  FareSearchResult,
  ProviderHealth,
} from './types.ts';

function addDays(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function firstCandidateDate(request: FareSearchRequest, seed: number): string {
  switch (request.travelWindow.mode) {
    case 'exact':
      return request.travelWindow.departureDate;
    case 'month':
      return `${request.travelWindow.month}-${String((seed % 24) + 1).padStart(2, '0')}`;
    case 'window': {
      const start = new Date(`${request.travelWindow.startDate}T00:00:00Z`);
      const end = new Date(`${request.travelWindow.endDate}T00:00:00Z`);
      const days = Math.max(
        1,
        Math.floor((end.getTime() - start.getTime()) / 86_400_000),
      );
      return addDays(request.travelWindow.startDate, seed % days);
    }
    case 'horizon':
      return addDays(request.travelWindow.startsOn, 14 + (seed % 75));
  }
}

export class SimulatedFareProvider implements FareProvider {
  readonly id = 'simulated';

  async health(observedAt = new Date()): Promise<ProviderHealth> {
    return { status: 'available', checkedAt: observedAt.toISOString() };
  }

  async search(
    input: FareSearchRequest,
    signal: AbortSignal,
    observedAt = new Date(),
  ): Promise<FareSearchResult> {
    if (signal.aborted) {
      throw new DOMException('The fare search was aborted.', 'AbortError');
    }

    const normalized = normalizeSearchRequest(input);
    const day = Math.floor(observedAt.getTime() / 86_400_000);
    const seed = Number.parseInt(
      hashSearchKey(`${normalized.hash}:${day}`),
      16,
    );
    const routeSeed = Number.parseInt(normalized.hash, 16);
    const base = input.tripType === 'round_trip' ? 620 : 360;
    const routeAdjustment = routeSeed % 170;
    const dailyAdjustment = (seed % 81) - 40;
    const departureDate = firstCandidateDate(normalized.request, seed);
    const offerCount = 3;

    const offers: FareOffer[] = Array.from(
      { length: offerCount },
      (_, index) => {
        const amount = base + routeAdjustment + dailyAdjustment + index * 47;
        const stay = normalized.request.stayLengthNights?.minimum ?? 0;
        return {
          id: `sim_${normalized.hash}_${day}_${index}`,
          totalAmount: amount,
          currency: normalized.request.currency,
          origin: normalized.request.origin,
          destination: normalized.request.destination,
          departureDate: addDays(departureDate, index * 2),
          ...(input.tripType === 'round_trip'
            ? { returnDate: addDays(departureDate, stay + index) }
            : {}),
          stops: Math.min(input.maximumStops, index % 2),
          carrierCodes: index === 0 ? ['FG'] : ['FG', 'GL'],
          durationMinutes: 690 + index * 85,
        };
      },
    );

    return {
      provider: this.id,
      observedAt: observedAt.toISOString(),
      request: normalized.request,
      offers,
      sourceFreshness: 'simulated',
    };
  }
}
