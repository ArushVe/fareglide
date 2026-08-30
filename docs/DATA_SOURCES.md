# Data sources and collection policy

## Decision

FareGlide uses a provider gateway so no product feature depends directly on one airfare source. SerpApi is the primary local collector. The private prototype may also include `ExperimentalGoogleFlightsAdapter` as fallback and sampled validation; it is not an approved production integration.

## Tandem source policy

- Use SerpApi for routine route creation and scheduled observations while quota and health permit.
- Do not run both collectors for every refresh.
- Sample the local scraper occasionally to validate normalization or recover a missing field.
- Fall back to the local scraper when SerpApi is unavailable or its reserved quota is exhausted.
- Store each provider observation separately; never average or merge different itineraries into an invented price.
- Prefer the newest comparable itinerary and show source plus freshness when observations conflict.
- Reserve remaining SerpApi quota for routes closest to departure once monthly availability falls below 20%.

This document is engineering policy, not legal advice. Provider terms and applicable law must be reviewed again before distribution or deployment.

## Experimental Google Flights adapter

Permitted prototype triggers:

- Creating a saved route when no fresh cached observation exists.
- Clicking manual refresh after its cooldown expires.
- An active saved route becoming due under the adaptive schedule.

Prohibited behavior:

- Crawling routes that no user saved.
- Initiating requests because the map was panned or zoomed.
- Logging into Google or storing a Google session for automation.
- Solving, bypassing, or outsourcing CAPTCHAs.
- Rotating proxies, forging identity, or evading rate limits and blocks.
- Continuing after an explicit denial or cease-and-desist request.
- Shipping the adapter enabled in a hosted or public environment.
- Retaining raw HTML longer than necessary to normalize a response.

Required controls:

- Explicit `local` environment check and disabled-by-default configuration.
- Cache-first reads and canonical query deduplication.
- One in-flight request per normalized search key.
- Randomized schedule jitter and exponential backoff.
- Per-route cooldown, provider daily ceiling, and global daily ceiling.
- Circuit breaker on CAPTCHA, access block, or repeated schema failure.
- Schema validation and source/freshness metadata on every observation.

## Provider interface

Every adapter should implement behavior equivalent to:

```ts
interface FareProvider {
  readonly id: string;
  search(request: NormalizedFareSearch, signal: AbortSignal): Promise<FareSearchResult>;
  health(): Promise<ProviderHealth>;
}
```

The gateway—not the adapter—owns caching, budgets, locks, fallback order, and observation persistence. This prevents provider-specific behavior from leaking into the product.

## Candidate sources

| Source | Role | Current planning decision |
| --- | --- | --- |
| SerpApi Google Flights | Structured live fare collection | Primary local collector; current free plan is budgeted across saved routes |
| Google Flights local extraction | Fare experiment | Local-only, guarded, replaceable, never sole production source |
| Scrape Badger | Managed extraction experiment | Compare stability and cost behind the same boundary |
| Skyscanner | Official fare source | Preferred candidate if partnership access is approved |
| Amadeus Self-Service | Official prototyping source | Candidate fallback; validate airline and market coverage |
| Kiwi.com Tequila | Fare source | Do not depend on access without an invitation |
| Aviationstack | Schedule/status enrichment | Not a fare-price source |
| OpenSky Network | Aircraft-position enrichment | Not a fare-price source |
| OurAirports | Airport catalog | Suitable starting catalog; record snapshot provenance |

## Normalized observation

Store the search-key hash, provider, observation time, currency, lowest total, lowest nonstop total when present, representative itinerary, offer count, freshness, and validation status. Do not assume permission to retain full provider payloads, branding, or bookable offers indefinitely.

## Promotion gate

No adapter advances from experiment to production until the project documents:

1. Authorization and current terms.
2. Data display and retention rights.
3. Coverage by market, carrier, cabin, and itinerary type.
4. Normalization accuracy and failure behavior.
5. Expected requests and cost per active watch.
6. Rate limits, attribution, deeplink, and revalidation requirements.
7. A shutdown and migration plan.

## References

- [Google Terms of Service](https://policies.google.com/terms?hl=en-US)
- [Google Flight Search booking terms](https://travel.google.com/booking/flights/terms/)
- [Skyscanner developer documentation](https://developers.skyscanner.net/)
- [OpenSky API](https://opensky-network.org/data/api)
