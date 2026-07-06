# Energy Mix Backend

Express + TypeScript API for the Energy Mix UK app. It fetches UK generation mix data, returns daily energy mix averages, and calculates the cleanest electric car charging window.

## Features

- Energy mix endpoint for chart data
- Charging-window endpoint for electric car charging recommendations
- Health check endpoint
- Configurable CORS origins
- Multi-stage Docker build

## Requirements

- Node.js 20+
- npm

## Environment

Create `.env` from `.env.example`:

```text
PORT=3000
CORS_ORIGIN=*
CARBON_API_BASE_URL=https://api.carbonintensity.org.uk
```

`CORS_ORIGIN` can be `*` or a comma-separated list:

```text
CORS_ORIGIN=http://localhost:5173,https://example.com
```

`CARBON_API_BASE_URL` points to the Carbon Intensity API base URL.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default.

## API Endpoints

```text
GET /health
GET /api/energy-mix
GET /api/charging-window?hours=3
```

`hours` must be a whole number from `1` to `6`.

## Quality Checks

```bash
npm test
npm run build
npm run lint
npm run format:check
```

## Production

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t energy-mix-backend .
docker run --env-file .env -p 3000:3000 energy-mix-backend
```
