const express = require('express');
const rateLimit = require('express-rate-limit');
const messageRoutes = require('../routes/messageRoutes');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});
app.use(limiter);
app.use(express.json());

app.use(messageRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

module.exports = app; 