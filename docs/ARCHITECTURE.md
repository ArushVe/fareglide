# FareGlide system architecture

The downloadable [system-design PDF](fareglide-system-design.pdf) is the visual architecture reference. It contains a C4 system-context view and formal UML component, sequence, class, deployment, and route-watch state-machine diagrams.

## Architectural style

FareGlide is a modular monolith for the initial release. Components have explicit interfaces but deploy together locally. This keeps the first version simple while preserving seams for a hosted edge deployment later.

## Component responsibilities

| Component | Responsibility |
| --- | --- |
| Web application | Map, airport search, route-watch forms, trends, settings, and local notifications |
| FareGlide API | Validation, authorization boundary, orchestration, and stable client contract |
| Watch service | Watch lifecycle and normalized-search-key attachment |
| Provider gateway | Provider selection, cache policy, budgets, normalization, and kill switches |
| Scheduler | Select due watches, add jitter, group identical keys, and enqueue idempotent refreshes |
| Observation service | Persist compact fare observations and answer historical queries |
| Trend engine | Rolling baselines and explainable drop/spike/new-low decisions |
| Notification outbox | Deduplicate and reliably deliver local or future email notifications |
| Product store | Profiles, preferences, watches, schedules, and alert configuration |
| Observation store | Search keys, normalized observations, provider attempts, and retention metadata |

## Critical boundaries

- The browser never contacts an airfare source directly.
- Provider-specific code implements a narrow `FareProvider` interface.
- Raw extraction results are untrusted and schema-validated.
- User-owned watches are separate from reusable non-personal observations.
- Scheduler work is based on normalized search keys, not one request per user.
- Provider failure records an attempt but does not overwrite the last valid observation.

## Refresh transaction

1. Scheduler claims due watches using an idempotency key.
2. Watches are grouped by normalized search key.
3. Gateway checks cache freshness, route cooldown, provider budget, and kill switch.
4. One eligible provider request runs for the key.
5. The response is normalized and validated.
6. One observation is appended; prior observations remain immutable.
7. The trend engine evaluates every watch attached to the key.
8. Qualifying events enter the outbox with a deduplication key.
9. The next due time is calculated from departure distance plus jitter.

Provider selection prefers SerpApi while quota and health permit. The experimental local scraper is invoked only as fallback or sampled validation, not automatically for every SerpApi observation. Provider identities remain separate throughout storage and comparison.

## Core domain entities

- `Profile`: local identity today; account identity later.
- `RouteWatch`: user intent, lifecycle, cadence, thresholds, and notification preferences.
- `NormalizedSearchKey`: canonical dimensions that materially affect a fare.
- `PriceObservation`: immutable normalized snapshot at a point in time.
- `ProviderAttempt`: request outcome, timing, failure category, and budget units.
- `TrendEvent`: explainable drop, spike, or new-low decision.
- `Notification`: outbox record with channel, status, cooldown, and deduplication key.

## Local-first deployment

The first working version may run the web application, API modules, scheduler, and SQLite database on one machine. A small local process or application timer can invoke the scheduler while FareGlide is running. Persistent operating-system scheduling is a later decision if the app must refresh while closed.

The planned hosted mapping is:

- Web and API: Cloudflare Worker-compatible Sites application.
- Database: Cloudflare D1.
- Scheduler: Cron Triggers plus due-watch queries.
- Authentication: hosted identity adapter.
- Notifications: email adapter backed by an approved provider.

Local and hosted deployments use the same domain interfaces. The experimental Google adapter must fail closed whenever the environment is not explicitly local.

## State and retention

- Price observations are append-only.
- Watches transition through draft, active, paused, throttled, booked-monitoring, expired, completed, and archived states.
- Raw HTML and full third-party payloads are not retained by default.
- Observation retention and product-data retention are separate policies.
- Deleting a profile removes its watches and personal configuration; shared non-personal observations follow their independent retention policy.

## Security controls

- Secrets remain server-side and outside Git.
- Provider adapters have daily budgets and global kill switches.
- The local scraper uses no Google login or persisted Google session.
- CAPTCHA, explicit denial, or access blocking opens the circuit and requires manual review.
- Logs redact queries when they could reveal personal travel plans.
- Inputs and provider responses are validated at trust boundaries.

## Observability

Track cache-hit rate, requests per provider, successful observations, refresh lag, blocked attempts, normalization failures, alert count, duplicate suppression, and estimated cost per active watch. These measures decide whether a provider is viable before public deployment.
