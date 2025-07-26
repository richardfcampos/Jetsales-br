# WhatsApp Message Sender - Frontend

A Next.js frontend application for sending WhatsApp messages via the backend API.

## Features

- Modern React interface with TypeScript
- Tailwind CSS for styling
- Form validation and error handling
- Real-time feedback for message sending
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose (for containerized setup)
- Backend server running on port 3000

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Docker Development

1. From the project root, start all services:
```bash
docker compose up
```

2. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Docker Production

1. From the project root, build and start production services:
```bash
docker compose -f docker-compose.prod.yml up --build
```

2. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

1. Enter a phone number in international format (e.g., +5511999999999)
2. Type your message
3. Click "Send Message"
4. The message will be queued and sent via WhatsApp

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/send-message` to queue WhatsApp messages.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- ESLint
