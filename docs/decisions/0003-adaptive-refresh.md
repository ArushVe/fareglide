# ADR-0003: Adaptive refresh cadence

- Status: Accepted
- Date: 2026-08-29

## Context

Prices usually need more attention near departure, but unnecessary requests increase cost and scraping risk. Alerts require periodic observations even when the user does not open a watch.

## Decision

Refresh active saved routes once daily beyond 60 days, twice daily from 30 to 60 days, and every six hours inside 30 days. Stop after departure. Apply jitter, cache checks, deduplication, locks, daily budgets, and exponential backoff. Manual refresh respects the same controls.

## Consequences

The observation density increases when it is most useful while remaining bounded. FareGlide may miss brief price changes between intervals and must communicate observation freshness rather than implying continuous monitoring.
