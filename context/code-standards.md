# Code standards

These apply across backend, web, and mobile unless a section says otherwise. AI agents (Copilot, Codex, OpenCode) should treat this file as non-negotiable style, not a suggestion.

## General principles
- Business logic lives in `*.service.js` (backend) or `domain/` (Flutter) or hooks (web) — never in controllers, route handlers, or UI components.
- No silent failures. Every catch block either handles the error meaningfully or re-throws with added context — never an empty catch.
- No hardcoded agency names, IDs, or route names anywhere in code. Everything agency-specific is data, queried by `agency_id`.
- No magic numbers for business rules (seat lock TTL, cancellation window, commission rate) — these live in a single `config/constants.js` (backend) or `.env`, never inlined in a service function.

## Backend (Node/Express)

### API response envelope
Every response — success or error — uses the same shape:
```json
{
  "success": true,
  "data": { },
  "error": null,
  "meta": { }
}
```
On error:
```json
{
  "success": false,
  "data": null,
  "error": { "code": "SEAT_ALREADY_LOCKED", "message": "This seat is currently being booked by another passenger." },
  "meta": { }
}
```
`meta` carries pagination info (`page`, `pageSize`, `total`) when relevant. Use the `shared/utils/response.js` helper to build these — never hand-roll the shape in a controller.

### Error codes
Use a stable, uppercase, snake-case error code per known failure (`SEAT_ALREADY_LOCKED`, `PAYMENT_DECLINED`, `TRIP_NOT_FOUND`, `INVALID_CREDENTIALS`). Frontend and mobile branch on `error.code`, never on `error.message` (message text may change or be localized).

### Validation
Every route validates its request body/params/query with a schema (Zod or Joi — pick one and stay consistent) before the controller touches it. Validation lives in `*.validation.js` next to the controller, run via the shared `validate` middleware. Never validate manually inside a controller with if-statements.

### Database access
- Use parameterized queries always — no string concatenation into SQL, ever, including in migrations/seeds.
- Every table has `created_at`, `updated_at`. Financial/booking-related tables (`bookings`, `payments`) are never hard-deleted — use a `status` column instead.
- Every foreign key has an index. Every column used in a `WHERE` on a hot path (seat availability lookups, agency-scoped queries) has an index — check `database-schema.md` for the list that must exist.

### Auth
JWT access token (short-lived, ~15 min) + refresh token (longer-lived, stored httpOnly cookie on web / secure storage on mobile). Role (`passenger` / `agency_staff` / `superadmin`) and, for staff, `agency_id`, are claims in the access token — the `roleGuard` middleware reads from the verified token, never from a request body or query param.
> Note: the team has prior experience with Better Auth (pg adapter) on other projects. It's a reasonable swap-in if you want built-in session/refresh handling instead of hand-rolled JWT — but that's a deliberate decision to make once, not something to introduce piecemeal by whichever agent touches auth next.

### Logging
Structured JSON logs (`shared/utils/logger.js`), one log line per request with request ID, route, status code, duration. Never log full card numbers, Mobile Money phone numbers, or raw payment payloads at `info` level — redact or log at a restricted `debug` level only in non-production environments.

### Testing
Jest + Supertest. Every service function that contains a business rule (seat lock, refund calculation, commission split) needs a unit test. Every route needs at least one integration test covering the happy path and the primary failure path (e.g., booking a seat that's already locked).

## Web (React)
- Function components + hooks only, no class components.
- Server state (anything from the API) lives in React Query — never duplicated into local `useState`. Local UI state (form inputs, modal open/closed) uses `useState`/`useReducer`.
- One component per file, matching the file name.
- Tailwind utility classes directly in JSX; extract to a component (not a CSS file) when a pattern repeats more than twice.
- All user-facing strings go through the i18n layer (`src/i18n/`) — no hardcoded English strings in JSX, even at MVP, since French is a launch requirement per `project-overview.md`.
- All API calls go through `lib/apiClient.js` — no raw `fetch`/`axios` calls scattered in components.

## Mobile (Flutter)
- State management: pick one (Riverpod recommended) and use it consistently — do not mix Provider, Bloc, and setState across features.
- Widgets are small and composable; a screen file (`*_screen.dart`) should mostly assemble smaller widgets, not contain deeply nested widget trees inline.
- All strings via the ARB-based i18n setup — no hardcoded strings in widget code.
- Network calls go through `core/network/api_client.dart` only.

## Git conventions
- Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`) scoped by module where useful: `feat(bookings): add seat lock expiry sweep job`.
- Branch naming: `feature/{module}-{short-description}`, `fix/{module}-{short-description}`.
- No direct commits to `main` — every change through a PR, even solo/AI-agent-authored ones, so `progress-tracker.md` and code review stay in sync.

## Environment variables
Every secret/config value (DB connection string, Redis URL, JWT secret, Mobile Money aggregator keys, SMS provider keys) lives in `.env`, never committed, with a matching `.env.example` showing required keys with placeholder values. Backend, web, and mobile each maintain their own `.env.example`.

## Security checklist (apply to every module touching money or personal data)
- Parameterized SQL, always.
- Agency-scoped queries filter by the JWT's `agency_id`, never a client-supplied one.
- Payment webhook signature verified before processing (per aggregator's documented method).
- Rate limiting on auth endpoints and payment initiation endpoints.
- No PII (phone numbers, national ID if collected) in logs at `info` level.