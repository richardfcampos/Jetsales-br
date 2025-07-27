# WhatsApp Message Sender

A full-stack application for sending WhatsApp messages with queue processing, built with Express.js backend and Next.js frontend. Features a simplified WhatsApp login system using QR codes.

## Project Structure

```
Jetsales-br/
├── backend/          # Express.js API with TypeScript
│   ├── src/
│   ├── tests/
│   └── ...
├── frontend/         # Next.js React application
│   ├── src/
│   ├── components/
│   └── ...
└── docker-compose.yml
```

## Features

### Backend
- Express.js with TypeScript
- Bull Queue for message processing
- RabbitMQ for service communication
- PostgreSQL for data persistence
- WhatsApp integration via Baileys with QR code authentication
- Sentry for error tracking
- Jest testing framework
- Rate limiting and input validation

### Frontend
- Next.js 14 with TypeScript
- React components with custom hooks
- Tailwind CSS for styling
- WhatsApp QR code login system
- Form validation and error handling
- Real-time feedback for message sending
- Automatic redirection based on connection status

## WhatsApp Authentication

The application uses a simplified WhatsApp authentication system:

1. **Login Page**: Users visit `/login` to see a QR code
2. **QR Code Scanning**: Users scan the QR code with their WhatsApp app
3. **Automatic Redirect**: Upon successful connection, users are redirected to the message sending page
4. **Connection Status**: The system displays the connected phone number
5. **Session Management**: Credentials are stored locally and persist across sessions

### How to Connect
1. Open the application at http://localhost:3001
2. If not connected, you'll be redirected to `/login`
3. Click "Get QR Code" to generate a fresh QR code
4. Open WhatsApp on your phone
5. Go to Settings → Linked Devices
6. Tap "Link a Device"
7. Scan the QR code
8. Wait for connection confirmation
9. You'll be automatically redirected to the message sending page

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Development Environment

1. Clone the repository:
```bash
git clone <repository-url>
cd Jetsales-br
```

2. Create environment file for backend:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. (Optional) Pre-pull Docker images to avoid timeout issues:
```bash
./scripts/setup-docker.sh
```

4. Start all services:
```bash
docker compose up --build
```

5. Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- RabbitMQ Management: http://localhost:15672
- PostgreSQL: localhost:5432

### Production Deployment

1. Build and start production services:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Local Development

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
nvm use v22.12.0
npm install
```

3. Start the server:
```bash
npm start
```

4. Run tests:
```bash
npm test
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## API Endpoints

### WhatsApp Authentication
- `GET /api/whatsapp/status` - Get connection status
- `GET /api/whatsapp/qr-code` - Get QR code for authentication
- `POST /api/whatsapp/initialize` - Initialize WhatsApp service

### Message Sending
- `POST /api/messages/send-message` - Send a WhatsApp message

**Request Body:**
```json
{
  "phone": "+5511999999999",
  "message": "Hello, welcome!"
}
```

**Response:**
```json
{
  "jobId": "12345",
  "status": "queued"
}
```

## Environment Variables

### Backend (.env)
```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=messages_db
RABBITMQ_URL=amqp://rabbitmq
SENTRY_DSN=your_sentry_dsn
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript, Bull Queue, RabbitMQ, PostgreSQL, Baileys
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Infrastructure**: Docker, Docker Compose
- **Testing**: Jest
- **Monitoring**: Sentry
- **WhatsApp Integration**: Baileys library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.