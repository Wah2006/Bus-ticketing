# File structure

Three codebases (recommend a monorepo with three top-level folders, or three repos if agents work better isolated — either way, the internal structure below stays the same):

```
/backend
/web
/mobile
```

## /backend (Node.js + Express)

```
backend/
  src/
    modules/
      auth/
        auth.routes.js
        auth.controller.js
        auth.service.js
        auth.model.js
        auth.validation.js        # request schema (Zod/Joi)
      agencies/
        agencies.routes.js
        agencies.controller.js
        agencies.service.js
        agencies.model.js
        agencies.validation.js
      trips/                      # routes, buses, schedules, seat maps
        trips.routes.js
        trips.controller.js
        trips.service.js
        trips.model.js
        trips.validation.js
      bookings/
        bookings.routes.js
        bookings.controller.js
        bookings.service.js
        bookings.model.js
        bookings.validation.js
        seatLock.service.js       # Redis lock acquire/release logic
      payments/
        payments.routes.js
        payments.controller.js
        payments.service.js
        payments.model.js
        webhooks.controller.js    # aggregator callback handler
      notifications/
        notifications.service.js
        sms.provider.js
        email.provider.js
    shared/
      db/
        pool.js                   # pg connection pool
        migrations/                # numbered migration files
        seeds/                     # dev seed data
      redis/
        client.js
      middleware/
        authGuard.js
        roleGuard.js
        validate.js                # runs a module's validation schema
        errorHandler.js            # single place formatting error responses
        rateLimiter.js
      events/
        eventBus.js                # in-process EventEmitter wrapper today,
                                    # swap for a queue client later without
                                    # touching any module
      utils/
        logger.js
        response.js                # response envelope helper (see api-contracts.md)
        currency.js                 # XAF formatting helpers
    app.js                          # Express app assembly, module route mounting
    server.js                       # process entrypoint
  tests/
    modules/                        # mirrors src/modules structure
  .env.example
  package.json
```

**Rule:** nothing outside `modules/bookings/` imports `bookings.model.js` directly. Cross-module calls go through the target module's `service.js` export.

## /web (React + Tailwind)

```
web/
  src/
    features/                      # mirrors backend modules, not generic "pages"
      auth/
        LoginPage.jsx
        RegisterPage.jsx
        useAuth.js                 # hook wrapping auth API calls
      search/
        SearchPage.jsx
        TripCard.jsx
      booking/
        SeatMapPage.jsx
        CheckoutPage.jsx
        BookingConfirmationPage.jsx
      account/
        MyBookingsPage.jsx
      admin/                        # role-protected, lazy-loaded chunk
        dashboard/
        trips/
        buses/
        staff/
    components/                     # shared, reusable, no feature logic
      ui/                           # buttons, inputs, modal, table — design-system primitives
      layout/                       # header, footer, protected route wrapper
    lib/
      apiClient.js                  # single fetch/axios wrapper, base URL, auth header
      queryClient.js                # React Query setup
    routes/
      router.jsx                    # route tree, admin routes lazy-loaded + role-guarded
    i18n/                           # EN/FR strings — see ui-context.md
    styles/
      tailwind.config.js
    App.jsx
    main.jsx
  .env.example
  package.json
```

**Rule:** a feature folder never imports another feature's internal components — only `components/ui` and `lib/apiClient`. If two features need to share logic, promote it to `lib/` or `components/`.

## /mobile (Flutter)

```
mobile/
  lib/
    features/                       # same mirroring principle as web
      auth/
        presentation/                # screens, widgets
        data/                        # repository, API calls
        domain/                      # models, use-case classes
      search/
      booking/
      account/
    core/
      network/
        api_client.dart              # single Dio/http wrapper
      theme/
        app_theme.dart               # mirrors web Tailwind tokens — see ui-context.md
      widgets/                       # shared, reusable widgets
      routing/
        app_router.dart
      state/                         # Riverpod/Bloc providers, one per feature
    main.dart
  assets/
    i18n/                            # EN/FR ARB files
  pubspec.yaml
```

The Flutter app has no admin surface — agency staff use the web app. The mobile app is passenger-only.

## Naming conventions across all three codebases
- Files: `camelCase.js` / `camelCase.jsx` (web/backend), `snake_case.dart` (Flutter, per Dart convention).
- Folders: lowercase, plural for collections (`modules`, `features`), singular for a single concern (`auth`, `search`).
- One exported concern per file — do not bundle unrelated controllers/services in a single file to save a file count.