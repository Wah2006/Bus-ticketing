# Project overview

## What this is
A multi-agency bus ticketing platform for Cameroon. Passengers search routes, book seats, and pay via Mobile Money or card, across multiple independent bus agencies operating on one shared platform. Agencies manage their own buses, routes, schedules, and staff through an admin dashboard. The platform operator (us) onboards agencies and takes a commission or subscription fee.

This is a **marketplace**, not a single-operator booking tool. Every agency is a tenant row in the data model, not a hardcoded partner.

## Participating agencies (launch cohort)
Moghamo, Vatican Express, Touristique Express, Avenir Voyages, United Express, Nso Boys, Garantie Express, General Express, Global Voyage, Finex, Musango.

More agencies will be onboarded after launch — the platform must support adding a new agency without a code change (data-driven, not hardcoded).

## Platforms
| Platform | Stack | Audience |
|---|---|---|
| Mobile app | Flutter | Passengers |
| Web app | React + Tailwind CSS | Passengers (public) + Agency staff + Superadmin (protected routes) |
| Backend API | Node.js / Express | Serves both clients |
| Database | PostgreSQL | Single source of truth |

See `architecture.md` for the full system design.

## Primary user types
1. **Passenger** — searches trips, books/pays for a seat, receives an e-ticket, can view/cancel their bookings.
2. **Agency staff** — manages their own agency's buses, routes, trip schedules, seat maps; sells walk-in/counter tickets (no online payment step); views their agency's bookings and revenue.
3. **Platform superadmin** — onboards/suspends agencies, views cross-agency analytics, resolves payment disputes.

## Core functional scope (MVP)
- Passenger: search trips by route + date, view seat map, hold seat, pay via Mobile Money (MTN/Orange) or card, receive SMS + in-app e-ticket, view booking history, cancel within policy window.
- Agency staff: CRUD on buses, routes, trip schedules; view seat map per trip; create walk-in bookings at the counter; view daily manifest/revenue.
- Superadmin: onboard new agency, manage agency status, view platform-wide metrics.
- System: prevent double-booking of a seat under concurrent requests (see `workflows.md`), send booking/payment notifications, handle payment webhook idempotently.

## Explicitly out of scope for MVP
- Dynamic pricing / surge pricing.
- Loyalty points or agency-hopping discounts.
- In-app chat/support.
- Real-time GPS bus tracking.
- Native iOS/Android split codebases (Flutter only).
- Multi-country expansion (Cameroon only, XAF only, at launch).

These may become future phases — do not build speculative infrastructure for them now; note extension points instead.

## Business rules AI agents must respect
- A seat can never be sold twice for the same trip. This is the single most important invariant in the system.
- Currency is always XAF (Central African CFA franc), displayed with no decimal places (e.g. `2 500 XAF`, not `2500.00 XAF`).
- Cameroon has two official languages — the web and mobile UI must be structured for EN/FR from the start (see `ui-context.md`), even if only English copy ships first.
- Agency staff can only ever see/modify data belonging to their own `agency_id`. This must be enforced server-side, not just hidden in the UI.
- Every booking, payment, and cancellation must be auditable — no hard deletes on financial records.

## Glossary
- **Route** — a city pair, e.g. Yaoundé → Bamenda (not tied to a date/time).
- **Trip** — one specific bookable departure: a route + bus + date + departure time.
- **Seat hold / seat lock** — a temporary reservation (a few minutes) on a seat while a passenger completes payment, before the booking is confirmed.
- **Booking** — a confirmed or in-progress reservation record tied to a passenger, a trip, and one or more seats.
- **Manifest** — the list of confirmed passengers for a specific trip, used by agency staff at boarding.
- **Counter booking** — a booking created in person by agency staff for a walk-in passenger, paid in cash, not through the online payment flow.

## How to use these context files
When implementing any feature, read `architecture.md` and `file-structure.md` first for where code belongs, `code-standards.md` for how to write it, `database-schema.md` and `api-contracts.md` for exact shapes, `workflows.md` for the business logic sequence, and `ui-context.md` for anything user-facing. Update `progress-tracker.md` after completing any tracked task.