# ADR-0005: Tandem fare collection

- Status: Accepted for local prototype
- Date: 2026-08-29

## Context

SerpApi provides stable structured Google Flights results but has a finite free quota. Direct local extraction may recover data when that service is unavailable, but it is more fragile and carries additional policy risk.

## Decision

Use SerpApi as the primary collector. Use the experimental local scraper only as fallback and sampled validation, never automatically alongside every primary request. Retain provider identity on every observation and do not blend incomparable offers.

## Consequences

FareGlide gains resilience and conserves quota without doubling routine traffic. The gateway needs provider health, quota reservation, comparison rules, and an immediate scraper kill switch.
