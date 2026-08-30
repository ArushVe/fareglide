# FareGlide product requirements

## Vision

FareGlide helps a traveler understand whether a watched airfare is unusually low, unusually high, or stable without repeatedly spending requests on identical searches.

## Primary user

The first release serves one person running FareGlide locally. Multi-user accounts, hosted delivery, and shared infrastructure remain planned capabilities so the domain model does not need to be replaced later.

## Core experience

1. Open the dark world map and search or browse popular airports.
2. Choose an origin, destination, travel dates, passengers, cabin, and stop limit.
3. Create a route watch.
4. Reuse a fresh cached observation or collect one new observation.
5. Display the latest price, freshness, itinerary summary, and historical chart.
6. Refresh the watch adaptively until departure.
7. Explain meaningful drops, spikes, and historical lows.
8. Archive the watch automatically after departure.
9. After booking, optionally monitor eligible fares for meaningful price drops that may justify rebooking.

## Functional requirements

### Airport exploration

- Render a dark, terrain-rich map with restrained labels.
- Display popular airports at world scale and progressively reveal more while zooming.
- Support lookup by airport code, airport name, city, and country.
- Selecting an airport can fill either endpoint without initiating a fare request.

### Route watches

- Store origin, destination, outbound/return dates, trip type, cabin, passenger count, stop limit, market, and currency.
- Deduplicate equivalent searches using a canonical normalized search key.
- Allow pause, resume, archive, and manual refresh.
- Show the next scheduled refresh and the reason for its cadence.

### Price history

- Store compact normalized observations rather than raw provider pages.
- Preserve provider, observation time, currency, lowest total, representative itinerary, offer count, and freshness.
- Show insufficient-history states honestly.
- Revalidate before sending the traveler to book.

### Adaptive refresh

| Departure distance | Cadence |
| --- | --- |
| More than 60 days | Once per day |
| 30-60 days | Twice per day |
| 7-30 days | Every 6 hours |
| Less than 7 days | Every 6 hours for the local prototype |
| After departure | Stop and archive |

Every refresh must apply randomized jitter, a cache check, a per-search lock, provider and global budgets, and exponential backoff. Manual refresh observes the same cooldown and cannot bypass safety controls.

### Trends and alerts

- Use an explainable rolling median; do not require predictive AI for the MVP.
- Suggested drop: at least 12% and $40 below the 14-day median.
- Suggested spike: at least 18% and $60 above the 14-day median.
- Mark a new historical low independently.
- Require enough observations before claiming a trend.
- Apply a 24-hour cooldown per watch and alert type.
- For local development, notifications may be in-app and operating-system notifications; email arrives with hosted accounts.

### Post-booking monitoring

- Marking a watch booked records the paid amount, booking time, airline, booking channel, fare type, and known change/refund eligibility.
- Ordinary pre-booking monitoring stops once the ticket is issued.
- Eligible watches check every 6 hours during the initial 24-hour window, then once daily.
- Only a comparable meaningful price drop creates a `REBOOK_OPPORTUNITY`; later price increases do not affect an issued ticket.
- Alerts say “potential rebooking opportunity” and never promise a refund or reimbursement.
- Monitoring stops when the fare is ineligible, the user disables it, or departure passes.

## Non-functional requirements

- Cache-first and budget-aware.
- No provider secret, session cookie, or scraper implementation in browser code.
- Idempotent scheduled jobs and alert delivery.
- Provider failures preserve prior history and never create false alerts.
- Accessible keyboard operation and responsive map/search controls.
- Source, observation time, and freshness visible for every price.
- Structured logs without personal itinerary details or credentials.

## Out of scope for the initial implementation

- Purchasing or issuing tickets.
- Guaranteed fare availability.
- Continuous crawling of arbitrary routes.
- Public Google Flights scraping.
- Live aircraft tracking, disruption prediction, or airline account integration.
- Machine-learning price prediction.

## MVP acceptance criteria

- A route can be created from airport search or map selection.
- Repeating an equivalent fresh search does not contact the provider.
- A due watch produces at most one observation per normalized key.
- Historical observations render as a chart with freshness labels.
- A simulated qualifying price change produces one explainable alert.
- CAPTCHA or access-block detection disables the experimental adapter.
- A departed watch receives no further refreshes.
