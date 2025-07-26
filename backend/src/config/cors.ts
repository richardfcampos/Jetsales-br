import cors from 'cors';

// Parse CORS origins from environment variable
const parseCorsOrigins = (): string[] => {
  const corsOrigins = process.env.CORS_ORIGINS;
  
  if (!corsOrigins) {
    // Default origins for development
    return [
      'http://localhost:3001',
      'http://127.0.0.1:3001'
    ];
  }
  
  // Split by comma and trim whitespace
  return corsOrigins.split(',').map(origin => origin.trim());
};

const corsOptions = {
  origin: parseCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const corsMiddleware = cors(corsOptions); 