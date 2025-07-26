# Jetsales Backend

## Overview
This backend provides an event-driven WhatsApp messaging system using:
- Express.js (API)
- Bull (queue)
- RabbitMQ (event bus)
- PostgreSQL (logging)
- Baileys (WhatsApp integration)
- Sentry (error monitoring)
- Docker Compose (development environment)

## Prerequisites
- Docker & Docker Compose
- Node.js (for local dev, v22+ recommended)

## Environment Variables
Create a `.env` file in the `backend/` directory with:
```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=messages_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
DATABASE_URL=postgres://user:password@db:5432/messages_db
RABBITMQ_URL=amqp://rabbitmq
SENTRY_DSN=<your_sentry_dsn>

# CORS Configuration (optional)
# Comma-separated list of allowed origins
# Examples:
# CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
# CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
# Leave empty to use default development origins
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

## Setup & Run (Recommended: Docker Compose)
1. **Build and start all services:**
   ```sh
   docker compose up -d --build
   ```
2. **Authenticate WhatsApp:**
   - Watch the backend logs for a QR code.
   - Scan it with WhatsApp (Settings > Linked Devices > Link a Device).
3. **API Usage:**
   - Send a message:
     ```sh
     curl -X POST http://localhost:3000/send-message \
       -H "Content-Type: application/json" \
       -d '{ "phone": "+5511999999999", "message": "Olá, seja bem-vindo(a)!" }'
     ```
4. **Check RabbitMQ:**
   - Management UI: [http://localhost:15672](http://localhost:15672) (guest/guest)
5. **Check Postgres:**
   - Connect to DB and run:
     ```sql
     SELECT * FROM messages ORDER BY created_at DESC;
     ```
6. **Sentry:**
   - Errors and exceptions are reported to your Sentry project.

## Development
- To run backend locally (not recommended for full stack):
  ```sh
  npm install
  npm start
  ```
- To run tests:
  ```sh
  npm test
  ```

## Architecture
- **API**: Receives message requests, enqueues jobs, logs to DB, publishes to RabbitMQ.
- **Bull**: Handles job queueing and retry/backoff.
- **RabbitMQ**: Decouples message processing; events are consumed by an internal consumer.
- **Consumer**: Listens to RabbitMQ, sends WhatsApp messages, updates DB.
- **Postgres**: Stores message logs and statuses.
- **Sentry**: Captures and reports errors.

## Troubleshooting
- If you see connection errors, ensure all services are running and healthy.
- If the QR code is cut off, widen your terminal or use the raw QR string with an online generator.
- If you need to wait for RabbitMQ, the backend uses `wait-for-it.sh` to delay startup until RabbitMQ is ready.
- For persistent issues, restart Docker Desktop and run `docker compose down -v && docker compose up -d --build`.

---

**Happy Messaging!**
