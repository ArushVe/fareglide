# ADR-0001: Local-first modular monolith

- Status: Accepted
- Date: 2026-08-29

## Context

FareGlide needs map exploration, fare collection, historical storage, scheduling, trends, notifications, and eventually accounts. Splitting these into services before validating the product would add deployment and coordination cost.

## Decision

Build a modular monolith with explicit component interfaces and one local deployment. Keep the provider, persistence, identity, scheduler, and notification edges replaceable so the same domain can later run on hosted infrastructure.

## Consequences

The local MVP is easier to run and debug. Module boundaries still require tests and disciplined imports. Service extraction is deferred until real scale or ownership needs justify it.
