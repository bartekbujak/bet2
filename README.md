# Turborepo Bet2

### Assumptions
- Users can only place a single event per betting slip via the UI.
- Each tab in the UI refreshes automatically every minute.
- The OddsHub service exposes manual endpoints for refreshing data and generating results:
he refresh endpoint only fetches upcoming football matches to avoid exceeding the limit of the test account from The Odds API.
For a real API account, it's possible to enable fetching of all competitions.
- Bet results are updated every hour.
- This is a simple application where microservices communicate with each other via HTTP.



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
2. ``pnpm exec drizzle-kit migrate  ``
3. setup .dotenv

### Stakehub
``cd apps/stake-hub``
1. Run migrations and setup .env
2. ``pnpm exec drizzle-kit migrate  ``
3. setup .dotenv

`docker compose up`

`pnpm dev`
