# FareGlide

FareGlide is a local-first flight price tracker that builds its own reusable fare history. Add a route, let FareGlide observe it on an adaptive schedule, inspect price trends, and receive high-signal alerts when the fare changes meaningfully.

> **Project status:** architecture and product planning. The existing web shell is only a scaffold; implementation has not officially started.

## Product direction

- Explore popular airports on a dark, terrain-rich interactive world map.
- Search airports directly or select them from the map.
- Save route watches, dates, cabin, passenger, and stop preferences.
- Cache normalized searches so identical requests share observations.
- Refresh automatically at `1/day -> 2/day -> every 6 hours` as departure approaches.
- Chart historical prices and explain price drops, spikes, and new lows.
- Start with a local profile; add hosted accounts when deployment begins.
- Keep every airfare source behind a replaceable provider interface.
- Use SerpApi as the primary local collector and direct scraping only as guarded fallback/validation.
- Optionally monitor eligible booked fares for meaningful rebooking opportunities.

## Local prototype data policy

SerpApi is the planned primary local collector. The `ExperimentalGoogleFlightsAdapter` is a private-development fallback and sampled validation source, not a parallel request on every refresh. It must be cache-first, rate-limited, action-scoped, and disabled by default in hosted environments. It must not bypass CAPTCHAs, authentication, rate limits, or access blocks.

Google Flights is not the production provider. Before any public release, replace or explicitly re-approve this adapter after reviewing provider authorization, terms, storage rights, and operating cost.

## Documentation

- [Product requirements](docs/PRODUCT_REQUIREMENTS.md)
- [System architecture](docs/ARCHITECTURE.md)
- [Data sources and collection policy](docs/DATA_SOURCES.md)
- [Development and pull-request workflow](docs/DEVELOPMENT.md)
- [Architecture decisions](docs/decisions/README.md)
- [Downloadable system-design PDF](docs/fareglide-system-design.pdf)

## Intended architecture

The browser talks only to FareGlide. A provider gateway normalizes external fare results, while the observation store preserves compact historical snapshots. A scheduler refreshes only due, saved routes; the trend engine compares new observations with rolling baselines; the notification outbox prevents duplicate alerts.

The initial implementation remains local-first. Cloudflare Workers, D1, hosted authentication, and email delivery are later deployment choices—not prerequisites for the first functional slice.

## Development

Requirements: Node.js 22.13+ and pnpm.

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm build
```

Do not commit provider credentials, session cookies, captured HTML, personal travel data, or local databases. See [Development](docs/DEVELOPMENT.md) before opening a pull request.

## Branching

FareGlide uses one protected `main` branch and short-lived feature branches. We do **not** keep permanent `frontend`, `backend`, `api-gateway`, or `notifications` branches. Cross-cutting milestones can use several focused PRs with compatible interfaces and feature flags.

Examples:

- `feat/dark-map-shell`
- `feat/route-watch-domain`
- `feat/provider-gateway`
- `feat/adaptive-refresh`
- `feat/trend-alerts`
- `docs/system-design`

Every branch should remain small enough to review, pass checks independently, and merge back to `main` quickly.

## Safety and scope

FareGlide provides fare observations and decision support, not guaranteed prices or ticketing. Every displayed offer needs a source, observation time, freshness indicator, and revalidation before booking.
