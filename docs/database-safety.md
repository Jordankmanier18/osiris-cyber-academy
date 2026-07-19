# Database content and reset safety

Osiris separates routine content synchronization from destructive local resets.

## Fresh environment setup

Create the current database schema, then synchronize academy content:

```bash
npx prisma migrate deploy
npm run db:sync-content
```

The migration baseline contains the complete current Osiris schema. The content
sync is safe to rerun after deployment and does not create a demo learner.

## Safe content synchronization

Use this for development, staging, and production:

```bash
npm run db:sync-content
```

Prisma's standard seed command runs the same safe workflow:

```bash
npx prisma db seed
```

The workflow updates or creates the academy role ladder, curriculum, quizzes,
missions, labs, tickets, promotion content, and display names. It does not delete
learner accounts, XP, submissions, Training City results, ticket work, or
promotion history. It is safe to run repeatedly.

## Destructive local development reset

The development reset deletes every local learner and all local progress before
restoring academy content. It refuses to run against a non-local database and is
disabled when `NODE_ENV` or `VERCEL_ENV` is `production`.

Run it only when you intentionally want a blank local development database:

```bash
OSIRIS_DEVELOPMENT_RESET=DELETE_LOCAL_LEARNER_DATA npm run db:reset:development
```

Without the exact confirmation value, the command exits before connecting to or
changing the database.

Never add the confirmation variable to a checked-in environment file, deployment
configuration, or production secret store.
