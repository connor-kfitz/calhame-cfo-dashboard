# Calhame CFO Dashboard

Monorepo for a CFO dashboard that connects to QuickBooks, stores data in Postgres, and runs background sync jobs via BullMQ + Redis.

## Repo layout

- `apps/web`: Next.js App Router app (UI + API routes) with Clerk auth
- `apps/worker`: BullMQ worker that processes background sync jobs
- `packages/shared`: shared constants/types
- `infrastructure/redis`: local Redis via Docker Compose
- `infrastructure/postgres/schema-dump.sql`: Postgres schema bootstrap/reference

## Tech stack

- Next.js 16 (App Router), React 19, Tailwind
- Clerk authentication
- Postgres (`pg`)
- BullMQ + Redis background jobs
- QuickBooks OAuth + API integration

## Prerequisites

- Node.js `>=18` and `npm`
- Postgres database (local or hosted)
- Redis (local Docker is the easiest)

## Environment variables

This repo expects env vars in the app(s) where they run.

### Web app (`apps/web/.env.local`)

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key (server-side)
- `CLERK_WEBHOOK_SECRET`: Clerk webhook signing secret (Svix)
- `DATABASE_URL`: Postgres connection string
- `REDIS_URL`: Redis connection string (used to enqueue jobs)
- `TOKEN_ENCRYPTION_KEY`: 32-byte key (base64 or hex) used to encrypt tokens for storage
- `QUICKBOOKS_CLIENT_ID`: Intuit app client id
- `QUICKBOOKS_CLIENT_SECRET`: Intuit app client secret
- `QUICKBOOKS_REDIRECT_URI`: OAuth redirect URI (must match your Intuit app config)
- `QUICKBOOKS_BASE_URL`: QuickBooks API base URL (sandbox or production)

### Worker (`apps/worker/.env`)

- `REDIS_URL`: Redis connection string (used to consume jobs)

## Local development

1. Install dependencies:

	- `npm install`

2. Start Redis:

	- `docker compose -f infrastructure/redis/docker-compose.yml up -d`
	- set `REDIS_URL=redis://localhost:6379`

3. Start/prepare Postgres:

	- create a Postgres database and set `DATABASE_URL`
	- (optional) bootstrap the schema from the dump:
	- macOS/Linux: `psql "$DATABASE_URL" -f infrastructure/postgres/schema-dump.sql`
	- Windows (PowerShell): `psql $env:DATABASE_URL -f infrastructure/postgres/schema-dump.sql`

4. Create env files:

	- `apps/web/.env.local`
	- `apps/worker/.env`

5. Run everything (web + worker) from the repo root:

	- `npm run dev`

The web app runs on `http://localhost:3000`.

## Useful scripts (root)

- `npm run dev`: runs `apps/web` and `apps/worker` via Turborepo
- `npm run build`: builds all packages/apps
- `npm run lint`: lints all packages/apps
- `npm run check-types`: type-checks all packages/apps
- `npm run format`: runs Prettier

## Background sync jobs

The web app enqueues jobs to Redis/BullMQ, and the worker consumes them.

- Enqueue: `POST /api/microservice/sync-company` with JSON `{ "companyId": string, "provider": "quickbooks" }`
- Consume: `apps/worker` listens on the shared accounting queue and handles `SYNC_COMPANY_JOB`

## QuickBooks integration (OAuth)

- Start OAuth: `GET /api/quickbooks/auth`
- Callback: `GET /api/quickbooks/callback`

## Clerk webhook

Configure a Clerk webhook to point at:

- `POST /api/webhooks/clerk`

This keeps the local `users` table in sync with Clerk user create/update events.
