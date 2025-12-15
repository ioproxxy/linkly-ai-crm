# Linkly Backend (API)

NestJS + Prisma API for the Linkly AI CRM.

## Environment

Create a `.env` file in `backend/` based on `.env.example`:

- `DATABASE_URL` – your Postgres connection string (the one you pasted).
- `JWT_SECRET` – long random string for signing JWTs.
- `GEMINI_API_KEY` – Gemini API key for AI features (optional; without it AI returns safe fallbacks).
- `SEARCH_PROVIDER_URL` – HTTPS endpoint of a compliant search service you control.
- `FRONTEND_ORIGIN` – e.g. `http://localhost:3000` for local dev.

Never expose these values in the frontend.

## Commands

From `backend/`:

- `npm install`
- `npx prisma generate`
- `npx prisma migrate deploy` (or `prisma migrate dev` in development)
- `npm run start:dev` – start API on `http://localhost:4000`.
