# Development and pull-request workflow

## Branch model

Use trunk-based development:

- `main` is protected and should always build.
- Work happens on short-lived branches created from current `main`.
- Merge through pull requests after automated checks and review.
- Delete branches after merge.
- Use feature flags or adapter configuration for incomplete cross-cutting work.

Do not maintain long-lived branches named `frontend`, `backend`, `api-gateway`, `notifications`, or `accounts`. Those areas depend on shared contracts and would drift until a risky integration merge. A branch represents one reviewable outcome, not an organizational department.

## Branch naming

Use `<type>/<short-outcome>`:

- `feat/dark-map-shell`
- `feat/route-watch-domain`
- `feat/provider-gateway`
- `feat/google-local-adapter`
- `feat/adaptive-refresh`
- `feat/trend-alerts`
- `fix/cache-key-currency`
- `docs/system-design`

When Codex creates a branch, the equivalent `codex/` prefix may be used, such as `codex/feat/adaptive-refresh`.

## Recommended implementation PRs

1. Domain types, normalized search key, and database schema.
2. Dark map and airport selection using mock data.
3. Provider gateway contract, cache, budgets, and simulated provider.
4. Experimental local Google adapter behind a disabled-by-default flag.
5. Route-watch lifecycle and adaptive scheduler.
6. Observation history and trend chart.
7. Explainable trend engine and local notification outbox.
8. Local profile and settings.
9. Hosted account, email, and deployment work only after the local MVP is accepted.

Some PRs can be developed concurrently once their interface is merged or agreed, but each PR should integrate with `main` rather than with another long-lived feature branch.

## Pull-request requirements

Each PR should include:

- One clear outcome and its motivation.
- Screenshots for visible changes.
- Tests for domain rules, normalization, scheduling, caching, and alert deduplication.
- Migration notes for schema changes.
- Security and data-source implications.
- A rollback or feature-disable path for provider work.
- Documentation updates when behavior or architecture changes.

Before review:

```bash
pnpm lint
pnpm build
```

## Commit guidance

Prefer small commits using concise conventional prefixes such as `feat:`, `fix:`, `docs:`, `test:`, and `chore:`. Never commit `.env` files, API keys, browser profiles, cookies, captured provider pages, or local SQLite databases.

## Definition of done

- Acceptance criteria pass.
- Relevant automated tests pass.
- Errors and empty/loading states are handled.
- New data is validated at boundaries.
- Logs contain no secrets or unnecessary travel details.
- Provider requests respect cache, cooldown, budget, and circuit-breaker controls.
- Documentation matches the merged behavior.
