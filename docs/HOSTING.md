# Hosting and daily reports

## Recommended zero-cost setup

FareGlide is designed to run as one Cloudflare Worker deployment:

- Static assets and the web application are served by Cloudflare Workers.
- D1 stores watches, normalized searches, price observations, and report state.
- A Cron Trigger wakes the collection pipeline each day.
- Browser Run executes the provider adapter when a source requires a browser.
- Resend sends the completed report to the configured recipient.

This fits a personal tracker because the current free allowances are much larger
than one daily report and a small number of watches. Usage must still be
measured: browser sessions are the tightest allowance and each destination/date
combination has a real runtime cost.

## 8:00 AM Pacific scheduling

Cloudflare Cron Triggers use UTC, while the desired report time uses
`America/Los_Angeles`. The production scheduler should run at both possible UTC
hours for 8:00 AM Pacific and let the application send only when the localized
time is 8:00 AM and that day's report has not already been sent. This handles
daylight-saving changes without manual edits and makes the send idempotent.

The recipient address is read from `FAREGLIDE_REPORT_TO`. Keep the real address
in deployment secrets or `.env.local`; do not commit it to the repository.

## Email setup

For a personal first release, create a Resend account with the same email that
will receive the report and use its test sender. Resend test mode only sends to
the account owner's address. Later, verify a domain and replace
`FAREGLIDE_REPORT_FROM` if reports need to go to other users.

Never place the Resend API key in source control. Store it as a Cloudflare
secret in production and in `.env.local` during development.

## Local-only fallback

A local scheduler is still possible, but the Mac must be awake and connected.
The app can use `launchd` to run the collection and email command around 8:00 AM;
if the machine is off, there is no server available to do the work at that
time. Local mode is useful while developing the scraper, but it is less reliable
for the long-term daily report.

## Deployment gate

Before the first deployment, the following still need to be implemented and
tested:

1. A real browser-backed fare provider adapter.
2. D1 repository methods around the existing schema.
3. An idempotent daily report job.
4. Resend delivery and a preview/test-send action.
5. Rate limiting, failure logging, and a no-email-on-empty-result policy.

Provider adapters must comply with each data source's terms and access rules.
