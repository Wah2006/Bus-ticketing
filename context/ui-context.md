# UI context

This file is the shared design reference for the React web app and the Flutter mobile app, so both platforms feel like one product even though they're built separately.

## Brand and tone
Practical, trustworthy, fast. This is a utility app people use under time pressure (catching a bus) — clarity beats decoration everywhere. Avoid dense text; favor large tap targets, clear hierarchy, and status that's readable at a glance (booked / pending / cancelled).

## Language
Cameroon is officially bilingual (French/English). Every user-facing string — web and mobile — goes through an i18n layer from day one:
- Web: `src/i18n/en.json`, `src/i18n/fr.json`, keyed by feature (e.g. `booking.confirmSeat`).
- Mobile: ARB files (`app_en.arb`, `app_fr.arb`).
No hardcoded strings in components/widgets, even if only English ships first — retrofitting i18n later touches every screen; doing it from the start costs almost nothing.

## Currency and number formatting
- Currency is always XAF. Format as `2 500 XAF` (space as thousands separator, no decimals, symbol after the amount) — never `2,500.00 XAF` or `$2,500`.
- Dates: display as `12 Jul 2026`, times as 24-hour `14:30`, matching how Cameroonian bus agencies print physical tickets.

## Design tokens (source of truth: web Tailwind config, mirrored in Flutter theme)
| Token | Value | Usage |
|---|---|---|
| Primary | brand green, e.g. `#1A6E3C` | primary actions, active states |
| Secondary | a warm accent (define once, reuse) | secondary CTAs, highlights |
| Success | standard green | confirmed booking, successful payment |
| Warning | amber | seat hold expiring soon, pending payment |
| Danger | red | cancelled, payment failed, errors |
| Neutral scale | gray 50–900 | text, borders, backgrounds |
| Font | Inter | both platforms |

Define these once in `web/src/styles/tailwind.config.js` as the source of truth, then mirror the same hex values in `mobile/lib/core/theme/app_theme.dart`. Do not let the two platforms drift — if a color changes, update both files in the same PR.

## Layout and responsiveness (web)
- Mobile-first Tailwind breakpoints: base (< 640px), `sm`, `md`, `lg`. Most passengers will use the web app on a phone browser as often as desktop — design and test mobile viewport first.
- Admin dashboard views can assume a wider viewport (`lg`+) but must not break below `md`, since agency staff sometimes work from a phone or small laptop.

## Core screens and required states
Every data-driven screen (trip search results, seat map, my bookings, admin trip list) must explicitly design for these states — do not leave them as an afterthought:
1. **Loading** — skeleton or spinner, never a blank screen.
2. **Empty** — e.g. "No trips found for this route on this date" with a clear next action (change date, view nearby dates).
3. **Error** — a message mapped from the API's `error.code` (see `api-contracts.md`), never a raw stack trace or generic "Something went wrong" with no recovery action.
4. **Populated** — the normal case.

## Seat map component
This is the most important UI element in the product — get it right once, reuse everywhere (web passenger view, web admin view, mobile passenger view):
- Seat states: available, selected (by current user), held-by-someone-else, sold, unavailable/blocked (e.g. driver seat, broken seat).
- Held-by-someone-else and sold must look visually distinct from each other so passengers understand a held seat isn't permanently gone (retry later) versus a sold seat (never available for this trip).
- Show a live countdown once the current user holds a seat, tied to the lock TTL from `architecture.md` — passengers must never be surprised by a silent expiry.

## Booking confirmation / e-ticket
Must be viewable offline once issued (both web — as a downloadable/printable view — and mobile — cached locally), since connectivity at bus stations is inconsistent. Include: passenger name, agency name and logo, route, trip date/time, seat number, booking reference, a QR code encoding the booking reference for manifest scanning.

## Accessibility baseline
- Minimum tap target 44x44px on mobile.
- Color is never the only signal for seat/booking status — pair with an icon or label (see `code-standards.md`'s general principle against relying on a single cue).
- Sufficient contrast on the primary/secondary palette against both light backgrounds — verify before finalizing exact hex values.

## Component/widget parity list
Keep these named consistently across web and mobile so agents building either platform know they're building the "same" thing:
`TripCard`, `SeatMap`, `SeatLegend`, `BookingSummaryCard`, `PaymentStatusBadge`, `ETicketView`, `TripFilterBar`, `AgencyBadge`.