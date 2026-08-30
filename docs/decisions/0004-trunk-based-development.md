# ADR-0004: Trunk-based pull-request workflow

- Status: Accepted
- Date: 2026-08-29

## Context

Frontend, API, scheduling, notifications, and accounts share domain contracts. Permanent subsystem branches would delay integration and accumulate conflicts.

## Decision

Keep one protected `main` branch and use short-lived outcome-oriented branches merged through pull requests. Coordinate cross-cutting work through small contracts and feature flags instead of long-lived integration branches.

## Consequences

Integration happens continuously and PRs remain reviewable. Incomplete work must be safely hidden, and developers need to synchronize with `main` frequently.
