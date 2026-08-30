# ADR-0002: Provider gateway and local-only Google experiment

- Status: Accepted for prototype
- Date: 2026-08-29

## Context

No currently selected free airfare API satisfies every requirement. Google Flights is functionally useful for experimentation but direct automated access is fragile and subject to Google's terms.

## Decision

All fare collection passes through a provider gateway. Permit an experimental Google Flights adapter only in an explicitly local environment with action-scoped triggers, caching, strict budgets, backoff, a circuit breaker, and no protection bypass. Disable it in hosted environments and require a provider/legal review before public use.

## Consequences

The prototype can validate normalization and trends without coupling the product to Google. Results may stop working at any time. Production readiness depends on an authorized provider and confirmed display/retention rights.
