# Architecture

## Pattern
Client-server architecture. The backend is a **modular monolith** written as a single Express application, internally organized by domain module, with each module following MVC internally. This is deliberately not microservices yet — see "Path to microservices" below for when and how that changes.

## Tech stack
| Layer | Choice |
|---|---|
| Mobile client | Flutter |
| Web client | React 18 + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Caching / seat locks | Redis |
| Payments | Mobile Money aggregator (CinetPay, Campay, or Monetbil) + card fallback |
| Notifications | SMS via Africa's Talking (or Twilio), email via a transactional provider |
| Auth | JWT with role claims + middleware guard (see `code-standards.md`) |

## High-level flow
```
Flutter mobile app  ─┐
React web app        ├──►  Express API server  ──►  PostgreSQL (source of truth)
React admin views ───┘            │
                                   ├──► Redis (seat locks, caching)
                                   ├──► Mobile Money aggregator (payments)
                                   └──► SMS / email provider (notifications)
```
The React admin views are served from the **same** React web app, behind role-protected routes (`/admin/*`), not a separate deployed application. This avoids maintaining two frontend codebases for one feature set; if the admin surface grows large enough to justify its own release cycle later, it can be split out because it already lives in its own route tree and component namespace.

## Backend module boundaries
| Module | Responsibility | First candidate to extract into its own service, because |
|---|---|---|
| `auth` | passenger + staff identity, sessions, roles | self-contained, low coupling |
| `agencies` | agency profile, buses, stations, staff assignment | low traffic, mostly admin CRUD |
| `trips` | routes, schedules, seat maps, availability | read-heavy; benefits from independent caching/read replicas |
| `bookings` | reservation lifecycle, seat locking | highest write contention — extract first if load grows |
| `payments` | Mobile Money/card integration, transaction ledger | needs isolation for audit/compliance reasons regardless of scale |
| `notifications` | SMS/email dispatch | already async — natural queue boundary |

**Hard rule:** a module may only call another module through its `*.service.js` exported functions. It must never import another module's `*.model.js` or query another module's tables directly. This single rule is what makes future extraction cheap — treat it as a lint-enforced boundary, not a suggestion.

## MVC inside each module
- **Model** (`*.model.js`) — data access only. Raw SQL or a query builder (Knex recommended over a full ORM — this domain has a few queries, like seat availability under concurrency, where you want full control of the generated SQL). No business logic here.
- **Controller** (`*.controller.js`) — thin. Parses the request, calls the service, shapes the HTTP response using a response envelope (see `api-contracts.md`). No business logic here either.
- **Service** (`*.service.js`) — all business rules live here: seat availability math, booking state transitions, refund policy, commission calculation. This is the layer that becomes a standalone service's core logic later, unchanged.
- **Routes** (`*.routes.js`) — Express router wiring + middleware (auth guard, role guard, validation schema) for that module only.

## Seat locking (the core concurrency mechanism)
PostgreSQL is the source of truth for seat state (`seat_availability.status`), but a lock is needed for the window between "user selects a seat" and "payment completes or times out."

1. Passenger selects seat → acquire a Redis key `lock:trip:{tripId}:seat:{seatNumber}` with `SET NX EX 600` (10 minute TTL, set-if-not-exists).
2. If the lock is acquired, create a `bookings` row with status `pending`.
3. Initiate payment (async — see payments flow below).
4. On payment webhook success: mark booking `confirmed`, mark `seat_availability` row `sold`, delete the Redis lock, send notification.
5. On payment failure or TTL expiry (whichever first): mark booking `expired`/`cancelled`, delete the Redis lock (or let it expire naturally), seat becomes bookable again.

A scheduled sweep job (or Redis keyspace notification listener) reconciles any `pending` booking whose lock has expired but whose row was never updated — defensive cleanup against crashed processes.

**Never** rely on Redis alone as the source of truth — if Redis is flushed or restarts, PostgreSQL's `seat_availability.status` must still reflect the real, durable state.

## Payments flow
Mobile Money payments are asynchronous by nature (the user confirms on their phone via USSD prompt). The API must:
1. Respond to the client immediately with `payment_status: pending` — never block the HTTP response on the user's phone confirmation.
2. Expose a webhook endpoint (`POST /api/v1/webhooks/payments`) that the aggregator calls on completion.
3. Treat every webhook call as **idempotent** — key on the aggregator's transaction reference; if a payment with that reference is already `confirmed`, return 200 and do nothing further.
4. Store the raw callback payload in the payments ledger for reconciliation/disputes.

## Notifications
Fire-and-forget via an in-process event emitter (`shared/events/`) — e.g. `bookingConfirmed` event triggers a listener in the `notifications` module that sends SMS + email. This must never block the request/response cycle of the module that emitted the event.

**Upgrade path:** when volume justifies it, swap the in-process `EventEmitter` for a real queue (RabbitMQ, SQS, or BullMQ on Redis you already have). Because modules only ever emit/listen to named events, not call each other's notification code directly, this swap touches only `shared/events/`, not the modules themselves.

## Multi-role access control
One `users` table, `role` enum (`passenger`, `agency_staff`, `superadmin`), nullable `agency_id` (null for passengers and superadmin, set for agency staff). Every agency-scoped query must filter by `agency_id` server-side — never trust a client-supplied `agency_id`; derive it from the authenticated user's JWT claim.

## Path to microservices
Do not split preemptively. Split a module out when you observe one of:
- The `bookings` module becomes a write bottleneck under real load.
- `payments` needs isolated infrastructure for compliance/audit reasons.
- A module needs to scale independently (e.g., `trips` search needs read replicas the rest of the app doesn't).

Because of the module-boundary rule above, extraction is: stand up a new service, move that module's `routes/controller/service/model` files, replace its in-process service calls with HTTP or a queue message, keep using the same event names on real message infrastructure. This is a project, not a rewrite.