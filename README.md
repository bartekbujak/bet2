# Turborepo Bet2

Description

## Instructions
`pnpm install`

`pnpm build`

### Sheets ui
``cd apps/sheets-ui``
1. Add your service-account.json from gcloud
2. ``pnpm create-spreadsheet``
3. ``pnpm prepare-spreadsheet``
4. setup .dotenv

### Oddshub
``cd apps/odds-hub``
1. Run migrations and setup .env
2. ``pnpm exec drizzle-kit generate  ``
3. setup .dotenv

### Stakehub
``cd apps/stake-hub``
1. Run migrations and setup .env
2. ``pnpm exec drizzle-kit generate  ``
3. setup .dotenv

`docker compose up`

`pnpm dev`
