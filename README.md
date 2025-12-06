# robots
# Robot API (Express.js)

Simple REST API to register robots, update status, retrieve robot info, and store logs.
Built with Express.js + SQLite (better-sqlite3). Optional API-key auth.

## Features
- Register robot: `POST /robots` (id optional)
- Update status: `PATCH /robots/:id/status`
- List robots: `GET /robots`
- Get robot details: `GET /robots/:id`
- Create log: `POST /robots/:id/logs`
- Get robot logs: `GET /robots/:id/logs`
- List all logs: `GET /logs` (optional `?robot_id=`)

## Quick start (local)
1. Clone repo
2. Copy env:
   ```bash
   cp .env.example .env
   # edit .env to set API_KEY if you want auth
