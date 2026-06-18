# simrs

A simple Node.js monitoring application scaffold for the `simrs` repository.

## Features

- `GET /` - basic service information
- `GET /health` - service health and uptime data
- `GET /metrics` - system and process metrics

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the service:

```bash
npm start
```

3. Open the endpoints:

- `http://localhost:3000/`
- `http://localhost:3000/health`
- `http://localhost:3000/metrics`

## Development

```bash
npm run dev
```
