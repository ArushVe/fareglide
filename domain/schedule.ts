import type { WatchStatus } from './types.ts';

export interface RefreshCadenceInput {
  status: WatchStatus;
  now: Date;
  earliestDepartureDate?: string;
  bookedAt?: string | null;
  postBookingEligible?: boolean;
}

const STOPPED_STATUSES = new Set<WatchStatus>([
  'draft',
  'paused',
  'expired',
  'archived',
]);

export function refreshCadenceHours(input: RefreshCadenceInput): number | null {
  if (STOPPED_STATUSES.has(input.status)) {
    return null;
  }

  if (input.status === 'booked_monitoring') {
    if (!input.postBookingEligible || !input.bookedAt) {
      return null;
    }
    const hoursSinceBooking =
      (input.now.getTime() - new Date(input.bookedAt).getTime()) / 3_600_000;
    return hoursSinceBooking < 24 ? 6 : 24;
  }

  if (!input.earliestDepartureDate) {
    return 24;
  }

  const departure = new Date(`${input.earliestDepartureDate}T00:00:00Z`);
  const daysUntilDeparture =
    (departure.getTime() - input.now.getTime()) / 86_400_000;

  if (daysUntilDeparture < 0) {
    return null;
  }
  if (daysUntilDeparture > 60) {
    return 24;
  }
  if (daysUntilDeparture >= 30) {
    return 12;
  }
  return 6;
}

export function nextRefreshAt(
  input: RefreshCadenceInput,
  jitterUnit = 0.5,
): Date | null {
  const cadence = refreshCadenceHours(input);
  if (cadence === null) {
    return null;
  }

  const boundedJitter = Math.min(1, Math.max(0, jitterUnit));
  const jitterMultiplier = 0.9 + boundedJitter * 0.2;
  return new Date(input.now.getTime() + cadence * jitterMultiplier * 3_600_000);
}
