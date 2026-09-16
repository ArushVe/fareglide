import assert from 'node:assert/strict';
import test from 'node:test';

import { airportMatches, findAirport } from '../data/airports.ts';
import {
  DEFAULT_USER_PREFERENCES,
  createFlexibleTripWatch,
} from '../domain/defaults.ts';
import { normalizeSearchRequest } from '../domain/normalization.ts';
import { planSearches } from '../domain/search-planner.ts';
import { nextRefreshAt, refreshCadenceHours } from '../domain/schedule.ts';
import { SimulatedFareProvider } from '../providers/simulated.ts';

void test('airport lookup matches city, code, and airport name', () => {
  const hongKong = findAirport('HKG');

  assert.ok(hongKong);
  assert.equal(airportMatches(hongKong, 'Hong'), true);
  assert.equal(airportMatches(hongKong, 'hkg'), true);
  assert.equal(airportMatches(hongKong, 'international'), true);
});

void test('defaults use SEA and one stop or fewer', () => {
  assert.equal(DEFAULT_USER_PREFERENCES.homeAirportIata, 'SEA');
  assert.equal(DEFAULT_USER_PREFERENCES.defaultMaximumStops, 1);
});

void test('a flexible watch plans round-trip and one-way searches', () => {
  const watch = createFlexibleTripWatch(
    'hkg',
    DEFAULT_USER_PREFERENCES,
    new Date('2026-09-15T12:00:00Z'),
  );
  const searches = planSearches(watch);

  assert.equal(searches.length, 2);
  assert.deepEqual(searches.map((search) => search.request.tripType).sort(), [
    'one_way',
    'round_trip',
  ]);
  assert.ok(searches.every((search) => search.request.maximumStops === 1));
});

void test('normalization is stable across casing and whitespace', () => {
  const base = {
    travelWindow: {
      mode: 'horizon' as const,
      monthsAhead: 6 as const,
      startsOn: '2026-09-15',
    },
    tripType: 'one_way' as const,
    cabin: 'economy' as const,
    passengerCount: 1,
    maximumStops: 1 as const,
    currency: 'usd',
    market: 'us',
  };
  const first = normalizeSearchRequest({
    ...base,
    origin: ' sea ',
    destination: 'hkg',
  });
  const second = normalizeSearchRequest({
    ...base,
    origin: 'SEA',
    destination: 'HKG',
  });

  assert.equal(first.hash, second.hash);
  assert.equal(first.serialized, second.serialized);
});

void test('adaptive cadence becomes more frequent near departure', () => {
  const now = new Date('2026-09-15T00:00:00Z');
  assert.equal(
    refreshCadenceHours({
      status: 'active',
      now,
      earliestDepartureDate: '2026-12-20',
    }),
    24,
  );
  assert.equal(
    refreshCadenceHours({
      status: 'active',
      now,
      earliestDepartureDate: '2026-10-30',
    }),
    12,
  );
  assert.equal(
    refreshCadenceHours({
      status: 'active',
      now,
      earliestDepartureDate: '2026-09-25',
    }),
    6,
  );
  assert.equal(
    nextRefreshAt(
      { status: 'active', now, earliestDepartureDate: '2026-09-25' },
      0.5,
    )?.toISOString(),
    '2026-09-15T06:00:00.000Z',
  );
});

void test('booked monitoring stops when the fare is not eligible', () => {
  const now = new Date('2026-09-15T12:00:00Z');
  assert.equal(
    refreshCadenceHours({
      status: 'booked_monitoring',
      now,
      bookedAt: '2026-09-15T08:00:00Z',
      postBookingEligible: false,
    }),
    null,
  );
  assert.equal(
    refreshCadenceHours({
      status: 'booked_monitoring',
      now,
      bookedAt: '2026-09-15T08:00:00Z',
      postBookingEligible: true,
    }),
    6,
  );
});

void test('simulated provider is deterministic for the same route and day', async () => {
  const watch = createFlexibleTripWatch(
    'HKG',
    DEFAULT_USER_PREFERENCES,
    new Date('2026-09-15T00:00:00Z'),
  );
  const [search] = planSearches(watch);
  const provider = new SimulatedFareProvider();
  const signal = new AbortController().signal;
  const observedAt = new Date('2026-09-15T08:00:00Z');

  const first = await provider.search(search.request, signal, observedAt);
  const second = await provider.search(search.request, signal, observedAt);

  assert.deepEqual(first, second);
  assert.equal(first.offers.length, 3);
  assert.ok(first.offers.every((offer) => offer.stops <= 1));
});
