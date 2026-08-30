# ADR-0006: Post-booking monitoring

- Status: Accepted
- Date: 2026-08-29

## Context

An issued ticket is unaffected by later price increases. A later decrease may create a cancellation or rebooking opportunity depending on the booking channel and fare rules, but it does not automatically entitle the traveler to reimbursement.

## Decision

Stop ordinary monitoring when a watch is marked booked. Allow eligible watches to enter `BOOKED_MONITORING`, checking every six hours during the initial 24-hour window and once daily afterward. Alert only on a meaningful comparable drop and describe it as a potential rebooking opportunity requiring verification.

## Consequences

FareGlide can surface possible savings without making legal or airline-policy promises. The user must provide booking amount and eligibility information, and every alert must account for known fees and restrictions.
